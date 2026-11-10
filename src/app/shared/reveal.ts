import { afterNextRender, DestroyRef, Directive, ElementRef, inject, input } from '@angular/core';

/**
 * Brings an element in as it scrolls into view.
 *
 * - `appReveal` lets it rise into place.
 * - `appReveal="wipe"` uncovers it from left to right, the way a roller lays
 *   down a strip of paint. Used for photos.
 * - `[revealIndex]` staggers siblings: each index waits a little longer.
 *
 * The prerendered HTML is fully visible. Only elements that are still below
 * the fold when the page becomes interactive are hidden and then revealed, so
 * nothing above the fold flickers, and without JavaScript or with reduced
 * motion everything is simply shown. The look of each state lives in
 * `styles.css` under "Motion".
 */
@Directive({ selector: '[appReveal]' })
export class Reveal {
  readonly appReveal = input<'' | 'rise' | 'wipe'>('');
  readonly revealIndex = input(0);

  constructor() {
    const element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      if (!('IntersectionObserver' in window)) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      // Already on screen: leave it alone.
      if (element.getBoundingClientRect().top < window.innerHeight * 0.92) return;

      element.dataset['reveal'] = this.appReveal() || 'rise';
      element.style.setProperty('--reveal-i', String(this.revealIndex()));
      element.classList.add('reveal-pending');

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            element.classList.remove('reveal-pending');
            observer.disconnect();
          }
        },
        { rootMargin: '0px 0px -8% 0px' },
      );
      observer.observe(element);
      destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}
