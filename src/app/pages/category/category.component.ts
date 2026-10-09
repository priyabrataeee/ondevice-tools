import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SeoService } from '../../core/seo.service';
import { canonicalUrl } from '../../core/site.config';
import { ToolService } from '../../core/tool.service';
import { Category, CategoryId } from '../../core/tool.types';
import { CATEGORY_CONTENT } from '../../core/data/category-content';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { ToolCardComponent } from '../../shared/components/tool-card/tool-card.component';

@Component({
  selector: 'app-category',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, IconComponent, ToolCardComponent],
  template: `
    @let cat = category();
    @if (cat) {
      <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-14">
        <nav class="mb-5 flex items-center gap-1.5 text-sm text-faint" aria-label="Breadcrumb">
          <a routerLink="/" class="transition-colors hover:text-fg">Home</a>
          <app-icon name="chevron-right" class="h-3.5 w-3.5" />
          <span class="text-muted" aria-current="page">{{ cat.name }}</span>
        </nav>

        <header class="collection-heading animate-rise mb-8 flex items-start gap-4">
          <span
            class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-brand"
          >
            <app-icon [name]="cat.icon" class="h-6 w-6" />
          </span>
          <div>
            <h1 class="text-3xl font-bold tracking-tight md:text-4xl">{{ cat.name }}</h1>
            <p class="mt-2 max-w-2xl text-lg text-muted">{{ cat.description }}</p>
            <p class="mt-1 text-sm text-faint">{{ tools().length }} tools in this category</p>
          </div>
        </header>

        <div class="index-collection">
          @for (tool of tools(); track tool.id) {
            <app-tool-card [tool]="tool" />
          }
        </div>

        @let guide = content();
        @if (guide) {
          <article class="mt-16 border-t border-line pt-12">
            <header class="mb-8">
              <h2 class="text-2xl font-bold tracking-tight text-balance text-fg md:text-3xl">
                {{ guide.headline }}
              </h2>
              <p class="mt-3 text-lg leading-relaxed text-muted">
                {{ guide.leadParagraph }}
              </p>
            </header>

            <div class="grid gap-8 md:grid-cols-2">
              @for (sec of guide.sections; track sec.heading) {
                <div class="card p-6">
                  <h3 class="text-lg font-semibold text-fg">{{ sec.heading }}</h3>
                  <div class="mt-3 space-y-3">
                    @for (p of sec.body; track $index) {
                      <p class="text-sm leading-relaxed text-muted">{{ p }}</p>
                    }
                  </div>
                </div>
              }
            </div>

            @if (guide.workflows.length) {
              <section class="mt-12">
                <h3 class="mb-4 text-xl font-bold tracking-tight text-fg">Recommended Workflows</h3>
                <div class="grid gap-4 sm:grid-cols-2">
                  @for (wf of guide.workflows; track wf.title) {
                    <div class="rounded-xl border border-line bg-surface p-5">
                      <h4 class="font-semibold text-fg">{{ wf.title }}</h4>
                      <ol class="mt-3 list-decimal pl-5 space-y-1.5 text-sm text-muted">
                        @for (step of wf.steps; track $index) {
                          <li>{{ step }}</li>
                        }
                      </ol>
                    </div>
                  }
                </div>
              </section>
            }

            @if (guide.faqs.length) {
              <section class="mt-12">
                <h3 class="mb-4 text-xl font-bold tracking-tight text-fg">Frequently Asked Questions</h3>
                <div class="divide-y divide-line overflow-hidden rounded-2xl border border-line">
                  @for (faq of guide.faqs; track faq.q) {
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
            }
          </article>
        }

        <section class="mt-14">
          <h2 class="mb-4 text-xl font-bold tracking-tight">Other categories</h2>
          <div class="flex flex-wrap gap-2">
            @for (other of otherCategories(); track other.id) {
              <a [routerLink]="['/category', other.id]" class="chip">{{ other.name }}</a>
            }
          </div>
        </section>
      </div>
    } @else {
      <div class="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 class="text-2xl font-bold">Category not found</h1>
        <a routerLink="/tools" class="btn btn-primary mt-6">Browse all tools</a>
      </div>
    }
  `,
})
export class CategoryComponent implements OnInit {
  private readonly toolService = inject(ToolService);
  private readonly seo = inject(SeoService);
  private readonly route = inject(ActivatedRoute);

  private readonly categoryId = signal<CategoryId | null>(null);

  protected readonly category = computed<Category | undefined>(() => {
    const id = this.categoryId();
    return id ? this.toolService.category(id) : undefined;
  });

  protected readonly content = computed(() => {
    const id = this.categoryId();
    return id ? CATEGORY_CONTENT[id] : undefined;
  });

  protected readonly tools = computed(() => {
    const id = this.categoryId();
    return id ? this.toolService.byCategory(id) : [];
  });

  protected readonly otherCategories = computed(() =>
    this.toolService.categories().filter((c) => c.id !== this.categoryId()),
  );

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id') as CategoryId | null;
      this.categoryId.set(id);

      const category = this.category();
      if (!category) return;

      const tools = this.tools();
      const guide = this.content();
      this.seo.apply({
        title: `${category.name} — ${tools.length} Free Online Tools`,
        description: `${category.description} All ${tools.length} tools run entirely in your browser with no uploads.`,
        path: `/category/${category.id}`,
        structuredData: [
          {
            '@type': 'CollectionPage',
            name: category.name,
            description: category.description,
            url: canonicalUrl(`/category/${category.id}`),
            mainEntity: {
              '@type': 'ItemList',
              numberOfItems: tools.length,
              itemListElement: tools.map((tool, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: tool.name,
                url: canonicalUrl(`/tools/${tool.id}`),
              })),
            },
          },
          ...(guide?.faqs?.length
            ? [
                {
                  '@type': 'FAQPage',
                  mainEntity: guide.faqs.map((faq) => ({
                    '@type': 'Question',
                    name: faq.q,
                    acceptedAnswer: { '@type': 'Answer', text: faq.a },
                  })),
                },
              ]
            : []),
        ],
      });
    });
  }
}

