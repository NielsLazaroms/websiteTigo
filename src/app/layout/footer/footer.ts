import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SERVICES, SITE } from '../../site';

@Component({
  selector: 'app-site-footer',
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class SiteFooter {
  protected readonly site = SITE;
  protected readonly services = SERVICES;
  protected readonly year = new Date().getFullYear();
}
