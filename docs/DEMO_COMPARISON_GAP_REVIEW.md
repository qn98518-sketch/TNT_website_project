# TNT demo-to-website visual and feature comparison

**Reviewed:** 11 November 2026  
**Compared:** Current Next.js routes and shared components against
[`../../Demo html/TNT_Website.HTML.html`](../../Demo%20html/TNT_Website.HTML.html),
constrained by [`WEBSITE_BRIEF.md`](./WEBSITE_BRIEF.md) and
[`DEADLINE.md`](./DEADLINE.md).

This is the visual/interaction companion to
[`WEBSITE_REVIEW.md`](./WEBSITE_REVIEW.md), which tracks route readiness,
content approval, implementation boundaries, and delivery priorities. Findings
below distinguish missing implementation detail from sample facts that need
public-release review. The demo is the implementation source for its user-facing
content and visual structure; its simulated or unverified claims are not proof
that they can be presented publicly as verified facts.

## Revised target from the user — 12 November 2026

The implementation target has changed: make every page look and read exactly
like the supplied demo. The demo is now the source of truth for the
complete user-facing page content, not just a loose visual reference. Recreate
its header and boxed TNT logo, page-specific sections, copy, imagery, icons,
colors, spacing, cards, forms, responsive layouts, and user-facing interactions
across all routes. Do not stop after the three deadline-priority pages, use
generic service templates in place of the demo layouts, or omit details that
are present in the demo.

Hard-code the content shown in the demo into the typed local content layer,
including the Blog and full article bodies, metadata and thumbnails, related
articles, project listing/detail records, FAQs, and resource cards. Populate
the Blog from the demo on first render. Its search and topic filters must work
against those local records; an empty state is only appropriate when a user's
search returns no matches. Keep components separate from content so a future
backend adapter can replace local data without a page rewrite. Do not add a
CMS, database, or content API for this build.

Implement the user-facing result in Next.js with the current global CSS,
components, and Iconsax system. Port visible behavior to real routes and
functional controls; do not embed the source HTML or carry over authoring-only
review controls. Copy source wording and retain its visible sample/review
labels. The deadline's case-study removal note remains a public-release
constraint: the local parity fixture can reproduce the demo structure, but the
simulated project must never be presented as verified TNT work. If release
approval is absent, preserve the visual composition with an explicit sample
label or approved neutral copy rather than an empty/broken section.

## Site-wide comparison

The app already has a coherent navy/blue design system, responsive shell,
reusable card and form components, keyboard-operable navigation, and an
Iconsax Linear wrapper. The difference is not a missing framework or stylesheet:
it is uneven page-specific detail and icon coverage. The app's shared styles are
in [`src/app/globals.css`](../src/app/globals.css); keep shared refinements there
and in reusable components.

The prototype has an inline sprite with **28 icon symbols**. The shared
[`Icon`](../src/components/ui/icon.tsx) wrapper now maps **35 verified Iconsax
Linear names**. Semantic marks are used on the priority-page service, approach,
capability, challenge, workflow, fit, and FAQ elements; ordered steps retain
their numbers. Add a consistent Iconsax Linear counterpart for every icon
visible in a user-facing demo section; only unused sprite symbols can be
omitted.

The current global container is capped at **1520px**, but the demo uses a
**1230px** container and **42px** desktop side gutters (`width: min(1230px,
calc(100% - 84px))`). This is a direct mismatch: update the shared global CSS
to use the demo's container, **78px** header, and responsive breakpoints/layout
values from its embedded stylesheet. Do not retain the current 1520px maximum
or compensate with browser zoom or CSS transforms. Review the populated
projects page and its genuine no-match state, as well as header and forms, at
desktop, tablet, and phone widths. Compare `window.innerWidth`,
`document.documentElement.clientWidth`, and
`window.devicePixelRatio`; `window.screen.width` is the display size, not the
page's layout width. Do not use `zoom` or `transform: scale()` to compensate
for browser chrome or side panels.

## Header, navigation, and logo

The header now follows the reference hierarchy, has a working search link that
focuses the Blog search input, marks Vietnamese as the active language without
offering an untranslated EN switch, and uses the replacement CSS/vector logo
lockup in both header and footer. Active routes are indicated, including
nested service, project, and knowledge pages; dropdowns and mobile navigation
remain keyboard operable.

### Required desktop order

1. **Trang chủ** → `/`
2. **Giải pháp** → `/giai-phap-nganh-thuc-pham`
3. **Dịch vụ** dropdown → Tổng quan dịch vụ, ERP, Outsourcing, Body Shop
4. **Dự án** → `/du-an`
5. **Kiến thức** dropdown → Tổng quan kiến thức, Blog, Tài liệu / Guides, FAQ
6. **Về TNT** → `/ve-tnt`
7. Search icon control
8. **VI** language control
9. Primary CTA: **“Trao đổi dự án”** with a right-arrow icon

