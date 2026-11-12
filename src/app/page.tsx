import Link from "next/link";
import Image from "next/image";
import { LeadForm } from "@/components/lead-form";
import { PageFrame } from "@/components/site-shell";
import { Icon, type IconName } from "@/components/ui/icon";
import { homePageContent } from "@/content/local-data";
import { HomeProjectShowcase } from "@/components/home-project-showcase";

const reasonIcons: readonly IconName[] = ["diagram", "tickCircle", "shield"];
const additionalServiceIcons: readonly IconName[] = [
  "code",
  "monitor",
  "people",
  "data",
  "diagram",
];
const processIcons: readonly IconName[] = [
  "message",
  "search",
  "checklist",
  "people",
];
export default function Home() {
  const content = homePageContent;

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
                  Trao đổi dự án <Icon name="arrowRight" size={17} />
                </Link>
                <Link className="button button-ghost" href="#solutions">
                  Khám phá giải pháp <Icon name="arrowRight" size={17} />
                </Link>
              </div>
              <div className="hero-services" aria-label="Các lĩnh vực">
                <span>SOFTWARE OUTSOURCING</span>
                <span>TNM ERP</span>
                <span>CUSTOM DEVELOPMENT</span>
                <span>IT STAFFING</span>
              </div>
            </div>

            <div className="hero-visual home-hero-photo">
              <Image
                alt="Hình minh họa giải pháp công nghệ trong môi trường sản xuất"
                className="home-hero-image"
                fill
                priority
                sizes="(max-width: 760px) 100vw, 48vw"
                src="/images/heading_homepage.webp"
              />
              <div className="home-hero-photo-caption">
                <span>TNM ERP</span>
                <strong>Kết nối dữ liệu. Thúc đẩy vận hành.</strong>
              </div>
            </div>
          </div>
          <div aria-hidden="true" className="hero-bottom-glow" />
        </section>

        <section className="home-statistics">
          <div className="container">
            <div className="home-statistics-grid">
              {content.statistics.map((stat) => (
                <article key={stat.label}>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                  <p>{stat.description}</p>
                </article>
              ))}
            </div>
            <p className="home-statistics-note">{content.statisticsNote}</p>
          </div>
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
            {content.additionalServices.map((service, index) => (
              <article className="service-card" key={`${service.title}-${index}`}>
                <div className="card-overline">
                  <span>DỊCH VỤ CÔNG NGHỆ</span>
                </div>
                <div aria-hidden="true" className="card-symbol">
                  <Icon name={additionalServiceIcons[index] ?? "box"} size={25} />
                </div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <Link className="text-link" href={service.href}>
                  Khám phá <Icon name="arrowUp" size={16} />
                </Link>
              </article>
            ))}
          </div>
        <div aria-labelledby="erp-showcase-title" className="erp-showcase">
          <div className="container erp-showcase-inner">
            <div className="erp-showcase-copy">
              <span className="eyebrow eyebrow-light">GIẢI PHÁP TRỌNG TÂM</span>
              <h2 id="erp-showcase-title">
                TNM
                <br />
                <span>ERP</span>
              </h2>
              <p>
                Quản trị tập trung. Vận hành hiệu quả. Kết nối dữ liệu, chuẩn
                hóa quy trình và hỗ trợ quản lý toàn diện các hoạt động doanh
                nghiệp.
              </p>
              <Link className="button button-light" href="/dich-vu/erp">
                Tìm hiểu về TNM ERP <Icon name="arrowRight" size={17} />
              </Link>
            </div>
            <div
              aria-label="Các phân hệ TNM ERP"
              className="erp-assessment-map"
            >
              <div className="erp-map-heading">
                <span className="erp-map-mark">
                  <Icon name="box" size={20} />
                </span>
                <span>
                  <strong>Các phân hệ trên nền tảng TNM</strong>
                  <small>Quản trị và vận hành doanh nghiệp</small>
                </span>
              </div>
              <div className="erp-map-grid">
                {content.erpModules.map((module) => (
                  <div className="erp-module-card" key={module.code}>
                    <Icon name={module.icon} size={19} />
                    <span className="erp-module-meta">
                      <strong>{module.label}</strong>
                      <small>{module.code}</small>
                    </span>
                  </div>
                ))}
              </div>
              <p className="erp-map-note">
                Thông tin phân hệ cần TNT xác nhận trước khi công bố như cam kết.
              </p>
            </div>
          </div>
        </div>
        </section>

        <section className="section section-navy">
          <div className="container">
            <div className="section-heading centered-heading">
              <span className="eyebrow">ĐỐI TÁC ĐỒNG HÀNH</span>
              <h2 className="section-title">
                Vì sao doanh nghiệp
                <br />
                <span>chọn TNT?</span>
              </h2>
              <p className="section-lede">
                Chúng tôi không chỉ cung cấp dịch vụ, mà còn đồng hành cùng
                doanh nghiệp trên hành trình tăng trưởng bền vững.
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
          </div>
        </section>

        <section className="section section-soft">
          <div className="container">
            <div className="section-heading">
              <span className="eyebrow">QUY TRÌNH TRIỂN KHAI</span>
              <h2 className="section-title">
                Từ nhu cầu đến giá trị
                <br />
                <span>trong 4 bước đơn giản.</span>
              </h2>
              <p className="section-lede">
                TNT áp dụng quy trình triển khai tinh gọn, linh hoạt và minh
                bạch, đảm bảo dự án được triển khai hiệu quả và phù hợp với từng
                doanh nghiệp.
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
              <span><Icon name="diagram" size={17} /> Rõ ràng: Quy trình minh bạch, mục tiêu cụ thể.</span>
              <span><Icon name="checklist" size={17} /> Linh hoạt: Giải pháp phù hợp từng doanh nghiệp.</span>
              <span><Icon name="arrowRight" size={17} /> Hiệu quả: Tập trung vào kết quả thực tế.</span>
            </div>
          </div>
        </section>

        <HomeProjectShowcase />

        <section className="section section-insights">
          <div className="container">
            <div className="section-heading insights-heading">
              <div>
                <span className="eyebrow">GÓC NHÌN CÔNG NGHỆ</span>
                <h2 className="section-title">
                  Cập nhật xu hướng công nghệ
                  <br />
                  <span>và góc nhìn chuyên gia.</span>
                </h2>
              </div>
              <p className="section-lede">
                Chia sẻ những kinh nghiệm về công nghệ, quản trị, sản xuất và
                chuyển đổi số.
              </p>
            </div>
            <div className="insight-grid">
              {content.featuredInsights.map((item) => (
                <Link className="insight-card home-insight-card" href={item.href} key={item.title}>
                  <Image alt={item.imageAlt} fill sizes="(max-width: 700px) 100vw, 33vw" src={item.image} />
                  <span className="insight-label">{item.topic}</span>
                  <h3>{item.title}</h3>
                  <span className="text-link">Đọc thêm <Icon name="arrowRight" size={16} /></span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <div className="section contact-section">
          <div className="container">
            <LeadForm
              context="general"
              description="Để lại thông tin để TNT có thể liên hệ và trao đổi về giải pháp phù hợp."
              title="Cùng nhau kiến tạo giải pháp phù hợp cho doanh nghiệp của bạn"
            />
          </div>
        </div>
      </main>
    </PageFrame>
  );
}
