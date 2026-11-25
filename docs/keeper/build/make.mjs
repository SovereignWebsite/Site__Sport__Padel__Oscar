// Builds the pages of the site from site/data/coach.json, for every design.
//   node docs/keeper/build/make.mjs          (run from the repository root)
// Writes: site/index.html, site/interview/index.html (live, design 1),
//         site/d/N/index.html and site/d/N/interview/index.html (previews, N = 2..5), site/designs/index.html.
// The stylesheets in site/assets/ are written by hand. The thumbnails in site/assets/designs/ come from shoot.mjs.
// To reuse for another coach: replace site/data/coach.json and the photo; the rest follows.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const c = JSON.parse(readFileSync('site/data/coach.json', 'utf8'));
const S = c.site, P = c.coach, IG = P.instagram.url, photo = c.photos[0];
const TAKEN = '25 November 2026';
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const DESIGNS = [
  { n: 1, slug: 'court', name: 'Court', idea: 'A clean, photo-led page: who Oscar is, what he offers, one button.', best: 'Saying who Oscar is quickly, with his face first.', weak: 'The least surprising of the five.', dark: 'no',
    alt: 'Design 1, Court: a headline, a Message Oscar on Instagram button and the top of Oscar\'s photo.' },
  { n: 2, slug: 'scoreboard', name: 'Scoreboard', idea: 'Dark first, with big numbers and short lines, like a match scoreboard.', best: 'Standing out, and showing 10+ years at a glance.', weak: 'Photo is small; needs more facts to fill the tiles.', dark: 'yes',
    alt: 'Design 2, Scoreboard: dark screen with tiles for 10+ years, padel coach and personal trainer, and an Instagram button.' },
  { n: 3, slug: 'poster', name: 'Poster', idea: 'One big photo with the name across it and a single button.', best: 'The wow of a first impression on a phone.', weak: 'Needs better photos than the one we have; little room for text.', dark: 'no',
    alt: 'Design 3, Poster: Oscar\'s photo filling the screen, his name in large type and an Instagram button.' },
  { n: 4, slug: 'plain', name: 'Plain page', idea: 'Text first, serif, no decoration: it reads like a short letter and prints cleanly.', best: 'Speed, print, and people on slow phones.', weak: 'Looks like the least energetic of the five for a sports coach.', dark: 'no',
    alt: 'Design 4, Plain page: a serif headline and short text, with a link to message Oscar on Instagram.' },
  { n: 5, slug: 'cards', name: 'Drill cards', idea: 'Swipeable cards for each service and a button fixed at the bottom of the screen.', best: 'Phones: the main action is always one thumb away.', weak: 'Swiping hides the second and third card until you move.', dark: 'no',
    alt: 'Design 5, Drill cards: a headline, the first of three swipeable service cards, and a bar fixed at the bottom with an Instagram button.' }
];
const THUMB = { w: 117, h: 253 };

const path = (ctx, rest = '') => `${ctx.base}${rest}`;
const shot = (d, dark) => `/assets/designs/d${d.n}${dark ? '-dark' : ''}.jpg`;

function head(ctx, { title, desc, url }) {
  const full = `${S.url}${url}`, img = `${S.url}/assets/share/card-1200x630.jpg`;
  const css = ['theme', 'base', 'picker', ctx.n === 'designs' ? 'designs' : `d${ctx.n}`].map((f) => `<link rel="stylesheet" href="/assets/${f}.css">`).join('\n');
  return `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light dark">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
${ctx.live ? '' : '<meta name="robots" content="noindex">\n'}<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(S.name)}">
<meta property="og:locale" content="en_GB">
<meta property="og:url" content="${full}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${img}">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(S.name)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="twitter:image" content="${img}">
<link rel="canonical" href="${full}">
${css}
</head>`;
}

