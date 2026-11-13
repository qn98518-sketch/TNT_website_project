import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { PageFrame } from "@/components/site-shell";
import { articleRepository, guideRepository } from "@/content/repositories";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Kiến thức",
  description:
    "Góc nhìn thực tiễn về quản trị doanh nghiệp, ERP, sản xuất, công nghệ và phát triển phần mềm.",
  path: "/kien-thuc",
});

const knowledgeTopics = ["ERP", "Sản xuất", "Outsourcing", "Body Shop"] as const;

export default async function InsightsPage() {
  const [articles, guides] = await Promise.all([
    articleRepository.listForPreview(),
    guideRepository.listForPreview(),
  ]);
  const featuredArticles = articles.slice(0, 3);
  const recentArticles = articles.slice(0, 3);
  const featuredGuides = guides.slice(0, 2);

  return (
    <PageFrame>
      <main>
        <section className="knowledge-hero">
          <div className="container knowledge-hero-inner">
            <div className="knowledge-hero-copy">
              <span className="eyebrow eyebrow-light">
                GÓC NHÌN CÔNG NGHỆ <span className="eyebrow-rule" />
              </span>
              <h1>
                Kiến thức thực tiễn.
                <br />
                <span>Góc nhìn từ chuyên gia.</span>
              </h1>
              <p>
                Tìm hiểu về quản trị doanh nghiệp, ERP, sản xuất, công nghệ và
                những kinh nghiệm triển khai phù hợp với nhu cầu thực tế.
              </p>
              <div className="knowledge-hero-actions">
                <Link className="button button-primary" href="/kien-thuc/blog">
                  Khám phá bài viết <Icon name="arrowRight" size={16} />
                </Link>
                <Link className="button button-ghost" href="/kien-thuc/guides">
                  Xem tài liệu <Icon name="arrowDown" size={16} />
                </Link>
              </div>
            </div>
            <div className="knowledge-hero-visual">
              <Image
                src="/images/business_technology.webp"
                alt="Minh họa công nghệ và dữ liệu"
                fill
                priority
                sizes="(max-width: 860px) 100vw, 48vw"
              />
              <span className="knowledge-hero-badge">
                <Icon name="book" size={18} />
                TNT / INSIGHTS
              </span>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="section-heading">
              <span className="eyebrow">BÀI VIẾT NỔI BẬT</span>
              <h2 className="section-title">
                Xu hướng & góc nhìn
                <br />
                <span>đáng quan tâm</span>
              </h2>
              <p className="section-lede">
                Các chủ đề được sắp xếp theo nhu cầu tìm hiểu của doanh nghiệp.
                Bài viết mẫu cần được duyệt trước khi phát hành.
              </p>
            </div>
            <div className="knowledge-article-grid">
              {featuredArticles.map((article) => {
                if (!article.image || !article.imageAlt) {
                  throw new Error(`Missing article image for "${article.slug}".`);
                }
                return (
                  <article className="knowledge-article-card" key={article.slug}>
                    <Link href={`/kien-thuc/blog/${article.slug}`} className="knowledge-article-image">
                      <Image
                        src={article.image}
                        alt={article.imageAlt}
                        fill
                        sizes="(max-width: 760px) 100vw, 33vw"
                      />
                    </Link>
                    <div className="knowledge-article-copy">
                      <span className="catalog-tag">{article.topic}</span>
                      <span className="review-label">{article.sourceLabel}</span>
                      <h3>
                        <Link href={`/kien-thuc/blog/${article.slug}`}>
                          {article.title}
                        </Link>
                      </h3>
                      <p className="catalog-meta">
                        <time dateTime={article.publishedAt}>{article.dateLabel}</time>
                        <span>{article.readingTime}</span>
                      </p>
                      <p>{article.summary}</p>
                      <Link className="text-link" href={`/kien-thuc/blog/${article.slug}`}>
                        Đọc bài viết <Icon name="arrowRight" size={16} />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="section section-pale">
          <div className="container">
            <div className="section-heading centered-heading">
              <span className="eyebrow">CHỦ ĐỀ KIẾN THỨC</span>
              <h2 className="section-title">Tìm theo lĩnh vực quan tâm</h2>
              <p className="section-lede">
                Các chủ đề định hướng từ ERP đến hoạt động sản xuất và phát triển phần mềm.
              </p>
            </div>
            <div className="knowledge-topic-grid">
              {knowledgeTopics.map((topic, index) => (
                <Link
                  className="knowledge-topic-link"
                  href="/kien-thuc/blog"
                  key={topic}
                >
                  <span>0{index + 1}</span>
                  <strong>{topic}</strong>
                  <Icon name="arrowRight" size={17} />
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="knowledge-section-heading">
              <div>
                <span className="eyebrow">BÀI VIẾT MỚI</span>
                <h2 className="section-title">
                  Cập nhật kiến thức
                </h2>
                <p className="section-lede">
                  Những bài viết minh họa được tổ chức theo chủ đề và thời gian.
                </p>
              </div>
              <Link className="text-link" href="/kien-thuc/blog">
                Xem tất cả bài viết <Icon name="arrowRight" size={16} />
              </Link>
            </div>
            <div className="knowledge-recent-list">
              {recentArticles.map((article) => (
                <Link
                  className="knowledge-recent-item"
                  href={`/kien-thuc/blog/${article.slug}`}
                  key={article.slug}
                >
                  <span className="catalog-tag">{article.topic}</span>
                  <span className="knowledge-recent-date">{article.dateLabel}</span>
                  <strong>{article.title}</strong>
                  <span>{article.summary}</span>
                  <Icon name="arrowRight" size={17} />
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="section section-pale">
          <div className="container">
            <div className="knowledge-section-heading">
              <div>
                <span className="eyebrow">TÀI LIỆU / GUIDES</span>
                <h2 className="section-title">Tài liệu để tìm hiểu sâu hơn</h2>
                <p className="section-lede">
                  Mẫu định hướng thư viện tài liệu. PDF dự kiến; chưa có tệp tải
                  xuống được phát hành.
                </p>
              </div>
              <Link className="text-link" href="/kien-thuc/guides">
                Khám phá thư viện tài liệu <Icon name="arrowRight" size={16} />
              </Link>
            </div>
            <div className="knowledge-guide-grid">
              {featuredGuides.map((guide) => {
                if (!guide.image || !guide.imageAlt) {
                  throw new Error(`Missing guide image for "${guide.slug}".`);
                }
                return (
                  <article className="knowledge-guide-card" key={guide.slug}>
                    <div className="knowledge-guide-image">
                      <Image
                        src={guide.image}
                        alt={guide.imageAlt}
                        fill
                        sizes="(max-width: 760px) 100vw, 40vw"
                      />
                      <span>PDF (dự kiến)</span>
                    </div>
                    <div>
                      <span className="catalog-tag">{guide.topic}</span>
                      <h3>{guide.title}</h3>
                      <p>{guide.summary}</p>
                      <Link className="text-link" href="/kien-thuc/guides">
                        Xem bản mô phỏng <Icon name="arrowRight" size={16} />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="section knowledge-cta-section">
          <div className="container knowledge-cta">
            <div>
              <span className="eyebrow eyebrow-light">TRAO ĐỔI CÙNG TNT</span>
              <h2>Có câu hỏi về giải pháp ERP?</h2>
              <p>
                Chuyển từ việc tìm hiểu kiến thức sang trao đổi bài toán doanh nghiệp.
              </p>
            </div>
            <Link className="button button-primary" href="/dich-vu/erp">
              Nhận tư vấn ERP <Icon name="arrowRight" size={16} />
            </Link>
          </div>
        </section>
      </main>
    </PageFrame>
  );
}
