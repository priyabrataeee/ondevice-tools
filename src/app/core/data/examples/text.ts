import type { ToolGuide } from '../tool-examples';

/** Each example is executed against its component in tool-examples.spec.ts. */
export const TEXT_GUIDES: Record<string, ToolGuide> = {
  'word-counter': {
    examples: [
      {
        title: 'Count a short two-paragraph note',
        settings: 'Default',
        input: 'The build passed. Deploy it today!\n\nThen tag the release.',
        output: 'Words: 10\nCharacters: 57\nSentences: 3\nParagraphs: 2\nRead time: 3 sec',
        explanation: 'Sentences end at ., ! or ?, and a blank line starts a new paragraph. Reading time divides the word count by 225 words per minute.',
      },
      {
        title: 'Count characters the way a reader sees them',
        settings: 'Default',
        input: 'Nice work 👍🏽',
        output: 'Words: 2\nCharacters: 11\nSentences: 1\nParagraphs: 1\nRead time: 1 sec',
        explanation: 'The thumbs-up with a skin tone is four UTF-16 code units, but it is one visible character, so it counts once. Emoji are not counted as words.',
      },
    ],
    limitations: [
      'Words are runs of letters or digits, so “e-mail” and “don’t” count as one word each, and numbers like 2026 count as words.',
      'Sentence detection is punctuation-based. Abbreviations such as “e.g.” or “Dr.” can split a sentence in two.',
      'Reading and speaking times are averages for general prose; technical text takes longer.',
    ],
  },
  'character-counter': {
    examples: [
      {
        title: 'Check a database column limit',
        settings: 'Default',
        input: 'Café ☕ menu',
        output: 'Length: 11\nVisible characters: 11\nWithout spaces: 9',
        explanation: 'Every character here is a single UTF-16 code unit, so the raw length and the visible count agree.',
      },
      {
        title: 'See why an emoji breaks a length limit',
        settings: 'Default',
        input: 'Go 🇮🇳',
        output: 'Length: 7\nVisible characters: 4\nWithout spaces: 6',
        explanation: 'A flag is two regional-indicator symbols, each stored as two UTF-16 units. A field limited by JavaScript length or many database VARCHAR rules counts 7, while a reader sees 4.',
      },
    ],
    limitations: [
      'Length is counted in UTF-16 code units, which is what JavaScript, many APIs and form maxlength use. Byte limits in UTF-8 can be larger again.',
      'The platform limits shown (page title, meta description, social post, SMS) are common guidelines, not guarantees; search engines truncate by pixel width.',
      'SMS segments assume the GSM 7-bit alphabet; a single emoji switches a message to UCS-2 and shortens each segment.',
    ],
  },
  'reading-time': {
    examples: [
      {
        title: 'Estimate a short announcement',
        settings: 'Reading 225 wpm, speaking 150 wpm',
        input: 'We are moving the weekly sync to Thursday at ten. Please add agenda items to the shared document by Wednesday evening, and flag anything that needs a decision so we can keep the meeting under thirty minutes.',
        output: 'Words: 37\nReading time: 10 sec\nSpeaking time: 15 sec',
        explanation: 'Time is words divided by speed, rounded to the nearest second: 37 ÷ 225 minutes to read, 37 ÷ 150 minutes to say aloud.',
      },
      {
        title: 'Plan a talk at a slower speaking pace',
        settings: 'Reading 225 wpm, speaking 120 wpm',
        input: 'Good morning, everyone. Today I will cover three things: what we shipped this quarter, what we learned from it, and what we plan to change next.',
        output: 'Words: 26\nReading time: 7 sec\nSpeaking time: 13 sec',
        explanation: 'Lowering the speaking speed to 120 words per minute leaves room for pauses and slides. Measure your own pace by timing a rehearsal.',
      },
    ],
    limitations: [
      'The estimate ignores difficulty, headings, code and images. Technical writing is often read at half the default speed.',
      'Speeds are clamped between 50 and 1000 words per minute.',
      'Words follow the same rules as Word Counter, so numbers count and emoji do not.',
    ],
  },
  'case-converter': {
    examples: [
      {
        title: 'Turn a label into code identifiers',
        settings: 'All conversions',
        input: 'user account ID',
        output: 'camelCase: userAccountId\nPascalCase: UserAccountId\nsnake_case: user_account_id\nCONSTANT_CASE: USER_ACCOUNT_ID\nkebab-case: user-account-id',
        explanation: 'The text is split into words first, so “ID” becomes one word and is re-cased consistently in each convention.',
      },
      {
        title: 'Fix a heading typed in capitals',
        settings: 'All conversions',
        input: 'THE STATE OF THE ART IN WEB DESIGN',
        output: 'Title Case: The State of the Art in Web Design\nSentence case: The state of the art in web design',
        explanation: 'Title case keeps short words such as “of”, “the” and “in” lowercase unless they start the title. Sentence case capitalises only the first word.',
      },
    ],
    limitations: [
      'Title and sentence case cannot know which words are names or acronyms. Check proper nouns such as “iPhone” or “NASA” after converting.',
      'Programming-case conversions drop punctuation that separates words, including dots and slashes.',
      'Locale rules such as Turkish dotted and dotless i follow your browser’s language settings.',
    ],
  },
  'lorem-ipsum': {
    examples: [
      {
        title: 'Five classic placeholder words',
        settings: 'Words, count 5, Start with “Lorem ipsum dolor sit amet” on',
        input: '(no input)',
        output: 'lorem ipsum dolor sit amet',
        explanation: 'With the classic start on, output always begins with the traditional opening. Everything after it is chosen at random from the Latin word list.',
      },
      {
        title: 'One classic sentence',
        settings: 'Sentences, count 1, Start with “Lorem ipsum dolor sit amet” on',
        input: '(no input)',
        output: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        explanation: 'Asking for one sentence returns just the classic opening. Higher counts add random sentences of 6 to 18 words.',
      },
    ],
    limitations: [
      'The text is placeholder Latin with no meaning. Replace it before publishing; search engines treat leftover lorem ipsum as low-quality content.',
      'Beyond the classic opening, output is random, so two runs differ.',
      'Up to 100 units can be generated at once.',
    ],
  },
  'remove-extra-spaces': {
    examples: [
      {
        title: 'Clean text pasted from a PDF',
        settings: 'Default options',
        input: '  Total\t\tamount:   1,200  \n\n\n\n  Due:  Friday ',
        output: 'Total amount: 1,200\n\nDue: Friday',
        explanation: 'Tabs become spaces, repeated spaces collapse to one, each line is trimmed, and runs of blank lines shrink to a single blank line.',
      },
      {
        title: 'Join wrapped lines into one',
        settings: 'Default options plus Join into one line',
        input: 'The quick brown\nfox jumps over\n  the lazy dog.',
        output: 'The quick brown fox jumps over the lazy dog.',
        explanation: 'Join into one line replaces every line break and run of whitespace with a single space, which helps when text was hard-wrapped in an email or PDF.',
      },
    ],
    limitations: [
      'Do not use it on code, Markdown tables or poetry where indentation and spacing carry meaning.',
      'Non-breaking and zero-width spaces are normalised by default; turn that option off if you need them preserved.',
      'It does not fix spacing around punctuation, such as a space before a comma.',
    ],
  },
};