// The picker sits at the top of every page while the pick is open (a.design's standard).
function bar(ctx) {
  const cards = DESIGNS.map((d) => {
    const cur = d.n === ctx.n;
    const href = d.n === 1 ? '/' : `/d/${d.n}/`;
    return `<li><a class="pcard" href="${href}"${cur ? ' aria-current="page"' : ''}><img src="${shot(d)}" width="${THUMB.w}" height="${THUMB.h}" alt="${esc(d.alt)}" loading="lazy"><span class="pname">${d.n}. ${d.name}${d.n === 1 ? ' (Live)' : ''}</span><span class="pidea">${esc(d.idea)}</span></a></li>`;
  }).join('\n');
  const note = ctx.live || ctx.n === 0 ? '' : `\n  <p class="pnote">Preview: d${ctx.n}, ${DESIGNS[ctx.n - 1].name}. The live site uses d1. <a href="/designs/">Compare all designs</a></p>`;
  return `<aside class="pbar" aria-label="Design picker">
  <details class="picker">
    <summary>Choose a design</summary>
    <div class="ppanel">
      <ul>
${cards}
      </ul>
      <p><a class="pall" href="/designs/">Compare all designs</a></p>
    </div>
  </details>
  <details class="family-credit">
    <summary>Sovereign Website</summary>
    <ul>
      <li><a href="/start/">Start here</a></li>
      <li><a href="/agents/">Use with your AI</a></li>
      <li class="family-gap"><a href="/admin/">How this site was made</a></li>
      <li><a href="https://sovereignwebsite.ai/">Sovereign Website</a></li>
      <li><a href="https://sovereignwebsite.org/">Principles</a></li>
      <li><a href="https://sovereignwebsite.site/">Hosted</a></li>
      <li><a href="https://hub.sovereignweb.site/">Hub</a></li>
      <li><a href="https://agents.sovereignweb.site/">Agents</a></li>
      <li><a href="https://vault.sovereignwebsite.site/">Vault</a></li>
      <li><a href="https://agenticcells.ai/">AgentiCCells</a></li>
      <li><a href="https://riskmandate.ai/">RiskMandate</a></li>
      <li><a href="https://newsroom.sgit.ai/">Newsroom</a></li>
    </ul>
  </details>${note}
</aside>`;
}

function foot(ctx) {
  return `<footer class="foot">
<nav class="site-links" aria-label="About this site">
  <a href="${path(ctx, 'interview/')}">Interview questions</a>
  <a href="/start/">Start here</a>
  <a href="/agents/">Use with your AI</a>
  <a href="/admin/">How this site was made</a>
  <a href="/policy/">How this site is governed</a>
  <a href="/designs/">Designs</a>
</nav>
<p>A sovereign website, made with the <a href="https://sovereignwebsite.org/">open pattern</a>. Source: <a href="https://github.com/SovereignWebsite/Site__Sport__Padel__Oscar">github.com/SovereignWebsite/Site__Sport__Padel__Oscar</a>.</p>
</footer>`;
}

const court = (cls = '', path = '') => `<svg class="court ${cls}" viewBox="0 0 200 100" width="200" height="100" aria-hidden="true" focusable="false"><rect class="cf" width="200" height="100" rx="4" fill="#1b4f9c"/><g class="cl" fill="none" stroke="#ffffff" stroke-width="1.2"><rect x="6" y="6" width="188" height="88"/><line x1="100" y1="6" x2="100" y2="94"/><line x1="55" y1="6" x2="55" y2="94"/><line x1="145" y1="6" x2="145" y2="94"/><line x1="55" y1="50" x2="145" y2="50"/></g>${path ? `<path class="route" d="${path}" fill="none" stroke="#d6f23a" stroke-width="2" stroke-dasharray="4 3" stroke-linecap="round"/>` : ''}<circle class="ball" cx="150" cy="30" r="3.4" fill="#d6f23a"/></svg>`;
const ROUTES = ['M40 70 L100 30 L160 70', 'M30 30 L80 70 L130 40 L170 60', 'M100 80 L100 50 L150 25'];
const igBtn = (cls = 'btn') => `<a class="${cls}" href="${IG}" rel="noopener">Message Oscar on Instagram</a>`;
const portrait = (cls = '') => `<figure class="portrait ${cls}"><img src="${photo.file}" width="${photo.width}" height="${photo.height}" alt="${esc(photo.alt)}"><figcaption>${esc(photo.credit)}</figcaption></figure>`;
const offerItems = (tag = 'li', wrap = (o, i) => `<h3>${esc(o.title)}</h3><p>${esc(o.text)}</p>`) =>
  c.offers.map((o, i) => `<${tag} class="offer">${wrap(o, i)}</${tag}>`).join('\n');
