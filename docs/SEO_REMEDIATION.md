# SEO and AdSense remediation — 8 October 2026

## Implemented locally

- JSON formatter/minifier preserve original number literals, duplicate members and member order.
- Regex evaluation is isolated in a disposable worker, cancellable and time-limited.
- Currency overrides update the selected table row, clear when changing pairs, and no longer claim an unverified market date. Other rows are explicitly illustrative, not sourced rates.
- Privacy/About copy distinguishes local tool processing from third-party script capabilities. Animation preference storage is disclosed.
- CSS clamp rejects reversed/nonpositive viewport bounds. Clamp, contrast and text comparison explanations include examples and limitations; JSON and regex descriptions match implementation.
- Regression tests cover the affected calculations and worker behavior.

## Still requires external evidence or owner action

- Export example URLs from each Search Console coverage reason. Summary counts cannot identify the URLs needing repair.
- Investigate the 9 discovered-not-indexed and 1 crawled-not-indexed URLs individually. Check content usefulness, crawlable internal links, canonical targets and live URL Inspection.
- Verify the 26 redirect and 13 canonical-alternative URLs are intentional. Do not remove valid redirects or force every duplicate into the index.
- Inspect the 2 noindex URLs before changing directives; utility/error pages may intentionally be excluded.
- Compare query/page performance in consistent 28-day windows after deployment. Baseline supplied export: 569 impressions, 4 clicks, average position about 70.8; clicks were homepage-only. Indexing is not a ranking guarantee.
- Test the deployed consent message in applicable regions and inspect actual network behavior. Local copy changes do not certify compliance.
- Deploy and verify HTTPS/canonical redirects, sitemap, ads.txt, worker loading and tool interactions. Then submit updated priority URLs for indexing and run IndexNow if appropriate.
- Request AdSense review only after checking the deployed improvements. No word-count or traffic threshold guarantees approval; the rejection does not identify its exact page-level cause.

No deployment, Search Console changes or AdSense review submission is performed by these local changes.
