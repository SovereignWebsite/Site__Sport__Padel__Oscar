// Takes the first-screen pictures of each design (390 x 844, device scale 1, JPEG q70), light and dark.
//   node docs/keeper/build/shoot.mjs   (from the repository root, after make.mjs)
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, extname } from 'node:path';
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
const root = 'site', types = { '.html': 'text/html', '.css': 'text/css', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.json': 'application/json' };
const srv = createServer((q, r) => { let p = join(root, decodeURI(q.url.split('?')[0])); if (existsSync(p) && statSync(p).isDirectory()) p = join(p, 'index.html'); if (!existsSync(p)) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'content-type': types[extname(p)] || 'application/octet-stream' }); r.end(readFileSync(p)); }).listen(0);
const port = srv.address().port;
mkdirSync('site/assets/designs', { recursive: true });
const b = await chromium.launch();
for (const dark of [false, true]) {
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, colorScheme: dark ? 'dark' : 'light' });
  const pg = await ctx.newPage();
  for (let n = 1; n <= 5; n++) {
    await pg.goto(`http://127.0.0.1:${port}${n === 1 ? '/' : `/d/${n}/`}`);
    const buf = await pg.screenshot({ type: 'jpeg', quality: 70 });
    writeFileSync(`site/assets/designs/d${n}${dark ? '-dark' : ''}.jpg`, buf);
    console.log(n, dark ? 'dark' : 'light', buf.length);
  }
  await ctx.close();
}
await b.close(); srv.close();
