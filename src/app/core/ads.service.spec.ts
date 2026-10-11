import { DOCUMENT } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { isAdPage } from './ad-policy';
import { adNavigationGuard } from './ad-navigation.guard';
import { AdsService } from './ads.service';
import { ADSENSE_CLIENT } from './site.config';

describe('advertising document boundaries', () => {
  let document: Document;
  const assign = vi.fn();
  const replace = vi.fn();
  let trigger: string;
  beforeEach(() => {
    document = globalThis.document.implementation.createHTMLDocument();
    Object.defineProperty(document, 'defaultView', { value: { location: { assign, replace } } });
    assign.mockClear();
    replace.mockClear();
    trigger = 'imperative';
    TestBed.configureTestingModule({ providers: [
      { provide: DOCUMENT, useValue: document },
      { provide: PLATFORM_ID, useValue: 'browser' },
      { provide: Router, useValue: { currentNavigation: () => ({ trigger }) } },
    ] });
  });
  function enter(url: string) {
    return TestBed.runInInjectionContext(() => adNavigationGuard(
      {} as ActivatedRouteSnapshot, { url } as RouterStateSnapshot,
    ));
  }
  it.each(['/', '/tools/', '/tools/?q=json', '/favorites/', '/404/', '/about/', '/privacy/', '/contact/', '/category/text/', '/tools/not-a-tool/', '/missing/'])('never installs an ad loader on %s', (path) => {
    expect(isAdPage(path)).toBe(false);
    TestBed.inject(AdsService).install(path);
    expect(document.querySelector('script')).toBeNull();
  });
  it('keeps verification separate and deduplicates eligible loaders', () => {
    const ads = TestBed.inject(AdsService);
    ads.installVerification();
    ads.installVerification();
    expect(document.querySelectorAll('meta[name="google-adsense-account"]')).toHaveLength(1);
    expect(document.querySelector('meta')?.content).toBe(ADSENSE_CLIENT);
    expect(ads.hasLoader()).toBe(false);
    ads.install('/tools/json-formatter/', true);
    expect(ads.hasLoader()).toBe(false);
    ads.install('/tools/json-formatter/');
    ads.install('/tools/json-formatter?example=1#result');
    expect(document.querySelectorAll('#adsense-loader')).toHaveLength(1);
  });
  it('leaves a loaded ad document before showing an excluded route', () => {
    TestBed.inject(AdsService).install('/tools/json-formatter');
    expect(enter('/favorites/')).toBe(false);
    expect(assign).toHaveBeenCalledWith('/favorites/');
  });
  it('preserves the history cursor for back/forward navigation', () => {
    TestBed.inject(AdsService).install('/tools/json-formatter');
    trigger = 'popstate';
    expect(enter('/tools/?q=json')).toBe(false);
    expect(replace).toHaveBeenCalledWith('/tools/?q=json');
    expect(assign).not.toHaveBeenCalled();
  });
  it('keeps normal SPA navigation within eligible tools or an ad-free document', () => {
    expect(enter('/favorites/')).toBe(true);
    expect(enter('/tools/xml-formatter/')).toBe(true);
    TestBed.inject(AdsService).install('/tools/json-formatter');
    expect(enter('/tools/xml-formatter/')).toBe(true);
    expect(assign).not.toHaveBeenCalled();
  });
  it('does not redirect during prerender', () => {
    TestBed.overrideProvider(PLATFORM_ID, { useValue: 'server' });
    TestBed.inject(AdsService).install('/tools/json-formatter');
    expect(enter('/404/')).toBe(true);
    expect(assign).not.toHaveBeenCalled();
  });
});
