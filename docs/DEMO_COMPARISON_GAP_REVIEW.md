# TNT demo-to-website visual and feature comparison

**Reviewed:** 11 November 2026  
**Compared:** Current Next.js routes and shared components against
[`../../Demo html/TNT_Website.HTML.html`](../../Demo%20html/TNT_Website.HTML.html),
constrained by [`WEBSITE_BRIEF.md`](./WEBSITE_BRIEF.md) and
[`DEADLINE.md`](./DEADLINE.md).

This is the visual/interaction companion to
[`WEBSITE_REVIEW.md`](./WEBSITE_REVIEW.md), which tracks route readiness,
content approval, implementation boundaries, and delivery priorities. Findings
below distinguish an absent visual treatment from a deliberately unpublished
claim or asset. The demo is a design reference, not authority to publish its
sample facts, people, projects, images, dates, or download buttons.

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
their numbers. Unused prototype motifs do not need one-to-one replacements.

The current global container is capped at **1520px**, with fluid
`clamp(32px, 6vw, 96px)` gutters. The navigation switches to its mobile
presentation at **1120px** to make room for the expanded desktop controls.
Review the project page's entire empty state, as
well as the header and forms, at desktop, tablet, and phone widths. Compare
`window.innerWidth`, `document.documentElement.clientWidth`, and
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

**Remaining differences:** the prototype has a large image-led hero, four KPI
blocks, a more detailed TNM ERP panel, five service tiles, a selectable project
feature, and image-led article cards. The current implementation intentionally
uses three approved service lines, omits unverified KPIs and project proof, and
uses text prompts rather than pretending approved articles exist.

**Implemented:** semantic Iconsax service/process marks and a neutral ERP
assessment panel that makes no module/function claims; editorial prompts are
clearly styled as discussion starters rather than published articles. The
disclosure remains instead of sample KPI values, customer proof, or fake
article cards. Confirm any additional service lines before adding them.

### About TNT `/ve-tnt` — deadline 12/11

**Present:** company overview; a Connect / Fit / Deliver visual sequence;
Fit First cards, icon-led capability cards, role-based team placeholders, CTA
and form; a CSS orbit hero.

**Remaining differences:** the prototype uses a photographic hero/overview,
capacity statistics, and named portrait cards. Current content uses an
illustrated hero and role-based placeholders; approved photography, metrics,
leadership identities, and portraits are still unavailable.

**Implemented:** added icon-led Connect/Fit/Deliver and capability cards with
separation between company overview and operating approach. Do not use the
demo's sample statistics, leader identities, titles, or portraits until
approved.

### Food-processing solution `/giai-phap-nganh-thuc-pham` — deadline 12/11

**Present:** hero and lead form; four challenge cards; before/target workflow;
Ready/Extend/Out-of-scope fit cards; implementation steps; FAQ; second form.

**Remaining differences:** the prototype has factory/dashboard imagery, six
workflow stages, additional industry-specific rationale/proof, a five-step
assessment/implementation process, and FAQs paired with a compact form. The
page has no approved photos and uses four implementation steps; no
handover/support step is asserted without approval.

**Implemented:** added consistent icons for materials/inventory, production,
yield/cost, quality, workflow stages, and fit states; sharpened the visual
difference between current-state and assessment areas. Handover/support was
not added because it is not approved as part of the process. The two forms
retain unique IDs. No unverified ERP capabilities or simulated project content
was restored.

## Service and content routes

