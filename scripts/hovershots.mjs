/**
 * Captures each interactive component in its hovered state so hover styling
 * can actually be reviewed instead of reasoned about.
 */
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile, mkdir, stat } from 'node:fs/promises';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT=join(dirname(fileURLToPath(import.meta.url)),'..','dist');
const OUT=join(dirname(fileURLToPath(import.meta.url)),'..','.shots','hover');
const MIME={'.html':'text/html','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.png':'image/png','.woff2':'font/woff2','.xml':'application/xml','.txt':'text/plain'};
const server=createServer(async(req,res)=>{try{const p=decodeURIComponent((req.url??'/').split('?')[0]);let f=join(ROOT,p);try{if((await stat(f)).isDirectory())f=join(f,'index.html');}catch{f=join(ROOT,p,'index.html');}res.writeHead(200,{'Content-Type':MIME[extname(f)]??'application/octet-stream'});res.end(await readFile(f));}catch{res.writeHead(404).end('nf');}});
await new Promise(r=>server.listen(8291,r));
await mkdir(OUT,{recursive:true});

const CASES=[
  ['product-row','/', '#platforms a[href="/expenseflow/"]', 'crop'],
  ['product-row-plum','/', '#platforms a[href="/ionic-grc/"]', 'crop'],
  ['project-row','/', '.p-row a.flood', 'crop'],
  ['case-card','/', 'a.flood.border', 'crop'],
  ['btn','/', 'a.btn', 'self'],
  ['btn-line','/', 'a.btn-line', 'self'],
  ['nav-link','/', 'nav a[href="/case-studies/"]', 'header'],
  ['header-cta','/', 'a[href="/contact/"].hidden', 'header'],
  ['dropdown','/', '#dd-trigger', 'header'],
  ['filter-chip','/', '.chip-f:nth-of-type(2)', 'crop'],
  ['footer-link','/', 'footer a[href="/expenseflow/"]', 'crop'],
  ['footer-email','/', 'footer a[href^="mailto:"]', 'crop'],
  ['methodology','/', '#impact a[href="/contact/"]', 'crop'],
];

const b=await chromium.launch();
for (const theme of ['light','dark']) {
  const ctx=await b.newContext({viewport:{width:1440,height:900},colorScheme:theme,reducedMotion:'no-preference'});
  for (const [name,url,sel,frame] of CASES) {
    const page=await ctx.newPage();
    await page.goto(`http://localhost:8291${url}`,{waitUntil:'networkidle'});
    await page.evaluate(()=>window.scrollTo(0,document.body.scrollHeight));
    await page.waitForTimeout(800);
    await page.evaluate(()=>window.scrollTo(0,0));
    await page.waitForTimeout(300);
    const el=await page.$(sel);
    if(!el){console.log('MISSING',name,sel);await page.close();continue;}
    if (name==='dropdown') { await el.click(); await page.waitForTimeout(500); }
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(250);
    await el.hover({force:true});
    await page.waitForTimeout(900);
    let shot=el;
    if(frame==='header'){ const h=await page.$('header'); shot=h||el; }
    // Box must be read AFTER hover, since some rows change height.
    const box=await el.boundingBox();
    if (frame==='header') { await shot.screenshot({path:join(OUT,`${name}-${theme}.png`)}); }
    else {
      const pad=14;
      await page.screenshot({path:join(OUT,`${name}-${theme}.png`),clip:{
        x:Math.max(0,box.x-pad), y:Math.max(0,box.y-pad),
        width:Math.min(1440-Math.max(0,box.x-pad), box.width+pad*2),
        height:Math.min(900-Math.max(0,box.y-pad), box.height+pad*2)}});
    }
    await page.close();
  }
  await ctx.close();
  console.log(theme,'done');
}
await b.close(); server.close();
console.log('hover shots ->',OUT);
