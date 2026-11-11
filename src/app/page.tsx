import Link from "next/link";
import { LeadForm } from "@/components/lead-form";
import { PageFrame } from "@/components/site-shell";
import { Icon, type IconName } from "@/components/ui/icon";
import { homePageContent } from "@/content/local-data";
import { serviceRepository } from "@/content/repositories";

const serviceIcons: Record<string, IconName> = {
  erp: "box",
  outsourcing: "code",
  "body-shop": "people",
};
const reasonIcons: readonly IconName[] = ["diagram", "tickCircle", "shield"];
const processIcons: readonly IconName[] = [
  "message",
  "search",
  "checklist",
  "people",
];
const proofIcons: readonly IconName[] = ["diagram", "chart", "shield"];
const insightIcons: readonly IconName[] = ["data", "activity", "checklist"];

export default async function Home() {
  const content = homePageContent;
  const services = await serviceRepository.listPublished();

  return (
    <PageFrame>
      <main>
        <section className="home-hero">
          <div className="container home-hero-grid">
            <div className="hero-copy">
              <span className="eyebrow eyebrow-light">
                {content.hero.eyebrow} <span className="eyebrow-rule" />
              </span>
              <h1>
                {content.hero.title}
                <br />
                <span>{content.hero.accent}</span>
              </h1>
              <p className="hero-lede">{content.hero.summary}</p>
              <div className="hero-actions">
                <Link className="button button-primary" href="#contact">
                  Trao đổi nhu cầu <Icon name="arrowUp" size={17} />
                </Link>
                <Link className="button button-ghost" href="#solutions">
                  Khám phá năng lực <Icon name="arrowDown" size={17} />
                </Link>
              </div>
              <div className="hero-services" aria-label="Các lĩnh vực">
                <span>TNM ERP</span>
                <span>Phần mềm</span>
                <span>Nhân lực CNTT</span>
              </div>
            </div>

            <div
              aria-label="Minh họa dữ liệu vận hành được kết nối"
              className="hero-visual"
              role="img"
            >
              <div aria-hidden="true" className="visual-orbit orbit-one" />
              <div aria-hidden="true" className="visual-orbit orbit-two" />
              <div className="visual-panel">
                <div className="panel-topline">
                  <span className="panel-dot" />
                  <span>VẬN HÀNH LIÊN THÔNG</span>
                  <span className="panel-menu">•••</span>
                </div>
                <div className="panel-heading">
                  <div>
                    <span className="panel-label">DỮ LIỆU TỔNG QUAN</span>
                    <strong>Quy trình vận hành</strong>
                  </div>
                  <span className="panel-period">Theo quy trình</span>
                </div>
                <div aria-hidden="true" className="chart-area">
                  <div className="chart-lines">
                    <span />
                    <span />
                    <span />
                    <span />
                  </div>
                  <svg
                    className="chart-line"
                    fill="none"
                    preserveAspectRatio="none"
                    viewBox="0 0 400 130"
                  >
                    <path
                      d="M4 106C39 100 48 78 82 84C115 91 127 48 159 56C194 66 208 74 238 47C268 21 280 43 309 30C344 15 355 24 396 5"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeWidth="4"
                    />
                    <path
                      d="M4 106C39 100 48 78 82 84C115 91 127 48 159 56C194 66 208 74 238 47C268 21 280 43 309 30C344 15 355 24 396 5V130H4Z"
                      fill="url(#chart-fill)"
                      opacity=".2"
                    />
                    <defs>
                      <linearGradient id="chart-fill" x1="200" x2="200" y1="0" y2="130">
                        <stop stopColor="#398BFF" />
                        <stop offset="1" stopColor="#398BFF" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <div className="panel-flow">
                  <span>Nguyên liệu</span>
                  <i aria-hidden="true"><Icon name="arrowRight" size={13} /></i>
                  <span>Sản xuất</span>
                  <i aria-hidden="true"><Icon name="arrowRight" size={13} /></i>
                  <span>Báo cáo</span>
                </div>
              </div>
              <div className="visual-note">
                <Icon name="info" size={16} />
                Bắt đầu từ bài toán thực tế
              </div>
            </div>
          </div>
          <div aria-hidden="true" className="hero-bottom-glow" />
        </section>

        <section className="section section-intro">
          <div className="container intro-layout">
            <div>
              <span className="eyebrow">{content.introduction.eyebrow}</span>
              <h2 className="section-title">
                {content.introduction.title}
                <br />
                <span>{content.introduction.accent}</span>
              </h2>
            </div>
            <p className="section-lede">{content.introduction.summary}</p>
          </div>
          <div className="container service-grid" id="solutions">
            {services.map((service) => (
              <article className="service-card" key={service.slug}>
                <div className="card-overline">
                  <span>{service.eyebrow}</span>
                </div>
                <div aria-hidden="true" className="card-symbol">
                  <Icon name={serviceIcons[service.slug] ?? "box"} size={25} />
                </div>
                <h3>{service.title}</h3>
                <p>{service.summary}</p>
                <Link className="text-link" href={service.href}>
                  Tìm hiểu thêm <Icon name="arrowUp" size={16} />
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="erp-showcase-title" className="erp-showcase">
          <div className="container erp-showcase-inner">
            <div className="erp-showcase-copy">
              <span className="eyebrow eyebrow-light">TNM ERP · KHUNG TRAO ĐỔI</span>
              <h2 id="erp-showcase-title">
                Cùng xem xét cách dữ liệu
                <br />
                <span>liên kết với vận hành.</span>
              </h2>
              <p>
                Bắt đầu từ quy trình và nhu cầu thực tế để đánh giá mức độ phù
                hợp. Sơ đồ minh họa nội dung cần trao đổi, không đại diện cho
                phân hệ hay chức năng đã được xác nhận.
              </p>
              <Link className="button button-light" href="/dich-vu/erp">
                Tìm hiểu về TNM ERP <Icon name="arrowRight" size={17} />
              </Link>
            </div>
            <div
              aria-label="Minh họa các nội dung cần đối chiếu: quy trình, dữ liệu, điểm bàn giao và phạm vi"
              className="erp-assessment-map"
              role="img"
            >
              <div className="erp-map-heading">
                <span className="erp-map-mark">
                  <Icon name="diagram" size={20} />
                </span>
                <span>
                  <strong>Điểm cần đối chiếu</strong>
                  <small>Đánh giá theo nhu cầu cụ thể</small>
                </span>
              </div>
              <div className="erp-map-grid">
                <span><Icon name="activity" size={19} /> Quy trình</span>
                <span><Icon name="data" size={19} /> Dữ liệu</span>
                <span><Icon name="diagram" size={19} /> Bàn giao</span>
                <span><Icon name="checklist" size={19} /> Phạm vi</span>
              </div>
              <p className="erp-map-note">
                Nội dung được xác định cùng doanh nghiệp
              </p>
            </div>
          </div>
        </section>

        <section className="section section-pale">
          <div className="container">
            <div className="section-heading centered-heading">
              <span className="eyebrow">CÁCH TNT TIẾP CẬN</span>
              <h2 className="section-title">
                Hiểu bài toán trước.
                <br />
                <span>Chọn giải pháp sau.</span>
              </h2>
              <p className="section-lede">
                Không bắt đầu bằng một lời hứa có sẵn. Cùng làm rõ điều doanh
                nghiệp cần, điều hệ thống có thể đáp ứng và điều cần được thống
                nhất thêm.
              </p>
            </div>
            <div className="reason-grid">
              {content.reasons.map((reason, index) => (
                <article className="reason-card" key={reason.title}>
                  <span aria-hidden="true" className="reason-icon">
                    <Icon name={reasonIcons[index] ?? "info"} size={21} />
                  </span>
                  <h3>{reason.title}</h3>
                  <p>{reason.description}</p>
                </article>
              ))}
            </div>
            <div className="fit-banner">
              <div>
                <span className="eyebrow eyebrow-light">
                  {content.fitPrinciple.eyebrow}
                </span>
                <h3>{content.fitPrinciple.title}</h3>
              </div>
              <p>{content.fitPrinciple.summary}</p>
              <Link className="button button-light" href="/ve-tnt">
                {content.fitPrinciple.linkLabel}
                <Icon name="arrowUp" size={17} />
              </Link>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="section-heading">
              <span className="eyebrow">TỪ NHU CẦU ĐẾN GIẢI PHÁP</span>
              <h2 className="section-title">
                Tiến từng bước,
                <br />
                <span>rõ từng quyết định.</span>
              </h2>
              <p className="section-lede">
                Trình tự và phạm vi cụ thể được xác định cùng doanh nghiệp theo
                bài toán thực tế.
              </p>
            </div>
            <ol className="process-list">
              {content.process.map((step, index) => (
                <li className="process-step" key={step.title}>
                  <span className="process-index">
                    <span className="process-icon">
                      <Icon name={processIcons[index] ?? "info"} size={19} />
                    </span>
                    <span>0{index + 1}</span>
                    <i aria-hidden="true" />
                  </span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div aria-label="Các điểm thống nhất trong quá trình" className="process-value-strip">
              <span><Icon name="diagram" size={17} /> Làm rõ nhu cầu</span>
              <span><Icon name="checklist" size={17} /> Thống nhất phạm vi</span>
              <span><Icon name="arrowRight" size={17} /> Xác định bước tiếp theo</span>
            </div>
          </div>
        </section>

        <section className="industry-band">
          <div className="container industry-band-inner">
            <div className="industry-art" aria-hidden="true">
              <div className="industry-art-grid" />
              <div className="industry-node node-material">Nguyên liệu</div>
              <div className="industry-node node-production">Sản xuất</div>
              <div className="industry-node node-quality">Chất lượng</div>
              <div className="industry-node node-stock">Kho</div>
              <div className="industry-center">TNM<br />ERP</div>
              <span className="industry-connector connector-one" />
              <span className="industry-connector connector-two" />
              <span className="industry-connector connector-three" />
              <span className="industry-connector connector-four" />
            </div>
            <div className="industry-copy">
              <span className="eyebrow">{content.industry.eyebrow}</span>
              <h2 className="section-title">
                {content.industry.title}
                <br />
                <span>{content.industry.accent}</span>
              </h2>
              <p>{content.industry.summary}</p>
              <Link
                className="button button-primary"
                href="/giai-phap-nganh-thuc-pham"
              >
                {content.industry.linkLabel}
                <Icon name="arrowUp" size={17} />
              </Link>
            </div>
          </div>
        </section>

        <section className="section project-proof-section">
          <div className="container project-proof-layout">
            <div className="project-proof-copy">
              <span className="eyebrow">{content.projectDisclosure.eyebrow}</span>
              <h2 className="section-title">
                {content.projectDisclosure.title}
                <br />
                <span>{content.projectDisclosure.accent}</span>
              </h2>
              <p>{content.projectDisclosure.summary}</p>
            </div>
            <div className="project-proof-list">
              {content.proofChecks.map((item, index) => (
                <div key={item.title}>
                  <span aria-hidden="true" className="proof-check-icon">
                    <Icon name={proofIcons[index] ?? "info"} size={18} />
                  </span>
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section section-insights">
          <div className="container">
            <div className="section-heading insights-heading">
              <div>
                <span className="eyebrow">ĐIỂM BẮT ĐẦU CUỘC TRAO ĐỔI</span>
                <h2 className="section-title">
                  Câu hỏi đáng bắt đầu.
                  <br />
                  <span>Trao đổi để rõ hơn.</span>
                </h2>
              </div>
              <p className="section-lede">
                Chủ đề gợi mở cho cuộc trao đổi — chưa phải bài viết hay dự án
                khách hàng đã được xác nhận.
              </p>
            </div>
            <div className="insight-grid">
              {content.insightPrompts.map((item, index) => (
                <article className="insight-card" key={item.question}>
                  <span className="insight-prompt-label">
                    <Icon name="message" size={15} /> GỢI Ý TRAO ĐỔI
                  </span>
                  <span className="insight-label">
                    <Icon name={insightIcons[index] ?? "info"} size={15} />
                    {item.topic}
                  </span>
                  <h3>{item.question}</h3>
                  <p>{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <div className="section contact-section">
          <div className="container">
            <LeadForm context="general" title="Cùng nhau kiến tạo giải pháp phù hợp" />
          </div>
        </div>
      </main>
    </PageFrame>
  );
}
