import { describe, expect, it } from 'vitest';
import { CALCULATOR_GUIDES } from './calculator';
import { PercentageCalculatorComponent } from '../../../tools/calculator/percentage-calculator/percentage-calculator.component';
import { EmiCalculatorComponent } from '../../../tools/calculator/emi-calculator/emi-calculator.component';
import { GstCalculatorComponent } from '../../../tools/calculator/gst-calculator/gst-calculator.component';
import { SipCalculatorComponent } from '../../../tools/calculator/sip-calculator/sip-calculator.component';
import { CompoundInterestCalculatorComponent } from '../../../tools/calculator/compound-interest-calculator/compound-interest-calculator.component';
import { DiscountCalculatorComponent } from '../../../tools/calculator/discount-calculator/discount-calculator.component';

class PercentCheck extends PercentageCalculatorComponent {
  run(i: number) {
    if (i === 0) { this.a2.set(45); this.b2.set(180); return `Result: ${this.result2()}`; }
    this.a3.set(75); this.b3.set(50); return `Change: ${this.result3()}`;
  }
}
class EmiCheck extends EmiCalculatorComponent {
  run(i: number) {
    if (i === 0) { this.principal.set(2500000); this.rate.set(8.5); this.years.set(20); }
    else { this.principal.set(500000); this.rate.set(10.5); this.years.set(5); }
    return `Monthly EMI: ${this.money(this.emi())}\nTotal interest: ${this.money(this.totalInterest())}\nTotal payment: ${this.money(this.totalPayment())}`;
  }
}
class GstCheck extends GstCalculatorComponent {
  run(i: number) {
    this.rate.set(18);
    if (i === 0) { this.mode.set('add'); this.amount.set(1000); } else { this.mode.set('remove'); this.amount.set(1180); }
    return `Net: ${this.money(this.net())}\nGST: ${this.money(this.tax())}\nGross: ${this.money(this.gross())}`;
  }
}
class SipCheck extends SipCalculatorComponent {
  run(i: number) {
    this.monthly.set(10000); this.annualReturn.set(12); this.years.set(15); this.stepUp.set(i ? 10 : 0);
    return `Invested: ${this.money(this.totalInvested())}\nGain: ${this.money(this.totalGain())}\nProjected value: ${this.money(this.maturity())}`;
  }
}
class CompoundCheck extends CompoundInterestCalculatorComponent {
  run(i: number) {
    this.principal.set(100000); this.monthly.set(0); this.rate.set(8); this.years.set(10); this.frequency.set(i ? 12 : 1);
    return `Final balance: ${this.money(this.finalBalance())}\nInterest earned: ${this.money(this.totalInterest())}`;
  }
}
class DiscountCheck extends DiscountCalculatorComponent {
  run(i: number) {
    this.price.set(2499); this.tax.set(0);
    if (i === 0) { this.mode.set('apply'); this.discount.set(25); this.secondDiscount.set(10); }
    else { this.mode.set('derive'); this.paidPrice.set(1799); }
    return `You pay: ${this.money(this.finalPrice())}\nYou save: ${this.money(this.saved())}\nEffective discount: ${this.effectiveDiscount()}%`;
  }
}

const execute: Record<string, (index: number) => string> = {
  'percentage-calculator': (i) => new PercentCheck().run(i),
  'emi-calculator': (i) => new EmiCheck().run(i),
  'gst-calculator': (i) => new GstCheck().run(i),
  'sip-calculator': (i) => new SipCheck().run(i),
  'compound-interest-calculator': (i) => new CompoundCheck().run(i),
  'discount-calculator': (i) => new DiscountCheck().run(i),
};

describe('calculator worked examples', () => {
  for (const [id, guide] of Object.entries(CALCULATOR_GUIDES)) {
    guide.examples.forEach((example, i) => {
      it(`${id}: ${example.title}`, () => { const actual = execute[id](i); expect(actual).toBe(example.output); });
    });
  }
});
