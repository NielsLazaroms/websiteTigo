import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Observable, of } from 'rxjs';

/**
 * Serves `mn-config.json5` from disk while prerendering. In the browser the
 * relative request resolves against the page origin; during a Node prerender
 * there is no server to answer it. Registered only in the server build.
 */
@Injectable()
export class ServerAssetInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const path = req.url.split(/[?#]/)[0];
    if (/^https?:\/\//i.test(path) || !/\.json5?$/i.test(path)) {
      return next.handle(req);
    }
    const file = join(process.cwd(), 'public', path.replace(/^\//, ''));
    if (!existsSync(file)) {
      return next.handle(req);
    }
    const text = readFileSync(file, 'utf8');
    const body = req.responseType === 'json' ? JSON.parse(text) : text;
    return of(new HttpResponse({ status: 200, url: req.url, body }));
  }
}
