<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## TNT responsive card rules

- Article/project preview lists must use `ContentCard` and `ContentCarousel`. Their CSS files own card appearance and list layout; do not add page-specific column overrides or restore retired catalog/wireframe card aliases.
- Fully visible cards, based only on viewport width: 1 below 600px; 2 from 600–1100px; 3 above 1100px. Input type/touch emulation must not change column count. A list with fewer records shows the available records. Landscape uses the same width thresholds.
- Every standard article/project card uses the same mouse-only hover lift, shadow and border highlight; disable lift for reduced motion and touch. Carousel counters use current/total, such as `1/9`.
- The 760px phone breakpoint used by other sections does not control article/project card count.
- Preserve the separate featured article/project layouts and the homepage desktop project tabs unless the user requests changes to them.
- After shared card/CSS changes, run lint, a production build, `npm.cmd run test:structure`, `npm.cmd run test:responsive` and `npm.cmd run test:hover` against that running build. Verify rendered card counts and real hover/reset, not only horizontal overflow. After deployment, run the responsive check against the production alias with `-- --smoke`.
- Before removing files or styles, check import references, dynamic class names, CMS/migration usage and rendered consumers. Keep audit output under `tmp`, excluded from build and deployment.
- Details and commands: `docs/RESPONSIVE_LAYOUT.md`.
- The leadership carousel keeps its own profile overlay and looping behavior, but uses the same width thresholds. Run `npm.cmd run test:leadership` for leadership changes, including landscape, hover/tap, looping, resizing and reduced motion.
