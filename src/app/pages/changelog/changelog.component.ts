import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/seo.service';
import { ToolService } from '../../core/tool.service';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { formatLongDate } from '../../core/long-date';

interface Entry {
  text: string;
  link?: string;
}

/**
 * Site-wide changes that are not tied to one tool's added or updated date.
 * Dates are when the change was made in the repository; keep them truthful.
 */
const SITE_UPDATES: { date: string; items: Entry[] }[] = [
  {
    date: '2026-11-04',
    items: [
      { text: 'Every tool page now has tested worked examples and a list of limits to check before using the result.' },
      { text: 'Length, weight, area, volume and speed converters merged into one Unit Converter. Old links redirect to it.', link: '/tools/unit-converter' },
      { text: 'New Guides section with five step-by-step articles.', link: '/guides' },
      { text: 'Fixed Date Difference and Age Calculator showing negative days when the start date was the 29th, 30th or 31st of a month.' },
      { text: 'Word Counter and Reading Time now count characters as you see them, so an emoji counts as one.' },
      { text: 'Rewrote category pages to describe exactly what each tool does and does not do.' },
    ],
  },
  {
    date: '2026-10-31',
    items: [
      { text: 'Tool pages link to six related tools instead of three.' },
      { text: 'Simpler homepage on phones: search and the first tools are visible without scrolling.' },
      { text: 'Larger minimum text size for labels across the site.' },
    ],
  },
  {
    date: '2026-10-14',
    items: [{ text: 'Every page now has its own written description for search results and link previews.' }],
  },
  {
    date: '2026-10-11',
    items: [
      { text: 'XML Formatter no longer changes meaningful whitespace inside values, comments or CDATA.', link: '/tools/xml-formatter' },
      { text: 'Sort Lines keeps equal values in their original order when sorting descending.', link: '/tools/sort-lines' },
      { text: 'Advertising limited to tool pages; home, catalogue, legal and error pages are ad-free.' },
    ],
  },
  {
    date: '2026-10-08',
    items: [
      { text: 'JSON Formatter and Minifier keep large numbers and duplicate keys exactly as written.', link: '/tools/json-formatter' },
      { text: 'Regex Tester runs patterns in a separate worker with a one-second limit, so a runaway pattern cannot freeze the page.', link: '/tools/regex-tester' },
    ],
  },
];

@Component({
  selector: 'app-changelog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, IconComponent],
  template: `
    <div class="mx-auto max-w-3xl px-4 py-10 sm:px-6 md:py-14">
      <nav class="mb-5 flex items-center gap-1.5 text-sm text-faint" aria-label="Breadcrumb">
        <a routerLink="/" class="transition-colors hover:text-fg">Home</a>
        <app-icon name="chevron-right" class="h-3.5 w-3.5" />
        <span class="text-muted" aria-current="page">What’s new</span>
      </nav>

      <h1 class="text-3xl font-bold tracking-tight md:text-4xl">What’s new</h1>
      <p class="mt-3 text-lg text-muted">
        Fixes, new tools and content updates, newest first. The full history is in the
        <a [href]="sourceUrl" class="text-brand underline underline-offset-2" rel="noopener">public source repository</a>.
      </p>

      <ol class="mt-10 space-y-10">
        @for (day of timeline; track day.date) {
          <li>
            <h2 class="text-sm font-semibold tracking-wide text-faint uppercase">
              <time [attr.datetime]="day.date">{{ date(day.date) }}</time>
            </h2>
            <ul class="mt-3 space-y-2 border-l border-line pl-4">
              @for (entry of day.items; track $index) {
                <li class="leading-relaxed text-fg">
                  @if (entry.link) {
                    <a [routerLink]="entry.link" class="hover:text-brand hover:underline">{{ entry.text }}</a>
                  } @else {
                    {{ entry.text }}
                  }
                </li>
              }
            </ul>
          </li>
        }
      </ol>
    </div>
  `,
})
export class ChangelogComponent implements OnInit {
  private readonly seo = inject(SeoService);
  private readonly toolService = inject(ToolService);

  protected readonly sourceUrl = 'https://github.com/priyabrataeee/ondevice-tools/commits/main';
  protected readonly date = formatLongDate;

  /** Site updates merged with every tool's recorded added date, newest first. */
  protected readonly timeline = (() => {
    const days = new Map<string, Entry[]>();
    const add = (date: string, entry: Entry) => days.set(date, [...(days.get(date) ?? []), entry]);
    for (const update of SITE_UPDATES) update.items.forEach((item) => add(update.date, item));
    for (const tool of this.toolService.tools()) {
      // Unit Converter keeps the date its first converter shipped; say so.
      const text = tool.id === 'unit-converter'
        ? 'Added the first unit converters, now combined in Unit Converter.'
        : `Added ${tool.name}.`;
      add(tool.added, { text, link: `/tools/${tool.id}` });
    }
    return [...days.entries()]
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([date, items]) => ({ date, items }));
  })();

  ngOnInit(): void {
    this.seo.apply({
      title: 'What’s New — Updates and Fixes',
      description:
        'See what changed on OnDevice Tools: new tools, bug fixes, rewritten explanations and site updates, listed by date with links to each affected tool or page.',
      path: '/changelog',
      breadcrumbs: [{ name: 'What’s new', path: '/changelog' }],
    });
  }
}
