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

export const CATEGORY_CONTENT: Record<CategoryId, CategoryContent> = {
  developer: {
    headline: 'Private Developer Utilities for Coding, Debugging and Data Interchange',
    leadParagraph:
      'Modern software engineering requires frequent inspection, transformation and validation of sensitive payloads — from production JWT tokens and database credentials to raw API responses and environment configs. OnDevice Tools executes every developer utility locally inside your browser engine, guaranteeing that proprietary schemas, keys and customer payloads are never transmitted to external servers.',
    sections: [
      {
        heading: 'Why Local Browser Execution Matters for Developers',
        body: [
          'Many hosted developer utilities operate as cloud proxies: when you paste a JSON payload, format an SQL query, or decode a JWT, your data travels over the public internet to third-party servers. If that payload contains authentication headers, session IDs, private API keys, or GDPR-governed personal data, sending it to an unverified third-party host constitutes a serious security and compliance breach.',
          'OnDevice Tools completely eliminates that risk by utilizing native JavaScript and browser web APIs. JSON manipulation runs directly through the V8/SpiderMonkey JSON engine (RFC 8259). Hashing is executed via the browser’s audited Web Crypto API (SubtleCrypto), and regex matching compiles against the native RegExp engine. Nothing is uploaded, cached, or logged on any remote server.',
        ],
      },
      {
        heading: 'Built-in Syntax Integrity and Standard Compliance',
        body: [
          'Every formatter and parser in this collection strictly follows industry standards rather than heuristic guessing. The JSON tools adhere to ECMA-404 / RFC 8259; the SQL formatter enforces ANSI/ISO SQL grammar; the YAML engine handles standard YAML 1.2 configuration structures; and the JWT decoder parses RFC 7519 claims without requesting or exposing your signing keys.',
          'Because these tools run natively on your machine, there are zero artificial rate limits, no CAPTCHA interruptions, and zero latency introduced by server round-trips.',
        ],
      },
    ],
    workflows: [
      {
        title: 'Inspecting and Debugging Production API Responses',
        steps: [
          'Copy minified or obfuscated JSON payloads directly from your browser DevTools Network tab or server logs.',
          'Use the JSON Formatter to pretty-print with consistent 2-space or 4-space indentation and inspect nested objects.',
          'Verify syntax errors with the JSON Validator to locate line and column offsets of malformed characters.',
          'Minify the cleaned payload for efficient production transmission or Git fixture storage.',
        ],
      },
      {
        title: 'Verifying Authentication Tokens and Claims',
        steps: [
          'Paste a JSON Web Token into the JWT Decoder to inspect header algorithms (alg) and token type (typ).',
          'Audit payload claims including expiration timestamps (exp), issued-at (iat), roles, and tenant identifiers.',
          'Compare timestamps against current UTC time to diagnose unexpected 401 Unauthorized errors without exposing secrets.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Are production tokens, passwords or database queries uploaded to any server?',
        a: 'No. Every calculation, decoding and formatting operation occurs 100% inside your browser session. You can inspect the Network tab in your developer tools or run the tools completely offline to verify zero data egress.',
      },
      {
        q: 'How large a JSON or SQL document can be processed?',
        a: 'Because processing is constrained only by your device memory and browser JavaScript heap, you can comfortably format documents spanning tens of megabytes without hitting hosted API payload limits.',
      },
      {
        q: 'Can the JWT decoder verify signatures?',
        a: 'No, and by design. Signature verification requires sharing your public certificate or signing secret. A web-based tool asking for signing secrets creates severe security risks; token decoding allows claim inspection while keeping secrets securely inside your private infrastructure.',
      },
    ],
  },

  text: {
    headline: 'High-Performance Text Analysis, Cleanup and Manipulation',
    leadParagraph:
      'Writing, content editing, and text normalization frequently involve sensitive manuscripts, internal drafts, code comments, and legal briefs. Our text tools run on-device, offering instant line sorting, deduplication, word counts, and diff comparisons with zero network transmission.',
    sections: [
      {
        heading: 'Instantaneous Text Processing Without Cloud Latency',
        body: [
          'Sending large text documents to remote servers for simple operations like sorting lines or counting words introduces latency, bandwidth waste, and confidentiality concerns. OnDevice Tools handles string manipulation directly in memory using optimized JavaScript algorithms.',
          'Whether you are diffing two configuration revisions, generating URL-friendly slugs for articles, or normalizing erratic whitespace across thousands of lines, all computations finish in milliseconds without waiting for server response queues.',
        ],
      },
      {
        heading: 'Precision Diffing and Text Statistics',
        body: [
          'Our Text Compare utility implements an in-memory diff algorithm that highlights character-by-character and line-by-line variances cleanly. Meanwhile, our word and character counters compute reading time, sentence density, and byte sizes accurately across Unicode scripts.',
        ],
      },
    ],
    workflows: [
      {
        title: 'Cleaning Up Raw Datasets and Lists',
        steps: [
          'Paste raw data containing duplicate entries or sporadic spacing into Remove Extra Spaces or Remove Duplicate Lines.',
          'Use Sort Lines to alphabetize or organize records in ascending or descending sequence.',
          'Copy the sanitized, normalized output directly into your application, spreadsheet, or code repository.',
        ],
      },
      {
        title: 'Draft Auditing and Publishing Preparation',
        steps: [
          'Check word count, character count, and estimated reading time using the Reading Time calculator.',
          'Generate clean, kebab-case URL slugs from your draft headlines with the Slug Generator.',
          'Standardize capitalization across headlines using the Case Converter (Title Case, camelCase, UPPERCASE, lowercase).',
        ],
      },
    ],
    faqs: [
      {
        q: 'Is my text cached or logged by OnDevice Tools?',
        a: 'Never. Your text exists only in the DOM and memory of your current browser tab. Once you close the tab or clear the input, all data is permanently discarded.',
      },
      {
        q: 'Does the text comparison tool work with code files?',
        a: 'Yes. It accurately diffs code snippets, JSON payloads, Markdown articles, and plain text files with syntax whitespace preservation.',
      },
      {
        q: 'How does the reading time calculator estimate duration?',
        a: 'It uses standard reading speed averages (typically 200–250 words per minute for silent adult reading) and adjusts for sentence complexity and word density.',
      },
    ],
  },

  image: {
    headline: 'Client-Side Image Compression, Resizing and Conversion',
    leadParagraph:
      'Optimize web graphics, generate custom favicons, create QR codes, and convert image formats without uploading personal photos or proprietary artwork to cloud conversion queues. Everything is rendered and compressed using hardware-accelerated HTML5 Canvas and Web APIs.',
    sections: [
      {
        heading: 'Browser-Native Graphic Processing with Canvas & Web APIs',
        body: [
          'Traditional online image compressors require uploading megabytes of image data to a remote server, where they sit in cloud storage buckets before being compressed and returned. This model is slow, consumes mobile data, and exposes private photos, personal identification scans, and proprietary design mockups to third-party cloud infrastructure.',
          'OnDevice Tools utilizes the HTML5 Canvas API and browser-native image codecs (JPEG, PNG, WebP). Your image is read directly from your local file system via the File API, drawn to an in-memory canvas, downscaled or cropped, and re-encoded using native browser methods. The entire pipeline happens on your local CPU/GPU.',
        ],
      },
      {
        heading: 'Lossy and Lossless Optimization for Web Performance',
        body: [
          'Web performance depends on minimal payload sizes. Our image compression and format conversion tools enable precise quality adjustments so you can achieve the ideal balance between visual clarity and file size reduction before deploying assets to production.',
        ],
      },
    ],
    workflows: [
      {
        title: 'Optimizing Images for Web and Mobile Apps',
        steps: [
          'Select source photos or artwork from your device via drag-and-drop.',
          'Adjust dimensions in Image Resizer or crop to specific aspect ratios using Crop Image.',
          'Tune compression quality in Image Compressor or convert to modern WebP for smaller asset sizes.',
          'Download the compressed asset immediately with zero upload waiting time.',
        ],
      },
      {
        title: 'Generating Production Favicon Bundles',
        steps: [
          'Upload your brand logo or icon into the Favicon Generator.',
          'Preview automatic scaling across standard browser resolutions (16x16, 32x32, 48x48, 180x180 Apple Touch Icon, 192x192 PWA, 512x512 splash).',
          'Download the packaged icon set and integrate it directly into your HTML head tags.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Are my photos or images sent to a server for compression?',
        a: 'No. The image never leaves your device. All decoding, pixel resampling, and re-encoding occur locally inside your browser via the HTML5 Canvas API.',
      },
      {
        q: 'Can I compress or resize large high-resolution images?',
        a: 'Yes. Modern desktop and mobile browsers can easily handle photos from DSLR cameras and modern smartphones up to several dozen megapixels.',
      },
      {
        q: 'Which output formats are supported?',
        a: 'We support modern web formats including WebP, PNG, JPEG, Base64 data URIs, and ICO bundles for favicons.',
      },
    ],
  },

  pdf: {
    headline: 'Private In-Browser PDF Assembly, Splitting and Page Rotation',
    leadParagraph:
      'Manage business contracts, financial statements, academic papers, and tax documents with complete peace of mind. Our PDF suite merges, splits, rotates, and converts images to PDF directly in browser memory without sending a single byte to an external server.',
    sections: [
      {
        heading: 'Zero-Upload Document Security for Sensitive Records',
        body: [
          'Uploading sensitive PDF documents (containing bank statements, tax IDs, signed contracts, or medical records) to cloud PDF services is one of the most common vectors for unintended data exposure. Many third-party online PDF tools retain documents in temporary storage or utilize cloud workers that parse text and metadata.',
          'OnDevice Tools processes PDF files using a pure client-side WebAssembly and JavaScript PDF engine (`pdf-lib`). The binary stream is parsed directly in browser memory, pages are rearranged, rotated, or merged, and the new PDF file is generated and saved directly to your downloads folder.',
        ],
      },
      {
        heading: 'Full Structural Fidelity and Cross-Platform Compatibility',
        body: [
          'Our PDF utilities preserve vector graphics, fonts, embedded images, and document structures without rasterization artifacts. Because operations do not involve server round-trips, even multi-hundred-page documents can be re-indexed and exported in seconds.',
        ],
      },
    ],
    workflows: [
      {
        title: 'Merging Multi-Part Documents and Invoices',
        steps: [
          'Select two or more PDF files from your local storage in Merge PDF.',
          'Arrange the files in your preferred sequence.',
          'Click Merge to instantaneously bundle all pages into a unified document and download it locally.',
        ],
      },
      {
        title: 'Extracting and Splitting Key Sections',
        steps: [
          'Open your document in Split PDF and specify the desired page ranges or individual page numbers.',
          'Export the exact pages needed for client delivery or archival without exposing the rest of the file.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Is there any file size limit for PDF processing?',
        a: 'There is no artificial server limit. Because processing uses your local device RAM, most modern computers and phones can comfortably handle PDFs with hundreds of pages.',
      },
      {
        q: 'Does splitting or rotating a PDF degrade text or image quality?',
        a: 'No. Operations modify document page trees and orientation metadata directly without re-compressing or rasterizing vector text or images.',
      },
      {
        q: 'Can I use these PDF tools while offline?',
        a: 'Yes. Once cached by our Service Worker, the PDF tools function fully without an internet connection.',
      },
    ],
  },

  css: {
    headline: 'Modern CSS Generators and Layout Assistants',
    leadParagraph:
      'Craft modern, responsive user interfaces with visual generators that output clean, performant CSS code. Design layered box shadows, fluid clamp typography, smooth gradients, flexbox alignments, and responsive CSS grid architectures visually.',
    sections: [
      {
        heading: 'Interactive Visual Design with Zero-Boilerplate Output',
        body: [
          'Writing complex modern CSS features by hand — such as multi-layered ambient shadows, complex linear/radial gradients, or fluid typography formulas with `clamp()` — often involves tedious trial-and-error in developer tools.',
          'Our CSS generators provide real-time interactive previews and immediately generate clean, standard-compliant CSS properties that you can paste directly into your stylesheets, Tailwind configuration, or CSS-in-JS components.',
        ],
      },
      {
        heading: 'Fluid Typography and Modern Layout Systems',
        body: [
          'Modern responsive design has moved beyond rigid media queries. Our Clamp Generator formulates mathematically smooth viewport-based fluid scaling between defined minimum and maximum dimensions, ensuring seamless transitions across mobile, tablet, and ultra-wide screens.',
        ],
      },
    ],
    workflows: [
      {
        title: 'Designing Multi-Layered Soft Box Shadows',
        steps: [
          'Adjust elevation, blur radius, spread, opacity, and color in the Box Shadow Generator.',
          'Layer multiple shadow passes to create realistic lighting and depth.',
          'Copy the synthesized `box-shadow` CSS rule directly into your design system.',
        ],
      },
      {
        title: 'Building Fluid Responsive Typography',
        steps: [
          'Define minimum font size for mobile viewports (e.g. 320px) and maximum font size for desktop viewports (e.g. 1280px).',
          'Let the Clamp Generator calculate the precise viewport slope and intercept values.',
          'Copy the single-line `font-size: clamp(...)` rule to replace multiple media queries.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Do the generated CSS properties work across all modern browsers?',
        a: 'Yes. All generated styles adhere to modern W3C CSS specifications supported by all major evergreen browsers (Chrome, Edge, Firefox, Safari).',
      },
      {
        q: 'Can I use the CSS output in frameworks like React, Vue, or Tailwind?',
        a: 'Yes. The generated CSS rules can be pasted into standard stylesheets, inline styles, CSS modules, or mapped to Tailwind theme configuration.',
      },
      {
        q: 'Are any styles or user inputs transmitted to external analytics?',
        a: 'No. Your adjustments and style configurations run entirely locally in your browser session.',
      },
    ],
  },

  color: {
    headline: 'Color Space Conversions and WCAG Accessibility Auditing',
    leadParagraph:
      'Translate color coordinates across HEX, RGB, HSL, and modern color spaces, and ensure digital interfaces meet WCAG 2.1 AA and AAA contrast accessibility standards for legible, inclusive design.',
    sections: [
      {
        heading: 'Accessible Contrast Ratios for Inclusive Web Applications',
        body: [
          'Digital accessibility is a legal and ethical requirement for modern websites. WCAG guidelines mandate minimum contrast ratios between foreground text and background surfaces (4.5:1 for normal text and 3:1 for large text at Level AA; 7:1 and 4.5:1 at Level AAA).',
          'Our Contrast Checker evaluates relative luminance precisely according to W3C formulas and gives clear pass/fail feedback for both small and large text sizes, helping designers and front-end developers catch accessibility barriers before shipping to production.',
        ],
      },
      {
        heading: 'Accurate Multi-Format Color Conversion',
        body: [
          'Designers frequently collaborate across different tools and specifications requiring instant conversions between HEX hexadecimals, integer RGB, and cylindrical HSL coordinates. Our Color Converter ensures lossless color coordinate round-tripping with visual color swatch inspection.',
        ],
      },
    ],
    workflows: [
      {
        title: 'Validating Brand Colors for Web Accessibility',
        steps: [
          'Enter your brand foreground text color and background container color in the Contrast Checker.',
          'Inspect the computed contrast ratio and pass/fail indicators for WCAG AA and AAA standards.',
          'Fine-tune color brightness or saturation live to achieve required compliance thresholds.',
        ],
      },
    ],
    faqs: [
      {
        q: 'What is the minimum WCAG contrast ratio for body text?',
        a: 'WCAG 2.1 Level AA requires a minimum contrast ratio of 4.5:1 for regular text (under 18pt or 14pt bold) and 3:1 for large text.',
      },
      {
        q: 'Are color inputs logged or sent to any server?',
        a: 'No. Color calculations use client-side colorimetric formulas executed locally in JavaScript.',
      },
      {
        q: 'Does the tool support alpha transparency?',
        a: 'Yes, alpha channels are supported for color representations and luminance blending.',
      },
    ],
  },

  calculator: {
    headline: 'Everyday Financial and Mathematical Calculators',
    leadParagraph:
      'Make informed decisions on home loans, recurring investments, GST taxes, compound interest, and percentage variations. Compute accurate amortisation schedules and financial projections privately without submitting your personal finances to lead-generation brokers.',
    sections: [
      {
        heading: 'Private Financial Calculations Without Lead-Gen Tracking',
        body: [
          'Most online financial calculators are operated by loan aggregators, banks, or lead-generation agencies. When you type in loan amounts, salary estimates, or investment figures, your inputs and IP address are frequently collected, profiled, and sold to financial telemarketers.',
          'OnDevice Tools provides pure mathematical calculators that execute 100% on your device. Your loan principals, interest rates, tenures, and investment goals stay entirely in your browser tab. We have no backend database and no lead-capture forms.',
        ],
      },
      {
        heading: 'Mathematically Rigorous Financial Models',
        body: [
          'Our EMI calculator uses the exact standard annuity formulation to project monthly payments and generate month-by-month amortisation schedules. The SIP and Compound Interest calculators compute compounding frequency yields with precision, allowing instant comparison across investment horizons.',
        ],
      },
    ],
    workflows: [
      {
        title: 'Planning a Home or Personal Loan',
        steps: [
          'Enter principal amount, annual interest rate, and repayment tenure in the EMI Calculator.',
          'Review the monthly instalment, total interest payable, and the total cost of the loan.',
          'Inspect the month-by-month amortisation schedule to see how your balance reduces over time.',
        ],
      },
      {
        title: 'Evaluating Systematic Investment Returns (SIP)',
        steps: [
          'Input your monthly investment amount, expected annual return rate, and investment tenure in the SIP Calculator.',
          'Instantly view your total invested capital versus total wealth created through compounding.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Are the financial calculations legally binding?',
        a: 'No. They provide mathematical projections based on standard formulas. Real-world financial products may include institution-specific processing fees, taxes, insurance, or daily-reducing interest variations.',
      },
      {
        q: 'Does anyone see the financial figures I enter?',
        a: 'No. All calculations run strictly in your browser using JavaScript arithmetic. Nothing is sent over the network.',
      },
      {
        q: 'What is the formula for loan EMI calculation?',
        a: 'EMI = P × r × (1 + r)^n / ((1 + r)^n - 1), where P is principal, r is the monthly interest rate, and n is the tenure in months.',
      },
    ],
  },

  converter: {
    headline: 'Universal Unit and Metric-to-Imperial Converters',
    leadParagraph:
      'Convert physical measurements, storage capacities, temperatures, speeds, and currencies accurately. Instant bidirectional unit conversion with standard international conversion constants.',
    sections: [
      {
        heading: 'Standardized Conversion Factors and Precision',
        body: [
          'Converting engineering, culinary, scientific, and geographical units requires reliable, standardized physical conversion factors (NIST / SI standards). Our converter utilities maintain high floating-point precision to prevent rounding drift during multi-stage conversions.',
          'From digital storage conversions (bytes, KB, MB, GB, TB) to length, area, volume, and temperature scales (Celsius, Fahrenheit, Kelvin), conversions update instantaneously as you type.',
        ],
      },
      {
        heading: 'Currency Conversion Transparency',
        body: [
          'Our currency converter operates on bundled reference exchange rates and clearly indicates rate snapshot timestamps, allowing you to quickly estimate international prices without triggering third-party financial API trackers.',
        ],
      },
    ],
    workflows: [
      {
        title: 'Converting Engineering and Construction Dimensions',
        steps: [
          'Select source and target units in the Length or Area Converter (e.g., meters to feet, square meters to square feet).',
          'Enter values to see simultaneous conversion across all related units in the conversion table.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Are conversions calculated locally?',
        a: 'Yes. All unit conversions use fixed mathematical coefficients evaluated in your browser in real time.',
      },
      {
        q: 'Are currency conversion rates live?',
        a: 'Currency conversions use periodic reference rate snapshots. For financial transactions, always confirm live rates with your bank or payment provider.',
      },
    ],
  },

  datetime: {
    headline: 'Date Arithmetic, Age Calculators and Global Timezone Conversion',
    leadParagraph:
      'Calculate exact calendar age, elapsed days between dates, exclude weekends and holidays for business working day schedules, and coordinate international meetings across global timezones.',
    sections: [
      {
        heading: 'Accurate Calendar Calculations Accounting for Leap Years',
        body: [
          'Calendar mathematics is surprisingly tricky due to varying month lengths, leap years, and daylight saving time (DST) shifts. Our date utilities handle Gregorian calendar irregularities correctly, providing breakdown in years, months, days, hours, and minutes.',
          'The Working Days calculator enables project managers and contractors to compute business delivery timelines by stripping out Saturdays and Sundays automatically.',
        ],
      },
      {
        heading: 'Frictionless Global Timezone Coordination',
        body: [
          'Distributed teams often struggle with time zone math across UTC offsets and daylight saving transitions. Our Timezone Converter utilizes the browser’s native `Intl.DateTimeFormat` engine (grounded in the audited IANA Time Zone Database) to provide reliable local time translations.',
        ],
      },
    ],
    workflows: [
      {
        title: 'Calculating Project Milestones and Business Days',
        steps: [
          'Select start date and end date in the Working Days Calculator.',
          'Review the total elapsed calendar days versus actual business working days (excluding weekends).',
        ],
      },
      {
        title: 'Verifying Exact Age and Milestone Dates',
        steps: [
          'Enter date of birth in the Age Calculator.',
          'View exact chronological age broken down into years, months, days, and total days lived.',
        ],
      },
    ],
    faqs: [
      {
        q: 'How does the timezone converter handle Daylight Saving Time (DST)?',
        a: 'It uses the browser’s built-in IANA timezone database, which accounts for historical and upcoming daylight saving transitions automatically.',
      },
      {
        q: 'Are my calendar dates transmitted to any server?',
        a: 'No. All date arithmetic is processed locally in client-side JavaScript.',
      },
    ],
  },
};
