// Generates the web-sized images the site actually serves.
//
//   npm run images
//
// - Every photo in public/work/*.jpeg becomes WebP at five widths in
//   public/work/opt/, which the pages use through `srcset` (see src/app/site.ts).
//   The original JPEGs stay where they are; the share-preview image uses one.
// - public/logo.png is a large square with wide empty margins. It is trimmed
//   to the artwork and scaled down to public/logo-mark.png, and also turned
//   into the browser-tab icon (favicon.ico) and home-screen icons.
//
// Run it again after adding or replacing a photo, and commit the results.
import { mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import sharp from 'sharp';

/** Keep in step with PHOTO_WIDTHS in src/app/site.ts. */
/**
 * WebP quality per width. The largest sizes are only used on big, sharp screens,
 * where each pixel is tiny, so they can be compressed harder without it showing.
 */
const WIDTHS = { 400: 68, 660: 68, 800: 68, 960: 62, 1200: 56 };

const workDir = 'public/work';
const outDir = join(workDir, 'opt');
mkdirSync(outDir, { recursive: true });

for (const file of readdirSync(workDir).filter((name) => name.endsWith('.jpeg'))) {
  const name = basename(file, '.jpeg');
  for (const [width, quality] of Object.entries(WIDTHS).map(([w, q]) => [Number(w), q])) {
    const info = await sharp(join(workDir, file))
      .rotate() // apply the camera's orientation before resizing
      .resize({ width, withoutEnlargement: true })
      .webp({ quality })
      .toFile(join(outDir, `${name}-${width}.webp`));
    console.log(`${name}-${width}.webp  ${Math.round(info.size / 1024)} kB`);
  }
}

for (const [source, target, width] of [['public/logo.png', 'public/logo-mark.png', 180]]) {
  const info = await sharp(source).trim().resize({ width }).png({ compressionLevel: 9 }).toFile(target);
  console.log(`${target}  ${info.width}x${info.height}  ${Math.round(info.size / 1024)} kB`);
}

// Browser-tab and home-screen icons, from the same logo: the trimmed mark,
// centred on a square with a little breathing room.
const mark = await sharp('public/logo.png').trim().toBuffer();
const icon = (size, background) =>
  sharp(mark)
    .resize({ width: Math.round(size * 0.86), height: Math.round(size * 0.86), fit: 'contain', background })
    .extend({
      top: Math.round(size * 0.07),
      bottom: size - Math.round(size * 0.86) - Math.round(size * 0.07),
      left: Math.round(size * 0.07),
      right: size - Math.round(size * 0.86) - Math.round(size * 0.07),
      background,
    })
    .png({ compressionLevel: 9 })
    .toBuffer();
const clear = { r: 255, g: 255, b: 255, alpha: 0 };
const white = { r: 255, g: 255, b: 255, alpha: 1 };

writeFileSync('public/icon-192.png', await icon(192, clear));
// Home-screen icons are shown without transparency, so this one is on white.
writeFileSync('public/apple-touch-icon.png', await sharp(await icon(180, white)).flatten({ background: white }).png().toBuffer());

// favicon.ico: an .ico file may simply wrap a PNG. One 48 px image is enough.
const png48 = await icon(48, clear);
const header = Buffer.alloc(22);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(1, 4); // one image
header.writeUInt8(48, 6); // width
header.writeUInt8(48, 7); // height
header.writeUInt16LE(1, 10); // colour planes
header.writeUInt16LE(32, 12); // bits per pixel
header.writeUInt32LE(png48.length, 14); // size of the PNG data
header.writeUInt32LE(22, 18); // offset of the PNG data
writeFileSync('public/favicon.ico', Buffer.concat([header, png48]));
console.log('public/favicon.ico, public/icon-192.png, public/apple-touch-icon.png');
