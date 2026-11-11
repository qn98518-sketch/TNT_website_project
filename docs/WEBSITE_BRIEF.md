# TNT Corporate Website — Product and Implementation Brief

**Prepared:** 11 November 2026  
**Purpose:** Source-based brief for rebuilding the TNT / Trí Nghĩa Tech website with Next.js.  
**Primary content language:** Vietnamese. English content is represented by starter files, but is not yet a complete translation of the website.

## 1. Project overview

Create a credible, conversion-focused corporate website for TNT (Trí Nghĩa Tech), a technology partner presenting its TNM ERP platform, custom software services, and IT staffing support. The site should explain how TNT understands operating workflows, recommends a practical scope, and supports implementation. The strongest industry-specific story in the materials is food processing; broader manufacturing is also represented.

The current materials are a website prototype and design references, not a production application. Build the production site in **Next.js using the App Router and TypeScript**. Treat the existing HTML as a content and interaction reference. Do not ship its review controls, hash-based page switching, demo notices, or non-submitting forms as production behavior.

### Primary website goals

1. Help prospective clients understand TNT, TNM ERP, and the other service lines.
2. Explain the ERP fit-assessment approach: identify what is ready to use, what needs extension, and what falls outside the agreed scope.
3. Show project evidence and practical knowledge without presenting unverified examples as proven results.
4. Generate qualified enquiries through service-specific contact forms.

### Main audiences

- Food-processing and manufacturing businesses reviewing ERP or production-management needs.
- Businesses seeking a custom software development partner.
- Project teams seeking additional IT roles such as developers, QA/testers, or business analysts.
- Decision makers looking for information about TNT, its approach, and relevant project experience.

## 2. Positioning and content principles

**Working positioning:** TNT connects technology with day-to-day business operations. The prototype’s recurring idea is **“Fit first. Customize with purpose.”** Vietnamese copy expresses this as prioritizing operational fit and customizing only when there is a clear reason.

Use the supplied copy as a starting point, then obtain TNT approval for factual statements. Keep the tone practical, clear, consultative, and specific to operating workflows. Avoid unsupported promises, invented performance improvements, and claims that a sample project is a confirmed customer success.

### Product and service content found in the materials

- **TNM ERP:** an enterprise management platform, with references to CRM/customer management, purchasing, warehouse management (WMS), production management (MES), sales, finance, HR, and projects. Confirm which modules are currently offered and their exact capabilities.
- **Software development / Outsourcing:** custom software, web and mobile applications, system integration, data migration, and AI-related work are proposed in the prototype. Confirm the current service scope before publication.
- **Body Shop / IT staffing:** developer, QA/tester, and business analyst roles; onsite, remote, or hybrid collaboration models are shown as options, subject to TNT confirmation.
- **Industry solution:** ERP assessment and implementation for food-processing businesses, including materials, inventory, production, quality, finished goods, and reporting workflows.

## 3. Sitemap and recommended Next.js routes

Use readable URLs rather than the prototype’s `#/...` routes. Keep page content in reusable data structures so project, article, FAQ, and guide records can be maintained consistently.

| Page | Recommended route | Purpose and primary content |
|---|---|---|
| Home | `/` | TNT positioning, TNM ERP and services, reasons to work with TNT, delivery steps, project and article highlights, contact form. |
| About TNT | `/about` | Company overview, food-industry focus, “Fit first” method, capability and leadership sections, enquiry form. |
| Food-processing solution | `/solutions/food-processing` | Industry landing page with factory pain points, ERP-fit assessment, connected workflow, FAQs, and an early lead form. |
| Services overview | `/services` | Overview of ERP, software development, and IT staffing with links to service pages and selected projects. |
| ERP | `/services/erp` | Business problems, connected data flow, TNM modules, ready/extend/out-of-scope framework, project evidence, FAQ, enquiry form. |
| Software development | `/services/software-development` | Common project needs, possible scope, delivery stages, capability evidence, selected examples, enquiry form. |
| IT staffing / Body Shop | `/services/it-staffing` | Resourcing needs, roles, engagement steps and modes, evidence, enquiry form. |
| Projects | `/projects` | Searchable, filterable project listing by service and industry. |
| Project detail | `/projects/[slug]` | Reusable case-study template for challenge, scope, solution, evidence, approved metrics, gallery, and related work. |
| Knowledge overview | `/insights` | Featured insights, topic entry points, latest articles, and resource links. |
| Blog listing | `/insights/blog` | Featured article, search, topic filters, and article cards. |
| Article detail | `/insights/[slug]` | Article metadata, readable body, related articles, and relevant service CTA. |
| Guides / resources | `/resources` | Searchable resource library with confirmed downloadable files. |
| FAQ | `/faq` | Searchable topic filters, expandable answers, and contact CTA. |

