/**
 * Submits every URL in the built sitemap to IndexNow (Bing, Yandex, Seznam,
 * Naver and others share submissions). Run after a deploy:
 *
 *   npm run indexnow
 *
 * The key file public/9e297e62b9b0af65d130d040d988b0d9.txt is deployed with the site; IndexNow fetches it
 * to prove ownership. Google does not use IndexNow — Search Console covers it.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const KEY = '9e297e62b9b0af65d130d040d988b0d9';
const HOST = 'ondevice-tools.org';

const sitemap = readFileSync(join(root, 'dist', 'app', 'browser', 'sitemap.xml'), 'utf8');
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList }),
});

console.log(`IndexNow: submitted ${urlList.length} URLs -> HTTP ${res.status}`);
if (res.status >= 400) {
  console.error(await res.text());
  process.exit(1);
}
