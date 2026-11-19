import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { CF_ANALYTICS_TOKEN, GTM_CONTAINER_ID } from './site.config';

const BEACON_ID = 'cf-beacon';
const BEACON_SRC = 'https://static.cloudflareinsights.com/beacon.min.js';

const GTM_LOADER_ID = 'gtm-loader';
const GTM_CONFIG_ID = 'gtm-config';
const GTM_SRC = 'https://www.googletagmanager.com/gtm.js';

/** Assembled from a char code so the literal survives every editing pass. */
const NEWLINE = String.fromCharCode(10);

/**
 * Regions where storage stays denied until the visitor opts in. Everywhere else
 * defaults to granted, which is what keeps an ordinary visit measurable.
 *
 * EEA member states plus the UK and Switzerland.
 */
const CONSENT_REGIONS = [
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR',
  'HU', 'IS', 'IE', 'IT', 'LV', 'LI', 'LT', 'LU', 'MT', 'NL', 'NO', 'PL',
  'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'GB', 'CH',
];

/**
 * Site measurement: Cloudflare Web Analytics, and Google Analytics 4 through
 * Google Tag Manager.
 *
 * Cloudflare is cookieless and aggregate-only. GA4 sets first-party cookies and
 * reports per-event, so the two are disclosed separately on the privacy page.
 * Each loads only when its own id is configured.
 *
 * Both are injected during prerender as well as in the browser. That is what
 * lets the build hash the inline gtag bootstrap into the CSP — a script added
 * only at runtime would be blocked by a hash-based policy.
 */
@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly enabled = CF_ANALYTICS_TOKEN.length > 0;
  readonly gaEnabled = GTM_CONTAINER_ID.startsWith('GTM-');

  install(): void {
    this.installCloudflare();
    this.installTagManager();
  }

  /**
   * Records that a tool produced a result.
   *
   * Only the tool's id is sent — never the input, the output, a file name or a
   * size. The whole point of the site is that none of that leaves the device,
   * and an analytics event is not an exception to it.
   */
  trackToolComplete(toolId: string): void {
    if (!this.isBrowser || !this.gaEnabled) return;
    const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
    if (typeof gtag !== 'function') return;
    gtag('event', 'tool_complete', { tool_id: toolId });
  }

  private installCloudflare(): void {
    if (!this.enabled) return;

    const head = this.document.head;
    if (head.querySelector(`#${BEACON_ID}`)) return;

    const script = this.document.createElement('script');
    script.id = BEACON_ID;
    // Cloudflare ships this as an ES module, so it must be loaded as one — a
    // classic <script> would fail to parse it. Modules are deferred already,
    // which is why there is no defer attribute here.
    script.type = 'module';
    script.src = BEACON_SRC;
    script.setAttribute('data-cf-beacon', JSON.stringify({ token: CF_ANALYTICS_TOKEN }));
    head.appendChild(script);
  }

  private installTagManager(): void {
    if (!this.gaEnabled) return;

    const head = this.document.head;
    if (head.querySelector(`#${GTM_CONFIG_ID}`)) return;

    // The bootstrap is appended BEFORE the loader deliberately. Consent defaults
    // have to be in dataLayer by the time GTM fires the Google tag, or the first
    // hit leaves before the policy is known. Written as a real inline script
    // rather than executed here, so it lands in the prerendered HTML and its
    // hash goes into the CSP. The GA4 id itself is configured in the container.
    const config = this.document.createElement('script');
    config.id = GTM_CONFIG_ID;
    config.textContent = [
      'window.dataLayer = window.dataLayer || [];',
      'function gtag(){dataLayer.push(arguments);}',
      // Denied only where consent is legally required; a consent dialog then
      // calls gtag('consent','update',...) to lift it. Stating the non-EEA
      // default explicitly is the point — without it, a CMP that default-denies
      // everywhere silently drops visits it never needed to.
      "gtag('consent', 'default', {'ad_storage':'denied'," +
        "'ad_user_data':'denied','ad_personalization':'denied'," +
        "'analytics_storage':'denied','wait_for_update':500," +
        `'region':${JSON.stringify(CONSENT_REGIONS)}});`,
      "gtag('consent', 'default', {'ad_storage':'granted'," +
        "'ad_user_data':'granted','ad_personalization':'granted'," +
        "'analytics_storage':'granted'});",
      // The event GTM's own snippet pushes; its built-in page triggers wait for it.
      "dataLayer.push({'gtm.start': new Date().getTime(), event: 'gtm.js'});",
    ].join(NEWLINE);
    head.appendChild(config);

    const loader = this.document.createElement('script');
    loader.id = GTM_LOADER_ID;
    loader.async = true;
    loader.src = `${GTM_SRC}?id=${encodeURIComponent(GTM_CONTAINER_ID)}`;
    head.appendChild(loader);
  }
}
