import Link from "next/link";
import { LeadForm } from "@/components/lead-form";
import { PageFrame } from "@/components/site-shell";
import { Icon, type IconName } from "@/components/ui/icon";
import { aboutPageContent } from "@/content/local-data";
import { createPageMetadata } from "@/lib/metadata";

const fitStageIcons: readonly IconName[] = [
  "tickCircle",
  "setting",
  "closeCircle",
];
const capabilityIcons: readonly IconName[] = ["diagram", "code", "people"];
const teamRoleIcons: readonly IconName[] = [
  "message",
  "monitor",
  "checklist",
  "people",
];
const approachSteps = [
  {
    english: "CONNECT",
    title: "Lắng nghe nhu cầu",
    description: "Làm rõ mục tiêu và bối cảnh vận hành.",
    icon: "message",
  },
  {
    english: "FIT",
    title: "Đánh giá mức độ phù hợp",
    description: "Phân loại nội dung có thể đáp ứng, cần đánh giá thêm hoặc ngoài phạm vi.",
    icon: "diagram",
  },
  {
    english: "DELIVER",
    title: "Thống nhất bước tiếp theo",
    description: "Trao đổi ưu tiên và phạm vi trước khi xác định cách thực hiện.",
    icon: "checklist",
  },
] satisfies readonly {
  english: string;
  title: string;
  description: string;
  icon: IconName;
}[];

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
              <Link className="button button-primary" href="#approach">
                Tìm hiểu cách tiếp cận <Icon name="arrowDown" size={17} />
              </Link>
            </div>
            <div className="about-hero-art" aria-hidden="true">
              <div className="about-orbit about-orbit-back" />
              <div className="about-orbit about-orbit-front" />
              <div className="about-core">TNT</div>
              <div className="about-orbit-label about-label-one">Nghiệp vụ</div>
              <div className="about-orbit-label about-label-two">Công nghệ</div>
              <div className="about-orbit-label about-label-three">Vận hành</div>
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
          </div>
        </section>

        <section aria-labelledby="about-method-title" className="about-method-section">
          <div className="container">
            <div className="about-method-heading">
              <span className="eyebrow">CÁCH TIẾP CẬN</span>
              <h2 className="section-title" id="about-method-title">
                Connect. Fit. <span>Deliver.</span>
              </h2>
              <p>
                Khung trao đổi giúp làm rõ nhu cầu và phạm vi; không thay thế
                việc xác nhận dịch vụ, năng lực hay kế hoạch cụ thể.
              </p>
            </div>
            <ol className="about-method-flow">
              {approachSteps.map((step, index) => (
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

        <section className="section section-pale" id="approach">
          <div className="container">
            <div className="section-heading centered-heading">
              <span className="eyebrow">{content.fitPrinciple.eyebrow}</span>
              <h2 className="section-title">
                {content.fitPrinciple.title}
                <br />
                <span>{content.fitPrinciple.accent}</span>
              </h2>
              <p className="section-lede">{content.fitPrinciple.summary}</p>
            </div>
            <div className="fit-grid">
              {content.fitStages.map((stage, index) => (
                <article
                  className={`fit-card fit-card-${["ready", "extend", "out"][index]}`}
                  key={stage.title}
                >
                  <span aria-hidden="true" className="fit-icon">
                    <Icon name={fitStageIcons[index] ?? "info"} size={21} />
                  </span>
                  <span className="fit-tag">{stage.label}</span>
                  <h3>{stage.title}</h3>
                  <p>{stage.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="section-heading">
              <span className="eyebrow">NĂNG LỰC ĐỒNG HÀNH</span>
              <h2 className="section-title">
                Chọn hướng đi
                <br />
                <span>theo nhu cầu thực tế.</span>
              </h2>
            </div>
            <div className="capability-grid">
              {content.capabilities.map((item, index) => (
                <article className="capability-card" key={item.title}>
                  <span aria-hidden="true" className="capability-icon">
                    <Icon
                      name={capabilityIcons[index] ?? "info"}
                      size={22}
                    />
                  </span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              ))}
            </div>
            <p className="editorial-note">
              Phạm vi dịch vụ và năng lực cụ thể cần được TNT xác nhận trước
              khi công bố như cam kết thương mại.
            </p>
          </div>
        </section>

        <section className="team-section">
          <div className="container team-layout">
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
            </div>
            <div className="team-roles">
              {content.teamRoles.map((role, index) => (
                <article className="team-role" key={role.title}>
                  <span aria-hidden="true" className="team-role-icon">
                    <Icon name={teamRoleIcons[index] ?? "info"} size={18} />
                  </span>
                  <div>
                    <h3>{role.title}</h3>
                    <p>{role.description}</p>
                  </div>
                  <span aria-hidden="true" className="role-arrow">
                    <Icon name="arrowUp" size={15} />
                  </span>
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
                <h2>Chia sẻ vấn đề. Cùng xác định hướng đi.</h2>
              </div>
              <Link className="button button-light" href="#about-contact">
                Gửi yêu cầu tư vấn <Icon name="arrowDown" size={17} />
              </Link>
            </div>
            <div id="about-contact">
              <LeadForm
                context="general"
                pagePath="/ve-tnt"
                title="TNT sẵn sàng lắng nghe nhu cầu của bạn"
                description="Chia sẻ lĩnh vực quan tâm để bắt đầu trao đổi."
              />
            </div>
          </div>
        </section>
      </main>
    </PageFrame>
  );
}
