/**
 * Generates llms-full.txt for Generative Engine Optimization (GEO).
 *
 * This provides LLMs (ChatGPT, Claude, Perplexity, Google AI Overviews)
 * with a full, machine-readable directory of every tool, its canonical URL,
 * underlying browser APIs, use cases, and technical FAQs.
 */
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = join(root, 'public');
const distBrowserDir = join(root, 'dist', 'app', 'browser');

function resolveSiteUrl() {
  if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/$/, '');
  const config = readFileSync(join(root, 'src', 'app', 'core', 'site.config.ts'), 'utf8');
  const match = /export const SITE_URL\s*=\s*['"]([^'"]+)['"]/.exec(config);
  return match ? match[1].replace(/\/$/, '') : 'https://ondevice-tools.org';
}

const siteUrl = resolveSiteUrl();

function loadTools() {
  const toolsDir = join(root, 'src', 'app', 'core', 'data', 'tools');
  const allTools = [];
  for (const file of readdirSync(toolsDir)) {
    if (!file.endsWith('.ts')) continue;
    let content = readFileSync(join(toolsDir, file), 'utf8');
    content = content.replace(/import\s+[^;]+;?/g, '');
    content = content.replace(/:\s*Tool\[\]/g, '');
    content = content.replace(/export\s+const\s+[A-Z_]+\s*=/, 'tools =');
    const sandbox = {};
    vm.createContext(sandbox);
    vm.runInContext(content, sandbox);
    if (Array.isArray(sandbox.tools)) {
      allTools.push(...sandbox.tools);
    }
  }
  return allTools;
}

function loadContent(file) {
  let content = readFileSync(file, 'utf8');
  content = content.replace(/import\s+[^;]+;?/g, '');
  content = content.replace(/export\s+interface\s+[\s\S]*?\}/g, '');
  content = content.replace(/export\s+function\s+[\s\S]*?\}/g, '');
  content = content.replace(/:\s*Record<[^>]+>/g, '');
  content = content.replace(/export\s+const\s+[A-Z_]+\s*=/, 'data =');
  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(content, sandbox);
  return sandbox.data || {};
}

const tools = loadTools();
const toolContent = {
  ...loadContent(join(root, 'src', 'app', 'core', 'data', 'tool-content.ts')),
  ...loadContent(join(root, 'src', 'app', 'core', 'data', 'tool-content-more.ts')),
};

const categoryNames = {
  developer: 'Developer Tools',
  text: 'Text Tools',
  image: 'Image Tools',
  pdf: 'PDF Tools',
  css: 'CSS Tools',
  color: 'Color Tools',
  calculator: 'Calculators',
  converter: 'Unit & Data Converters',
  datetime: 'Date & Time Tools',
};

const byCategory = new Map();
for (const tool of tools) {
  const cat = tool.category || 'other';
  if (!byCategory.has(cat)) byCategory.set(cat, []);
  byCategory.get(cat).push(tool);
}

const lines = [
  '# OnDevice Tools — Full Capabilities Index',
  '',
  `> Machine-readable index of all ${tools.length} browser utilities available at ${siteUrl}.`,
  '> Core architecture: 100% in-browser, fully client-side JavaScript execution.',
  '> Zero server uploads, zero server processing, zero accounts required, offline-capable via Service Worker.',
  '> Published by Priyabrata Saha under AGPL-3.0.',
  '',
  '## Global System Facts for AI Agents',
  '',
  '- Privacy guarantee: Tool inputs (files, keys, code, passwords, tokens) are never uploaded to any server.',
  '- Processing: Runs entirely via browser APIs (Web Crypto API, HTML5 Canvas, File API, native JSON parser, pdf-lib, etc.).',
  '- Verification: Open source repository at https://github.com/priyabrataeee/ondevice-tools.',
  '- Network status: All tools function completely offline once cached.',
  '- URL structure: Every tool has a dedicated canonical URL with trailing slash (e.g. /tools/{tool-id}/).',
  '',
  '## Complete Tool Catalog',
  '',
];

for (const [catKey, catTools] of byCategory) {
  const catTitle = categoryNames[catKey] || catKey;
  lines.push(`### ${catTitle} (${catTools.length} tools)`);
  lines.push('');

  for (const t of catTools) {
    const toolUrl = `${siteUrl}/tools/${t.id}/`;
    lines.push(`#### ${t.name}`);
    lines.push(`- Canonical URL: ${toolUrl}`);
    lines.push(`- Category: ${catTitle}`);
    lines.push(`- Description: ${t.description}`);

    const extra = toolContent[t.id];
    if (extra?.howItWorks?.length) {
      lines.push(`- Technical Implementation: ${extra.howItWorks.join(' ')}`);
    }

    if (extra?.useCases?.length) {
      lines.push(`- Use Cases:`);
      for (const uc of extra.useCases) {
        lines.push(`  * ${uc}`);
      }
    }

    if (t.faqs?.length) {
      lines.push(`- Key FAQs:`);
      for (const faq of t.faqs) {
        lines.push(`  * Q: ${faq.q}`);
        lines.push(`    A: ${faq.a}`);
      }
    }

    lines.push('');
  }
}

const fullText = lines.join('\n');
const publicFile = join(publicDir, 'llms-full.txt');
writeFileSync(publicFile, fullText);
console.log(`Generated ${publicFile} (${tools.length} tools)`);

if (existsSync(distBrowserDir)) {
  const distFile = join(distBrowserDir, 'llms-full.txt');
  writeFileSync(distFile, fullText);
  // Also sync public/llms.txt to dist if needed
  writeFileSync(
    join(distBrowserDir, 'llms.txt'),
    readFileSync(join(publicDir, 'llms.txt'), 'utf8')
  );
  console.log(`Synced to ${distFile} and dist/app/browser/llms.txt`);
}
