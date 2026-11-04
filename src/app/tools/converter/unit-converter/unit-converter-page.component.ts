import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UnitConverterComponent } from '../shared/unit-converter.component';
import { AREA, LENGTH, SPEED, UnitGroup, VOLUME, WEIGHT } from '../lib/units';

interface Quantity {
  id: string;
  label: string;
  group: UnitGroup;
  defaultUnit: string;
}

/**
 * The five multiplicative unit families on one page.
 *
 * They were separate pages with identical behaviour and near-identical copy.
 * The old URLs 301 here with `?type=`, so a bookmarked Speed Converter still
 * opens on speed.
 */
export const QUANTITIES: readonly Quantity[] = [
  { id: 'length', label: 'Length', group: LENGTH, defaultUnit: 'm' },
  { id: 'weight', label: 'Weight', group: WEIGHT, defaultUnit: 'kg' },
  { id: 'area', label: 'Area', group: AREA, defaultUnit: 'm2' },
  { id: 'volume', label: 'Volume', group: VOLUME, defaultUnit: 'l' },
  { id: 'speed', label: 'Speed', group: SPEED, defaultUnit: 'kph' },
];

@Component({
  selector: 'app-unit-converter-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UnitConverterComponent],
  template: `
    <app-unit-converter toolId="unit-converter" [group]="active().group" [defaultUnit]="active().defaultUnit">
      <div converterControls>
        <span class="label" id="uc-quantity-label">Quantity</span>
        <div class="flex flex-wrap gap-2" role="group" aria-labelledby="uc-quantity-label">
          @for (quantity of quantities; track quantity.id) {
            <button
              type="button"
              class="chip"
              [attr.aria-pressed]="active().id === quantity.id"
              (click)="select(quantity.id)"
            >
              {{ quantity.label }}
            </button>
          }
        </div>
      </div>
    </app-unit-converter>
  `,
})
export class UnitConverterPageComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly quantities = QUANTITIES;
  protected readonly activeId = signal(this.route.snapshot.queryParamMap.get('type') ?? 'length');
  protected readonly active = computed(
    () => QUANTITIES.find((q) => q.id === this.activeId()) ?? QUANTITIES[0],
  );

  protected select(id: string): void {
    this.activeId.set(id);
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { type: id === QUANTITIES[0].id ? null : id },
      replaceUrl: true,
    });
  }
}
