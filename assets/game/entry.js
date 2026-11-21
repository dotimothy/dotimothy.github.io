import { defaults, models, replyLimits, speechModel } from './chat-config.js';
import { deleteAllModels, deleteModel, downloadModel, isStorageQuotaError, modelInventory, withModelStorageLock, withModelStorageLocks } from './chat-storage.js';
import { setupChatVoice } from './chat-voice.js';
import { apiLabels, streamApiReply } from './chat-api.js';
import { setupBackendSettings } from './chat-backends.js';
import { hasRepeatedTail } from './chat-repetition.js';

const launch = document.querySelector('#chat-launch');
const chat = document.querySelector('#site-chat');
const cancelLoad = document.querySelector('#chat-cancel-load');
const log = chat.querySelector('.chat-log');
const status = chat.querySelector('.chat-status');
const metrics = chat.querySelector('.chat-metrics');
const ttft = document.querySelector('#chat-ttft');
const tps = document.querySelector('#chat-tps');
const generatedTokens = document.querySelector('#chat-token-count');
const form = chat.querySelector('.chat-form');
const input = form.elements.question;
const voice = setupChatVoice(chat, input);
const send = form.querySelector('[type="submit"]');
const scroll = chat.querySelector('.chat-scroll');
const welcome = chat.querySelector('.chat-welcome');
const headerModelStatus = document.querySelector('#chat-header-status strong');
const activeModelLabel = document.querySelector('#chat-model-in-use');
const operationViews = [...chat.querySelectorAll('.chat-operation')].map((view) => ({
  view,
  label: view.querySelector('p'),
  meter: view.querySelector('.chat-progress'),
}));
const storageStatus = document.querySelector('.chat-storage-status');
const settingsDialog = document.querySelector('#chat-settings');
const modelTable = settingsDialog.querySelector('.chat-model-table tbody');
const modelSearch = document.querySelector('#chat-model-search');
const clearSearch = document.querySelector('#chat-clear-search');
const emptyModels = document.querySelector('#chat-model-empty');
const cancelDownload = document.querySelector('#chat-cancel-download');
const cacheSummary = document.querySelector('#chat-cache-summary');
const cacheQuota = document.querySelector('#chat-cache-quota');
const cacheModels = { ...models, speech: speechModel };
const clearModelCache = document.querySelector('#chat-delete-all-models');
const temperature = document.querySelector('#chat-temperature');
const temperatureValue = document.querySelector('#chat-temperature-value');
const tokens = document.querySelector('#chat-tokens');
const context = document.querySelector('#chat-context');
const stop = document.querySelector('#chat-stop');
const clear = document.querySelector('#chat-clear');
const reset = document.querySelector('#chat-reset');
const settingsKey = 'timothydo-chat-settings';
let preferences = { ...defaults };


try {
  const saved = JSON.parse(localStorage.getItem(settingsKey));
  if (saved && Object.hasOwn(models, saved.model)) preferences.model = saved.model;
  if (saved && Number.isFinite(saved.temperature) && saved.temperature >= 0 && saved.temperature <= 1) {
    preferences.temperature = saved.temperature;
  }
  if (saved && replyLimits.includes(saved.tokens)) {
    // Older saves stored the 192-token default even when only other settings changed.
    const legacyDefault = saved.tokens === 192 && saved.replyLimitVersion === undefined;
    if (!legacyDefault) preferences.tokens = saved.tokens;
  }
  if (saved && typeof saved.context === 'boolean') preferences.context = saved.context;
} catch {
  // Settings remain available for this visit when storage is blocked.
}

const profile = document.querySelector('meta[name="description"]').content.split(' Explore ')[0]
  .replace(/^Timothy Do is /, 'I am ');
const hobbies = 'My hobbies include playing the euphonium, taking photographs, stargazing, visiting national parks, and tinkering with electronics in my homelab.';
const education = [...document.querySelector('#about .facts dd:last-child').childNodes]
  .filter((node) => node.nodeType === Node.TEXT_NODE)
  .map((node) => node.textContent.trim()).filter(Boolean).join(' and ');
