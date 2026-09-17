/**
 * Hover-state contrast audit.
 *
 * Hovers every interactive element on every page, in both themes, and
 * measures the WCAG contrast of its text against whatever is actually behind
 * it after the hover transition settles. Catches the class of bug where a
 * panel floods with an ink and the text on it stays the same colour.
 *
 *   node scripts/hover.mjs
 */
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const PORT = 8290;
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
    // Read BEFORE writing the header. Writing 200 first meant any missing
    // file threw inside the catch (headers already sent), which took the
    // whole process down instead of serving a 404.
    const body = await readFile(f);
    res.writeHead(200, { 'Content-Type': MIME[extname(f)] ?? 'application/octet-stream' });
    res.end(body);
  } catch {
    if (!res.headersSent) res.writeHead(404);
    res.end('nf');
  }
});
await new Promise((r) => server.listen(PORT, r));

const PAGES = [
  '/compass/',
  '/', '/process-genesis/', '/ionic-grc/', '/case-studies/',
  '/case-studies/old-mutual/', '/insights/', '/contact/', '/404.html',
];

/** Injected: contrast helpers + a screen-space colour resolver. */
const HELPERS = () => {
  window.__lum = (rgb) => {
    const [r, g, b] = rgb.map((v) => {
      const c = v / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  /**
   * Resolve ANY colour the browser will accept, not just `rgb()`.
   *
   * This used to regex for `rgba?(...)` and return null otherwise. Once the
   * palette started using `color-mix()`, Chromium began reporting computed
   * values as `oklab(...)`, the regex missed, and the audit reported three
   * perfectly readable buttons as 1.00:1. A checker that invents failures
   * gets ignored, which is worse than not running it.
   *
   * Painting onto a 1x1 canvas hands the conversion to the browser, so every
   * present and future colour syntax resolves correctly.
   */
  window.__parse = (() => {
    const cv = document.createElement('canvas');
    cv.width = cv.height = 1;
    const ctx = cv.getContext('2d', { willReadFrequently: true });
    return (str) => {
      if (!str) return null;
      if (str === 'transparent') return { rgb: [0, 0, 0], a: 0 };
      ctx.clearRect(0, 0, 1, 1);
      // An unparseable value leaves fillStyle untouched, so seed a sentinel
      // and treat "unchanged" as a parse failure rather than a real colour.
      ctx.fillStyle = '#010203';
      ctx.fillStyle = str;
      if (ctx.fillStyle === '#010203' && !/^#010203$/i.test(str.trim())) return null;
      ctx.fillRect(0, 0, 1, 1);
      const d = ctx.getImageData(0, 0, 1, 1).data;
      return { rgb: [d[0], d[1], d[2]], a: d[3] / 255 };
    };
  })();
  window.__over = (fg, bg) => fg.rgb.map((c, i) => c * fg.a + bg[i] * (1 - fg.a));
  /** Walk ancestors compositing backgrounds until opaque. */
  window.__bgOf = (el) => {
    let stack = [];
    for (let n = el; n && n !== document.documentElement; n = n.parentElement) {
      const cs = getComputedStyle(n);
      const bg = window.__parse(cs.backgroundColor);
      if (bg && bg.a > 0) {
        stack.push(bg);
        if (bg.a >= 0.999) break;
      }
      // A ::before flood plane counts as the background for this purpose.
      const before = getComputedStyle(n, '::before');
      const bbg = window.__parse(before.backgroundColor);
      if (bbg && bbg.a > 0.999 && before.content !== 'none') {
        const tf = before.transform;
        // Only count it if it is not translated off-box.
        if (!tf || tf === 'none' || !/matrix/.test(tf) || !/,\s*[1-9]\d*(\.\d+)?\)$/.test(tf)) {
          stack.push(bbg);
          break;
        }
      }
    }
    let base = [255, 255, 255];
    for (let i = stack.length - 1; i >= 0; i--) base = window.__over(stack[i], base);
    return base;
  };
  window.__ratio = (el) => {
    const cs = getComputedStyle(el);
    const fg = window.__parse(cs.color);
    if (!fg) return null;
    const bg = window.__bgOf(el);
    const f = window.__over(fg, bg);
    const l1 = window.__lum(f), l2 = window.__lum(bg);
    const hi = Math.max(l1, l2), lo = Math.min(l1, l2);
    return (hi + 0.05) / (lo + 0.05);
  };
  window.__label = (el) => {
    const id = el.id ? `#${el.id}` : '';
    const cls = typeof el.className === 'string' && el.className
      ? '.' + el.className.trim().split(/\s+/).filter((c) => !c.startsWith('hover:')).slice(0, 3).join('.')
      : '';
    return `${el.tagName.toLowerCase()}${id}${cls}`.slice(0, 74);
  };
};

const browser = await chromium.launch();
const findings = new Map();

for (const theme of ['light', 'dark']) {
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce',
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
    await page.addInitScript(HELPERS);
    await page.evaluate(HELPERS);
    // Bring lazy islands in.
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(700);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(250);

    const targets = await page.$$('a, button, [role="button"]');

    for (const el of targets) {
      try {
        const meta = await el.evaluate((n) => {
          const r = n.getBoundingClientRect();
          const cs = getComputedStyle(n);
          if (cs.display === 'none' || cs.visibility === 'hidden') return null;
          if (r.width < 4 || r.height < 4) return null;
          if (!n.textContent.trim()) return null;
          return { label: window.__label(n), text: n.textContent.trim().slice(0, 30) };
        });
        if (!meta) continue;

        await el.scrollIntoViewIfNeeded({ timeout: 1500 });
        const before = await el.evaluate((n) => window.__ratio(n));
        await el.hover({ timeout: 1500, force: true });
        await page.waitForTimeout(680); // let the flood/transition finish
        const after = await el.evaluate((n) => window.__ratio(n));

        if (after == null || before == null) continue;

        // Text that becomes hard to read on hover, or was already poor.
        const problem =
          after < 4.5
            ? { why: after < 3 ? 'unreadable on hover' : 'below AA on hover', ratio: after }
            : before < 4.5
              ? { why: 'below AA at rest', ratio: before }
              : null;

        if (problem) {
          const key = `${meta.label}|${problem.why}`;
          if (!findings.has(key)) {
            findings.set(key, { ...meta, ...problem, before, after, themes: new Set(), pages: new Set() });
          }
          const rec = findings.get(key);
          rec.themes.add(theme);
          rec.pages.add(url);
        }
      } catch { /* element detached or off-screen; skip */ }
    }

    await page.close();
  }

  await ctx.close();
  process.stdout.write(`  ${theme} theme checked\n`);
}

await browser.close();
server.close();

console.log(`\n${'='.repeat(74)}`);
if (findings.size === 0) {
  console.log('All hover states keep their text at AA (4.5:1) or better, both themes.');
} else {
  const list = [...findings.values()].sort((a, b) => a.ratio - b.ratio);
  for (const f of list) {
    console.log(`\n${f.why.toUpperCase()}  ${f.ratio.toFixed(2)}:1`);
    console.log(`  ${f.label}`);
    console.log(`  "${f.text}"  rest ${f.before.toFixed(2)} -> hover ${f.after.toFixed(2)}`);
    console.log(`  themes: ${[...f.themes].join(', ')} | pages: ${[...f.pages].slice(0, 3).join(', ')}`);
  }
  console.log(`\n${findings.size} distinct problems.`);
}
