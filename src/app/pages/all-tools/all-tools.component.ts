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
      <header class="animate-rise mb-8">
        <h1 class="text-3xl font-bold tracking-tight md:text-4xl">All tools</h1>
        <p class="mt-2 max-w-2xl text-lg text-muted">
          Every one of the {{ total }} OnDevice Tools utilities, filtered live. Nothing you type here
          leaves your browser.
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
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
            The web was originally designed as a document viewer, but modern browser engines (V8, JavaScriptCore, Gecko) have evolved into ultra-fast, sandboxed application runtimes capable of desktop-grade data processing without ever contacting a server.
          </p>
        </header>

        <div class="grid gap-8 md:grid-cols-3">
          <div class="card p-6">
            <h3 class="text-base font-semibold text-fg">Absolute Privacy</h3>
            <p class="mt-2 text-sm leading-relaxed text-muted">
              Whether you are pasting a production JWT token, compressing family photos, or merging sensitive legal contracts, your files and text never leave your computer or phone.
            </p>
          </div>
          <div class="card p-6">
            <h3 class="text-base font-semibold text-fg">Zero Network Latency</h3>
            <p class="mt-2 text-sm leading-relaxed text-muted">
              Because operations execute on your device CPU and GPU, you avoid slow upload times, server processing queues, and bandwidth consumption on mobile networks.
            </p>
          </div>
          <div class="card p-6">
            <h3 class="text-base font-semibold text-fg">Offline Availability</h3>
            <p class="mt-2 text-sm leading-relaxed text-muted">
              After your initial visit, our service worker caches the application bundles. You can open and use any tool while travelling, on a flight, or during internet outages.
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
      a: 'Every utility is written in pure JavaScript, WebAssembly, and native web APIs (like HTML5 Canvas, File API, Web Crypto, and RFC-compliant parsers). When you drag a file or paste text, your browser executes the code locally in memory.',
    },
    {
      q: 'Is there any subscription fee, paywall or usage limit?',
      a: 'No. All 64 tools are completely free for personal and commercial use without account registration or artificial quotas.',
    },
    {
      q: 'How can I verify that my data is never sent to a server?',
      a: 'You can open your browser developer tools (F12 or Ctrl+Shift+I), switch to the Network tab, and perform any action. You will observe zero outbound HTTP requests carrying your payload.',
    },
    {
      q: 'Can these tools be used completely offline?',
      a: 'Yes. Once cached by our Service Worker on your first visit, the entire suite functions with no active internet connection.',
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
