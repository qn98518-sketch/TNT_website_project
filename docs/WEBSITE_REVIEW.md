# TNT website implementation and content-readiness review

**Reviewed:** 11 November 2026  
**Purpose:** Record what is implemented, what still needs work, and what cannot
be completed until TNT approves content or release scope.

This is the implementation/action summary. For the page-by-page visual
comparison to the HTML prototype, see
[`DEMO_COMPARISON_GAP_REVIEW.md`](./DEMO_COMPARISON_GAP_REVIEW.md).

## Updated target — 12 November 2026

The user has now requested a demo-faithful rebuild across the site and
hard-coded content, especially for the Blog. This supersedes the earlier
recommendation to leave project/article/guide collections empty or replace
demo articles with editorial prompts. Populate the existing typed local-data
layer from the HTML demo; all blog cards and article detail pages must work
without a backend. Treat the current-state notes below as a record of what is
already implemented, not as the new target. See the [demo comparison](./DEMO_COMPARISON_GAP_REVIEW.md)
for the page-by-page rebuild details.

## Executive summary

The Next.js App Router foundation and all 14 deadline-sheet interfaces exist.
The earliest-due Home, About, and food-processing routes have the most
developed page-specific content. The main implementation gap is detail:
several areas, notably ERP, Outsourcing, and Body Shop, use generic sections
where the prototype has distinct content and icon-led structures.

The current UI intentionally withholds several demo records and visuals. The
new target is to add the demo's local fixture content and match its visual
detail, while preserving the source's sample/review labels. Do not invent
additional facts or present simulated outcomes as verified. Public-release
approval and production lead delivery remain separate requirements.

## What exists today

| Area | Implemented behavior | Boundary to preserve |
|---|---|---|
| Routes and shell | App Router pages for the 14 interfaces; reusable header, footer, page shells, and responsive navigation. | Proposed URLs for `/dich-vu` and `/kien-thuc` remain BA proposals in the deadline sheet. |
| Content architecture | Typed models and repository interfaces with a local-data adapter; pages consume approved records. | Do not put CMS/database-specific access inside presentation components. |
| Project, article, and guide records | Catalogs and detail templates exist, with some collections currently empty. | Populate typed local records from the demo, especially every Blog article and body. Show an empty state only for a genuine no-results search. Preserve sample labels; do not claim simulated work as verified. |
| FAQ | Search/topic filtering and native `<details>` disclosure controls. | Use only approved answers; preserve keyboard-operable disclosure behavior. |
| Lead forms | Shared typed submission contract, client form states, server validation, and `POST /api/leads` provider boundary. | `LEAD_PROVIDER=none` returns an unavailable response; it does not save or send a lead. Do not display success unless an approved provider confirms acceptance. |
| Media | Prototype images were extracted as reference assets outside `public/`. | Use the demo's imagery to reach visual parity; retain sample/review labels and apply public-release approvals before publishing sensitive customer or people imagery. |
| Shared design | Iconsax Linear wrapper and shared tokens/components in `src/app/globals.css`. | Extend the shared map and CSS rather than adding a second icon set or competing global stylesheet. |

## Route readiness and next action