const aboutText = `<p>${esc(P.first_name)} is a padel coach and personal trainer with ${esc(P.years_text.replace(/^10\+ years of /, '10+ years of '))}. His line on Instagram is &ldquo;${esc(P.tagline)}&rdquo;</p>
<p>This site is new. Oscar will add the rest himself: where he coaches, who he works with and what a session looks like.</p>`;
const contactBlock = `<p>${esc(c.contact.text)}</p><p>${igBtn()}</p><p class="handle">@${esc(P.instagram.handle)} on Instagram</p>`;
const instagramLink = `<a href="${IG}" rel="noopener">@${esc(P.instagram.handle)}</a>`;

// Each design has its own structure on a phone, not only its own colours.
const HOME = {
  1: () => `<section class="hero">
  <div class="hero-text">
    <p class="kicker">Padel coach and personal trainer</p>
    <h1>Oscar, padel coach</h1>
    <p class="lead">${esc(P.years_text)}. ${esc(P.tagline)}</p>
    <p>${igBtn()}</p>
  </div>
  ${portrait('framed')}
</section>
<div class="strip">${court()}</div>
<section id="offer" class="band"><h2>What Oscar offers</h2><ul class="offers">${offerItems()}</ul></section>
<section id="about" class="band"><h2>About Oscar</h2>${aboutText}</section>
<section id="contact" class="band contact"><h2>Get in touch</h2>${contactBlock}</section>`,

  2: () => `<section class="top">
  <h1>Oscar, padel coach</h1>
  <ul class="tiles">
    <li><span class="big">${esc(P.years)}</span><span>years of coaching experience</span></li>
    <li><span class="big">${c.offers.length}</span><span>things he offers, below</span></li>
  </ul>
  <p>${igBtn()}</p>
</section>
<section id="offer"><h2>The score</h2><p class="note">Scored like a padel game: 15, 30, 40.</p><ol class="offers">${offerItems('li', (o, i) => `<span class="num">${['15', '30', '40'][i] || i + 1}</span><span><strong>${esc(o.title)}</strong><br>${esc(o.text)}</span>`)}</ol></section>
<section id="about"><h2>About Oscar</h2>${aboutText}${portrait('small')}</section>
<section id="contact" class="contact"><h2><span class="game">Game.</span> Get in touch</h2>${contactBlock}</section>`,

  3: () => `<section class="cover">
  <img class="cover-img" src="${photo.file}" width="${photo.width}" height="${photo.height}" alt="${esc(photo.alt)}">
  <div class="cover-text">
    <h1>Oscar<span>padel coach</span></h1>
    <p class="lead">Personal trainer. ${esc(P.years_text)}.</p>
    <p>${igBtn()}</p>
  </div>
</section>
<div class="ticker" aria-hidden="true"><span>${c.offers.map((o) => esc(o.title)).join(' &middot; ')} &middot; ${c.offers.map((o) => esc(o.title)).join(' &middot; ')} &middot; </span></div>
<section id="offer"><h2>What Oscar offers</h2><ul class="offers">${offerItems('li', (o) => `<strong>${esc(o.title)}</strong><span>${esc(o.text)}</span>`)}</ul></section>
<section id="about"><h2>About</h2>${aboutText}<p class="credit">${esc(photo.credit)}</p></section>
<section id="contact" class="contact"><h2>Get in touch</h2>${contactBlock}</section>`,

  4: () => `<section>
  <h1>Oscar, padel coach</h1>
  <p class="lead">${esc(P.role)}, with ${esc(P.years_text)}. ${esc(P.tagline)}</p>
  <p>${esc(c.contact.text)}</p>
  <p>${igBtn()}</p>
</section>
<section id="offer"><h2>What Oscar offers</h2><dl class="offers">${c.offers.map((o) => `<dt>${esc(o.title)}</dt><dd>${esc(o.text)}</dd>`).join('')}</dl></section>
<section id="about"><h2>About Oscar</h2>${aboutText}${portrait('small')}</section>
<section id="contact" class="contact"><h2>Get in touch</h2>${contactBlock}</section>`,

  5: () => `<section class="intro">
  <p class="kicker">Padel coach and personal trainer</p>
  <h1>Oscar, padel coach</h1>
  <p class="lead">${esc(P.years_text)}. ${esc(P.tagline)}</p>
</section>
<section id="offer" aria-labelledby="offer-h"><h2 id="offer-h">What Oscar offers <span class="hint">Swipe for more</span></h2>
  <ul class="cards" tabindex="0" aria-label="Services, scroll sideways">${offerItems('li', (o, i) => `${court('mini', ROUTES[i % 3])}<span class="step">${i + 1} of ${c.offers.length}</span><h3>${esc(o.title)}</h3><p>${esc(o.text)}</p>`)}</ul>
</section>
<section id="about"><h2>About Oscar</h2>${aboutText}${portrait()}</section>
<section id="contact" class="contact"><h2>Get in touch</h2><p>${esc(c.contact.text)}</p><p class="handle">@${esc(P.instagram.handle)} on Instagram</p></section>
<div class="fixbar"><a class="btn" href="${IG}" rel="noopener">Message Oscar on Instagram</a></div>`
};