const persona = [
  'Reply in the first person as Timothy Do, using “I” and “my”. Sound friendly, direct, and curious.',
  'The facts below are from the public portfolio. If they directly answer the question, repeat them in the first person. Use only details in the facts.',
  'If a fact is missing, say you haven’t shared it on the site. Keep the answer to one or two sentences.',
  'Use Markdown for useful formatting and LaTeX delimiters for math.',
].join(' ');
const background = [
  'My name is Timothy Do.',
  profile,
  `I earned these degrees: ${education}.`,
  hobbies,
].join(' ');
const sections = [...document.querySelectorAll(
  '#about .panel p, #about .skills, #experience .entry-main, #interests article, #contact .contact-note, #contact .links li'
)].map((element) => element.textContent.replace(/\s+/g, ' ').trim());

const facts = [
  ...sections,
  ...window.PROJECTS.map(({ title, year, blurb, tags }) => `${title} (${year}). ${blurb} Tools: ${tags.join(', ')}.`),
];

const history = [];
let worker;
let answer;
let pendingQuestion;
let inventory;
let downloadController;
let storageTarget;
let storageOperation = null;
let storageCheck = 0;
let state = 'idle';
let apiRequest;
const backendSettings = setupBackendSettings(settingsDialog, changeBackend);
let apiConnection = backendSettings.initial;
if (apiConnection) state = 'ready';

// Keep the site's keyboard navigation outside the chat dialog.
chat.addEventListener('keydown', (event) => event.stopPropagation());

