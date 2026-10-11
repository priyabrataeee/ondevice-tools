import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SeoService } from '../../core/seo.service';
import { ToolService } from '../../core/tool.service';
import { CategoryId } from '../../core/tool.types';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { ToolCardComponent } from '../../shared/components/tool-card/tool-card.component';

@Component({
  selector: 'app-all-tools',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, IconComponent, ToolCardComponent],
  template: `
    <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-14">
      <header class="collection-heading animate-rise mb-8">
        <p class="eyebrow mb-3">THE COMPLETE COLLECTION / {{ total }} UTILITIES</p>
        <h1 class="text-3xl font-bold tracking-tight md:text-4xl">Find your next shortcut.</h1>
        <p class="mt-2 max-w-2xl text-lg text-muted">
          All {{ total }} tools, one useful little corner of the internet. Search the collection or choose a category to get started.
        </p>
      </header>

      <div class="relative mb-5">
        <app-icon
          name="search"
          class="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-faint"
        />
        <label for="tools-search" class="sr-only">Filter tools</label>
        <input
          id="tools-search"
          type="search"
          class="input h-12 rounded-xl pl-12"
          placeholder="Filter by name, keyword or category…"
          autocomplete="off"
          [value]="query()"
          (input)="onSearch($event)"
        />
      </div>

      <div class="mb-8 flex flex-wrap gap-2">
        <button
          type="button"
          class="chip"
          [attr.aria-pressed]="activeCategory() === null"
          (click)="selectCategory(null)"
        >
          All
          <span class="text-xs opacity-60">{{ total }}</span>
        </button>
        @for (category of categories(); track category.id) {
          <button
            type="button"
            class="chip"
            [attr.aria-pressed]="activeCategory() === category.id"
            (click)="selectCategory(category.id)"
          >
            {{ category.name }}
            <span class="text-xs opacity-60">{{ countIn(category.id) }}</span>
          </button>
        }
      </div>

      @if (visible().length) {
        <div class="index-collection">
          @for (tool of visible(); track tool.id) {
            <app-tool-card [tool]="tool" [showCategory]="true" [categoryName]="nameOf(tool.category)" />
          }
        </div>
      } @else {
        <div class="card p-10 text-center">
          <app-icon name="search" class="mx-auto mb-3 h-8 w-8 text-faint" />
          <p class="font-medium">No tools match your filter</p>
          <p class="mt-1 text-sm text-muted">Try a shorter search term or a different category.</p>
          <button type="button" class="btn btn-secondary mt-4" (click)="reset()">Clear filters</button>
        </div>
      }

      <article class="mt-16 border-t border-line pt-12">
        <header class="mb-8 max-w-3xl">
          <h2 class="text-2xl font-bold tracking-tight text-balance text-fg md:text-3xl">
            Why Use Browser-Native Tools?
          </h2>
          <p class="mt-3 text-lg leading-relaxed text-muted">
            These utilities use browser APIs to process your input locally. Choose a tool to see
            its controls, supported formats and limitations. Site downloads, analytics and
            advertising are separate from that local processing.
          </p>
        </header>

        <div class="grid gap-8 md:grid-cols-3">
          <div class="card p-6">
            <h3 class="text-base font-semibold text-fg">Local Processing</h3>
            <p class="mt-2 text-sm leading-relaxed text-muted">
              Our tool code does not upload your input for processing. This public page still
              uses third-party services. Use sample data, not production credentials, and read
              the privacy policy before working with sensitive material.
            </p>
          </div>
          <div class="card p-6">
            <h3 class="text-base font-semibold text-fg">No Processing Upload</h3>
            <p class="mt-2 text-sm leading-relaxed text-muted">
              Processing runs on your device without an upload queue. Loading the app still uses
              bandwidth; large inputs can take time and some tools impose safety limits.
            </p>
          </div>
          <div class="card p-6">
            <h3 class="text-base font-semibold text-fg">Offline Availability</h3>
            <p class="mt-2 text-sm leading-relaxed text-muted">
              A service worker caches application resources. Open the tools you need and test
              them offline before travelling. Incomplete downloads or cleared storage can make
              a tool unavailable without a connection.
            </p>
          </div>
        </div>

        <section class="mt-12 max-w-3xl">
          <h3 class="mb-4 text-xl font-bold tracking-tight text-fg">Frequently Asked Questions</h3>
          <div class="divide-y divide-line overflow-hidden rounded-2xl border border-line">
            @for (faq of allToolsFaqs; track faq.q) {
              <details class="group bg-surface">
                <summary
                  class="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-4 font-medium text-fg hover:bg-brand-soft"
                >
                  {{ faq.q }}
                  <app-icon
                    name="chevron-down"
                    class="h-4 w-4 shrink-0 text-faint transition-transform group-open:rotate-180"
                  />
                </summary>
                <p class="px-4 pb-4 leading-relaxed text-muted">{{ faq.a }}</p>
              </details>
            }
          </div>
        </section>
      </article>

      <p class="mt-10 text-sm text-faint">
        Looking for something that is not here?
        <a routerLink="/" class="text-brand underline">Browse the categories</a> — new tools are
        added regularly.
      </p>
    </div>
  `,
})
export class AllToolsComponent implements OnInit {
  private readonly toolService = inject(ToolService);
  private readonly seo = inject(SeoService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly allToolsFaqs = [
    {
      q: 'How does OnDevice Tools process data without uploading it?',
      a: 'The tools use JavaScript libraries and browser APIs such as Canvas, File API and Web Crypto. File and text processing runs on your device. Analytics and advertising can make separate network requests.',
    },
    {
      q: 'Is there any subscription fee, paywall or usage limit?',
      a: 'The tools are free without account registration or a subscription. Some have input-size, output-count or execution-time limits for stability; check the controls and notes on each page.',
    },
    {
      q: 'How can I inspect local processing?',
      a: 'Use synthetic input while watching the Network tab in browser developer tools, then test the workflow offline. The source is public on GitHub. These checks are not a guarantee about third-party scripts or future code; do not use live credentials for testing.',
    },
    {
      q: 'Can these tools be used completely offline?',
      a: 'Tools whose required resources are cached can work offline. Open and test the tools you need before disconnecting. Browsers can evict caches, and an initial visit may not finish every download.',
    },
  ];

  protected readonly query = signal('');
  protected readonly activeCategory = signal<CategoryId | null>(null);
  protected readonly categories = this.toolService.categories;
  protected readonly total = this.toolService.tools().length;

  protected readonly visible = computed(() => {
    const q = this.query().trim();
    const base = q ? this.toolService.search(q) : this.toolService.tools();
    const category = this.activeCategory();
    return category ? base.filter((t) => t.category === category) : base;
  });

  ngOnInit(): void {
    this.seo.apply({
      title: `All ${this.total} Free Online Tools`,
      description: `Browse all ${this.total} free OnDevice Tools utilities — developer, text, image, PDF, CSS, colour, calculator, converter and date tools that run entirely in your browser.`,
      path: '/tools',
      structuredData: [
        {
          '@type': 'FAQPage',
          mainEntity: this.allToolsFaqs.map((faq) => ({
            '@type': 'Question',
            name: faq.q,
            acceptedAnswer: { '@type': 'Answer', text: faq.a },
          })),
        },
      ],
    });

    // Support deep links such as /tools?q=json from the site search action.
    const q = this.route.snapshot.queryParamMap.get('q');
    if (q) this.query.set(q);
  }

  protected onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.query.set(value);
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { q: value || null },
      replaceUrl: true,
    });
  }

  protected selectCategory(id: CategoryId | null): void {
    this.activeCategory.set(id);
  }

  protected countIn(id: CategoryId): number {
    return this.toolService.tools().filter((t) => t.category === id).length;
  }

  protected nameOf(id: string): string {
    return this.categories().find((c) => c.id === id)?.name ?? '';
  }

  protected reset(): void {
    this.query.set('');
    this.activeCategory.set(null);
  }
}
