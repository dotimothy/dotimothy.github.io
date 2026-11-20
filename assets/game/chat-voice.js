const maxRecordingMs = 30_000;

export function setupChatVoice(chat, input) {
  const mic = chat.querySelector('#chat-mic');
  const status = chat.querySelector('#chat-voice-status');
  const canRecord = Boolean(navigator.mediaDevices?.getUserMedia && window.MediaRecorder && window.OfflineAudioContext);
  const synthesizer = window.speechSynthesis;
  let speechWorker;
  let stream;
  let recorder;
  let deadline;
  let captureId = 0;
  let phase = 'idle';
  let blocked = false;
  let playback;
  mic.hidden = !canRecord;
  synthesizer?.getVoices();

  function updateMic() {
    const recording = phase === 'recording';
    const label = recording ? 'Stop Recording' : 'Record Voice Input';
    mic.setAttribute('aria-label', label);
    mic.setAttribute('aria-pressed', String(recording));
    mic.title = label;
    mic.disabled = !recording && (blocked || phase !== 'idle');
  }

  function stopCapture(release = false) {
    ++captureId;
    clearTimeout(deadline);
    if (recorder?.state === 'recording') recorder.stop();
    stream?.getTracks().forEach((track) => track.stop());
    stream = recorder = undefined;
    if (release || phase === 'processing') {
      speechWorker?.terminate();
      speechWorker = undefined;
    }
    phase = 'idle';
    status.textContent = '';
    updateMic();
  }

  function finishCapture(message) {
    phase = 'idle';
    status.textContent = message;
    updateMic();
  }

  function getSpeechWorker() {
    if (speechWorker) return speechWorker;
    const current = new Worker(new URL('./speech-worker.js', import.meta.url), { type: 'module' });
    speechWorker = current;
    current.addEventListener('message', ({ data }) => {
      if (speechWorker !== current || phase !== 'processing') return;
      if (data.type === 'status') {
        status.textContent = data.text;
      } else if (data.type === 'transcript') {
        if (!data.text) {
          finishCapture('No Speech Detected. Try Recording Again.');
          return;
        }
        const draft = [input.value.trimEnd(), data.text].filter(Boolean).join(' ');
        input.value = draft.slice(0, input.maxLength);
        finishCapture(draft.length > input.maxLength
          ? 'Transcript Added up to the Question Limit.'
          : 'Transcript Added. Review It Before Sending.');
        if (chat.open && !input.readOnly) input.focus();
      } else {
        finishCapture('Couldn’t Transcribe This Recording. Try Again.');
      }
    });
    current.addEventListener('error', () => {
      if (speechWorker !== current) return;
      current.terminate();
      speechWorker = undefined;
      finishCapture('Couldn’t Start Local Speech Recognition. Try Again.');
    });
    return current;
  }

  async function transcribe(blob, id) {
    try {
      if (!blob.size) {
        finishCapture('No Audio Recorded. Try Again.');
        return;
      }
      const context = new OfflineAudioContext(1, 1, 16000);
      const decoded = await context.decodeAudioData(await blob.arrayBuffer());
      if (id !== captureId) return;
      const audio = decoded.getChannelData(0);
      getSpeechWorker().postMessage({ audio }, [audio.buffer]);
    } catch (error) {
      if (id !== captureId) return;
      console.error(error);
      finishCapture('Couldn’t Read This Recording. Try Again.');
    }
  }

  function endRecording() {
    if (recorder?.state !== 'recording') return;
    phase = 'processing';
    status.textContent = 'Preparing Recording…';
    updateMic();
    recorder.stop();
  }

  async function record() {
    if (phase === 'recording') {
      endRecording();
      return;
    }
    stopSpeaking();
    const id = ++captureId;
    phase = 'permission';
    status.textContent = 'Waiting for Microphone Permission…';
    updateMic();
    try {
      const source = await navigator.mediaDevices.getUserMedia({ audio: { channelCount: 1, echoCancellation: true } });
      if (id !== captureId || !chat.open) {
        source.getTracks().forEach((track) => track.stop());
        return;
      }
      stream = source;
      const chunks = [];
      const current = new MediaRecorder(source);
      recorder = current;
      current.addEventListener('dataavailable', ({ data }) => {
        if (data.size) chunks.push(data);
      });
      current.addEventListener('stop', () => {
        if (id !== captureId) return;
        clearTimeout(deadline);
        source.getTracks().forEach((track) => track.stop());
        stream = recorder = undefined;
        phase = 'processing';
        updateMic();
        transcribe(new Blob(chunks, { type: current.mimeType }), id);
      });
      current.addEventListener('error', () => {
        if (id !== captureId) return;
        stopCapture();
        finishCapture('Microphone Recording Failed. Try Again.');
      });
      current.start();
      phase = 'recording';
      status.textContent = 'Recording… Press the Microphone Again to Transcribe.';
      updateMic();
      deadline = setTimeout(endRecording, maxRecordingMs);
    } catch (error) {
      if (id !== captureId) return;
      stopCapture();
      finishCapture(error.name === 'NotAllowedError'
        ? 'Microphone Permission Was Denied.'
        : 'Couldn’t Open the Microphone.');
    }
  }

  function stopSpeaking() {
    if (!playback) return;
    playback.button.textContent = 'Read Aloud';
    playback = undefined;
    synthesizer.cancel();
  }

  function addReadButton(row, text, content) {
    if (!synthesizer || typeof SpeechSynthesisUtterance !== 'function' || !text.trim()) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'chat-control chat-read-aloud';
    button.textContent = 'Read Aloud';
    button.addEventListener('click', () => {
      if (playback?.button === button) {
        stopSpeaking();
        return;
      }
      if (phase === 'recording' || phase === 'permission') {
        status.textContent = 'Stop Recording Before Reading a Reply Aloud.';
        return;
      }
      const voices = synthesizer.getVoices().filter((voice) => voice.localService);
      const language = document.documentElement.lang || 'en';
      const voice = voices.find((candidate) => candidate.lang.startsWith(language)) ?? voices.find((candidate) => candidate.default) ?? voices[0];
      if (!voice) {
        status.textContent = 'No On-Device Text-to-Speech Voice Is Available.';
        return;
      }
      stopSpeaking();
      status.textContent = '';
      const readable = content.cloneNode(true);
      readable.querySelectorAll('.katex-html, .katex annotation').forEach((element) => element.remove());
      const spokenText = readable.innerText || readable.textContent || text;
      const utterance = new SpeechSynthesisUtterance(spokenText);
      utterance.voice = voice;
      utterance.lang = voice.lang;
      const current = { button, utterance };
      playback = current;
      button.textContent = 'Stop Reading';
      utterance.onend = utterance.onerror = (event) => {
        if (playback !== current) return;
        playback = undefined;
        button.textContent = 'Read Aloud';
        if (event.type === 'error') status.textContent = 'Couldn’t Read This Reply Aloud.';
      };
      try {
        synthesizer.speak(utterance);
      } catch {
        playback = undefined;
        button.textContent = 'Read Aloud';
        status.textContent = 'Couldn’t Read This Reply Aloud.';
      }
    });
    row.append(button);
  }

  mic.addEventListener('click', record);
  return {
    addReadButton,
    reset(release = false) {
      stopCapture(release);
      stopSpeaking();
    },
    setBlocked(value) {
      blocked = value;
      updateMic();
    },
  };
}
