import { CategoryId } from '../tool.types';

export interface CategoryContent {
  headline: string;
  leadParagraph: string;
  sections: {
    heading: string;
    body: string[];
  }[];
  workflows: {
    title: string;
    steps: string[];
  }[];
  faqs: {
    q: string;
    a: string;
  }[];
}

/**
 * Category hub copy. Every claim here must match what the tools actually do:
 * reviewers and visitors check, and a confident claim the tool cannot back up
 * costs more trust than a modest accurate one.
 */
export const CATEGORY_CONTENT: Record<CategoryId, CategoryContent> = {
  developer: {
    headline: 'Developer tools for inspecting and reshaping data',
    leadParagraph:
      'Format and validate JSON, decode JWTs, test regular expressions, build cron schedules, hash text and files, and tidy SQL, XML and YAML. Inputs are processed by JavaScript in your tab; the page also loads analytics and, on tool pages, advertising scripts, which never receive what you type.',
    sections: [
      {
        heading: 'What runs where',
        body: [
          'JSON parsing uses a formatter that preserves number literals and duplicate keys exactly as written. Hashing uses the browser’s Web Crypto API (SHA-1, SHA-256, SHA-384, SHA-512). Regular expressions run in a separate worker with a time limit, so a catastrophic pattern cannot freeze the page.',
          'The SQL formatter is a small dialect-agnostic pretty-printer: it re-indents and re-cases keywords but does not validate SQL against any particular database. The YAML tool covers the configuration subset — mappings, sequences, scalars, block scalars and flow collections — and reports anchors, aliases, tags and multi-document files instead of guessing.',
        ],
      },
      {
        heading: 'Limits worth knowing',
        body: [
          'Everything is held in your tab’s memory, so very large inputs are limited by your device rather than a server quota. A formatted multi-megabyte JSON file renders slowly on a phone. The JWT decoder shows the header and claims but does not verify signatures, because that would require your signing key.',
        ],
      },
    ],
    workflows: [
      {
        title: 'Debugging an API response',
        steps: [
          'Copy the response body from your browser’s network panel or a log line.',
          'Paste it into JSON Formatter to indent it, or JSON Validator to get the line and column of the first syntax error.',
          'Minify the corrected payload with JSON Minifier if you need it back on one line.',
        ],
      },
      {
        title: 'Checking why a token is rejected',
        steps: [
          'Paste the token into JWT Decoder and read the exp, iat and nbf claims, shown as readable dates.',
          'Compare exp with the current time in Unix Timestamp Converter to confirm whether it has expired.',
          'Use a synthetic or expired token where possible; avoid pasting live credentials into any website.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Is what I paste sent to a server?',
        a: 'No. Tool inputs are processed in your browser and there is no processing backend. You can confirm this in your browser’s network panel: typing into a tool makes no requests.',
      },
      {
        q: 'Does the SQL formatter support my database?',
        a: 'It formats common SQL in any dialect by tokenising keywords, strings, identifiers and comments. It does not check syntax, so invalid SQL is formatted rather than rejected.',
      },
      {
        q: 'Can the JWT decoder verify signatures?',
        a: 'No. Verification needs the issuer’s secret or public key, and asking for a signing secret on a web page would be unsafe. Decoding shows what a token claims; only your backend can confirm it.',
      },
    ],
  },

  text: {
    headline: 'Text tools for counting, cleaning and comparing',
    leadParagraph:
      'Compare two versions of a document, count words and characters, estimate reading time, remove duplicate lines or extra spaces, sort lines, change case, make URL slugs and generate placeholder text. Your text stays in the page.',
    sections: [
      {
        heading: 'How the main tools work',
        body: [
          'Text Compare aligns lines with the Myers diff algorithm, the approach behind git diff, then highlights the changed words inside each changed line. Case, whitespace and blank lines can each be ignored, and the result downloads as a unified diff.',
          'Word Counter counts characters as you see them, so an emoji or an accented letter counts as one. It also reports sentences, paragraphs, unique words, reading time and speaking time. Reading Time lets you set your own reading and speaking speeds.',
        ],
      },
    ],
    workflows: [
      {
        title: 'Cleaning a pasted list',
        steps: [
          'Paste the list into Remove Extra Spaces to collapse repeated spaces and trim each line.',
          'Run it through Remove Duplicate Lines, with case-insensitive matching if needed.',
          'Order it with Sort Lines: alphabetical, natural (item2 before item10) or numeric.',
        ],
      },
      {
        title: 'Preparing an article for publishing',
        steps: [
          'Check length and reading time in Word Counter.',
          'Turn the headline into a URL slug with Slug Generator.',
          'Fix capitalisation of headings with Case Converter.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Is my text stored anywhere?',
        a: 'Not by these tools. Text lives in the page while it is open and is not sent to a server. Close the tab or clear the field to discard it.',
      },
      {
        q: 'Can Text Compare diff code?',
        a: 'Yes, as plain text. It compares line by line, so reformatted code or JSON with reordered keys shows as changes; format both sides first for a cleaner diff.',
      },
      {
        q: 'How is reading time estimated?',
        a: 'Word count divided by a words-per-minute rate. Reading Time lets you choose the rate. Neither tool adjusts for how difficult the text is.',
      },
    ],
  },

  image: {
    headline: 'Image tools that work on your own device',
    leadParagraph:
      'Compress, resize, crop and convert images, extract colour palettes, convert to and from Base64, generate favicons and make QR codes. Images are decoded and re-encoded by your browser’s own canvas, so they are not uploaded.',
    sections: [
      {
        heading: 'What the canvas pipeline means for your files',
        body: [
          'Each tool reads the file with the File API, draws it onto a canvas and exports the result as PNG, JPEG or WebP using the codecs your browser already has. Which formats you can open depends on the browser; JPEG, PNG, WebP and GIF work everywhere current, and AVIF in most.',
          'Two side effects follow. Metadata such as camera details and GPS location is not copied into the output, which is useful before sharing a photo. And JPEG has no transparency, so transparent areas are filled with white when you export to JPEG.',
        ],
      },
      {
        heading: 'Choosing quality and format',
        body: [
          'For photos, JPEG or WebP at 75–85% quality usually removes most of the file size without a visible change. Use PNG for screenshots, line art and anything needing exact pixels or transparency. Re-encoding an already-optimised PNG can make it larger; converting it to WebP is often the better move.',
        ],
      },
    ],
    workflows: [
      {
        title: 'Getting a photo under an upload limit',
        steps: [
          'Open the photo in Image Compressor and lower the quality until the preview still looks right.',
          'If it is still too large, set a maximum width; a 4000 px camera photo rarely needs to be wider than 1600 px on the web.',
          'Compare the before and after sizes, then download.',
        ],
      },
      {
        title: 'Making a favicon set',
        steps: [
          'Open a square logo in Favicon Generator.',
          'Check the previews at 16 and 32 px, where detail disappears first.',
          'Download the nine PNG sizes from 16 to 512 px, then paste the generated link tags and manifest entries into your site.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Are my images uploaded?',
        a: 'No. Decoding, resizing and encoding happen in your browser. Nothing about the image is sent to a server.',
      },
      {
        q: 'How large an image can I process?',
        a: 'That depends on your device memory. Phone photos of 12–50 megapixels work on most current devices; very large panoramas can fail on older phones.',
      },
      {
        q: 'Which output formats are available?',
        a: 'PNG, JPEG and WebP for image files, Base64 data URIs from Image to Base64, and PNG icon sets from Favicon Generator. No ICO file is produced; current browsers use PNG favicons.',
      },
    ],
  },

  pdf: {
    headline: 'PDF tools that keep documents on your device',
    leadParagraph:
      'Merge PDFs, split out page ranges, rotate pages and turn images into a PDF. Files are read into your tab’s memory, edited with the open-source pdf-lib JavaScript library and saved straight back to your downloads.',
    sections: [
      {
        heading: 'What changes and what does not',
        body: [
          'These tools copy and rearrange existing page objects, so text stays selectable and vector graphics stay sharp; nothing is rasterised or recompressed. Rotation changes each page’s rotation setting rather than redrawing it.',
          'Document-level features do not always survive. Merged files drop form field values and digital signatures, because a signature covers one specific document. Password-protected PDFs need to be unlocked before they can be opened.',
        ],
      },
      {
        heading: 'Why local processing matters for PDFs',
        body: [
          'Bank statements, contracts, payslips and medical letters are exactly the files people need to merge or split, and the files least suited to an upload service. Here the work happens in your browser, and splitting out a page range produces a file that does not contain the other pages at all.',
        ],
      },
    ],
    workflows: [
      {
        title: 'Combining scanned pages into one file',
        steps: [
          'Add the PDFs to Merge PDF.',
          'Use the up and down buttons to put them in order.',
          'Merge and download the combined document.',
        ],
      },
      {
        title: 'Sending only the pages someone needs',
        steps: [
          'Open the document in Split PDF.',
          'Enter the pages or ranges to keep.',
          'Download the new file; the original is not modified.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Is there a file size limit?',
        a: 'No fixed limit, but everything is held in memory, so the practical limit is your device’s RAM. Large scanned documents are the most likely to fail on a phone.',
      },
      {
        q: 'Does rotating or splitting reduce quality?',
        a: 'No. Pages are copied as they are, without re-encoding text or images.',
      },
      {
        q: 'Do the PDF tools work offline?',
        a: 'Usually, after your first visit. A service worker caches the application files, so a browser that has loaded the site before can open the tools without a connection.',
      },
    ],
  },

  css: {
    headline: 'Visual generators for everyday CSS',
    leadParagraph:
      'Build box shadows, gradients, border radii, fluid clamp() values, flexbox layouts and grid templates by adjusting controls and watching a live preview, then copy plain CSS.',
    sections: [
      {
        heading: 'Plain output you can paste anywhere',
        body: [
          'Each generator writes standard CSS properties with no preprocessor syntax or framework classes. The output works in any current browser and can go into a stylesheet, a CSS module or an inline style.',
          'Box Shadow Generator supports several layers per shadow, including inset layers, because realistic depth usually comes from a tight dark shadow combined with a wide soft one.',
        ],
      },
      {
        heading: 'Fluid sizes with clamp()',
        body: [
          'Clamp Generator turns a minimum size at a small viewport and a maximum size at a large viewport into one clamp() expression — for example, 16 px at 320 px wide growing to 24 px at 1280 px wide. It rejects reversed or non-positive viewport bounds rather than producing a formula that shrinks as the screen grows.',
        ],
      },
    ],
    workflows: [
      {
        title: 'Designing a soft card shadow',
        steps: [
          'Start from a preset in Box Shadow Generator.',
          'Add a second layer with a larger blur and lower opacity.',
          'Copy the box-shadow declaration.',
        ],
      },
      {
        title: 'Making headings scale with the screen',
        steps: [
          'Enter the smallest and largest font sizes and the viewport widths where each should apply.',
          'Check the preview at both ends.',
          'Copy the clamp() value in place of separate media queries.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Which browsers support the generated CSS?',
        a: 'All current versions of Chrome, Edge, Firefox and Safari. clamp() and gap in flexbox need browsers released from 2020 onwards.',
      },
      {
        q: 'Can I use the output with Tailwind or CSS-in-JS?',
        a: 'Yes, as arbitrary values or style objects. The generators output plain CSS, not framework-specific classes.',
      },
      {
        q: 'Are my settings saved?',
        a: 'No. Settings reset when you leave the page, so copy the CSS before navigating away.',
      },
    ],
  },

  color: {
    headline: 'Colour conversion and contrast checking',
    leadParagraph:
      'Convert a colour between HEX, RGB, HSL, HSB and CMYK, and check text and background pairs against the WCAG 2.1 contrast thresholds.',
    sections: [
      {
        heading: 'Contrast that matches the specification',
        body: [
          'Contrast Checker linearises each sRGB channel, computes relative luminance with the 0.2126, 0.7152 and 0.0722 weights, and compares the two as (lighter + 0.05) / (darker + 0.05). AA needs 4.5:1 for normal text and 3:1 for large text; AAA needs 7:1 and 4.5:1.',
          'Results are not rounded up to a pass. Grey #777777 on white is about 4.48:1 and fails AA for normal text. The checker works with opaque colours, so check the actual composited background when you use transparency, gradients or images.',
        ],
      },
      {
        heading: 'Conversions',
        body: [
          'Color Converter shows HEX, RGB, RGBA, HSL, HSLA, HSB and CMYK together, with alpha carried into RGBA and HSLA. CMYK here is a simple device-independent formula; printers use colour profiles, so ask your printer for exact values.',
        ],
      },
    ],
    workflows: [
      {
        title: 'Checking brand colours for accessibility',
        steps: [
          'Enter the text and background colours in Contrast Checker.',
          'Read the ratio and the AA and AAA results for normal and large text.',
          'If it fails, lower or raise the lightness of one colour and check again.',
        ],
      },
    ],
    faqs: [
      {
        q: 'What contrast does body text need?',
        a: 'At least 4.5:1 for WCAG 2.1 Level AA. Large text, meaning 18 pt or 14 pt bold and above, needs 3:1.',
      },
      {
        q: 'Does the contrast checker handle transparent colours?',
        a: 'No. Enter the colour as it appears after blending with the background; transparency changes the effective contrast.',
      },
      {
        q: 'Is the CMYK value print-ready?',
        a: 'Treat it as a starting point. Print output depends on the printer’s colour profile and paper.',
      },
    ],
  },

  calculator: {
    headline: 'Everyday finance and percentage calculators',
    leadParagraph:
      'Work out percentages, discounts, GST, loan EMIs, SIP returns and compound interest. The calculators run in your browser, with no sign-up and no lead form.',
    sections: [
      {
        heading: 'The formulas behind the numbers',
        body: [
          'EMI Calculator uses the standard reducing-balance formula, EMI = P × r × (1 + r)^n ÷ ((1 + r)^n − 1), with r as the monthly rate, and shows a yearly amortisation table. Compound Interest supports annual, half-yearly, quarterly, monthly and daily compounding. SIP Calculator assumes a fixed monthly contribution and a constant expected return.',
          'Real products differ from these models. Lenders add processing fees and insurance, and fund returns are not constant. Use the results to compare options, then confirm figures with the institution.',
        ],
      },
    ],
    workflows: [
      {
        title: 'Comparing two loan offers',
        steps: [
          'Enter the amount, annual rate and tenure for the first offer in EMI Calculator.',
          'Note the monthly EMI and total interest, then repeat for the second offer.',
          'Use the yearly table to see how much principal each option repays early on.',
        ],
      },
      {
        title: 'Estimating a monthly investment',
        steps: [
          'Enter the monthly amount, expected annual return and number of years in SIP Calculator.',
          'Compare total invested with the projected value, remembering that returns vary.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Are the results exact?',
        a: 'They are exact for the formula used, rounded for display. Real loans and investments include fees, taxes and changing rates the formulas do not model.',
      },
      {
        q: 'Is anything I enter stored or sent?',
        a: 'No. The arithmetic runs in your browser and there are no forms that submit your figures.',
      },
      {
        q: 'What is the EMI formula?',
        a: 'EMI = P × r × (1 + r)^n ÷ ((1 + r)^n − 1), where P is the principal, r the monthly interest rate and n the number of monthly payments.',
      },
    ],
  },

  converter: {
    headline: 'Unit, temperature and currency converters',
    leadParagraph:
      'Convert length, weight, area, volume and speed in one Unit Converter, temperatures between four scales, and currency amounts using a rate you supply.',
    sections: [
      {
        heading: 'Exact factors, explicit definitions',
        body: [
          'Unit Converter stores every unit as an exact factor against a base unit, using the international definitions: one inch is 25.4 mm, one pound 0.45359237 kg, one US gallon 3.785411784 L. Every unit in the chosen family updates at once, so nothing is chained and rounding happens only on display.',
          'Ambiguous names are listed separately rather than guessed: metric, US short and UK long tons; US and imperial pints and gallons; US legal and metric cups. Temperature has its own converter because Celsius and Fahrenheit differ in their zero point as well as their scale.',
        ],
      },
      {
        heading: 'Currency rates are yours to set',
        body: [
          'Currency Converter ships with illustrative example values, not live market rates, and does not claim a date for them. Enter the rate your bank or card provider quotes to get a result you can rely on.',
        ],
      },
    ],
    workflows: [
      {
        title: 'Converting construction measurements',
        steps: [
          'Open Unit Converter and choose Length or Area.',
          'Enter the value and pick its unit, for example 12 ft or 200 gaj.',
          'Read the equivalent in every other unit and copy the one you need.',
        ],
      },
    ],
    faqs: [
      {
        q: 'How accurate are the unit conversions?',
        a: 'The factors are exact definitions, so the only error is display rounding, which you set with the Decimals buttons.',
      },
      {
        q: 'Are currency rates live?',
        a: 'No. The bundled values are examples. Enter the rate from your provider for any real transaction.',
      },
    ],
  },

  datetime: {
    headline: 'Dates, ages, working days and time zones',
    leadParagraph:
      'Find the gap between two dates, an exact age, the number of working days in a range and the same moment in different time zones.',
    sections: [
      {
        heading: 'Calendar arithmetic, not division',
        body: [
          'Ages and date gaps are counted in calendar years, months and days, so leap years and month lengths come out right. Someone born on 29 February is treated as having a birthday on 1 March in common years. Date Difference can include or exclude the end date, and shows totals in days, weeks, hours and minutes.',
          'Working Days Calculator lets you choose which days count as the weekend and paste a list of public holidays, one YYYY-MM-DD date per line, because neither is the same everywhere.',
        ],
      },
      {
        heading: 'Time zones from the browser’s own database',
        body: [
          'Timezone Converter uses the browser’s Intl API, which carries the IANA time zone database, so daylight-saving changes are applied for the date you pick rather than today’s offset.',
        ],
      },
    ],
    workflows: [
      {
        title: 'Counting business days to a deadline',
        steps: [
          'Enter the start and end dates in Working Days Calculator.',
          'Set your weekend days and paste any public holidays.',
          'Read calendar days, weekend days, holidays and working days.',
        ],
      },
      {
        title: 'Scheduling a call across countries',
        steps: [
          'Pick the date and time in Timezone Converter.',
          'Check the local time in each zone, including any daylight-saving shift.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Does the timezone converter handle daylight saving?',
        a: 'Yes. It applies the offset in force on the date you choose, using the time zone data built into your browser.',
      },
      {
        q: 'Which holidays are excluded from working days?',
        a: 'Only the ones you enter. Public holidays vary by country and region, so the tool does not assume a list.',
      },
    ],
  },
};
