const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/**
 * `2026-11-04` → `4 November 2026`. Formatted by hand rather than with Intl so
 * the prerendered HTML and the hydrated page agree whatever the visitor's locale.
 */
export function formatLongDate(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number);
  return `${day} ${MONTHS[month - 1]} ${year}`;
}
