import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DONATION_URL } from '../../../core/site.config';
import { IconComponent } from '../icon/icon.component';

/**
 * Voluntary-support prompt.
 *
 * Placed after someone has actually got a result rather than before, which is
 * the only point at which the ask is reasonable. Deliberately a plain outbound
 * link and not an embedded widget: a widget would be another third-party
 * script, another CSP exception, and another thing loading on every page.
 */
@Component({
  selector: 'app-support-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
  template: `
    <aside
      class="support-note"
    >
      <span
        class="support-icon"
      >
        <app-icon name="coffee" class="h-6 w-6" />
      </span>

      <div class="min-w-0 flex-1">
        <p class="font-semibold text-fg">{{ heading() }}</p>
        <p class="mt-0.5 text-sm leading-relaxed text-muted">
          Every tool here is free, with no account required. If one saved you some time, you
          can chip in towards the running costs — entirely optional, and nothing is held back if
          you don't.
        </p>
      </div>

      <a
        [href]="donationUrl"
        target="_blank"
        rel="noopener nofollow"
        class="support-link"
      >
        <app-icon name="coffee" class="h-4 w-4" />
        Buy me a coffee
      </a>
    </aside>
  `,
})
export class SupportCardComponent {
  readonly heading = input('Found this useful?');

  protected readonly donationUrl = DONATION_URL;
}