function relevantFacts(question, previousQuestion = '') {
  if (/^(?:who are you|are you (?:really )?(?:timothy|an? ai|human|a (?:real )?person))\b/i.test(question.trim())) {
    return 'I’m Timothy Do’s AI persona, based on his public portfolio.';
  }
  if (/\b(?:hobbies|hobby|off the clock|outside (?:of )?work|spare time|free time|for fun)\b/i.test(question)) {
    return hobbies;
  }
  if (/\b(?:what did (?:you|he|timothy) study|education|degrees?)\b/i.test(question)) {
    return `I earned these degrees: ${education}.`;
  }
  if (/\b(where (?:does|do) .*work|current (?:job|role|employer)|(?:his|your|timothy['’]s) (?:job|role|employer))\b/i.test(question)) {
    return profile;
  }
  const words = new Set(question.toLowerCase().match(/[a-z0-9]+/g) ?? []);
  const common = new Set(['about', 'could', 'does', 'from', 'have', 'that', 'their', 'this', 'timothy', 'what', 'when', 'where', 'which', 'with', 'would']);
  const terms = [...words].filter((word) => word.length > 2 && !common.has(word));
  const previousTerms = previousQuestion.toLowerCase().match(/[a-z0-9]+/g) ?? [];
  const matches = facts.map((fact) => {
    const normalized = fact.toLowerCase();
    const score = terms.filter((term) => normalized.includes(term)).length;
    const contextScore = previousTerms.some((term) => term.length > 3 && !common.has(term) && normalized.includes(term));
    return { fact, score: score + (contextScore ? 0.5 : 0) };
  }).sort((first, second) => second.score - first.score)
    .slice(0, 4)
    .map(({ fact }) => fact.slice(0, 650));
  return matches.join('\n');
}

const modelRows = Object.entries(models).map(([key, model]) => {
  const row = modelTable.insertRow();
  row.dataset.model = key;
  const heading = document.createElement('th');
  heading.scope = 'row';
  heading.textContent = model.name;
  const detail = document.createElement('small');
  detail.textContent = `${model.label} · WebGPU`;
  heading.append(detail);
  row.append(heading);
  row.insertCell().textContent = model.download;
  const modelStatus = row.insertCell();
  const actions = row.insertCell();
  actions.className = 'chat-row-actions';
  const buttons = {};
  for (const [action, label] of Object.entries({
    download: 'Download', load: 'Load', temporary: 'Load Without Saving', unload: 'Unload', delete: 'Delete',
  })) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'chat-control';
    button.dataset.action = action;
    button.textContent = label;
    button.setAttribute('aria-label', `${label} ${model.name}`);
    if (action === 'temporary') button.title = 'Download into memory for this tab';
    buttons[action] = button;
    actions.append(button);
  }
  return { key, row, modelStatus, buttons, search: `${model.name} ${model.id} ${model.label} ${model.download} WebGPU ONNX ${model.dtype ?? 'q4'}`.toLowerCase() };
});

function filterModels() {
  const terms = modelSearch.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
  for (const { row, search } of modelRows) row.hidden = !terms.every((term) => search.includes(term));
  clearSearch.hidden = !terms.length;
  emptyModels.hidden = modelRows.some(({ row }) => !row.hidden);
}

function syncModelRows(busy) {
  for (const { key, row, modelStatus, buttons } of modelRows) {
    const saved = inventory?.[key];
    const active = !apiConnection && preferences.model === key && state !== 'idle';
    const working = storageOperation && storageTarget === key;
    let label = inventory ? 'Not downloaded' : 'Storage unknown';
    if (saved?.partial) label = saved.complete ? 'Downloaded' : 'Partial download';
    if (active) label = state === 'ready' || state === 'generating' ? 'Loaded on GPU' : state === 'loading' ? 'Loading' : 'Unloading';
    if (working) label = storageOperation === 'download' ? 'Downloading' : 'Deleting';
    modelStatus.textContent = label;
    row.dataset.active = active;
    buttons.download.hidden = saved?.complete === true || !inventory;
    const downloadLabel = saved?.partial ? 'Resume download' : 'Download';
    buttons.download.textContent = downloadLabel;
    buttons.download.setAttribute('aria-label', `${downloadLabel} ${models[key].name}`);
    buttons.load.hidden = !saved?.complete || active;
    buttons.temporary.hidden = saved?.complete === true || active;
    buttons.unload.hidden = !active;
    buttons.delete.hidden = !saved?.partial;
    for (const button of Object.values(buttons)) button.disabled = busy;
  }
  cancelDownload.hidden = !downloadController;
}

function syncControls() {
  const storage = inventory?.[preferences.model];
  const generating = state === 'generating';
  const transitioning = state === 'loading' || state === 'unloading';
  activeModelLabel.hidden = state === 'idle';
  activeModelLabel.textContent = apiConnection
    ? `${apiLabels[apiConnection.backend]} · ${apiConnection.model}`
    : models[preferences.model].name;
  headerModelStatus.textContent = {
    idle: storage?.complete ? 'Model Saved' : 'Model Idle',
    loading: 'Loading Model',
    ready: apiConnection ? 'API Selected' : 'Model Ready',
    generating: 'Generating',
    unloading: 'Unloading Model',
  }[state];
  if (storageOperation === 'download') headerModelStatus.textContent = `Downloading ${models[storageTarget].name}`;
  if (storageOperation === 'clear') headerModelStatus.textContent = 'Clearing Model Cache';
  if (storageOperation === 'delete') headerModelStatus.textContent = 'Deleting Model';
  chat.dataset.modelState = state;
  cancelLoad.hidden = state !== 'loading';
  stop.hidden = !generating;
  send.hidden = generating;
  send.disabled = transitioning || generating;
  input.readOnly = generating;
  voice.setBlocked(generating || storageOperation === 'clear');
  clear.disabled = generating || !log.hasChildNodes();
  const busy = transitioning || generating || Boolean(storageOperation);
  backendSettings.setBlocked(busy);
  syncModelRows(busy);
  clearModelCache.disabled = busy || !Object.values(inventory ?? {}).some(({ hasFiles }) => hasFiles);
  reset.disabled = busy;
}

let operationVersion = 0;
function showOperation(message = '', percent) {
  const version = ++operationVersion;
  for (const { view, label, meter } of operationViews) {
    view.hidden = !message;
    if (label.textContent !== message) label.textContent = message;
    if (percent === undefined) {
      meter.removeAttribute('aria-valuenow');
    } else {
      meter.setAttribute('aria-valuenow', percent);
      meter.style.setProperty('--progress', percent / 100);
    }
    meter.setAttribute('aria-valuetext', message);
  }
  return version;
}

function finishOperation(message) {
  const version = showOperation(message, 100);
  setTimeout(() => {
    if (operationVersion === version) showOperation();
  }, 380);
}

function syncSettings() {
  temperature.value = preferences.temperature;
  temperatureValue.value = preferences.temperature.toFixed(1);
  tokens.value = preferences.tokens;
  context.checked = preferences.context;
  syncControls();
}

function savePreferences(next) {
  const modelChanged = preferences.model !== next.model;
  preferences = next;
  if (modelChanged) {
    if (worker) unloadModel();
    refreshStorage();
  }
  syncSettings();
  try {
    localStorage.setItem(settingsKey, JSON.stringify({ ...preferences, replyLimitVersion: 1 }));
  } catch {
    // Settings still apply for this visit.
  }
}

let markdownRenderer;
function renderMessage(element, text) {
  if (!element || !text) return;
  markdownRenderer ??= import('./chat-markdown.js').then(({ renderChatMarkdown }) => renderChatMarkdown);
  markdownRenderer.then((render) => {
    if (!element.isConnected) return;
    const nearBottom = scroll.scrollHeight - scroll.scrollTop - scroll.clientHeight < 96;
    render(element, text);
    if (nearBottom) scroll.scrollTop = scroll.scrollHeight;
  }).catch((error) => {
    markdownRenderer = undefined;
    console.error('Unable to render chat formatting:', error);
  });
}

function addMessage(speaker, text = '') {
  const row = document.createElement('article');
  const label = document.createElement('strong');
  label.className = 'chat-speaker';
  const message = document.createTextNode(text);
  row.className = speaker === 'You' ? 'chat-message chat-message-user' : 'chat-message chat-message-ai';
  label.textContent = speaker;
  const content = document.createElement('div');
  content.className = 'chat-message-body';
  content.append(message);
  row.append(label, content);
  if (!text && speaker !== 'You') {
    row.dataset.pending = 'true';
    const thinking = document.createElement('span');
    thinking.className = 'chat-thinking';
    thinking.setAttribute('aria-hidden', 'true');
    thinking.textContent = 'Thinking';
    for (let index = 0; index < 3; index++) thinking.append(document.createElement('i'));
    row.append(thinking);
  }
  log.append(row);
  scroll.scrollTop = scroll.scrollHeight;
  renderMessage(content, text);
  return message;
}

function appendReply(text) {
  const nearBottom = scroll.scrollHeight - scroll.scrollTop - scroll.clientHeight < 64;
  if (text.trim()) delete answer.parentElement.parentElement.dataset.pending;
  answer.appendData(text);
  if (nearBottom) scroll.scrollTop = scroll.scrollHeight;
}

function updateMetrics(data) {
  if (Number.isFinite(data.tokenCount)) generatedTokens.textContent = data.tokenCount.toLocaleString();
  if (Number.isFinite(data.ttft) && ttft.textContent === '—') {
    ttft.textContent = data.ttft < 1000 ? `${Math.round(data.ttft)} ms` : `${(data.ttft / 1000).toFixed(2)} s`;
  }
  if (Number.isFinite(data.tps)) {
    const rate = `${data.tps.toFixed(1)} tok/s`;
    if (tps.textContent !== rate) tps.textContent = rate;
  }
}

function finishAnswer(text, message) {
  const focusComposer = chat.open && !settingsDialog.open && document.activeElement === stop;
  answer.data = text;
  const content = answer.parentElement;
  delete content.parentElement.dataset.pending;
  renderMessage(content, text);
  voice.addReadButton(content.parentElement, text, content);
  scroll.scrollTop = scroll.scrollHeight;
  state = 'ready';
  status.textContent = message;
  syncControls();
  if (focusComposer) input.focus();
}

function rememberTurn(question, reply) {
  history.push({ role: 'user', content: question }, { role: 'assistant', content: reply });
  if (history.length > 4) history.splice(0, 2);
}

function releaseModel(message = '') {
  worker?.terminate();
  worker = undefined;
  if (state === 'generating') {
    finishAnswer(answer.data || 'Generation ended before a reply was available.', message);
  }
  state = 'idle';
  status.textContent = message;
  showOperation();
  syncControls();
}

async function changeBackend(connection) {
  if (state === 'generating' || state === 'loading' || state === 'unloading' || storageOperation) {
    throw new Error('Finish the current model operation before switching backends.');
  }
  if (!connection && !apiConnection) return;
  if (worker) await unloadModel();
  if (apiConnection?.backend !== connection?.backend || apiConnection?.baseUrl !== connection?.baseUrl ||
      apiConnection?.model !== connection?.model) history.length = 0;
  apiConnection = connection;
  state = connection ? 'ready' : 'idle';
  metrics.hidden = true;
  status.textContent = connection ? `${apiLabels[connection.backend]} Selected` : 'Load a Local Model in Settings.';
  syncControls();
}

async function generateApiReply(connection, messages) {
  const request = new AbortController();
  apiRequest = request;
  let repetitive = false;
  try {
    await streamApiReply(connection, messages, {
      signal: request.signal,
      tokens: preferences.tokens,
      temperature: preferences.temperature,
      onMetrics: updateMetrics,
      onText(text) {
        appendReply(text);
        const words = answer.data.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? [];
        if (hasRepeatedTail(words)) {
          repetitive = true;
          request.abort();
        }
      },
    });
    const text = answer.data.trim();
    if (text) rememberTurn(pendingQuestion, text);
    finishAnswer(text || 'The API returned no reply text.', 'Reply ready.');
  } catch (error) {
    if (request.signal.aborted) {
      finishAnswer(answer.data.trim() || 'Generation stopped.', repetitive ? 'Stopped Repetitive Output.' : 'Generation stopped');
    } else {
      finishAnswer(answer.data.trim() || 'I couldn’t finish that reply.', error.message);
    }
  } finally {
    apiRequest = undefined;
  }
}

async function unloadModel() {
  const activeWorker = worker;
  if (!activeWorker) return;
  state = 'unloading';
  status.textContent = 'Unloading model…';
  showOperation('Releasing GPU resources…');
  syncControls();
  await new Promise((resolve) => {
    const finish = () => {
      clearTimeout(timeout);
      activeWorker.removeEventListener('message', onMessage);
      activeWorker.removeEventListener('error', finish);
      resolve();
    };
    const onMessage = ({ data }) => {
      if (data.type === 'unloaded' || data.type === 'error') finish();
    };
    const timeout = setTimeout(finish, 5000);
    activeWorker.addEventListener('message', onMessage);
    activeWorker.addEventListener('error', finish);
    activeWorker.postMessage({ type: 'unload' });
  });
  releaseModel('Model unloaded');
  if (!storageOperation) {
    finishOperation('Model Unloaded');
    refreshStorage('Model unloaded. Downloaded files are still available.');
  }
}

async function refreshStorage(message) {
  const check = ++storageCheck;
  storageStatus.textContent = 'Checking browser storage…';
  try {
    const result = await modelInventory(cacheModels);
    if (check !== storageCheck) return;
    inventory = result;
    const saved = modelRows.filter(({ key }) => inventory[key].complete).length;
    const estimate = await navigator.storage?.estimate?.().catch(() => undefined);
    if (check !== storageCheck) return;
    cacheQuota.textContent = estimate?.quota
      ? `Site Storage: ${(estimate.usage / 1e6).toFixed(0)} MB Used of ${(estimate.quota / 1e6).toFixed(0)} MB`
      : '';
    const modelFiles = Object.values(inventory).filter(({ hasFiles }) => hasFiles).length;
    const weightBytes = Object.values(inventory).reduce((sum, { savedBytes }) => sum + savedBytes, 0);
    cacheSummary.textContent = modelFiles
      ? `Saved files for ${modelFiles} ${modelFiles === 1 ? 'model' : 'models'}${weightBytes ? ` · ${(weightBytes / 1e6).toFixed(0)} MB of weights` : ''}`
      : 'No Model Files Saved';
    storageStatus.textContent = message || `${saved} of ${modelRows.length} models downloaded to this browser.`;
  } catch {
    if (check !== storageCheck) return;
    inventory = undefined;
    cacheSummary.textContent = 'Browser Storage Unavailable';
    cacheQuota.textContent = '';
    storageStatus.textContent = 'Browser storage is unavailable. Use Load Without Saving to load a model for this tab.';
  }
  syncControls();
}

async function changeStorage(operation, key) {
  const model = models[key];
  const controller = operation === 'download' ? new AbortController() : undefined;
  downloadController = controller;
  cancelDownload.disabled = false;
  storageTarget = key;
  ++storageCheck;
  storageOperation = operation;
  showOperation(operation === 'download' ? `${model.name} · Preparing Download…` : 'Preparing to Delete Model Files…');
  syncControls();
  let message;
  try {
    if (operation === 'clear') {
      voice.reset(true);
      await withModelStorageLocks(cacheModels, async () => {
        if (worker) await unloadModel();
        showOperation('Deleting All Saved Chat Models…');
        await deleteAllModels(cacheModels);
        message = 'All Saved Chat Models Deleted.';
      });
    } else await withModelStorageLock(model, async () => {
      if (operation === 'download') {
        await downloadModel(model, ({ file, total, received, bytes, attempt }) => {
          const label = attempt > 1 ? `${model.name} · Retry ${attempt - 1}/2` : model.name;
          if (bytes) {
            const percent = Math.min(100, Math.floor(received / bytes * 100));
            const progress = percent === 100 ? 'Saving Model Files…' :
              `Downloading Weights · ${(received / 1e6).toFixed(0)} / ${(bytes / 1e6).toFixed(0)} MB · ${percent}%`;
            showOperation(`${label} · ${progress}`, percent);
          } else {
            showOperation(`${label} · Downloading File ${file} of ${total}…`);
          }
        }, controller.signal);
        message = 'Download complete. Choose Load model to start chatting.';
      } else {
        if (worker && preferences.model === key) await unloadModel();
        showOperation('Deleting downloaded files…');
        await deleteModel(model);
        message = 'Model deleted from browser storage.';
      }
    }, controller?.signal);
  } catch (error) {
    if (controller?.signal.aborted) {
      message = 'Download canceled. Saved files can be resumed.';
    } else {
      console.error(error);
      message = operation === 'download'
        ? isStorageQuotaError(error)
          ? `${model.name}: Browser storage is full. Free space in Model Cache or select Load Without Saving for this model.`
          : `${model.name}: ${error.retryable === undefined ? 'Browser storage or the download failed.' : error.message} Try Resume Download or Load Without Saving.`
        : 'Couldn’t Delete Model Files. Try Again.';
    }
  } finally {
    downloadController = undefined;
    await refreshStorage(message);
    showOperation();
    storageOperation = null;
    syncControls();
  }
}

function startModel(temporary = false) {
  const modelName = models[preferences.model].name;
  let loadProgress = 0;
  const showLoadProgress = (label, percent) => {
    loadProgress = Math.max(loadProgress, percent);
    showOperation(`${modelName} · ${label}`, loadProgress);
  };
  state = 'loading';
  status.textContent = 'Preparing the Local Model…';
  showLoadProgress('Preparing to Load…', 0);
  let currentWorker;
  try {
    currentWorker = new Worker(new URL('./chat-worker.js', import.meta.url), { type: 'module' });
  } catch {
    releaseModel('Couldn’t start the local model. Try again.');
    return;
  }
  worker = currentWorker;
  syncControls();
  currentWorker.addEventListener('error', () => {
    if (worker === currentWorker && state !== 'unloading') releaseModel('The local model stopped. Try loading it again.');
  });
  currentWorker.addEventListener('message', ({ data }) => {
    if (worker !== currentWorker) return;
    switch (data.type) {
      case 'initialized':
        currentWorker.postMessage({ type: 'load', model: preferences.model, temporary });
        break;
      case 'load-progress': {
        const percent = Math.min(100, Math.max(0, data.percent));
        const action = temporary ? 'Downloading for This Tab' : 'Reading Saved Model Files';
        headerModelStatus.textContent = temporary ? 'Downloading Model' : 'Loading Model';
        showLoadProgress(`Step 3 of 4 · ${action} · ${percent}%`, 50 + percent / 4);
        break;
      }
      case 'model-phase':
        headerModelStatus.textContent = 'Loading Model';
        showLoadProgress(`Step ${data.step} of 4 · ${data.label}`, (data.step - 1) * 25);
        status.textContent = data.label;
        break;
      case 'gpu-unavailable':
        releaseModel('WebGPU is unavailable. Open the chat in a WebGPU-enabled browser with hardware acceleration.');
        break;
      case 'gpu-feature-unavailable':
        releaseModel('This model requires WebGPU shader-f16 support. Try Qwen or SmolLM2 on this device.');
        break;
      case 'ready': {
        const focusComposer = chat.open && document.activeElement === cancelLoad;
        state = 'ready';
        finishOperation(`${modelName} · Model Ready`);
        status.textContent = 'Model Ready';
        storageStatus.textContent = temporary ? 'Model loaded for this tab.' : 'Model loaded and ready.';
        syncControls();
        if (focusComposer) input.focus();
        break;
      }
      case 'token':
        appendReply(data.text);
        break;
      case 'metrics':
        updateMetrics(data);
        break;
      case 'answer':
        if (data.text && !data.stopped) rememberTurn(pendingQuestion, data.text);
        if (data.repetitive) {
          finishAnswer(data.text || 'Generation stopped after the model started repeating itself.', 'Stopped Repetitive Output.');
          break;
        }
        finishAnswer(
          data.text || (data.stopped ? 'Generation stopped.' : 'I couldn’t find an answer on the site.'),
          data.stopped ? 'Generation stopped' : 'Reply ready.',
        );
        break;
      case 'error':
        if (state === 'unloading') break;
        if (state === 'loading') {
          if (temporary) {
            releaseModel('Couldn’t load the model. Check your connection and try again.');
            break;
          }
          releaseModel('Couldn’t load the saved model. Check model storage and try again.');
          refreshStorage('Couldn’t load this model. If the saved files are damaged, delete and download it again.');
        } else {
          finishAnswer('I couldn’t finish that reply. Please try again.', 'Generation failed');
        }
        break;
    }
  });
}

const dockedChat = matchMedia('(min-width: 1100px)');
const fullscreenButton = document.querySelector('#chat-fullscreen');
let expandedChat = false;
let ownsFullscreen = false;

function showChat() {
  chat.classList.remove('is-collapsing');
  if (dockedChat.matches && !expandedChat) chat.show();
  else chat.showModal();
}

async function collapseChat() {
  if (!chat.open || chat.classList.contains('is-collapsing')) return;
  chat.classList.add('is-collapsing');
  voice.reset();
  if (typeof chat.getAnimations === 'function') {
    await Promise.allSettled(chat.getAnimations().map((animation) => animation.finished));
  }
  if (chat.open) chat.close();
}

if (typeof chat.showModal === 'function' && typeof Worker === 'function') {
  launch.hidden = false;
  launch.addEventListener('click', () => {
    showChat();
    if (!storageOperation) refreshStorage();
  });
}
function updateChatLayout() {
  if (!chat.open || chat.classList.contains('is-collapsing')) return;
  const needsModal = !dockedChat.matches || expandedChat;
  if (chat.matches(':modal') === needsModal) return;
  const settingsOpen = settingsDialog.open;
  const focus = document.activeElement;
  if (settingsOpen) settingsDialog.close();
  chat.close();
  showChat();
  if (settingsOpen) settingsDialog.showModal();
  if (chat.contains(focus)) focus.focus({ preventScroll: true });
}

function setChatExpanded(expanded) {
  expandedChat = expanded;
  const label = expanded ? 'Exit Full Screen' : 'Enter Full Screen';
  fullscreenButton.setAttribute('aria-pressed', String(expanded));
  fullscreenButton.setAttribute('aria-label', label);
  fullscreenButton.title = label;
  updateChatLayout();
}

function leaveBrowserFullscreen() {
  if (!ownsFullscreen) return;
  ownsFullscreen = false;
  if (document.fullscreenElement === document.documentElement) {
    document.exitFullscreen().catch(() => {});
  }
}

fullscreenButton.addEventListener('click', async () => {
  if (expandedChat) {
    setChatExpanded(false);
    leaveBrowserFullscreen();
    return;
  }
  if (document.fullscreenEnabled && !document.fullscreenElement) {
    fullscreenButton.disabled = true;
    try {
      await document.documentElement.requestFullscreen();
      ownsFullscreen = true;
    } catch {
      // The chat can still expand to the viewport when browser fullscreen is blocked.
    } finally {
      fullscreenButton.disabled = false;
    }
  }
  if (chat.open && !chat.classList.contains('is-collapsing')) {
    setChatExpanded(true);
    fullscreenButton.focus({ preventScroll: true });
  } else {
    leaveBrowserFullscreen();
  }
});
dockedChat.addEventListener('change', updateChatLayout);
document.addEventListener('fullscreenchange', () => {
  if (ownsFullscreen && !document.fullscreenElement) {
    ownsFullscreen = false;
    setChatExpanded(false);
  }
});
chat.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !event.defaultPrevented && !chat.matches(':modal') && !settingsDialog.open) {
    event.preventDefault();
    collapseChat();
  }
});
chat.addEventListener('cancel', (event) => {
  if (event.target !== chat) return;
  event.preventDefault();
  if (expandedChat) {
    setChatExpanded(false);
    leaveBrowserFullscreen();
  } else {
    collapseChat();
  }
});
document.querySelector('#chat-collapse').addEventListener('click', collapseChat);
document.querySelector('#chat-exit').addEventListener('click', collapseChat);
chat.addEventListener('close', () => {
  if (chat.open) return;
  setChatExpanded(false);
  leaveBrowserFullscreen();
  if (document.activeElement === document.body || chat.contains(document.activeElement)) launch.focus({ preventScroll: true });
});
function openModelSettings() {
  settingsDialog.showModal();
  if (!storageOperation) refreshStorage();
}

