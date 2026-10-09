import { ChangeDetectionStrategy, Component, ElementRef, OnInit, computed, inject, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BackgroundMotionService } from '../../core/background-motion.service';
import { SeoService } from '../../core/seo.service';
import { SITE_DESCRIPTION } from '../../core/site.config';
import { ToolService } from '../../core/tool.service';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { SupportCardComponent } from '../../shared/components/support-card/support-card.component';

const CHANNEL_NAMES: Record<string, string> = {
  developer: 'CODE', text: 'WORDS', image: 'IMAGES', pdf: 'PDF', css: 'CSS',
  color: 'COLOR', calculator: 'MATH', converter: 'UNITS', datetime: 'TIME',
};

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, IconComponent, SupportCardComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  private readonly toolService = inject(ToolService);
  private readonly seo = inject(SeoService);
  protected readonly motion = inject(BackgroundMotionService);
  private readonly resultsPanel = viewChild<ElementRef<HTMLElement>>('resultsPanel');
  private readonly channelPanel = viewChild<ElementRef<HTMLElement>>('channelPanel');
  protected readonly query = signal('');
  protected readonly activeCategory = signal('developer');
  protected readonly categories = this.toolService.categories;
  protected readonly toolCount = this.toolService.tools().length;
  protected readonly personalTools = computed(() => [...new Map([
    ...this.toolService.favoriteTools(), ...this.toolService.recentTools(),
  ].map(t => [t.id, t])).values()].slice(0, 4));
  protected readonly channels = computed(() => this.categories().map((category, i, all) => ({
    ...category,
    short: CHANNEL_NAMES[category.id] ?? category.name,
    number: String(i + 1).padStart(2, '0'),
    x: 50 + 40.5 * Math.sin(i * Math.PI * 2 / all.length),
    y: 50 - 40.5 * Math.cos(i * Math.PI * 2 / all.length),
    count: this.toolService.tools().filter(t => t.category === category.id).length,
  })));
  protected readonly activeChannel = computed(() => this.channels().find(c => c.id === this.activeCategory()) ?? this.channels()[0]);
  protected readonly activeIndex = computed(() => this.channels().findIndex(c => c.id === this.activeCategory()));
  protected readonly dialRotation = signal(0);
  protected readonly dialTransform = computed(() => 'rotate(' + this.dialRotation() + 'deg)');
  protected readonly visibleTools = computed(() => this.query().trim()
    ? this.toolService.search(this.query())
    : this.toolService.tools().filter(t => t.category === this.activeCategory()));
  protected readonly ticks = Array.from({ length: 60 }, (_, i) => ({ angle: i * 6, major: i % 5 === 0 }));
  protected readonly quickTools = [
    'json-formatter', 'qr-code-generator', 'image-compressor', 'text-compare',
  ].map(id => this.toolService.get(id)).filter(t => t !== undefined);

  ngOnInit(): void {
    this.seo.apply({ title: this.toolCount + ' Free Browser Tools', description: SITE_DESCRIPTION, path: '/' });
  }
  protected selectCategory(id: string): void {
    const channels = this.channels();
    const nextIndex = channels.findIndex(c => c.id === id);
    if (nextIndex < 0) return;
    const currentIndex = this.activeIndex();
    if (currentIndex >= 0 && nextIndex !== currentIndex) {
      const length = channels.length;
      let step = nextIndex - currentIndex;
      if (step > length / 2) step -= length;
      if (step < -length / 2) step += length;
      this.dialRotation.update(rotation => rotation + step * 360 / length);
    }
    this.activeCategory.set(id);
    this.query.set('');
    this.resetScroll();
  }
  protected onSearch(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
    this.resetScroll();
  }
  protected clearSearch(): void { this.query.set(''); this.resetScroll(); }
  protected turnChannel(delta: number, event: Event): void {
    event.preventDefault();
    const channels = this.channels();
    const next = (this.activeIndex() + delta + channels.length) % channels.length;
    this.selectCategory(channels[next].id);
    this.channelPanel()?.nativeElement.querySelectorAll<HTMLButtonElement>('button')[next]?.focus();
  }
  private resetScroll(): void { const panel = this.resultsPanel()?.nativeElement; if (panel) panel.scrollTop = 0; }
}
