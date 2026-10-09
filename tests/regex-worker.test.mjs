import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { Worker } from 'node:worker_threads';
import assert from 'node:assert/strict';
import test from 'node:test';

const source = readFileSync(new URL('../public/regex-worker.js', import.meta.url), 'utf8');
function evaluate(pattern, text, flags = 'g', replacement = '') {
  let result;
  const self = { postMessage: value => { result = value; } };
  runInNewContext(source, { self });
  self.onmessage({ data: { pattern, text, flags, replacement } });
  return result;
}
test('captures groups and substitutes replacements', () => {
  const result = evaluate('(?<word>[a-z]+)', 'abc 123', 'g', '[$<word>]');
  assert.equal(result.replaced, '[abc] 123');
  assert.equal(result.matches[0].groups[1].name, 'word');
});
test('reports invalid syntax and exact match truncation', () => {
  assert.ok(evaluate('[', 'abc').error);
  assert.equal(evaluate('a', 'a'.repeat(500)).truncated, false);
  assert.equal(evaluate('a', 'a'.repeat(501)).truncated, true);
});
test('advances zero-width unicode matches and respects nonglobal mode', () => {
  assert.equal(evaluate('(?:)', '😀', 'gu').matches.length, 2);
  assert.equal(evaluate('a', 'aaa', '').matches.length, 1);
});
test('a catastrophic pattern can be terminated outside the worker', async () => {
  const worker = new Worker(`const {parentPort}=require('node:worker_threads');
    global.self={postMessage:value=>parentPort.postMessage(value)};
    ${source}
    parentPort.on('message',data=>self.onmessage({data}));`, { eval: true });
  await new Promise(resolve => worker.once('online', resolve));
  worker.postMessage({ pattern: '(a+)+$', text: 'a'.repeat(100) + '!', flags: 'g', replacement: '' });
  await new Promise(resolve => setTimeout(resolve, 100));
  const exitCode = await worker.terminate();
  assert.equal(exitCode, 1);
});
