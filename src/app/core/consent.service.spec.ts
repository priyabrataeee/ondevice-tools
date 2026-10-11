import { DOCUMENT } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ConsentService } from './consent.service';

describe('consent controls after lazy ad loading', () => {
  afterEach(() => { TestBed.resetTestingModule(); vi.useRealTimers(); });
  function create(href = 'https://ondevice-tools.org/') {
    vi.useFakeTimers();
    const events = new Subject<NavigationEnd>();
    const view = {
      navigator: {}, location: { href },
      googlefc: {} as { showRevocationMessage?: () => void },
      setInterval: window.setInterval.bind(window), clearInterval: window.clearInterval.bind(window),
    };
    TestBed.configureTestingModule({ providers: [
      { provide: DOCUMENT, useValue: { defaultView: view } },
      { provide: PLATFORM_ID, useValue: 'browser' },
      { provide: Router, useValue: { events } },
    ] });
    const service = TestBed.inject(ConsentService);
    service.install();
    return { service, events, view };
  }
  it('rediscovers messaging when a tool is opened after the first poll expires', () => {
    const { service, events, view } = create();
    vi.advanceTimersByTime(11_000);
    expect(service.canManage()).toBe(false);
    view.googlefc.showRevocationMessage = vi.fn();
    events.next(new NavigationEnd(2, '/tools/json-formatter/', '/tools/json-formatter/'));
    vi.advanceTimersByTime(500);
    expect(service.canManage()).toBe(true);
    expect(view.googlefc.showRevocationMessage).not.toHaveBeenCalled();
  });
  it('opens requested privacy choices once messaging is available', () => {
    const { view } = create('https://ondevice-tools.org/tools/json-formatter/?privacy-choices=1');
    view.googlefc.showRevocationMessage = vi.fn();
    vi.advanceTimersByTime(2_000);
    expect(view.googlefc.showRevocationMessage).toHaveBeenCalledTimes(1);
  });
});
