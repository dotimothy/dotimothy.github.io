import { env, pipeline } from 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.8.1';
import { speechModel } from './chat-config.js';
import { withModelStorageLock } from './chat-storage.js';

let transcriber;
env.allowLocalModels = false;
env.backends.onnx.wasm.numThreads = 1;

async function loadTranscriber() {
  self.postMessage({ type: 'status', text: 'Preparing Whisper Speech Recognition…' });
  try {
    await caches.keys();
  } catch {
    env.useBrowserCache = false;
  }
  const bytesByFile = new Map(Object.entries(speechModel.weights));
  const modelBytes = [...bytesByFile.values()].reduce((total, bytes) => total + bytes, 0);
  const received = new Map();
  let lastPercent = -1;
  return withModelStorageLock(speechModel, () => pipeline('automatic-speech-recognition', speechModel.id, {
    revision: speechModel.revision,
    device: 'wasm',
    dtype: 'q8',
    progress_callback: ({ status, file, loaded }) => {
      if (!bytesByFile.has(file)) return;
      if (status === 'done') received.set(file, bytesByFile.get(file));
      else if (status === 'progress') received.set(file, loaded);
      else return;
      const bytes = [...received.values()].reduce((total, value) => total + value, 0);
      const percent = Math.min(100, Math.floor(bytes * 100 / modelBytes));
      if (percent === lastPercent) return;
      lastPercent = percent;
      self.postMessage({
        type: 'status',
        text: percent === 100 ? 'Loading Whisper…' : `Downloading Whisper (~41 MB) · ${percent}%`,
      });
    },
  }));
}

self.onmessage = async ({ data }) => {
  try {
    transcriber ??= await loadTranscriber();
    self.postMessage({ type: 'status', text: 'Transcribing on This Device…' });
    const { text } = await transcriber(data.audio);
    self.postMessage({ type: 'transcript', text: text.trim() });
  } catch (error) {
    console.error(error);
    self.postMessage({ type: 'error' });
  }
};
