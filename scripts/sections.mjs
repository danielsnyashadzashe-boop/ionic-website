import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile, mkdir, stat } from 'node:fs/promises';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', '.shots');
const PORT = 8232;
const MIME = { '.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.png':'image/png','.woff2':'font/woff2','.xml':'application/xml','.txt':'text/plain' };

const server = createServer(async (req,res) => {
  try {
    const path = decodeURIComponent((req.url ?? '/').split('?')[0]);
    let file = join(ROOT, path);
    try { if ((await stat(file)).isDirectory()) file = join(file,'index.html'); }
    catch { file = join(ROOT, path, 'index.html'); }
    const body = await readFile(file);
    res.writeHead(200,{'Content-Type': MIME[extname(file)] ?? 'application/octet-stream'});
    res.end(body);
  } catch { res.writeHead(404).end('nf'); }
});
await new Promise(r => server.listen(PORT, r));
await mkdir(OUT,{recursive:true});

const browser = await chromium.launch();
const targets = [['#platforms','platforms'],['#impact','impact'],['#work','work'],['#contact','contact-sec']];

for (const theme of ['light','dark']) {
  const ctx = await browser.newContext({ viewport:{width:1440,height:1000}, colorScheme: theme });
  const page = await ctx.newPage();
  await page.goto(`http://localhost:${PORT}/`, { waitUntil:'networkidle' });
  // scroll through so islands hydrate and reveals fire
  for (let y = 0; y < 12; y++) { await page.mouse.wheel(0, 900); await page.waitForTimeout(220); }
  await page.waitForTimeout(2200);
  for (const [sel,name] of targets) {
    const el = await page.$(sel);
    if (!el) { console.log('missing', sel); continue; }
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(900);
    await el.screenshot({ path: join(OUT, `${name}-${theme}.png`) });
  }
  await ctx.close();
}
await browser.close(); server.close();
console.log('section shots done');
