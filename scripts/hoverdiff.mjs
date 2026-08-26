/**
 * Dead-hover detector.
 *
 * Contrast checks catch text that becomes unreadable on hover. They do not
 * catch the other failure: an element that advertises a hover state and then
 * does nothing visible. This screenshots each interactive element before and
 * after hover and compares the pixels.
 *
 *   node scripts/hoverdiff.mjs
 */
import { chromium } from 'playwright';
import sharp from 'sharp';
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const PORT = 8293;
const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2',
  '.xml': 'application/xml', '.txt': 'text/plain',
};

const server = createServer(async (req, res) => {
  try {
    const p = decodeURIComponent((req.url ?? '/').split('?')[0]);
    let f = join(ROOT, p);
    try { if ((await stat(f)).isDirectory()) f = join(f, 'index.html'); }
    catch { f = join(ROOT, p, 'index.html'); }
    res.writeHead(200, { 'Content-Type': MIME[extname(f)] ?? 'application/octet-stream' });
    res.end(await readFile(f));
  } catch { res.writeHead(404).end('nf'); }
});
await new Promise((r) => server.listen(PORT, r));

const PAGES = ['/', '/process-genesis/', '/case-studies/', '/insights/', '/contact/', '/404.html'];

/** Fraction of pixels that differ by more than a just-noticeable amount. */
const diffRatio = async (a, b) => {
  const [ra, rb] = await Promise.all([
    sharp(a).resize(160, 60, { fit: 'fill' }).removeAlpha().raw().toBuffer(),
    sharp(b).resize(160, 60, { fit: 'fill' }).removeAlpha().raw().toBuffer(),
  ]);
  let changed = 0;
  const px = ra.length / 3;
  for (let i = 0; i < ra.length; i += 3) {
    const d = Math.abs(ra[i] - rb[i]) + Math.abs(ra[i + 1] - rb[i + 1]) + Math.abs(ra[i + 2] - rb[i + 2]);
    if (d > 12) changed++;
  }
  return changed / px;
};

const browser = await chromium.launch();
const dead = new Map();
let checked = 0;

for (const theme of ['light', 'dark']) {
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'no-preference',
  });

  for (const url of PAGES) {
    const page = await ctx.newPage();
    await page.goto(`http://localhost:${PORT}${url}`, { waitUntil: 'networkidle' });
    // Dark is the default; the light theme is a class on <html>.
    await page.evaluate((t) => {
      document.documentElement.classList.toggle('light', t === 'light');
      try { localStorage.setItem('ionic-theme', t); } catch {}
    }, theme);
    await page.waitForTimeout(220);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(700);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(250);

    const els = await page.$$('a, button, [role="button"]');

    for (const el of els) {
      try {
        const meta = await el.evaluate((n) => {
          const cs = getComputedStyle(n);
          const r = n.getBoundingClientRect();
          if (cs.display === 'none' || cs.visibility === 'hidden') return null;
          if (r.width < 24 || r.height < 12) return null;
          if (!n.textContent.trim()) return null;
          if (n.closest('[aria-hidden="true"]')) return null;
          const id = n.id ? `#${n.id}` : '';
          const cls = typeof n.className === 'string' && n.className
            ? '.' + n.className.trim().split(/\s+/).slice(0, 3).join('.') : '';
          return { label: `${n.tagName.toLowerCase()}${id}${cls}`.slice(0, 70), text: n.textContent.trim().slice(0, 26) };
        });
        if (!meta) continue;

        await el.scrollIntoViewIfNeeded({ timeout: 1200 });
        await page.mouse.move(2, 2);
        await page.waitForTimeout(240);
        const rest = await el.screenshot({ timeout: 2000 });

        await el.hover({ timeout: 1200, force: true });
        await page.waitForTimeout(760);
        const hot = await el.screenshot({ timeout: 2000 });

        checked++;
        const ratio = await diffRatio(rest, hot);
        if (ratio < 0.01) {
          const key = `${meta.label}|${meta.text}`;
          if (!dead.has(key)) dead.set(key, { ...meta, ratio, themes: new Set(), pages: new Set() });
          const rec = dead.get(key);
          rec.themes.add(theme);
          rec.pages.add(url);
        }
      } catch { /* detached or unhoverable */ }
    }
    await page.close();
  }
  await ctx.close();
  process.stdout.write(`  ${theme} theme checked\n`);
}

await browser.close();
server.close();

console.log(`\n${'='.repeat(74)}`);
console.log(`${checked} hover interactions sampled.`);
if (dead.size === 0) {
  console.log('Every interactive element changes visibly on hover.');
} else {
  console.log(`\n${dead.size} element(s) with no visible hover change:\n`);
  for (const d of dead.values()) {
    console.log(`  ${d.label}`);
    console.log(`    "${d.text}"  changed ${(d.ratio * 100).toFixed(2)}% of pixels`);
    console.log(`    themes: ${[...d.themes].join(', ')} | pages: ${[...d.pages].slice(0, 3).join(', ')}`);
  }
}
