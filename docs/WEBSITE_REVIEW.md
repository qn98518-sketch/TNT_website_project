# TNT website implementation and content-readiness review

**Reviewed:** 11 November 2026  
**Purpose:** Record what is implemented, what still needs work, and what cannot
be completed until TNT approves content or release scope.

This is the implementation/action summary. For the page-by-page visual
comparison to the HTML prototype, see
[`DEMO_COMPARISON_GAP_REVIEW.md`](./DEMO_COMPARISON_GAP_REVIEW.md).

## Executive summary

The Next.js App Router foundation and all 14 deadline-sheet interfaces exist.
The earliest-due Home, About, and food-processing routes have the most
developed page-specific content. The main implementation gap is detail:
several areas, notably ERP, Outsourcing, and Body Shop, use generic sections
where the prototype has distinct content and icon-led structures.

The current UI intentionally withholds unapproved project and article records,
metrics, customer outcomes, people, and images. Do not fill those gaps with
prototype claims or invented facts. Continue the visual work with approved copy,
neutral diagrams, and the shared icon system; treat publishable proof and
production lead delivery as approval-dependent.

## What exists today

| Area | Implemented behavior | Boundary to preserve |
|---|---|---|
| Routes and shell | App Router pages for the 14 interfaces; reusable header, footer, page shells, and responsive navigation. | Proposed URLs for `/dich-vu` and `/kien-thuc` remain BA proposals in the deadline sheet. |
| Content architecture | Typed models and repository interfaces with a local-data adapter; pages consume approved records. | Do not put CMS/database-specific access inside presentation components. |
| Project, article, and guide records | Catalogs support search/filter controls and honest empty states; detail routes use `notFound()` for unknown or unpublished slugs. | Record collections are empty until content, media, rights, and publication details are approved. |
| FAQ | Search/topic filtering and native `<details>` disclosure controls. | Use only approved answers; preserve keyboard-operable disclosure behavior. |
| Lead forms | Shared typed submission contract, client form states, server validation, and `POST /api/leads` provider boundary. | `LEAD_PROVIDER=none` returns an unavailable response; it does not save or send a lead. Do not display success unless an approved provider confirms acceptance. |
| Media | Prototype images were extracted as reference-only assets outside `public/`. | Confirm rights and subject matter before publishing any image, especially customer, factory, or leadership images. |
| Shared design | Iconsax Linear wrapper and shared tokens/components in `src/app/globals.css`. | Extend the shared map and CSS rather than adding a second icon set or competing global stylesheet. |

## Route readiness and next action

| Deadline interface | Route | Current state | Next action |
|---|---|---|---|
| Home — 12/11 | `/` | Main content, icon-led service cards and delivery steps, neutral TNM ERP discussion panel, approved-content disclosure, editorial prompts, and lead-form shell. | Review against visual reference and preserve the no-unverified-KPI/proof boundary. |
| About TNT — 12/11 | `/ve-tnt` | Overview, Connect / Fit / Deliver visual method, fit and capability cards, role placeholders, CTA/form. | Keep leadership identities and portraits unpublished until approved. |
| Food-processing solution — 12/11 | `/giai-phap-nganh-thuc-pham` | Hero form, icon-led challenges and workflow, distinct current-state/assessment visuals, fit stages, steps, FAQ, and follow-up form. | Do not assert unconfirmed ERP capabilities; retain unique IDs for both forms. |
| Services overview — 13/11 | `/dich-vu` | Three service cards and a short process. | Confirm BA-proposed release inclusion; if approved, review the contact CTA and add only approved scope. |
| ERP — 13/11 | `/dich-vu/erp` | Uses shared generic service template. | Build the ERP-specific structure after TNM module capabilities are confirmed. |
| Outsourcing — 13/11 | `/dich-vu/outsourcing` | Uses shared generic service template. | Build service-scope/process sections after current offerings and technologies are confirmed. |
| Body Shop — 13/11 | `/dich-vu/body-shop` | Uses shared generic service template. | Build role and engagement sections after staffing availability and work models are confirmed. |
| Featured projects — 13/11 | `/du-an` | Functional filters and an approval-aware empty state. | Keep empty until an approved project list exists; do not restore the removed/simulated case study. |
| Project detail — 15/11 | `/du-an/[slug]` | Typed detail template, gallery/related-record support, and real not-found behavior. | Publish only approved scope, results, media, and customer permissions. |
| Knowledge overview — 14/11 | `/kien-thuc` | Links to Blog, Guides, and FAQ. | Confirm BA-proposed release inclusion; add featured modules only when approved records exist. |
| Blog — 14/11 | `/kien-thuc/blog` | Functional search/topic filter and empty state. | Add featured/article imagery only after copy, author/date, and image approvals. |
| Article detail — 15/11 | `/kien-thuc/blog/[slug]` | Typed article body, metadata, table of contents, optional service CTA, and not-found behavior. | Consider thumbnail and related-article modules once approved article records are available. |
| Resources / Guides — 14/11 | `/kien-thuc/guides` | Search/topic catalog and empty state. | Add only real files with confirmed type, size, URL, and publication rights. |
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
4. Ensure empty states, filters, accordions, and forms remain accessible and
   useful with empty local repositories.

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
- Verify filters and empty states do not imply unpublished records exist.
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
  visual and interaction reference, not approved production content.
- [`src/content/models.ts`](../src/content/models.ts) and
  [`src/content/local-data.ts`](../src/content/local-data.ts) — typed content.
- [`src/components/ui/icon.tsx`](../src/components/ui/icon.tsx) — shared
  Iconsax map.
- [`src/app/globals.css`](../src/app/globals.css) — global design tokens,
  responsive layout, and shared component styles.
