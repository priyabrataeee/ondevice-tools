import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { TEXT_GUIDES } from './text';
import { WordCounterComponent } from '../../../tools/text/word-counter/word-counter.component';
import { CharacterCounterComponent } from '../../../tools/text/character-counter/character-counter.component';
import { ReadingTimeComponent } from '../../../tools/text/reading-time/reading-time.component';
import { CaseConverterComponent } from '../../../tools/text/case-converter/case-converter.component';
import { LoremIpsumComponent } from '../../../tools/text/lorem-ipsum/lorem-ipsum.component';
import { RemoveExtraSpacesComponent } from '../../../tools/text/remove-extra-spaces/remove-extra-spaces.component';

const inContext = <T>(create: () => T): T => TestBed.runInInjectionContext(create);
const lines = (rows: { label: string; value: string }[], labels: string[]) =>
  labels.map((label) => `${label}: ${rows.find((r) => r.label === label)?.value}`).join('\n');

class WordCheck extends WordCounterComponent {
  run(text: string) {
    this.input.set(text);
    const rows = [...this.headline(), ...this.details()];
    return lines(rows, ['Words', 'Characters', 'Sentences', 'Paragraphs', 'Read time']);
  }
}
class CharacterCheck extends CharacterCounterComponent {
  run(text: string) {
    this.input.set(text);
    return `Length: ${this.length()}\nVisible characters: ${this.visible()}\nWithout spaces: ${this.noSpaces()}`;
  }
}
class ReadingCheck extends ReadingTimeComponent {
  run(text: string, spm: number) {
    this.input.set(text); this.spm.set(spm);
    return `Words: ${this.words()}\nReading time: ${this.readTime()}\nSpeaking time: ${this.speakTime()}`;
  }
}
class CaseCheck extends CaseConverterComponent {
  run(text: string, labels: string[]) {
    this.input.set(text);
    return lines(this.results().map((r) => ({ label: r.label, value: r.value })), labels);
  }
}
class LoremCheck extends LoremIpsumComponent {
  run(unit: 'words' | 'sentences', count: number) {
    this.unit.set(unit); this.count.set(count); this.generate();
    return this.output();
  }
}
class SpacesCheck extends RemoveExtraSpacesComponent {
  run(text: string, singleLine: boolean) {
    this.input.set(text);
    if (singleLine) this.toggle('singleLine');
    return this.output();
  }
}

const execute: Record<string, (input: string, index: number) => string> = {
  'word-counter': (input) => new WordCheck().run(input),
  'character-counter': (input) => new CharacterCheck().run(input),
  'reading-time': (input, i) => new ReadingCheck().run(input, i ? 120 : 150),
  'case-converter': (input, i) => new CaseCheck().run(input, i
    ? ['Title Case', 'Sentence case']
    : ['camelCase', 'PascalCase', 'snake_case', 'CONSTANT_CASE', 'kebab-case']),
  'lorem-ipsum': (_, i) => inContext(() => new LoremCheck()).run(i ? 'sentences' : 'words', i ? 1 : 5),
  'remove-extra-spaces': (input, i) => new SpacesCheck().run(input, i === 1),
};

describe('text tool worked examples', () => {
  for (const [id, guide] of Object.entries(TEXT_GUIDES)) {
    guide.examples.forEach((example, i) => {
      it(`${id}: ${example.title}`, () => expect(execute[id](example.input, i)).toBe(example.output));
    });
  }
});
