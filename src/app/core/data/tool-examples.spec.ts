import { describe, expect, it } from 'vitest';
import { TOOL_GUIDES } from './tool-examples';
import { SortLinesComponent } from '../../tools/text/sort-lines/sort-lines.component';
import { RemoveDuplicateLinesComponent } from '../../tools/text/remove-duplicate-lines/remove-duplicate-lines.component';
import { ReverseTextComponent } from '../../tools/text/reverse-text/reverse-text.component';
import { SlugGeneratorComponent } from '../../tools/text/slug-generator/slug-generator.component';
import { JsonMinifierComponent } from '../../tools/developer/json-minifier/json-minifier.component';
import { formatXml, minifyXml } from '../../tools/developer/lib/xml-format';
import { TestBed } from '@angular/core/testing';
import { CropImageComponent } from '../../tools/image/crop-image/crop-image.component';
import { TimestampConverterComponent } from '../../tools/developer/timestamp-converter/timestamp-converter.component';
import { compareText, toUnifiedDiff } from '../../tools/text/lib/diff.util';

class SortCheck extends SortLinesComponent {
  run(text: string, mode: 'natural' | 'numeric', descending = false) {
    this.input.set(text); this.mode.set(mode); this.descending.set(descending); return this.output();
  }
}
class DedupeCheck extends RemoveDuplicateLinesComponent {
  run(text: string, duplicates = false) {
    this.input.set(text); this.ignoreCase.set(true); this.mode.set(duplicates ? 'duplicates' : 'unique'); return this.output();
  }
}
class ReverseCheck extends ReverseTextComponent {
  run(text: string, words = false) {
    this.input.set(text); this.mode.set(words ? 'words' : 'characters'); return this.output();
  }
}
class SlugCheck extends SlugGeneratorComponent {
  run(text: string, stopWords = false) {
    this.input.set(text); this.removeStopWords.set(stopWords); return this.allSlugs();
  }
}
class JsonCheck extends JsonMinifierComponent {
  run(text: string) { this.input.set(text); return this.output(); }
}
class CropCheck extends CropImageComponent {
  run(input: string, ratio: number) {
    const [, width, height] = /(\d+) × (\d+)/.exec(input)!;
    this.naturalWidth.set(+width); this.naturalHeight.set(+height); this.ratio.set(ratio); this.centerCrop();
    return `Crop area: ${this.cropWidth()} × ${this.cropHeight()} px\nOffset: x ${this.cropX()}, y ${this.cropY()}`;
  }
}
class TimestampCheck extends TimestampConverterComponent {
  run(input: string) {
    this.timestamp.set(input);
    return `ISO 8601 (UTC): ${this.fromTimestamp()[0].value}\nInterpreted as: ${this.resolvedUnit()}`;
  }
}
/** Example inputs hold both sides as `ORIGINAL\n…\nCHANGED\n…`. */
function diffExample(input: string, ignore: boolean): string {
  const [left, right] = input.replace(/^ORIGINAL\n/, '').split('\nCHANGED\n');
  const options = { ignoreCase: ignore, ignoreWhitespace: ignore, ignoreBlankLines: false };
  return toUnifiedDiff(compareText(left, right, options).rows);
}
const inContext = <T>(create: () => T): T => TestBed.runInInjectionContext(create);

describe('published worked examples', () => {
  const execute: Record<string, (input: string, index: number) => string> = {
    'sort-lines': (input, i) => new SortCheck().run(input, i ? 'numeric' : 'natural'),
    'remove-duplicate-lines': (input, i) => new DedupeCheck().run(input, i === 1),
    'reverse-text': (input, i) => new ReverseCheck().run(input, i === 1),
    'slug-generator': (input, i) => new SlugCheck().run(input, i === 1),
    'json-minifier': (input) => new JsonCheck().run(input),
    'xml-formatter': (input) => formatXml(input).output,
    'crop-image': (input, i) => inContext(() => new CropCheck()).run(input, i ? 16 / 9 : 1),
    'text-compare': (input, i) => diffExample(input, i === 1),
    'timestamp-converter': (input) => inContext(() => new TimestampCheck()).run(input),
  };
  for (const [id, guide] of Object.entries(TOOL_GUIDES)) {
    guide.examples.forEach((example, i) => {
      it(`${id}: ${example.title}`, () => {
        expect(execute[id](example.input, i)).toBe(example.output);
        if (id === 'xml-formatter' && i === 1) expect(minifyXml(example.input).output).toBe(example.output);
      });
    });
  }
  it('sorts descending stably, keeping nonnumeric lines last', () => {
    expect(new SortCheck().run('2 first\nunknown\n2 second\n9 high', 'numeric', true))
      .toBe('9 high\n2 first\n2 second\nunknown');
  });
});
