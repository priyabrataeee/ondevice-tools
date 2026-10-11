import { describe, expect, it } from 'vitest';
import { formatXml, minifyXml } from './xml-format';

describe('XML source preservation', () => {
  it('formats element-only XML and removes only indentation on minify', () => {
    const compact = '<root><item id="1">A</item><item id="2"/></root>';
    const pretty = '<root>\n  <item id="1">A</item>\n  <item id="2"/>\n</root>';
    expect(formatXml(compact).output).toBe(pretty);
    expect(minifyXml(pretty).output).toBe(compact);
  });
  it.each([
    '<root note="a  b > c"> a  b </root>',
    '<p>Hello <b>world</b> today</p>',
    '<p><b>one</b> <i>two</i></p>',
    '<root><![CDATA[a  b >\n < c]]></root>',
    '<root xml:space="preserve">\n  <x/>\n</root>',
  ])('preserves significant content: %s', (xml) => {
    expect(formatXml(xml).output).toBe(xml);
    expect(minifyXml(xml).output).toBe(xml);
  });
  it('preserves comments and processing instructions', () => {
    const xml = '<?xml version="1.0"?><root><!-- a  b --><x/></root>';
    expect(minifyXml(formatXml(xml).output).output).toBe(xml);
  });
  it('returns a warning instead of rewriting a DTD', () => {
    const xml = '<!DOCTYPE root [<!ELEMENT root ANY>]><root/>';
    expect(formatXml(xml)).toMatchObject({ output: xml, warning: expect.any(String) });
  });
  it('rejects malformed XML without rejecting a literal parsererror element', () => {
    expect(formatXml('<root><broken></root>').error).toBeTruthy();
    expect(formatXml('<parsererror/>').error).toBeUndefined();
  });
});
