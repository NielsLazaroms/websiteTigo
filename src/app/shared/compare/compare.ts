import { Component, input, signal } from '@angular/core';
import { Photo } from '../../site';
import { PhotoImg } from '../photo';

/**
 * Before/after photo: the "na" photo with the "voor" photo laid over its left
 * part. Dragging (or the arrow keys) moves the dividing line. The control is a
 * native range input stretched over the photo, so it works with mouse, touch
 * and keyboard without extra code.
 */
@Component({
  selector: 'app-compare',
  imports: [PhotoImg],
  template: `
    <div class="compare" [style.--p]="position() + '%'">
      <img
        [appPhoto]="after()"
        [sizes]="sizes()"
        [attr.loading]="priority() ? null : 'lazy'"
        [attr.fetchpriority]="priority() ? 'high' : null"
      />
      <img
        class="compare__before"
        [appPhoto]="before()"
        [sizes]="sizes()"
        [attr.loading]="priority() ? null : 'lazy'"
        [attr.fetchpriority]="priority() ? 'high' : null"
      />
      <span class="compare__tag compare__tag--before" [class.is-hidden]="position() < 18">Voor</span>
      <span class="compare__tag compare__tag--after" [class.is-hidden]="position() > 82">Na</span>
      <span class="compare__handle" aria-hidden="true">
        <svg viewBox="0 0 24 24"><path d="M9 7l-5 5 5 5M15 7l5 5-5 5" /></svg>
      </span>
      <input
        type="range"
        min="0"
        max="100"
        [value]="position()"
        (input)="position.set(+$any($event.target).value)"
        aria-label="Schuif tussen voor en na"
      />
    </div>
  `,
  styleUrl: './compare.css',
})
export class Compare {
  readonly before = input.required<Photo>();
  readonly after = input.required<Photo>();
  /** How wide the slider is shown, as an `<img sizes>` value. */
  readonly sizes = input('(max-width: 700px) calc(100vw - 2.5rem), 40vw');
  /** Set on a slider that is on screen when the page opens, so its photos are not lazy-loaded. */
  readonly priority = input(false);
  /** Where the dividing line sits, in percent from the left. */
  protected readonly position = signal(50);
}
