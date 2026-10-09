/** Format source tokens without converting numbers or discarding duplicate members. */
export function formatJsonSource(text: string, indent = 2, sort = false): string {
  JSON.parse(text); // Syntax validation only; never serialize this parsed value.
  const tokens = text.match(/"(?:[^"\\]|\\.)*"|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?|true|false|null|[{}[\],:]/g) ?? [];
  let cursor = 0;
  const pad = (depth: number) => ' '.repeat(depth * indent);
  const read = (depth: number): string => {
    const token = tokens[cursor++];
    if (token !== '{' && token !== '[') return token;
    const object = token === '{';
    const end = object ? '}' : ']';
    const entries: { key: string; value: string }[] = [];
    while (tokens[cursor] !== end) {
      let key = '';
      if (object) { key = tokens[cursor++]; cursor++; }
      entries.push({ key, value: read(depth + 1) });
      if (tokens[cursor] !== ',') break;
      cursor++;
    }
    cursor++;
    if (object && sort) entries.sort((a, b) => {
      const left = JSON.parse(a.key) as string, right = JSON.parse(b.key) as string;
      return left < right ? -1 : left > right ? 1 : 0;
    });
    if (!entries.length) return token + end;
    const values = entries.map(e => (object ? e.key + ':' + (indent ? ' ' : '') : '') + e.value);
    return indent ? token + '\n' + values.map(v => pad(depth + 1) + v).join(',\n') + '\n' + pad(depth) + end : token + values.join(',') + end;
  };
  return read(0);
}
