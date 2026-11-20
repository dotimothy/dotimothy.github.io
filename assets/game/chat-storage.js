const cacheName = 'transformers-cache';
const metadataFiles = ['config.json', 'generation_config.json', 'tokenizer.json', 'tokenizer_config.json'];

function modelFileUrl({ id, revision }, name) {
  return `https://huggingface.co/${id}/resolve/${revision}/${name}`;
}

function belongsToModel(url, model) {
  return url.startsWith(`https://huggingface.co/${model.id}/resolve/`);
}

function filesFor(model) {
  const weights = model.weights ?? { 'onnx/model_q4.onnx': model.weightBytes };
  return [...(model.metadata ?? metadataFiles).map((name) => [name, 0]), ...Object.entries(weights)].map(([name, bytes]) => ({
    url: modelFileUrl(model, name), bytes,
  }));
}

export async function readModelJson(model, name, temporary) {
  const url = modelFileUrl(model, name);
  const response = temporary ? await fetch(url) : await (await caches.open(cacheName)).match(url);
  if (!response?.ok) throw new Error(`Couldn’t read model file ${name}.`);
  return response.json();
}

export async function modelInventory(models) {
  const requests = await caches.keys().then((names) =>
    names.includes(cacheName) ? caches.open(cacheName).then((cache) => cache.keys()) : [],
  );
  const stored = new Set(requests.map((request) => request.url));
  return Object.fromEntries(Object.entries(models).map(([key, model]) => {
    const files = filesFor(model);
    return [key, {
      complete: files.every(({ url }) => stored.has(url)),
      partial: files.some(({ url }) => stored.has(url)),
      hasFiles: requests.some(({ url }) => belongsToModel(url, model)),
      savedBytes: files.reduce((total, { url, bytes }) => total + (stored.has(url) ? bytes : 0), 0),
    }];
  }));
}

class DownloadError extends Error {
  constructor(message, retryable = true, options) {
    super(message, options);
    this.retryable = retryable;
  }
}

export function isStorageQuotaError(error) {
  return error?.name === 'QuotaExceededError' || error?.cause?.name === 'QuotaExceededError';
}

async function saveModelFile(cache, url, bytes, onBytes, signal) {
  const response = await fetch(url, { cache: 'no-store', signal }).catch((error) => {
    throw new DownloadError('The model server could not be reached.', true, { cause: error });
  });
  if (response.status !== 200) {
    const retryable = response.status >= 500 || [206, 408, 429].includes(response.status);
    throw new DownloadError(`The model server returned HTTP ${response.status}.`, retryable);
  }

  let data = response;
  let received = 0;
  let incomplete = false;
  let lastUpdate = -Infinity;
  if (bytes && response.body) {
    const body = response.body.pipeThrough(new TransformStream({
      transform(chunk, controller) {
        received += chunk.byteLength;
        const now = performance.now();
        if (now - lastUpdate >= 150 || received >= bytes) {
          onBytes(received);
          lastUpdate = now;
        }
        controller.enqueue(chunk);
      },
      flush() {
        incomplete = received !== bytes;
        if (incomplete) throw new Error('Incomplete model weights.');
      },
    }));
    data = new Response(body, {
      headers: { 'Content-Type': 'application/octet-stream', 'Content-Length': String(bytes) },
    });
  }
  try {
    await cache.put(url, data);
  } catch (error) {
    if (isStorageQuotaError(error)) {
      throw new DownloadError('Browser storage is full.', false, { cause: error });
    }
    if (incomplete || (error.name === 'TypeError' && bytes && received < bytes)) {
      throw new DownloadError('The model transfer stopped before all bytes arrived.', true, { cause: error });
    }
    throw new DownloadError('The browser could not save the model file.', false, { cause: error });
  }
}

export async function downloadModel(model, onProgress, signal) {
  const cache = await caches.open(cacheName);
  const stored = new Set((await cache.keys()).map((request) => request.url));
  const files = filesFor(model);
  const totalBytes = files.reduce((sum, file) => sum + file.bytes, 0);
  let completed = files.reduce((sum, file) => sum + (stored.has(file.url) ? file.bytes : 0), 0);
  for (const [index, { url, bytes }] of files.entries()) {
    signal.throwIfAborted();
    if (stored.has(url)) continue;
    const maxAttempts = 3;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      signal.throwIfAborted();
      onProgress({
        file: index + 1, total: files.length, received: completed,
        bytes: bytes ? totalBytes : undefined, attempt,
      });
      try {
        await saveModelFile(cache, url, bytes, (received) => {
          onProgress({ received: completed + received, bytes: totalBytes, attempt });
        }, signal);
        break;
      } catch (error) {
        signal.throwIfAborted();
        if (!error.retryable || attempt === maxAttempts) throw error;
        await new Promise((resolve) => setTimeout(resolve, attempt * 350));
      }
    }
    completed += bytes;
  }
}

export async function deleteModel(model) {
  const cache = await caches.open(cacheName);
  await Promise.all(filesFor(model).map(({ url }) => cache.delete(url)));
}

export async function deleteAllModels(models) {
  const presets = Object.values(models);
  const cache = await caches.open(cacheName);
  const requests = await cache.keys();
  await Promise.all(requests.filter(({ url }) => presets.some((model) => belongsToModel(url, model)))
    .map((request) => cache.delete(request)));
}

export async function withModelStorageLocks(models, task) {
  const presets = Object.values(models).sort((first, second) => first.id.localeCompare(second.id));
  const lockedTask = presets.reduceRight((next, model) => () => withModelStorageLock(model, next), task);
  return lockedTask();
}

export function withModelStorageLock(model, task, signal) {
  return navigator.locks ? navigator.locks.request(model.id, { signal }, task) : task();
}
