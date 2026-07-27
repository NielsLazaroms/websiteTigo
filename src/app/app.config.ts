import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideMnConfig } from 'mn-angular-lib';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    // MnConfigService loads mn-config.json5 over HttpClient at bootstrap.
    provideHttpClient(withFetch()),
    // Second arg is debugMode; keep it off outside of debugging.
    ...provideMnConfig('mn-config.json5', false),
  ],
};
