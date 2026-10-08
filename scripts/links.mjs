/**
 * Every link on the site, followed.
 *
 *   node scripts/links.mjs            # against dist, on a local server
 *   node scripts/links.mjs <base-url> # against a deployment
 *
 * Three things this checks that a file-existence crawler does not:
 *
 *   1. Fragments. A link to /#work is only good if #work is on that page.
 *      The crawler this replaces skipped anything with a hash, so every
 *      anchor on the site was unverified.
 *   2. Links that are not in the HTML. The search palette, the mobile
 *      sheet, and the result screens of both the preview and the
 *      discovery pass are built by JavaScript after an interaction, so
 *      they never appear to a crawler reading the served markup.
 *   3. External links, reported separately, because they are somebody
 *      else's uptime. LinkedIn answers automated requests with 999,
 *      which is an anti-bot code and not a dead page.
 */
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const PORT = 8497;
const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp',
  '.woff2': 'font/woff2', '.xml': 'application/xml', '.json': 'application/json',
  '.mp4': 'video/mp4', '.vtt': 'text/vtt', '.txt': 'text/plain', '.php': 'text/plain',
};

const PAGES = [
  '/', '/about/', '/services/', '/try-process-genesis/', '/ca/', '/za/',
  '/process-genesis/', '/tippa/', '/ionic-grc/', '/ionic-erp/', '/expenseflow/',
  '/contact/', '/privacy/', '/404.html',
];

let base = process.argv[2];
let server;
if (!base) {
  server = createServer(async (req, res) => {
    const p = decodeURIComponent((req.url ?? '/').split('?')[0]);
    for (const c of [join(ROOT, p, 'index.html'), join(ROOT, p)]) {
      try {
        if ((await stat(c)).isFile()) {
          res.writeHead(200, { 'content-type': MIME[extname(c)] ?? 'application/octet-stream' });
          res.end(await readFile(c));
          return;
        }
      } catch {}
    }
    res.writeHead(404, { 'content-type': 'text/html' });
    res.end('not found');
  });
  await new Promise((r) => server.listen(PORT, r));
  base = `http://localhost:${PORT}`;
}

const b = await chromium.launch();
const probe = await b.newPage();
const dest = new Map();
const problems = [];
const external = new Map();
let n = 0;

const check = async (href, where, from) => {
  if (!href) return;
  if (/^(mailto:|tel:|sms:|javascript:|#)$/i.test(href.trim())) return;
  if (/^(mailto:|tel:|sms:|javascript:)/i.test(href)) return;
  n++;
  if (/^https?:\/\//i.test(href)) {
    external.set(href, where);
    return;
  }
  const u = new URL(href, from);
  const path = u.pathname + u.search;
  if (!dest.has(path)) {
    const r = await probe.goto(base + path, { waitUntil: 'domcontentloaded' }).catch(() => null);
    const ids =
      r && r.ok()
        ? new Set(await probe.evaluate(() => [...document.querySelectorAll('[id]')].map((e) => e.id)))
        : new Set();
    dest.set(path, { status: r ? r.status() : 0, ids });
  }
  const d = dest.get(path);
  const frag = decodeURIComponent(u.hash.replace(/^#/, ''));
  if (d.status !== 200) problems.push(`${d.status || 'ERR'}  ${href}   (${where})`);
  else if (frag && !d.ids.has(frag)) problems.push(`#${frag} missing on ${u.pathname}   (${where})`);
};

const sweep = async (p, where) => {
  const from = p.url();
  for (const { h, t } of await p.evaluate(() =>
    [...document.querySelectorAll('a[href]')].map((a) => ({
      h: a.getAttribute('href'),
      t: (a.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 36),
    })),
  ))
    await check(h, `${where}: "${t}"`, from);
};

/* ── Every page as served ── */
for (const path of PAGES) {
  const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
  const r = await p.goto(base + path, { waitUntil: 'domcontentloaded' }).catch(() => null);
  if (!r || !r.ok()) problems.push(`${r ? r.status() : 'ERR'}  ${path} itself`);
  else await sweep(p, path);
  await p.close();
}

/* ── Links that only exist after an interaction ── */
{
  const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
  await p.goto(base + '/', { waitUntil: 'networkidle' });
  await p.keyboard.press('Control+k');
  await p.waitForTimeout(700);
  await sweep(p, 'search palette');
  await p.close();
}
{
  const p = await b.newPage({ viewport: { width: 390, height: 844 } });
  await p.goto(base + '/', { waitUntil: 'networkidle' });
  await p.locator('#burger').click();
  await p.waitForTimeout(700);
  await sweep(p, 'mobile menu');
  await p.close();
}
{
  const p = await b.newPage({ viewport: { width: 1280, height: 1000 } });
  await p.goto(base + '/try-process-genesis/', { waitUntil: 'networkidle' });
  const d = p.locator('[data-demo]');
  await d.scrollIntoViewIfNeeded();
  await d.locator('[data-go="process"]').click();
  await d.locator('[data-proc]').first().click();
  await d.locator('[data-go="numbers"]').click();
  await d.locator('[data-go="run"]').click();
  await d.locator('[data-step="result"]').waitFor({ state: 'visible', timeout: 25000 });
  await sweep(p, 'preview result');
  await p.close();
}
{
  const p = await b.newPage({ viewport: { width: 1280, height: 1000 } });
  await p.goto(base + '/process-genesis/', { waitUntil: 'networkidle' });
  const r = p.locator('[data-compass]');
  await r.scrollIntoViewIfNeeded();
  await r.locator('[data-goto="q1"]').click();
  for (let i = 1; i <= 4; i++) {
    const st = r.locator(`[data-stage="q${i}"]`);
    await st.waitFor({ state: 'visible' });
    await st.locator('[data-next]').click();
  }
  await r.locator('[data-stage="q5"]').waitFor({ state: 'visible' });
  await r.locator('[data-pain="slow"]').click();
  await r.locator('[data-finish]').click();
  await r.locator('[data-stage="result"]').waitFor({ state: 'visible', timeout: 15000 });
  await sweep(p, 'discovery pass result');
  await p.close();
}

await b.close();
server?.close();

console.log(`${PAGES.length} pages, ${n} links, ${dest.size} internal destinations`);
console.log('');
if (external.size) {
  console.log('External, not ours to guarantee:');
  for (const [u, where] of external) console.log(`  ${u}   (${where})`);
  console.log('');
}
if (!problems.length) {
  console.log('Every internal link resolves, and every fragment exists on the page it points at.');
} else {
  console.log(`${problems.length} problem(s):\n`);
  for (const p of problems) console.log('  ' + p);
  process.exitCode = 1;
}
