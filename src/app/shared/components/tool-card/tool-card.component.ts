import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Tool } from '../../../core/tool.types';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-tool-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, IconComponent],
  template: `
    <a [routerLink]="['/tools', tool().id]" class="instrument-card">
      <div class="instrument-top">
        <span class="instrument-icon"><app-icon [name]="tool().icon" class="h-4.5 w-4.5" /></span>
        <app-icon name="arrow-right" class="instrument-arrow h-4 w-4" />
      </div>
      <h3>{{ tool().name }}</h3>
      <p>{{ tool().description }}</p>
      @if (showCategory()) { <span class="instrument-category">{{ categoryName() }}</span> }
    </a>
  `,
})
export class ToolCardComponent {
  readonly tool = input.required<Tool>();
  readonly categoryName = input<string>('');
  readonly showCategory = input(false);
}
