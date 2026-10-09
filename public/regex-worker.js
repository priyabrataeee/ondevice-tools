/* All user regex execution stays in a disposable worker. */
self.onmessage = ({ data }) => {
  try {
    const { pattern, flags, text, replacement } = data;
    const regex = new RegExp(pattern, flags.includes('g') ? flags : flags + 'g');
    const matches = [];
    let match;
    let truncated = false;
    while ((match = regex.exec(text)) !== null) {
      if (matches.length === 500) { truncated = true; break; }
      const groups = [];
      for (let i = 1; i < match.length; i++) groups.push({ name: String(i), value: match[i] ?? '' });
      for (const [name, value] of Object.entries(match.groups ?? {})) groups.push({ name, value: value ?? '' });
      matches.push({ index: matches.length, value: match[0], start: match.index, groups });
      if (!flags.includes('g')) break;
      if (match[0] === '') regex.lastIndex += flags.includes('u') && text.codePointAt(regex.lastIndex) > 0xffff ? 2 : 1;
    }
    const replaced = text.replace(new RegExp(pattern, flags), replacement);
    if (replaced.length > 2000000) throw new Error('Replacement exceeds the 2,000,000-character limit.');
    self.postMessage({ matches, truncated, replaced, error: '' });
  } catch (error) { self.postMessage({ matches: [], truncated: false, replaced: '', error: error.message }); }
};
