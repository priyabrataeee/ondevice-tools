import {ChangeDetectionStrategy, Component, OnInit, inject} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {AdsService} from './core/ads.service';
import {AnalyticsService} from './core/analytics.service';
import {ConsentService} from './core/consent.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  private readonly ads = inject(AdsService);
  private readonly analytics = inject(AnalyticsService);
  private readonly consent = inject(ConsentService);

  ngOnInit(): void {
    // Both run during prerender as well as in the browser, so their tags are
    // present in the static HTML the AdSense verification crawler fetches — it
    // does not execute JavaScript. Each is a no-op until configured.
    this.ads.install();
    this.analytics.install();
    // Browser-only: honours an opt-out signal and enables the privacy-choices
    // control once Google's consent messaging has loaded.
    this.consent.install();
  }
}
