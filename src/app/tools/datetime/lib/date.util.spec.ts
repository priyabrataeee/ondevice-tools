import { describe, expect, it } from 'vitest';
import { calendarDiff } from './date.util';

const diff = (a: string, b: string) => {
  const [y1, m1, d1] = a.split('-').map(Number);
  const [y2, m2, d2] = b.split('-').map(Number);
  return calendarDiff(new Date(y1, m1 - 1, d1), new Date(y2, m2 - 1, d2));
};

describe('calendarDiff', () => {
  it('never returns negative days when the start day is missing from a month', () => {
    expect(diff('2026-01-31', '2026-03-01')).toEqual({ years: 0, months: 0, days: 29 });
    expect(diff('2026-03-31', '2026-05-01')).toEqual({ years: 0, months: 1, days: 0 });
  });
  it('treats a 29 February birthday as 1 March in common years', () => {
    expect(diff('2000-02-29', '2026-02-28')).toEqual({ years: 25, months: 11, days: 30 });
    expect(diff('2000-02-29', '2026-03-01')).toEqual({ years: 26, months: 0, days: 0 });
  });
  it('handles ordinary spans and reversed input', () => {
    expect(diff('1990-08-15', '2026-11-04')).toEqual({ years: 36, months: 2, days: 20 });
    expect(diff('2026-11-04', '1990-08-15')).toEqual({ years: 36, months: 2, days: 20 });
  });
});
