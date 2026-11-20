export const apiLabels = {
  ollama: 'Ollama API',
  openai: 'OpenAI-Compatible API',
};

export function apiBaseUrl(backend, value) {
  let url;
  try {
    url = new URL(value.trim());
  } catch {
    throw new Error('Enter a full API URL starting with http:// or https://.');
  }
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.search || url.hash) {
    throw new Error('Use an HTTP or HTTPS base URL without credentials, a query, or a fragment.');
  }
  let path = url.pathname.replace(/\/+$/, '');
  if (backend === 'ollama') path = path.replace(/\/api(?:\/(?:chat|tags))?$/, '');
  else path = path.replace(/\/(?:chat\/completions|models)$/, '') || '/v1';
  return url.origin + path;
}

async function request(config, path, { signal, body } = {}) {
  const headers = {};
  if (config.key) headers.Authorization = `Bearer ${config.key}`;
  if (body) headers['Content-Type'] = 'application/json';
  try {
    return await fetch(config.baseUrl + path, {
      method: body ? 'POST' : 'GET',
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal,
      credentials: 'omit',
      redirect: 'error',
      cache: 'no-store',
    });
  } catch (error) {
    signal?.throwIfAborted();
    throw new Error('Couldn’t reach the API. Check the URL, server, and browser CORS settings.', { cause: error });
  }
}

function httpError(status) {
  if (status === 401 || status === 403) return new Error(`API access denied (HTTP ${status}). Check the key and permissions.`);
  if (status === 404) return new Error('API route or model not found (HTTP 404). Check the base URL and model ID.');
  return new Error(`The API returned HTTP ${status}.`);
}

export async function listApiModels(config, signal) {
  const ollama = config.backend === 'ollama';
  const response = await request(config, ollama ? '/api/tags' : '/models', { signal });
  if (!response.ok) throw httpError(response.status);
  const data = await response.json();
  const entries = ollama ? data.models : data.data;
  if (!Array.isArray(entries)) throw new Error('The API did not return a model list.');
  return [...new Set(entries.map((model) => ollama ? (model?.name || model?.model) : model?.id)
    .filter((name) => typeof name === 'string' && name))].sort();
}

async function* readLines(body) {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  try {
    while (true) {
      const { done, value } = await reader.read();
      buffer += decoder.decode(value, { stream: !done });
      let newline;
      while ((newline = buffer.indexOf('\n')) !== -1) {
        const line = buffer.slice(0, newline).replace(/\r$/, '');
        buffer = buffer.slice(newline + 1);
        yield line;
      }
      if (done) break;
    }
    if (buffer) yield buffer;
  } finally {
    await reader.cancel().catch(() => {});
    reader.releaseLock();
  }
}

async function* replyEvents(response, ollama) {
  if (!response.body || response.headers.get('content-type')?.includes('application/json')) {
    yield await response.json();
    return;
  }

  let sse = [];
  for await (const line of readLines(response.body)) {
    if (ollama) {
      if (line.trim()) yield JSON.parse(line);
    } else if (line.startsWith('data:')) {
      sse.push(line.slice(5).trimStart());
    } else if (!line && sse.length) {
      const event = sse.join('\n');
      if (event === '[DONE]') return;
      yield JSON.parse(event);
      sse = [];
    }
  }
  const tail = sse.join('\n');
  if (tail && tail !== '[DONE]') yield JSON.parse(tail);
}

export async function streamApiReply(config, messages, { signal, tokens, temperature, onText, onMetrics }) {
  const ollama = config.backend === 'ollama';
  const path = ollama ? '/api/chat' : '/chat/completions';
  const body = { model: config.model, messages, stream: true };
  if (ollama) body.options = { num_predict: tokens, temperature };
  else Object.assign(body, { max_tokens: tokens, temperature, stream_options: { include_usage: true } });

  const started = performance.now();
  let response = await request(config, path, { body, signal });
  for (let retries = 0; !ollama && response.status === 400 && retries < 3; retries++) {
    const error = await response.json().catch(() => null);
    const reason = error?.error?.message ?? '';
    const parameter = error?.error?.param;
    if (body.stream_options && (parameter === 'stream_options' || /stream_options/.test(reason))) delete body.stream_options;
    else if (body.max_tokens && (parameter === 'max_tokens' || /max_completion_tokens/.test(reason))) {
      body.max_completion_tokens = body.max_tokens;
      delete body.max_tokens;
    } else if ('temperature' in body && (parameter === 'temperature' || /temperature.*(unsupported|not support)/i.test(reason))) {
      delete body.temperature;
    } else break;
    response = await request(config, path, { body, signal });
  }
  if (!response.ok) throw httpError(response.status);

  let firstToken;
  for await (const event of replyEvents(response, ollama)) {
    if (event.error) throw new Error('The API reported an error while generating a reply.');
    const text = ollama ? event.message?.content : (event.choices?.[0]?.delta?.content ?? event.choices?.[0]?.message?.content);
    if (typeof text === 'string' && text) {
      firstToken ??= performance.now();
      onText(text);
      onMetrics({ ttft: firstToken - started });
    }
    const count = ollama ? event.eval_count : event.usage?.completion_tokens;
    if (Number.isFinite(count)) {
      const elapsed = ollama && event.eval_duration > 0 ? event.eval_duration / 1e9 :
        firstToken === undefined ? 0 : (performance.now() - firstToken) / 1000;
      onMetrics({ tokenCount: count, tps: elapsed > 0 ? count / elapsed : null });
    }
    signal.throwIfAborted();
    if (ollama && event.done) break;
  }
}
