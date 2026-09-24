import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  effect,
  inject,
  viewChild,
} from '@angular/core';
import { BackgroundMotionService } from '../../../core/background-motion.service';
import { ThemeService } from '../../../core/theme.service';

type Rgb = readonly [number, number, number];

interface Palette {
  /** Page colour the cells sit on. */
  readonly base: Rgb;
  readonly cytoplasm: Rgb;
  readonly membrane: Rgb;
  readonly nucleus: Rgb;
  /**
   * How a cell combines with the page. On a dark page it adds light; on a
   * light page it has to remove it instead, or nothing would be visible.
   */
  readonly blend: 'lighter' | 'multiply';
  readonly cytoplasmAlpha: number;
  readonly membraneAlpha: number;
  readonly nucleusAlpha: number;
  /** Strength of the broad diagonal wash behind the cells. */
  readonly washAlpha: number;
}

/**
 * Light theme reads as stained tissue under a brightfield microscope: dark
 * nuclei, violet membranes, pale cytoplasm on a white field.
 */
const LIGHT: Palette = {
  base: [230, 230, 230],
  cytoplasm: [124, 58, 237],
  membrane: [76, 29, 149],
  nucleus: [49, 46, 129],
  blend: 'multiply',
  cytoplasmAlpha: 0.1,
  membraneAlpha: 0.1,
  nucleusAlpha: 0.15,
  washAlpha: 0.07,
};

/**
 * Dark theme reads as fluorescence microscopy: membranes and nuclei glowing
 * against a black field.
 */
const DARK: Palette = {
  base: [9, 9, 11],
  cytoplasm: [55, 48, 163],
  membrane: [109, 40, 217],
  nucleus: [99, 102, 241],
  blend: 'lighter',
  cytoplasmAlpha: 0.14,
  membraneAlpha: 0.6,
  nucleusAlpha: 0.45,
  washAlpha: 0.1,
};

/**
 * Longest edge of the offscreen pattern, in pixels. CSS stretches it to the
 * viewport, so cost is fixed no matter how large the screen is. High enough
 * that a nucleus and its granules survive the stretch on a desktop monitor.
 */
const MAX_BUFFER = 1040;

/**
 * Resting cell radius, as a fraction of the square root of the buffer's area,
 * so a cell covers the same share of any screen. The lattice spacing is then
 * derived from it - see {@link MIN_GAP_PX}.
 */
const CELL_SIZE = 0.005;

/**
 * The closest two cells ever get, edge to edge, in CSS pixels. Measured from
 * the outside of the membrane's halo, with both cells at their largest - the
 * swell at its crest and the squash at its most stretched.
 */
const MIN_GAP_PX = 1;

/**
 * A faint current under the colony, as a fraction of the viewport per second:
 * left to right, drifting down. Kept well below the cells' own wandering so
 * what the eye follows is each cell moving on its own, not a sheet sliding.
 * Set both to 0 to stop the current entirely.
 */
const DRIFT_X = 0.004;
const DRIFT_Y = 0.0025;

/**
 * Every cell wanders on a path of its own around its place in the colony:
 * on each axis, three slow oscillations at speeds and phases drawn from the
 * cell's identity. Speeds that don't divide into each other never line up
 * again, so a path doesn't visibly repeat, and no two cells move alike.
 *
 * The reach is per axis, as a multiple of the resting radius. It is budgeted
 * into the lattice spacing (see {@link BackgroundComponent.layout}), so two
 * neighbours lurching straight at each other still stop {@link MIN_GAP_PX}
 * apart.
 */
const WANDER = 5;
const WANDER_SPEED_MIN = 2.6; // radians per second
const WANDER_SPEED_MAX = 3.4;
/** Share of the reach each oscillation gets; they sum to 1. */
const WANDER_WEIGHTS = [0.5, 0.3, 0.2] as const;

/**
 * Swells: broad bands of brightness and size that roll diagonally across the
 * whole field, like light moving over water. Motion of evenly spaced cells is
 * easy to miss, because every cell looks like its neighbour; a band of light
 * sweeping the screen is not. Two swells at different angles and speeds
 * interfere, so the pattern never visibly repeats.
 */
