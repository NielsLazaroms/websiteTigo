import { DOCUMENT, isPlatformServer } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { SERVICES, SITE, SOCIAL_PHOTO } from './site';

/** Per-route metadata, declared as `data: { seo: … }` on a route. */
export interface RouteSeo {
  /** Page title without the site name. */
  title: string;
  description: string;
  /** Name used in the breadcrumb trail; defaults to `title`. */
  crumb?: string;
  /** Keep this page out of search results (the 404 page). */
  noindex?: boolean;
}

/**
 * Keeps the document title, meta description, canonical link, Open Graph tags
 * and JSON-LD in step with the active route. Every route is prerendered, so
 * these tags end up in the static HTML that crawlers read.
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly router = inject(Router);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);

  /** Call once from the root component. */
  init(): void {
    this.setStructuredData('business-schema', this.business());
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => this.apply());
  }

  /** Adds or replaces a JSON-LD block in the head, keyed by element id. */
  setStructuredData(id: string, data: unknown): void {
    let script = this.document.getElementById(id) as HTMLScriptElement | null;
    if (!script) {
      script = this.document.createElement('script');
      script.type = 'application/ld+json';
      script.id = id;
      this.document.head.appendChild(script);
    }
    // Escape `<` so text containing `</script>` cannot break out of the block.
    script.textContent = JSON.stringify(data).replace(/</g, '\\u003c');
  }

  removeStructuredData(id: string): void {
    this.document.getElementById(id)?.remove();
  }

  private apply(): void {
    // Collect the `seo` data of every matched route, root first, for the breadcrumb trail.
    const trail: { seo: RouteSeo; path: string }[] = [];
    let snapshot: ActivatedRouteSnapshot | null = this.router.routerState.snapshot.root;
    let path = '';
    while (snapshot) {
      const segment = snapshot.url.map((s) => s.path).join('/');
      if (segment) path += '/' + segment;
      const seo = snapshot.data['seo'] as RouteSeo | undefined;
      if (seo && trail.at(-1)?.seo !== seo) trail.push({ seo, path: path || '/' });
      snapshot = snapshot.firstChild;
    }
    const seo = trail.at(-1)?.seo;
    if (!seo) return;

    // The browser tab shows only the company name, on every page (a deliberate
    // choice). The page-specific title still goes into the share-preview tags.
    const fullTitle = `${SITE.name} | ${seo.title}`;
    const url = this.origin() + this.canonicalPath(this.router.url);
    const image = this.origin() + '/' + SOCIAL_PHOTO.original;

    this.title.setTitle(SITE.name);
    this.meta.updateTag({ name: 'description', content: seo.description });
    this.meta.updateTag({ name: 'robots', content: seo.noindex ? 'noindex' : 'index, follow' });
    this.meta.updateTag({ property: 'og:title', content: fullTitle });
    this.meta.updateTag({ property: 'og:description', content: seo.description });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:image', content: image });
    this.meta.updateTag({ property: 'og:image:alt', content: SOCIAL_PHOTO.alt });
    this.meta.updateTag({ property: 'og:image:width', content: String(SOCIAL_PHOTO.width) });
    this.meta.updateTag({ property: 'og:image:height', content: String(SOCIAL_PHOTO.height) });
    this.meta.updateTag({ name: 'twitter:title', content: fullTitle });
    this.meta.updateTag({ name: 'twitter:description', content: seo.description });
    this.meta.updateTag({ name: 'twitter:image', content: image });
    this.setCanonical(seo.noindex ? null : url);

    if (seo.noindex || trail.length === 0 || this.router.url.split(/[?#]/)[0] === '/') {
      this.removeStructuredData('breadcrumb-schema');
    } else {
      const crumbs = [{ name: 'Home', path: '/' }, ...trail.map((t) => ({ name: t.seo.crumb ?? t.seo.title, path: t.path }))];
      this.setStructuredData('breadcrumb-schema', {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: crumbs.map((crumb, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: crumb.name,
          item: this.origin() + this.canonicalPath(crumb.path),
        })),
      });
    }
  }

  /** The static host serves each page as a folder, so every non-root path ends in a slash. */
  private canonicalPath(routerUrl: string): string {
    const path = routerUrl.split(/[?#]/)[0];
    if (path === '' || path === '/') return '/';
    return path.endsWith('/') ? path : path + '/';
  }

  private setCanonical(url: string | null): void {
    let link = this.document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!url) {
      link?.remove();
      return;
    }
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  /** While prerendering there is no real origin, so the configured domain is used. */
  private origin(): string {
    return isPlatformServer(this.platformId) ? SITE.origin : this.document.location.origin;
  }

  /** The business itself, as schema.org `HousePainter` (a LocalBusiness type). */
  private business(): unknown {
    return {
      '@context': 'https://schema.org',
      '@type': 'HousePainter',
      '@id': SITE.origin + '/#business',
      name: SITE.name,
      url: SITE.origin + '/',
      logo: SITE.origin + '/logo_text.png',
      image: SITE.origin + '/' + SOCIAL_PHOTO.original,
      telephone: SITE.phoneIntl,
      email: SITE.email,
      ...(SITE.region ? { areaServed: SITE.region } : {}),
      makesOffer: SERVICES.map((service) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: service.name,
          description: service.short,
          url: `${SITE.origin}/diensten/${service.slug}/`,
        },
      })),
    };
  }
}
