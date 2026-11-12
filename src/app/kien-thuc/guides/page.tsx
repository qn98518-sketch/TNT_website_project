import Link from "next/link";
import { CatalogBrowser } from "@/components/catalog-browser";
import { EditorialHero } from "@/components/content-page";
import { Icon } from "@/components/ui/icon";
import { PageFrame } from "@/components/site-shell";
import { guideRepository } from "@/content/repositories";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Tài liệu hướng dẫn",
  description:
    "Tìm hiểu các bản mô phỏng tài liệu về ERP, sản xuất, phần mềm và nhân lực; không có tệp giả lập tải xuống.",
  path: "/kien-thuc/guides",
});

export default async function GuidesPage() {
  const guides = await guideRepository.listForPreview();

  return (
    <PageFrame>
      <main>
        <EditorialHero
          action={{ href: "#resource-library", label: "Khám phá tài liệu" }}
          description="Tài liệu tham khảo được trình bày trực tiếp trên trang. Các tệp PDF trong bản demo là mô phỏng, chưa phải tài liệu phát hành."
          eyebrow="TNT / RESOURCE"
          highlightedTitle="cho quyết định tốt hơn."
          title="Nguồn tài liệu"
        />
        <section className="section" id="resource-library">
          <div className="container">
            <CatalogBrowser
              entries={guides.map((guide) => ({
                slug: guide.slug,
                title: guide.title,
                summary: `${guide.summary} ${guide.fileType} · ${guide.fileSize}`,
                topic: guide.topic,
                href: guide.fileUrl,
                image: guide.image,
                imageAlt: guide.imageAlt,
                sourceLabel: guide.sourceLabel,
                preview: guide.preview,
              }))}
              kind="guide"
            />
          </div>
        </section>
        <section className="section knowledge-cta-section">
          <div className="container knowledge-cta">
            <div>
              <span className="eyebrow eyebrow-light">TRAO ĐỔI CÙNG TNT</span>
              <h2>Cần làm rõ nội dung tài liệu?</h2>
              <p>
                Trao đổi câu hỏi về quy trình, dữ liệu và phạm vi triển khai với TNT.
              </p>
            </div>
            <Link className="button button-primary" href="/kien-thuc/faq">
              Câu hỏi thường gặp <Icon name="arrowRight" size={16} />
            </Link>
          </div>
        </section>
      </main>
    </PageFrame>
  );
}