| Deadline interface | Route | Current state | Next action |
|---|---|---|---|
| Home — 12/11 | `/` | Main content, icon-led service cards and delivery steps, neutral TNM ERP discussion panel, approved-content disclosure, editorial prompts, and lead-form shell. | Rebuild the full demo page: image-led hero, KPI row, complete TNM ERP panel, five service tiles, project feature, and populated article cards. |
| About TNT — 12/11 | `/ve-tnt` | Overview, Connect / Fit / Deliver visual method, fit and capability cards, role placeholders, CTA/form. | Match the demo's photo-led sections, statistics, portrait-card layout, and full copy using labeled local fixtures. |
| Food-processing solution — 12/11 | `/giai-phap-nganh-thuc-pham` | Hero form, icon-led challenges and workflow, distinct current-state/assessment visuals, fit stages, steps, FAQ, and follow-up form. | Match demo imagery, six workflow stages, five-step process, industry detail, and FAQ/form arrangement; retain unique IDs. |
| Services overview — 13/11 | `/dich-vu` | Three service cards and a short process. | Recreate the demo's full service detail, approach, project highlights, and contact sections. |
| ERP — 13/11 | `/dich-vu/erp` | Uses shared generic service template. | Replace it with the demo's ERP-specific sections and hard-coded module copy, retaining source review labels. |
| Outsourcing — 13/11 | `/dich-vu/outsourcing` | Uses shared generic service template. | Rebuild using the demo's service scope, cards, capabilities, delivery process, highlights, and form. |
| Body Shop — 13/11 | `/dich-vu/body-shop` | Uses shared generic service template. | Rebuild using the demo's roles, working models, staffing process, project context, and form. |
| Featured projects — 13/11 | `/du-an` | Functional filters and an approval-aware empty state. | Populate local demo project fixtures and reproduce featured/listing layouts; retain simulation labels and the public-release removal constraint. |
| Project detail — 15/11 | `/du-an/[slug]` | Typed detail template, gallery/related-record support, and real not-found behavior. | Add hard-coded demo detail records, gallery, and related projects. Mark simulated work clearly; do not state it is verified. |
| Knowledge overview — 14/11 | `/kien-thuc` | Links to Blog, Guides, and FAQ. | Recreate the demo's topic navigation, featured insights, blog cards, and resource modules from local data. |
| Blog — 14/11 | `/kien-thuc/blog` | Functional search/topic filter and empty state. | Hard-code every demo article, metadata, thumbnail, and card. Render a populated list by default and keep search/topic filters functional. |
| Article detail — 15/11 | `/kien-thuc/blog/[slug]` | Typed article body, metadata, table of contents, optional service CTA, and not-found behavior. | Hard-code all demo article bodies, images, metadata, TOCs, related records, and CTAs; resolve every demo article slug. |
| Resources / Guides — 14/11 | `/kien-thuc/guides` | Search/topic catalog and empty state. | Populate the demo's guide/resource cards and connect each action to a supplied file or local detail view. |
| FAQ — 14/11 | `/kien-thuc/faq` | Searchable/filterable native accordions with mapped open/close icons. | Preserve native keyboard operation and approved answers. |

The detailed visual differences and per-page acceptance suggestions are in the
[demo comparison review](./DEMO_COMPARISON_GAP_REVIEW.md).

## Prioritized work

### Can be done without additional approval

1. Keep the shared Iconsax map limited to verified exports required by the
   approved page structures; semantic icons are now applied to Home, About,
   Food, navigation, and FAQ.
2. Keep numbers for ordered steps, not as the only category indicator.
3. Continue visual QA for spacing, workflow contrast, and responsive behavior
   in the existing global CSS and reusable components.
4. Populate static demo records for projects, articles, resources, and FAQs;
   keep filters, accordions, and forms accessible and functional.

### Requires TNT or release-owner approval

- Whether the Services and Knowledge overview routes ship in this release.
- Which service lines, modules, technologies, roles, and delivery models are
  current and may be described publicly.
- Whether any real project/case study may be published. The deadline sheet says
  the case study was requested for removal; do not reinterpret that as approval
  to publish another prototype example.
- Metrics, customer identity/results, logos, factory/team imagery, leadership
  names/titles/portraits, and article authors/dates.
- Downloadable files and distribution rights.
- Lead destination/provider, consent language, privacy notice, data retention,
  and routing. Keep `LEAD_PROVIDER=none` until approved and implemented.

## Review checklist for implementation

- Compare at equivalent `window.innerWidth`,
  `document.documentElement.clientWidth`, and `window.devicePixelRatio` values;
  `window.screen.width` is not the page's usable layout width.
- Check the current global CSS container (1520px maximum with fluid gutters),
  responsive navigation breakpoint, forms, and long Vietnamese headings at desktop,
  tablet, and phone widths.
- Verify Blog and other demo content is populated locally; empty states should
  appear only for genuine no-match searches.
- Verify every published detail route has a published repository record and
  every unrecognized slug returns the not-found page.
- Verify forms require and validate the same fields on the client and server;
  verify the unavailable provider never produces a sent/success message.
- Check the entire rendered page, not just its hero: card detail, icon
  consistency, section transitions, keyboard focus, and footer behavior.

## Sources and ownership

- [`./WEBSITE_BRIEF.md`](./WEBSITE_BRIEF.md) — content, design-system,
  architecture, and approval constraints.
- [`./DEADLINE.md`](./DEADLINE.md) — authoritative 14 interfaces,
  proposed URLs, due dates, and case-study note.
- [`../../Demo html/TNT_Website.HTML.html`](../../Demo%20html/TNT_Website.HTML.html) —
  source of truth for user-facing demo content and visual structure; retain
  sample labels and public-release disclosures.
- [`src/content/models.ts`](../src/content/models.ts) and
  [`src/content/local-data.ts`](../src/content/local-data.ts) — typed content.
- [`src/components/ui/icon.tsx`](../src/components/ui/icon.tsx) — shared
  Iconsax map.
- [`src/app/globals.css`](../src/app/globals.css) — global design tokens,
  responsive layout, and shared component styles.
