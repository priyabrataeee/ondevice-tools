import { ChangeDetectionStrategy, Component, computed, effect, signal } from '@angular/core';
import { ClipboardService } from '../../../core/clipboard.service';
import { ToastService } from '../../../core/toast.service';
import { inject } from '@angular/core';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { ToolLayoutComponent } from '../../../shared/components/tool-layout/tool-layout.component';

type Level = 'L' | 'M' | 'Q' | 'H';

interface LevelOption {
  id: Level;
  label: string;
  hint: string;
}

const LEVELS: LevelOption[] = [
  { id: 'L', label: 'Low', hint: 'recovers ~7%' },
  { id: 'M', label: 'Medium', hint: 'recovers ~15%' },
  { id: 'Q', label: 'Quartile', hint: 'recovers ~25%' },
  { id: 'H', label: 'High', hint: 'recovers ~30%' },
];

const PRESETS = [
  { label: 'Website', value: 'https://ondevice-tools.org/' },
  { label: 'Wi-Fi', value: 'WIFI:T:WPA;S:MyNetwork;P:MyPassword;;' },
  { label: 'Email', value: 'mailto:hello@example.com?subject=Hello' },
  { label: 'Phone', value: 'tel:+911234567890' },
  { label: 'SMS', value: 'SMSTO:+911234567890:Hello' },
  { label: 'vCard', value: 'BEGIN:VCARD\nVERSION:3.0\nFN:Jane Doe\nTEL:+911234567890\nEMAIL:jane@example.com\nEND:VCARD' },
];

@Component({
  selector: 'app-qr-code-generator',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ToolLayoutComponent, IconComponent],
  template: `
    <app-tool-layout toolId="qr-code-generator">
      <div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div class="flex min-w-0 flex-col gap-4">
          <div>
            <label class="label" for="qr-text">Text or URL</label>
            <textarea
              id="qr-text"
              class="input min-h-32 font-mono text-sm"
              placeholder="https://example.com"
              [value]="text()"
              (input)="text.set($any($event.target).value)"
            ></textarea>
            <p class="mt-1 text-xs text-faint">
              {{ text().length }} characters
              @if (tooLong()) {
                <span class="text-danger"> — too long for a QR code at this error correction level</span>
              }
            </p>
          </div>

          <div>
            <span class="label">Start from a template</span>
            <div class="flex flex-wrap gap-2">
              @for (preset of presets; track preset.label) {
                <button type="button" class="chip" (click)="text.set(preset.value)">
                  {{ preset.label }}
                </button>
              }
            </div>
          </div>

          <div>
            <span class="label">Error correction</span>
            <div class="flex flex-wrap gap-2">
              @for (option of levels; track option.id) {
                <button
                  type="button"
                  class="chip"
                  [class.is-active]="level() === option.id"
                  [attr.aria-pressed]="level() === option.id"
                  (click)="level.set(option.id)"
                >
                  {{ option.label }}
                  <span class="text-faint">{{ option.hint }}</span>
                </button>
              }
            </div>
            <p class="mt-1 text-xs text-faint">
              Higher correction survives more damage but packs the pattern tighter, so a long value
              may need a bigger code.
            </p>
          </div>

          <div class="grid gap-4 sm:grid-cols-3">
            <div>
              <label class="label" for="qr-size">Size (px)</label>
              <input
                id="qr-size"
                type="number"
                class="input"
                min="128"
                max="2048"
                step="32"
                [value]="size()"
                (input)="setSize($any($event.target).value)"
              />
            </div>
            <div>
              <label class="label" for="qr-fg">Foreground</label>
              <input
                id="qr-fg"
                type="color"
                class="input h-10 p-1"
                [value]="foreground()"
                (input)="foreground.set($any($event.target).value)"
              />
            </div>
            <div>
              <label class="label" for="qr-bg">Background</label>
              <input
                id="qr-bg"
                type="color"
                class="input h-10 p-1"
                [value]="background()"
                (input)="background.set($any($event.target).value)"
              />
            </div>
          </div>

          @if (lowContrast()) {
            <p class="text-sm text-warning">
              These two colours are close together. Scanners need clear contrast, and a dark code on
              a light background is the only combination that reads reliably everywhere.
            </p>
          }
        </div>

        <aside class="flex flex-col gap-3">
          <div
            class="flex aspect-square items-center justify-center overflow-hidden rounded-xl border border-line p-4"
            [style.background]="background()"
          >
            @if (svg()) {
              <img class="h-full w-full object-contain" [src]="dataUrl()" alt="QR code preview" />
            } @else {
              <p class="text-center text-sm text-faint">
                {{ error() || 'Your QR code will appear here.' }}
              </p>
            }
          </div>

          <div class="grid grid-cols-2 gap-2">
            <button type="button" class="btn btn-primary" [disabled]="!svg()" (click)="downloadPng()">
              <app-icon name="download" class="h-4 w-4" />
              PNG
            </button>
            <button type="button" class="btn btn-secondary" [disabled]="!svg()" (click)="downloadSvg()">
              <app-icon name="download" class="h-4 w-4" />
              SVG
            </button>
          </div>
          <button type="button" class="btn btn-ghost" [disabled]="!svg()" (click)="copySvg()">
            <app-icon name="copy" class="h-4 w-4" />
            Copy SVG markup
          </button>
        </aside>
      </div>
    </app-tool-layout>
  `,
})
export class QrCodeGeneratorComponent {
  private readonly clipboard = inject(ClipboardService);
  private readonly toast = inject(ToastService);

