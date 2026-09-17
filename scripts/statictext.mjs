/**
 * Static text contrast audit.
 *
 * The hover audit only visits interactive elements, so plain text was never
 * checked. That gap mattered the moment section eyebrows went from grey to a
 * warm accent: yellow at 11px is the easiest thing on a page to get wrong.
 *
 *   node scripts/statictext.mjs
 */
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const PORT = 8494;
const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.webp': 'image/webp', '.avif': 'image/avif', '.woff2': 'font/woff2', '.xml': 'application/xml',
};

const server = createServer(async (req, res) => {
  try {
    const p = decodeURIComponent((req.url ?? '/').split('?')[0]);
    let f = join(ROOT, p);
    try { if ((await stat(f)).isDirectory()) f = join(f, 'index.html'); }
    catch { f = join(ROOT, p, 'index.html'); }
    const body = await readFile(f);
    res.writeHead(200, { 'Content-Type': MIME[extname(f)] ?? 'application/octet-stream' });
    res.end(body);
  } catch {
    if (!res.headersSent) res.writeHead(404);
    res.end('nf');
  }
});
await new Promise((r) => server.listen(PORT, r));

const PAGES = ['/', '/process-genesis/', '/case-studies/', '/insights/', '/contact/'];

const CHECK = () => {
  const cv = document.createElement('canvas');
  cv.width = cv.height = 1;
  const cx = cv.getContext('2d', { willReadFrequently: true });
  const rgb = (s) => {
    cx.clearRect(0, 0, 1, 1);
    cx.fillStyle = '#010203';
    cx.fillStyle = s;
    cx.fillRect(0, 0, 1, 1);
    const d = cx.getImageData(0, 0, 1, 1).data;
    return { c: [d[0], d[1], d[2]], a: d[3] / 255 };
  };
  const lum = (c) => {
    const [r, g, b] = c.map((v) => {
      const x = v / 255;
      return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const bgOf = (el) => {
    let n = el, out = [255, 255, 255];
    while (n) {
      const p = rgb(getComputedStyle(n).backgroundColor);
      if (p.a > 0.95) { out = p.c; break; }
      n = n.parentElement;
    }
    return out;
  };

  const bad = [];
  const seen = new Set();
  for (const el of document.querySelectorAll('p, span, li, dt, dd, h1, h2, h3, h4, a, small')) {
    const txt = (el.childNodes.length && [...el.childNodes]
      .filter((n) => n.nodeType === 3).map((n) => n.textContent.trim()).join(' ').trim()) || '';
    if (!txt) continue;
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) continue;
    // Decorative by declaration: separators, arrows, the trailing slash.
    if (el.closest('[aria-hidden="true"]')) continue;

    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.opacity === '0') continue;

    const bg = bgOf(el);

    /**
     * Gradient-filled text paints through `background-clip: text`, so its
     * `color` is transparent and a naive read scores it 1:1. Check the
     * gradient's own stops instead, worst one wins.
     */
    const clip = cs.backgroundClip || cs.webkitBackgroundClip;
    let candidates;
    if (clip === 'text') {
      const stops = (cs.backgroundImage.match(/(?:rgba?|oklab|oklch|color)\([^)]*\)|#[0-9a-f]{3,8}/gi) ?? []);
      candidates = stops.map((s) => rgb(s)).filter((s) => s.a > 0);
      if (!candidates.length) continue;
    } else {
      candidates = [rgb(cs.color)];
    }

    let ratio = Infinity;
    for (const fg of candidates) {
      const composited = fg.c.map((c, i) => c * fg.a + bg[i] * (1 - fg.a));
      const l1 = lum(composited), l2 = lum(bg);
      ratio = Math.min(ratio, (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05));
    }

    const px = parseFloat(cs.fontSize);
    const bold = parseInt(cs.fontWeight, 10) >= 700;
    const large = px >= 24 || (bold && px >= 18.66);
    const need = large ? 3 : 4.5;

    if (ratio < need) {
      const key = `${el.className}|${txt.slice(0, 20)}`;
      if (seen.has(key)) continue;
      seen.add(key);
      bad.push({ txt: txt.slice(0, 34), cls: el.className.toString().slice(0, 42),
                 ratio: +ratio.toFixed(2), need, px: Math.round(px) });
    }
  }
  return bad;
};

const browser = await chromium.launch();
const problems = [];

for (const theme of ['dark', 'light']) {
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    colorScheme: theme === 'light' ? 'light' : 'dark',
    reducedMotion: 'reduce',
  });
  if (theme === 'light') {
    await ctx.addInitScript(() => { try { localStorage.setItem('ionic-theme', 'light'); } catch {} });
  }
  const page = await ctx.newPage();
  for (const url of PAGES) {
    await page.goto(`http://localhost:${PORT}${url}`, { waitUntil: 'load' });
    await page.waitForTimeout(700);
    for (const b of await page.evaluate(CHECK)) problems.push({ ...b, theme, url });
  }
  console.log(`  ${theme} theme checked`);
  await ctx.close();
}

console.log('\n' + '='.repeat(74));
if (!problems.length) {
  console.log('All static text meets AA for its size, both themes.');
} else {
  const byKey = new Map();
  for (const p of problems) {
    const k = `${p.cls}|${p.txt}`;
    if (!byKey.has(k)) byKey.set(k, { ...p, themes: new Set(), urls: new Set() });
    byKey.get(k).themes.add(p.theme);
    byKey.get(k).urls.add(p.url);
  }
  for (const v of byKey.values()) {
    console.log(`\nBELOW AA  ${v.ratio}:1 (needs ${v.need}, ${v.px}px)`);
    console.log(`  ${v.cls}`);
    console.log(`  "${v.txt}"`);
    console.log(`  themes: ${[...v.themes].join(', ')} | pages: ${[...v.urls].join(', ')}`);
  }
  console.log(`\n${byKey.size} distinct problems.`);
}

await browser.close();
server.close();
process.exit(problems.length ? 1 : 0);
