import Link from "next/link";
import Image from "next/image";
import { LeadForm } from "@/components/lead-form";
import { PageFrame } from "@/components/site-shell";
import { Icon, type IconName } from "@/components/ui/icon";
import { aboutPageContent } from "@/content/local-data";
import { createPageMetadata } from "@/lib/metadata";

const capabilityIcons: readonly IconName[] = ["diagram", "code", "people"];

export const metadata = createPageMetadata({
  title: "Về TNT",
  description:
    "Tìm hiểu cách TNT tiếp cận bài toán công nghệ: hiểu nghiệp vụ, xác định mức độ phù hợp và thống nhất phạm vi.",
  path: "/ve-tnt",
});

export default function AboutPage() {
  const content = aboutPageContent;

  return (
    <PageFrame>
      <main>
        <section className="about-hero">
          <div className="container about-hero-grid">
            <div className="about-hero-copy">
              <span className="eyebrow eyebrow-light">
                {content.hero.eyebrow} <span className="eyebrow-rule" />
              </span>
              <h1>
                {content.hero.title}
                <br />
                <span>{content.hero.accent}</span>
              </h1>
              <p className="hero-lede">{content.hero.summary}</p>
              <Link className="button button-primary" href="/dich-vu/erp">
                Khám phá giải pháp ERP <Icon name="arrowRight" size={17} />
              </Link>
            </div>
            <div className="about-hero-art" aria-hidden="true">
              <Image
                alt=""
                fill
                priority
                sizes="(max-width: 760px) 100vw, 45vw"
                src="/images/solution.webp"
              />
              <span className="about-photo-caption">TRÍ NGHĨA TECH</span>
            </div>
          </div>
          <div aria-hidden="true" className="hero-bottom-glow" />
        </section>

        <section className="section">
          <div className="container about-overview">
            <div className="about-overview-heading">
              <span className="eyebrow">{content.overview.eyebrow}</span>
              <h2 className="section-title">
                {content.overview.title}
                <br />
                <span>{content.overview.accent}</span>
              </h2>
            </div>
            <div className="about-overview-copy">
              {content.overview.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="about-overview-images">
              {content.overview.images.map((image) => (
                <Image
                  alt={image.alt}
                  height={image.height}
                  key={image.src}
                  src={image.src}
                  width={image.width}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="section section-navy about-industry">
          <div className="container">
            <div className="section-heading centered-heading">
              <span className="eyebrow eyebrow-light">NĂNG LỰC LĨNH VỰC</span>
              <h2 className="section-title">
                Tập trung vào nghiệp vụ ngành,
                <br />
                <span>phát triển giải pháp có thể tái sử dụng.</span>
              </h2>
            </div>
            <div className="capability-grid">
              {content.industryCapabilities.map((item, index) => (
                <article className="capability-card" key={item.title}>
                  <span className="capability-icon">
                    <Icon name={capabilityIcons[index] ?? "info"} size={22} />
                  </span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section aria-labelledby="about-method-title" className="about-method-section">
          <div className="container">
            <div className="about-method-heading">
              <span className="eyebrow">{content.fitPrinciple.eyebrow}</span>
              <h2 className="section-title" id="about-method-title">
                {content.fitPrinciple.title}{" "}
                <span>{content.fitPrinciple.accent}</span>
              </h2>
              <p>{content.fitPrinciple.summary}</p>
            </div>
            <ol className="about-method-flow">
              {content.methodSteps.map((step, index) => (
                <li className="about-method-card" key={step.english}>
                  <span className="about-method-icon" aria-hidden="true">
                    <Icon name={step.icon} size={22} />
                  </span>
                  <span className="about-method-step">
                    0{index + 1} <i aria-hidden="true">{step.english}</i>
                  </span>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="section about-statistics">
          <div className="container">
            <div className="about-statistics-heading">
              <span className="eyebrow">NĂNG LỰC TRIỂN KHAI</span>
              <h2 className="section-title">
                Năng lực
                <br />
                <span>triển khai.</span>
              </h2>
              <p>
                Đội ngũ có kinh nghiệm triển khai các giải pháp quản trị doanh
                nghiệp, sẵn sàng đồng hành cùng bạn từ tư vấn, phát triển đến
                vận hành.
              </p>
            </div>
            <div className="about-statistics-grid">
              {content.statistics.map((stat) => (
                <article key={stat.label}>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </article>
              ))}
            </div>
            <p className="about-statistics-note">{content.statisticsNote}</p>
          </div>
        </section>

        <section className="team-section">
          <div className="container">
            <div className="team-intro">
              <span className="eyebrow eyebrow-light">
                {content.teamDisclosure.eyebrow}
              </span>
              <h2 className="section-title">
                {content.teamDisclosure.title}
                <br />
                <span>{content.teamDisclosure.accent}</span>
              </h2>
              <p>{content.teamDisclosure.summary}</p>
              <span className="review-label">
                Thông tin nhân sự và hình ảnh là mẫu minh họa, cần TNT xác nhận.
              </span>
            </div>
            <div className="team-roles">
              {content.teamRoles.map((role) => (
                <article className="team-role" key={role.title}>
                  <div className="team-role-image">
                    <Image
                      alt={role.imageAlt}
                      fill
                      sizes="(max-width: 700px) 100vw, 20vw"
                      src={role.image}
                    />
                  </div>
                  <div className="team-role-copy">
                    <h3>{role.title}</h3>
                    <p>{role.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section about-cta">
          <div className="container">
            <div className="about-cta-banner">
              <div>
                <span className="eyebrow eyebrow-light">BẮT ĐẦU CUỘC TRAO ĐỔI</span>
                <h2>Chia sẻ vấn đề. Cùng xác định giải pháp phù hợp.</h2>
              </div>
              <Link className="button button-light" href="#about-contact">
                Gửi yêu cầu tư vấn <Icon name="arrowDown" size={17} />
              </Link>
            </div>
            <div id="about-contact">
              <div className="about-contact-details">
                <span>Hotline: 0889 889 788</span>
                <span>Email: info@tringhiatech.vn</span>
                <span className="review-label">
                  Thông tin liên hệ theo bản thiết kế, cần TNT xác nhận.
                </span>
              </div>
              <LeadForm
                context="general"
                pagePath="/ve-tnt"
                title="Gửi yêu cầu tư vấn"
                description="Chia sẻ nhu cầu để TNT cùng xác định giải pháp phù hợp."
              />
            </div>
          </div>
        </section>
      </main>
    </PageFrame>
  );
}
