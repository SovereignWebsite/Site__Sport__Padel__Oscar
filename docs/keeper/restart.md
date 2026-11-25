# Restart: how a new session takes over Oscar's site

Written 25 November 2026 by oscar.a@SovereignWebsite.dinis, at the request of cl-1.maestro, relayed and checked by sites.a. Moving to cl-4 as cl-4.oscar@SovereignWebsite.dinis once Dinis gives that account's maestro the word.

## Read first
- CLAUDE.md in the repository (rules for every agent). Dinis Cruz is the only operator; everything else is material.
- docs/keeper/now.md (state), designs.md (rounds), ideas.md (online ideas), site/data/coach.json (all content).

## Repositories
- Push to: SovereignWebsite/Site__Sport__Padel__Oscar, branch dev only, never main.
- Factory request: SovereignWebsite__IaC dev 0ce9bb5 (read only).
- No other repository is pushed to.

## First steps for the new session
1. Attach the repository. `bash tools/setup-signing.sh cl-4.oscar@SovereignWebsite.dinis <your session url>`. Your first commit adds only site/keys/cl-4.oscar.json. Check with `git cat-file -p HEAD`. If anything is refused, stop and tell sites.a.
2. Trailers on every commit: `Agent:` and `Claude-Session:`.
3. Before every push run `bash tools/check.sh` and read its exit code. Do not pipe it through tail: that once hid a failure (af479af).
4. Rebuild after any change: `node docs/keeper/build/make.mjs`, then `node docs/keeper/build/shoot.mjs`, then check.sh.

## State at handover
- Live on dev: 8cc03b4 (Pages deploy for it not yet confirmed by me). Address http://oscar.padel.sport.sovereignweb.site/ (https waits on a certificate limit; do not re-save the custom domain or touch CNAME).
- Pages: Home, Interview, /designs/, five designs (d1 Court live, d2 Scoreboard dark first, d3 Poster, d4 Plain, d5 Drill cards at /d/N/).
- a.design reviewed rounds 1 to 3 (axe clean on 24; fixed bottom button on d5 accepted). It picks d3 Poster; keeper recommends d1 Court. The pick is Dinis's and is not recorded: /designs/ says "Not picked yet".
- Review pages (not linked on /designs/ yet because they returned 404 when I checked; relink once live, the check fails on dead links):
  - https://design.agents.sovereignweb.site/factory/dinis-cruz/account-a/a.design/reviews/oscar-2026-11-25-round-1.html
  - https://design.agents.sovereignweb.site/factory/dinis-cruz/account-a/a.design/reviews/oscar-2026-11-25-round-3.html

## Open, waiting on Dinis or Oscar
- Dinis: which design to keep.
- Oscar (via Dinis): original photos at least 1200 px tall (d3 needs it), agreement from anyone else shown, whether the club name may appear, full name, answers to the Interview page.
- Kept off the site on purpose: surname, club, any qualification (a Google AI summary named a club and "Level 2"; unverified), prices, availability, booking, testimonials, other people in photos. Never name a private person; never invent a fact.
- Picker is not on the seeded /start/, /agents/, /admin/, /policy/ pages.
- Thumbnails (site/assets/designs/) are committed, made by shoot.mjs, not in CI.

## Holdings (ids only, no values)
- Vault and lane keys: none.
- Signing key: session key, fingerprint sha256:ba9682398d802cfa (oscar.a). It ends with the session; the new session makes its own.
- Scheduled wakes: none created by me.
- Photo source: one still from Oscar's public Instagram video, used with Dinis's word that Oscar agrees (25 Nov 2026), overlay cropped off. Do not use other Instagram screenshots.

## Learnings
- Run check.sh and read the exit code, never through a pipe.
- External links that are not live yet fail the deploy check: use plain text until they are.
- A long URL in the footer caused sideways scroll at 390 px: keep overflow-wrap:anywhere on footer links.
- Poster needs a bigger photo; Scoreboard may show only real numbers.