const SWELL_LENGTH = 0.55; // fraction of the longest edge
const SWELL_SPEED = 0.85; // radians per second
const SWELL_LENGTH_2 = 0.38;
const SWELL_SPEED_2 = 0.575;
/** Brightness at a trough and at a crest, as a multiple of the palette. */
const SWELL_DIM = 0.3;
const SWELL_BRIGHT = 1;
/** Cell size at a trough and at a crest, as a multiple of the resting size. */
const SWELL_SMALL = 0.82;
const SWELL_LARGE = 1.12;

/**
 * Distinct cell drawings. Each lattice position always shows the same one, so
 * the colony looks varied without any cell changing shape as it travels.
 */
const VARIANTS = 12;

/** Edge of each cell drawing, in pixels. */
const SPRITE_PX = 128;

/**
 * How far the membrane reaches from the centre of a drawing, as a fraction of
 * half its width. The margin beyond is room for the membrane's halo.
 */
const OUTLINE_REACH = 0.86;

/** Width of the membrane's soft halo, as a fraction of the membrane's reach. */
const HALO_WIDTH = 0.16;

/** Each cell slowly turns, some clockwise and some anticlockwise. */
const TUMBLE_SPEED = 0.175; // radians per second at the fastest

/** Cells stretch and relax as they flow, like soft bodies in a current. */
const SQUASH = 0.07;
const SQUASH_SPEED = 0.55; // radians per second, before per-cell variation

/**
 * The motion is slow enough that 24 frames a second reads as smooth, and the
 * dense lattice makes each frame cost enough to be worth not repainting more
 * often. A device that cannot keep up simply paints less often - the drift is
 * time-based, so its speed holds.
 */
const FRAME_MS = 1000 / 24;

/**
 * The animated page background: a colony of cells as they look under a
 * microscope - each with an irregular membrane, grainy cytoplasm and an
 * off-centre nucleus - every one wandering on its own path while a faint
 * current carries the colony from left to right.
 *
 * Written by hand rather than pulled from a library because the obvious
 * options for this effect are built on three.js, which would have added
 * roughly 150 KB gzipped to a site whose entire payload is 130 KB.
 *
 * Each cell is anchored to a point on a lattice that slides slowly
 * diagonally. The lattice wraps by shifting a whole spacing at a time, which
 * lands every anchor exactly where its neighbour's was. Every per-cell
 * property - its path, which drawing it uses, how it turns and stretches - is
 * keyed to the cell's identity in the colony rather than to its slot on
 * screen, so it carries across the wrap and the loop has no seam.
 *
 * Cell drawings are rendered once per theme and stamped with a transform each
 * frame, never recomputed per pixel.
 *
 * Everything below runs browser-only. The element is inert: it is
 * `aria-hidden`, takes no pointer events, and sits at a negative z-index, so
 * the interface above it behaves exactly as it did before.
 */
