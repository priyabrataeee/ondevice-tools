import type { ToolGuide } from '../tool-examples';

/** Colour and converter tools; each example is executed in color-converter.spec.ts. */
export const COLOR_CONVERTER_GUIDES: Record<string, ToolGuide> = {
  'color-converter': {
    examples: [
      {
        title: 'Convert a brand HEX colour for CSS and print',
        settings: 'Default',
        input: '#6366f1',
        output: 'HEX: #6366f1\nRGB: rgb(99, 102, 241)\nRGBA: rgba(99, 102, 241, 1)\nHSL: hsl(239, 84%, 67%)\nHSLA: hsla(239, 84%, 67%, 1)\nHSB: hsb(239, 59%, 95%)\nCMYK: cmyk(59%, 58%, 0%, 5%)',
        explanation: 'HSL is usually the easiest form to adjust in CSS: change only the last number to make a lighter or darker shade of the same hue.',
      },
      {
        title: 'Keep transparency when converting',
        settings: 'Default',
        input: 'rgba(255, 0, 0, 0.5)',
        output: 'HEX: #ff000080\nRGB: rgb(255, 0, 0)\nRGBA: rgba(255, 0, 0, 0.5)\nHSL: hsl(0, 100%, 50%)\nHSLA: hsla(0, 100%, 50%, 0.5)\nHSB: hsb(0, 100%, 100%)\nCMYK: cmyk(0%, 100%, 100%, 0%)',
        explanation: 'Alpha is carried into the 8-digit HEX form and into RGBA and HSLA. The plain RGB and HSL rows drop it, as those CSS forms have no alpha.',
      },
    ],
    limitations: [
      'CMYK is calculated with a simple formula that ignores ink and paper profiles. Use it as a starting point and ask your printer for exact values.',
      'HSL and HSB values are rounded to whole numbers, so converting back can shift a HEX value by one step.',
      'Wide-gamut CSS colours such as oklch() and display-p3 are not supported.',
    ],
  },
  'contrast-checker': {
    examples: [
      {
        title: 'A grey that looks fine but fails',
        settings: 'Text #777777, background #ffffff',
        input: '#777777 on #ffffff',
        output: 'Contrast ratio: 4.48:1\nAA — normal text: Fail\nAA — large text (18.66px bold / 24px): Pass\nAAA — normal text: Fail\nAAA — large text: Fail\nNon-text elements (icons, borders): Pass',
        explanation: 'At 4.48:1 the pair is just under the 4.5:1 needed for normal body text. It passes for large text and for icons and borders, which need 3:1.',
      },
      {
        title: 'Dark text on an off-white background',
        settings: 'Text #1f2937, background #f9fafb',
        input: '#1f2937 on #f9fafb',
        output: 'Contrast ratio: 14.05:1\nAA — normal text: Pass\nAA — large text (18.66px bold / 24px): Pass\nAAA — normal text: Pass\nAAA — large text: Pass\nNon-text elements (icons, borders): Pass',
        explanation: 'This pair clears even the AAA threshold of 7:1, so it suits long passages of small text.',
      },
    ],
    limitations: [
      'Colours are treated as opaque. Enter the blended colour you actually see when using transparency or text over images.',
      'The WCAG 2.1 ratio does not model colour vision deficiency or font weight; thin fonts need more contrast than the ratio suggests.',
      'Results are not rounded up: 4.48:1 fails a 4.5:1 requirement.',
    ],
  },
  'temperature-converter': {
    examples: [
      {
        title: 'Body temperature in every scale',
        settings: 'Unit: Celsius',
        input: '37',
        output: 'Celsius: 37 °C\nFahrenheit: 98.6 °F\nKelvin: 310.15 K\nRankine: 558.27 °R',
        explanation: 'Fahrenheit is Celsius × 9 ÷ 5 + 32, and Kelvin is Celsius + 273.15. Rankine is Fahrenheit measured from absolute zero.',
      },
      {
        title: 'The point where Celsius and Fahrenheit agree',
        settings: 'Unit: Fahrenheit',
        input: '-40',
        output: 'Celsius: -40 °C\nFahrenheit: -40 °F\nKelvin: 233.15 K\nRankine: 419.67 °R',
        explanation: 'At −40 the two scales read the same number, which is a quick way to check a conversion formula.',
      },
    ],
    limitations: [
      'Values below absolute zero are flagged, because no temperature can be lower than 0 K.',
      'Results are shown to two decimal places.',
      'Temperature differences convert without the 32-degree offset: a change of 10 °C is a change of 18 °F, not 50 °F.',
    ],
  },
  'unit-converter': {
    examples: [
      {
        title: 'Kilometres to miles and feet',
        settings: 'Quantity: Length, unit: Kilometre, 4 decimals',
        input: '5',
        output: 'Metre: 5,000 m\nFoot: 16,404.1995 ft\nMile: 3.1069 mi',
        explanation: 'A mile is exactly 1,609.344 metres, so 5 km is 5,000 ÷ 1,609.344 miles. Every other length unit is shown at the same time.',
      },
      {
        title: 'A plot size in gaj',
        settings: 'Quantity: Area, unit: Gaj (square yard), 4 decimals',
        input: '200',
        output: 'Square metre: 167.2255 m²\nSquare foot: 1,800 ft²\nAcre: 0.0413 ac',
        explanation: 'One gaj is one square yard, which is 9 square feet or 0.83612736 square metres.',
      },
    ],
    limitations: [
      'Bigha, kanal and other regional land units are not listed because their size varies between states.',
      'Volume cannot be converted to weight without knowing the substance’s density.',
      'Mach uses the sea-level speed of sound, 340.29 m/s; at altitude the real value is lower.',
    ],
  },
  'currency-converter': {
    examples: [
      {
        title: 'Convert with the rate your bank quotes',
        settings: 'From USD to EUR, rate 0.92',
        input: '100',
        output: '100 USD = 92 EUR',
        explanation: 'With your own rate entered, the result is simply amount × rate. Fees and card markups are not included.',
      },
      {
        title: 'An invalid rate is not replaced silently',
        settings: 'From USD to EUR, rate −1',
        input: '100',
        output: 'No result: Enter a positive, finite exchange rate.',
        explanation: 'A negative or zero rate is rejected and no result is shown, rather than falling back to the example rate without telling you.',
      },
    ],
    limitations: [
      'The bundled rates are illustrative examples, not live market data, and carry no date.',
      'Bank and card rates include a markup over mid-market rates. Use the rate on your statement for real amounts.',
      'Only the selected pair uses your rate; the other rows in the table stay illustrative.',
    ],
  },
};
