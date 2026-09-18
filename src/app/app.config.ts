import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
  withRouterConfig,
} from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { routes } from './app.routes';
import { trailingSlashUrlProvider } from './core/trailing-slash-url-serializer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(
      routes,
      withComponentInputBinding(),
      // Always start a new page at the top; restore the position on back/forward.
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' }),
      withRouterConfig({ paramsInheritanceStrategy: 'always' }),
    ),
    provideClientHydration(withEventReplay()),
    // Emit internal hrefs with the trailing slash the host serves with a 200,
    // so crawlers stop following a 307 on every link.
    trailingSlashUrlProvider,
  ],
};
