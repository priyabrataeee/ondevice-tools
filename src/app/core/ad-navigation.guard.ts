import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';
import { isAdPage } from './ad-policy';
import { AdsService } from './ads.service';

/** Auto Ads can outlive an SPA route. Leave their document before showing an ad-free page. */
export const adNavigationGuard: CanActivateChildFn = (_route, state) => {
  const platform = inject(PLATFORM_ID);
  const ads = inject(AdsService);
  const document = inject(DOCUMENT);
  const router = inject(Router);
  if (!isPlatformBrowser(platform) || isAdPage(state.url) || !ads.hasLoader()) return true;

  const location = document.defaultView?.location;
  if (!location) return true;
  // Back/forward already moved the history cursor. Replace that entry instead
  // of adding a duplicate. Imperative navigation should create a normal entry.
  if (router.currentNavigation()?.trigger === 'popstate') location.replace(state.url);
  else location.assign(state.url);
  return false;
};
