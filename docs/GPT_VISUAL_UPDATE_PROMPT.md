# Prompt: Improve image variety, Blog layout, and animation

Use this prompt with ChatGPT or a coding agent working in the TNT website
workspace.

---

Review the current Next.js website, the implementation requirements in
`docs/WEBSITE_BRIEF.md` and `docs/DEMO_COMPARISON_GAP_REVIEW.md`, and the supplied
image folder at `/mnt/dmc/ts pmo/sqpca more like suckca/doc/ss/new_images/`.
Implement the following visual improvements in the existing codebase.

## Image variety

- Inspect the images in `doc/ss/new_images/` and select a relevant, varied set
  for the website. Use food-processing imagery for food/ERP sections; glass and
  wood factory imagery for manufacturing content; technology, cloud, security,
  and AI imagery for software/technology content; and team/person images for
  collaboration or About sections.
- Avoid repeating the same hero or card image across unrelated pages. Preserve
  aspect ratios, use intentional `object-fit: cover` crops, and provide useful
  alt text for meaningful images.
- Use the existing public asset conventions and do not add remote image
  dependencies when local images are available.

## Blog layout

- Set the Blog article listing to **two columns on desktop**, as requested, and
  one column on narrow mobile screens.
- Keep the search and topic controls easy to find above the results. Reduce
  oversized article imagery so it supports each card instead of dominating the
  page.
- Give cards a stable, consistent image frame. Make card content flow normally:
  titles, metadata, summaries, review labels, and links must never overlap,
  even when titles or summaries wrap to different lengths.
- Preserve the populated local article data, filtering behavior, and responsive
  layout.

## Polished motion

- Add restrained section reveal and card/image hover transitions that make the
  site feel polished without distracting from the content.
- Prefer CSS transitions and existing project patterns; avoid adding an
  animation library for simple effects.
- Respect `prefers-reduced-motion`. Content must remain visible and usable when
  motion is reduced or disabled. Avoid continuous motion and prevent layout
  shifts.

Keep the current Next.js App Router, shared components, global CSS, and
Iconsax system. Match the visual direction of the supplied HTML demo. Do not
rewrite unrelated page content or replace the static local content architecture.
After implementation, summarize the files changed and the visual checks
performed, and call out anything that still needs review.
