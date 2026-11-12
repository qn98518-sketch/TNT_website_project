# TNT website

Vietnamese corporate website for Trí Nghĩa Tech, built with Next.js App Router,
React, TypeScript, Tailwind CSS, and Iconsax Linear icons.

## Get started

Requirements: Node.js 20.9 or newer and npm.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Set `NEXT_PUBLIC_SITE_URL`
to the canonical public URL before deployment. Keep `.env.local` private and
never commit credentials.

Run the project checks:

```bash
npm run lint
npm run build
```

## Routes

The route list follows the deadline source in [`docs/DEADLINE.md`](./docs/DEADLINE.md).
The implementation target is a complete Next.js recreation of the user-facing
demo, with local hard-coded data for its blog, articles, projects, guides, and
other repeated content.

| Page | Route |
|---|---|
| Home | `/` |
| About TNT | `/ve-tnt` |
| Food-processing solution | `/giai-phap-nganh-thuc-pham` |
| Services overview | `/dich-vu` |
| ERP | `/dich-vu/erp` |
| Outsourcing | `/dich-vu/outsourcing` |
| Body Shop | `/dich-vu/body-shop` |
| Featured projects | `/du-an` |
| Project detail | `/du-an/[slug]` |
| Knowledge overview | `/kien-thuc` |
| Blog | `/kien-thuc/blog` |
| Article detail | `/kien-thuc/blog/[slug]` |
| Resources / Guides | `/kien-thuc/guides` |
| FAQ | `/kien-thuc/faq` |

Services and Knowledge overview are BA proposals in the deadline source and
require release-owner confirmation. The proposed Vietnamese URLs come from
that source.

## Documentation

Project and source Markdown documents are organized in [`docs/`](./docs/):

- [`WEBSITE_BRIEF.md`](./docs/WEBSITE_BRIEF.md) — product, design, architecture,
  and content requirements.
- [`DEADLINE.md`](./docs/DEADLINE.md) — the 14 interfaces, proposed URLs,
  deadlines, and release notes.
- [`WEBSITE_REVIEW.md`](./docs/WEBSITE_REVIEW.md) — implementation status and
  content-approval boundaries.
- [`DEMO_COMPARISON_GAP_REVIEW.md`](./docs/DEMO_COMPARISON_GAP_REVIEW.md) —
  comparison against the HTML prototype and visual QA notes.

The PDF, image, and other source references remain in the workspace `doc/` and
`Demo html/` directories. The HTML demo is the source of truth for user-facing
content and visual structure. See the revised implementation direction in
[`docs/DEMO_COMPARISON_GAP_REVIEW.md`](./docs/DEMO_COMPARISON_GAP_REVIEW.md).

## Content and data

- Typed content models are in `src/content/models.ts`.
- Vietnamese page copy and demo-parity fixture records belong in
  `src/content/local-data.ts`.
- Repository interfaces and the local adapter are in
  `src/content/repositories.ts`. Keep content separate from page components so
  a backend can replace the local adapter later; this build uses static local
  data and does not add a CMS, database, or content API.
- Populate the Blog and article routes with all demo records, full article
  copy, metadata, and related content. Populate project, guide/resource, and
  FAQ records to match the demo. Do not leave these collections empty or use
  editorial prompts in place of demo content.
- Use the demo's supplied imagery and reproduce its page-specific visual
  details. Retain visible sample/review labels for unverified content. The
  deadline's case-study removal note remains a public-release constraint; do
  not present the simulated example as verified TNT work.

Preserve the demo copy and local fixture data, including its source labels.
Unverified company metrics, contact details, leadership identities, customer
names or outcomes, article authors or dates, and simulated project details must
not be represented as verified facts. Do not present the seafood-processing
case draft as a real customer project. See the [content review](./docs/WEBSITE_REVIEW.md)
for public-release boundaries.

## Lead form and delivery

`src/server/leads/contract.ts` defines the shared lead submission and
validation contract. `POST /api/leads` validates requests and delegates through
the `LeadDeliveryRepository` interface in `src/server/leads/delivery.ts`.

The configured provider is `LEAD_PROVIDER=none`. In this state, a valid
submission returns `503 LEAD_DELIVERY_UNAVAILABLE`; no lead is sent or stored,
and the form displays an unavailable state. The site only reports success
after a configured provider confirms acceptance.

Before enabling delivery, implement an approved adapter, configure the
provider, and get approval for consent text, privacy notice, retention, routing,
and credentials. Unknown provider values fail explicitly.

## Environment variables

| Name | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical site origin used by metadata, `sitemap.xml`, and `robots.txt`. Set this to the deployed HTTPS origin in production. |
| `LEAD_PROVIDER` | Lead-delivery adapter selector. Keep `none` until an approved provider adapter is implemented. |

See [`.env.example`](./.env.example) for the local template. Do not put
provider secrets in `NEXT_PUBLIC_*` variables.