Keep the same order in the mobile menu. The search control may
open a search panel, or route to the blog/search view and focus its search
field. The VI control should show the active language. Since the site has no
complete approved English translation yet, do not imply that an EN experience
is ready or make a language switch that does nothing. Preserve the active-page
state and keyboard-accessible dropdown behavior.

### Logo lockup

The reference shows a compact white rectangular
lockup with a thin blue outline, large bold/italic “TNT” lettering, and small,
widely spaced “TRÍ NGHĨA TECH” beneath it. Reproduce that visible lockup in the
header and use the same brand treatment in the footer where appropriate. Keep
its proportions legible on mobile and preserve the accessible link name “TNT —
Trang chủ.”

No approved TNT logo asset is currently present in the app's `public/` folder.
Until TNT supplies an official vector, build a crisp inline SVG or CSS/vector
lockup based on the screenshot; do not crop the small screenshot and stretch
it as a production logo. Keep decorative logo lettering from being announced
twice by screen readers. If an official asset arrives later, it should be
swappable without redesigning the header.

Apply the shared header/footer styles in `src/app/globals.css` and the shared
markup/behavior in `src/components/site-header.tsx` and
`src/components/site-shell.tsx`. Match the screenshot's white header, navy
labels, generous spacing, round search button, outlined VI control, and bright
blue rounded CTA. Do not use browser zoom or CSS transforms to imitate the
reference.

## Release-critical pages

### Home `/` — deadline 12/11

**Present:** positioning hero with CSS dashboard illustration; three semantic
service cards; a neutral TNM ERP discussion panel; reasons; icon-led four-step
process; food-industry band; approved-content disclosure; editorial prompts
styled as discussion starters; general lead form.

**Remaining differences / implementation target:** restore the demo's large
image-led hero, four KPI blocks, detailed TNM ERP panel, five service tiles,
selectable project feature, and image-led article cards. Hard-code the demo's
exact displayed text and values in local data, retaining any sample/review
disclosure that appears with unverified figures or projects.

**Current implementation status:** semantic Iconsax service/process marks and
a neutral ERP assessment panel are present, but they do not meet the new demo
parity target. Replace editorial prompts with the demo's populated local
article records and restore the complete home-page content and visual detail.

### About TNT `/ve-tnt` — deadline 12/11

**Present:** company overview; a Connect / Fit / Deliver visual sequence;
Fit First cards, icon-led capability cards, role-based team placeholders, CTA
and form; a CSS orbit hero.

**Remaining differences / implementation target:** reproduce the demo's
photographic hero and overview, capacity statistics, and portrait-card layout.
Use the demo's local fixture data and retain any sample/review labels attached
to unverified people, photographs, or figures.

**Current implementation status:** icon-led Connect/Fit/Deliver and capability
cards exist, but the photo-led sections, statistics, and portrait-card layout
still need to match the demo. Add their hard-coded local fixture content and
retain the source's sample/review status; gate verified public claims on
release approval.

### Food-processing solution `/giai-phap-nganh-thuc-pham` — deadline 12/11

**Present:** hero and lead form; four challenge cards; before/target workflow;
Ready/Extend/Out-of-scope fit cards; implementation steps; FAQ; second form.

**Remaining differences / implementation target:** reproduce the demo's
factory/dashboard imagery, six workflow stages, industry-specific sections,
five-step assessment/implementation process, and FAQ paired with a compact
form. Use local demo assets and data, retaining source labels for illustrative
or unverified proof.

**Current implementation status:** icons for materials/inventory, production,
yield/cost, quality, workflow stages, and fit states are present, but the page
still omits demo imagery and detail. Restore the demo's full five-step process
and remaining sections from local data. Keep its two forms distinct and retain
the demo's sample/review labels for illustrative claims.

## Service and content routes

