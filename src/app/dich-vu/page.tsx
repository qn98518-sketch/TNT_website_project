import { ContentPageShell, LinkCards } from "@/components/content-page";
import { serviceRepository } from "@/content/repositories";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Dịch vụ",
  description:
    "Tìm hiểu các hướng trao đổi về TNM ERP, phát triển phần mềm và nhân lực công nghệ của TNT.",
  path: "/dich-vu",
});

export default async function ServicesPage() {
  const services = await serviceRepository.listPublished();

  return (
    <ContentPageShell
      action={{ href: "/#contact", label: "Trao đổi nhu cầu" }}
      description="TNT cùng doanh nghiệp làm rõ nhu cầu trước khi lựa chọn hướng giải quyết. Phạm vi dịch vụ cần được xác nhận theo từng yêu cầu."
      eyebrow="GIẢI PHÁP & DỊCH VỤ"
      highlightedTitle="Bắt đầu từ bài toán."
      title="Công nghệ gắn với vận hành."
    >
      <section className="section">
        <div className="container">
          <div className="section-heading centered-heading">
            <span className="eyebrow">CÁC HƯỚNG TRAO ĐỔI</span>
            <h2 className="section-title">
              Ba lĩnh vực.
              <br />
              <span>Một cách tiếp cận rõ ràng.</span>
            </h2>
            <p className="section-lede">
              Năng lực, phạm vi và điều kiện thương mại cần TNT xác nhận trước
              khi công bố như cam kết.
            </p>
          </div>
          <LinkCards
            items={services.map((service, index) => ({
              title: service.title,
              summary: service.summary,
              href: service.href,
              icon: (["box", "briefcase", "people"] as const)[index] ?? "box",
            }))}
          />
        </div>
      </section>
      <section className="section section-pale">
        <div className="container simple-process">
          <div>
            <span className="eyebrow">QUY TRÌNH TRAO ĐỔI</span>
            <h2 className="section-title">
              Hiểu nhu cầu.
              <br />
              <span>Thống nhất phạm vi.</span>
            </h2>
          </div>
          <ol>
            <li>Tiếp nhận mục tiêu và bối cảnh.</li>
            <li>Làm rõ quy trình và yêu cầu.</li>
            <li>Trao đổi hướng giải quyết.</li>
            <li>Thống nhất phạm vi và bước tiếp theo.</li>
          </ol>
        </div>
      </section>
    </ContentPageShell>
  );
}
