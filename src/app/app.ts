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
    // Verification does not load ads. Page metadata installs the loader only
    // after the route has resolved to an eligible tool.
    this.ads.installVerification();
    this.analytics.install();
    // Browser-only: honours an opt-out signal and enables the privacy-choices
    // control once Google's consent messaging has loaded.
    this.consent.install();
  }
}
