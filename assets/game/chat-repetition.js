// Look for a contiguous loop at the end of the generated tokens.
export function hasRepeatedTail(tokens) {
  const end = tokens.length;
  const longestPhrase = Math.min(32, Math.floor(end / 4));
  for (let length = 1; length <= longestPhrase; length++) {
    const repetitions = Math.max(4, Math.ceil(12 / length));
    const start = end - length * repetitions;
    if (start < 0) continue;
    let cursor = end - 1;
    while (cursor >= start + length && tokens[cursor] === tokens[cursor - length]) cursor--;
    if (cursor < start + length) return true;
  }
  return false;
}
