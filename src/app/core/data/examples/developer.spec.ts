import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { DEVELOPER_GUIDES } from './developer';
import { JsonFormatterComponent } from '../../../tools/developer/json-formatter/json-formatter.component';
import { JsonValidatorComponent } from '../../../tools/developer/json-validator/json-validator.component';
import { JwtDecoderComponent } from '../../../tools/developer/jwt-decoder/jwt-decoder.component';
import { UuidGeneratorComponent } from '../../../tools/developer/uuid-generator/uuid-generator.component';
import { Base64EncoderComponent } from '../../../tools/developer/base64-encoder/base64-encoder.component';
import { UrlEncoderComponent } from '../../../tools/developer/url-encoder/url-encoder.component';
import { HtmlEntityEncoderComponent } from '../../../tools/developer/html-entity-encoder/html-entity-encoder.component';
import { HashGeneratorComponent } from '../../../tools/developer/hash-generator/hash-generator.component';
import { SqlFormatterComponent } from '../../../tools/developer/sql-formatter/sql-formatter.component';
import { YamlFormatterComponent } from '../../../tools/developer/yaml-formatter/yaml-formatter.component';
import { CronGeneratorComponent } from '../../../tools/developer/cron-generator/cron-generator.component';

const inContext = <T>(create: () => T): T => TestBed.runInInjectionContext(create);

class JsonFormatCheck extends JsonFormatterComponent {
  run(text: string, sort: boolean) { this.input.set(text); this.sortKeys.set(sort); return this.output(); }
}
class JsonValidCheck extends JsonValidatorComponent {
  run(text: string) {
    this.input.set(text);
    const err = this.error();
    if (err) return `Invalid JSON\nFirst problem at line ${err.line}, column ${err.column}`;
    return ['Valid JSON', ...this.stats().filter((s) => s.label !== 'Size').map((s) => `${s.label}: ${s.value}`)].join('\n');
  }
}
class JwtCheck extends JwtDecoderComponent {
  run(token: string) {
    this.onInput({ target: { value: token } } as unknown as Event);
    return this.error() || `Header:\n${this.headerJson()}\nPayload:\n${this.payloadJson()}`;
  }
}
class UuidCheck extends UuidGeneratorComponent {
  run(braced: boolean) { this.format.set(braced ? 'braced' : 'compact'); return this.sample(); }
}
class Base64Check extends Base64EncoderComponent {
  run(text: string, urlSafe: boolean) { this.input.set(text); this.urlSafe.set(urlSafe); return this.output(); }
}
class UrlCheck extends UrlEncoderComponent {
  run(text: string, decode: boolean) { this.input.set(text); this.mode.set(decode ? 'decode' : 'encode'); return this.output(); }
}
class EntityCheck extends HtmlEntityEncoderComponent {
  run(text: string, full: boolean) { this.input.set(text); this.full.set(full); return this.output(); }
}
class HashCheck extends HashGeneratorComponent {
  async run(text: string) {
    this.onText(text);
    await new Promise((resolve) => setTimeout(resolve, 50));
    return this.results().filter((r) => r.algorithm === 'SHA-1' || r.algorithm === 'SHA-256')
      .map((r) => `${r.algorithm}: ${r.hash}`).join('\n');
  }
}
class SqlCheck extends SqlFormatterComponent {
  run(text: string, minify: boolean) { this.input.set(text); this.mode.set(minify ? 'minify' : 'format'); return this.output(); }
}
class YamlCheck extends YamlFormatterComponent {
  run(text: string, toYaml: boolean) { this.direction.set(toYaml ? 'toYaml' : 'toJson'); this.input.set(text); return this.output(); }
}
class CronCheck extends CronGeneratorComponent {
  run(expression: string) { this.parts.set(expression.split(' ')); return this.description(); }
}

const execute: Record<string, (input: string, index: number) => string | Promise<string>> = {
  'json-formatter': (input, i) => new JsonFormatCheck().run(input, i === 1),
  'json-validator': (input) => new JsonValidCheck().run(input),
  'jwt-decoder': (input) => new JwtCheck().run(input),
  'uuid-generator': (_, i) => inContext(() => new UuidCheck()).run(i === 0),
  'base64-encoder': (input, i) => new Base64Check().run(input, i === 1),
  'url-encoder': (input, i) => new UrlCheck().run(input, i === 1),
  'html-entity-encoder': (input, i) => inContext(() => new EntityCheck()).run(input, i === 1),
  'hash-generator': (input) => inContext(() => new HashCheck()).run(input),
  'sql-formatter': (input, i) => new SqlCheck().run(input, i === 1),
  'yaml-formatter': (input, i) => new YamlCheck().run(input, i === 1),
  'cron-generator': (input) => inContext(() => new CronCheck()).run(input),
};

describe('developer tool worked examples', () => {
  for (const [id, guide] of Object.entries(DEVELOPER_GUIDES)) {
    // Regex examples run against the real worker in tests/regex-worker.test.mjs.
    if (id === 'regex-tester') continue;
    guide.examples.forEach((example, i) => {
      it(`${id}: ${example.title}`, async () => { const actual = await execute[id](example.input, i); expect(actual).toBe(example.output); });
    });
  }
});
