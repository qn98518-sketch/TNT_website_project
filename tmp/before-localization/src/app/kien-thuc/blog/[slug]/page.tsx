import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PageFrame } from "@/components/site-shell";
import { articleRepository } from "@/content/repositories";
import { createAnchorId } from "@/lib/anchor-id";
import { createPageMetadata } from "@/lib/metadata";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await articleRepository.findForPreviewBySlug(slug);
  if (!article) return { title: "Không tìm thấy bài viết" };

  return createPageMetadata({
    title: article.title,
    description: article.summary,
    path: `/kien-thuc/blog/${slug}`,
  });
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await articleRepository.findForPreviewBySlug(slug);
  if (!article) notFound();
  const allArticles = await articleRepository.listForPreview();
  const relatedArticles = article.relatedArticleSlugs
    .map((relatedSlug) => allArticles.find((item) => item.slug === relatedSlug))
    .filter((item) => item !== undefined);

  return (
    <PageFrame>
      <main>
        <section className="article-hero">
          <div className="container article-hero-inner">
            <div className="article-hero-copy">
              <nav aria-label="Breadcrumb" className="article-breadcrumb">
                <Link href="/kien-thuc">Kiến thức</Link>
                <span aria-hidden="true">/</span>
                <Link href="/kien-thuc/blog">Blog</Link>
                <span aria-hidden="true">/</span>
                <span>Bài viết</span>
              </nav>
              <span className="article-kicker">
                GÓC NHÌN / {article.topic} · {article.dateLabel} · {article.readingTime}
              </span>
              <h1>{article.title}</h1>
              <p>{article.summary}</p>
              {article.sourceLabel && (
                <span className="review-label">{article.sourceLabel}</span>
              )}
            </div>
            {article.image && (
              <div className="article-hero-image">
                <Image
                  alt={article.imageAlt ?? ""}
                  fill
                  priority
                  sizes="(max-width: 760px) 100vw, 48vw"
                  src={article.image}
                />
              </div>
            )}
          </div>
        </section>
        <article className="article-layout">
          <div className="container article-layout-inner">
            <nav aria-label="Mục lục bài viết" className="article-toc">
              <span className="eyebrow">TRONG BÀI VIẾT</span>
              <ol>
                {article.sections.map((section, index) => (
                  <li key={section.heading}>
                    <span>{String(index + 1).padStart(2, "0")} /</span>
                    <a href={`#${createAnchorId(section.heading)}`}>
                      {section.heading}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
            <div className="article-copy">
              {article.sections.map((section, index) => (
                <section id={createAnchorId(section.heading)} key={section.heading}>
                  <span className="eyebrow">
                    {String(index + 1).padStart(2, "0")} / {["TỔNG QUAN", "THÁCH THỨC", "HƯỚNG TIẾP CẬN", "GỢI Ý"][index] ?? "NỘI DUNG"}
                  </span>
                  <h2>{section.heading}</h2>
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </section>
              ))}
            {article.relatedServiceHref && article.relatedServiceLabel && (
              <aside className="article-related-service">
                <h2>Quan tâm đến giải pháp?</h2>
                <p>Khám phá cách TNT tiếp cận bài toán quản trị doanh nghiệp.</p>
                <Link className="text-link" href={article.relatedServiceHref}>
                  {article.relatedServiceLabel}
                </Link>
              </aside>
            )}
            </div>
          </div>
        </article>
        {relatedArticles.length > 0 && (
          <section className="section article-related">
            <div className="container">
              <div className="section-heading">
                <span className="eyebrow">ĐỌC TIẾP</span>
                <h2 className="section-title">Bài viết liên quan</h2>
                <p className="section-lede">Những nội dung có thể bạn quan tâm.</p>
              </div>
              <div className="catalog-grid">
                {relatedArticles.map((related) => (
                  <Link
                    className="article-related-card"
                    href={`/kien-thuc/blog/${related.slug}`}
                    key={related.slug}
                  >
                    {related.thumbnail && (
                      <span className="article-related-image">
                        <Image
                          alt={related.thumbnailAlt ?? ""}
                          fill
                          sizes="(max-width: 700px) 100vw, 33vw"
                          src={related.thumbnail}
                        />
                      </span>
                    )}
                    <span className="catalog-tag">{related.topic}</span>
                    <time dateTime={related.publishedAt}>{related.dateLabel}</time>
                    <strong>{related.title}</strong>
                    <span>{related.summary}</span>
                    <span className="text-link">Đọc bài viết <Icon name="arrowRight" size={16} /></span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </PageFrame>
  );
}
