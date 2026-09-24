import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, effect, inject, signal } from '@angular/core';

const STORAGE_KEY = 'qt.background-motion';

/**
 * Whether the animated page background is paused.
 *
 * This is the control WCAG 2.2.2 (Pause, Stop, Hide) asks for: the background
 * moves by itself, indefinitely, alongside the page content, so a visitor has
 * to be able to stop it. The choice is remembered in this browser only, the
 * same way the theme is.
 */
@Injectable({ providedIn: 'root' })
export class BackgroundMotionService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly paused = signal(false);

  constructor() {
    if (!this.isBrowser) return;

    try {
      this.paused.set(localStorage.getItem(STORAGE_KEY) === 'paused');
    } catch {
      // Storage blocked; start playing and simply don't remember the choice.
    }

    effect(() => {
      const paused = this.paused();
      try {
        localStorage.setItem(STORAGE_KEY, paused ? 'paused' : 'playing');
      } catch {
        // Ignore storage failures; the choice still applies for this visit.
      }
    });
  }

  toggle(): void {
    this.paused.update((paused) => !paused);
  }
}
