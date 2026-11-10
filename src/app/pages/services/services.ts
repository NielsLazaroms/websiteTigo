import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CtaBand } from '../../shared/cta-band/cta-band';
import { PhotoImg } from '../../shared/photo';
import { Reveal } from '../../shared/reveal';
import { SERVICES } from '../../site';

@Component({
  selector: 'app-services',
  imports: [RouterLink, CtaBand, Reveal, PhotoImg],
  templateUrl: './services.html',
  styleUrl: './services.css',
})
export class Services {
  protected readonly services = SERVICES;
}
