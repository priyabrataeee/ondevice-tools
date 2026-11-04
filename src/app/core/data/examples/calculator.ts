import type { ToolGuide } from '../tool-examples';

/** Each example is executed against its component in calculator.spec.ts. */
export const CALCULATOR_GUIDES: Record<string, ToolGuide> = {
  'percentage-calculator': {
    examples: [
      {
        title: 'What share of a total is a value?',
        settings: '“X is what percent of Y”',
        input: 'X = 45, Y = 180',
        output: 'Result: 25%',
        explanation: 'Divide the part by the whole and multiply by 100: 45 ÷ 180 × 100 = 25.',
      },
      {
        title: 'Why a fall is not the reverse of a rise',
        settings: '“Percentage change from X to Y”',
        input: 'From 75 to 50',
        output: 'Change: -33.33%',
        explanation: 'Change is always measured against the starting value: (50 − 75) ÷ 75. A rise from 50 to 75 is +50%, but the fall back is only −33.33%.',
      },
    ],
    limitations: [
      'Results are rounded for display: up to four decimal places for amounts and two for percentage change.',
      'Percentage change from zero is undefined and is reported as such rather than as infinity.',
      'For money, round once at the end; rounding at each step can drift by a cent or two.',
    ],
  },
  'emi-calculator': {
    examples: [
      {
        title: 'A 20-year home loan',
        settings: 'Annual rate 8.5%, tenure 20 years',
        input: 'Loan amount 2,500,000',
        output: 'Monthly EMI: 21,696\nTotal interest: 2,706,939\nTotal payment: 5,206,939',
        explanation: 'The monthly rate is 8.5 ÷ 12 ÷ 100, and 240 payments repay the loan on a reducing balance. Over 20 years the interest exceeds the amount borrowed.',
      },
      {
        title: 'A short personal loan',
        settings: 'Annual rate 10.5%, tenure 5 years',
        input: 'Loan amount 500,000',
        output: 'Monthly EMI: 10,747\nTotal interest: 144,817\nTotal payment: 644,817',
        explanation: 'A shorter tenure means a higher EMI but far less total interest, because the balance falls faster.',
      },
    ],
    limitations: [
      'The formula assumes a fixed rate and equal monthly payments. Floating-rate loans change as the rate resets.',
      'Processing fees, insurance and taxes charged by the lender are not included.',
      'Amounts are rounded to whole units for display; the lender’s schedule may differ by a unit in the final payment.',
    ],
  },
  'gst-calculator': {
    examples: [
      {
        title: 'Add 18% GST to a net price',
        settings: 'Add GST, rate 18%',
        input: 'Amount 1,000',
        output: 'Net: 1,000\nGST: 180\nGross: 1,180',
        explanation: 'GST is 18% of the net amount, added on top: 1,000 × 0.18 = 180.',
      },
      {
        title: 'Find the GST inside an inclusive price',
        settings: 'Remove GST, rate 18%',
        input: 'Amount 1,180',
        output: 'Net: 1,000\nGST: 180\nGross: 1,180',
        explanation: 'To remove GST, divide by 1.18 rather than subtracting 18%. Subtracting 18% of 1,180 would give 967.60, which is wrong.',
      },
    ],
    limitations: [
      'The tool applies one rate. Invoices with items at different rates need each line calculated separately.',
      'It does not split GST into CGST and SGST or IGST; for an intra-state sale at 18%, each half is 9%.',
      'Rounding rules on real invoices may differ by a paisa per line.',
    ],
  },
  'sip-calculator': {
    examples: [
      {
        title: 'A 15-year monthly SIP',
        settings: 'Expected return 12% a year, no step-up',
        input: '10,000 a month for 15 years',
        output: 'Invested: 1,800,000\nGain: 3,245,760\nProjected value: 5,045,760',
        explanation: 'Each contribution is added at the start of the month and grows at 1% a month. Most of the final value comes from growth in the later years.',
      },
      {
        title: 'The same SIP with a 10% yearly step-up',
        settings: 'Expected return 12% a year, step-up 10%',
        input: '10,000 a month for 15 years',
        output: 'Invested: 3,812,698\nGain: 4,871,152\nProjected value: 8,683,849',
        explanation: 'Raising the contribution by 10% each year, as salaries often rise, increases both the amount invested and the projected value.',
      },
    ],
    limitations: [
      'Returns are assumed constant. Real funds go up and down, and the order of returns changes the outcome.',
      'Expense ratios, exit loads and taxes are not deducted.',
      'Use the result to compare plans, not as a forecast.',
    ],
  },
  'compound-interest-calculator': {
    examples: [
      {
        title: 'Interest compounded yearly',
        settings: 'Rate 8%, 10 years, no monthly contribution, compounded annually',
        input: 'Principal 100,000',
        output: 'Final balance: 215,892\nInterest earned: 115,892',
        explanation: 'The balance grows by 8% each year on the previous year’s balance: 100,000 × 1.08¹⁰.',
      },
      {
        title: 'The same deposit compounded monthly',
        settings: 'Rate 8%, 10 years, no monthly contribution, compounded monthly',
        input: 'Principal 100,000',
        output: 'Final balance: 221,964\nInterest earned: 121,964',
        explanation: 'Monthly compounding applies 8 ÷ 12 percent each month, so interest starts earning interest sooner and the total is slightly higher.',
      },
    ],
    limitations: [
      'The rate is assumed fixed for the whole term.',
      'Monthly contributions are spread evenly across compounding periods, which approximates but may not exactly match a bank’s crediting dates.',
      'Tax on interest is not deducted.',
    ],
  },
  'discount-calculator': {
    examples: [
      {
        title: 'Stack two discounts',
        settings: 'Apply a discount: 25%, then a further 10%',
        input: 'Price 2,499',
        output: 'You pay: 1,686.83\nYou save: 812.18\nEffective discount: 32.5%',
        explanation: 'The second discount applies to the already reduced price, so 25% then 10% is 32.5% off, not 35%.',
      },
      {
        title: 'Work out the real discount from a sale price',
        settings: 'Find the discount',
        input: 'Original price 2,499, paid 1,799',
        output: 'You pay: 1,799\nYou save: 700\nEffective discount: 28.01%',
        explanation: 'The saving divided by the original price gives the effective discount, which you can compare with what the label claims.',
      },
    ],
    limitations: [
      'Tax, if entered, is added after the discount, which is how most retail receipts work.',
      'Discounts are capped between 0% and 100%.',
      'Cashback and loyalty points are not price discounts and are not modelled.',
    ],
  },
};
