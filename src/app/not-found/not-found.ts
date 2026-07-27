import {
  afterNextRender,
  Component,
  DestroyRef,
  ElementRef,
  inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { gsap } from 'gsap';

type WorkShot = {
  src: string;
  alt: string;
  /** Jobsite "ticket" caption: surface · treatment. */
  caption: string;
};

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  templateUrl: './not-found.html',
  styleUrl: './not-found.css',
})
export class NotFound {
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);

  /** Real, finished work — used as proof in the scrolling filmstrip. */
  protected readonly shots: WorkShot[] = [
    { src: 'work/schilder-plafond-rol.jpeg', alt: 'Schilder rolt een plafond in latex', caption: 'Plafond · latex' },
    { src: 'work/trap-behang-portret.jpeg', alt: 'Trappenhuis met botanisch behang', caption: 'Trappenhuis · behang' },
    { src: 'work/voordeur-blauw.jpeg', alt: 'Blauwe voordeur in hoogglans', caption: 'Voordeur · hoogglans' },
    { src: 'work/dubbele-deur-antraciet.jpeg', alt: 'Antraciet openslaande deuren', caption: 'Deuren · buitenlak' },
    { src: 'work/schilder-groen-insnijden.jpeg', alt: 'Wand insnijden in het groen', caption: 'Wanden · insnijden' },
    { src: 'work/schuurdeuren-groen.jpeg', alt: 'Groene schuurdeuren in hoogglans', caption: 'Schuurdeuren · lak' },
    { src: 'work/serre-wit-na.jpeg', alt: 'Serre binnenwerk in het wit afgelakt', caption: 'Serre · binnenwerk' },
    { src: 'work/trap-grijs.jpeg', alt: 'Open trap strak grijs gelakt', caption: 'Trap · gelakt' },
    { src: 'work/toilet-zwart-na.jpeg', alt: 'Toilet met zwarte tegellak', caption: 'Toilet · tegellak' },
    { src: 'work/gevel-wit-bungalow.jpeg', alt: 'Witte gevel na steenverf', caption: 'Gevel · steenverf' },
    { src: 'work/eetkamer-behang.jpeg', alt: 'Eetkamer met grasbehang', caption: 'Eetkamer · grasbehang' },
    { src: 'work/trap-behang-breed.jpeg', alt: 'Trappenhuis met botanisch behang, breed', caption: 'Trappenhuis · botanisch' },
  ];

  /** Doubled so the marquee track can loop seamlessly. */
  protected readonly strip: WorkShot[] = [...this.shots, ...this.shots];

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
        const track = q<HTMLElement>('.strip__track');

        // Continuous filmstrip loop (skipped, but shown static, when reduced motion).
        if (track && !reduce) {
          const loop = gsap.to(track, {
            xPercent: -50,
            duration: 46,
            ease: 'none',
            repeat: -1,
          });
          const strip = q<HTMLElement>('.strip');
          strip?.addEventListener('mouseenter', () => loop.timeScale(0.15));
          strip?.addEventListener('mouseleave', () => loop.timeScale(1));
        }

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

        // 1 — masthead + eyebrow settle in.
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
