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
};
