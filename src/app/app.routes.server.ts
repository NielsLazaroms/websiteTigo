import { RenderMode, ServerRoute } from '@angular/ssr';

/** The site is fully static: every route is prerendered to HTML at build time. */
export const serverRoutes: ServerRoute[] = [{ path: '**', renderMode: RenderMode.Prerender }];
