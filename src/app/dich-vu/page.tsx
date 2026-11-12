import Image from "next/image";
import Link from "next/link";
import { ContentPageShell } from "@/components/content-page";
import { LeadForm } from "@/components/lead-form";
import { Icon } from "@/components/ui/icon";
import { projectRepository, serviceRepository } from "@/content/repositories";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Dịch vụ",
  description:
    "Tìm hiểu các hướng dịch vụ ERP, phát triển phần mềm và nhân lực công nghệ của TNT.",
  path: "/dich-vu",
});

const serviceIcons = ["box", "code", "people"] as const;
const advantageIcons = ["briefcase", "data", "setting", "people"] as const;
const advantages = [
  { title: "Tập trung nghiệp vụ", description: "Ưu tiên nhu cầu vận hành." },
  { title: "Giải pháp kết nối", description: "Tổ chức dữ liệu đồng nhất." },
  { title: "Linh hoạt triển khai", description: "Cấu hình theo phạm vi." },
  { title: "Đồng hành cùng bạn", description: "Từ tư vấn đến hỗ trợ." },
];
const process = [
  { title: "Tiếp nhận", description: "Lắng nghe nhu cầu và hiện trạng." },
  { title: "Tư vấn", description: "Phân tích phương án phù hợp." },
  { title: "Triển khai", description: "Phối hợp thực hiện theo kế hoạch." },
  { title: "Đồng hành", description: "Bàn giao và hỗ trợ vận hành." },
];

export default async function ServicesPage() {
  const [services, projects] = await Promise.all([
    serviceRepository.listPublished(),
    projectRepository.listForPreview(),
  ]);

  return (
    <ContentPageShell
      action={{ href: "#services", label: "Khám phá dịch vụ" }}
      description="Từ hệ thống ERP đến phát triển phần mềm và cung ứng nhân lực CNTT, TNT đồng hành cùng doanh nghiệp ở từng giai đoạn chuyển đổi."
      eyebrow="DỊCH VỤ CÔNG NGHỆ TNT"
      highlightedTitle="Đồng hành cùng tăng trưởng."
      title="Giải pháp đúng nhu cầu."
    >
      <section className="section" id="services">
        <div className="container">
          <div className="section-heading centered-heading">
            <span className="eyebrow">GIẢI PHÁP & DỊCH VỤ</span>
            <h2 className="section-title">
              Công nghệ toàn diện
              <br />
              <span>cho doanh nghiệp</span>
            </h2>
            <p className="section-lede">
              Ba nhóm dịch vụ cốt lõi được thiết kế xoay quanh nhu cầu vận hành
              và phát triển hệ thống.
            </p>
          </div>
          <div className="service-overview-grid">
            {services.map((service, index) => (
              <article className="service-overview-card" key={service.slug}>
                <span className="service-overview-icon">
                  <Icon name={serviceIcons[index] ?? "box"} size={24} />
                </span>
                <h3>{service.title}</h3>
                <p>{service.summary}</p>
                <Link className="text-link" href={service.href}>
                  Khám phá dịch vụ <Icon name="arrowRight" size={16} />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-pale">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">VÌ SAO TNT?</span>
            <h2 className="section-title">
              Hiểu bài toán.
              <br />
              <span>Thiết kế giải pháp phù hợp.</span>
            </h2>
            <p className="section-lede">
              Đội ngũ hướng tới việc giải quyết đúng vấn đề và triển khai phù
              hợp với quy trình thực tế của doanh nghiệp.
            </p>
          </div>
          <div className="service-advantage-grid">
            {advantages.map((advantage, index) => (
              <article className="service-advantage-card" key={advantage.title}>
                <span aria-hidden="true">
                  <Icon name={advantageIcons[index] ?? "info"} size={22} />
                </span>
                <h3>{advantage.title}</h3>
                <p>{advantage.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">DỰ ÁN THAM KHẢO · MẪU DEMO</span>
            <h2 className="section-title">
              Năng lực được thể hiện
              <br />
              <span>qua dự án tham khảo</span>
            </h2>
            <p className="section-lede">
              Nội dung minh họa cách trình bày bài toán công nghệ và vận hành;
              không xác nhận đây là các dự án TNT đã thực hiện.
            </p>
          </div>
          <div className="service-proof-grid">
            {projects.slice(0, 3).map((project) => {
              if (!project.image || !project.imageAlt) {
                throw new Error(`Missing project image for "${project.slug}".`);
              }
              return (
                <article className="service-proof-card" key={project.slug}>
                  <Link href={`/du-an/${project.slug}`} className="service-proof-image">
                    <Image
                      src={project.image}
                      alt={project.imageAlt}
                      width={720}
                      height={450}
                      sizes="(max-width: 760px) 100vw, 33vw"
                    />
                  </Link>
                  <div className="service-proof-copy">
                    <span className="sample-label">{project.sourceLabel}</span>
                    <div className="service-proof-meta">
                      {project.service} <span>·</span> {project.industry}
                    </div>
                    <h3>
                      <Link href={`/du-an/${project.slug}`}>{project.title}</Link>
                    </h3>
                    <p>{project.summary}</p>
                    <Link className="text-link" href={`/du-an/${project.slug}`}>
                      Xem câu chuyện dự án <Icon name="arrowRight" size={16} />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
          <div className="service-overview-more">
            <Link className="button button-outline" href="/du-an">
              Xem tất cả dự án <Icon name="arrowRight" size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="section section-pale">
        <div className="container">
          <div className="section-heading centered-heading">
            <span className="eyebrow">QUY TRÌNH HỢP TÁC</span>
            <h2 className="section-title">
              Từ nhu cầu đến
              <br />
              <span>giải pháp phù hợp</span>
            </h2>
            <p className="section-lede">
              Cấu trúc quy trình minh họa để làm rõ cách TNT và doanh nghiệp phối hợp.
            </p>
          </div>
          <ol className="service-step-grid">
            {process.map((step, index) => (
              <li className="service-step-card" key={step.title}>
                <span className="service-step-number">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section contact-section" id="contact">
        <div className="container">
          <LeadForm
            context="general"
            title="Cùng nhau kiến tạo giải pháp phù hợp"
            description="Chia sẻ bài toán vận hành. TNT sẽ cùng bạn tìm hướng tiếp cận phù hợp."
            pagePath="/dich-vu"
            idPrefix="services-contact"
          />
        </div>
      </section>
    </ContentPageShell>
  );
}
