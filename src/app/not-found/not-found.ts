import {
  afterNextRender,
  Component,
  DestroyRef,
  ElementRef,
  inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { gsap } from 'gsap';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  templateUrl: './not-found.html',
  styleUrl: './not-found.css',
})
export class NotFound {
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      const root = this.host.nativeElement as HTMLElement;
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const q = <T extends Element>(sel: string) => root.querySelector<T>(sel);
      const qa = <T extends Element>(sel: string) => Array.from(root.querySelectorAll<T>(sel));

      const ctx = gsap.context(() => {
        const paint = q<HTMLElement>('.four04__layer--paint');
        const roller = q<HTMLElement>('.four04__roller');
        const drips = qa<HTMLElement>('.four04__drip');

        // Keeps the roller's centre locked onto the wet paint edge so no
        // unpainted sliver ever shows between the roller and the fresh red.
        const sweep = { p: 0 };
        const applySweep = () => {
          const p = sweep.p;
          if (paint) paint.style.clipPath = `inset(0 ${(1 - p) * 100}% 0 0)`;
          if (roller) roller.style.left = `calc(${p * 100}% - ${roller.offsetWidth / 2}px)`;
        };

        if (reduce) {
          // Show the finished state at once — no roller, no drips animation.
          sweep.p = 1;
          applySweep();
          if (roller) gsap.set(roller, { autoAlpha: 0 });
          gsap.set(drips, { scaleY: 1 });
          gsap.set(qa('[data-rise]'), { autoAlpha: 1, y: 0 });
          return;
        }

        // Initial states.
        sweep.p = 0;
        applySweep();
        if (roller) gsap.set(roller, { autoAlpha: 0 });
        gsap.set(drips, { scaleY: 0, transformOrigin: 'top center' });
        gsap.set(qa('[data-rise]'), { autoAlpha: 0, y: 26 });

        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        // 1 — eyebrow settles in.
        tl.to('[data-rise="head"]', { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.08 }, 0.1);

        // 2 — the signature: roller sweeps across and lays the red 404 down.
        tl.to(roller, { autoAlpha: 1, duration: 0.2 }, 0.35);
        tl.to(sweep, { p: 1, duration: 1.05, ease: 'power1.inOut', onUpdate: applySweep }, 0.5);
        tl.to(roller, { autoAlpha: 0, y: -34, duration: 0.4, ease: 'power2.in' }, '>-0.05');

        // 3 — wet paint drips run down from the digits.
        tl.to(drips, { scaleY: 1, duration: 0.55, ease: 'power2.in', stagger: 0.06 }, '>-0.2');

        // 4 — headline, copy and CTA rise up.
        tl.to('[data-rise="body"]', { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.12 }, '>-0.35');
      }, root);

      this.destroyRef.onDestroy(() => ctx.revert());
    });
  }
}
