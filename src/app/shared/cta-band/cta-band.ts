import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CTA_PHOTO } from '../../site';
import { PhotoImg } from '../photo';
import { Reveal } from '../reveal';

/** Closing call to action shared by every page. */
@Component({
  selector: 'app-cta-band',
  imports: [RouterLink, Reveal, PhotoImg],
  template: `
    <section class="cta" appReveal>
      <div class="cta__text">
        <h2>Iets te schilderen, behangen of beglazen?</h2>
        <p>Vertel wat je wilt laten doen, dan komen we kijken en krijg je een offerte.</p>
        <div class="btn-row">
          <a class="btn" routerLink="/contact">Offerte aanvragen</a>
        </div>
      </div>
      <figure class="photo cta__photo">
        <img [appPhoto]="photo" sizes="(max-width: 760px) 92vw, 32vw" loading="lazy" />
      </figure>
    </section>
  `,
  styleUrl: './cta-band.css',
})
export class CtaBand {
  protected readonly photo = CTA_PHOTO;
}
