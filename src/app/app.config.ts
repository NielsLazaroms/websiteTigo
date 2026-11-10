import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { LocationStrategy } from '@angular/common';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { provideMnConfig } from 'mn-angular-lib';

import { routes } from './app.routes';
import { TrailingSlashLocationStrategy } from './trailing-slash-location-strategy';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // Reuse the prerendered HTML instead of rebuilding the page on bootstrap.
    provideClientHydration(withEventReplay()),
    provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'top', anchorScrolling: 'enabled' })),
    // Links and the address bar use the canonical trailing-slash URLs (`/contact/`).
    { provide: LocationStrategy, useClass: TrailingSlashLocationStrategy },
    // MnConfigService loads mn-config.json5 over HttpClient at bootstrap.
    // `withInterceptorsFromDi` lets the server build read it from disk instead.
    provideHttpClient(withFetch(), withInterceptorsFromDi()),
    // Second arg is debugMode; keep it off outside of debugging.
    ...provideMnConfig('mn-config.json5', false),
  ],
};