**Localization option:** The workspace contains Vietnamese and English starter dictionaries, plus a separate language-switch demo that also illustrates Japanese. Build Vietnamese as the initial complete experience. If English is in launch scope, use locale-aware routes (for example `/vi/...` and `/en/...`) and translate all page copy, metadata, form labels, validation messages, and navigation together. Do not present the generic sample dictionaries as finished TNT translations.

## 4. Page-by-page content outline

### 4.1 Home

1. **Hero:** “Kiến tạo công nghệ. Thúc đẩy tăng trưởng.” Introduce TNM ERP, custom software, and IT staffing; primary CTA to discuss a project and secondary CTA to explore solutions.
2. **Capabilities / proof points:** show experience, team, customers, or project counts only after TNT verifies the exact figures and wording.
3. **Technology and services:** feature TNM ERP, then cards for software development, custom software, IT staffing, cloud/hosting, and UI/UX/website services. Confirm which services remain current.
4. **Why TNT:** operational understanding, technical capability, delivery process, and long-term partnership.
5. **Four-step delivery process:** receive request, analyze and advise, implement/develop, hand over and support.
6. **Project showcase:** interactive project tabs/cards, image, short description, and link to the relevant case study.
7. **Insights:** three featured article cards.
8. **Contact:** general enquiry form with contact details and an honest submission state.

### 4.2 About TNT

Present the company, its operational focus, TNM platform, and software/staffing services. Explain the food-processing specialization and the “Fit first. Customize with purpose.” approach. Include capability indicators and leadership profiles only when figures, names, titles, headshots, and publication rights are approved. Close with contact details and an enquiry form.

### 4.3 Food-processing solution

Use a conversion-focused hero and short assessment form. Explain challenges around raw materials and inventory, production progress, yield/loss and costs, quality, and lot traceability. Show a before/target workflow from fragmented data to connected materials, warehouse, production, quality, finished goods, and reporting. Explain **Ready / Extend / Out of scope** as a transparent scoping method. Add TNT’s proposed assessment and implementation steps, one approved example, FAQs, and a final CTA.

### 4.4 Services overview

Introduce ERP, software development, and IT staffing as the three core service groups. Explain that the starting point is the business problem and required resources. Link each service card to its detail page, then show selected projects and the four-step “receive / advise / implement / support” process.

### 4.5 ERP

Move from fragmented data, weak inventory visibility, unclear production progress, and slow reporting to a connected management view. List TNM modules only after capability validation. Explain how configuration and extensions are assessed, show the food-processing path and approved manufacturing case studies, answer common implementation questions, and collect an ERP-specific enquiry.

### 4.6 Software development

Address new system development, extension of an existing system, or help delivering a defined project. Potential work includes custom software, web/mobile applications, integrations, data migration, and AI applications, pending confirmation. Explain the proposed six stages—discovery, analysis, design, development, testing, and handover—and use verified project examples. The lead form should capture project type and anticipated timing.

### 4.7 IT staffing / Body Shop

Explain when a business may need added delivery capacity, specialist skills, or temporary team flexibility. Cover developer, QA/tester, and business analyst roles. Show the proposed sequence: understand the need, suggest profiles, evaluate, and start collaboration. Describe onsite, remote, or hybrid options only as confirmed commercial offerings. The form captures role and headcount.

### 4.8 Projects and project detail

The listing should support keyword search and service/industry filters, show result counts and a useful empty state, and provide a reset action. The detail template should include project context, challenge, solution, scope, approved evidence or metrics, image gallery, related projects, and a relevant CTA. Unknown slugs must return a real not-found page rather than silently displaying another case.

### 4.9 Knowledge, blog, article, resources, and FAQ

- **Knowledge overview:** feature articles, topic groupings, recent content, and links to available resources.
- **Blog:** featured article plus keyword and topic filters for ERP, production, Outsourcing, and Body Shop. Include result counts, empty state, and reset.
- **Article:** title, category, publication date, summary, body sections, related reading, and a relevant service CTA. Publish dates and copy must be editorially approved.
- **Resources:** search and topic filters, with working downloads and clear file descriptions. Current “view demo” materials are placeholders, not real resources.
- **FAQ:** searchable and filterable by ERP, Outsourcing, Body Shop, and general topics. Use keyboard-accessible expandable answers and a contact CTA.

## 5. Shared site experience and visual direction

### Global layout

