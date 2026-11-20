import { apiBaseUrl, apiLabels, listApiModels } from './chat-api.js';

const preferenceKey = 'timothydo-api-backend';

function savedConnection() {
  try {
    const saved = JSON.parse(localStorage.getItem(preferenceKey));
    if (saved && Object.hasOwn(apiLabels, saved.backend) && typeof saved.model === 'string' && saved.model.trim()) {
      return { backend: saved.backend, baseUrl: apiBaseUrl(saved.backend, saved.baseUrl), model: saved.model.trim(), key: '' };
    }
  } catch {
    // A saved API configuration is optional.
  }
  return null;
}

export function setupBackendSettings(dialog, applyConnection) {
  const form = dialog.querySelector('#chat-backend-form');
  const select = dialog.querySelector('#chat-backend');
  const fields = dialog.querySelector('#chat-api-fields');
  const base = dialog.querySelector('#chat-api-url');
  const model = dialog.querySelector('#chat-api-model');
  const key = dialog.querySelector('#chat-api-key');
  const models = dialog.querySelector('#chat-api-models');
  const hint = dialog.querySelector('#chat-api-hint');
  const status = dialog.querySelector('#chat-backend-status');
  const list = dialog.querySelector('#chat-list-models');
  const apply = dialog.querySelector('#chat-apply-backend');
  const connections = {};
  let active = savedConnection();
  let lookup;
  let blocked = false;
  let applying = false;
  if (active) connections[active.backend] = active;

  function syncButtons() {
    select.disabled = apply.disabled = blocked || applying;
    list.disabled = blocked || applying || Boolean(lookup);
  }

  function cancelLookup() {
    lookup?.abort();
    lookup = undefined;
    models.replaceChildren();
    syncButtons();
  }

  function showDraft(backend) {
    cancelLookup();
    select.value = backend;
    fields.hidden = list.hidden = backend === 'webgpu';
    if (fields.hidden) return;
    const draft = connections[backend];
    base.value = draft?.baseUrl ?? (backend === 'ollama' ? 'http://localhost:11434' : '');
    base.placeholder = backend === 'ollama' ? 'http://localhost:11434' : 'https://your-api.example/v1';
    model.value = draft?.model ?? '';
    model.placeholder = backend === 'ollama' ? 'gemma4:e2b' : 'Enter a model ID';
    key.value = draft?.key ?? '';
    hint.textContent = backend === 'ollama'
      ? `For local Ollama, allow ${location.origin} in OLLAMA_ORIGINS.`
      : 'Use the base URL of a Chat Completions API that accepts requests from this site.';
  }

  function save(connection) {
    active = connection;
    if (connection) connections[connection.backend] = connection;
    try {
      if (!connection) localStorage.removeItem(preferenceKey);
      else {
        const { backend, baseUrl, model } = connection;
        localStorage.setItem(preferenceKey, JSON.stringify({ backend, baseUrl, model }));
      }
    } catch {
      // API settings still work for this tab.
    }
  }

  function readDraft() {
    const backend = select.value;
    return {
      backend,
      baseUrl: apiBaseUrl(backend, base.value),
      model: model.value.trim(),
      key: key.value.trim(),
    };
  }

  select.addEventListener('change', () => {
    showDraft(select.value);
    status.textContent = '';
  });
  base.addEventListener('input', () => {
    cancelLookup();
    const previous = connections[select.value];
    if (!previous?.key || key.value !== previous.key) return;
    try {
      const origin = new URL(apiBaseUrl(select.value, base.value)).origin;
      if (origin === new URL(previous.baseUrl).origin) return;
    } catch {
      // An incomplete URL cannot be matched to the previous endpoint.
    }
    key.value = '';
  });
  key.addEventListener('input', cancelLookup);

  list.addEventListener('click', async () => {
    let draft;
    try {
      draft = readDraft();
    } catch (error) {
      status.textContent = error.message;
      return;
    }
    const request = new AbortController();
    lookup = request;
    syncButtons();
    status.textContent = 'Checking Available Models…';
    const timeout = setTimeout(() => request.abort(new Error('The API model list timed out.')), 15000);
    try {
      const names = await listApiModels(draft, request.signal);
      if (lookup !== request) return;
      models.replaceChildren(...names.map((name) => new Option(name)));
      if (!model.value && names.length === 1) model.value = names[0];
      status.textContent = names.length
        ? `${names.length} ${names.length === 1 ? 'model' : 'models'} found. Select or type a model ID.`
        : 'No models were returned. You can enter a model ID manually.';
    } catch (error) {
      if (lookup === request) status.textContent = error.message;
    } finally {
      clearTimeout(timeout);
      if (lookup === request) {
        lookup = undefined;
        syncButtons();
      }
    }
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (blocked || applying) return;
    let connection = null;
    if (select.value !== 'webgpu') {
      try {
        connection = readDraft();
        if (!connection.model) throw new Error('Enter or select an API model ID.');
      } catch (error) {
        status.textContent = error.message;
        return;
      }
    }
    applying = true;
    syncButtons();
    try {
      await applyConnection(connection);
      save(connection);
      status.textContent = connection
        ? `Using ${apiLabels[connection.backend]} · ${connection.model}`
        : 'Using WebGPU. Select a Local Model to Start.';
    } catch (error) {
      status.textContent = error.message;
    } finally {
      applying = false;
      syncButtons();
    }
  });

  showDraft(active?.backend ?? 'webgpu');
  return {
    initial: active,
    setBlocked(value) {
      blocked = value;
      syncButtons();
    },
    useWebGPU() {
      save(null);
      showDraft('webgpu');
      status.textContent = '';
    },
  };
}
