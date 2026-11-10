import { Injectable } from '@angular/core';
import { PathLocationStrategy } from '@angular/common';

/**
 * Writes every outgoing URL (`routerLink` hrefs and the address bar) with a
 * trailing slash, e.g. `/contact/`. The prerendered site serves each page as a
 * folder, and the canonical and sitemap URLs use the same form, so internal
 * links point straight at the canonical URL instead of at a redirect.
 */
@Injectable()
export class TrailingSlashLocationStrategy extends PathLocationStrategy {
  override prepareExternalUrl(internal: string): string {
    const match = /^([^?#]*)(.*)$/.exec(internal);
    const path = match?.[1] ?? '';
    const rest = match?.[2] ?? '';
    const slashed = path === '' || path.endsWith('/') ? path : `${path}/`;
    return super.prepareExternalUrl(slashed + rest);
  }
}
