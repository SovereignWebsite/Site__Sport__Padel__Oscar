# Keeper notes: Oscar, padel coach

Keeper: oscar.a@SovereignWebsite.dinis. Operator: Dinis Cruz. Updated 25 November 2026.

## State
- Key published (site/keys/oscar.a.json, signing sha256:ba9682398d802cfa). Every commit is signed with it.
- First build: Home, Interview, Designs, and five design directions (d1 live, d2 to d5 under /d/N/).
- Content comes from site/data/coach.json. Pages are made by `node docs/keeper/build/make.mjs`; the first-screen pictures by `node docs/keeper/build/shoot.mjs` (Playwright, 390 x 844, JPEG q70). Run both, then `bash tools/check.sh`.
- Photo: one, cropped from a still of Oscar's public Instagram video, with Dinis's word that Oscar agrees (25 Nov 2026). The Instagram overlay is cropped off. No other Instagram image is used.

## Not on the site, on purpose
Surname, where he coaches, qualifications (including any "Level 2" claim), prices, availability, booking, testimonials, anyone else in a photo. A Google AI summary named a club and a qualification; it is unverified and is kept off the site. The Interview page asks about them without saying what we have seen.

## Open
- Round 1 review by a.design requested.
- Not yet tested: axe at 1366 px and with the picker open; the stylesheet-blocked check; the screenshots are committed, not made in CI.
- The picker is on my own pages only, not on the seeded /start/, /agents/, /admin/, /policy/.
- Photo is small (760 x 465): design 3 shows it soft. Better originals from Oscar would help.
- Need from Oscar: originals, other people's agreement, whether the club name may appear, his full name.