  protected readonly levels = LEVELS;
  protected readonly presets = PRESETS;

  protected readonly text = signal('https://ondevice-tools.org/');
  protected readonly level = signal<Level>('M');
  protected readonly size = signal(512);
  protected readonly foreground = signal('#000000');
  protected readonly background = signal('#ffffff');

  protected readonly svg = signal('');
  protected readonly error = signal('');
  protected readonly tooLong = signal(false);

  protected readonly dataUrl = computed(() =>
    this.svg() ? `data:image/svg+xml;charset=utf-8,${encodeURIComponent(this.svg())}` : '',
  );

  /** Warns before a scanner fails: luminance difference, not a strict WCAG check. */
  protected readonly lowContrast = computed(() => {
    const diff = Math.abs(luminance(this.foreground()) - luminance(this.background()));
    return this.svg() !== '' && diff < 0.4;
  });

  constructor() {
    effect(() => {
      const value = this.text();
      const level = this.level();
      const fg = this.foreground();
      const bg = this.background();
      void this.render(value, level, fg, bg);
    });
  }

  protected setSize(value: string): void {
    const parsed = Number.parseInt(value, 10);
    if (Number.isFinite(parsed)) this.size.set(Math.min(2048, Math.max(128, parsed)));
  }

  /**
   * The encoder is imported lazily so its ~40 KB never loads for the other 63
   * tools, and only in the browser — it is not needed to prerender this page.
   */
  private async render(text: string, level: Level, fg: string, bg: string): Promise<void> {
    if (!text.trim()) {
      this.svg.set('');
      this.error.set('');
      this.tooLong.set(false);
      return;
    }

    try {
      // qrcode is CommonJS, so a bundled dynamic import puts the API on
      // `default` rather than exposing named exports. Accept either shape.
      const mod = await import('qrcode');
      const api = ((mod as unknown as { default?: typeof mod }).default ?? mod) as typeof mod;
      const markup = await api.toString(text, {
        type: 'svg',
        errorCorrectionLevel: level,
        margin: 2,
        color: { dark: fg, light: bg },
      });
      this.svg.set(markup);
      this.error.set('');
      this.tooLong.set(false);
    } catch (cause) {
      this.svg.set('');
      this.tooLong.set(true);
      this.error.set(
        cause instanceof Error && /too long|data/i.test(cause.message)
          ? 'That value is too long to encode. Shorten it or lower the error correction level.'
          : 'Could not generate a QR code from that value.',
      );
    }
  }

  /**
   * Rasterises the SVG through a canvas rather than asking the encoder for a
   * PNG, so the download is exactly the preview at whatever size you chose.
   */
  protected async downloadPng(): Promise<void> {
    const markup = this.svg();
    if (!markup) return;

    const side = this.size();
    const image = new Image();
    image.src = this.dataUrl();
    await image.decode();

    const canvas = document.createElement('canvas');
    canvas.width = side;
    canvas.height = side;
    const context = canvas.getContext('2d');
    if (!context) return;
    context.fillStyle = this.background();
    context.fillRect(0, 0, side, side);
    context.drawImage(image, 0, 0, side, side);

    canvas.toBlob((blob) => {
      if (blob) this.save(blob, 'qr-code.png');
    }, 'image/png');
  }

  protected downloadSvg(): void {
    if (!this.svg()) return;
    this.save(new Blob([this.svg()], { type: 'image/svg+xml' }), 'qr-code.svg');
  }

  protected async copySvg(): Promise<void> {
    if (!this.svg()) return;
    await this.clipboard.copy(this.svg(), 'SVG markup copied');
  }

  private save(blob: Blob, name: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    link.click();
    URL.revokeObjectURL(url);
    this.toast.success(`${name} downloaded`);
  }
}

/** Relative luminance of a #rrggbb colour, used only for the contrast warning. */
function luminance(hex: string): number {
  const value = hex.replace('#', '');
  const channels = [0, 2, 4].map((i) => Number.parseInt(value.slice(i, i + 2), 16) / 255);
  const linear = channels.map((c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)));
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}
