import { getI18n } from "@/i18n/server";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { PageFrame } from "@/components/site-shell";
import { articleRepository, guideRepository } from "@/content/repositories";
import { createPageMetadata } from "@/lib/metadata";
export async function generateMetadata() { return createPageMetadata({
    title: "Kiến thức",
    description: "Góc nhìn thực tiễn về quản trị doanh nghiệp, ERP, sản xuất, công nghệ và phát triển phần mềm.",
    path: "/kien-thuc",
}); }
const knowledgeTopics = ["ERP", "Sản xuất", "Outsourcing", "Body Shop"] as const;
export default async function InsightsPage() {
    const { t } = await getI18n();
    const [articles, guides] = await Promise.all([
        articleRepository.listForPreview(),
        guideRepository.listForPreview(),
    ]);
    const featuredArticles = articles.slice(0, 3);
    const recentArticles = articles.slice(0, 3);
    const featuredGuides = guides.slice(0, 2);
    return (<PageFrame>
      <main>
        <section className="knowledge-hero">
          <div className="container knowledge-hero-inner">
            <div className="knowledge-hero-copy">
              <span className="eyebrow eyebrow-light">{t("GÓC NHÌN CÔNG NGHỆ ")}<span className="eyebrow-rule"/>
              </span>
              <h1>{t("Kiến thức thực tiễn.")}<br />
                <span>{t("Góc nhìn từ chuyên gia.")}</span>
              </h1>
              <p>{t("Tìm hiểu về quản trị doanh nghiệp, ERP, sản xuất, công nghệ và những kinh nghiệm triển khai phù hợp với nhu cầu thực tế.")}</p>
              <div className="knowledge-hero-actions">
                <Link className="button button-primary" href="/kien-thuc/blog">{t("Khám phá bài viết ")}<Icon name="arrowRight" size={16}/>
                </Link>
                <Link className="button button-ghost" href="/kien-thuc/guides">{t("Xem tài liệu ")}<Icon name="arrowDown" size={16}/>
                </Link>
              </div>
            </div>
            <div className="knowledge-hero-visual">
              <Image src="/images/business_technology.webp" alt={t("Minh họa công nghệ và dữ liệu")} fill priority sizes="(max-width: 860px) 100vw, 48vw"/>
              <span className="knowledge-hero-badge">
                <Icon name="book" size={18}/>{t("TNT / INSIGHTS")}</span>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="section-heading">
              <span className="eyebrow">{t("BÀI VIẾT NỔI BẬT")}</span>
              <h2 className="section-title">{t("Xu hướng & góc nhìn")}<br />
                <span>{t("đáng quan tâm")}</span>
              </h2>
              <p className="section-lede">{t("Các chủ đề được sắp xếp theo nhu cầu tìm hiểu của doanh nghiệp. Bài viết mẫu cần được duyệt trước khi phát hành.")}</p>
            </div>
            <div className="knowledge-article-grid">
              {t(featuredArticles.map((article) => {
            if (!article.image || !article.imageAlt) {
                throw new Error(`Missing article image for "${article.slug}".`);
            }
            return (<article className="knowledge-article-card" key={article.slug}>
                    <Link href={`/kien-thuc/blog/${article.slug}`} className="knowledge-article-image">
                      <Image src={article.image} alt={t(article.imageAlt)} fill sizes="(max-width: 760px) 100vw, 33vw"/>
                    </Link>
                    <div className="knowledge-article-copy">
                      <span className="catalog-tag">{t(article.topic)}</span>
                      <span className="review-label">{t(article.sourceLabel)}</span>
                      <h3>
                        <Link href={`/kien-thuc/blog/${article.slug}`}>
                          {t(article.title)}
                        </Link>
                      </h3>
                      <p className="catalog-meta">
                        <time dateTime={article.publishedAt}>{t(article.dateLabel)}</time>
                        <span>{t(article.readingTime)}</span>
                      </p>
                      <p>{t(article.summary)}</p>
                      <Link className="text-link" href={`/kien-thuc/blog/${article.slug}`}>{t("Đọc bài viết ")}<Icon name="arrowRight" size={16}/>
                      </Link>
                    </div>
                  </article>);
        }))}
            </div>
          </div>
        </section>

        <section className="section section-pale">
          <div className="container">
            <div className="section-heading centered-heading">
              <span className="eyebrow">{t("CHỦ ĐỀ KIẾN THỨC")}</span>
              <h2 className="section-title">{t("Tìm theo lĩnh vực quan tâm")}</h2>
              <p className="section-lede">{t("Các chủ đề định hướng từ ERP đến hoạt động sản xuất và phát triển phần mềm.")}</p>
            </div>
            <div className="knowledge-topic-grid">
              {t(knowledgeTopics.map((topic, index) => (<Link className="knowledge-topic-link" href="/kien-thuc/blog" key={topic}>
                  <span>{t("0")}{t(index + 1)}</span>
                  <strong>{t(topic)}</strong>
                  <Icon name="arrowRight" size={17}/>
                </Link>)))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="knowledge-section-heading">
              <div>
                <span className="eyebrow">{t("BÀI VIẾT MỚI")}</span>
                <h2 className="section-title">{t("Cập nhật kiến thức")}</h2>
                <p className="section-lede">{t("Những bài viết minh họa được tổ chức theo chủ đề và thời gian.")}</p>
              </div>
              <Link className="text-link" href="/kien-thuc/blog">{t("Xem tất cả bài viết ")}<Icon name="arrowRight" size={16}/>
              </Link>
            </div>
            <div className="knowledge-recent-list">
              {t(recentArticles.map((article) => (<Link className="knowledge-recent-item" href={`/kien-thuc/blog/${article.slug}`} key={article.slug}>
                  <span className="catalog-tag">{t(article.topic)}</span>
                  <span className="knowledge-recent-date">{t(article.dateLabel)}</span>
                  <strong>{t(article.title)}</strong>
                  <span>{t(article.summary)}</span>
                  <Icon name="arrowRight" size={17}/>
                </Link>)))}
            </div>
          </div>
        </section>

        <section className="section section-pale">
          <div className="container">
            <div className="knowledge-section-heading">
              <div>
                <span className="eyebrow">{t("TÀI LIỆU / GUIDES")}</span>
                <h2 className="section-title">{t("Tài liệu để tìm hiểu sâu hơn")}</h2>
                <p className="section-lede">{t("Mẫu định hướng thư viện tài liệu. PDF dự kiến; chưa có tệp tải xuống được phát hành.")}</p>
              </div>
              <Link className="text-link" href="/kien-thuc/guides">{t("Khám phá thư viện tài liệu ")}<Icon name="arrowRight" size={16}/>
              </Link>
            </div>
            <div className="knowledge-guide-grid">
              {t(featuredGuides.map((guide) => {
            if (!guide.image || !guide.imageAlt) {
                throw new Error(`Missing guide image for "${guide.slug}".`);
            }
            return (<article className="knowledge-guide-card" key={guide.slug}>
                    <div className="knowledge-guide-image">
                      <Image src={guide.image} alt={t(guide.imageAlt)} fill sizes="(max-width: 760px) 100vw, 40vw"/>
                      <span>{t("PDF (dự kiến)")}</span>
                    </div>
                    <div>
                      <span className="catalog-tag">{t(guide.topic)}</span>
                      <h3>{t(guide.title)}</h3>
                      <p>{t(guide.summary)}</p>
                      <Link className="text-link" href="/kien-thuc/guides">{t("Xem bản mô phỏng ")}<Icon name="arrowRight" size={16}/>
                      </Link>
                    </div>
                  </article>);
        }))}
            </div>
          </div>
        </section>

        <section className="section knowledge-cta-section">
          <div className="container knowledge-cta">
            <div>
              <span className="eyebrow eyebrow-light">{t("TRAO ĐỔI CÙNG TNT")}</span>
              <h2>{t("Có câu hỏi về giải pháp ERP?")}</h2>
              <p>{t("Chuyển từ việc tìm hiểu kiến thức sang trao đổi bài toán doanh nghiệp.")}</p>
            </div>
            <Link className="button button-primary" href="/dich-vu/erp">{t("Nhận tư vấn ERP ")}<Icon name="arrowRight" size={16}/>
            </Link>
          </div>
        </section>
      </main>
    </PageFrame>);
}