| Route | Current page | Demo difference and safe next step |
|---|---|---|
| `/dich-vu` | Three service cards and short process. | Prototype also has a why-this-approach area, project highlights, and form. Confirm this BA-proposed route first; if included, use approved scope and a relevant contact CTA. |
| `/dich-vu/erp` | Shared generic `ServiceLanding`. | Prototype has ERP pain points, data-flow comparison, module grid, fit categories, food-industry feature, project/FAQ sections, and an ERP form. Give ERP its own content structure; do not list modules until TNT verifies capabilities. |
| `/dich-vu/outsourcing` | Shared generic `ServiceLanding`. | Prototype has project-situation cards, service scope, delivery process, capabilities, project highlights, and form. Add its own sections after confirming offerings and technologies. |
| `/dich-vu/body-shop` | Shared generic `ServiceLanding`. | Prototype distinguishes IT roles, staffing steps, work arrangements, team/project context, and form. Add role/work-mode cards after TNT confirms capacity and engagement models. |
| `/du-an` | Topic/industry/search controls and approval-aware empty state. | Prototype has a featured case and image-led results. No project is currently publishable; keep the empty state and removal note. When approved records exist, consider a featured card and a distinct service filter (the current model only exposes topic and industry). |
| `/du-an/[slug]` | Typed detail template with challenge, approach, outcome, optional gallery/related work, and not-found behavior. | Prototype has a richer evidence/gallery story. Add evidence/captions only for an approved real project with verified results and image permissions. |
| `/kien-thuc` | Editorial hero and links to Blog, Guides, FAQ. | Prototype has featured insights, topic links, articles, and resource cards. Add those visual modules when approved records exist; confirm this BA-proposed route. |
| `/kien-thuc/blog` | Search/topic filters and empty state. | Prototype has a featured story and image-led cards. Add those after article copy, author/date, and thumbnail approval. |
| `/kien-thuc/blog/[slug]` | Article metadata, table of contents, body, optional service CTA, not-found behavior. | Prototype also has article imagery and related articles. Add thumbnail/related-record support when approved content exists. |
| `/kien-thuc/guides` | Search/topic catalog and empty state. | Prototype uses resource cards and demo download buttons. Keep the empty state until real files and distribution rights are approved; never ship simulated downloads. |
| `/kien-thuc/faq` | Search/topic filter and native `<details>` rows with mapped open/close icons. | Prototype uses topic grouping and a more explicit expand affordance. Consider topic chips if useful; retain the native keyboard behavior. |

## Shared icon pass

The shared map now includes the approved structures' needed motifs such as
close, check, code, chart, database, shield, shopping cart, monitor, and layers.
Other decorative prototype motifs (for example mail, map pin, or handshake)
remain optional until an approved page needs them.

Recommended implementation:

1. Verify exported names in the installed `iconsax-react` package before adding
   imports to the shared icon map.
2. Add only the icons needed by approved page structures; prefer semantic
   labels over a one-to-one recreation of every decorative prototype symbol.
3. Replace number-only markers only where the number is not already expressing
   sequence. Retain step numbers for ordered processes.
4. Use consistent size, stroke variant, placement, and contrast. Keep
   decorative icons hidden from assistive technology; label icon-only controls.
5. Do not mix icon libraries, add emoji, or add inline page-specific sprite
   copies.

## Visual QA checklist

- Compare the page at the same available CSS viewport and zoom in both browsers.
- Review header alignment, hero split, section widths, and card gutters using
  the shared global CSS.
- Check that icon markers are consistent and that no card becomes a decorative
  substitute for missing approved information.
- Review empty states at full-page scale so they do not look like broken,
  partially loaded, or clipped content.
- Check focus visibility, accordion state, mobile menu state, form labels, and
  Vietnamese wrapping at responsive breakpoints.
- Keep approved-content notices visible where a missing asset/content block is
  intentional.

## Approval-safe comparison rules

- The deadline sheet says the case study was requested for removal. Do not
  restore KALA, seafood, or other prototype project content as proof; only
  publish a project after explicit approval.
- Do not use sample KPI figures, customer logos/results, leadership names or
  portraits, unapproved factory/team images, article dates/authors, or fake
  downloadable resources.
- The HTML prototype is a visual and interaction reference only. The content
  brief and deadline sheet govern factual claims, routes, release scope, and
  publication safeguards.

## References

- [`WEBSITE_REVIEW.md`](./WEBSITE_REVIEW.md) — implementation status, route
  readiness, approval blockers, and action priorities.
- [`WEBSITE_BRIEF.md`](./WEBSITE_BRIEF.md) — product, architecture,
  approved-content, and design-system guidance.
- [`DEADLINE.md`](./DEADLINE.md) — authoritative route list,
  deadline notes, and case-study removal request.
- [`../../Demo html/TNT_Website.HTML.html`](../../Demo%20html/TNT_Website.HTML.html) —
  prototype visual and interaction reference.
- [`src/app/globals.css`](../src/app/globals.css) — shared design system and
  responsive layouts.
- [`src/components/ui/icon.tsx`](../src/components/ui/icon.tsx) — shared
  Iconsax mapping.
