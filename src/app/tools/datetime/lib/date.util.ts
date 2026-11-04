/** Calendar helpers shared by the date and time tools. */

export interface DateParts {
  years: number;
  months: number;
  days: number;
}

/** `YYYY-MM-DD` string for an `<input type="date">`. */
export function toDateInput(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/**
 * Parses `YYYY-MM-DD` as a local date.
 * `new Date('2026-01-01')` parses as UTC midnight, which lands on the previous
 * day for anyone west of Greenwich — hence the explicit construction.
 */
export function fromDateInput(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!match) return null;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return Number.isNaN(date.getTime()) ? null : date;
}

/** Whole calendar years, months and days between two dates. */
export function calendarDiff(from: Date, to: Date): DateParts {
  let start = from;
  let end = to;
  if (start > end) [start, end] = [end, start];

  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate();

  if (days < 0) {
    // Step back to the last monthly anniversary on or before the end date.
    // Borrowing the length of the previous month instead went negative when
    // the start day does not exist in that month (31 January to 1 March gave
    // "1 month, −2 days"). A missing start day rolls into the next month, so
    // 31 January + 1 month is 3 March and a 29 February birthday falls on
    // 1 March in common years.
    do {
      months--;
      const anniversary = new Date(start.getFullYear() + years, start.getMonth() + months, start.getDate());
      days = daysBetween(anniversary, end);
    } while (days < 0);
  }
  while (months < 0) {
    years--;
    months += 12;
  }

  return { years, months, days };
}

const MS_PER_DAY = 86_400_000;

/** Whole days between two dates, unaffected by daylight saving shifts. */
export function daysBetween(from: Date, to: Date): number {
  const a = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate());
  const b = Date.UTC(to.getFullYear(), to.getMonth(), to.getDate());
  return Math.round((b - a) / MS_PER_DAY);
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date.getTime());
  result.setDate(result.getDate() + days);
  return result;
}

export function addMonths(date: Date, months: number): Date {
  const result = new Date(date.getTime());
  const targetDay = result.getDate();
  result.setDate(1);
  result.setMonth(result.getMonth() + months);
  // Clamp 31 January + 1 month to 28/29 February rather than rolling into March.
  const daysInTarget = new Date(result.getFullYear(), result.getMonth() + 1, 0).getDate();
  result.setDate(Math.min(targetDay, daysInTarget));
  return result;
}

/** Counts working days in a range, honouring a custom weekend and holidays. */
export function countWorkingDays(
  from: Date,
  to: Date,
  weekend: number[],
  holidays: Set<string>,
): { working: number; weekendDays: number; holidayDays: number; total: number } {
  let start = from;
  let end = to;
  if (start > end) [start, end] = [end, start];

  let working = 0;
  let weekendDays = 0;
  let holidayDays = 0;
  let total = 0;

  const cursor = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const last = new Date(end.getFullYear(), end.getMonth(), end.getDate());

  while (cursor <= last) {
    total++;
    if (weekend.includes(cursor.getDay())) {
      weekendDays++;
    } else if (holidays.has(toDateInput(cursor))) {
      holidayDays++;
    } else {
      working++;
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  return { working, weekendDays, holidayDays, total };
}

/** Adds a number of working days to a date, skipping non-working days. */
export function addWorkingDays(
  start: Date,
  count: number,
  weekend: number[],
  holidays: Set<string>,
): Date {
  const cursor = new Date(start.getTime());
  const step = count >= 0 ? 1 : -1;
  let remaining = Math.abs(count);

  // Cap the search so a fully non-working week cannot loop forever.
  let guard = 0;
  while (remaining > 0 && guard++ < 100_000) {
    cursor.setDate(cursor.getDate() + step);
    if (weekend.includes(cursor.getDay())) continue;
    if (holidays.has(toDateInput(cursor))) continue;
    remaining--;
  }

  return cursor;
}

export const WEEKDAY_NAMES = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
];
