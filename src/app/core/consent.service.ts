import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { ADS_ENABLED } from './site.config';

type Gtag = (...args: unknown[]) => void;

interface FundingChoices {
  showRevocationMessage?: () => void;
  callbackQueue?: unknown[];
}

interface ConsentWindow extends Window {
  gtag?: Gtag;
  googlefc?: FundingChoices;
  navigator: Navigator & { globalPrivacyControl?: boolean };
}

/**
 * Regional privacy obligations that have to be honoured in code rather than in
 * a policy document.
 *
 * Two regimes matter here and they work in opposite directions:
 *
 * - **EEA, UK and Switzerland** — storage is opt-in. `AnalyticsService` declares
 *   Consent Mode defaults of denied for those regions, and Google's consent
 *   message lifts them when the visitor agrees.
 * - **United States** — storage is opt-out. State laws (CPRA and the Virginia,
 *   Colorado, Connecticut, Utah and Texas equivalents) require that a
 *   browser-level opt-out signal be treated as a valid request to stop selling
 *   or sharing personal information, and that a visitor can change their mind
 *   later from any page.
 *
 * This service implements the US half. The EEA half is declarative and lives in
 * the Consent Mode defaults.
 */
@Injectable({ providedIn: 'root' })
export class ConsentService {
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  /**
   * Whether a control for reopening the consent dialog should be offered.
   *
   * Only true once Google's messaging script has actually loaded, so the site
   * never shows a button that would do nothing.
   */
  readonly canManage = signal(false);

  /** True when the browser sent an opt-out signal that has been honoured. */
  readonly optedOutBySignal = signal(false);

  install(): void {
    if (!this.isBrowser || !ADS_ENABLED) return;
    this.honourGlobalPrivacyControl();
    this.watchForMessagingScript();
  }

  /**
   * Reopens Google's consent dialog so a visitor can change or withdraw what
   * they previously chose — the "Your privacy choices" requirement.
   */
  openPrivacyChoices(): void {
    const win = this.window();
    win?.googlefc?.showRevocationMessage?.();
  }

  /**
   * Honours Global Privacy Control.
   *
   * GPC is the browser-level signal that several US state laws recognise as a
   * legally binding opt-out of sale and sharing. Analytics storage is left
   * alone: GPC concerns sale and sharing for advertising, not first-party
   * measurement, and over-applying it would misreport the visit for no gain.
   */
  private honourGlobalPrivacyControl(): void {
    const win = this.window();
    if (!win || win.navigator.globalPrivacyControl !== true) return;

    win.gtag?.('consent', 'update', {
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    });
    this.optedOutBySignal.set(true);
  }

  /**
   * Google's messaging script loads asynchronously, so the control that depends
   * on it can only be offered once it has arrived. Polling briefly is simpler
   * and more reliable here than racing its callback queue, and it stops either
   * way after a few seconds.
   */
  private watchForMessagingScript(): void {
    const win = this.window();
    if (!win) return;

    let attempts = 0;
    const poll = win.setInterval(() => {
      attempts += 1;
      if (typeof win.googlefc?.showRevocationMessage === 'function') {
        this.canManage.set(true);
        win.clearInterval(poll);
      } else if (attempts >= 20) {
        win.clearInterval(poll);
      }
    }, 500);
  }

  private window(): ConsentWindow | null {
    return (this.document.defaultView as ConsentWindow | null) ?? null;
  }
}
