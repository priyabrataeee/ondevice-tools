import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { CF_ANALYTICS_TOKEN, GA_MEASUREMENT_ID } from './site.config';

const BEACON_ID = 'cf-beacon';
const BEACON_SRC = 'https://static.cloudflareinsights.com/beacon.min.js';

const GA_LOADER_ID = 'ga-loader';
const GA_CONFIG_ID = 'ga-config';
const GA_SRC = 'https://www.googletagmanager.com/gtag/js';

/** Assembled from a char code so the literal survives every editing pass. */
const NEWLINE = String.fromCharCode(10);

/**
 * Site measurement: Cloudflare Web Analytics and Google Analytics 4.
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

  readonly enabled = CF_ANALYTICS_TOKEN.length > 0;
  readonly gaEnabled = GA_MEASUREMENT_ID.startsWith('G-');

  install(): void {
    this.installCloudflare();
    this.installGoogleAnalytics();
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

  private installGoogleAnalytics(): void {
    if (!this.gaEnabled) return;

    const head = this.document.head;
    if (head.querySelector(`#${GA_LOADER_ID}`)) return;

    const loader = this.document.createElement('script');
    loader.id = GA_LOADER_ID;
    loader.async = true;
    loader.src = `${GA_SRC}?id=${encodeURIComponent(GA_MEASUREMENT_ID)}`;
    head.appendChild(loader);

    // Written as a real inline script rather than executed here, so the tag is
    // present in the prerendered HTML and its hash lands in the CSP.
    const config = this.document.createElement('script');
    config.id = GA_CONFIG_ID;
    config.textContent = [
      'window.dataLayer = window.dataLayer || [];',
      'function gtag(){dataLayer.push(arguments);}',
      "gtag('js', new Date());",
      `gtag('config', '${GA_MEASUREMENT_ID}');`,
    ].join(NEWLINE);
    head.appendChild(config);
  }
}
