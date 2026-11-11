# TNT — Deadlines for 14 Website Interfaces

> Source: [`deadline Của DEV - Trang tính1.pdf`](../../doc/deadline%20C%E1%BB%A7a%20DEV%20-%20Trang%20t%C3%ADnh1.pdf)  
> Dates are reproduced as shown in the source. The source does not specify a year.

Control all 14 interfaces in the attached HTML. Project and article detail pages are dynamic templates that create multiple URLs. The listed routes are proposed deployment URLs and require client confirmation; the current HTML uses hash routes for review.

| # | Page | Proposed URL | Scope basis | Deadline (end of day) | Content / functionality | Required inputs | FE owner | Status |
|---:|---|---|---|---|---|---|---|---|
| 1 | Home | `/` | Client layout | 12/11 | Banner, KPIs, TNM ERP, projects, news, form | Logo/images, metrics, approved copy | — | — |
| 2 | About TNT | `/ve-tnt` | Client layout | 12/11 | Hero, company, team, capabilities, contact | Leadership photos/titles, capability data | — | — |
| 3 | Food-processing solution | `/giai-phap-nganh-thuc-pham` | Client layout | 12/11 | Landing page with hero form, workflow, FAQ/form | Factory images, solution details, approved FAQs | — | — |
| 4 | Services overview | `/dich-vu` | BA proposal — approval required | 13/11 | Three cards, process, form | Confirm page is included in release | — | — |
| 5 | ERP | `/dich-vu/erp` | Per sitemap | 13/11 | ERP modules, business problems, form | Module capabilities, implementation policy | — | — |
| 6 | Outsourcing | `/dich-vu/outsourcing` | Per sitemap | 13/11 | Development services, process, form | Actual services, technologies, images | — | — |
| 7 | Body Shop | `/dich-vu/body-shop` | Per sitemap | 13/11 | Roles, engagement models, form | Available staff, working models | — | — |
| 8 | Featured projects | `/du-an` | Per sitemap | 13/11 | Project list and filters | Approved list of publishable projects | — | — |
| 9 | Project detail | `/du-an/{slug}` | Dynamic template | 15/11 | Challenge, solution, results, images | Images/logo, publishing permission, results | — | — |
| 10 | Knowledge overview | `/kien-thuc` | BA proposal — approval required | 14/11 | Featured article, topics, Guides | Confirm page is included in release | — | — |
| 11 | Blog | `/kien-thuc/blog` | Per sitemap | 14/11 | Article list, filters, search | Article list and categories | — | — |
| 12 | Article detail | `/kien-thuc/blog/{slug}` | Dynamic template | 15/11 | Article body, table of contents, related articles | Draft, thumbnail, author/date | — | — |
| 13 | Resources / Guides | `/kien-thuc/guides` | Per sitemap | 14/11 | File list, search, PDF downloads | PDF files and publishing rights | — | — |
| 14 | FAQ | `/kien-thuc/faq` | Per sitemap | 14/11 | Questions, filters, accordion | Official questions and answers | — | — |

## Notes from the source

- The case study has been requested to be removed.
- “About TNT” may be a section on the site or a separate URL under the sitemap. Confirm this does not add a page beyond the 14 interfaces.
- The Services overview and Knowledge overview are BA proposals and require approval.
- The FE owner and status columns are blank in the source; they are left unassigned here.
