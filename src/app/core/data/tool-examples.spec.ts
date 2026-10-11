import { describe, expect, it } from 'vitest';
import { TOOL_GUIDES } from './tool-examples';
import { SortLinesComponent } from '../../tools/text/sort-lines/sort-lines.component';
import { RemoveDuplicateLinesComponent } from '../../tools/text/remove-duplicate-lines/remove-duplicate-lines.component';
import { ReverseTextComponent } from '../../tools/text/reverse-text/reverse-text.component';
import { SlugGeneratorComponent } from '../../tools/text/slug-generator/slug-generator.component';
import { JsonMinifierComponent } from '../../tools/developer/json-minifier/json-minifier.component';
import { formatXml, minifyXml } from '../../tools/developer/lib/xml-format';

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

describe('published worked examples', () => {
  const execute: Record<string, (input: string, index: number) => string> = {
    'sort-lines': (input, i) => new SortCheck().run(input, i ? 'numeric' : 'natural'),
    'remove-duplicate-lines': (input, i) => new DedupeCheck().run(input, i === 1),
    'reverse-text': (input, i) => new ReverseCheck().run(input, i === 1),
    'slug-generator': (input, i) => new SlugCheck().run(input, i === 1),
    'json-minifier': (input) => new JsonCheck().run(input),
    'xml-formatter': (input) => formatXml(input).output,
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
