import { LinkCards } from "@/components/content-page";
import { EditorialHero } from "@/components/content-page";
import { PageFrame } from "@/components/site-shell";
import { articleRepository, guideRepository } from "@/content/repositories";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Kiến thức",
  description:
    "Góc nhìn, bài viết và tài liệu sẽ được cập nhật sau khi nội dung biên tập và quyền phát hành được duyệt.",
  path: "/kien-thuc",
});

export default async function InsightsPage() {
  const [articles, guides] = await Promise.all([
    articleRepository.listPublished(),
    guideRepository.listPublished(),
  ]);

  return (
    <PageFrame>
      <main>
        <EditorialHero
          description="Nội dung về ERP, sản xuất và phát triển công nghệ sẽ xuất hiện khi được biên tập và duyệt."
          eyebrow="GÓC NHÌN & KIẾN THỨC"
          highlightedTitle="Chia sẻ có căn cứ."
          title="Kiến thức gắn với vận hành."
        />
        <section className="section">
          <div className="container">
            <div className="section-heading centered-heading">
              <span className="eyebrow">KHÁM PHÁ NỘI DUNG</span>
              <h2 className="section-title">
                Cập nhật theo
                <br />
                <span>nội dung đã duyệt.</span>
              </h2>
              <p className="section-lede">
                Hiện chưa có bài viết hoặc tệp hướng dẫn được phê duyệt để công
                bố.
              </p>
            </div>
            <LinkCards
              items={[
                {
                  title: "Blog",
                  summary: `${articles.length} bài viết đã được duyệt.`,
                  href: "/kien-thuc/blog",
                  icon: "book",
                },
                {
                  title: "Tài liệu hướng dẫn",
                  summary: `${guides.length} tài liệu có tệp và quyền phát hành đã xác nhận.`,
                  href: "/kien-thuc/guides",
                  icon: "download",
                },
                {
                  title: "Câu hỏi thường gặp",
                  summary: "Tìm kiếm câu hỏi theo chủ đề và trao đổi với TNT.",
                  href: "/kien-thuc/faq",
                  icon: "faq",
                },
              ]}
            />
          </div>
        </section>
      </main>
    </PageFrame>
  );
}
