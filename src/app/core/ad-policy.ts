import { TOOLS } from './data/tools.data';

const AD_PAGES = new Set(TOOLS.map((tool) => `/tools/${tool.id}`));

/** Only actual tool pages carry ads, never search, saved lists or error screens. */
export function isAdPage(url: string): boolean {
  const path = url.split(/[?#]/, 1)[0].replace(/\/+$/, '');
  return AD_PAGES.has(path);
}
