import { getI18n } from "@/i18n/server";
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
    params: Promise<{
        slug: string;
    }>;
};
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { t } = await getI18n();
    const { slug } = await params;
    const article = await articleRepository.findForPreviewBySlug(slug);
    if (!article)
        return { title: t("Không tìm thấy bài viết") };
    return createPageMetadata({
        title: article.title,
        description: article.summary,
        path: `/kien-thuc/blog/${slug}`,
    });
}
export default async function ArticlePage({ params }: Props) {
    const { t } = await getI18n();
    const { slug } = await params;
    const article = await articleRepository.findForPreviewBySlug(slug);
    if (!article)
        notFound();
    const allArticles = await articleRepository.listForPreview();
    const relatedArticles = article.relatedArticleSlugs
        .map((relatedSlug) => allArticles.find((item) => item.slug === relatedSlug))
        .filter((item) => item !== undefined);
    return (<PageFrame>
      <main>
        <section className="article-hero">
          <div className="container article-hero-inner">
            <div className="article-hero-copy">
              <nav aria-label={t("Breadcrumb")} className="article-breadcrumb">
                <Link href="/kien-thuc">{t("Kiến thức")}</Link>
                <span aria-hidden="true">{t("/")}</span>
                <Link href="/kien-thuc/blog">{t("Blog")}</Link>
                <span aria-hidden="true">{t("/")}</span>
                <span>{t("Bài viết")}</span>
              </nav>
              <span className="article-kicker">{t("GÓC NHÌN / ")}{t(article.topic)}{t(" · ")}{t(article.dateLabel)}{t(" · ")}{t(article.readingTime)}
              </span>
              <h1>{t(article.title)}</h1>
              <p>{t(article.summary)}</p>
              {t(article.sourceLabel && (<span className="review-label">{t(article.sourceLabel)}</span>))}
            </div>
            {t(article.image && (<div className="article-hero-image">
                <Image alt={t(article.imageAlt ?? "")} fill priority sizes="(max-width: 760px) 100vw, 48vw" src={article.image}/>
              </div>))}
          </div>
        </section>
        <article className="article-layout">
          <div className="container article-layout-inner">
            <nav aria-label={t("Mục lục bài viết")} className="article-toc">
              <span className="eyebrow">{t("TRONG BÀI VIẾT")}</span>
              <ol>
                {t(article.sections.map((section, index) => (<li key={section.heading}>
                    <span>{t(String(index + 1).padStart(2, "0"))}{t(" /")}</span>
                    <a href={`#${createAnchorId(section.heading)}`}>
                      {t(section.heading)}
                    </a>
                  </li>)))}
              </ol>
            </nav>
            <div className="article-copy">
              {t(article.sections.map((section, index) => (<section id={createAnchorId(section.heading)} key={section.heading}>
                  <span className="eyebrow">
                    {t(String(index + 1).padStart(2, "0"))}{t(" / ")}{t(["TỔNG QUAN", "THÁCH THỨC", "HƯỚNG TIẾP CẬN", "GỢI Ý"][index] ?? "NỘI DUNG")}
                  </span>
                  <h2>{t(section.heading)}</h2>
                  {t(section.paragraphs.map((paragraph) => (<p key={paragraph}>{t(paragraph)}</p>)))}
                </section>)))}
            {t(article.relatedServiceHref && article.relatedServiceLabel && (<aside className="article-related-service">
                <h2>{t("Quan tâm đến giải pháp?")}</h2>
                <p>{t("Khám phá cách TNT tiếp cận bài toán quản trị doanh nghiệp.")}</p>
                <Link className="text-link" href={article.relatedServiceHref}>
                  {t(article.relatedServiceLabel)}
                </Link>
              </aside>))}
            </div>
          </div>
        </article>
        {t(relatedArticles.length > 0 && (<section className="section article-related">
            <div className="container">
              <div className="section-heading">
                <span className="eyebrow">{t("ĐỌC TIẾP")}</span>
                <h2 className="section-title">{t("Bài viết liên quan")}</h2>
                <p className="section-lede">{t("Những nội dung có thể bạn quan tâm.")}</p>
              </div>
              <div className="catalog-grid">
                {t(relatedArticles.map((related) => (<Link className="article-related-card" href={`/kien-thuc/blog/${related.slug}`} key={related.slug}>
                    {t(related.thumbnail && (<span className="article-related-image">
                        <Image alt={t(related.thumbnailAlt ?? "")} fill sizes="(max-width: 700px) 100vw, 33vw" src={related.thumbnail}/>
                      </span>))}
                    <span className="catalog-tag">{t(related.topic)}</span>
                    <time dateTime={related.publishedAt}>{t(related.dateLabel)}</time>
                    <strong>{t(related.title)}</strong>
                    <span>{t(related.summary)}</span>
                    <span className="text-link">{t("Đọc bài viết ")}<Icon name="arrowRight" size={16}/></span>
                  </Link>)))}
              </div>
            </div>
          </section>))}
      </main>
    </PageFrame>);
}
