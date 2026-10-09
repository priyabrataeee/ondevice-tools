import { describe, expect, it } from 'vitest';
import { formatJsonSource } from './json-format';

describe('lossless JSON formatting', () => {
  it('preserves numeric literals, duplicate members and source order', () => {
    const source = '{"2":9007199254740993,"1":-0,"x":1e400,"x":1.2300}';
    expect(formatJsonSource(formatJsonSource(source), 0)).toBe(source);
  });
  it('handles empty containers, nested values and escaped strings', () => {
    const source = JSON.stringify({ a: [{}, [], true, false, null, 'a"b\n'] });
    expect(formatJsonSource(formatJsonSource(source, 4), 0)).toBe(source);
  });
  it('sorts members without dropping duplicate keys', () => {
    expect(formatJsonSource('{"b":1,"a":2,"a":3}', 0, true)).toBe('{"a":2,"a":3,"b":1}');
  });
  it('rejects invalid JSON', () => {
    expect(() => formatJsonSource('{"x":1,}')).toThrow();
  });
});
