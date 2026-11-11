import Link from "next/link";
import { CatalogBrowser } from "@/components/catalog-browser";
import { Icon } from "@/components/ui/icon";
import type { ContentTopic } from "@/content/models";
import { PageFrame } from "@/components/site-shell";

type HeroProps = {
  eyebrow: string;
  title: string;
  highlightedTitle?: string;
  description: string;
  action?: { href: string; label: string };
};

export function EditorialHero({
  eyebrow,
  title,
  highlightedTitle,
  description,
  action,
}: HeroProps) {
  return (
    <section className="editorial-hero">
      <div className="container editorial-hero-inner">
        <div className="editorial-hero-copy">
          <span className="eyebrow eyebrow-light">
            {eyebrow} <span className="eyebrow-rule" />
          </span>
          <h1>
            {title}
            {highlightedTitle && (
              <>
                <br />
                <span>{highlightedTitle}</span>
              </>
            )}
          </h1>
          <p>{description}</p>
          {action && (
            <Link className="button button-primary" href={action.href}>
              {action.label} <Icon name="arrowUp" size={17} />
            </Link>
          )}
        </div>
        <div aria-hidden="true" className="editorial-hero-visual">
          <div className="editorial-hero-orbit">
            <span className="editorial-hero-core">
              <Icon name="box" size={42} />
            </span>
            <span className="editorial-node editorial-node-1">Nhu cầu</span>
            <span className="editorial-node editorial-node-2">Phạm vi</span>
            <span className="editorial-node editorial-node-3">Giải pháp</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CatalogPage({
  title,
  eyebrow,
  description,
  kind,
  entries,
}: {
  title: string;
  eyebrow: string;
  description: string;
  kind: "project" | "article" | "guide";
  entries: readonly {
    slug: string;
    title: string;
    summary: string;
    topic: ContentTopic;
    href: string;
    publishedAt?: string;
  }[];
}) {
  return (
    <main>
      <EditorialHero
        description={description}
        eyebrow={eyebrow}
        highlightedTitle="Nội dung có cơ sở."
        title={title}
      />
      <section className="section">
        <div className="container">
          <CatalogBrowser entries={entries} kind={kind} />
        </div>
      </section>
    </main>
  );
}

export function ContentPageShell({
  action,
  description,
  eyebrow,
  highlightedTitle,
  title,
  children,
}: HeroProps & { children: React.ReactNode }) {
  return (
    <PageFrame>
      <main>
        <EditorialHero
          action={action}
          description={description}
          eyebrow={eyebrow}
          highlightedTitle={highlightedTitle}
          title={title}
        />
        {children}
      </main>
    </PageFrame>
  );
}

export function LinkCards({
  items,
}: {
  items: readonly {
    title: string;
    summary: string;
    href: string;
    icon: "box" | "briefcase" | "people" | "book" | "faq" | "download";
  }[];
}) {
  return (
    <div className="link-card-grid">
      {items.map((item, index) => (
        <article className="link-card" key={item.href}>
          <span className="link-card-index">{String(index + 1).padStart(2, "0")}</span>
          <span className="link-card-icon">
            <Icon name={item.icon} size={23} />
          </span>
          <h2>{item.title}</h2>
          <p>{item.summary}</p>
          <Link className="text-link" href={item.href}>
            Tìm hiểu thêm <Icon name="arrowRight" size={16} />
          </Link>
        </article>
      ))}
    </div>
  );
}
