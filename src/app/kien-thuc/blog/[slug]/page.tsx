import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageFrame } from "@/components/site-shell";
import { articleRepository } from "@/content/repositories";
import { createAnchorId } from "@/lib/anchor-id";
import { createPageMetadata } from "@/lib/metadata";
import Link from "next/link";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await articleRepository.findPublishedBySlug(slug);
  if (!article) return { title: "Không tìm thấy bài viết" };

  return createPageMetadata({
    title: article.title,
    description: article.summary,
    path: `/kien-thuc/blog/${slug}`,
  });
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await articleRepository.findPublishedBySlug(slug);
  if (!article) notFound();

  return (
    <PageFrame>
      <main>
        <section className="editorial-hero">
          <div className="container editorial-hero-inner">
            <div className="editorial-hero-copy">
              <span className="eyebrow eyebrow-light">
                {article.topic} <span className="eyebrow-rule" />
              </span>
              <h1>{article.title}</h1>
              <p>{article.summary}</p>
              <p className="article-meta">
                <time dateTime={article.publishedAt}>{article.publishedAt}</time>
                <span aria-hidden="true">·</span>
                {article.author}
              </p>
            </div>
          </div>
        </section>
        <article className="section article-body">
          <div className="container">
            <nav aria-label="Mục lục bài viết" className="article-toc">
              <h2>Mục lục</h2>
              <ol>
                {article.sections.map((section) => (
                  <li key={section.heading}>
                    <a href={`#${createAnchorId(section.heading)}`}>
                      {section.heading}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
            {article.sections.map((section) => (
              <section id={createAnchorId(section.heading)} key={section.heading}>
                <h2>{section.heading}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </section>
            ))}
            {article.relatedServiceHref && article.relatedServiceLabel && (
              <aside className="article-related-service">
                <h2>Trao đổi thêm</h2>
                <Link className="text-link" href={article.relatedServiceHref}>
                  {article.relatedServiceLabel}
                </Link>
              </aside>
            )}
          </div>
        </article>
      </main>
    </PageFrame>
  );
}
