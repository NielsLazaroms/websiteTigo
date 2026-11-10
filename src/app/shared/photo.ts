import { Directive, input } from '@angular/core';
import { Photo } from '../site';

/**
 * Fills in an `<img>` from a `Photo`: the WebP source set, a fallback `src`,
 * the alt text and the intrinsic size (which reserves the space before the
 * image loads). The template only adds `sizes`, saying how wide the image is
 * shown, so the browser can pick the smallest file that is sharp enough.
 *
 *   <img [appPhoto]="photo" sizes="(max-width: 800px) 100vw, 50vw" loading="lazy" />
 */
@Directive({
  selector: 'img[appPhoto]',
  host: {
    '[attr.src]': 'appPhoto().src',
    '[attr.srcset]': 'appPhoto().srcset',
    '[attr.alt]': 'decorative() ? "" : appPhoto().alt',
    '[attr.width]': 'appPhoto().width',
    '[attr.height]': 'appPhoto().height',
    decoding: 'async',
  },
})
export class PhotoImg {
  readonly appPhoto = input.required<Photo>();
  /** True when nearby text already says what the photo shows. */
  readonly decorative = input(false);
}