@Component({
  selector: 'app-background',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<canvas #canvas aria-hidden="true"></canvas>`,
  styles: [
    `
      :host {
        display: contents;
      }

      canvas {
        position: fixed;
        inset: 0;
        z-index: -1;
        display: block;
        width: 100%;
        height: 100%;
        pointer-events: none;
      }
    `,
  ],
})
export class BackgroundComponent {
  private readonly canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  private readonly theme = inject(ThemeService);
  private readonly motion = inject(BackgroundMotionService);
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);

  private context: CanvasRenderingContext2D | null = null;
  private palette: Palette = LIGHT;
  private sprites: HTMLCanvasElement[] = [];
  private backdrop: CanvasGradient | null = null;

  /** Lattice geometry, recomputed whenever the buffer is resized. */
  private cols = 0;
  private rows = 0;
  private spacingX = 0;
  private spacingY = 0;
  private radius = 0;
  /** How far a cell can stray from its lattice point on each axis. */
  private wander = 0;

  private frame = 0;
  private lastPaint = 0;
  private clock = 0;
  private running = false;

  constructor() {
    afterNextRender(() => this.start());

    // Repaint immediately on a theme flip rather than waiting for the next
    // animation frame.
    effect(() => {
      this.palette = this.theme.isDark() ? DARK : LIGHT;
      if (!this.context) return;
      this.buildSprites();
      this.buildBackdrop();
      this.paint();
    });

    // The header's pause button. Pausing freezes the current frame; playing
    // resumes from it, since the loop measures time from its own restart.
    effect(() => {
      const paused = this.motion.paused();
      if (!this.context) return;
      if (paused) {
        this.stop();
        this.paint();
      } else {
        this.run();
      }
    });
  }

  private start(): void {
    const canvas = this.canvasRef().nativeElement;
    // An opaque context skips per-pixel compositing; nothing shows through a
    // full-viewport background anyway.
    this.context = canvas.getContext('2d', { alpha: false });
    if (!this.context) return;

    this.buildSprites();
    this.resize();

    const win = this.document.defaultView;
    if (!win) return;

    let resizeTimer = 0;
    // Observing the canvas rather than the window reports the real painted
    // box, and fires once layout exists - `innerWidth` can still be 0 at
    // first render inside an embedded browser pane.
    const observer = new ResizeObserver(() => {
      // Mobile browsers resize continuously while the URL bar collapses.
      win.clearTimeout(resizeTimer);
      resizeTimer = win.setTimeout(() => this.resize(), 150);
    });
    observer.observe(canvas);

    this.destroyRef.onDestroy(() => {
      win.clearTimeout(resizeTimer);
      observer.disconnect();
      this.stop();
    });

    if (!this.motion.paused()) this.run();
  }

  /**
   * Runs for every visitor, including those whose system asks for reduced
   * motion - a deliberate product decision by the site owner. The pause
   * button in the header ({@link BackgroundMotionService}) is the WCAG 2.2.2
   * (Pause, Stop, Hide) control that makes that acceptable.
   *
   * Nothing here watches page visibility. Browsers already suspend
   * `requestAnimationFrame` in a hidden tab, and because the next frame is
   * always scheduled at the top of the callback, the loop resumes by itself.
   */
  private run(): void {
    if (this.running) return;
    this.running = true;

    const win = this.document.defaultView;
    if (!win) return;

    let previous = win.performance.now();
    const tick = (now: number) => {
      this.frame = win.requestAnimationFrame(tick);
      // Advance by real elapsed time so the drift speed is frame-rate
      // independent, then throttle the actual repaint.
      this.clock += (now - previous) / 1000;
      previous = now;
      if (now - this.lastPaint < FRAME_MS) return;
      this.lastPaint = now;
      this.paint();
    };
    this.frame = win.requestAnimationFrame(tick);
  }

  private stop(): void {
    const win = this.document.defaultView;
    if (this.frame && win) win.cancelAnimationFrame(this.frame);
    this.frame = 0;
    this.running = false;
  }

  /**
   * Draws the set of cell variants for the current palette. The seed is fixed,
   * so a theme change recolours the same cells rather than inventing new ones.
   */
  private buildSprites(): void {
    const random = seeded(0x51f15eed);
    const sprites: HTMLCanvasElement[] = [];
    for (let i = 0; i < VARIANTS; i++) {
      const sprite = this.drawCell(random);
      if (sprite) sprites.push(sprite);
    }
    this.sprites = sprites;
  }

  /**
   * One cell: an irregular body of grainy cytoplasm, a membrane with a faint
   * halo, and an off-centre nucleus with its own envelope and a nucleolus.
   */
  private drawCell(random: () => number): HTMLCanvasElement | null {
    const canvas = this.document.createElement('canvas');
    canvas.width = SPRITE_PX;
    canvas.height = SPRITE_PX;

    const context = canvas.getContext('2d');
    if (!context) return null;

    const p = this.palette;
    const centre = SPRITE_PX / 2;
    const reach = centre * OUTLINE_REACH;
    const body = blob(random, 0.07);

    // Cytoplasm, slightly denser towards the membrane.
    traceBlob(context, centre, centre, reach, body);
    const cytoplasm = context.createRadialGradient(centre, centre, 0, centre, centre, reach);
    cytoplasm.addColorStop(0, rgba(p.cytoplasm, p.cytoplasmAlpha * 0.6));
    cytoplasm.addColorStop(0.75, rgba(p.cytoplasm, p.cytoplasmAlpha));
    cytoplasm.addColorStop(1, rgba(p.cytoplasm, p.cytoplasmAlpha * 1.6));
    context.fillStyle = cytoplasm;
    context.fill();

    // Granules. Their far edges stay within 0.64 of the reach, inside the
    // body at its narrowest, so none can sit on or outside the membrane.
    context.fillStyle = rgba(p.nucleus, p.nucleusAlpha * 0.3);
    const granules = 6 + Math.floor(random() * 7);
    for (let i = 0; i < granules; i++) {
      const angle = random() * Math.PI * 2;
      const distance = reach * (0.3 + random() * 0.28);
      const size = reach * (0.025 + random() * 0.03);
      context.beginPath();
      context.arc(
        centre + Math.cos(angle) * distance,
        centre + Math.sin(angle) * distance,
        size,
        0,
        Math.PI * 2,
      );
      context.fill();
    }

    // Membrane: a soft halo, then the wall itself.
    traceBlob(context, centre, centre, reach, body);
    context.lineJoin = 'round';
    context.strokeStyle = rgba(p.membrane, p.membraneAlpha * 0.22);
    context.lineWidth = reach * HALO_WIDTH;
    context.stroke();
    context.strokeStyle = rgba(p.membrane, p.membraneAlpha);
    context.lineWidth = reach * 0.05;
    context.stroke();

    // Nucleus, off centre. Its far edge stays within 0.6 of the reach.
    const nucleusAngle = random() * Math.PI * 2;
    const nucleusOffset = reach * (0.08 + random() * 0.14);
    const nx = centre + Math.cos(nucleusAngle) * nucleusOffset;
    const ny = centre + Math.sin(nucleusAngle) * nucleusOffset;
    const nucleusReach = reach * (0.3 + random() * 0.08);
    traceBlob(context, nx, ny, nucleusReach, blob(random, 0.06));
    const nucleus = context.createRadialGradient(
      nx - nucleusReach * 0.25,
      ny - nucleusReach * 0.25,
      0,
      nx,
      ny,
      nucleusReach,
    );
    nucleus.addColorStop(0, rgba(p.nucleus, p.nucleusAlpha * 0.65));
    nucleus.addColorStop(1, rgba(p.nucleus, p.nucleusAlpha));
    context.fillStyle = nucleus;
    context.fill();
    context.strokeStyle = rgba(p.nucleus, Math.min(1, p.nucleusAlpha * 1.3));
    context.lineWidth = reach * 0.025;
    context.stroke();

    // Nucleolus.
    const nucleolusAngle = random() * Math.PI * 2;
    const nucleolusOffset = nucleusReach * 0.3 * random();
    context.beginPath();
    context.arc(
      nx + Math.cos(nucleolusAngle) * nucleolusOffset,
      ny + Math.sin(nucleolusAngle) * nucleolusOffset,
      nucleusReach * (0.16 + random() * 0.08),
      0,
      Math.PI * 2,
    );
    context.fillStyle = rgba(p.nucleus, Math.min(1, p.nucleusAlpha * 1.5));
    context.fill();

    return canvas;
  }

  /** The broad diagonal wash the cells float on. */
  private buildBackdrop(): void {
    const context = this.context;
    const canvas = this.canvasRef().nativeElement;
    if (!context || !canvas.width) return;

    const { base, membrane, washAlpha } = this.palette;
    const gradient = context.createLinearGradient(0, canvas.height, canvas.width, 0);
    gradient.addColorStop(0, rgb(base));
    gradient.addColorStop(1, rgb(mix(base, membrane, washAlpha)));
    this.backdrop = gradient;
  }

  private resize(): void {
    const canvas = this.canvasRef().nativeElement;
    if (!this.context) return;

    // Match the painted aspect ratio so the CSS stretch does not squash
    // the cells.
    const box = canvas.getBoundingClientRect();
    if (box.width < 1 || box.height < 1) return; // laid out later; observer re-fires
    const ratio = box.width / box.height;
    // Clamped: a very wide or very tall box - a pane mid-animation, a
    // split-screen sliver - can otherwise round the short side to zero.
    const width = ratio >= 1 ? MAX_BUFFER : Math.max(2, Math.round(MAX_BUFFER * ratio));
    const height = ratio >= 1 ? Math.max(2, Math.round(MAX_BUFFER / ratio)) : MAX_BUFFER;

    if (canvas.width === width && canvas.height === height) return;

    canvas.width = width;
    canvas.height = height;
    this.layout(width, height, width / box.width);
    this.buildBackdrop();
    this.paint();
  }

  /**
   * Fits a lattice to the buffer around the cells, rather than the other way
   * round: the spacing is the widest a cell can ever get plus
   * {@link MIN_GAP_PX}. Each axis is then divided exactly - a lattice that
   * tiles the buffer precisely is what lets the wrap in {@link paint} be
   * invisible - and the cells are resized to fit whatever spacing that
   * rounding produced, so the closest pair sits exactly the minimum gap apart.
   *
   * Any two cells have anchors at least a column apart horizontally or a row
   * apart vertically. Each can stray {@link WANDER} radii along either axis,
   * so budgeting twice that into the spacing keeps even the worst case - two
   * neighbours heading straight at each other - apart by the full gap.
   */
  private layout(width: number, height: number, bufferPerCssPx: number): void {
    // Widest a cell ever gets, as a multiple of its resting radius: the swell
    // at its crest, the halo outside the membrane, and the squash at its most
    // stretched (1 / (1 - SQUASH) on the axis it squeezes towards).
    const reach = (SWELL_LARGE * (1 + HALO_WIDTH / 2)) / (1 - SQUASH);
    const gap = MIN_GAP_PX * bufferPerCssPx;
    const minSpacing = 2 * CELL_SIZE * Math.sqrt(width * height) * (reach + WANDER) + gap;

    // Rounded rather than floored: the cells are resized to the spacing the
    // division produces, so nearest keeps them closest to CELL_SIZE, and the
    // gap is exact whichever way the rounding goes.
    this.cols = Math.max(2, Math.round(width / minSpacing));
    this.rows = Math.max(2, Math.round(height / minSpacing));
    this.spacingX = width / this.cols;
    this.spacingY = height / this.rows;
    this.radius = (Math.min(this.spacingX, this.spacingY) - gap) / (2 * (reach + WANDER));
    this.wander = WANDER * this.radius;
  }

  private paint(): void {
    const context = this.context;
    const sprites = this.sprites;
    const canvas = this.canvasRef().nativeElement;
    if (!context || !sprites.length || !this.backdrop || !canvas.width || !this.cols) return;

    const width = canvas.width;
    const height = canvas.height;
    const time = this.clock;

    context.setTransform(1, 0, 0, 1, 0, 0);
    context.globalAlpha = 1;
    context.globalCompositeOperation = 'source-over';
    context.fillStyle = this.backdrop;
    context.fillRect(0, 0, width, height);

    // How far the sheet has travelled, split into whole spacings (which
    // identify the cells) and the remainder (which positions them).
    const travelX = time * DRIFT_X * width;
    const travelY = time * DRIFT_Y * height;
    const shiftX = Math.floor(travelX / this.spacingX);
    const shiftY = Math.floor(travelY / this.spacingY);
    const offsetX = travelX - shiftX * this.spacingX;
    const offsetY = travelY - shiftY * this.spacingY;

    const wander = this.wander;
    const longest = Math.max(width, height);
    const swellNumber = (Math.PI * 2) / (SWELL_LENGTH * longest);
    const swellNumber2 = (Math.PI * 2) / (SWELL_LENGTH_2 * longest);
    const half = SPRITE_PX / 2;

    context.globalCompositeOperation = this.palette.blend;
    // One column and row beyond each edge covers the wrap. A cell anchored
    // any further out can't reach the screen: the spacing exceeds its
    // wander plus its size.
    for (let col = -1; col <= this.cols; col++) {
      const anchorX = col * this.spacingX + offsetX;

      for (let row = -1; row <= this.rows; row++) {
        // Everything particular to this cell comes from its identity in the
        // colony, so it survives the wrap unchanged.
        const id = hash(col - shiftX, row - shiftY);
        const x = anchorX + wander * path(id, 1, time);
        const y = row * this.spacingY + offsetY + wander * path(id, 2, time);

        // 0 at a trough, 1 at a crest.
        const swell =
          0.5 +
          0.3 * Math.sin(swellNumber * (x * 0.8 + y * 0.6) - time * SWELL_SPEED) +
          0.2 * Math.sin(swellNumber2 * (x * 0.5 - y * 0.87) - time * SWELL_SPEED_2);

        const sprite = sprites[id % sprites.length];
        const r1 = ((id >>> 4) & 1023) / 1023;
        const r2 = ((id >>> 14) & 1023) / 1023;
        const r3 = ((id >>> 22) & 511) / 511;

        const angle = r1 * Math.PI * 2 + time * TUMBLE_SPEED * (r3 * 2 - 1);
        const squash = 1 + SQUASH * Math.sin(time * SQUASH_SPEED * (0.7 + r2) + r2 * Math.PI * 2);
        const size = this.radius * (SWELL_SMALL + (SWELL_LARGE - SWELL_SMALL) * swell);
        const scale = size / (OUTLINE_REACH * half);
        const scaleX = scale * squash;
        const scaleY = scale / squash;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);

        context.globalAlpha = SWELL_DIM + (SWELL_BRIGHT - SWELL_DIM) * swell;
        context.setTransform(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, x, y);
        context.drawImage(sprite, -half, -half);
      }
    }

    context.setTransform(1, 0, 0, 1, 0, 0);
    context.globalAlpha = 1;
    context.globalCompositeOperation = 'source-over';
  }
}

