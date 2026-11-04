/**
 * Long-form guides. Each one explains a task end to end and links to the tools
 * that do it. Numbers quoted here are reproduced by the tools themselves; the
 * worked-example tests cover the same cases.
 */
export interface GuideSection {
  heading: string;
  paragraphs: string[];
  /** Optional bullet or step list shown after the paragraphs. */
  list?: string[];
  ordered?: boolean;
}

export interface Guide {
  slug: string;
  title: string;
  /** Meta description, 150–160 characters. */
  description: string;
  /** One-paragraph answer shown under the title. */
  summary: string;
  published: string;
  updated: string;
  toolIds: string[];
  sections: GuideSection[];
}

export const GUIDES: Guide[] = [
  {
    slug: 'crop-image-to-aspect-ratio',
    title: 'How to crop an image to an exact aspect ratio',
    description:
      'Crop a photo to 1:1, 4:3, 16:9 or 9:16 without stretching it. Learn the arithmetic behind a crop, where to centre it and which file format to save it in.',
    summary:
      'Pick the target ratio, make the crop as large as the image allows at that ratio, centre it on the subject, then save as PNG if you need exact pixels or JPEG or WebP if you need a small file. Never resize to a different ratio instead of cropping; that stretches the picture.',
    published: '2026-11-04',
    updated: '2026-11-04',
    toolIds: ['crop-image', 'image-resizer', 'image-compressor'],
    sections: [
      {
        heading: 'What an aspect ratio is',
        paragraphs: [
          'An aspect ratio is width divided by height. A 1:1 image is square, 4:3 is the shape of most phone camera photos held sideways, 16:9 is a widescreen video frame and 9:16 is the same frame turned upright for phone stories.',
          'The ratio says nothing about size. A 1080 × 1080 image and a 400 × 400 image are both 1:1. That is why the usual instruction is to crop to the ratio first and resize to the exact pixel size second.',
        ],
      },
      {
        heading: 'Working out the largest crop',
        paragraphs: [
          'To keep as much of the picture as possible, the crop should touch two opposite edges of the image. Which two depends on whether the image is wider or narrower than the ratio you want.',
          'Take a 4032 × 3024 photo, which is 4:3, and crop it square. The square cannot be taller than 3,024 pixels, so the crop is 3024 × 3024. That leaves 4,032 − 3,024 = 1,008 pixels of width to remove, and centring it puts 504 on each side.',
          'Going the other way, take a 1080 × 1920 portrait photo and cut a 16:9 frame from it. Now the width is the limit. At the full 1,080 pixel width a 16:9 crop would be 608 pixels tall; Crop Image starts smaller, at 80% of the width, giving 864 × 486, so you can see the frame and move it before committing.',
        ],
      },
      {
        heading: 'Cropping step by step',
        paragraphs: [],
        ordered: true,
        list: [
          'Open Crop Image and choose the picture. It is read by your browser and not uploaded.',
          'Pick the ratio: 1:1, 4:3, 3:2, 16:9 or 9:16. Choose Free if you need another shape and type the width and height yourself.',
          'Press Centre selection, then adjust the X and Y offsets to keep the subject in frame. The overlay shows exactly what will be kept.',
          'Increase the width if you want a larger crop; with a ratio locked, the height follows.',
          'Press Crop image, check the result and download it.',
        ],
      },
      {
        heading: 'Placing the subject',
        paragraphs: [
          'A centred crop is a safe default but not always the best one. For portraits, keep a little more space above the head than below the chin, and leave room on the side the person is looking towards. For product photos, centre the product and keep an even margin so it does not touch the edges.',
          'If the crop cuts through something important at the largest size, the image simply does not contain enough picture for that ratio. Choose a different ratio or accept a smaller crop rather than stretching the image.',
        ],
      },
      {
        heading: 'Saving the result',
        paragraphs: [
          'Pixels inside the crop are copied unchanged, so the only quality decision is the file format. PNG keeps every pixel exactly and supports transparency, which suits screenshots and graphics. JPEG and WebP are much smaller for photographs; Crop Image saves them at 92% quality, which is visually indistinguishable for most photos.',
          'If you need a particular pixel size, such as a 1080 × 1080 profile picture, crop first and then use Image Resizer with the ratio locked. If the file is still too large for an upload limit, run it through Image Compressor.',
        ],
      },
      {
        heading: 'Common mistakes',
        paragraphs: [],
        list: [
          'Resizing to a new shape instead of cropping. Changing 4:3 to 1:1 by resizing squashes faces and circles into ovals.',
          'Cropping a small image and then enlarging it. Upscaling cannot add detail, so the result looks soft.',
          'Saving a screenshot as JPEG. Text and sharp edges pick up blotchy artefacts; PNG or WebP keeps them clean.',
          'Cropping a JPEG repeatedly and re-saving each time. Each JPEG save loses a little quality; keep the original and crop from it.',
        ],
      },
    ],
  },
  {
    slug: 'compare-two-texts',
    title: 'How to compare two texts and read a diff',
    description:
      'Find every change between two versions of a document, config file or list. Learn how diff tools align lines, read unified diff markers and avoid false changes.',
    summary:
      'Paste the original on one side and the changed version on the other. A diff tool aligns matching lines and marks the rest as added, removed or changed. Normalise formatting first, and only ignore case or whitespace when those differences genuinely do not matter.',
    published: '2026-11-04',
    updated: '2026-11-04',
    toolIds: ['text-compare', 'json-formatter', 'remove-extra-spaces'],
    sections: [
      {
        heading: 'Why reading side by side fails',
        paragraphs: [
          'People are poor at spotting small differences in long text. A changed digit, a missing “not” or a line that moved from one paragraph to another is easy to read straight past. A diff does the comparison mechanically, so nothing is skipped because it looked familiar.',
        ],
      },
      {
        heading: 'How a diff lines up two texts',
        paragraphs: [
          'Text Compare uses the Myers algorithm, the same approach behind git diff. It finds the smallest set of line insertions and deletions that turns the original into the new version. Lines that survive unchanged anchor the alignment, so one inserted line does not make everything after it look different.',
          'When a removed line and an added line sit in the same place, the tool shows them as a single changed row and highlights the words that differ. That is usually what you want to see: “timeout = 30” became “timeout = 60”, rather than an unrelated deletion and addition.',
        ],
      },
      {
        heading: 'Reading a unified diff',
        paragraphs: [
          'The unified format is what git, code review tools and patch files use. It starts with two header lines naming the original and changed texts, then lists every line with a one-character prefix.',
        ],
        list: [
          'A leading space means the line is the same in both versions.',
          'A minus sign means the line exists only in the original.',
          'A plus sign means the line exists only in the new version.',
          'A changed line appears as a minus line followed by a plus line.',
        ],
      },
      {
        heading: 'A worked example',
        paragraphs: [
          'Compare a config file that read “timeout = 30, retries = 3, mode = fast” with a new version where the timeout is 60 and a fourth line, “log = on”, has been added. The diff shows −timeout = 30 and +timeout = 60 next to each other, the two unchanged lines with a leading space, and +log = on at the end. Four lines of output tell you everything that happened.',
        ],
      },
      {
        heading: 'Avoiding false differences',
        paragraphs: [
          'Most noise in a diff comes from formatting rather than content. Reformat both sides the same way before comparing. For JSON, run each side through JSON Formatter with the same indentation; for prose pasted from PDFs or emails, Remove Extra Spaces evens out stray spaces and blank lines.',
          'Text Compare can also ignore case, whitespace or blank lines. Use these options deliberately. They are right for comparing two drafts of an article and wrong for auditing code, YAML or a contract, where a change in indentation or capitalisation can change the meaning.',
          'A line-based diff does not understand structure. Two JSON files with the same data in a different key order will show differences. Sort keys on both sides first if order does not matter to you.',
        ],
      },
      {
        heading: 'Keeping the result',
        paragraphs: [
          'Download the comparison as a .diff file to attach to a ticket or email, or copy it into a code review. The on-screen table shows up to 800 rows; the download always contains the full diff. Both texts stay in your browser throughout, which matters when you are comparing contracts, internal documents or production configuration.',
        ],
      },
    ],
  },
  {
    slug: 'compress-images-for-the-web',
    title: 'How to compress images for the web: JPEG, WebP or PNG',
    description:
      'Make images smaller without visible quality loss. Choose between JPEG, WebP and PNG, pick a quality setting, resize before compressing and strip location data.',
    summary:
      'Resize to the size the page actually displays, then save photographs as WebP or JPEG at about 75–85% quality and graphics or screenshots as PNG or WebP. Compare the before and after sizes and the preview; stop lowering quality when you can see the difference.',
    published: '2026-11-04',
    updated: '2026-11-04',
    toolIds: ['image-compressor', 'image-resizer', 'image-converter'],
    sections: [
      {
        heading: 'Resize first',
        paragraphs: [
          'The biggest saving rarely comes from the quality slider. A phone photo is often 4032 × 3024 pixels, about 12 million pixels, while an article column might show it 800 pixels wide. Halving the width removes three quarters of the pixels before any compression happens.',
          'Image Compressor has a maximum-width setting for this. At 1600 pixels wide, a 4032 × 3024 photo becomes 1600 × 1200 and keeps its shape. It never enlarges an image that is already smaller than the limit.',
        ],
      },
      {
        heading: 'Choosing the format',
        paragraphs: [],
        list: [
          'JPEG: photographs. Universally accepted by upload forms and email. No transparency.',
          'WebP: photographs and graphics. Usually smaller than JPEG at similar quality and supports transparency. Supported by all current browsers, but some older software and upload forms still reject it.',
          'PNG: screenshots, diagrams, logos and anything with text or sharp edges. Lossless, so it never blurs, but large for photographs.',
        ],
      },
      {
        heading: 'Choosing a quality setting',
        paragraphs: [
          'Quality is a trade between file size and artefacts. For most photos, 75–85% removes the bulk of the file size with no difference you can see at normal viewing distance. Below about 60%, smooth skies and skin begin to show blocks and banding, and edges pick up halos.',
          'There is no single right number because it depends on the picture. Image Compressor updates the preview and the before and after sizes as you move the slider, so you can find the point where the image still looks right and stop there.',
        ],
      },
      {
        heading: 'When compression makes a file bigger',
        paragraphs: [
          'Re-encoding an image that is already well compressed can increase its size, especially a PNG saved by an optimiser or a JPEG at low quality. Image Compressor shows a warning when this happens. Converting a PNG photo to WebP is often the better move, and if nothing helps, keep the original.',
        ],
      },
      {
        heading: 'Transparency and backgrounds',
        paragraphs: [
          'JPEG cannot store transparency. When a transparent PNG is saved as JPEG, the transparent areas have to become a colour; the tools here fill them with white, or with the background colour you choose in Image Converter, rather than leaving them black. If the transparency matters, use WebP or PNG.',
        ],
      },
      {
        heading: 'Location data and privacy',
        paragraphs: [
          'Phone photos often carry EXIF metadata, including the camera model, the time the photo was taken and GPS coordinates. Re-encoding an image through a browser canvas does not copy that metadata into the new file, so compressing a photo here also removes its location. Keep the original if you need the metadata for your own records.',
        ],
      },
      {
        heading: 'A quick checklist',
        paragraphs: [],
        ordered: true,
        list: [
          'Decide the largest size the image will be displayed at.',
          'Set that as the maximum width in Image Compressor, or resize in Image Resizer.',
          'Choose WebP or JPEG for photos, PNG or WebP for graphics.',
          'Lower the quality until the preview just starts to look worse, then go back up a step.',
          'Check the final size and download.',
        ],
      },
    ],
  },
  {
    slug: 'unix-timestamps-explained',
    title: 'Unix timestamps explained: seconds, milliseconds and time zones',
    description:
      'Read and convert Unix timestamps with confidence. Tell seconds from milliseconds, compare UTC with local time, check token expiry and avoid the 2038 overflow.',
    summary:
      'A Unix timestamp counts seconds since 1 January 1970 UTC. Ten digits usually means seconds and thirteen means milliseconds. The number itself has no time zone; only the way you display it does, so compare times in UTC.',
    published: '2026-11-04',
    updated: '2026-11-04',
    toolIds: ['timestamp-converter', 'jwt-decoder', 'timezone-converter'],
    sections: [
      {
        heading: 'What the number means',
        paragraphs: [
          'Unix time is a count of seconds since midnight UTC on 1 January 1970, a moment called the epoch. 1767225600 is exactly 1 January 2026 at 00:00 UTC. Because it is a single number, it is easy to store, sort and compare, which is why logs, databases and APIs use it everywhere.',
          'Unix time ignores leap seconds, so every day is treated as exactly 86,400 seconds. For everyday use that makes no visible difference.',
        ],
      },
      {
        heading: 'Seconds or milliseconds?',
        paragraphs: [
          'The most common timestamp bug is mixing up the two units. Most server languages and databases use seconds. JavaScript’s Date.now() and many browser APIs use milliseconds, which makes the number a thousand times larger.',
          'For current dates, a value in seconds has ten digits and a value in milliseconds has thirteen. Reading milliseconds as seconds gives a date tens of thousands of years in the future; reading seconds as milliseconds gives a date in January 1970. If you see either, you have the unit wrong. Unix Timestamp Converter detects the unit from the length of the number and tells you which one it assumed.',
        ],
      },
      {
        heading: 'Time zones',
        paragraphs: [
          'A timestamp describes one instant, the same everywhere in the world. Time zones only matter when you turn it into a wall-clock time. 1767225600 is 00:00 on 1 January in London, 19:00 on 31 December in New York and 05:30 on 1 January in Kolkata.',
          'When two systems disagree by a whole number of hours, the cause is almost always a time zone rather than a bug in the data. Compare both values in UTC first. Unix Timestamp Converter shows UTC and your local time side by side, and Timezone Converter shows one moment in several places, including daylight-saving changes.',
        ],
      },
      {
        heading: 'ISO 8601: the readable alternative',
        paragraphs: [
          'When people need to read dates, the ISO 8601 format is the safer choice: 2026-01-01T00:00:00.000Z. The Z means UTC. It sorts correctly as text, and unlike 01/02/2026 it cannot be read as either January or February depending on the reader’s country.',
        ],
      },
      {
        heading: 'Checking a token’s expiry',
        paragraphs: [
          'JSON Web Tokens store their expiry in an exp claim, as Unix seconds. When an API suddenly returns 401 Unauthorized, decode the token in JWT Decoder and compare exp with the current time. If it is in the past, the token has expired and needs refreshing; the API is probably fine.',
        ],
      },
      {
        heading: 'The year 2038 problem',
        paragraphs: [
          'Systems that store Unix time in a signed 32-bit integer can count up to 2,147,483,647, which is 03:14:07 UTC on 19 January 2038. One second later the value overflows. Modern operating systems and languages use 64-bit values and are not affected, but older embedded systems, file formats and database columns can be. If you design a schema today, store timestamps in a 64-bit column.',
        ],
      },
      {
        heading: 'Quick reference',
        paragraphs: [],
        list: [
          '10 digits: seconds. 13 digits: milliseconds.',
          '0 is 1970-01-01T00:00:00Z.',
          '1767225600 is 2026-01-01T00:00:00Z.',
          '2147483647 is the largest signed 32-bit value: 2038-01-19T03:14:07Z.',
          'Add 86,400 to move forward one day in seconds.',
        ],
      },
    ],
  },
  {
    slug: 'fix-invalid-json',
    title: 'How to find and fix invalid JSON',
    description:
      'Fix JSON that will not parse. Learn the mistakes behind most errors, from trailing commas to single quotes, read error positions and keep large numbers intact.',
    summary:
      'Most invalid JSON comes from writing it like JavaScript: trailing commas, single quotes, comments or unquoted keys. Paste it into a validator to get the line and column of the first error, fix that, and validate again until it passes.',
    published: '2026-11-04',
    updated: '2026-11-04',
    toolIds: ['json-validator', 'json-formatter', 'json-minifier'],
    sections: [
      {
        heading: 'JSON is stricter than it looks',
        paragraphs: [
          'JSON looks like a JavaScript object, but the specification, RFC 8259, is much stricter. Many configuration files and code snippets are written in a relaxed style that JavaScript accepts and a JSON parser rejects. That gap causes most “invalid JSON” errors.',
        ],
      },
      {
        heading: 'The usual suspects',
        paragraphs: [],
        list: [
          'A trailing comma after the last item: {"a": 1,}. Remove the comma.',
          'Single quotes: {\'name\': \'Ada\'}. Strings and keys must use double quotes.',
          'Unquoted keys: {name: "Ada"}. Every key must be a quoted string.',
          'Comments: // or /* */ are not part of JSON. Remove them, or use a format that allows them, such as JSON5 or YAML.',
          'Special values: undefined, NaN and Infinity are not valid. Use null or a number.',
          'Unescaped characters: a line break or tab inside a string must be written as \\n or \\t.',
        ],
      },
      {
        heading: 'Reading the error position',
        paragraphs: [
          'A parser stops at the first character it cannot accept and reports where that is. The position is where it gave up, which is often just after the real mistake. For a trailing comma, the error points at the closing brace on the next line, because that is where the parser expected another key.',
          'JSON Validator converts the position into a line and column and shows the surrounding text. The wording of the error message comes from your browser, so Chrome, Firefox and Safari phrase it differently; the line and column are what to rely on.',
        ],
      },
      {
        heading: 'Fixing one error at a time',
        paragraphs: [
          'Only the first error can be reported reliably, because everything after it may be misread. Fix that one, validate again, and repeat. In a large file it often helps to format it first: once each value is on its own line, the reported line number points straight at the problem.',
        ],
      },
      {
        heading: 'Large numbers and duplicate keys',
        paragraphs: [
          'JavaScript numbers lose precision above 9,007,199,254,740,991. A tool that parses and re-serialises JSON would quietly turn 9007199254740993 into 9007199254740992, which corrupts IDs from databases and APIs. JSON Formatter and JSON Minifier change only whitespace and copy number digits exactly as written.',
          'Duplicate keys, such as two "id" members in one object, are valid syntax but ambiguous: most parsers keep the last one. They are kept as written in the formatted output, so look for them if a value seems to vanish after parsing elsewhere.',
        ],
      },
      {
        heading: 'Valid is not the same as correct',
        paragraphs: [
          'A validator checks syntax only. It cannot tell you that a required field is missing, that a port is a string instead of a number, or that a date is in the wrong format. For that you need a JSON Schema and a schema validator in your own build or test pipeline.',
        ],
      },
    ],
  },
];

export function guideBySlug(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}

/** Guides that mention a tool, for linking from the tool page. */
export function guidesForTool(toolId: string): Guide[] {
  return GUIDES.filter((g) => g.toolIds.includes(toolId));
}