const interviewBody = () => `<h1>Interview questions for Oscar</h1>
<p class="lead">For Dinis Cruz to ask Oscar, so that Oscar can extend this site himself. Nothing here is on the site until Oscar has answered and agreed.</p>
<p>Not on the site yet: ${c.not_yet.join(', ')}.</p>
${c.interview.map((g, i) => `<section class="qgroup" aria-labelledby="q${i}"><h2 id="q${i}">${i + 1}. ${esc(g.title)}</h2><ul>${g.questions.map((q) => `<li>${esc(q)}</li>`).join('')}</ul></section>`).join('\n')}`;

function page(ctx, kind) {
  const home = kind === 'home';
  const url = home ? ctx.base : `${ctx.base}interview/`;
  const title = home ? S.name : `Interview questions: ${S.name}`;
  const desc = home ? S.description : 'The questions to ask Oscar so that he can extend this site: where he coaches, levels, prices, availability, achievements, fundraising, photos and contact.';
  const hdr = `<header class="hd"><a class="brand" href="${ctx.base}">Oscar, padel coach</a>
  <nav aria-label="This site"><a href="${path(ctx, '#offer')}">What Oscar offers</a><a href="${path(ctx, '#contact')}">Get in touch</a></nav></header>`;
  const main = home ? HOME[ctx.n]() : `<section class="interview">${interviewBody()}</section>`;
  return `${head(ctx, { title, desc, url })}
<body class="d${ctx.n}">
<a class="skip" href="#main">Skip to content</a>
${bar(ctx)}
${hdr}
<main id="main">
${main}
</main>
${foot(ctx)}
</body>
</html>
`;
}

const write = (f, s) => { mkdirSync(dirname(f), { recursive: true }); writeFileSync(f, f.endsWith('.html') && P.first_name !== 'Oscar' ? s.replaceAll('Oscar', P.first_name) : s); };
write('site/assets/theme.css', `:root{--court:${c.theme.court};--ball:${c.theme.ball}}\n`);
for (const d of DESIGNS) {
  const live = d.n === 1;
  const ctx = { n: d.n, live, base: live ? '/' : `/d/${d.n}/` };
  const root = live ? 'site' : `site/d/${d.n}`;
  write(`${root}/index.html`, page(ctx, 'home'));
  write(`${root}/interview/index.html`, page(ctx, 'interview'));
}

