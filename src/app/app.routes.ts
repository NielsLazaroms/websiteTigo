import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { RouteSeo } from './seo.service';
import { SERVICES } from './site';

const seo = (value: RouteSeo) => ({ seo: value });

/**
 * Each route carries its own title and meta description (see `SeoService`).
 * The home page is eager; the rest is lazy so it stays out of the first bundle.
 */
export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: Home,
    data: seo({
      title: 'Schilder, behanger en glaszetter',
      description:
        'Tigo Rutten Schilderwerken voor schilderwerk binnen en buiten, behangen en glas zetten. ' +
        'Bekijk recent werk en vraag een offerte aan.',
    }),
  },
  {
    path: 'diensten',
    data: seo({
      title: 'Onze diensten',
      crumb: 'Onze diensten',
      description:
        'Schilderwerken, behangen en glas zetten door één vakman. Lees wat Tigo Rutten Schilderwerken ' +
        'voor je huis of bedrijfspand kan doen.',
    }),
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./pages/services/services').then((m) => m.Services),
      },
      ...SERVICES.map((service) => ({
        path: service.slug,
        loadComponent: () => import('./pages/service-detail/service-detail').then((m) => m.ServiceDetail),
        data: { ...seo({ ...service.seo, crumb: service.name }), slug: service.slug },
      })),
    ],
  },
  {
    path: 'projecten',
    loadComponent: () => import('./pages/projects/projects').then((m) => m.Projects),
    data: seo({
      title: 'Projecten',
      description:
        'Foto’s van opgeleverd schilderwerk, behang en glaswerk, met voor en na: voordeuren, trappen, ' +
        'gevels, serres en trappenhuizen.',
    }),
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/contact/contact').then((m) => m.Contact),
    data: seo({
      title: 'Contact en offerte',
      description:
        'Vraag een offerte aan voor schilderwerk, behangen of glas zetten. Bel, app of mail ' +
        'Tigo Rutten Schilderwerken.',
    }),
  },
  // Explicit `/404` so the static build emits a `404/index.html` the host can use as its error page.
  {
    path: '404',
    loadComponent: () => import('./not-found/not-found').then((m) => m.NotFound),
    data: seo({ title: 'Pagina niet gevonden', description: 'Deze pagina bestaat niet.', noindex: true }),
  },
  {
    path: '**',
    loadComponent: () => import('./not-found/not-found').then((m) => m.NotFound),
    data: seo({ title: 'Pagina niet gevonden', description: 'Deze pagina bestaat niet.', noindex: true }),
  },
];
