import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import QRCode from 'qrcode';
import { IMAGE_PDF_GUIDES } from './image-pdf';
import { fitWidth } from '../../../tools/image/image-compressor/image-compressor.component';
import { ImageResizerComponent } from '../../../tools/image/image-resizer/image-resizer.component';
import { ImageConverterComponent } from '../../../tools/image/image-converter/image-converter.component';
import { ImageToBase64Component } from '../../../tools/image/image-to-base64/image-to-base64.component';
import { Base64ToImageComponent } from '../../../tools/image/base64-to-image/base64-to-image.component';
import { ColorPaletteExtractorComponent } from '../../../tools/image/color-palette-extractor/color-palette-extractor.component';
import { FAVICON_SIZES, FaviconGeneratorComponent } from '../../../tools/image/favicon-generator/favicon-generator.component';
import { MergePdfComponent } from '../../../tools/pdf/merge-pdf/merge-pdf.component';
import { SplitPdfComponent } from '../../../tools/pdf/split-pdf/split-pdf.component';
import { RotatePdfComponent } from '../../../tools/pdf/rotate-pdf/rotate-pdf.component';
import { placeImage } from '../../../tools/pdf/images-to-pdf/images-to-pdf.component';

const inContext = <T>(create: () => T): T => TestBed.runInInjectionContext(create);
const DOT_PNG = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
const size = (input: string) => /(\d+) × (\d+)/.exec(input)!.slice(1).map(Number);
const round = (n: number) => Math.round(n * 100) / 100;

class ResizeCheck extends ImageResizerComponent {
  run(input: string, i: number) {
    const [w, h] = size(input);
    this.naturalWidth.set(w); this.naturalHeight.set(h); this.width.set(w); this.height.set(h);
    if (i) this.setPercent(50);
    else { this.lockRatio.set(true); this.setWidth(1600); }
    return `Output: ${this.width()} × ${this.height()} px (${this.percent()}%)`;
  }
}
class ConvertCheck extends ImageConverterComponent {
  run(i: number) {
    this.format.set(i ? 'image/webp' : 'image/jpeg'); this.quality.set(85); this.background.set('#ffffff');
    const f = this.activeFormat();
    return [
      `Saved as: ${i ? 'screenshot' : 'logo'}.${f.extension}`,
      `Format: ${f.label}${f.lossy ? `, quality ${this.quality()}%` : ''}`,
      `Transparency: ${f.alpha ? 'kept' : `filled with ${this.background()}`}`,
    ].join('\n');
  }
}
class ToBase64Check extends ImageToBase64Component {
  async run(i: number) {
    const bytes = Uint8Array.from(atob(DOT_PNG), (c) => c.charCodeAt(0));
    await this.onFile([new File([bytes], 'dot.png', { type: 'image/png' })]);
    const snippet = this.snippets().find((s) => s.label === (i ? 'CSS' : 'HTML'))!.code;
    return `${snippet}\nEncoded size: ${this.encodedSize()} characters (+${this.overhead()}%)`;
  }
}
class FromBase64Check extends Base64ToImageComponent {
  run(input: string) {
    this.onInput(input);
    return this.error() || `Type: ${this.mimeType()}\nDecoded size: ${this.byteSize()} bytes`;
  }
}
class PaletteCheck extends ColorPaletteExtractorComponent {
  run(i: number) {
    const pixels = new Uint8ClampedArray(400 * 4);
    for (let p = 0; p < 400; p++) {
      const rgb = i
        ? (p < 200 ? [0xff, 0, 0] : [0xfe, 1, 1])
        : (p < 300 ? [0x1e, 0x3a, 0x8a] : [0xfb, 0xbf, 0x24]);
      pixels.set([...rgb, 255], p * 4);
    }
    (this as unknown as { pixels: Uint8ClampedArray }).pixels = pixels;
    this.setSize(8);
    return this.swatches().map((s) => `${s.hex}: ${s.share}%`).join('\n');
  }
}
class FaviconCheck extends FaviconGeneratorComponent {
  run(i: number) {
    return i ? this.htmlSnippet : FAVICON_SIZES.map((s) => `icon-${s}.png`).join('\n');
  }
}
/** The QR page renders with the qrcode library; this reports the symbol it builds. */
function qr(input: string, level: 'M' | 'H') {
  const code = QRCode.create(input, { errorCorrectionLevel: level });
  return `Version ${code.version}, ${code.modules.size} × ${code.modules.size} modules`;
}
class MergeCheck extends MergePdfComponent {
  run(i: number) {
    const file = (name: string) => new File([], name);
    this.entries.set([
      { id: 1, file: file('cv.pdf'), pages: 2 },
      { id: 2, file: file('cover-letter.pdf'), pages: 1 },
      { id: 3, file: file('references.pdf'), pages: 1 },
    ]);
    if (i) this.remove(3);
    else this.move(1, -1);
    return `Order: ${this.entries().map((e) => e.file.name).join(', ')}\nTotal pages: ${this.totalPages()}`;
  }
}
class SplitCheck extends SplitPdfComponent {
  check(input: string, i: number) {
    this.pageCount.set(10); this.range.set(input); this.mode.set(i ? 'remove' : 'extract');
    const all = Array.from({ length: 10 }, (_, p) => p + 1);
    const kept = i ? all.filter((p) => !this.selectedPages().includes(p)) : this.selectedPages();
    return `Selected pages: ${this.selectedPages().join(', ')}\nAction: ${this.actionLabel()}\nNew file has pages: ${kept.join(', ')}`;
  }
}
class RotateCheck extends RotatePdfComponent {
  run(input: string, i: number) {
    this.pageCount.set(8); this.range.set(input); this.angle.set(i ? 180 : 90);
    return `Pages rotated: ${this.selectedPages().join(', ')}\nBy: ${this.angle()}°`;
  }
}
function place(input: string, i: number) {
  const [w, h] = size(input);
  const p = placeImage(w, h, i ? 'fit' : 'a4');
  return `Page: ${round(p.pageWidth)} × ${round(p.pageHeight)} pt\nImage: ${round(p.width)} × ${round(p.height)} pt at x ${round(p.x)}, y ${round(p.y)}`;
}

