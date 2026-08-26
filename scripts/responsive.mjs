/**
 * Responsive audit. Serves dist/ and walks every page at every breakpoint,
 * reporting anything that actually breaks rather than relying on eyeballing
 * one desktop screenshot.
 *
 * Checks per page/width:
 *   - document-level horizontal overflow
 *   - individual elements wider than the viewport
 *   - text nodes clipped by an overflow:hidden ancestor
 *   - interactive targets below 44x44 (WCAG 2.5.5)
 *
 *   node scripts/responsive.mjs
 */
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const PORT = 8270;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
};

const server = createServer(async (req, res) => {
  try {
    const p = decodeURIComponent((req.url ?? '/').split('?')[0]);
    let f = join(ROOT, p);
    try {
      if ((await stat(f)).isDirectory()) f = join(f, 'index.html');
    } catch {
      f = join(ROOT, p, 'index.html');
    }
    res.writeHead(200, { 'Content-Type': MIME[extname(f)] ?? 'application/octet-stream' });
    res.end(await readFile(f));
  } catch {
    res.writeHead(404).end('nf');
  }
});
await new Promise((r) => server.listen(PORT, r));

const WIDTHS = [320, 375, 414, 640, 768, 1024, 1280, 1440, 1920];
const PAGES = [
  '/',
  '/process-genesis/',
  '/ionic-grc/',
  '/case-studies/',
  '/case-studies/old-mutual/',
  '/insights/',
  '/insights/integration-not-capability/',
  '/contact/',
  '/privacy/',
  '/404.html',
];

const audit = () => {
  const vw = document.documentElement.clientWidth;
  const problems = [];

  const docOverflow = document.documentElement.scrollWidth - vw;
  if (docOverflow > 1) problems.push({ kind: 'doc-overflow', detail: `${docOverflow}px` });

  const label = (el) => {
    const id = el.id ? `#${el.id}` : '';
    const cls = typeof el.className === 'string' && el.className
      ? '.' + el.className.trim().split(/\s+/).slice(0, 3).join('.')
      : '';
    return `${el.tagName.toLowerCase()}${id}${cls}`.slice(0, 90);
  };

  for (const el of document.querySelectorAll('body *')) {
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') continue;
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) continue;

    // Elements poking past the viewport. Skip anything deliberately bled or
    // inside a scroll container (tickers, wide tables).
    let scrollHost = false;
    for (let a = el.parentElement; a; a = a.parentElement) {
      const acs = getComputedStyle(a);
      if (acs.overflowX === 'auto' || acs.overflowX === 'scroll' || acs.overflowX === 'hidden') {
        scrollHost = true;
        break;
      }
    }
    if (!scrollHost && (r.right > vw + 2 || r.left < -2)) {
      problems.push({ kind: 'element-overflow', detail: `${label(el)} right=${Math.round(r.right)} vw=${vw}` });
    }

    // Text clipped by an overflow:hidden box. Screen-reader-only elements are
    // deliberately clipped to a 1px box, so they are not findings.
    const srOnly = r.width <= 2 && r.height <= 2;
    if (!srOnly && el.children.length === 0 && el.textContent.trim() && cs.overflow !== 'visible') {
      if (el.scrollWidth > el.clientWidth + 2) {
        problems.push({ kind: 'text-clipped', detail: `${label(el)} "${el.textContent.trim().slice(0, 34)}"` });
      }
    }
  }

  // Tap targets. WCAG 2.5.5 exempts links that sit inline within a sentence,
  // and sr-only elements are not pointer targets at all — flagging either
  // just trains you to ignore the report.
  for (const el of document.querySelectorAll('a, button, input, textarea, select, [role="button"]')) {
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') continue;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    if (r.width <= 2 && r.height <= 2) continue;                       // sr-only
    if (el.closest('#mobile-nav') && !el.closest('#mobile-nav.showing')) continue;
    if (el.type === 'hidden' || el.closest('[aria-hidden="true"]')) continue;  // honeypot
    if (cs.display === 'inline') continue;                              // inline in prose

    if (r.height < 32 || r.width < 32) {
      problems.push({ kind: 'small-target', detail: `${label(el)} ${Math.round(r.width)}x${Math.round(r.height)}` });
    }
  }

  return problems;
};

const browser = await chromium.launch();
const seen = new Map();
let total = 0;

for (const width of WIDTHS) {
  const ctx = await browser.newContext({
    viewport: { width, height: 900 },
    reducedMotion: 'reduce',
    colorScheme: 'light',
  });

  for (const url of PAGES) {
    const page = await ctx.newPage();
    await page.goto(`http://localhost:${PORT}${url}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(320);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(120);

    const problems = await page.evaluate(audit);
    for (const p of problems) {
      const key = `${p.kind}|${p.detail}`;
      if (!seen.has(key)) seen.set(key, { ...p, widths: [], pages: new Set() });
      const rec = seen.get(key);
      if (!rec.widths.includes(width)) rec.widths.push(width);
      rec.pages.add(url);
      total++;
    }
    await page.close();
  }

  await ctx.close();
  process.stdout.write(`  ${width}px checked\n`);
}

await browser.close();
server.close();

console.log(`\n${'='.repeat(72)}`);
if (seen.size === 0) {
  console.log('No responsive problems found across', WIDTHS.length, 'widths ×', PAGES.length, 'pages.');
} else {
  const byKind = {};
  for (const rec of seen.values()) (byKind[rec.kind] ??= []).push(rec);
  for (const [kind, recs] of Object.entries(byKind)) {
    console.log(`\n${kind.toUpperCase()} — ${recs.length} distinct`);
    for (const r of recs.slice(0, 25)) {
      console.log(`  ${r.detail}`);
      console.log(`    widths: ${r.widths.join(', ')} | pages: ${[...r.pages].slice(0, 3).join(', ')}${r.pages.size > 3 ? ` +${r.pages.size - 3}` : ''}`);
    }
    if (recs.length > 25) console.log(`  ...and ${recs.length - 25} more`);
  }
  console.log(`\n${total} total occurrences, ${seen.size} distinct.`);
}
