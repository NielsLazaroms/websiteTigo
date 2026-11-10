import { Component, DestroyRef, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Compare } from '../../shared/compare/compare';
import { CtaBand } from '../../shared/cta-band/cta-band';
import { PhotoImg } from '../../shared/photo';
import { Reveal } from '../../shared/reveal';
import { SeoService } from '../../seo.service';
import { caseForService, serviceBySlug, SERVICES } from '../../site';

/** One template for all three services; the route's `data.slug` picks which. */
@Component({
  selector: 'app-service-detail',
  imports: [RouterLink, CtaBand, Reveal, PhotoImg, Compare],
  templateUrl: './service-detail.html',
  styleUrl: './service-detail.css',
})
export class ServiceDetail {
  private readonly seo = inject(SeoService);

  protected readonly service = serviceBySlug(inject(ActivatedRoute).snapshot.data['slug'])!;
  protected readonly others = SERVICES.filter((s) => s !== this.service);
  /** A before/after job that shows this service. */
  protected readonly example = caseForService(this.service.slug);
  /** Landscape photos get a wider slider than upright ones. */
  protected readonly exampleIsWide =
    this.example.stages[0].photo.width > this.example.stages[0].photo.height;

  constructor() {
    // The questions are on the page as text, so they may be published as FAQ schema.
    this.seo.setStructuredData('faq-schema', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: this.service.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: { '@type': 'Answer', text: faq.answer },
      })),
    });
    inject(DestroyRef).onDestroy(() => this.seo.removeStructuredData('faq-schema'));
  }
}
