import { getI18n } from "@/i18n/server";
import Link from "next/link";
import { CatalogBrowser } from "@/components/catalog-browser";
import { Icon } from "@/components/ui/icon";
import type { ContentTopic } from "@/content/models";
import { PageFrame } from "@/components/site-shell";
import { ResponsiveActions } from "@/components/responsive-actions";
type HeroProps = {
    eyebrow: string;
    title: string;
    highlightedTitle?: string;
    description: string;
    action?: {
        href: string;
        label: string;
    };
};
export async function EditorialHero({ eyebrow, title, highlightedTitle, description, action, }: HeroProps) {
    const { t } = await getI18n();
    return (<section className="editorial-hero">
      <div className="container editorial-hero-inner">
        <div className="editorial-hero-copy">
          <span className="eyebrow eyebrow-light">
            {t(eyebrow)} <span className="eyebrow-rule"/>
          </span>
          <h1>
            {t(title)}
            {t(highlightedTitle && (<>
                <br />
                <span>{t(highlightedTitle)}</span>
              </>))}
          </h1>
          <p>{t(description)}</p>
          {t(action && (<ResponsiveActions><Link className="button button-primary" href={action.href}>
              {t(action.label)} <Icon name="arrowUp" size={17}/>
            </Link></ResponsiveActions>))}
        </div>
        <div aria-hidden="true" className="editorial-hero-visual">
          <div className="editorial-hero-orbit">
            <span className="editorial-hero-core">
              <Icon name="box" size={42}/>
            </span>
            <span className="editorial-node editorial-node-1">{t("Nhu cầu")}</span>
            <span className="editorial-node editorial-node-2">{t("Phạm vi")}</span>
            <span className="editorial-node editorial-node-3">{t("Giải pháp")}</span>
          </div>
        </div>
      </div>
    </section>);
}
export async function CatalogPage({ title, eyebrow, description, kind, entries, highlightedTitle, }: {
    title: string;
    eyebrow: string;
    description: string;
    kind: "project" | "article" | "guide";
    highlightedTitle?: string;
    entries: readonly {
        slug: string;
        title: string;
        summary: string;
        topic: ContentTopic;
        href: string;
        publishedAt?: string;
        dateLabel?: string;
        industry?: string;
        image?: string;
        imageAlt?: string;
        sourceLabel?: string;
        readingTime?: string;
        preview?: readonly string[];
    }[];
}) {
    const { t } = await getI18n();
    return (<main>
      <EditorialHero description={t(description)} eyebrow={t(eyebrow)} highlightedTitle={t(highlightedTitle ?? "Nội dung có cơ sở.")} title={t(title)}/>
      <section className="section">
        <div className="container">
          <CatalogBrowser entries={entries} kind={kind}/>
        </div>
      </section>
    </main>);
}
export async function ContentPageShell({ action, description, eyebrow, highlightedTitle, title, children, }: HeroProps & {
    children: React.ReactNode;
}) {
    const { t } = await getI18n();
    return (<PageFrame>
      <main>
        <EditorialHero action={action} description={t(description)} eyebrow={t(eyebrow)} highlightedTitle={t(highlightedTitle)} title={t(title)}/>
        {t(children)}
      </main>
    </PageFrame>);
}
export async function LinkCards({ items, }: {
    items: readonly {
        title: string;
        summary: string;
        href: string;
        icon: "box" | "briefcase" | "people" | "book" | "faq" | "download";
    }[];
}) {
    const { t } = await getI18n();
    return (<div className="link-card-grid">
      {t(items.map((item, index) => (<article className="link-card" key={item.href}>
          <span className="link-card-index">{t(String(index + 1).padStart(2, "0"))}</span>
          <span className="link-card-icon">
            <Icon name={item.icon} size={23}/>
          </span>
          <h2>{t(item.title)}</h2>
          <p>{t(item.summary)}</p>
          <Link className="text-link" href={item.href}>{t("Tìm hiểu thêm ")}<Icon name="arrowRight" size={16}/>
          </Link>
        </article>)))}
    </div>);
}
