import Image from "next/image";
import Link from "next/link";
import { CatalogBrowser } from "@/components/catalog-browser";
import { EditorialHero } from "@/components/content-page";
import { Icon } from "@/components/ui/icon";
import { PageFrame } from "@/components/site-shell";
import { articleRepository } from "@/content/repositories";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Blog",
  description:
    "Tìm kiếm góc nhìn về ERP, sản xuất và phát triển công nghệ. Bài viết mẫu được hiển thị kèm nhãn cần duyệt.",
  path: "/kien-thuc/blog",
});

export default async function BlogPage() {
  const articles = await articleRepository.listForPreview();
  const featuredArticle = articles[0];
  if (!featuredArticle) {
    throw new Error("Missing featured article content.");
  }
  const featuredImage = featuredArticle.thumbnail ?? featuredArticle.image;
  const featuredImageAlt =
    featuredArticle.thumbnailAlt ?? featuredArticle.imageAlt;
  if (!featuredImage || !featuredImageAlt) {
    throw new Error(`Missing article image for "${featuredArticle.slug}".`);
  }

  return (
    <PageFrame>
      <main>
        <EditorialHero
          action={{ href: "#blog-featured", label: "Đọc bài nổi bật" }}
          description="Bài viết về ERP, sản xuất, phát triển phần mềm và chuyển đổi số cho doanh nghiệp."
          eyebrow="BLOG / KIẾN THỨC"
          highlightedTitle="gắn với vận hành."
          title="Góc nhìn công nghệ"
        />
        <section className="section" id="blog-featured">
          <div className="container featured-article-layout">
            <Link
              className="featured-article-image"
              href={`/kien-thuc/blog/${featuredArticle.slug}`}
            >
              <Image
                src={featuredImage}
                alt={featuredImageAlt}
                fill
                sizes="(max-width: 760px) 100vw, 55vw"
              />
              <span className="review-label">{featuredArticle.sourceLabel}</span>
            </Link>
            <div className="featured-article-copy">
              <span className="eyebrow">ERP / BÀI NỔI BẬT</span>
              <span className="catalog-tag">{featuredArticle.topic}</span>
              <h2>{featuredArticle.title}</h2>
              <p>{featuredArticle.summary}</p>
              <p className="catalog-meta">
                <time dateTime={featuredArticle.publishedAt}>
                  {featuredArticle.dateLabel}
                </time>
                <span>{featuredArticle.readingTime}</span>
              </p>
              <Link
                className="text-link"
                href={`/kien-thuc/blog/${featuredArticle.slug}`}
              >
                Đọc bài viết <Icon name="arrowRight" size={16} />
              </Link>
            </div>
          </div>
        </section>
        <section className="section section-pale" id="blog-list">
          <div className="container">
            <div className="section-heading">
              <span className="eyebrow">THƯ VIỆN BÀI VIẾT</span>
              <h2 className="section-title">
                Khám phá theo chủ đề
              </h2>
              <p className="section-lede">
                Tìm kiếm và lọc bài viết theo lĩnh vực bạn quan tâm.
              </p>
            </div>
            <CatalogBrowser
              entries={articles.map((article) => ({
                slug: article.slug,
                title: article.title,
                summary: article.summary,
                topic: article.topic,
                href: `/kien-thuc/blog/${article.slug}`,
                publishedAt: article.publishedAt,
                dateLabel: article.dateLabel,
                readingTime: article.readingTime,
                image: article.thumbnail ?? article.image,
                imageAlt: article.thumbnailAlt ?? article.imageAlt,
                sourceLabel: article.sourceLabel,
              }))}
              kind="article"
            />
          </div>
        </section>
        <section className="section blog-list-cta">
          <div className="container">
            <span className="eyebrow">TRAO ĐỔI CÙNG TNT</span>
            <h2>Bạn đang tìm giải pháp phù hợp cho doanh nghiệp?</h2>
            <p>Trao đổi với TNT về ERP và bài toán vận hành thực tế.</p>
            <Link className="button button-primary" href="/dich-vu/erp">
              Khám phá ERP <Icon name="arrowRight" size={16} />
            </Link>
          </div>
        </section>
      </main>
    </PageFrame>
  );
}
