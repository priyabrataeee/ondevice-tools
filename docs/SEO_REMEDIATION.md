# SEO and AdSense remediation — updated 4 November 2026

## AdSense “Low-value content” — 4 November

Google’s rejection asks for substantial unique value, ongoing curation and genuine user interest. Code can address the first two. Only time and real visitors address the third.

Audit findings:

- 55 of 64 tool pages had no original examples; median page length was 506 words of templated copy.
- Category pages made claims the tools could not back up: WebAssembly PDF processing, ANSI SQL validation, data-storage unit conversion, live currency snapshots, a favicon .ico file, monthly amortisation schedules.
- Two tool FAQs were false: Speed Converter claimed a running-pace display, Volume Converter a US customary cup.
- Two real bugs: Date Difference and Age Calculator returned negative days for spans starting on the 29th–31st; Word Counter counted an emoji as two characters while claiming otherwise.
- Five near-identical converter pages.

Changes:

- **Worked examples on all 60 tools.** Each has two examples and a limits list. Every output is produced by the tool’s own code in a unit test (`src/app/core/data/examples/*.spec.ts`; regex examples in `tests/regex-worker.test.mjs`). A test fails if any tool lacks examples.
- **Unit Converter.** Length, weight, area, volume and speed merged into `/tools/unit-converter/` with a quantity selector and `?type=`. Old URLs 301 there. Fixed the unit dropdown showing the wrong unit after switching quantity.
- **Category pages rewritten** to match verified behaviour; false FAQs corrected.
- **Bug fixes:** `calendarDiff` steps back to the last real monthly anniversary (regression tests added); Word Counter counts grapheme clusters.
- **Guides:** five long-form articles at `/guides/`, with Article and breadcrumb structured data, linked from relevant tool pages.
- **What’s new** page at `/changelog/` built from real dates.
- Tool pages show their last-updated date and that examples are test-checked. About explains the testing.
- Sitemap `lastmod` covers guides. Header search and donate labels collapse to icons below 1280 px to fit the new Guides link.

Validation: build, lint, 164 unit tests, 6 worker tests and `verify:review` (84 pages, 82 sitemap URLs, 60 example pages) pass. Unit Converter, a guide, the changelog and a tool page were checked in Wrangler preview.

**Owner review needed before deploy:** the five guides and the rewritten category copy were drafted by an assistant from the code. Read them for accuracy and voice; you are named as the author.

### AdSense checklist

1. Deploy, then resubmit `sitemap.xml` in Search Console.
2. Request indexing for `/guides/`, the five guides, `/changelog/` and `/tools/unit-converter/`.
3. Do not request review yet. Wait 4–8 weeks while Google recrawls.
4. Build real interest: share specific guides where the question is asked (Stack Overflow answers, Reddit threads, dev forums), list the project on GitHub topics and directories of privacy-respecting tools. Avoid link schemes.
5. Keep curating: add one guide or meaningful tool improvement every week or two, and log it on What’s new.
6. In AdSense, publish the consent message (Privacy & messaging) for EEA/UK visitors.
7. Request review when most sitemap URLs are indexed and Search Console shows steady organic clicks, not just impressions.

## Search Console review — 31 October

Exports: Coverage, Performance (last 24 hours), Breadcrumbs and HTTPS, plus the "Discovered – currently not indexed" example list.

- HTTPS: 21 of 21 URLs HTTPS. Breadcrumbs: 11 valid, 0 invalid. No action.
- Indexing: 72 indexed. Redirect 35, canonical alternate 13, noindex 2, discovered-not-indexed 8, crawled-not-indexed 1.
- The 8 never-crawled URLs: grid-generator, image-to-base64, images-to-pdf, json-validator, merge-pdf, split-pdf, word-counter, xml-formatter. Several had only two internal inbound links.
- Performance: 40 impressions, 0 clicks, average position about 83. Crop Image and Text Compare took most impressions.
- **The live site was older than this repository.** The 14 October descriptions and organization text were not deployed.

Live redirect checks: slashless routes answered 307, not a permanent redirect. `http://www.` took three hops. `/404/` answers 200 with noindex because Cloudflare serves `404.html` there; this is expected.

Changes:

- `_redirects` now 301s every slashless route to its trailing-slash URL. Wrangler preview confirmed 301 before asset handling.
- Related tools rail shows 6 tools, rotating from the current tool within its category. Every tool now has at least 3 internal inbound links; previously 19 had 2.
- BreadcrumbList is emitted on category pages through a shared `breadcrumbs` option. Tool pages use the same helper.
- Removed the WebSite SearchAction; Google retired the sitelinks search box. Added `inLanguage`.
- Added og:image width, height and alt text.
- Crop Image, Text Compare and Unix Timestamp Converter gained tested worked examples and limitations. Crop Image, Image Compressor, Text Compare and Timestamp Converter gained query-matched FAQs. Their `updated` dates are 31 October.

Validation: build, lint, 58 Angular tests, 4 worker tests and `verify:review` pass. Worked examples are executed against the components in `tool-examples.spec.ts`.

Owner actions:

- Deploy with `npm run deploy`, then spot-check a slashless URL returns 301.
- Add a Cloudflare redirect rule: `http://` and `www.` to `https://ondevice-tools.org` with path preserved, so the chain is one hop.
- In URL Inspection, request indexing for the 8 never-crawled URLs and the 4 updated tool pages.
- Do not validate "Page with redirect" or "Alternative page with proper canonical tag". Those URLs are intentionally not indexed.

## Meta description warning — 14 October

The supplied `ondevice-tools.org_FailingUrls_10_14_2026.csv` lists six URLs without a reason column. The owner clarified that the warning concerns short meta descriptions, rather than a Search Console crawl error.

Live checks found four direct HTTP 200 responses and two expected 307 redirects from slashless addresses to canonical trailing-slash URLs. All six canonical pages were indexable, self-canonical and present in the live sitemap. No redirect, robots or hosting change was needed for this report.

The local baseline contained 77 public descriptions below 150 characters. Added curated summaries for tools, categories and informational pages, and updated the homepage description. All **79 public pages** now have unique descriptions of **150–160 characters** in the generated HTML. Open Graph and Twitter descriptions use the same summary, including after browser navigation. The all-tools description already met the target.

| Reported page | Before | After |
| --- | ---: | ---: |
| Remove Extra Spaces | 131 | 158 |
| Word Counter | 133 | 158 |
| Color Contrast Checker | 136 | 154 |
| Age Calculator | 133 | 160 |
| Case Converter | 141 | 155 |
| Contact | 99 | 160 |

Counts are characters in the generated meta description. The 150–160 range is a project editing target, not a Google rule or an indexing guarantee. [Google recommends relevant, distinct page summaries and truncates displayed snippets according to device width](https://developers.google.com/search/docs/appearance/snippet).

Validation: production build, lint and the complete prerender review pass. The review now checks description length, uniqueness, single-tag output and matching sharing metadata. Browser checks confirm fresh descriptions when navigating from Word Counter to Text Tools, Case Converter and Contact. No new functional tests were added for this metadata-only change.

These changes are local. Deploy the build, then rerun the audit against the public URLs. Search results can retain older snippets until recrawling, and Google may select its own text from a page. This CSV does not identify the earlier crawl/indexing exclusions.

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
