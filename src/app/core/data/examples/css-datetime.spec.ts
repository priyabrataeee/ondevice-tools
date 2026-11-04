import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { CSS_DATETIME_GUIDES } from './css-datetime';
import { BoxShadowGeneratorComponent } from '../../../tools/css/box-shadow-generator/box-shadow-generator.component';
import { GradientGeneratorComponent } from '../../../tools/css/gradient-generator/gradient-generator.component';
import { BorderRadiusGeneratorComponent } from '../../../tools/css/border-radius-generator/border-radius-generator.component';
import { ClampGeneratorComponent } from '../../../tools/css/clamp-generator/clamp-generator.component';
import { FlexboxGeneratorComponent } from '../../../tools/css/flexbox-generator/flexbox-generator.component';
import { GridGeneratorComponent } from '../../../tools/css/grid-generator/grid-generator.component';
import { AgeCalculatorComponent } from '../../../tools/datetime/age-calculator/age-calculator.component';
import { DateDifferenceComponent } from '../../../tools/datetime/date-difference/date-difference.component';
import { WorkingDaysCalculatorComponent } from '../../../tools/datetime/working-days-calculator/working-days-calculator.component';
import { TimezoneConverterComponent } from '../../../tools/datetime/timezone-converter/timezone-converter.component';
import { toDateInput } from '../../../tools/datetime/lib/date.util';

const inContext = <T>(create: () => T): T => TestBed.runInInjectionContext(create);
const black = { color: '#000000', inset: false, x: 0, spread: 0 };

class ShadowCheck extends BoxShadowGeneratorComponent {
  run(i: number) {
    if (i === 1) this.layers.set([
      { ...black, id: 0, y: 1, blur: 3, opacity: 0.12 },
      { ...black, id: 1, y: 10, blur: 30, spread: -5, opacity: 0.2 },
    ]);
    return this.declaration();
  }
}
class GradientCheck extends GradientGeneratorComponent {
  run(i: number) {
    this.type.set(i ? 'radial' : 'linear'); this.angle.set(135); this.radialShape.set('circle');
    this.stops.set([{ id: 0, color: '#6366f1', position: 0 }, { id: 1, color: '#ec4899', position: 100 }]);
    return this.declaration();
  }
}
class RadiusCheck extends BorderRadiusGeneratorComponent {
  run(i: number) {
    this.unit.set('px'); this.elliptical.set(false);
    const corners = i ? { tl: 16, tr: 16, br: 0, bl: 0 } : { tl: 12, tr: 12, br: 12, bl: 12 };
    this.horizontal.set(corners); this.vertical.set(corners);
    return this.declaration();
  }
}
class ClampCheck extends ClampGeneratorComponent {
  run(i: number) {
    if (i) { this.minSize.set(32); this.maxSize.set(56); this.minViewport.set(375); this.maxViewport.set(1440); }
    else { this.minSize.set(16); this.maxSize.set(24); this.minViewport.set(320); this.maxViewport.set(1280); }
    return this.declaration();
  }
}
class FlexCheck extends FlexboxGeneratorComponent {
  run(i: number) {
    this.values.set(i
      ? { flexDirection: 'column', flexWrap: 'nowrap', justifyContent: 'flex-start', alignItems: 'stretch', alignContent: 'stretch' }
      : { flexDirection: 'row', flexWrap: 'nowrap', justifyContent: 'center', alignItems: 'center', alignContent: 'stretch' });
    this.gap.set(i ? 24 : 12);
    return this.css();
  }
}
class GridCheck extends GridGeneratorComponent {
  run(i: number) {
    this.mode.set(i ? 'responsive' : 'fixed'); this.columns.set(3); this.rows.set(2);
    this.columnGap.set(16); this.rowGap.set(16); this.minWidth.set(200);
    return this.css();
  }
}
class AgeCheck extends AgeCalculatorComponent {
  run(birth: string, asOf: string) {
    this.birthDate.set(birth); this.asOf.set(asOf);
    const a = this.age()!;
    const days = this.totals().find((t) => t.label === 'Total days')?.value;
    return `${a.years} years, ${a.months} months, ${a.days} days\nTotal days: ${days}`;
  }
}
class DiffCheck extends DateDifferenceComponent {
  run(i: number) {
    this.start.set('2026-01-31');
    if (i) { this.mode.set('add'); this.amount.set(1); this.unit.set('months'); return `Result: ${toDateInput(this.resultDate()!)}`; }
    this.mode.set('between'); this.end.set('2026-03-01');
    const d = this.difference()!;
    const total = this.totals().find((t) => t.label === 'Total days')?.value;
    return `${d.years} years, ${d.months} months, ${d.days} days\nTotal days: ${total}`;
  }
}
class WorkingCheck extends WorkingDaysCalculatorComponent {
  run(i: number) {
    this.mode.set('count'); this.start.set('2026-12-01'); this.end.set('2026-12-31');
    this.weekend.set(i ? [5, 6] : [0, 6]); this.holidayText.set(i ? '' : '2026-12-25');
    const c = this.counts()!;
    return `Calendar days: ${c.total}\nWeekend days: ${c.weekendDays}\nHolidays: ${c.holidayDays}\nWorking days: ${c.working}`;
  }
}
class ZoneCheck extends TimezoneConverterComponent {
  run(input: string) {
    this.sourceZone.set('America/New_York');
    this.selectedZones.set(['America/New_York', 'Europe/London', 'Asia/Kolkata']);
    this.dateTime.set(input.replace(' ', 'T'));
    return this.rows().map((r) => `${r.zone}: ${r.time} (${r.offset})`).join('\n');
  }
}

const execute: Record<string, (input: string, index: number) => string> = {
  'box-shadow-generator': (_, i) => new ShadowCheck().run(i),
  'gradient-generator': (_, i) => new GradientCheck().run(i),
  'border-radius-generator': (_, i) => new RadiusCheck().run(i),
  'clamp-generator': (_, i) => new ClampCheck().run(i),
  'flexbox-generator': (_, i) => new FlexCheck().run(i),
  'grid-generator': (_, i) => new GridCheck().run(i),
  'age-calculator': (input, i) => inContext(() => new AgeCheck()).run(input.replace('Born ', ''), i ? '2026-02-28' : '2026-11-04'),
  'date-difference': (_, i) => inContext(() => new DiffCheck()).run(i),
  'working-days-calculator': (_, i) => inContext(() => new WorkingCheck()).run(i),
  'timezone-converter': (input) => inContext(() => new ZoneCheck()).run(input),
};

describe('CSS and date worked examples', () => {
  for (const [id, guide] of Object.entries(CSS_DATETIME_GUIDES)) {
    guide.examples.forEach((example, i) => {
      it(`${id}: ${example.title}`, () => { const actual = execute[id](example.input, i); expect(actual).toBe(example.output); });
    });
  }
});
