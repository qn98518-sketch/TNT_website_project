import { FaqBrowser } from "@/components/faq-browser";
import { EditorialHero } from "@/components/content-page";
import { PageFrame } from "@/components/site-shell";
import { faqRepository } from "@/content/repositories";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Câu hỏi thường gặp",
  description:
    "Tìm kiếm câu trả lời về ERP, sản xuất, phát triển phần mềm và nhân lực công nghệ.",
  path: "/kien-thuc/faq",
});

export default async function FaqPage() {
  const faqs = await faqRepository.listPublished();

  return (
    <PageFrame>
      <main>
        <EditorialHero
          description="Tìm câu trả lời theo từ khóa và chủ đề. Nội dung được trình bày ở mức định hướng; phạm vi thực tế cần TNT xác nhận."
          eyebrow="CÂU HỎI THƯỜNG GẶP"
          highlightedTitle="Làm rõ trước khi bắt đầu."
          title="Cùng tìm câu trả lời."
        />
        <section className="section faq-section">
          <div className="container faq-page-layout">
            <div>
              <span className="eyebrow">HỖ TRỢ TRAO ĐỔI</span>
              <h2 className="section-title">
                Câu hỏi theo
                <br />
                <span>chủ đề quan tâm.</span>
              </h2>
              <p>
                Câu trả lời về năng lực và dịch vụ cụ thể sẽ được xác nhận theo
                yêu cầu của từng doanh nghiệp.
              </p>
            </div>
            <FaqBrowser items={faqs} />
          </div>
        </section>
      </main>
    </PageFrame>
  );
}
