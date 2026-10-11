# SEO and AdSense remediation — updated 11 October 2026

## Evidence from the 11 October review

- The supplied Coverage ZIP contains summary CSVs, not affected URLs. Its chart ends on **4 October**, with 73 indexed and 51 excluded URLs across "All known pages", not just the sitemap.
- Reasons: 26 redirects, 13 proper canonical alternatives, 2 noindex, 9 discovered-not-indexed and 1 crawled-not-indexed. Validation failure alone does not make an intentional redirect or canonical alternate wrong.
- All **79 live sitemap URLs** returned HTTP 200, a self-referencing canonical, one H1 and indexable robots metadata during this review. HTTP and www both redirected to the HTTPS apex. ads.txt matched the configured publisher. These checks do not establish rankings or AdSense approval.
- The live ad loader was present on `/favorites/`, `/404/` and a real missing-page response. This is an avoidable ad-placement risk, not proof of Google's exact rejection cause. The screenshot reports only "Low-value content".

## Additional local fixes — 11 October

- Restricted the AdSense loader to known tool pages. Home, catalog/search, categories, saved lists, legal/contact/about and error pages stay ad-free. Publisher verification remains available on every page.
- Added a document-navigation boundary when leaving an ad-enabled tool. Removing a script tag alone cannot unload Auto Ads after SPA navigation. Tests cover back/forward history and subsequent tool entry.
- Kept privacy-choice information reachable from every footer. Added a link that requests the provider's consent control on a tool page and restarted consent detection after late SPA entry. The actual provider dialog still requires published account-side messaging; this is not a compliance certification.
- Replaced unsupported absolute-privacy, instant-processing, unlimited-use, guaranteed-offline and guaranteed-support claims with implementation-specific descriptions. Removed advice to paste live credentials. Clarified advertising configuration versus approval.
- Added 12 tested input/output examples and tool-specific limitations across Sort Lines, Remove Duplicate Lines, Reverse Text, Slug Generator, JSON Minifier and XML Formatter. These are practical documentation, not a word-count target.
- Fixed XML minification/formatting changing meaningful whitespace. Quoted values, mixed content, comments, CDATA and preserved-space subtrees retain source text. DTD documents return unchanged with a warning. This is not XML canonicalization.
- Fixed descending sort reversing equal-value records and moving nonnumeric rows ahead of numeric rows. Corrected blank-line, Unicode fallback and slug-transliteration descriptions.
- Added explicit substantive-update dates for changed tools. Sitemap dates now match rendered structured data; pages without known dates no longer acquire a fabricated build-day lastmod.
- Added `npm run verify:review` to audit all prerendered pages for canonicals, robots, ad eligibility, internal links, publisher verification, examples and sitemap dates.

## Validation

- Production build and lint pass. Existing QR-library CommonJS optimization warnings remain; no dependency migration was attempted.
- All 52 Angular/Vitest tests and 4 worker tests pass. They cover worked examples, XML preservation, sorting, advertising boundaries, consent-control discovery and existing tools. Run `npm test -- --watch=false` and `node --test tests/regex-worker.test.mjs`.
- Local production-style preview uses the existing Cloudflare asset configuration through Wrangler, not a deployed Worker. Browser checks cover XML values/errors, ad-free empty search, tool-to-favorites and browser back/forward navigation. The XML page and example cards fit a 390px mobile viewport without horizontal overflow. Actual missing URLs return 404 and noindex without the ad loader.
- The original ZIP is unchanged. No production deployment, Search Console validation, indexing request or AdSense review was submitted.

References: [Page indexing report](https://support.google.com/webmasters/answer/7440203?hl=en), [AdSense content and experience](https://support.google.com/adsense/answer/10015918?hl=en), [Ads on screens without publisher content](https://support.google.com/publisherpolicies/answer/11112688?hl=en), [Accurate sitemap dates](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap), [Cloudflare local development](https://developers.cloudflare.com/workers/local-development/).

The privacy description now distinguishes Consent Mode signals from a no-network guarantee, consistent with [Google's Consent Mode overview](https://developers.google.com/tag-platform/security/concepts/consent-mode). Account-side CMP publication and regional behavior still require deployed verification.

## Earlier fixes — 8 October

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
