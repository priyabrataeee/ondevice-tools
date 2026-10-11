export interface XmlResult {
  output: string;
  error?: string;
  warning?: string;
}

interface ElementToken {
  open: string;
  close: string;
  children: (ElementToken | string)[];
}

/** Work with source tokens so quotes, entities, comments and CDATA are not rewritten. */
function transformXml(xml: string, indentSize: number | null): XmlResult {
  const source = xml.trim();
  if (!source) return { output: '' };
  if (typeof DOMParser === 'undefined') return { output: source };
  const document = new DOMParser().parseFromString(source, 'application/xml');
  // A valid document may contain an element literally named parsererror.
  const error = document.getElementsByTagNameNS('http://www.mozilla.org/newlayout/xml/parsererror.xml', 'parsererror')[0];
  if (error) return { output: '', error: (error.textContent ?? 'Malformed XML').trim().split('\n')[0] };

  // Internal subsets and entity declarations require a full DTD-aware lexer.
  // Returning unchanged input is safer than quietly corrupting a declaration.
  if (/<!DOCTYPE\s/i.test(source)) {
    return { output: source, warning: 'Documents with a DOCTYPE are returned unchanged. Use a DTD-aware XML editor to reformat them.' };
  }
  const tokens = source.match(/<!\[CDATA\[[\s\S]*?\]\]>|<!--[\s\S]*?-->|<\?[\s\S]*?\?>|<(?:(?:[^<>"'])|"[^"]*"|'[^']*')+>|[^<]+/g) ?? [];
  if (tokens.join('') !== source) return { output: source, warning: 'This document cannot be safely reformatted; the original is shown.' };

  const root: ElementToken = { open: '', close: '', children: [] };
  const stack = [root];
  for (const token of tokens) {
    if (token.startsWith('</')) {
      const node = stack.pop();
      if (!node || node === root) return { output: '', error: 'Unbalanced XML elements.' };
      node.close = token;
    } else if (token.startsWith('<') && !/^<[!?]/.test(token) && !token.endsWith('/>')) {
      const node: ElementToken = { open: token, close: '', children: [] };
      stack[stack.length - 1].children.push(node);
      stack.push(node);
    } else {
      stack[stack.length - 1].children.push(token);
    }
  }
  if (stack.length !== 1) return { output: '', error: 'Unbalanced XML elements.' };

  const original = (node: ElementToken): string =>
    node.open + node.children.map((child) => typeof child === 'string' ? child : original(child)).join('') + node.close;
  const render = (node: ElementToken, depth: number): string => {
    // Text, inline spacing, CDATA and xml:space make whitespace significant.
    // Keep the whole subtree verbatim, including nested elements.
    const significant = /\bxml:space\s*=\s*(["'])preserve\1/.test(node.open) || node.children.some((child) =>
      typeof child === 'string' && (child.startsWith('<![CDATA[') ||
        (!child.startsWith('<') && (!/^\s*$/.test(child) || !/[\r\n]/.test(child)))),
    );
    if (significant) return original(node);
    const children = node.children.filter((child) => typeof child !== 'string' || child.trim());
    if (indentSize === null) {
      return node.open + children.map((child) => typeof child === 'string' ? child : render(child, depth + 1)).join('') + node.close;
    }
    const padding = ' '.repeat(indentSize * depth);
    if (!node.open) return children.map((child) => typeof child === 'string' ? child : render(child, 0)).join('\n');
    if (!children.length) return node.open + node.close;
    return node.open + '\n' + children.map((child) =>
      padding + ' '.repeat(indentSize) + (typeof child === 'string' ? child : render(child, depth + 1)),
    ).join('\n') + '\n' + padding + node.close;
  };
  return { output: render(root, 0) };
}

/** Indent element-only content; preserve mixed-content subtrees verbatim. */
export function formatXml(xml: string, indentSize = 2): XmlResult {
  return transformXml(xml, indentSize);
}

/** Remove indentation-only text nodes, never whitespace inside values or CDATA. */
export function minifyXml(xml: string): XmlResult {
  return transformXml(xml, null);
}
