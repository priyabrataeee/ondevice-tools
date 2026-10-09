import { describe, expect, it } from 'vitest';
import { CurrencyConverterComponent } from './currency-converter.component';

class TestConverter extends CurrencyConverterComponent {
  verify() {
    this.customRate.set('2');
    return { output: this.converted(), row: this.table().find(r => r.code === this.to())?.value };
  }
  swapped() { this.customRate.set('2'); this.swap(); return this.customRate(); }
  invalid() { this.customRate.set('-1'); return this.converted(); }
}
describe('currency pair override', () => {
  it('keeps selected table row consistent', () => {
    const result = new TestConverter().verify();
    expect(result.output).toBe(result.row);
    expect(Number(result.output)).toBe(200);
  });
  it('clears override when swapping', () => expect(new TestConverter().swapped()).toBe(''));
  it('does not silently substitute a rate for invalid input', () => expect(new TestConverter().invalid()).toBe(''));
});