const execute: Record<string, (input: string, index: number) => string | Promise<string>> = {
  'image-compressor': (input) => {
    const [w, h] = size(input);
    const r = fitWidth(w, h, 1600);
    return `Output: ${r.width} × ${r.height} px`;
  },
  'image-resizer': (input, i) => inContext(() => new ResizeCheck()).run(input, i),
  'image-converter': (_, i) => inContext(() => new ConvertCheck()).run(i),
  'image-to-base64': (_, i) => inContext(() => new ToBase64Check()).run(i),
  'base64-to-image': (input) => inContext(() => new FromBase64Check()).run(input),
  'color-palette-extractor': (_, i) => inContext(() => new PaletteCheck()).run(i),
  'favicon-generator': (_, i) => inContext(() => new FaviconCheck()).run(i),
  'qr-code-generator': (input, i) => qr(input, i ? 'H' : 'M'),
  'merge-pdf': (_, i) => inContext(() => new MergeCheck()).run(i),
  'split-pdf': (input, i) => inContext(() => new SplitCheck()).check(input, i),
  'rotate-pdf': (input, i) => inContext(() => new RotateCheck()).run(input, i),
  'images-to-pdf': (input, i) => place(input, i),
};

describe('image and PDF worked examples', () => {
  // jsdom has no object URLs; the decoder only needs one to exist.
  beforeEach(() => {
    URL.createObjectURL = vi.fn(() => 'blob:test');
    URL.revokeObjectURL = vi.fn();
  });
  afterEach(() => vi.restoreAllMocks());
  for (const [id, guide] of Object.entries(IMAGE_PDF_GUIDES)) {
    guide.examples.forEach((example, i) => {
      it(`${id}: ${example.title}`, async () => {
        const actual = await execute[id](example.input, i);
        expect(actual).toBe(example.output);
      });
    });
  }
});
