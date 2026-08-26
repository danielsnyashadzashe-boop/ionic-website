/**
 * Generates public/og-default.png, the social link-preview card.
 *
 * The previous site had no og:image at all, so every share on LinkedIn,
 * Slack or WhatsApp rendered as bare text. Run `npm run og` after changing
 * the palette or wordmark.
 *
 * Rendered from SVG via sharp. Type is set in a heavy system grotesque
 * rather than Syne, because librsvg resolves fonts from the OS and not from
 * the project, and a webfont would silently fall back on whichever machine
 * happens to run the build.
 */
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const W = 1200;
const H = 630;

// sRGB approximations of the oklch tokens. librsvg predates oklch(), so the
// values are duplicated here rather than referenced. Keep them in step with
// the palette block in global.css.
const C = {
  base: '#14181F',
  raised: '#1D222B',
  panel: '#252B35',
  rule: '#333A45',
  fg: '#F5F6F8',
  fg3: '#8C93A0',
  fg4: '#6B7280',
  primary: '#5FD8E8',
  d1: '#71C2F5',
  d3: '#63DCB0',
  d4: '#E5CE72',
};


const SANS = "'Segoe UI', Helvetica, Arial, sans-serif";
const MONO = "'Consolas', 'Courier New', monospace";

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <radialGradient id="halo" cx="18%" cy="20%" r="62%">
      <stop offset="0%" stop-color="${C.primary}" stop-opacity="0.20"/>
      <stop offset="100%" stop-color="${C.primary}" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="${C.base}"/>
  <rect width="${W}" height="${H}" fill="url(#halo)"/>

  <!-- Blueprint grid -->
  ${Array.from({ length: 18 }, (_, i) => `<line x1="${i * 64}" y1="0" x2="${i * 64}" y2="${H}" stroke="${C.fg}" stroke-opacity="0.035" stroke-width="1"/>`).join('')}
  ${Array.from({ length: 10 }, (_, i) => `<line x1="0" y1="${i * 64}" x2="${W}" y2="${i * 64}" stroke="${C.fg}" stroke-opacity="0.035" stroke-width="1"/>`).join('')}

  <!-- Mark + wordmark -->
  <g transform="translate(64,44) scale(0.155) translate(130,148)">
    <path d="M -53 -84.8 A 100 100 0 1 0 66.9 -74.3" fill="none" stroke="${C.primary}" stroke-width="21" stroke-linecap="round"/>
    <path d="M -3 -19 L 32 0 L -3 19 L 4 0 Z" fill="${C.primary}" transform="translate(66.9,-74.3) rotate(-138)"/>
    <line x1="-17" y1="-140" x2="-17" y2="-52" stroke="${C.primary}" stroke-width="13" stroke-linecap="round"/>
    <line x1="17" y1="-140" x2="17" y2="-52" stroke="${C.primary}" stroke-width="13" stroke-linecap="round"/>
  </g>
  <text x="112" y="76" font-family="${SANS}" font-size="24" font-weight="600" fill="${C.fg}">Ionic</text>

  <!-- Status strip -->
  <line x1="64" y1="118" x2="${W - 64}" y2="118" stroke="${C.rule}" stroke-width="1"/>
  <circle cx="70" cy="105" r="3.5" fill="${C.d3}"/>
  <text x="84" y="109" font-family="${MONO}" font-size="12" letter-spacing="2.2" fill="${C.fg4}">OPERATIONAL</text>
  <text x="${W - 64}" y="109" text-anchor="end" font-family="${MONO}" font-size="12" letter-spacing="2.2" fill="${C.fg4}">IONICINNOVATE.COM</text>

  <!-- Headline -->
  <text x="60" y="292" font-family="${SANS}" font-size="86" font-weight="500" letter-spacing="-3.4" fill="${C.fg}">Transformation,</text>
  <text x="60" y="386" font-family="${SANS}" font-size="86" font-weight="500" letter-spacing="-3.4" fill="${C.primary}">instrumented.</text>

  <text x="64" y="446" font-family="${SANS}" font-size="19" fill="${C.fg3}">Strategic consulting and proprietary AI-enabled platforms, end to end.</text>

  <!-- Metric tiles -->
  ${[
    { v: '85%', l: 'FASTER PROCESSING', c: C.primary },
    { v: '60%', l: 'COST REDUCTION', c: C.d3 },
    { v: '99%+', l: 'ACCURACY', c: C.d4 },
  ]
    .map((m, i) => {
      const x = 64 + i * 210;
      return `
  <rect x="${x}" y="492" width="190" height="82" rx="8" fill="${C.raised}" stroke="${C.rule}" stroke-width="1"/>
  <text x="${x + 18}" y="534" font-family="${MONO}" font-size="30" font-weight="500" letter-spacing="-1.4" fill="${m.c}">${m.v}</text>
  <text x="${x + 18}" y="556" font-family="${MONO}" font-size="10" letter-spacing="1.6" fill="${C.fg4}">${m.l}</text>`;
    })
    .join('')}

  <text x="${W - 64}" y="556" text-anchor="end" font-family="${MONO}" font-size="11" letter-spacing="1.4" fill="${C.fg4}">SOUTH AFRICA · CANADA · AUSTRALIA</text>
</svg>`;

const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');
await mkdir(out, { recursive: true });

const file = join(out, 'og-default.png');
await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(file);

const meta = await sharp(file).metadata();
console.log(`og-default.png written: ${meta.width}x${meta.height}, ${meta.size} bytes`);
