import { describe, expect, it } from 'vitest';
import { ClampGeneratorComponent } from './clamp-generator.component';

class TestClamp extends ClampGeneratorComponent {
  check(min: number, max: number) { this.minViewport.set(min); this.maxViewport.set(max); return this.invalid(); }
}
describe('clamp viewport validation', () => {
  it('rejects reversed, equal and nonpositive widths', () => {
    const tool = new TestClamp();
    expect(tool.check(1280, 320)).toBe(true);
    expect(tool.check(320, 320)).toBe(true);
    expect(tool.check(0, 1280)).toBe(true);
    expect(tool.check(320, 1280)).toBe(false);
  });
});
