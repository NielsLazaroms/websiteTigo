import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CtaBand } from '../../shared/cta-band/cta-band';
import { Compare } from '../../shared/compare/compare';
import { PhotoImg } from '../../shared/photo';
import { Reveal } from '../../shared/reveal';
import { CASES, HERO_INSET, HERO_PHOTO, HOME_MOSAIC, SERVICES, SITE, WORKFLOW } from '../../site';

@Component({
  selector: 'app-home',
  imports: [RouterLink, CtaBand, Reveal, Compare, PhotoImg],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  protected readonly site = SITE;
  protected readonly services = SERVICES;
  protected readonly hero = HERO_PHOTO;
  protected readonly inset = HERO_INSET;
  protected readonly mosaic = HOME_MOSAIC;
  /** The before/after case shown on the home page. */
  protected readonly featured = CASES[0];
  protected readonly workflow = WORKFLOW;
}
