# Article and project cards

All article/project preview lists use `ContentCard` and `ContentCarousel`, including the small-screen version of the homepage project showcase. Featured article/project sections and the desktop homepage project tabs retain their separate layouts.

| Viewport / input | Fully visible cards |
| --- | --- |
| Below 600px | 1 |
| 600–1100px | 2 |
| Above 1100px, any input type | 3 |

A list with fewer records displays the available records. Landscape uses the same width thresholds. Input type does not select the layout: enabling touch emulation in browser Inspect must not change column count at the same viewport width. Docking Inspect can reduce that width; two cards are expected once it falls to 1100px or below. The rest of the site's phone breakpoint remains 760px; card layout has its own 600px breakpoint so small tablets still show two cards.

`content-cards.css` owns card appearance and desktop grid columns. `content-carousel.css` owns horizontal scrolling, visible card count and controls. These files are imported by their respective components. Do not restore the retired `catalog-card`, `wf-content-card`, `wf-card-copy`, `wf-article-cards-compact` or legacy homepage insight styles, or add per-page column overrides.

The carousel's activation media query in CSS and TypeScript must agree. It activates below 1101px. Its controls measure actual card widths; the counter uses current/total (for example `1/9`), including after filtering, keyboard navigation, resizing and client navigation. Every standard article/project card shares the same mouse hover lift, shadow and border highlight. Touch has no hover effect; reduced motion retains static highlighting without lift or animation.

## Regression check

Run a production build and start the server, then run:

```powershell
npm.cmd run build
npm.cmd run start
# In another terminal:
npm.cmd run test:responsive
npm.cmd run test:hover
```

Requires an installed Chrome/Chromium browser; set `CHROME_PATH` for a nonstandard installation. `AUDIT_ORIGIN` selects another origin, such as the Vercel production alias. `AUDIT_OUTPUT` selects a report directory. `-- --smoke` runs a smaller verification set.

The check reads the sitemap, tests both languages and mouse/touch scenarios, and fails when a second tablet card is missing or clipped. It checks actual rendered rectangles and card styles, rather than only testing page overflow. Reports and screenshots are written under `tmp/responsive-card-check/` by default.

The hover check visits article/project card groups on every public route. It verifies mouse lift/reset, no movement of neighboring cards, touch suppression, reduced motion, and room for lift inside tablet carousels.

Run `npm.cmd run test:structure` to check that TS/TSX, JSON and CSS modules under `src` remain reachable from app entry points. Temporary audits and screenshots belong under `tmp`, which is excluded from TypeScript, Git and Vercel uploads.

## Leadership carousel

Leadership profiles retain their portrait/biography design and independent carousel. They use the same 600px/1100px width thresholds, including landscape and touch emulation. Read the fractional viewport width when measuring slide steps so looping does not clip card borders. Autoplay pauses while a profile is open or hovered, and stops under reduced motion; manual navigation remains available.

Run `npm.cmd run test:leadership` against a running production build. It checks visible cards and alignment across widths/languages, loop boundaries, arrows/dots, resize during animation, keyboard profile access, mouse hover/close, touch/swipe and reduced motion. It accepts the same origin/output environment variables and `-- --smoke` for deployment verification.

## Removed legacy files

The unused `content-page.tsx`, `content-icons.ts` and old `SiteFooter` were disconnected from all routes. Prototype image copies in `public/demo` and `src/content/reference-assets`, unused starter SVGs, and accidentally saved terminal output files were removed after reference checks. Runtime `/images` assets, CMS, backend, migrations and maintenance tools are retained.

Retired CSS was identified from TS/TSX references, keeping dynamic class prefixes and CMS selectors. A second check against the pre-change HTML of all public routes and the CMS login verifies that removed selectors have no remaining live consumers, apart from the explicitly migrated card aliases.
