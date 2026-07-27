import { Routes } from '@angular/router';
import { NotFound } from './not-found/not-found';

export const routes: Routes = [
  // The site is still being built, so every path lands on the "in uitvoering"
  // page for now. When real pages exist, add them above the wildcard.
  { path: '**', component: NotFound },
];
