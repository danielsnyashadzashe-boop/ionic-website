/**
 * Screenshot harness. Serves dist/ and captures each page in both themes,
 * so a visual change can actually be reviewed rather than assumed.
 *
 *   node scripts/shots.mjs [outDir]
 */
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile, mkdir, stat } from 'node:fs/promises';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const OUT = process.argv[2] ?? join(dirname(fileURLToPath(import.meta.url)), '..', '.shots');
const PORT = 8231;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
};

const server = createServer(async (req, res) => {
  try {
    let path = decodeURIComponent((req.url ?? '/').split('?')[0]);
    let file = join(ROOT, path);

    try {
      if ((await stat(file)).isDirectory()) file = join(file, 'index.html');
    } catch {
      file = join(ROOT, path, 'index.html');
    }

    const body = await readFile(file);
    res.writeHead(200, { 'Content-Type': MIME[extname(file)] ?? 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404).end('not found');
  }
});

await new Promise((r) => server.listen(PORT, r));
await mkdir(OUT, { recursive: true });

const pages = [
  ['home', '/'],
  ['product', '/process-genesis/'],
  ['product-grc', '/ionic-grc/'],
  ['case-studies', '/case-studies/'],
  ['case-study', '/case-studies/old-mutual/'],
  ['insights', '/insights/'],
  ['contact', '/contact/'],
];

const browser = await chromium.launch();

for (const theme of ['light', 'dark']) {
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 1,
    colorScheme: theme,
    reducedMotion: 'reduce', // capture end-states, not mid-animation
  });

  for (const [name, url] of pages) {
    const page = await ctx.newPage();
    await page.goto(`http://localhost:${PORT}${url}`, { waitUntil: 'networkidle' });
    // Let charts finish mounting and reveal states settle.
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(900);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(400);

    await page.screenshot({ path: join(OUT, `${name}-${theme}.png`) });
    if (name === 'home') {
      await page.screenshot({ path: join(OUT, `home-full-${theme}.png`), fullPage: true });
    }
    await page.close();
  }

  await ctx.close();
}

// Device sweep
for (const [name, width, height] of [['mobile', 390, 844], ['tablet', 834, 1112]]) {
  for (const theme of ['light', 'dark']) {
    const ctx = await browser.newContext({
      viewport: { width, height },
      colorScheme: theme,
      reducedMotion: 'reduce',
    });
    for (const [label, url] of [['home', '/'], ['product', '/process-genesis/'], ['work', '/#work']]) {
      const page = await ctx.newPage();
      await page.goto(`http://localhost:${PORT}${url}`, { waitUntil: 'networkidle' });
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(500);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(300);
      await page.screenshot({ path: join(OUT, `${name}-${label}-${theme}.png`) });
      await page.close();
    }
    await ctx.close();
  }
}

await browser.close();
server.close();
console.log(`screenshots written to ${OUT}`);
