import type { ToolGuide } from '../tool-examples';

/** CSS and date tools; each example is executed in css-datetime.spec.ts. */
export const CSS_DATETIME_GUIDES: Record<string, ToolGuide> = {
  'box-shadow-generator': {
    examples: [
      {
        title: 'The default soft shadow',
        settings: 'One layer: x 0, y 8, blur 24, spread −6, black at 18%',
        input: '(default settings)',
        output: 'box-shadow: 0px 8px 24px -6px rgba(0, 0, 0, 0.18);',
        explanation: 'A negative spread pulls the shadow in from the edges, so it shows mostly below the element and looks like soft overhead light.',
      },
      {
        title: 'A two-layer card shadow',
        settings: 'Layer 1: y 1, blur 3, black at 12%. Layer 2: y 10, blur 30, spread −5, black at 20%',
        input: '(two layers)',
        output: 'box-shadow:\n  0px 1px 3px 0px rgba(0, 0, 0, 0.12),\n  0px 10px 30px -5px rgba(0, 0, 0, 0.2);',
        explanation: 'Layers are comma-separated and the first is drawn on top. A tight shadow defines the edge and a wide one adds depth.',
      },
    ],
    limitations: [
      'Large blur radii on many elements can slow scrolling on low-end phones; prefer one or two layers.',
      'Shadows follow the element’s border-radius but not the shape of transparent images; use filter: drop-shadow() for those.',
      'Colours are written as rgba() so opacity is explicit.',
    ],
  },
  'gradient-generator': {
    examples: [
      {
        title: 'A diagonal two-colour background',
        settings: 'Linear, 135°, stops #6366f1 at 0% and #ec4899 at 100%',
        input: '(two stops)',
        output: 'background: linear-gradient(135deg, #6366f1 0%, #ec4899 100%);',
        explanation: '135° runs from the top-left corner to the bottom-right. Positions are percentages along that line.',
      },
      {
        title: 'A radial glow',
        settings: 'Radial circle, same stops',
        input: '(two stops)',
        output: 'background: radial-gradient(circle at center, #6366f1 0%, #ec4899 100%);',
        explanation: 'A radial gradient starts at the centre and spreads outward; circle keeps it round on rectangular elements.',
      },
    ],
    limitations: [
      'Gradients between very different hues can look muddy in the middle because they blend in sRGB.',
      'Gradients are images in CSS, so use background or background-image, not background-color.',
      'Conic gradients need browsers from 2021 onward.',
    ],
  },
  'border-radius-generator': {
    examples: [
      {
        title: 'Equal rounded corners in pixels',
        settings: 'Unit px, all corners 12',
        input: '(all corners 12)',
        output: 'border-radius: 12px;',
        explanation: 'When every corner matches, the shorthand collapses to one value.',
      },
      {
        title: 'A tab with only the top corners rounded',
        settings: 'Unit px, top-left and top-right 16, bottom corners 0',
        input: '(top corners 16)',
        output: 'border-radius: 16px 16px 0px 0px;',
        explanation: 'The four values run clockwise from the top-left: top-left, top-right, bottom-right, bottom-left.',
      },
    ],
    limitations: [
      'Percentages are relative to the element’s width and height, so 50% makes a circle only on a square element.',
      'Radii larger than the element are scaled down proportionally by the browser.',
      'Child elements and images can poke out of rounded corners unless the parent has overflow: hidden.',
    ],
  },
  'clamp-generator': {
    examples: [
      {
        title: 'Body text from 16 to 24 px',
        settings: 'Minimum 16 px at 320 px wide, maximum 24 px at 1280 px wide',
        input: '16 → 24 px, 320 → 1280 px',
        output: 'font-size: clamp(1rem, 0.8333rem + 0.8333vw, 1.5rem);',
        explanation: 'The size grows linearly between the two viewport widths and is fixed outside them. Limits are written in rem, assuming a 16 px root size, so they follow the reader’s browser font-size setting.',
      },
      {
        title: 'A large heading',
        settings: 'Minimum 32 px at 375 px wide, maximum 56 px at 1440 px wide',
        input: '32 → 56 px, 375 → 1440 px',
        output: 'font-size: clamp(2rem, 1.4718rem + 2.2535vw, 3.5rem);',
        explanation: 'Headings usually change more between phone and desktop than body text, so the slope is steeper.',
      },
    ],
    limitations: [
      'The minimum viewport must be smaller than the maximum and both must be positive; otherwise no formula is produced.',
      'clamp() needs browsers from 2020 onward.',
      'Check that text still reflows when zoomed to 200%, as WCAG requires; vw-based sizes can resist zoom on their own.',
    ],
  },
  'flexbox-generator': {
    examples: [
      {
        title: 'Centre items in both directions',
        settings: 'Row, no wrap, justify center, align center, gap 12',
        input: '(four items)',
        output: '.container {\n  display: flex;\n  flex-direction: row;\n  flex-wrap: nowrap;\n  justify-content: center;\n  align-items: center;\n  align-content: stretch;\n  gap: 12px;\n}\n\n.item {\n  flex: 0 1 auto;\n}',
        explanation: 'justify-content works along the main axis (horizontal for a row) and align-items across it.',
      },
      {
        title: 'A vertical stack with even spacing',
        settings: 'Column, no wrap, justify flex-start, align stretch, gap 24',
        input: '(four items)',
        output: '.container {\n  display: flex;\n  flex-direction: column;\n  flex-wrap: nowrap;\n  justify-content: flex-start;\n  align-items: stretch;\n  align-content: stretch;\n  gap: 24px;\n}\n\n.item {\n  flex: 0 1 auto;\n}',
        explanation: 'gap spaces the items without margins on the first or last item, which avoids the usual margin-collapsing workarounds.',
      },
    ],
    limitations: [
      'Flexbox lays out one dimension at a time. For rows and columns together, use CSS Grid.',
      'align-content only has an effect when items wrap onto more than one line.',
      'The item settings apply to every child; real layouts often need different flex values per child.',
    ],
  },
  'grid-generator': {
    examples: [
      {
        title: 'A fixed three-column grid',
        settings: 'Fixed, 3 columns, 2 rows, gaps 16 px',
        input: '(six items)',
        output: '.grid {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  grid-template-rows: repeat(2, minmax(64px, auto));\n  gap: 16px;\n}',
        explanation: '1fr shares the free space equally between columns. minmax(64px, auto) gives each row a minimum height but lets it grow with content.',
      },
      {
        title: 'A responsive card grid with no media queries',
        settings: 'Responsive, minimum column width 200 px, gaps 16 px',
        input: '(six items)',
        output: '.grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));\n  gap: 16px;\n}',
        explanation: 'auto-fit with minmax() fits as many 200 px columns as the container allows and stretches them to fill the row, so the grid adapts to any width.',
      },
    ],
    limitations: [
      'auto-fit collapses empty tracks; switch to auto-fill if you want empty columns kept.',
      'Named grid areas and spanning items are not generated; add grid-column or grid-area to children yourself.',
      'Subgrid is not covered.',
    ],
  },
  'age-calculator': {
    examples: [
      {
        title: 'An exact age on a given date',
        settings: 'Age on 2026-11-04',
        input: 'Born 1990-08-15',
        output: '36 years, 2 months, 20 days\nTotal days: 13,230',
        explanation: 'Years are counted first, then whole months, then the remaining days, which is how age is defined legally.',
      },
      {
        title: 'A leap-day birthday in a common year',
        settings: 'Age on 2026-02-28',
        input: 'Born 2000-02-29',
        output: '25 years, 11 months, 30 days\nTotal days: 9,496',
        explanation: 'There is no 29 February in 2026, so the birthday falls on 1 March and the person is not yet 26 on 28 February.',
      },
    ],
    limitations: [
      'Dates are calendar dates without times, so the hour of birth and time zone are ignored.',
      'Some countries count age differently for legal purposes, such as from conception or by calendar year.',
      'Dates before 1 January 1900 or far in the future may display but are not tested.',
    ],
  },
  'date-difference': {
    examples: [
      {
        title: 'The gap across a short month',
        settings: 'Between two dates, end date not included',
        input: '2026-01-31 to 2026-03-01',
        output: '0 years, 0 months, 29 days\nTotal days: 29',
        explanation: 'Adding a month to 31 January would land on “31 February”, which rolls past 1 March, so a whole month has not yet passed: the gap is 29 days. Counting by months is ambiguous at month ends; the day total is not.',
      },
      {
        title: 'Add one month to 31 January',
        settings: 'Add to a date, 1 month',
        input: '2026-01-31',
        output: 'Result: 2026-02-28',
        explanation: 'When adding, there is no 31 February, so the result is clamped to the last day of February rather than spilling into March. This matches how most billing systems add a month.',
      },
    ],
    limitations: [
      'Include the end date when counting both the first and last day, such as hotel nights versus days of a trip.',
      'Hours and minutes are whole-day multiples; time-of-day and daylight-saving changes are not modelled.',
      'Months and years are calendar units, so “1 month” is not a fixed number of days.',
    ],
  },
  'working-days-calculator': {
    examples: [
      {
        title: 'Business days in December with a holiday',
        settings: 'Weekend Saturday and Sunday, holiday 2026-12-25',
        input: '2026-12-01 to 2026-12-31',
        output: 'Calendar days: 31\nWeekend days: 8\nHolidays: 1\nWorking days: 22',
        explanation: 'Weekends and the listed holiday are removed from the 31 calendar days. Both the start and end dates are counted.',
      },
      {
        title: 'The same month with a Friday–Saturday weekend',
        settings: 'Weekend Friday and Saturday, no holidays',
        input: '2026-12-01 to 2026-12-31',
        output: 'Calendar days: 31\nWeekend days: 8\nHolidays: 0\nWorking days: 23',
        explanation: 'Weekends differ by country, so pick yours. December 2026 has four Fridays, four Saturdays and four Sundays, so both weekends remove 8 days; with no holiday listed, one more day counts as working.',
      },
    ],
    limitations: [
      'Holidays are only the dates you enter; the tool does not know any country’s public holidays.',
      'A holiday that falls on a weekend is not double-counted.',
      'Half-days and shift patterns are not modelled.',
    ],
  },
  'timezone-converter': {
    examples: [
      {
        title: 'A New York call in March, between clock changes',
        settings: 'Source zone America/New_York, compared with Europe/London and Asia/Kolkata',
        input: '2026-03-10 09:00',
        output: 'America/New_York: 09:00 (UTC-04:00)\nEurope/London: 13:00 (UTC+00:00)\nAsia/Kolkata: 18:30 (UTC+05:30)',
        explanation: 'The US moved to daylight time on 8 March 2026 but the UK not until 29 March, so for those three weeks London is four hours ahead of New York instead of five.',
      },
      {
        title: 'The same time in July',
        settings: 'Source zone America/New_York, compared with Europe/London and Asia/Kolkata',
        input: '2026-07-10 09:00',
        output: 'America/New_York: 09:00 (UTC-04:00)\nEurope/London: 14:00 (UTC+01:00)\nAsia/Kolkata: 18:30 (UTC+05:30)',
        explanation: 'Both countries are on summer time, so the usual five-hour gap returns. India does not use daylight saving, so its gap to both changes through the year.',
      },
    ],
    limitations: [
      'Time zone rules come from your browser. An outdated browser may not know a recent rule change.',
      'A time that does not exist, such as 02:30 on the night clocks go forward, cannot be represented and is shifted by the size of the gap.',
      'Times are shown to the minute.',
    ],
  },
};
