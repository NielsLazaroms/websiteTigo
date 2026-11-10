import { Component, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { PhotoImg } from '../../shared/photo';
import { CTA_PHOTO, SERVICES, SITE, WORKFLOW } from '../../site';

@Component({
  selector: 'app-contact',
  imports: [PhotoImg],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {
  private readonly document = inject(DOCUMENT);

  protected readonly site = SITE;
  protected readonly services = SERVICES;
  /** Tigo at work, beside the form. */
  protected readonly photo = CTA_PHOTO;
  /** What happens after the visitor gets in touch: the workflow minus its first step. */
  protected readonly next = WORKFLOW.slice(1);

  /**
   * There is no backend: the form writes the request into an e-mail and opens
   * it in the visitor's own mail app, where they press send themselves.
   */
  protected openMail(event: Event): void {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const value = (name: string) => String(data.get(name) ?? '').trim();
    const lines = [
      value('bericht'),
      '',
      `Naam: ${value('naam')}`,
      value('telefoon') ? `Telefoon: ${value('telefoon')}` : '',
      value('plaats') ? `Plaats: ${value('plaats')}` : '',
    ].filter((line, index) => index < 2 || line);

    const subject = `Offerteaanvraag ${value('dienst').toLowerCase()}`;
    this.document.location.href =
      `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(lines.join('\n'))}`;
  }
}