// /designs/ : the five side by side, the table, the recommendations, the pick, how to choose, the rounds.
const row = (dark) => `<ol class="row" tabindex="0" aria-label="The five designs${dark ? ', dark' : ''}, scroll sideways">
${DESIGNS.map((d) => `<li><a href="${d.n === 1 ? '/' : `/d/${d.n}/`}"><img src="${shot(d, dark)}" width="390" height="844" alt="${esc(d.alt)}${dark ? ' Shown in dark.' : ''}" loading="lazy"><span>${d.n}. ${d.name}</span></a></li>`).join('\n')}
</ol>
<p class="cap">Taken ${TAKEN}, 390 by 844 pixels, ${dark ? 'dark' : 'light'}.</p>`;
const dctx = { n: 1, live: false, base: '/' };
write('site/designs/index.html', `${head({ ...dctx, n: 'designs' }, { title: `Designs: ${S.name}`, desc: 'Five design directions for this site, side by side, with the table, the recommendations and how to choose.', url: '/designs/' })}
<body class="designs">
<a class="skip" href="#main">Skip to content</a>
${bar({ n: 0, live: true, base: '/' })}
<header class="hd"><a class="brand" href="/">Oscar, padel coach</a></header>
<main id="main">
<h1>Choose a design</h1>
<p class="lead">Five directions for Oscar's site. Each one is the whole site, so you can walk through it. The live site uses design 1 meanwhile.</p>
<h2>The five side by side</h2>
${row(false)}
<p><a href="#dark">See the same five in dark</a></p>
<h2>Compared</h2>
<table>
<thead><tr><th scope="col">Design</th><th scope="col">Its idea</th><th scope="col">Best for</th><th scope="col">Weakest at</th><th scope="col">Dark first</th></tr></thead>
<tbody>
${DESIGNS.map((d) => `<tr><th scope="row"><a href="${d.n === 1 ? '/' : `/d/${d.n}/`}">${d.n}. ${d.name}</a></th><td>${esc(d.idea)}</td><td>${esc(d.best)}</td><td>${esc(d.weak)}</td><td>${d.dark}</td></tr>`).join('\n')}
</tbody>
</table>
<h2>Who recommends what</h2>
<ul>
<li><strong>Keeper (oscar.a):</strong> design 1, Court, for the first pass. It carries the most content and is the easiest for Oscar to extend. Design 3, Poster, is the one to pick if you want the wow, once Oscar has better photos.</li>
<li><strong>a.design:</strong> design 3, Poster: with the duotone it has the strongest first screen, and the soft photo reads as style. Court stays the calm alternative. <a href="https://design.agents.sovereignweb.site/factory/dinis-cruz/account-a/a.design/reviews/oscar-2026-11-25-round-3.html">Review of rounds 2 and 3</a>.</li>
</ul>
<h2>The pick</h2>
<p>Not picked yet. The live site uses d1 meanwhile.</p>
<h2>How to choose</h2>
<ol>
<li>Does the first screen on a phone say what this site is for?</li>
<li>Can you do the main task, which is to message Oscar, without hunting?</li>
<li>Would Oscar say &ldquo;wow&rdquo;?</li>
</ol>
<p>Then say which number to keep.</p>
<h2>Rounds</h2>
<ul><li><strong>${TAKEN}, round 3, keeper, on a.design's round 1 review.</strong> Scoreboard no longer repeats the name and shows only real numbers (10+ years, 3 offers). Poster's lead no longer repeats the name and role. Plain page's Instagram action has its own line. Drill cards keeps its button fixed at the bottom of the screen, so it is on every first screen; if a.design still reads that as missing, I will add it inline too. Poster stays a duotone until a photo at least 1200 px tall arrives.</li><li><strong>${TAKEN}, round 2, keeper.</strong> Took each design further: a drawn padel court with a moving ball (still when reduced motion is on), a framed photo and court strip in 1, scoreboard points 15, 30, 40 and a Game section in 2, a duotone photo and ticker in 3, small-caps headings and a print layout in 4, court-diagram drill cards in 5. Coach colours now come from one theme in the data file. a.design reviewed rounds 1 to 3 and picks Poster.</li><li><strong>${TAKEN}, round 1, keeper.</strong> Five first designs built from one data file, all with the same content. <a href="https://design.agents.sovereignweb.site/factory/dinis-cruz/account-a/a.design/reviews/oscar-2026-11-25-round-1.html">a.design's round 1 review</a>.</li></ul>
<h2>Earlier designs</h2>
<p>None yet.</p>
<h2 id="dark">The five in dark</h2>
${row(true)}
</main>
${foot({ base: '/' })}
</body>
</html>
`);
console.log('pages written');
