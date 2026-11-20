import MarkdownIt from '../vendor/markdown-it/markdown-it.min.mjs';
import katex from '../vendor/katex/katex.mjs';

const delimiters = [
  ['$$', '$$', true],
  ['\\[', '\\]', true],
  ['\\(', '\\)', false],
  ['$', '$', false],
];

const markdown = new MarkdownIt({ html: false, breaks: true }).disable('image');
markdown.renderer.rules.link_open = (tokens, index, options, _env, renderer) => {
  tokens[index].attrSet('target', '_blank');
  tokens[index].attrSet('rel', 'noopener noreferrer');
  return renderer.renderToken(tokens, index, options);
};

markdown.inline.ruler.before('escape', 'chat_math', (state, silent) => {
  for (const [open, close, displayMode] of delimiters) {
    if (!state.src.startsWith(open, state.pos)) continue;
    const begin = state.pos + open.length;
    if (open === '$' && /\s/.test(state.src[begin] ?? ' ')) return false;

    let end = state.src.indexOf(close, begin);
    while (end !== -1 && state.src[end - 1] === '\\') {
      end = state.src.indexOf(close, end + close.length);
    }
    if (end <= begin || end + close.length > state.posMax) return false;
    if (open === '$' && (/\s/.test(state.src[end - 1]) || /\d/.test(state.src[end + 1] ?? ''))) return false;

    if (!silent) {
      const token = state.push('chat_math', '', 0);
      token.content = state.src.slice(begin, end);
      token.meta = { displayMode };
    }
    state.pos = end + close.length;
    return true;
  }
  return false;
});

markdown.renderer.rules.chat_math = (tokens, index) => {
  const { content, meta } = tokens[index];
  return katex.renderToString(content, {
    displayMode: meta.displayMode,
    trust: false,
    throwOnError: false,
    maxExpand: 300,
    maxSize: 20,
  });
};

export function renderChatMarkdown(element, text) {
  element.innerHTML = markdown.render(text);
  element.classList.add('is-formatted');
}
