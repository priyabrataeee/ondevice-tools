import type { ToolGuide } from '../tool-examples';

/**
 * Image and PDF tools; each example is executed in image-pdf.spec.ts. Pixel
 * encoding needs a real browser canvas, so these examples check the sizing,
 * parsing and ordering logic the tools apply around it.
 */
export const IMAGE_PDF_GUIDES: Record<string, ToolGuide> = {
  'image-compressor': {
    examples: [
      {
        title: 'Shrink a camera photo for the web',
        settings: 'Maximum width 1600 px',
        input: 'Photo 4032 × 3024 px',
        output: 'Output: 1600 × 1200 px',
        explanation: 'Halving the width quarters the pixel count, which usually saves far more than lowering quality. The height follows the original 4:3 ratio.',
      },
      {
        title: 'A maximum width never enlarges',
        settings: 'Maximum width 1600 px',
        input: 'Screenshot 1280 × 720 px',
        output: 'Output: 1280 × 720 px',
        explanation: 'The image is already narrower than the limit, so its size is kept and only the quality setting reduces the file.',
      },
    ],
    limitations: [
      'Re-encoding a PNG that is already optimised can make it larger. The tool warns you; try WebP output or keep the original.',
      'Camera metadata, including GPS location, is not copied into the compressed file.',
      'JPEG has no transparency, so transparent areas become white. Choose WebP or PNG to keep them.',
    ],
  },
  'image-resizer': {
    examples: [
      {
        title: 'Resize to a set width, keeping proportions',
        settings: 'Lock aspect ratio on, width 1600',
        input: 'Image 4000 × 3000 px',
        output: 'Output: 1600 × 1200 px (40%)',
        explanation: 'With the ratio locked, the height is calculated from the width and rounded to whole pixels.',
      },
      {
        title: 'Scale a portrait image by percentage',
        settings: '50%',
        input: 'Image 1080 × 1920 px',
        output: 'Output: 540 × 960 px (50%)',
        explanation: 'Percentage scaling applies the same factor to both sides, so the shape never changes.',
      },
    ],
    limitations: [
      'Enlarging an image cannot add detail; the tool shows a warning when you upscale.',
      'Turning the ratio lock off stretches or squashes the image. Crop first if you need a different shape.',
      'The maximum size on either side is 20,000 px, and very large images may exceed a phone’s memory.',
    ],
  },
  'image-converter': {
    examples: [
      {
        title: 'Convert a transparent PNG logo to JPEG',
        settings: 'Output JPEG, quality 85%, background #ffffff',
        input: 'logo.png with a transparent background',
        output: 'Saved as: logo.jpg\nFormat: JPEG, quality 85%\nTransparency: filled with #ffffff',
        explanation: 'JPEG has no alpha channel, so transparent pixels are filled with the background colour you pick instead of turning black.',
      },
      {
        title: 'Convert a screenshot to WebP',
        settings: 'Output WebP, quality 85%',
        input: 'screenshot.png',
        output: 'Saved as: screenshot.webp\nFormat: WebP, quality 85%\nTransparency: kept',
        explanation: 'WebP keeps transparency and is usually much smaller than PNG for photos. For sharp text and flat colours, compare the size before switching.',
      },
    ],
    limitations: [
      'Output formats depend on your browser’s encoders. AVIF output is not available in every browser.',
      'Animated GIF and WebP files are flattened to one frame.',
      'Colour profiles and metadata are not carried over.',
    ],
  },
  'image-to-base64': {
    examples: [
      {
        title: 'Inline a tiny icon in HTML',
        settings: 'Default',
        input: 'dot.png, 68 bytes (a 1 × 1 px PNG)',
        output: '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=" alt="dot.png" />\nEncoded size: 114 characters (+68%)',
        explanation: 'Base64 needs four characters for every three bytes, plus the data: prefix, so even a tiny file grows. The size line shows the overhead.',
      },
      {
        title: 'Use the same image as a CSS background',
        settings: 'Default',
        input: 'dot.png, 68 bytes (a 1 × 1 px PNG)',
        output: 'background-image: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=\');\nEncoded size: 114 characters (+68%)',
        explanation: 'Inlining saves a network request, which helps only for very small images. Large inlined images block rendering and cannot be cached separately.',
      },
    ],
    limitations: [
      'Keep inlined images to a few kilobytes; the tool flags files over 10 KB.',
      'A data URL is about a third larger than the file it encodes.',
      'Inlined images are re-downloaded with every page or stylesheet that contains them.',
    ],
  },
  'base64-to-image': {
    examples: [
      {
        title: 'Decode a data URL copied from CSS',
        settings: 'Default',
        input: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
        output: 'Type: image/png\nDecoded size: 68 bytes',
        explanation: 'The type is detected from the decoded bytes’ signature, not just the declared MIME type, so a mislabelled data URL is still recognised.',
      },
      {
        title: 'Spot a truncated string',
        settings: 'Default',
        input: 'iVBORw0KGgo*AAAA',
        output: 'That is not valid Base64. Check for a truncated string or stray characters copied from the surrounding code.',
        explanation: 'Characters outside the Base64 alphabet, such as *, usually mean the string was cut or copied with surrounding code. The tool reports it instead of showing a broken image.',
      },
    ],
    limitations: [
      'Only image formats are previewed; other files that decode correctly are reported as not an image.',
      'URL-safe Base64 (- and _) is accepted and normalised.',
      'Very long strings can be slow to paste on phones.',
    ],
  },
  'color-palette-extractor': {
    examples: [
      {
        title: 'Two dominant colours',
        settings: 'Palette size 8',
        input: 'An image that is three-quarters navy #1e3a8a and one quarter amber #fbbf24',
        output: '#1e3a8a: 75%\n#fbbf24: 25%',
        explanation: 'Each swatch carries its share of the image. Only colours that are actually present are returned, so asking for 8 can give fewer.',
      },
      {
        title: 'Near-identical shades are grouped',
        settings: 'Palette size 8',
        input: 'An image split between #ff0000 and #fe0101',
        output: '#ff0101: 100%',
        explanation: 'Colours a viewer cannot tell apart are merged into one swatch, so JPEG noise does not fill the palette with duplicates.',
      },
    ],
    limitations: [
      'Images are downscaled to 400 px before sampling, so tiny details may not appear.',
      'Transparent pixels are ignored.',
      'The palette is based on pixel counts, not on what draws the eye; a small bright logo can be missed in a large photo.',
    ],
  },
  'favicon-generator': {
    examples: [
      {
        title: 'Generate a complete icon set',
        settings: 'Square logo, transparent background',
        input: 'logo.png, 512 × 512 px',
        output: 'icon-16.png\nicon-32.png\nicon-48.png\nicon-96.png\nicon-144.png\nicon-180.png\nicon-192.png\nicon-256.png\nicon-512.png',
        explanation: 'Nine PNG sizes cover browser tabs, bookmarks, the Apple home screen and installable web apps. Start from a source at least 512 px square.',
      },
      {
        title: 'Tags to paste into your page head',
        settings: 'Default',
        input: 'logo.png, 512 × 512 px',
        output: '<link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32.png">\n<link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-16.png">\n<link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-180.png">\n<link rel="manifest" href="/manifest.webmanifest">',
        explanation: 'Upload the icons to /icons/ on your site, or change the paths to match where you put them.',
      },
    ],
    limitations: [
      'No .ico file is produced. Current browsers use PNG favicons; only very old Internet Explorer versions need ICO.',
      'Non-square images are fitted inside the square with empty space at the sides.',
      'Fine detail disappears at 16 × 16; a simplified mark often works better than a full logo.',
    ],
  },
  'qr-code-generator': {
    examples: [
      {
        title: 'A short URL makes a small, easy-to-scan code',
        settings: 'Error correction M',
        input: 'https://ondevice-tools.org/',
        output: 'Version 3, 29 × 29 modules',
        explanation: 'Fewer modules mean bigger squares at the same print size, which scan faster and from further away.',
      },
      {
        title: 'Higher error correction adds modules',
        settings: 'Error correction H',
        input: 'https://ondevice-tools.org/',
        output: 'Version 4, 33 × 33 modules',
        explanation: 'Level H can recover from about 30% damage, useful when printing a logo over the code, but it needs more modules for the same text.',
      },
    ],
    limitations: [
      'Keep dark modules on a light background with strong contrast; many scanners fail on inverted or low-contrast codes. The tool warns about low contrast.',
      'Very long text cannot be encoded at high error correction. Shorten the text or lower the level.',
      'Test the printed code with two or three different phones before a print run.',
    ],
  },
  'merge-pdf': {
    examples: [
      {
        title: 'Put the cover letter first',
        settings: 'Move cover-letter.pdf up one place',
        input: 'cv.pdf (2 pages), cover-letter.pdf (1 page), references.pdf (1 page)',
        output: 'Order: cover-letter.pdf, cv.pdf, references.pdf\nTotal pages: 4',
        explanation: 'Files are merged in the order shown, and every page of each file is kept.',
      },
      {
        title: 'Remove a file before merging',
        settings: 'Remove references.pdf',
        input: 'cv.pdf (2 pages), cover-letter.pdf (1 page), references.pdf (1 page)',
        output: 'Order: cv.pdf, cover-letter.pdf\nTotal pages: 3',
        explanation: 'The page total updates as files are added, removed or reordered, so you can check the result before downloading.',
      },
    ],
    limitations: [
      'Form field values and digital signatures do not survive a merge.',
      'Password-protected files must be unlocked first.',
      'Everything is held in memory, so very large scanned files can fail on phones.',
    ],
  },
  'split-pdf': {
    examples: [
      {
        title: 'Extract a few pages',
        settings: 'Extract, from a 10-page document',
        input: '1-3, 7',
        output: 'Selected pages: 1, 2, 3, 7\nAction: Extract 4 pages\nNew file has pages: 1, 2, 3, 7',
        explanation: 'Ranges and single pages can be mixed, separated by commas. Pages are kept in document order.',
      },
      {
        title: 'Ignore pages that do not exist',
        settings: 'Remove, from a 10-page document',
        input: '9-12, 3, 3',
        output: 'Selected pages: 3, 9, 10\nAction: Remove 3 pages\nNew file has pages: 1, 2, 4, 5, 6, 7, 8',
        explanation: 'Pages beyond the end of the document and duplicates are dropped rather than causing an error.',
      },
    ],
    limitations: [
      'The original file is never modified; a new file is downloaded.',
      'Removing every page is not allowed, because it would produce an empty document.',
      'Bookmarks and links that point to removed pages stop working.',
    ],
  },
  'rotate-pdf': {
    examples: [
      {
        title: 'Rotate two scanned pages that came out sideways',
        settings: '90° clockwise, from an 8-page document',
        input: '2, 5',
        output: 'Pages rotated: 2, 5\nBy: 90°',
        explanation: 'Only the listed pages turn; the rest stay as they are.',
      },
      {
        title: 'Turn an upside-down document',
        settings: '180°, from an 8-page document, all pages',
        input: '1-8',
        output: 'Pages rotated: 1, 2, 3, 4, 5, 6, 7, 8\nBy: 180°',
        explanation: 'Rotation is added to each page’s existing rotation, so rotating twice by 180° restores the original.',
      },
    ],
    limitations: [
      'Rotation changes how pages are displayed; the page content is not redrawn or recompressed.',
      'Some viewers cache the old orientation; reopen the file if it looks unchanged.',
      'Password-protected files must be unlocked first.',
    ],
  },
  'images-to-pdf': {
    examples: [
      {
        title: 'A phone photo on an A4 page',
        settings: 'Page size A4 portrait',
        input: 'Photo 3024 × 4032 px',
        output: 'Page: 595.28 × 841.89 pt\nImage: 547.28 × 729.71 pt at x 24, y 56.09',
        explanation: 'The image is scaled to fit inside a 24-point margin and centred, without stretching. Sizes are in PDF points, 72 to the inch.',
      },
      {
        title: 'Keep each image at its own size',
        settings: 'Page size Fit each image',
        input: 'Screenshot 1280 × 720 px',
        output: 'Page: 1280 × 720 pt\nImage: 1280 × 720 pt at x 0, y 0',
        explanation: 'Each page takes the image’s pixel dimensions as points, so there is no margin and no scaling.',
      },
    ],
    limitations: [
      'Only PNG and JPEG can be embedded directly; other formats are converted to PNG first, which can make the PDF larger.',
      'Images are embedded at full resolution. Compress large photos first if file size matters.',
      'Text in images is not made searchable; this is not OCR.',
    ],
  },
};
