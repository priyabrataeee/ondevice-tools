import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, expect, it } from 'vitest';
import { COLOR_CONVERTER_GUIDES } from './color-converter';
import { ColorConverterComponent } from '../../../tools/color/color-converter/color-converter.component';
import { ContrastCheckerComponent } from '../../../tools/color/contrast-checker/contrast-checker.component';
import { TemperatureConverterComponent } from '../../../tools/converter/temperature-converter/temperature-converter.component';
import { CurrencyConverterComponent } from '../../../tools/converter/currency-converter/currency-converter.component';
import { UnitConverterComponent } from '../../../tools/converter/shared/unit-converter.component';
import { AREA, LENGTH } from '../../../tools/converter/lib/units';

class ColorCheck extends ColorConverterComponent {
  run(input: string) {
    this.input.set(input);
    return this.formats().filter((f) => f.label !== 'CSS var').map((f) => `${f.label}: ${f.value}`).join('\n');
  }
}
class ContrastCheck extends ContrastCheckerComponent {
  run(input: string) {
    const [fg, bg] = input.split(' on ');
    this.foreground.set(fg); this.background.set(bg);
    return [`Contrast ratio: ${this.ratio()!.toFixed(2)}:1`, ...this.checks().map((c) => `${c.label}: ${c.passes ? 'Pass' : 'Fail'}`)].join('\n');
  }
}
class TemperatureCheck extends TemperatureConverterComponent {
  run(input: string, unit: 'c' | 'f') {
    this.value.set(input); this.unit.set(unit);
    return this.results().map((r) => `${r.name}: ${r.display}`).join('\n');
  }
}
class CurrencyCheck extends CurrencyConverterComponent {
  run(input: string, rate: string) {
    this.amount.set(input); this.from.set('USD'); this.to.set('EUR'); this.customRate.set(rate);
    return this.invalidRate() ? 'No result: Enter a positive, finite exchange rate.' : `100 USD = ${this.converted()} EUR`;
  }
}

/** Renders the shared converter so its real inputs and output table are exercised. */
function unitRows(input: string, area: boolean, units: string[]): string {
  TestBed.configureTestingModule({ providers: [provideRouter([])] });
  const fixture = TestBed.createComponent(UnitConverterComponent);
  fixture.componentRef.setInput('toolId', 'unit-converter');
  fixture.componentRef.setInput('group', area ? AREA : LENGTH);
  fixture.componentRef.setInput('defaultUnit', area ? 'gaj' : 'km');
  const component = fixture.componentInstance as unknown as {
    value: { set(v: string): void };
    results(): { id: string; name: string; symbol: string; display: string }[];
  };
  component.value.set(input);
  return component.results().filter((r) => units.includes(r.id)).map((r) => `${r.name}: ${r.display} ${r.symbol}`).join('\n');
}

const execute: Record<string, (input: string, index: number) => string> = {
  'color-converter': (input) => new ColorCheck().run(input),
  'contrast-checker': (input) => new ContrastCheck().run(input),
  'temperature-converter': (input, i) => new TemperatureCheck().run(input, i ? 'f' : 'c'),
  'unit-converter': (input, i) => i
    ? unitRows(input, true, ['ft2', 'm2', 'ac'])
    : unitRows(input, false, ['m', 'mi', 'ft']),
  'currency-converter': (input, i) => new CurrencyCheck().run(input, i ? '-1' : '0.92'),
};

describe('colour and converter worked examples', () => {
  for (const [id, guide] of Object.entries(COLOR_CONVERTER_GUIDES)) {
    guide.examples.forEach((example, i) => {
      it(`${id}: ${example.title}`, () => { const actual = execute[id](example.input, i); expect(actual).toBe(example.output); });
    });
  }
});
