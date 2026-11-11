import Link from "next/link";
import { LeadForm } from "@/components/lead-form";
import { Icon, type IconName } from "@/components/ui/icon";
import type { ServiceRecord } from "@/content/models";

const serviceIcons: Record<string, readonly IconName[]> = {
  erp: ["box", "data", "chart"],
  outsourcing: ["code", "diagram", "monitor"],
  "body-shop": ["people", "briefcase", "message"],
};

type Props = {
  service: ServiceRecord;
  leadContext: "erp" | "outsourcing" | "body-shop";
};

export function ServiceLanding({ service, leadContext }: Props) {
  return (
    <main>
      <section className="editorial-hero">
        <div className="container editorial-hero-inner">
          <div className="editorial-hero-copy">
            <span className="eyebrow eyebrow-light">
              {service.eyebrow} <span className="eyebrow-rule" />
            </span>
            <h1>
              {service.title}
              <br />
              <span>phù hợp với nhu cầu thực tế.</span>
            </h1>
            <p>{service.summary}</p>
            <Link className="button button-primary" href="#service-contact">
              Trao đổi nhu cầu <Icon name="arrowUp" size={17} />
            </Link>
          </div>
          <div aria-hidden="true" className="editorial-hero-visual">
            <div className="editorial-hero-orbit">
              <span className="editorial-hero-core">
              <Icon name={serviceIcons[service.slug]?.[0] ?? "box"} size={44} />
              </span>
              {service.points.map((point, index) => (
                <span className={`editorial-node editorial-node-${index + 1}`} key={point}>
                  {point}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading centered-heading">
            <span className="eyebrow">BẮT ĐẦU TỪ NHU CẦU</span>
            <h2 className="section-title">
              Làm rõ bài toán.
              <br />
              <span>Thống nhất cách tiếp cận.</span>
            </h2>
            <p className="section-lede">
              Các khả năng, phạm vi và điều kiện thương mại cần được TNT xác
              nhận theo từng yêu cầu trước khi cam kết triển khai.
            </p>
          </div>
          <div className="service-principles">
            {service.points.map((point, index) => (
              <article className="service-principle" key={point}>
                <span aria-hidden="true" className="service-principle-icon">
                  <Icon
                    name={serviceIcons[service.slug]?.[index] ?? "info"}
                    size={21}
                  />
                </span>
                <h3>{point}</h3>
                <p>
                  Làm rõ {point.toLocaleLowerCase("vi")} theo nhu cầu thực tế
                  trước khi thống nhất bước tiếp theo.
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-pale">
        <div className="container service-process-layout">
          <div>
            <span className="eyebrow">FIT FIRST. CUSTOMIZE WITH PURPOSE.</span>
            <h2 className="section-title">
              Phù hợp trước.
              <br />
              <span>Mở rộng có mục đích.</span>
            </h2>
          </div>
          <div className="service-process-copy">
            <p>
              TNT cùng doanh nghiệp xác định phần có thể đáp ứng, nội dung cần
              đánh giá thêm và những yêu cầu chưa thuộc phạm vi thống nhất.
            </p>
            <Link className="text-link" href="/ve-tnt">
              Tìm hiểu cách tiếp cận <Icon name="arrowRight" size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="section contact-section" id="service-contact">
        <div className="container">
          <LeadForm
            context="general"
            leadContext={leadContext}
            pagePath={service.href}
            title={`Trao đổi về ${service.title}`}
            description="Chia sẻ nhu cầu để TNT có thể cùng làm rõ phạm vi cần trao đổi."
          />
        </div>
      </section>
    </main>
  );
}
