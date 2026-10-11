/**
 * Builds sitemap.xml from the prerendered output.
 *
 * Walking the build result rather than the source registry means the sitemap
 * can never list a page that was not actually generated.
 */
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const browserDir = join(root, 'dist', 'app', 'browser');

/**
 * The canonical origin lives in site.config.ts so the app and the sitemap can
 * never disagree. SITE_URL overrides it for preview deployments.
 */
function resolveSiteUrl() {
  if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/$/, '');
  const config = readFileSync(join(root, 'src', 'app', 'core', 'site.config.ts'), 'utf8');
  const match = /export const SITE_URL\s*=\s*['"]([^'"]+)['"]/.exec(config);
  if (!match) throw new Error('Could not read SITE_URL from src/app/core/site.config.ts');
  return match[1].replace(/\/$/, '');
}

const siteUrl = resolveSiteUrl();

/** Routes that exist but should not be indexed. */
const EXCLUDED = new Set(['/favorites', '/404']);

function findPages(dir, pages = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      findPages(full, pages);
    } else if (entry === 'index.html') {
      const rel = relative(browserDir, dirname(full)).split(sep).filter(Boolean).join('/');
      pages.push(rel ? `/${rel}` : '/');
    }
  }
  return pages;
}

/** Reuse the rendered structured-data date. Unknown dates are omitted, not invented. */
function lastmodFor(path) {
  const html = readFileSync(join(browserDir, path.slice(1), 'index.html'), 'utf8');
  const script = /<script\b[^>]*\bdata-qt-ld\b[^>]*>([\s\S]*?)<\/script>/i.exec(html);
  if (!script) return undefined;
  const nodes = JSON.parse(script[1])['@graph'] ?? [];
  const date = nodes.find((node) => node['@type'] === 'SoftwareApplication')?.dateModified;
  if (!date) return undefined;
  // A calendar date may be the next UTC day in the publisher's time zone.
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(Date.parse(date)) || Date.parse(date) > Date.now() + 86_400_000) {
    throw new Error(`Invalid modification date for ${path}: ${date}`);
  }
  return date;
}

let pages;
try {
  pages = findPages(browserDir);
} catch {
  console.error(`No prerendered output found at ${browserDir}. Run "npm run build" first.`);
  process.exit(1);
}

const routes = pages.filter((p) => !EXCLUDED.has(p)).sort();
const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...routes.map((path) => {
    const lastmod = lastmodFor(path);
    return [
      '  <url>',
      // Trailing slash to match `canonicalUrl()` in src/app/core/site.config.ts:
      // that is the form the host serves with a 200 rather than a redirect.
      `    <loc>${siteUrl}${path === '/' ? '/' : `${path}/`}</loc>`,
      ...(lastmod ? [`    <lastmod>${lastmod}</lastmod>`] : []),
      '  </url>',
    ].join('\n');
  }),
  '</urlset>',
  '',
].join('\n');

writeFileSync(join(browserDir, 'sitemap.xml'), xml);

// robots.txt is generated rather than shipped as a static asset so its Sitemap
// line always matches the origin the sitemap was actually built for.
const robots = [
  '# Public pages may be crawled by search engines and AI retrieval crawlers.',
  '# This includes Googlebot, Bingbot, GPTBot, OAI-SearchBot, ClaudeBot and PerplexityBot.',
  '# Private input stays in each visitor\'s browser; only public page content is crawlable.',
  'User-agent: *',
  'Allow: /',
  '',
  '# /favorites is per-browser and carries <meta name="robots" content="noindex">.',
  '# It is deliberately NOT disallowed here: a disallowed URL can still be indexed',
  '# from an inbound link, because the crawler never fetches it to see the noindex.',
  '',
  `Sitemap: ${siteUrl}/sitemap.xml`,
  '',
  `# Generative Engine Optimization (GEO) & Machine-readable documentation:`,
  `# ${siteUrl}/llms.txt`,
  `# ${siteUrl}/llms-full.txt`,
  '',
].join('\n');

writeFileSync(join(browserDir, 'robots.txt'), robots);

console.log(`Wrote sitemap.xml (${routes.length} URLs) and robots.txt for ${siteUrl}`);