| Route | Current page | Required demo-faithful implementation |
|---|---|---|
| `/dich-vu` | Three service cards and short process. | Recreate the demo's full overview, why-this-approach section, project highlights, forms, and exact service-card details. |
| `/dich-vu/erp` | Shared generic `ServiceLanding`. | Replace with the demo's ERP-specific pain points, data-flow comparison, module grid, fit categories, food-industry feature, project/FAQ sections, and form. Hard-code demo module copy locally and retain any source sample/review labels. |
| `/dich-vu/outsourcing` | Shared generic `ServiceLanding`. | Recreate the demo's project-situation cards, service scope, delivery process, capabilities, project highlights, and form. |
| `/dich-vu/body-shop` | Shared generic `ServiceLanding`. | Recreate the demo's roles, staffing steps, work arrangements, team/project context, and form. |
| `/du-an` | Topic/industry/search controls and approval-aware empty state. | Populate the listing with the demo's featured case and image-led records from local fixtures, matching its card layout and filters. Keep any simulated example explicitly labeled and respect the public-release removal note. |
| `/du-an/[slug]` | Typed detail template with challenge, approach, outcome, optional gallery/related work, and not-found behavior. | Populate local detail records and reproduce the demo's complete evidence/gallery story and related content. Mark simulated examples as such; do not represent them as verified results. |
| `/kien-thuc` | Editorial hero and links to Blog, Guides, FAQ. | Recreate the demo's featured insights, topic links, article cards, and resource cards from local data. |
| `/kien-thuc/blog` | Search/topic filters and empty state. | Populate the featured story and every image-led article card in the demo. Implement working local search, topic filters, result count, and reset. |
| `/kien-thuc/blog/[slug]` | Article metadata, table of contents, body, optional service CTA, and not-found behavior. | Hard-code all demo article records, full bodies, imagery, metadata, table of contents, related articles, and CTAs; every demo slug must resolve. |
| `/kien-thuc/guides` | Search/topic catalog and empty state. | Recreate all demo resource cards, descriptions, categories, and visible actions using local records. Connect actions to supplied files or useful local detail pages. |
| `/kien-thuc/faq` | Search/topic filter and native `<details>` rows with mapped open/close icons. | Match the demo's topic groups, questions, answers, icon treatment, and expand affordance with functional accessible controls. |

## Shared icon pass

The shared map now includes many structures' needed motifs such as
close, check, code, chart, database, shield, shopping cart, monitor, and layers.
Add the remaining motifs used in the demo (for example mail, map pin, and
handshake) so the icon placement and visual detail match page by page.

Recommended implementation:

1. Verify exported names in the installed `iconsax-react` package before adding
   imports to the shared icon map.
2. Add every icon motif visible in the user-facing demo, mapped to the
   corresponding Iconsax Linear symbol; preserve the demo's placement and role.
3. Replace number-only markers only where the number is not already expressing
   sequence. Retain step numbers for ordered processes.
4. Use consistent size, stroke variant, placement, and contrast. Keep
   decorative icons hidden from assistive technology; label icon-only controls.
5. Do not mix icon libraries, add emoji, or add inline page-specific sprite
   copies.

## Visual QA checklist

- Compare the page at the same available CSS viewport and zoom in both browsers.
- Compare full-page captures of all 14 routes at matching viewport sizes;
  verify the section order, text density, imagery, logo, navigation, cards,
  icons, spacing, and interactions against the HTML demo.
- Review header alignment, hero split, section widths, and card gutters using
  the shared global CSS.
- Check that icon markers are consistent and that no card becomes a decorative
  substitute for missing approved information.
- Review empty states at full-page scale so they do not look like broken,
  partially loaded, or clipped content.
- Check focus visibility, accordion state, mobile menu state, form labels, and
  Vietnamese wrapping at responsive breakpoints.
- Keep sample/review notices that are present in the demo visible with their
  associated local fixture content.
- Use varied, topic-relevant images from `../../doc/ss/new_images/` across the
  site; avoid repeating one image for unrelated sections.
- Keep Blog cards in two desktop columns and one narrow-mobile column. Confirm
  image height, card copy, and links do not overlap the search/filter area.
- Check subtle section-reveal and card/image-hover motion, including reduced
  motion preferences and a no-animation fallback.

## Content fidelity and public-release rules

- Copy all user-facing demo text and populate local fixture data; do not
  replace the Blog with empty-state UI or editorial prompts.
- Preserve the demo's visible labels for sample content. Do not describe
  simulated customer work, results, metrics, people, or project imagery as
  verified TNT proof.
- The deadline sheet says the case study was requested for removal. Keep its
  demo-parity implementation clearly labeled as a simulated fixture for local
  review; obtain release approval before publishing it as a real project. If it
  must be excluded at launch, retain the designed section with approved neutral
  copy rather than an empty or broken layout.
- Do not create fake resource downloads. Match the demo card/action appearance
  and connect each action to a supplied file or a useful local detail view.
- The demo governs user-facing content and visual structure. The deadline and
  launch review still govern public release, routes, and factual disclosures.

## References

- [`WEBSITE_REVIEW.md`](./WEBSITE_REVIEW.md) — implementation status, route
  readiness, approval blockers, and action priorities.
- [`WEBSITE_BRIEF.md`](./WEBSITE_BRIEF.md) — product, architecture,
  approved-content, and design-system guidance.
- [`DEADLINE.md`](./DEADLINE.md) — authoritative route list,
  deadline notes, and case-study removal request.
- [`../../Demo html/TNT_Website.HTML.html`](../../Demo%20html/TNT_Website.HTML.html) —
  source of truth for user-facing demo content, visuals, and interactions.
- [`src/app/globals.css`](../src/app/globals.css) — shared design system and
  responsive layouts.
- [`src/components/ui/icon.tsx`](../src/components/ui/icon.tsx) — shared
  Iconsax mapping.
