import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SeoService } from '../../core/seo.service';
import { SITE_AUTHOR, SITE_OG_IMAGE, SITE_URL, SOURCE_URL, canonicalUrl } from '../../core/site.config';
import { ToolService } from '../../core/tool.service';
import { GUIDES, guideBySlug } from '../../core/data/guides';
import { Tool } from '../../core/tool.types';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { ToolCardComponent } from '../../shared/components/tool-card/tool-card.component';
import { formatLongDate } from '../../core/long-date';

@Component({
  selector: 'app-guide',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, IconComponent, ToolCardComponent],
  template: `
    @let g = guide();
    @if (g) {
      <article class="mx-auto max-w-3xl px-4 py-10 sm:px-6 md:py-14">
        <nav class="mb-5 flex items-center gap-1.5 text-sm text-faint" aria-label="Breadcrumb">
          <a routerLink="/" class="transition-colors hover:text-fg">Home</a>
          <app-icon name="chevron-right" class="h-3.5 w-3.5" />
          <a routerLink="/guides" class="transition-colors hover:text-fg">Guides</a>
          <app-icon name="chevron-right" class="h-3.5 w-3.5" />
          <span class="truncate text-muted" aria-current="page">{{ g.title }}</span>
        </nav>

        <header class="mb-8">
          <h1 class="text-3xl font-bold tracking-tight text-balance md:text-4xl">{{ g.title }}</h1>
          <p class="mt-3 text-sm text-faint">
            By <a routerLink="/about" class="underline underline-offset-2 hover:text-fg">{{ author }}</a>
            · Published {{ date(g.published) }}
            @if (g.updated !== g.published) { · Updated {{ date(g.updated) }} }
          </p>
        </header>

        <section class="mb-10 rounded-2xl border border-line bg-surface p-5" aria-labelledby="short-answer">
          <h2 id="short-answer" class="text-sm font-semibold tracking-wide text-faint uppercase">Short answer</h2>
          <p class="mt-2 text-lg leading-relaxed text-fg">{{ g.summary }}</p>
        </section>

        <div class="prose-qt max-w-none">
          @for (section of g.sections; track section.heading) {
            <h2>{{ section.heading }}</h2>
            @for (paragraph of section.paragraphs; track $index) {
              <p>{{ paragraph }}</p>
            }
            @if (section.list) {
              @if (section.ordered) {
                <ol>@for (item of section.list; track $index) { <li>{{ item }}</li> }</ol>
              } @else {
                <ul>@for (item of section.list; track $index) { <li>{{ item }}</li> }</ul>
              }
            }
          }
        </div>

        <section class="mt-12" aria-labelledby="guide-tools">
          <h2 id="guide-tools" class="mb-4 text-2xl font-bold tracking-tight text-fg">Tools used in this guide</h2>
          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            @for (tool of tools(); track tool.id) {
              <app-tool-card [tool]="tool" />
            }
          </div>
        </section>

        <section class="mt-12" aria-labelledby="more-guides">
          <h2 id="more-guides" class="mb-4 text-2xl font-bold tracking-tight text-fg">More guides</h2>
          <ul class="space-y-2">
            @for (other of others(); track other.slug) {
              <li><a [routerLink]="['/guides', other.slug]" class="text-brand underline underline-offset-2">{{ other.title }}</a></li>
            }
          </ul>
        </section>
      </article>
    } @else {
      <div class="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 class="text-2xl font-bold text-fg">Guide not found</h1>
        <p class="mt-2 text-muted">This guide does not exist or has moved.</p>
        <a routerLink="/guides" class="btn btn-primary mt-6">All guides</a>
      </div>
    }
  `,
})
export class GuideComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);
  private readonly toolService = inject(ToolService);

  protected readonly author = SITE_AUTHOR;
  protected readonly date = formatLongDate;
  private readonly slug = signal('');
  protected readonly guide = computed(() => guideBySlug(this.slug()));
  protected readonly tools = computed<Tool[]>(() =>
    (this.guide()?.toolIds ?? []).map((id) => this.toolService.get(id)).filter((t): t is Tool => !!t),
  );
  protected readonly others = computed(() => GUIDES.filter((g) => g.slug !== this.slug()));

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.slug.set(params.get('slug') ?? '');
      const guide = this.guide();
      if (!guide) {
        this.seo.apply({
          title: 'Guide not found',
          description: 'This guide does not exist.',
          path: `/guides/${this.slug()}`,
          noindex: true,
        });
        return;
      }
      const path = `/guides/${guide.slug}`;
      this.seo.apply({
        title: guide.title,
        description: guide.description,
        path,
        breadcrumbs: [
          { name: 'Guides', path: '/guides' },
          { name: guide.title, path },
        ],
        structuredData: [
          {
            '@type': 'Article',
            headline: guide.title,
            description: guide.description,
            url: canonicalUrl(path),
            mainEntityOfPage: canonicalUrl(path),
            image: SITE_OG_IMAGE,
            datePublished: guide.published,
            dateModified: guide.updated,
            author: { '@type': 'Person', name: SITE_AUTHOR, url: SOURCE_URL },
            publisher: { '@id': `${SITE_URL}/#organization` },
            inLanguage: 'en',
          },
        ],
      });
    });
  }
}
