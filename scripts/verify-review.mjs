/** Non-network regression checks for the exact files sent to Cloudflare. */
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const output = join(root, 'dist/app/browser');
const config = readFileSync(join(root, 'src/app/core/site.config.ts'), 'utf8');
const siteUrl = /export const SITE_URL\s*=\s*['"]([^'"]+)/.exec(config)[1];
const client = /export const ADSENSE_CLIENT\s*=\s*['"]([^'"]*)/.exec(config)[1];
const adsEnabled = client.startsWith('ca-pub-');
const pages = [];
function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) walk(path);
    else if (entry.name === 'index.html') pages.push(path);
  }
}
walk(output);
const sitemap = new JSDOM(readFileSync(join(output, 'sitemap.xml'), 'utf8'), { contentType: 'text/xml' });
const sitemapDates = new Map([...sitemap.window.document.querySelectorAll('url')].map((entry) => [
  entry.querySelector('loc').textContent,
  entry.querySelector('lastmod')?.textContent,
]));
assert.equal(sitemapDates.size, sitemap.window.document.querySelectorAll('url').length, 'Duplicate sitemap URL');
const paths = new Set(pages.map((file) => '/' + relative(output, dirname(file)).split(sep).filter(Boolean).join('/')));
let indexed = 0;
let adPages = 0;
let examples = 0;
for (const file of pages) {
  const route = '/' + relative(output, dirname(file)).split(sep).filter(Boolean).join('/');
  const url = siteUrl + (route === '/' ? '/' : route + '/');
  const dom = new JSDOM(readFileSync(file, 'utf8'), { url });
  const document = dom.window.document;
  const check = (condition, message) => assert.ok(condition, `${route}: ${message}`);
  check(document.querySelectorAll('h1').length === 1, 'Expected one H1');
  check(document.querySelectorAll('link[rel="canonical"]').length === 1, 'Expected one canonical');
  check(document.querySelector('link[rel="canonical"]').href === url, 'Wrong canonical');
  check(document.title.trim(), 'Missing title');
  check(document.querySelector('meta[name="description"]')?.content, 'Missing description');
  const noindex = document.querySelector('meta[name="robots"]')?.content.includes('noindex');
  check(noindex === (route === '/404' || route === '/favorites'), 'Unexpected robots directive');
  check(sitemapDates.has(url) !== noindex, 'Indexability and sitemap disagree');
  if (!noindex) indexed++;
  const graph = JSON.parse(document.querySelector('script[data-qt-ld]').textContent)['@graph'];
  const tool = graph.find((node) => node['@type'] === 'SoftwareApplication');
  const loader = document.querySelectorAll('#adsense-loader');
  check(loader.length === (tool && !noindex && adsEnabled ? 1 : 0), 'Wrong ad-loader eligibility');
  if (loader.length) adPages++;
  if (adsEnabled) {
    check(document.querySelector('meta[name="google-adsense-account"]')?.content === client, 'Missing publisher verification');
  }
  if (tool) check(sitemapDates.get(url) === tool.dateModified, 'Sitemap and structured-data dates disagree');
  else check(!sitemapDates.get(url), 'Invented non-tool modification date');
  if (document.getElementById('worked-examples-heading')) {
    examples++;
    check(document.getElementById('limitations-heading'), 'Examples lack limitations');
    check(document.querySelectorAll('pre code').length >= 4, 'Examples lack input/output pairs');
  }
  for (const anchor of document.querySelectorAll('a[href]')) {
    const target = new URL(anchor.href, url);
    if (target.origin !== siteUrl) continue;
    const path = decodeURIComponent(target.pathname).replace(/\/+$/, '') || '/';
    check(paths.has(path) || existsSync(join(output, path.slice(1))), `Broken local link: ${anchor.getAttribute('href')}`);
  }
  dom.window.close();
}
assert.equal(indexed, sitemapDates.size, 'Sitemap contains routes absent from prerender output');
const fallback = new JSDOM(readFileSync(join(output, '404.html'), 'utf8'));
assert.ok(fallback.window.document.querySelector('meta[name="robots"]')?.content.includes('noindex'));
assert.equal(fallback.window.document.querySelector('#adsense-loader'), null, 'Fallback 404 must be ad-free');
fallback.window.close();
sitemap.window.close();
console.log(`Review checks passed: ${pages.length} pages, ${indexed} sitemap URLs, ${adPages} eligible ad pages, ${examples} worked-example pages; canonical, noindex, dates and internal links checked.`);
