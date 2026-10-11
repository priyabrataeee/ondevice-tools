import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { ADSENSE_CLIENT, ADS_ENABLED } from './site.config';
import { isAdPage } from './ad-policy';

const LOADER_ID = 'adsense-loader';
const LOADER_SRC = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';

/**
 * Prerenders the loader only on eligible tool pages. Removing a loaded script
 * cannot unload Auto Ads; the route guard starts a clean document when leaving.
 */
@Injectable({ providedIn: 'root' })
export class AdsService {
  private readonly document = inject(DOCUMENT);

  readonly enabled = ADS_ENABLED;
  readonly client = ADSENSE_CLIENT;

  install(path: string, noindex = false): void {
    if (!ADS_ENABLED || noindex || !isAdPage(path)) return;

    const head = this.document.head;
    if (head.querySelector(`#${LOADER_ID}`)) return;

    const script = this.document.createElement('script');
    script.id = LOADER_ID;
    script.async = true;
    script.src = `${LOADER_SRC}?client=${encodeURIComponent(ADSENSE_CLIENT)}`;
    // Required by AdSense: the loader is fetched cross-origin and Google reads
    // the response as an opaque-free CORS request.
    script.crossOrigin = 'anonymous';
    head.appendChild(script);
  }

  hasLoader(): boolean {
    return this.document.getElementById(LOADER_ID) !== null;
  }

  /** Publisher verification is separate from permission to display ads. */
  installVerification(): void {
    if (!ADS_ENABLED || this.document.head.querySelector('meta[name="google-adsense-account"]')) return;
    const meta = this.document.createElement('meta');
    meta.name = 'google-adsense-account';
    meta.content = ADSENSE_CLIENT;
    this.document.head.appendChild(meta);
  }
}