document.querySelector('#chat-settings-open').addEventListener('click', openModelSettings);
cancelLoad.addEventListener('click', () => releaseModel('Model load canceled'));
modelSearch.addEventListener('input', filterModels);
clearSearch.addEventListener('click', () => {
  modelSearch.value = '';
  filterModels();
  modelSearch.focus();
});
cancelDownload.addEventListener('click', () => {
  cancelDownload.disabled = true;
  downloadController?.abort();
});
clearModelCache.addEventListener('click', () => {
  if (window.confirm('Delete all saved chat models from this browser?')) changeStorage('clear');
});
modelTable.addEventListener('click', async (event) => {
  const button = event.target.closest('button[data-action]');
  if (!button || button.disabled) return;
  const { action } = button.dataset;
  const key = button.closest('tr').dataset.model;
  if (action === 'download' || action === 'delete') {
    changeStorage(action, key);
  } else if (action === 'unload') {
    unloadModel();
  } else {
    if (worker) await unloadModel();
    if (apiConnection) {
      apiConnection = null;
      history.length = 0;
      backendSettings.useWebGPU();
    }
    savePreferences({ ...preferences, model: key });
    if (settingsDialog.open) settingsDialog.close();
    startModel(action === 'temporary');
  }
});
stop.addEventListener('click', () => {
  stop.disabled = true;
  status.textContent = 'Stopping generation…';
  if (apiRequest) apiRequest.abort();
  else worker?.postMessage({ type: 'stop' });
});
clear.addEventListener('click', () => {
  voice.reset();
  history.length = 0;
  log.replaceChildren();
  metrics.hidden = true;
  welcome.hidden = false;
  input.value = '';
  if (state !== 'loading') status.textContent = state === 'ready' ? 'Model Ready' : 'Conversation Cleared';
  syncControls();
});
reset.addEventListener('click', () => savePreferences({ ...defaults }));
temperature.addEventListener('input', () => savePreferences({ ...preferences, temperature: Number(temperature.value) }));
tokens.addEventListener('change', () => savePreferences({ ...preferences, tokens: Number(tokens.value) }));
context.addEventListener('change', () => savePreferences({ ...preferences, context: context.checked }));
chat.querySelectorAll('.chat-suggestions button').forEach((button) => {
  button.addEventListener('click', () => {
    input.value = button.textContent.trim();
    if (state === 'ready') {
      form.requestSubmit();
      return;
    }
    input.focus();
    if (state === 'idle') form.requestSubmit();
  });
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const question = input.value.trim();
  if (state === 'idle') {
    status.textContent = 'Load a Model in Settings First.';
    return;
  }
  if (state !== 'ready' || (!worker && !apiConnection)) return;
  if (!question) {
    status.textContent = 'Enter a Question.';
    input.focus();
    return;
  }
  pendingQuestion = question;
  welcome.hidden = true;
  addMessage('You', question);
  answer = addMessage('Timothy · AI');
  input.value = '';
  state = 'generating';
  ttft.textContent = tps.textContent = '—';
  generatedTokens.textContent = apiConnection ? '—' : '0';
  metrics.hidden = false;
  stop.disabled = false;
  status.textContent = apiConnection ? `Waiting for ${apiLabels[apiConnection.backend]}…` : 'Generating locally…';
  syncControls();
  const contextTurns = preferences.context ? history : [];
  const messages = [
    {
      role: 'system',
      content: `${persona}\n\nAbout Timothy:\n${background}\n\nPortfolio facts for this question:\n${relevantFacts(question, contextTurns.at(-2)?.content)}`,
    },
    ...contextTurns,
    { role: 'user', content: question },
  ];
  if (apiConnection) generateApiReply(apiConnection, messages);
  else worker.postMessage({ type: 'ask', tokens: preferences.tokens, temperature: preferences.temperature, messages });
});

syncSettings();
refreshStorage();
