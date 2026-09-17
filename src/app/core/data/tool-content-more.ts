import type { ToolContent } from './tool-content';

/**
 * Extended copy for the remaining tools, so no tool page ships with only a
 * short blurb. Every statement here describes behaviour the tool actually has
 * (see the matching registry entry and component) — nothing aspirational.
 */
export const MORE_TOOL_CONTENT: Record<string, ToolContent> = {
  // ---------------------------------------------------------------- calculators
  'emi-calculator': {
    howItWorks: [
      'The instalment comes from the standard annuity formula: principal × r × (1 + r)^n ÷ ((1 + r)^n − 1), where r is the annual rate divided by twelve and n is the tenure in months. The same figure is then replayed month by month to build the amortisation schedule, charging interest on the outstanding balance and applying the rest of the instalment to principal.',
      'Because the arithmetic runs in your browser, you can change the rate or tenure and watch the total interest move immediately. The result is the pure loan repayment — processing fees, insurance and taxes that a lender adds on top are not included and should be checked separately.',
    ],
    useCases: [
      'Comparing a 15-year and a 20-year home loan to see what the lower instalment really costs in total interest.',
      'Checking how much a 0.5% better rate is worth before negotiating with a lender.',
      'Seeing how slowly principal falls in the early years of a long loan.',
      'Budgeting a car or personal loan without sharing your figures with a lead-generation site.',
    ],
  },

  'gst-calculator': {
    howItWorks: [
      'Adding GST multiplies the net amount by (1 + rate ÷ 100). Removing it divides the inclusive price by the same factor, and the difference between the two prices is the tax component. For intra-state supply the tax is split equally into CGST and SGST; for inter-state supply the whole amount is shown as IGST.',
      'The standard slabs of 0, 5, 12, 18 and 28 percent are available alongside a custom rate, so the calculator still works if rates change or you are checking an older invoice.',
    ],
    useCases: [
      'Working out the pre-tax value of a GST-inclusive price quoted by a supplier.',
      'Preparing an invoice that needs the CGST and SGST amounts shown separately.',
      'Checking that a bill has applied the right slab to the right amount.',
    ],
  },

  'sip-calculator': {
    howItWorks: [
      'The projection treats a SIP as an annuity due — each instalment is invested at the start of its month — and compounds it at the monthly equivalent of the annual return you enter. With a step-up, the monthly contribution rises by your chosen percentage at the start of each new year.',
      'The result separates the total amount you put in from the estimated gain, which makes it clear how much of the final value comes from compounding. Returns on market-linked investments are never constant, so treat the output as an illustration of the maths rather than a forecast.',
    ],
    useCases: [
      'Estimating what a monthly investment could grow to over ten or twenty years.',
      'Seeing how much an annual step-up in line with salary growth changes the outcome.',
      'Comparing a higher monthly amount against a longer investing period.',
    ],
  },

  'compound-interest-calculator': {
    howItWorks: [
      'Each compounding period, interest is calculated on the whole balance — the original principal plus everything already earned — which is what makes growth accelerate over time. Regular monthly contributions are added to the balance as they are made, and the year-by-year table shows exactly how principal, contributions and interest accumulate.',
      'The rate you enter is nominal. If you want the result in today’s purchasing power, enter a real rate instead: your expected return minus expected inflation.',
    ],
    useCases: [
      'Seeing how compounding frequency — monthly versus yearly — changes a long-term balance.',
      'Estimating the value of a fixed deposit or recurring savings plan at maturity.',
      'Showing someone the difference between simple and compound interest with real numbers.',
    ],
  },

  'discount-calculator': {
    howItWorks: [
      'A single discount multiplies the price by (1 − discount ÷ 100). Stacked offers multiply in turn, which is why 20% off followed by 10% off is 28% off overall rather than 30%. Working backwards, the effective discount is (original − final) ÷ original.',
      'When a tax rate is entered it is applied after the discount, which is how most retail prices are actually calculated, and the tool shows the amount you really save alongside the final payable price.',
    ],
    useCases: [
      'Checking what a "20% off plus an extra 10%" sale actually comes to.',
      'Working out the real discount percentage from a before-and-after price tag.',
      'Comparing two offers in a shop without doing percentage arithmetic in your head.',
    ],
  },

  // ----------------------------------------------------------------- converters
  'length-converter': {
    howItWorks: [
      'Every unit is stored as an exact factor relative to the metre, using the international definitions — one inch is exactly 25.4 mm, one foot 0.3048 m and one nautical mile 1852 m. Your value is converted to metres once and then out to every other unit, so all results are consistent with each other.',
      'Because the factors are exact, the only error is display rounding, which you can control with the precision setting.',
    ],
    useCases: [
      'Converting drawing or construction measurements between metric and imperial.',
      'Reading product dimensions listed in inches or feet.',
      'Translating distances in miles or nautical miles into kilometres.',
    ],
  },

  'weight-converter': {
    howItWorks: [
      'All units are converted through the kilogram using exact definitions — one pound is exactly 0.45359237 kg and one stone is fourteen pounds. The three meanings of "ton" are kept separate: the metric tonne of 1000 kg, the US short ton of 2000 lb and the UK long ton of 2240 lb.',
      'Every supported unit updates at once from a single input, so you never need to chain conversions and accumulate rounding.',
    ],
    useCases: [
      'Converting recipe quantities between grams, ounces and pounds.',
      'Reading body weight given in stones and pounds.',
      'Checking shipping weights on a label that uses a different system.',
    ],
  },

  'temperature-converter': {
    howItWorks: [
      'Temperature scales differ in both the size of a degree and where zero sits, so each conversion needs a scale factor and an offset — Fahrenheit is Celsius × 9 ÷ 5 + 32, and Kelvin is Celsius + 273.15. Rankine is the Fahrenheit-sized absolute scale.',
      'All four scales update together, and the tool warns you if a value falls below absolute zero, which is physically impossible on any scale.',
    ],
    useCases: [
      'Converting an oven temperature from a recipe written for another country.',
      'Reading weather forecasts or medical temperatures in an unfamiliar scale.',
      'Working with Kelvin values in science or engineering coursework.',
    ],
  },

  'area-converter': {
    howItWorks: [
      'Areas are converted through the square metre. Because an area is a length squared, the factors are the square of the length factors — one square foot is exactly 0.09290304 m² — and land units such as the acre and hectare are defined against those same base units.',
      'Showing every unit at once makes it easy to compare listings that quote the same plot in square feet, square yards, acres or hectares.',
    ],
    useCases: [
      'Comparing property listings that use different area units.',
      'Converting farm or plot sizes between acres and hectares.',
      'Estimating flooring or paint quantities from room sizes in square feet.',
    ],
  },

  'speed-converter': {
    howItWorks: [
      'Speeds are converted through metres per second using exact factors: a knot is one nautical mile (1852 m) per hour, and a mile per hour is 0.44704 m/s. Mach has no fixed value because the speed of sound depends on temperature, so the converter uses the standard sea-level figure.',
      'Running pace is the inverse of speed, so it is shown separately as minutes per kilometre and per mile rather than as another multiplier.',
    ],
    useCases: [
      'Converting a treadmill speed in km/h into a running pace per mile.',
      'Reading wind speeds or boat speeds quoted in knots.',
      'Checking speed limits when driving in a country that uses the other system.',
    ],
  },

  'volume-converter': {
    howItWorks: [
      'Volumes are converted through the litre, and each unit is explicit about which definition it uses. The US gallon (3.785 L) and imperial gallon (4.546 L) differ by about a fifth, and so do their pints, while cups come in US legal, US customary and metric sizes — all listed separately rather than guessed.',
      'Volume cannot be converted to weight without knowing the density of the substance, so the tool deliberately does not offer that conversion.',
    ],
    useCases: [
      'Converting recipe measures between cups, millilitres and fluid ounces.',
      'Comparing fuel economy or tank sizes quoted in US and imperial gallons.',
      'Working out container capacity in litres from cubic dimensions.',
    ],
  },

  'currency-converter': {
    howItWorks: [
      'The converter ships with a bundled snapshot of reference rates quoted against the US dollar, and converts between any two currencies through that common base. The snapshot date is shown beside the result so you always know how current the figures are.',
      'It deliberately never fetches live rates: that would mean calling an external service from the page. Instead, the rate field is editable — type in the rate your bank or card provider actually quoted and every figure recalculates from it.',
    ],
    useCases: [
      'Rough travel budgeting when you are offline or abroad.',
      'Checking a quoted exchange rate against a reference before paying.',
      'Converting a price with the exact rate your bank applied, entered by hand.',
    ],
  },

  // ------------------------------------------------------------------------ css
  'box-shadow-generator': {
    howItWorks: [
      'Each shadow layer is built from horizontal offset, vertical offset, blur radius, spread radius, colour and an optional inset flag, and the preview applies the resulting box-shadow declaration to a live element. Multiple layers are joined with commas in the order they are drawn.',
      'Realistic shadows usually need two or three layers with increasing blur and decreasing opacity, which is why layering is built in rather than bolted on.',
    ],
    useCases: [
      'Designing a soft, layered card shadow for a UI component.',
      'Creating a pressed or recessed effect with an inset shadow.',
      'Matching a shadow from a design file by adjusting values until the preview agrees.',
    ],
  },

  'gradient-generator': {
    howItWorks: [
      'The generator assembles a linear-gradient, radial-gradient or conic-gradient value from your colour stops, their positions and the angle or shape you choose, and renders it on a live preview. The CSS it outputs is exactly what the preview uses.',
      'Gradients blend in sRGB, which can pass through dull greys between complementary colours. Adding an intermediate stop in a more saturated hue is the usual fix.',
    ],
    useCases: [
      'Building a hero background without shipping an image file.',
      'Creating a colour wheel or progress ring with a conic gradient.',
      'Fixing a muddy midpoint by adding and positioning an extra stop.',
    ],
  },

  'border-radius-generator': {
    howItWorks: [
      'Each corner takes a horizontal and a vertical radius. When they match, the corner is circular; when they differ, it becomes elliptical, which is how organic "blob" shapes are made. The generator writes the eight values as the border-radius shorthand, using the slash to separate horizontal and vertical radii.',
      'It always outputs the shortest shorthand that produces the same shape, so the CSS stays readable.',
    ],
    useCases: [
      'Rounding only the top corners of a card or tab.',
      'Generating an irregular blob shape for an illustration or avatar mask.',
      'Turning a square element into a circle or pill.',
    ],
  },

  'clamp-generator': {
    howItWorks: [
      'Given a minimum and maximum size and the viewport widths where each should apply, the generator solves the straight line between those two points and expresses it as a preferred value combining rem and vw. That value is wrapped in clamp(min, preferred, max) so it never goes outside your bounds.',
      'The rem component matters for accessibility: it keeps the size responsive to browser zoom and the user’s font-size setting, which a pure vw value would ignore.',
    ],
    useCases: [
      'Making headings scale smoothly between mobile and desktop without media queries.',
      'Creating fluid spacing tokens for a design system.',
      'Replacing a stack of breakpoint font sizes with one declaration.',
    ],
  },

  'flexbox-generator': {
    howItWorks: [
      'Container properties — direction, wrap, justify-content, align-items and gap — and per-item grow, shrink and basis are applied to a real flex container in the preview, so what you see is the browser’s own layout engine at work. The CSS for the container and its children is generated from the same values.',
      'Changing flex-direction swaps which axis justify-content and align-items control, which is the part of flexbox most worth seeing rather than reading about.',
    ],
    useCases: [
      'Learning how justify-content and align-items interact by toggling them.',
      'Building a navigation bar or toolbar layout and copying the CSS.',
      'Working out why items shrink instead of wrapping.',
    ],
  },

  'grid-generator': {
    howItWorks: [
      'You set the number and size of rows and columns, including fr units, and the gap between them. The preview is a real CSS Grid container, and item placement is written out as grid-area declarations alongside the grid-template values for the container.',
      'Because grid controls both dimensions at once, it suits page layouts and galleries where alignment must hold across rows and columns together.',
    ],
    useCases: [
      'Sketching a page layout with a header, sidebar and content area.',
      'Building a responsive card gallery and exporting the CSS.',
      'Learning how fr units share space after fixed tracks are laid out.',
    ],
  },

  // ----------------------------------------------------------------- date & time
  'date-difference': {
    howItWorks: [
      'The difference is calculated on calendar dates rather than by dividing milliseconds, so month lengths and leap years are handled correctly and a daylight-saving change never adds or removes a day. It is reported as years, months and days, and separately as total days, weeks, hours and minutes.',
      'By default the end date is excluded; a toggle counts both endpoints. A second mode adds or subtracts days, weeks, months or years from a starting date.',
    ],
    useCases: [
      'Counting the days until a deadline, trip or event.',
      'Working out the length of a contract, tenancy or employment period.',
      'Finding the date a set number of weeks or months from today.',
    ],
  },

  'working-days-calculator': {
    howItWorks: [
      'The calculator walks through each date in the range and counts only those that fall on a working day. Saturday and Sunday are non-working by default, but you can change which days count as the weekend, and any holiday dates you add are excluded when they land on a working day.',
      'In deadline mode it steps forward from a start date, skipping non-working days, until the requested number of business days has passed.',
    ],
    useCases: [
      'Calculating a delivery date promised in business days.',
      'Working out a notice period or SLA deadline that excludes weekends and holidays.',
      'Counting billable working days in a month.',
    ],
  },

  'timezone-converter': {
    howItWorks: [
      'Conversions use the IANA time zone database built into your browser through Intl.DateTimeFormat, so the offset applied is the one actually in force on the date you choose — including daylight saving transitions and half-hour offsets.',
      'That is why converting the same meeting time in March and in July can give different answers: many zones change offset seasonally, and different hemispheres change on different dates.',
    ],
    useCases: [
      'Scheduling a meeting across offices in several countries.',
      'Checking what time a live event starts in your own zone.',
      'Confirming a call time around a daylight saving change.',
    ],
  },

  // ------------------------------------------------------------------ developer
  'json-validator': {
    howItWorks: [
      'Validation uses the browser’s native JSON parser, which follows ECMA-404 and RFC 8259 exactly. When a document fails, the parser’s error position is mapped back to a line and column and the surrounding text is shown, so you can see the character that broke it.',
      'For a valid document the tool also reports total keys, maximum nesting depth and size. It checks syntax only — validating against a JSON Schema is a separate problem.',
    ],
    useCases: [
      'Finding the exact position of a trailing comma or missing quote in a config file.',
      'Confirming an API response is valid JSON before debugging your parser.',
      'Checking nesting depth and size when auditing a large payload.',
    ],
  },

  'json-minifier': {
    howItWorks: [
      'The document is parsed and written back out with no insignificant whitespace — no indentation, newlines or spaces after colons and commas. Key names and values are never changed, so the minified output parses to exactly the same data.',
      'The before and after byte counts are shown with the percentage saved. Minification complements gzip or brotli compression rather than replacing it.',
    ],
    useCases: [
      'Shrinking a JSON fixture or config before embedding it.',
      'Measuring how much whitespace a pretty-printed payload is carrying.',
      'Producing a single-line JSON value to paste into an environment variable.',
    ],
  },

  'uuid-generator': {
    howItWorks: [
      'UUIDs are generated with crypto.randomUUID where available, falling back to crypto.getRandomValues — both are the browser’s cryptographically secure random number generator. The version and variant bits are set according to RFC 4122 version 4, leaving 122 random bits.',
      'Output can be switched between lowercase, uppercase, braced GUID style or a plain 32-character hex string, and generated in bulk.',
    ],
    useCases: [
      'Creating primary keys or idempotency keys for test data.',
      'Generating correlation IDs for tracing requests across services.',
      'Producing Microsoft-style braced GUIDs for configuration files.',
    ],
  },

  'cron-generator': {
    howItWorks: [
      'The generator builds the standard five-field crontab expression — minute, hour, day of month, month and day of week — from labelled controls, supporting lists, ranges and step values. The expression is then described in plain English.',
      'It also computes the next run times from the current moment in your local time zone, which is the quickest way to catch a schedule that fires far more or far less often than intended.',
    ],
    useCases: [
      'Writing a schedule for a nightly backup or report job.',
      'Decoding an existing cron expression you inherited.',
      'Checking that a "first Monday of the month" schedule really does what you expect.',
    ],
  },

  'url-encoder': {
    howItWorks: [
      'Component mode uses encodeURIComponent, which escapes reserved characters such as &, ?, / and = — the right choice for a single query value. Full URL mode leaves the structure of the address intact. Characters are encoded as their UTF-8 bytes.',
      'Decoding uses decodeURIComponent and also accepts + as a space, since HTML form submissions encode spaces that way. A query-string breakdown shows each parameter decoded on its own line.',
    ],
    useCases: [
      'Escaping a search term or redirect URL before putting it in a query string.',
      'Reading a long tracking URL by decoding its parameters.',
      'Debugging a request where a value containing & was split in two.',
    ],
  },

  'html-entity-encoder': {
    howItWorks: [
      'Basic mode escapes the five characters that matter for markup — &, <, >, " and apostrophe. Full mode additionally writes every non-ASCII character as a numeric entity. Decoding handles named entities as well as decimal and hexadecimal references.',
      'Decoding reads entities as plain text rather than parsing them as live HTML, so decoded content cannot execute scripts in the page.',
    ],
    useCases: [
      'Escaping a code sample so it displays correctly in a blog post.',
      'Decoding entity-laden text copied from HTML source or an email.',
      'Preparing text containing angle brackets for insertion into an attribute.',
    ],
  },

  'xml-formatter': {
    howItWorks: [
      'The document is parsed with the browser’s XML parser, so malformed markup is reported with the parser’s own error rather than being silently repaired. Well-formed documents are re-indented by nesting depth, with text-only elements kept on a single line.',
      'Comments, CDATA sections and processing instructions are preserved. Schema validation is not performed — only well-formedness.',
    ],
    useCases: [
      'Reading a single-line SOAP response or RSS feed.',
      'Finding the unclosed tag in a broken configuration file.',
      'Tidying an SVG file before committing it to a repository.',
    ],
  },

  'yaml-formatter': {
    howItWorks: [
      'YAML is parsed into a data structure and printed as JSON, so you can see exactly how a tool will interpret indentation, lists and scalars. The reverse direction converts JSON back into readable YAML.',
      'The parser covers the common configuration subset — mappings, sequences, quoted and block scalars, comments and flow collections. Anchors, aliases and custom tags are reported rather than silently mangled, and tab indentation is flagged because it is invalid YAML.',
    ],
    useCases: [
      'Checking how a Kubernetes or GitHub Actions file will actually be interpreted.',
      'Finding the indentation error that breaks a Docker Compose file.',
      'Converting a JSON config into YAML for a tool that expects it.',
    ],
  },

  // ---------------------------------------------------------------------- image
  'crop-image': {
    howItWorks: [
      'The image is decoded in your browser and the selected region is drawn onto a canvas of exactly that size, then exported as PNG, JPEG or WebP. The selection can be set in pixels or locked to 1:1, 4:3, 16:9, 3:2 or 9:16.',
      'Pixels inside the selection are copied unchanged, but JPEG and WebP re-encode them. Choose PNG when you need to avoid any generation loss.',
    ],
    useCases: [
      'Squaring a photo for a profile picture.',
      'Trimming dead space from a screenshot before sharing it.',
      'Cutting a banner to an exact aspect ratio.',
    ],
  },

  'image-converter': {
    howItWorks: [
      'Your image is decoded by the browser, drawn onto a canvas and re-encoded in the target format, with a quality setting for the lossy formats. Because JPEG has no transparency, transparent areas are filled with the background colour you choose when converting to it.',
      'Which output formats are available depends on what your browser can encode — JPEG, PNG and WebP are supported everywhere current.',
    ],
    useCases: [
      'Converting a PNG screenshot to a smaller JPEG or WebP.',
      'Turning a WebP download into a PNG for software that cannot read WebP.',
      'Flattening a transparent logo onto a white background.',
    ],
  },

  'image-to-base64': {
    howItWorks: [
      'The file is read locally and encoded as a data URL: the MIME type followed by the Base64 representation of its bytes. Base64 uses four characters for every three bytes, so the output is roughly a third larger than the file.',
      'Alongside the raw data URL, the tool gives ready-made snippets for an img tag, a CSS background and Markdown.',
    ],
    useCases: [
      'Inlining a small icon in CSS to save a network request.',
      'Embedding an image in a single-file HTML document or email template.',
      'Putting an image into a JSON payload for an API test.',
    ],
  },

  'base64-to-image': {
    howItWorks: [
      'Base64 text is decoded back into bytes in your browser. If you paste a full data URL, its declared type is used; if you paste raw Base64, the format is detected from the file signature in the first bytes — PNG, JPEG, GIF, WebP, BMP and SVG are recognised.',
      'Whitespace is stripped automatically, and the decoded image is previewed with its real dimensions and size before you download it with the correct extension.',
    ],
    useCases: [
      'Seeing what image is stored in a database column or API response.',
      'Recovering an embedded image from email or HTML source.',
      'Checking that an encoded image is complete rather than truncated.',
    ],
  },

  'color-palette-extractor': {
    howItWorks: [
      'The image is drawn onto a canvas and its pixels read back. Colours are quantised into buckets and the most populated buckets become the palette, each reported with its share of the image.',
      'Frequency-based extraction favours large areas of colour, so small bright accents can rank low; increasing the palette size usually surfaces them. Swatches copy as hex, RGB or HSL, or the whole palette as CSS custom properties.',
    ],
    useCases: [
      'Building a colour scheme from a photograph or product shot.',
      'Pulling brand colours out of a logo you only have as an image.',
      'Generating CSS variables to match an illustration.',
    ],
  },

  'favicon-generator': {
    howItWorks: [
      'Your source image is drawn onto canvases at 16, 32, 48, 96, 144, 180, 192, 256 and 512 pixels and exported as PNGs, covering browser tabs, iOS home screens, Android and PWA install icons.',
      'The generator also writes the matching link tags and web app manifest entries. Fine detail vanishes at 16 pixels, so a simple, high-contrast square mark works best.',
    ],
    useCases: [
      'Creating every icon size a new website needs from one logo.',
      'Generating PWA manifest icons for an installable web app.',
      'Replacing a blurry favicon with properly sized versions.',
    ],
  },

  // ------------------------------------------------------------------------ pdf
  'rotate-pdf': {
    howItWorks: [
      'The PDF is loaded with pdf-lib in your browser and the rotation attribute of each selected page is changed in 90-degree steps. The document is then saved as a new file.',
      'Because rotation is stored in the file rather than only in a viewer, every PDF reader and printer honours it. The page content itself is not re-rendered, so text and images stay exactly as they were.',
    ],
    useCases: [
      'Fixing scanned pages that came out sideways.',
      'Rotating a single landscape table inside a portrait report.',
      'Correcting a document before sending it to print.',
    ],
  },

  'images-to-pdf': {
    howItWorks: [
      'Each image is embedded into a new PDF with pdf-lib — JPEG and PNG directly, other formats after your browser converts them to PNG. Pages can match each image’s size, or use A4 or US Letter with the image centred and scaled to fit.',
      'Images are embedded at their original resolution, in the order you arrange them, and the finished PDF is built entirely in your browser.',
    ],
    useCases: [
      'Combining phone photos of a document into one PDF.',
      'Submitting several scanned receipts as a single file.',
      'Turning a set of slides or screenshots into a shareable document.',
    ],
  },

  // ----------------------------------------------------------------------- text
  'character-counter': {
    howItWorks: [
      'JavaScript counts string length in UTF-16 code units, so many emoji count as two or more. The counter shows both that figure and the number of visible characters, plus a trimmed count that ignores leading and trailing whitespace.',
      'Live limits track the lengths people actually run into: SMS segments, a 60-character page title, a 160-character meta description and a 280-character social post.',
    ],
    useCases: [
      'Fitting a meta description or page title before publishing.',
      'Keeping an SMS within a single segment.',
      'Checking whether emoji will push a post over a platform limit.',
    ],
  },

  'reading-time': {
    howItWorks: [
      'Words are counted and divided by a reading speed — 225 words per minute by default for silent reading — to estimate reading time. Speaking time uses a slower presentation pace of about 150 words per minute.',
      'Both speeds are adjustable. Dense or technical text reads noticeably slower, so lowering the rate gives a more realistic estimate for that kind of material.',
    ],
    useCases: [
      'Adding a reading-time label to a blog post.',
      'Checking a speech or presentation script fits its time slot.',
      'Estimating how long a document will take to review.',
    ],
  },

  'remove-duplicate-lines': {
    howItWorks: [
      'Lines are compared in order and the first occurrence of each is kept, so the original sequence survives. Optional normalisation ignores case and surrounding whitespace when deciding whether two lines match.',
      'The inverted mode shows only the lines that were repeated, with a count of how many times each appeared.',
    ],
    useCases: [
      'Cleaning a merged email or contact list.',
      'Finding which entries appear more than once in an export.',
      'Deduplicating log lines before analysing them.',
    ],
  },

  'sort-lines': {
    howItWorks: [
      'Lines can be sorted alphabetically, numerically, by length or randomly, ascending or descending. Alphabetical sorting uses Intl.Collator, and natural mode compares embedded numbers by value so item2 comes before item10.',
      'The sort is stable — lines that compare as equal keep their original order — and blank lines can be removed or grouped at the end.',
    ],
    useCases: [
      'Alphabetising a list of names or keywords.',
      'Ordering file names that contain numbers correctly.',
      'Shuffling a list to pick items in random order.',
    ],
  },

  'reverse-text': {
    howItWorks: [
      'Character mode reverses by grapheme cluster rather than raw code unit, so emoji and accented characters built from several code points stay intact. Word mode keeps each word whole and reverses their order, and line mode reverses only the order of lines.',
      'Reversing changes character order; it does not produce mirrored glyphs.',
    ],
    useCases: [
      'Testing whether a word or phrase is a palindrome.',
      'Flipping the order of lines in a log or list.',
      'Undoing text that was exported in reverse order.',
    ],
  },

  'slug-generator': {
    howItWorks: [
      'The title is lowercased, accented characters are transliterated to their closest ASCII equivalents, punctuation and emoji are stripped, and runs of whitespace become a single separator. Stop-word removal and a maximum length are optional.',
      'Hyphens are the recommended separator because search engines treat them as word boundaries, whereas underscores join words together.',
    ],
    useCases: [
      'Creating URL slugs for blog posts or product pages.',
      'Generating file names from titles that contain accents or punctuation.',
      'Making consistent anchor IDs for headings.',
    ],
  },

  'lorem-ipsum': {
    howItWorks: [
      'Placeholder text is generated from a Latin-like word list with a natural spread of word lengths, as paragraphs, sentences or words. The classic "Lorem ipsum dolor sit amet" opening is on by default and can be turned off.',
      'Output can be wrapped in paragraph tags for pasting straight into a template.',
    ],
    useCases: [
      'Filling a page mockup so reviewers judge layout rather than copy.',
      'Testing how a component handles long paragraphs.',
      'Seeding placeholder content in a CMS during development.',
    ],
  },

  'remove-extra-spaces': {
    howItWorks: [
      'Each clean-up is a separate option: collapse repeated spaces, trim leading and trailing whitespace, convert tabs to spaces and collapse runs of blank lines. Line breaks are kept unless you choose to collapse all whitespace into a single line.',
      'Non-breaking spaces and zero-width characters — common when copying from web pages and word processors — are normalised as well.',
    ],
    useCases: [
      'Cleaning text copied from a PDF before pasting it elsewhere.',
      'Removing double spaces from a document.',
      'Stripping invisible characters that break search or comparisons.',
    ],
  },
};