- Shared header with TNT wordmark, primary navigation, service and knowledge dropdowns, language control when translations are ready, and a prominent contact CTA.
- Sticky desktop header; accessible collapsible navigation on small screens.
- Shared footer with service links, company links, contact details, social links where confirmed, privacy/terms links, and copyright.
- Consistent in-page CTA sections and reusable form presentation.

### Visual system from the prototype

- **Brand feel:** confident B2B technology, operational clarity, and practical partnership.
- **Palette:** deep navy (`#051D4F` / `#04152F`), primary blue (`#0069FF`), cyan accent (`#63C9FF`), white, and pale blue surfaces (`#F2F7FF`).
- **Typography:** Inter / Be Vietnam Pro are named in the prototype; use a reliable Vietnamese-capable font and fallbacks.
- **Icon system:** Use [Iconsax](https://app.iconsax.io/) as the shared icon source for a consistent visual language. Select one style for the site (for example, Linear) and keep icon sizing, stroke weight, and color treatment consistent across navigation, cards, process steps, and forms. Avoid mixing unrelated icon packs.
- **Layout:** centered content, a desktop maximum width around 1,230px, large editorial headings, rounded cards, subtle borders/shadows, blue iconography, and clear spacing.
- **Photography:** industrial and food-production imagery, team consultation, software/dashboard visuals, and leadership portraits. The reference PDFs show image-led split heroes, dark navy overlays, blue highlights, and bright form cards.
- **Responsive behavior:** collapse multi-column cards and grids cleanly, keep forms usable on narrow screens, prevent horizontal overflow, and retain clear CTA hierarchy.

The visual review toolbar in the prototype is for reviewers and must not appear on the public website. The PDFs use the word “logo” as a placeholder in the header/footer; obtain and use TNT’s approved logo files.

## 6. Interactions and functional requirements

- Use Next.js routes and `next/link` for navigation; use in-page anchors for section jumps and form focus.
- Dropdowns open and close by click and keyboard, close on Escape/outside click/navigation, and expose appropriate expanded/current states. Mobile navigation must expose its state to assistive technology.
- Home project tabs update the selected project title, description, image, and detail link.
- Project, blog, and resource lists support their stated filters/search; show a result count, empty state, and reset controls.
- FAQ search and topic tabs filter questions; answers expand/collapse accessibly.
- Forms use native labels, required states, appropriate input types, validation, consent where needed, loading/success/error feedback, and server-side validation.
- Prototype forms intentionally prevent real submission and storage. The production site must connect to an approved TNT inbox, CRM, or other lead destination. Never show a success message unless the request has actually been accepted for delivery.
- Keep form variants configurable by page rather than duplicating unrelated markup. Preserve useful page/source context with each submitted enquiry.
- Resource cards must link to real approved files. Do not open a demo dialog in production.

### Form fields represented in the prototype

| Form context | Fields to support |
|---|---|
| General / home | Name, email or phone, company, area of interest, industry, company size, message. |
| About / general contact | Name, email or phone, company, interest (ERP / Outsourcing / Body Shop / other), message. |
| Food-processing assessment | Name, email or phone, company, priority area (materials/inventory, production progress, yield/cost, quality/lot tracking, not sure). |
| ERP | Name, company, email, phone, ERP need, industry, message, contact consent. |
| Software development | Name, company, email, phone, project type, estimated start timing, message, contact consent. |
| IT staffing | Name, company, email, phone, role, number of people, message, contact consent. |

Confirm required fields, consent wording, retention, routing, and privacy/legal copy with TNT before connecting live forms.

## 7. Next.js implementation direction

- Start a real Next.js App Router application; the workspace currently contains no Next.js scaffold, `package.json`, or application source tree. Use TypeScript, a lockfile, lint/format configuration, and a documented local run command. Keep the current HTML as a visual/content reference, not as the production app shell.
- Use readable path routes from the sitemap, not hash-based page switching. Build shared layout elements once and compose page-specific sections from them. Keep page content separate from presentation so approved copy or a future CMS can replace the initial local data without rewriting the UI.
- Use React Server Components by default. Add `"use client"` only to components that need browser interaction, such as dropdowns, filters, accordions, project tabs, and interactive forms.
- Extract and optimize images under `public/images/`, then use `next/image` and meaningful alt text. Do not embed the image collection as base64 in source files. Verify usage rights and replace illustrative or low-quality imagery as needed.
- Add page-specific titles/descriptions, canonical URLs, Open Graph data, sitemap and robots configuration, semantic landmarks/headings, a real not-found route, and clear loading/error states. Invalid project/article slugs must not silently show another record.

### Suggested application structure

```text
src/
  app/
    layout.tsx
    page.tsx
    about/page.tsx
    solutions/food-processing/page.tsx
    services/page.tsx
    services/erp/page.tsx
    services/software-development/page.tsx
    services/it-staffing/page.tsx
    projects/page.tsx
    projects/[slug]/page.tsx
    insights/page.tsx
    insights/blog/page.tsx
    insights/[slug]/page.tsx
    resources/page.tsx
    faq/page.tsx
    api/leads/route.ts
  components/
    layout/                 # SiteHeader, SiteFooter, MainNavigation
    sections/               # Hero, ContactSection, ProcessSteps, etc.
    ui/                     # Button, Icon, Input, Select, Accordion
  features/
    leads/                  # LeadForm, DTO/schema, client and service functions
    projects/               # ProjectCard, filters, query and repository interfaces
    insights/               # ArticleCard, article listing and content access
    resources/              # GuideCard, resource listing and content access
    faq/                    # FAQ filters, accordion and content access
  content/
    services.ts
    projects.ts
    articles.ts
    resources.ts
    faqs.ts
    team.ts
  server/
    repositories/           # Content repository interfaces and local-data adapters
    integrations/           # Lead delivery provider interface and adapters
  lib/
    env.ts
    metadata.ts
    validation.ts
  types/
    content.ts
public/
  images/
  icons/
.env.example
README.md
```

This is a boundary guide, not a requirement to create an empty file for every item. Keep the implementation as small as the current scope allows, but preserve the separation between routes, reusable UI, domain features, content, and server integrations.

### Data and backend integration seams

- Define shared TypeScript models for `Project`, `Article`, `Resource`, `FAQ`, `TeamMember`, and `Service`. Validate records at the content boundary. Page components should receive these models and should not depend on raw API/database shapes.
- Provide repository interfaces such as `ProjectRepository`, `ArticleRepository`, `ResourceRepository`, and `FaqRepository`. Start with local, approved content modules. Later, add a database/CMS implementation behind the same interface so the page and card components do not need to change.
- Keep data access on the server where possible. Do not import server-only code, credentials, or private environment variables into client components. Add only non-secret configuration to `NEXT_PUBLIC_*` variables; document required private values in `.env.example` without real secrets.
- Give all enquiry forms one typed lead contract and submit to `POST /api/leads`. Include a `sourcePage` and a discriminated `inquiryType` so the future CRM/email adapter can route ERP, software, staffing, and food-processing leads correctly. Keep page-specific fields in a validated payload rather than creating unrelated form submission formats.
- Make `src/app/api/leads/route.ts` validate the request and delegate to a `LeadProvider` interface in `src/server/integrations/`. The first implementation may return a clearly stated “not configured” response; a future adapter can send to the approved CRM, email service, or backend without changing the form UI. Never return success unless the provider accepted the lead.
- Keep local/demo behavior explicitly development-only and use fabricated data. Do not collect or persist real personal information in a mock provider.
- Put validation schemas and shared types close to the feature that owns them, then export them through a stable boundary. This keeps later backend work from duplicating field definitions or changing every page.

### Shared components and implementation rules

- Suggested shared components: `SiteHeader`, `SiteFooter`, `Hero`, `SectionHeading`, `StatRow`, `ServiceCard`, `ProcessSteps`, `ProjectCard`, `ProjectFilters`, `ArticleCard`, `GuideCard`, `FaqList`, `LeadForm`, and `ContactSection`.
- Keep reusable presentational components independent of specific content files. Pass copy, links, images, and typed data through props.
- Keep form variants configurable by schema/field definitions, but preserve page-specific fields and validation. Do not make one large component responsible for routing, content loading, validation, and submission integration.
- Keep icons behind a small shared `Icon` component and use the approved Iconsax family consistently.
- Add a `README.md` with setup, environment variable names, route map, content editing guidance, and how to replace local content/lead adapters. This is part of making the project maintainable for the next front-end or back-end contributor.

## 8. Source inventory and how to use it

| Folder / file | What it contains | Use in the build |
|---|---|---|
| `../../Demo html/TNT_Website.HTML.html` | Main Vietnamese prototype with 14 pages, page copy, interactions, styling, and 21 embedded image assets. | Primary source for page structure, copy direction, visual tokens, and interaction requirements. Rebuild in Next.js rather than shipping as-is. |
| `../../Demo html/vi.json`, `../../Demo html/en.json` | Generic ABC Company strings, including authentication and e-commerce examples. | Treat only as a translation-format sample. Replace all values with approved TNT copy. |
| `../../Demo html/i18n-demo.html` | Standalone language-switch example (Vietnamese, English, Japanese), interpolation, pluralization, local preference storage. | Reference only for the idea of language switching; it is not wired into the TNT website. |
| `../../Demo html/index.html`, `../../Demo html/code.js` | Minimal `data-i18n` sample that fetches `/locales/{lang}.json`. | Demonstration snippet only; its expected locale path does not match the current file layout. |
| `../../doc/pages guideline i think/trang chủ.pdf` | One-page visual guide for the home page. | Visual reference for hierarchy, hero, proof points, service cards, projects, insights, and contact form. |
| `../../doc/pages guideline i think/about us.pdf` | One-page visual guide for the About page. | Visual reference for the company story, team, capability block, and contact section. |
| `../../doc/pages guideline i think/landing page.pdf` | One-page food-processing/ERP landing-page guide. | Visual reference for the industry hero, assessment form, workflow diagram, fit framework, and FAQ. |
| `../../doc/ss/*.png` | 18 screenshot references for headers, project cards, service modules, process sections, team/industry images, and other page regions. Some filenames contain OCR errors. | Use as supplementary layout references; verify each image visually instead of relying on its filename. |
| `../../doc/TNT- DỰ ÁN TIÊU BIỂU.docx` | Detailed Vietnamese seafood-processing ERP case-study draft. It explicitly says the customer/project/results are simulated, not a verified TNT project. | Use as a case-study content template only. Keep it labeled as a mock example or replace it with an approved real case before public use. |
| `../../doc/ss/rename_ocr.sh`, `../../doc/ss/rename_vie.sh` | Local OCR-based image-renaming helpers. | Not website code or content; do not include in the deployed application. |
| `../` | Next.js application scaffold. | Application source, routes, and assets are maintained in this directory. |

## 9. Editorial and launch checks

The source materials contain explicit placeholders and conflicting or unverified statements. Resolve these before publication:

- Confirm the correct company name/wordmark and provide approved logo assets; the PDFs visibly show a text placeholder.
- Verify the stated founding year (2017), capability statements, leadership names/titles/photos, and all experience/team/customer/project metrics. The prototype includes home figures **8+ years, 70+ engineers, 200+ customers, 300+ projects** and About figures **50+ developers, 10+ testers, 5+ BAs, 3+ PMP certificates, 2+ UI/UX**. Treat all as unapproved until verified.
- Reconcile contact details. The HTML footer/About section shows **0889 889 788** and **info@tringhiatech.vn**, while the visual references also show **+84 28 1234 5678** and a Ho Chi Minh City location. The HTML footer itself says the address needs confirmation.
- Obtain permission to identify KALA or any other customer, publish project images, describe scope, and share outcome metrics. The prototype marks project information as requiring TNT review and says no verified KALA result figures have been supplied.
- Confirm whether the wood-manufacturing, Japan recruitment, e-learning, and AI/assessment examples are real publishable work or visual/content mockups. The HTML flags several as examples needing review.
- The seafood-processing Word draft must not be presented as a real customer case. It explicitly labels itself a simulated scenario and says not to publish it as a verified achievement.
- Replace sample article dates/copy and all “demo,” “view simulation,” and placeholder download states with approved editorial content and working resources.
- Confirm the current TNM module list, software-development scope, IT staffing models, and all FAQ answers.
- Approve privacy notice, consent wording, enquiry routing, and data handling before enabling live forms.
- Confirm whether English is required at launch and provide complete reviewed translations; the current dictionaries are generic sample content.

## 10. Suggested delivery sequence

1. Confirm brand assets, factual claims, service definitions, approved contact details, and publishable project evidence.
2. Scaffold the Next.js App Router site and implement the shared layout, responsive navigation, footer, typography, and design tokens.
3. Build Home, About, and the food-processing landing page using the shared section and form components.
4. Build service pages, project listing/detail, and their filters and dynamic content records.
5. Build knowledge, blog/article, resources, and FAQ pages with real approved content.
6. Connect and configure lead forms, localized copy if needed, metadata, and approved downloadable resources.
7. Complete content and responsive review before launch; remove all prototype review indicators and demo-only states.

## 11. Launch acceptance criteria

- All 14 routes in the sitemap resolve to their own complete, responsive page and use a shared visual system.
- Navigation, in-page CTAs, project tabs, search/filter controls, empty states, FAQ controls, and real resource links work as described.
- Every public factual claim, logo/photo, customer name, case study, metric, article, and contact detail has been approved by TNT.
- Forms validate and deliver enquiries to the approved destination, with accurate success/error states and approved consent copy.
- Vietnamese content is complete; any enabled English experience is fully translated, including metadata and form states.
- The production site contains no reviewer toolbar, non-working demo downloads, simulated success submission, generic ABC strings, or unpublished sample claims.
