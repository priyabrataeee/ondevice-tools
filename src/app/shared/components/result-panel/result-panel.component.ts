import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { AnalyticsService } from '../../../core/analytics.service';
import { ToastService } from '../../../core/toast.service';
import { CopyButtonComponent } from '../copy-button/copy-button.component';
import { IconComponent } from '../icon/icon.component';

/**
 * Standard output block used by every text-producing tool: a labelled header
 * with copy and download actions, and a monospaced result body.
 */
@Component({
  selector: 'app-result-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CopyButtonComponent, IconComponent],
  template: `
    <section class="overflow-hidden rounded-xl border border-line">
      <header
        class="flex items-center justify-between gap-2 border-b border-line bg-bg-subtle px-3 py-2"
      >
        <h2 class="text-xs font-semibold tracking-wide text-faint uppercase">{{ label() }}</h2>
        <div class="flex items-center gap-1">
          @if (meta()) {
            <span class="mr-2 text-xs text-faint">{{ meta() }}</span>
          }
          <app-copy-button [value]="value()" label="" variant="ghost" [toastMessage]="label() + ' copied'" />
          @if (downloadName()) {
            <button
              type="button"
              class="btn btn-ghost h-8 w-8 !p-0"
              [disabled]="!value()"
              (click)="download()"
              [attr.aria-label]="'Download ' + downloadName()"
            >
              <app-icon name="download" class="h-4 w-4" />
            </button>
          }
        </div>
      </header>
      @if (value()) {
        <pre
          class="max-h-[420px] overflow-auto p-4 font-mono text-[0.8rem] leading-relaxed break-words whitespace-pre-wrap text-fg"
          >{{ value() }}</pre
        >
      } @else {
        <p class="p-4 text-sm text-faint">{{ placeholder() }}</p>
      }
    </section>
  `,
})
export class ResultPanelComponent {
  readonly label = input('Result');
  readonly value = input('');
  readonly placeholder = input('Output will appear here.');
  /** Set to enable the download button, e.g. `formatted.json`. */
  readonly downloadName = input('');
  readonly mimeType = input('text/plain;charset=utf-8');
  /** Small right-aligned note, e.g. a byte count. */
  readonly meta = input('');

  private readonly toast = inject(ToastService);
  private readonly analytics = inject(AnalyticsService);
  private readonly document = inject(DOCUMENT);

  /** Reported once per page: the signal is "this tool worked", not "how often". */
  private reported = false;

  constructor() {
    effect(() => {
      if (this.reported || !this.value()) return;
      this.reported = true;
      this.analytics.trackToolComplete(this.toolIdFromPath());
    });
  }

  /**
   * The tool id comes from the URL rather than an input, so every existing
   * caller of this component reports without needing to pass anything.
   */
  private toolIdFromPath(): string {
    const match = /\/tools\/([a-z0-9-]+)/.exec(this.document.location?.pathname ?? '');
    return match ? match[1] : 'unknown';
  }

  protected readonly hasValue = computed(() => this.value().length > 0);

  protected download(): void {
    const blob = new Blob([this.value()], { type: this.mimeType() });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = this.downloadName();
    document.body.appendChild(a);
    a.click();
    a.remove();
    // Revoking immediately can cancel the download in some browsers.
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    this.toast.success(`Downloaded ${this.downloadName()}`);
  }
}
