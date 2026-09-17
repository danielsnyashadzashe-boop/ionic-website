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
  // These had drifted badly: a charcoal ground and a cyan accent, from two
  // palettes ago. The card is the first thing anyone sees when the site is
  // shared, so it looking like a different product is worse than most bugs.
  base: '#0b2334',
  raised: '#102b3f',
  panel: '#15334a',
  rule: '#24384a',
  fg: '#F2F5F6',
  fg3: '#b9c4c8',
  fg4: '#93a1a6',
  primary: '#cdd7da',
  d1: '#8fb4c9',
  d3: '#9fc7b4',
  d4: '#d8c48a',
  /** Brand yellow, matching --accent-warm and the logo. */
  yellow: '#FFC20E',
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

  <!-- Mark + wordmark. This drew the old invented arc-and-arrowhead, which
       meant every LinkedIn and Slack share carried a logo the company does
       not use. Same geometry as Logo.astro, in the card's coordinates. -->
  <g transform="translate(64,40) scale(0.52)">
    <path d="M 46.5 10.2 A 40 40 0 1 0 80.6 75.7" fill="none" stroke="${C.fg}" stroke-width="7.5" stroke-linecap="round"/>
    <path d="M 60.4 11.4 A 40 40 0 0 1 88.6 60.4" fill="none" stroke="${C.yellow}" stroke-width="7.5" stroke-linecap="round"/>
    <circle cx="38.5" cy="31" r="7" fill="${C.yellow}"/>
    <path d="M 32.5 43 L 44.5 43 L 44.5 74 L 32.5 74 Z" fill="${C.fg}"/>
    <path d="M 48.5 74 L 48.5 52 Q 48.5 42 57 42 Q 62 42 64.5 47 L 74 66 L 74 44"
          fill="none" stroke="${C.fg}" stroke-width="11.5" stroke-linejoin="round" stroke-linecap="round"/>
  </g>
  <text x="124" y="72" font-family="${SANS}" font-size="26" font-weight="700" letter-spacing="0.5" fill="${C.fg}">IONIC</text>
  <text x="125" y="90" font-family="${MONO}" font-size="11" font-weight="600" letter-spacing="5" fill="${C.yellow}">INNOVATE</text>

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
