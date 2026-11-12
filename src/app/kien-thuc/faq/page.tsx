import Link from "next/link";
import { FaqBrowser } from "@/components/faq-browser";
import { EditorialHero } from "@/components/content-page";
import { Icon } from "@/components/ui/icon";
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
  const faqs = await faqRepository.listForPreview();

  return (
    <PageFrame>
      <main>
        <EditorialHero
          description="Tìm câu trả lời theo nhóm chủ đề hoặc từ khóa."
          eyebrow="FAQ"
          highlightedTitle="thường gặp."
          title="Những câu hỏi"
        />
        <section className="section faq-section">
          <div className="container faq-page-layout">
            <div>
              <span className="eyebrow">FAQ TNT</span>
              <h2 className="section-title">
                Bạn đang quan tâm
                <br />
                <span>vấn đề nào?</span>
              </h2>
              <p>
                Các câu hỏi được nhóm theo nội dung quan tâm để bạn dễ tìm kiếm.
              </p>
            </div>
            <FaqBrowser items={faqs} />
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
