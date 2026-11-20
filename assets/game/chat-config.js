export const models = {
  balanced: {
    name: 'SmolLM2 360M',
    label: 'Balanced',
    download: '~390 MB',
    weightBytes: 387943246,
    id: 'HuggingFaceTB/SmolLM2-360M-Instruct',
    revision: 'a10cc1512eabd3dde888204e902eca88bddb4951',
  },
  lightweight: {
    name: 'SmolLM2 135M',
    label: 'Lightweight',
    download: '~185 MB',
    weightBytes: 182068553,
    id: 'HuggingFaceTB/SmolLM2-135M-Instruct',
    revision: '12fd25f77366fa6b3b4b768ec3050bf629380bac',
  },
  qwen: {
    name: 'Qwen2.5 0.5B Instruct',
    label: 'Higher Quality',
    download: '~790 MB',
    weightBytes: 786156820,
    id: 'onnx-community/Qwen2.5-0.5B-Instruct',
    revision: '22942cb7d7ba4cc81bb4673549ca4d4614469b5e',
  },
  gemma: {
    name: 'Gemma 4 E2B',
    label: 'Higher Quality · FP16 GPU',
    download: '~3.1 GB',
    id: 'onnx-community/gemma-4-E2B-it-ONNX',
    revision: '6f21c99d7e18237f8d2ce92aadfdbfeba877f63a',
    dtype: 'q4f16',
    runtime: 'v4',
    weights: {
      'onnx/embed_tokens_q4f16.onnx': 5621,
      'onnx/embed_tokens_q4f16.onnx_data': 1590689792,
      'onnx/decoder_model_merged_q4f16.onnx': 673231,
      'onnx/decoder_model_merged_q4f16.onnx_data': 1519700992,
    },
  },
};

export const speechModel = {
  id: 'Xenova/whisper-tiny',
  revision: '5332fcc35e32a33b86612b9a57a89be7906102b1',
  metadata: ['config.json', 'generation_config.json', 'tokenizer.json', 'tokenizer_config.json', 'preprocessor_config.json'],
  weights: {
    'onnx/encoder_model_quantized.onnx': 10124910,
    'onnx/decoder_model_merged_quantized.onnx': 30727765,
  },
};

export const replyLimits = [64, 128, 192, 256, 512, 1024];
export const defaults = { model: 'balanced', temperature: 0, tokens: 1024, context: true };
