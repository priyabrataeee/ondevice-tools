# OnDevice Tools — Utility Engine UI

## Direction

The homepage is a working instrument console, not a marketing hero. Visitors choose one of nine category keys around a radial dial, search the complete inventory from the command strip, or open a tool directly from the receipt-like index.

The visual language combines technical instrumentation, printed receipts and a microscope-like local-processing backdrop. It uses native Angular templates, CSS and SVG. No remote images, font requests or animation libraries were added.

Reference principles:

- [Linear: A calmer interface for a product in motion](https://linear.app/now/behind-the-latest-design-refresh) — hierarchy and restrained motion.
- [Teenage Engineering: Field desk](https://teenage.engineering/products/field-desk) — physical controls, labels and modular construction.
- [Raycast](https://www.raycast.com/) — fast discovery and keyboard-oriented access.

The layout and interaction model are bespoke to OnDevice Tools. The design intentionally avoids a generic hero, CTA and card-grid landing page.

## What changed

- Replaced the old hero/workbench homepage with the Utility Engine console.
- Added a radial category dial with nine real buttons, selection state, category counts and left/right keyboard navigation.
- Added a global command strip that searches the complete tool inventory.
- Added a scrollable receipt-like live index with direct links to every tool in the selected category or search result.
- Added quick-start links, a recent/saved shelf and the privacy explanation below the console.
- Reworked the palette to charcoal, warm ivory, copper and indigo in light and dark themes.
- Recoloured the fixed microscope-cell background and regenerated the app icons and social image.
- Applied the index treatment to the all-tools and category catalogues.
- Kept existing tool routes, SEO metadata, on-device processing, consent integrations, strict CSP and header pause control intact.
- Kept reduced-motion handling for CSS motion. The existing canvas animation remains user-pausable from the header.

## Review before deployment

Check the local preview at http://127.0.0.1:4300/.

Verify:

- light and dark themes;
- 320px, 360px, 390px and desktop widths;
- no horizontal page overflow;
- selecting each category key;
- searching for a tool across the full inventory;
- clearing a search;
- ArrowLeft and ArrowRight category navigation;
- opening a receipt row and a quick-start link;
- pause persistence and theme persistence;
- keyboard command-palette focus trapping;
- representative tool inputs after navigating from the new homepage.

This refresh does not deploy or request AdSense review.

## Local validation — 9 October 2026

- npm run lint passed.
- npm test -- --watch=false passed: 4 test files, 11 tests.
- npm run build passed: 81 prerendered routes; 79 sitemap URLs; strict CSP retained.
- git diff --check passed.
- Browser checks passed at 320, 360, 390, 768, 1024 and 1440px.
- Browser checks showed scrollWidth equals clientWidth at every tested width.
- Live search, category selection and ArrowRight navigation were verified in the local preview.
- Existing qrcode, dijkstrajs and pngjs CommonJS optimization warnings remain.
- No deployment was performed.
