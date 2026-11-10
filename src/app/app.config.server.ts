import { ApplicationConfig, mergeApplicationConfig } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { provideServerRendering, withRoutes } from '@angular/ssr';

import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { ServerAssetInterceptor } from './server-asset.interceptor';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    { provide: HTTP_INTERCEPTORS, useClass: ServerAssetInterceptor, multi: true },
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
