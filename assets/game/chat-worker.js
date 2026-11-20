import { models } from './chat-config.js';
import { readModelJson } from './chat-storage.js';
import { hasRepeatedTail } from './chat-repetition.js';

let generate;
let TextStreamer;
let stopping;
let generationOptions;

self.onmessage = async ({ data }) => {
  try {
    if (data.type === 'stop') {
      stopping.interrupt();
      return;
    }
    if (data.type === 'unload') {
      await generate.dispose();
      generate = undefined;
      self.postMessage({ type: 'unloaded' });
      return;
    }
    if (data.type === 'load') {
      const preset = models[data.model];
      const { id, revision, dtype = 'q4', runtime } = preset;
      const phase = (step, label) => self.postMessage({ type: 'model-phase', step, label });
      phase(1, 'Checking WebGPU…');
      const adapter = await navigator.gpu?.requestAdapter();
      if (!adapter) {
        self.postMessage({ type: 'gpu-unavailable' });
        return;
      }
      if (dtype === 'q4f16' && !adapter.features.has('shader-f16')) {
        self.postMessage({ type: 'gpu-feature-unavailable' });
        return;
      }
      phase(2, 'Starting Model Runtime…');
      const library = runtime === 'v4'
        ? await import('https://cdn.jsdelivr.net/npm/@huggingface/transformers@4.3.2')
        : await import('https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.8.1');
      const { env, pipeline, InterruptableStoppingCriteria } = library;
      TextStreamer = library.TextStreamer;
      stopping = new InterruptableStoppingCriteria();
      generationOptions = runtime === 'v4' ? { tokenizer_encode_kwargs: { enable_thinking: false } } : {};
      env.backends.onnx.wasm.numThreads = 1;
      phase(3, data.temporary ? 'Fetching Model Files…' : 'Reading Saved Files and Preparing GPU…');
      env.allowLocalModels = !data.temporary;
      env.useBrowserCache = !data.temporary;
      const options = {
        revision,
        device: 'webgpu',
        dtype,
        local_files_only: !data.temporary,
        // v4 probes files over the network for progress totals. Skip that when loading a saved model.
        progress_callback: runtime === 'v4' && !data.temporary ? undefined : ({ status, file, progress }) => {
          const weightsProgress = runtime === 'v4' ? status === 'progress_total' :
            status === 'progress' && file?.endsWith('.onnx');
          if (weightsProgress && Number.isFinite(progress)) {
            self.postMessage({ type: 'load-progress', percent: Math.floor(progress) });
          }
          if (status === 'done' && runtime !== 'v4' && file === 'onnx/model_q4.onnx') {
            phase(3, 'Initializing WebGPU Session…');
          }
        },
      };
      if (runtime === 'v4') {
        // The v4 pipeline factory probes the hub's main revision even for saved, pinned models.
        const [vocabulary, tokenizerConfig] = await Promise.all(
          ['tokenizer.json', 'tokenizer_config.json'].map((file) => readModelJson(preset, file, data.temporary)),
        );
        const tokenizer = new library.GemmaTokenizer(vocabulary, tokenizerConfig);
        const model = await library.AutoModelForCausalLM.from_pretrained(id, options);
        generate = new library.TextGenerationPipeline({ task: 'text-generation', model, tokenizer });
      } else {
        generate = await pipeline('text-generation', id, options);
      }
      const forward = generate.model.forward.bind(generate.model);
      generate.model.forward = async (inputs) => {
        // Allow the worker to handle Stop between generation steps.
        await new Promise((resolve) => setTimeout(resolve, 0));
        return forward(inputs);
      };
      phase(4, 'Warming Up WebGPU…');
      await generate([{ role: 'user', content: 'Hello' }], { ...generationOptions, max_new_tokens: 1, do_sample: false });
      self.postMessage({ type: 'ready' });
      return;
    }

    stopping.reset();
    const started = performance.now();
    let firstToken;
    let tokenCount = 0;
    const generated = [];
    let repetitive = false;
    const streamer = new TextStreamer(generate.tokenizer, {
      skip_prompt: true,
      skip_special_tokens: true,
      callback_function: (text) => self.postMessage({ type: 'token', text }),
      token_callback_function: (tokens) => {
        const now = performance.now();
        firstToken ??= now;
        tokenCount += tokens.length;
        generated.push(...tokens);
        if (!stopping.interrupted && hasRepeatedTail(generated)) {
          repetitive = true;
          stopping.interrupt();
        }
        const tps = now > firstToken ? (tokenCount - 1) * 1000 / (now - firstToken) : null;
        self.postMessage({ type: 'metrics', ttft: firstToken - started, tps, tokenCount });
      },
    });
    const [result] = await generate(data.messages, {
      ...generationOptions,
      max_new_tokens: data.tokens,
      do_sample: data.temperature > 0,
      temperature: data.temperature || 1,
      stopping_criteria: [stopping],
      streamer,
    });
    self.postMessage({ type: 'answer', stopped: stopping.interrupted, repetitive, text: result.generated_text.at(-1).content.trim() });
  } catch (error) {
    console.error(error);
    self.postMessage({ type: 'error' });
  }
};

self.postMessage({ type: 'initialized' });