/** Deterministic pseudo-random numbers in 0-1. */
function seeded(seed: number): () => number {
  let state = seed | 0;
  return () => {
    state = (Math.imul(state, 1103515245) + 12345) & 0x7fffffff;
    return state / 0x7fffffff;
  };
}

/** Stable 32-bit hash of a lattice coordinate, which may be negative. */
function hash(a: number, b: number): number {
  let h = Math.imul(a, 0x27d4eb2d) ^ Math.imul(b, 0x165667b1);
  h = Math.imul(h ^ (h >>> 15), 0x85ebca6b);
  h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35);
  return (h ^ (h >>> 16)) >>> 0;
}

/**
 * A cell's offset from its anchor along one axis, from -1 to 1: a sum of
 * oscillations whose speeds and phases come from the cell's identity and the
 * axis, so each cell, and each axis of it, follows a different path.
 */
function path(id: number, axis: number, time: number): number {
  let bits = hash(id, axis);
  let offset = 0;
  for (const weight of WANDER_WEIGHTS) {
    const speed =
      WANDER_SPEED_MIN + (WANDER_SPEED_MAX - WANDER_SPEED_MIN) * ((bits & 1023) / 1023);
    const phase = (((bits >>> 10) & 1023) / 1023) * Math.PI * 2;
    offset += weight * Math.sin(time * speed + phase);
    bits = hash(bits, axis);
  }
  return offset;
}

