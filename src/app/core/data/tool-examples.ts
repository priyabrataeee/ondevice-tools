import { CALCULATOR_GUIDES } from './examples/calculator';
import { COLOR_CONVERTER_GUIDES } from './examples/color-converter';
import { CSS_DATETIME_GUIDES } from './examples/css-datetime';
import { DEVELOPER_GUIDES } from './examples/developer';
import { IMAGE_PDF_GUIDES } from './examples/image-pdf';
import { TEXT_GUIDES } from './examples/text';

export interface WorkedExample {
  title: string;
  settings: string;
  input: string;
  output: string;
  explanation: string;
}

export interface ToolGuide {
  examples: WorkedExample[];
  limitations: string[];
}

/** Examples checked against the corresponding components, not generated from their titles. */
export const TOOL_GUIDES: Record<string, ToolGuide> = {
  'sort-lines': {
    examples: [
      {
        title: 'Put numbered filenames in human order',
        settings: 'Natural (item2 < item10), Ascending',
        input: 'report10.csv\nreport2.csv\nreport1.csv',
        output: 'report1.csv\nreport2.csv\nreport10.csv',
        explanation: 'Natural mode compares embedded digit sequences numerically. Use it for exported filenames or numbered tasks. Alphabetical mode instead compares text and can place report10 before report2.',
      },
      {
        title: 'Sort quantities by their leading number',
        settings: 'Numeric, Ascending',
        input: '12 kg\n2 kg\nunknown\n-3 kg',
        output: '-3 kg\n2 kg\n12 kg\nunknown',
        explanation: 'Numeric mode reads the number at the beginning of each line with parseFloat. It leaves the original line intact and puts lines without a finite leading number after numeric entries.',
      },
    ],
    limitations: [
      'Sorting operates on whole lines, not CSV columns. Export just the field you need or use a spreadsheet for multi-column records.',
      'Alphabetical and natural order follow your browser locale. Numeric mode does not interpret decimal commas, currency prefixes or convert units. For example, 1,200 is read as 1, not 1200.',
      'Keep a copy of the original. Random mode changes order without a reproducible seed; use Remove Duplicate Lines separately if you want to deduplicate.',
    ],
  },
  'remove-duplicate-lines': {
    examples: [
      {
        title: 'Merge differently capitalized list entries',
        settings: 'Keep unique lines; Ignore case and Ignore surrounding spaces enabled',
        input: 'Apple\n apple \nPear\nAPPLE',
        output: 'Apple\nPear',
        explanation: 'The comparison key is trimmed and lowercased, but the output keeps the first original spelling and position. The options affect matching, not the formatting of the retained line.',
      },
      {
        title: 'Find recurring entries and their counts',
        settings: 'Show only duplicates; Ignore case enabled',
        input: 'Apple\nPear\napple\nApple',
        output: 'Apple  (3×)',
        explanation: 'A repeated value appears once with its total count. Pear is omitted because it occurs only once. The count suffix is a report, not an unchanged copy of the original data.',
      },
    ],
    limitations: [
      'A line is the entire record. This does not deduplicate CSV rows by a selected column, validate email addresses or compare the contents of URLs.',
      'Ignore surrounding spaces is enabled initially; Ignore case is not. Check these controls before processing identifiers where spaces or capitalization matter.',
      'Blank lines are kept unless Remove blank lines is enabled. Case folding uses JavaScript lowercasing, not language-specific collation or Unicode normalization.',
    ],
  },
  'reverse-text': {
    examples: [
      {
        title: 'Reverse characters without splitting an emoji',
        settings: 'Reverse characters',
        input: 'A👩‍💻B',
        output: 'B👩‍💻A',
        explanation: 'On browsers with Intl.Segmenter, the joined emoji is treated as one grapheme. This reverses character order, not the appearance of individual glyphs.',
      },
      {
        title: 'Reverse words independently on each line',
        settings: 'Reverse word order',
        input: 'red  green blue\none two',
        output: 'blue green red\ntwo one',
        explanation: 'Words stay intact and each line is processed separately. Runs of whitespace between words become a single space. Choose Reverse line order instead to keep complete lines unchanged.',
      },
    ],
    limitations: [
      'Word mode normalizes whitespace, so reversing twice does not restore original tabs or repeated spaces. Save a copy when layout matters.',
      'Older browsers without Intl.Segmenter fall back to Unicode code points; complex emoji and combining marks may separate. Check the preview before copying.',
      'This is not encryption, right-to-left layout correction or mirror-image lettering. The palindrome indicator ignores case and non-letter/non-number characters.',
    ],
  },
  'slug-generator': {
    examples: [
      {
        title: 'Make a readable article path',
        settings: 'Hyphen; Lowercase enabled; Drop stop words disabled; Maximum length unlimited',
        input: 'Café Notes: A Fresh Start!',
        output: 'cafe-notes-a-fresh-start',
        explanation: 'Decomposable accents are removed, punctuation becomes a separator and the words are lowercased. Paste one title per line to build multiple slugs, then use Copy all.',
      },
      {
        title: 'Remove common English stop words',
        settings: 'Hyphen; Lowercase and Drop stop words enabled; Maximum length unlimited',
        input: 'A Guide to the Moon',
        output: 'guide-moon',
        explanation: 'The optional English stop-word list removes a, to and the. It is off by default because those words can help a title remain understandable. Removing words does not guarantee better rankings.',
      },
    ],
    limitations: [
      'This is not full transliteration to ASCII. Non-Latin letters and characters such as ł remain; your application must encode the URL path correctly.',
      'Different titles can produce the same slug. Check uniqueness in your CMS or database and add a stable suffix when necessary.',
      'Maximum length can shorten the final word or a long first word. Review the result before publishing. Changing an existing URL also requires a redirect from the old address.',
    ],
  },
  'json-minifier': {
    examples: [
      {
        title: 'Remove layout, not spaces inside values',
        settings: 'Paste valid JSON; output updates automatically',
        input: '{\n  "message": "hello  world",\n  "count": 2\n}',
        output: '{"message":"hello  world","count":2}',
        explanation: 'The two spaces inside the message are data and remain. Indentation, newlines and spaces between JSON tokens disappear. Before and After measure UTF-8 bytes, not character count or compressed transfer size.',
      },
      {
        title: 'Keep large integers exactly as written',
        settings: 'Paste valid JSON',
        input: '{ "id": 9007199254740993, "n": 1e+3, "n": -0 }',
        output: '{"id":9007199254740993,"n":1e+3,"n":-0}',
        explanation: 'The source-token formatter preserves number spelling and duplicate members instead of serializing a parsed object. A downstream parser can still round a large number or keep only the last duplicate member.',
      },
    ],
    limitations: [
      'Comments, trailing commas, single-quoted strings and unquoted keys are not JSON. Invalid input shows an error instead of being repaired or silently discarded.',
      'Minification is not gzip or Brotli compression. Already compact JSON may save no bytes; actual network savings depend on server compression too.',
      'The browser holds input and output in memory. Large or deeply nested documents can be slow. Use a local command-line processor for files too large for a tab.',
    ],
  },
  'xml-formatter': {
    examples: [
      {
        title: 'Inspect an element-only configuration',
        settings: 'Format, 2 spaces',
        input: '<root><item id="1">A</item><item id="2"/></root>',
        output: '<root>\n  <item id="1">A</item>\n  <item id="2"/>\n</root>',
        explanation: 'Element-only structure is indented while a text-bearing element stays on one line. Minify removes indentation line breaks between these elements, without shortening attribute or element names.',
      },
      {
        title: 'Preserve meaningful text spacing',
        settings: 'Format or Minify',
        input: '<p>Hello <b>world</b>  today</p>',
        output: '<p>Hello <b>world</b>  today</p>',
        explanation: 'Mixed content remains unchanged. Replacing its spaces or adding newlines could change rendered text. CDATA, quoted attribute values, inline spacing and xml:space="preserve" subtrees are retained.',
      },
    ],
    limitations: [
      'Validation checks XML well-formedness, not an XSD schema, a SOAP contract or RSS compatibility. A document can parse successfully while being invalid for its intended application.',
      'Documents containing a DOCTYPE are returned unchanged with a warning. This tool does not rewrite DTD declarations or resolve external schemas.',
      'Indentation changes whitespace nodes in element-only content. Do not use it as XML canonicalization or to prepare digitally signed XML; retain the original and compare results in the target application.',
    ],
  },
  'crop-image': {
    examples: [
      {
        title: 'Crop a landscape photo to a square',
        settings: '1:1 ratio, Centre selection',
        input: 'Source image: 4032 × 3024 px',
        output: 'Crop area: 3024 × 3024 px\nOffset: x 504, y 0',
        explanation: 'A square cannot be wider than the shorter side, so the selection uses the full 3024 px height and is centred horizontally. Use this for profile pictures and marketplace thumbnails that require 1:1.',
      },
      {
        title: 'Cut a 16:9 frame out of a portrait phone photo',
        settings: '16:9 ratio, Centre selection',
        input: 'Source image: 1080 × 1920 px',
        output: 'Crop area: 864 × 486 px\nOffset: x 108, y 717',
        explanation: 'Centre selection starts at 80% of the image width and derives the height from the ratio: 864 ÷ 16 × 9 = 486. Increase the width field afterwards to keep more of the frame; the height follows the locked ratio.',
      },
    ],
    limitations: [
      'Cropping removes pixels; it never adds detail. A 486 px tall crop stays 486 px tall, so upscale it separately only if you accept a softer result.',
      'JPEG and WebP output are re-encoded at 92% quality, and JPEG fills transparent areas with white. Choose PNG to keep exact pixels and transparency.',
      'Orientation follows how your browser displays the file. Metadata such as EXIF location is not copied into the cropped file.',
    ],
  },
  'text-compare': {
    examples: [
      {
        title: 'Find the changed value in two config files',
        settings: 'All ignore options off, Unified view',
        input: 'ORIGINAL\ntimeout = 30\nretries = 3\nmode = fast\nCHANGED\ntimeout = 60\nretries = 3\nmode = fast\nlog = on',
        output: '--- Original\n+++ Changed\n-timeout = 30\n+timeout = 60\n retries = 3\n mode = fast\n+log = on',
        explanation: 'The edited line is shown as a removal followed by an addition, and the appended line as a plain addition. Unchanged lines keep a leading space, the same convention as git diff.',
      },
      {
        title: 'Check whether two texts differ only in case and spacing',
        settings: 'Ignore case and Ignore whitespace on',
        input: 'ORIGINAL\nHello   World\nCHANGED\nhello world',
        output: '--- Original\n+++ Changed\n Hello   World',
        explanation: 'With both options on, the lines compare as equal and the tool reports the texts as identical. The diff keeps the original text unchanged; the options only change what counts as a difference.',
      },
    ],
    limitations: [
      'This is a line-based text diff. Reordered JSON keys or reformatted code can show as changes even when the meaning is the same; format both sides first.',
      'The on-screen table shows the first 800 rows. Download the unified diff to review longer results in full.',
      'Turn ignore options off when auditing code, YAML or legal text, where case and whitespace changes can matter.',
    ],
  },
  'timestamp-converter': {
    examples: [
      {
        title: 'Convert a Unix timestamp in seconds to a date',
        settings: 'Unit: Auto',
        input: '1767225600',
        output: 'ISO 8601 (UTC): 2026-01-01T00:00:00.000Z\nInterpreted as: seconds',
        explanation: 'A ten-digit value is read as seconds since 1 January 1970 UTC. The tool also shows the same moment in your local time zone and relative to now.',
      },
      {
        title: 'Convert a JavaScript millisecond timestamp',
        settings: 'Unit: Auto',
        input: '1767225600000',
        output: 'ISO 8601 (UTC): 2026-01-01T00:00:00.000Z\nInterpreted as: milliseconds',
        explanation: 'Values with more than eleven digits are read as milliseconds, which is what Date.now() and most JavaScript logs produce. Reading the same number as seconds would give a date tens of thousands of years ahead.',
      },
    ],
    limitations: [
      'Only whole numbers are accepted. Decimal seconds and microsecond or nanosecond timestamps must be truncated to seconds or milliseconds first.',
      'Local time uses your device’s time zone and daylight-saving rules. Compare the UTC row when matching logs from servers in other regions.',
      'Choose Seconds or Milliseconds explicitly for very old or very distant dates, where digit-count detection can guess the wrong unit.',
    ],
  },
  ...TEXT_GUIDES,
  ...DEVELOPER_GUIDES,
  ...CALCULATOR_GUIDES,
  ...COLOR_CONVERTER_GUIDES,
  ...CSS_DATETIME_GUIDES,
  ...IMAGE_PDF_GUIDES,
};
