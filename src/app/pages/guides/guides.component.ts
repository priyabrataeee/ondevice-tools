import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/seo.service';
import { canonicalUrl } from '../../core/site.config';
import { GUIDES } from '../../core/data/guides';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { formatLongDate } from '../../core/long-date';

@Component({
  selector: 'app-guides',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, IconComponent],
  template: `
    <div class="mx-auto max-w-4xl px-4 py-10 sm:px-6 md:py-14">
      <nav class="mb-5 flex items-center gap-1.5 text-sm text-faint" aria-label="Breadcrumb">
        <a routerLink="/" class="transition-colors hover:text-fg">Home</a>
        <app-icon name="chevron-right" class="h-3.5 w-3.5" />
        <span class="text-muted" aria-current="page">Guides</span>
      </nav>

      <header class="mb-10">
        <h1 class="text-3xl font-bold tracking-tight md:text-4xl">Guides</h1>
        <p class="mt-3 max-w-2xl text-lg text-muted">
          Step-by-step explanations of everyday tasks: what is going on underneath, the numbers
          to check, and the mistakes to avoid. Each guide links to the tools that do the work.
        </p>
      </header>

      <ul class="divide-y divide-line border-y border-line">
        @for (guide of guides; track guide.slug) {
          <li>
            <a [routerLink]="['/guides', guide.slug]" class="group block py-6 transition-colors hover:bg-brand-soft sm:px-3">
              <h2 class="text-xl font-semibold tracking-tight text-fg group-hover:text-brand">{{ guide.title }}</h2>
              <p class="mt-2 leading-relaxed text-muted">{{ guide.summary }}</p>
              <p class="mt-3 text-sm text-faint">Updated {{ date(guide.updated) }}</p>
            </a>
          </li>
        }
      </ul>
    </div>
  `,
})
export class GuidesComponent implements OnInit {
  private readonly seo = inject(SeoService);
  protected readonly guides = GUIDES;
  protected readonly date = formatLongDate;

  ngOnInit(): void {
    this.seo.apply({
      title: 'Guides — Images, Text, JSON and Timestamps',
      description:
        'Practical guides to cropping and compressing images, comparing texts, fixing invalid JSON and reading Unix timestamps, each with worked numbers and tool links.',
      path: '/guides',
      breadcrumbs: [{ name: 'Guides', path: '/guides' }],
      structuredData: [
        {
          '@type': 'CollectionPage',
          name: 'Guides',
          url: canonicalUrl('/guides'),
          mainEntity: {
            '@type': 'ItemList',
            numberOfItems: GUIDES.length,
            itemListElement: GUIDES.map((guide, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: guide.title,
              url: canonicalUrl(`/guides/${guide.slug}`),
            })),
          },
        },
      ],
    });
  }
}