/** Points around an irregular outline. */
const BLOB_POINTS = 48;

/**
 * An organic outline as radius multipliers around a circle: a sum of a few
 * low harmonics with random phases, normalised so the widest point is 1.
 * `wobble` sets how far it strays from round; at 0.07 the narrowest point
 * stays above 0.69.
 */
function blob(random: () => number, wobble: number): number[] {
  const harmonics = [2, 3, 4, 5].map((k) => ({
    k,
    amplitude: wobble * (0.5 + random() * 0.5) * (2 / k),
    phase: random() * Math.PI * 2,
  }));

  const radii: number[] = [];
  for (let i = 0; i < BLOB_POINTS; i++) {
    const angle = (i / BLOB_POINTS) * Math.PI * 2;
    let r = 1;
    for (const h of harmonics) r += h.amplitude * Math.sin(h.k * angle + h.phase);
    radii.push(r);
  }
  const widest = Math.max(...radii);
  return radii.map((r) => r / widest);
}

/** Traces a smooth closed path through a {@link blob} outline. */
function traceBlob(
  context: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  reach: number,
  shape: number[],
): void {
  const n = shape.length;
  const point = (i: number): [number, number] => {
    const angle = ((i % n) / n) * Math.PI * 2;
    const r = reach * shape[i % n];
    return [cx + Math.cos(angle) * r, cy + Math.sin(angle) * r];
  };

  const [x0, y0] = point(0);
  const [x1, y1] = point(1);
  context.beginPath();
  context.moveTo((x0 + x1) / 2, (y0 + y1) / 2);
  for (let i = 1; i <= n; i++) {
    const [ax, ay] = point(i);
    const [bx, by] = point(i + 1);
    context.quadraticCurveTo(ax, ay, (ax + bx) / 2, (ay + by) / 2);
  }
  context.closePath();
}

function rgb([r, g, b]: Rgb): string {
  return `rgb(${r} ${g} ${b})`;
}

function rgba([r, g, b]: Rgb, alpha: number): string {
  return `rgb(${r} ${g} ${b} / ${alpha})`;
}

function mix(from: Rgb, to: Rgb, amount: number): Rgb {
  return [
    Math.round(from[0] + (to[0] - from[0]) * amount),
    Math.round(from[1] + (to[1] - from[1]) * amount),
    Math.round(from[2] + (to[2] - from[2]) * amount),
  ];
}
