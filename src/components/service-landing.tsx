import Image from "next/image";
import Link from "next/link";
import { LeadForm } from "@/components/lead-form";
import { Icon, type IconName } from "@/components/ui/icon";
import { serviceLandingContent } from "@/content/local-data";
import type {
  ServiceLandingContent,
  ServiceLandingSection,
  ServiceRecord,
} from "@/content/models";

const cardIcons: readonly IconName[] = [
  "data",
  "box",
  "activity",
  "chart",
  "briefcase",
  "setting",
  "people",
  "diagram",
];
const stageIcons: readonly IconName[] = [
  "shoppingCart",
  "box",
  "activity",
  "tickCircle",
  "briefcase",
  "chart",
];

type Props = {
  service: ServiceRecord;
  leadContext: "erp" | "outsourcing" | "body-shop";
};

function SectionHeading({
  eyebrow,
  title,
  accent,
  summary,
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  summary: string;
}) {
  return (
    <div className="section-heading centered-heading">
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="section-title">
        {title}
        {accent ? (
          <>
            <br />
            <span>{accent}</span>
          </>
        ) : null}
      </h2>
      <p className="section-lede">{summary}</p>
    </div>
  );
}

function ServiceSection({
  section,
  index,
}: {
  section: ServiceLandingSection;
  index: number;
}) {
  if (section.kind === "cards") {
    return (
      <section
        className={`section service-data-section ${index % 2 ? "section-pale" : ""}`}
        id={`service-section-${index}`}
      >
        <div className="container">
          <SectionHeading
            eyebrow={section.eyebrow}
            title={section.title}
            accent={section.accent}
            summary={section.summary}
          />
          <div className="service-content-card-grid">
            {section.cards.map((card, cardIndex) => (
              <article className="service-content-card" key={card.title}>
                <span className="service-content-icon" aria-hidden="true">
                  <Icon
                    name={cardIcons[cardIndex % cardIcons.length] ?? "info"}
                    size={21}
                  />
                </span>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </article>
            ))}
          </div>
          {section.disclosure ? (
            <p className="service-disclosure">{section.disclosure}</p>
          ) : null}
        </div>
      </section>
    );
  }

  if (section.kind === "flow") {
    return (
      <section
        className="section section-pale service-flow-section"
        id={`service-section-${index}`}
      >
        <div className="container">
          <SectionHeading
            eyebrow={section.eyebrow}
            title={section.title}
            accent={section.accent}
            summary={section.summary}
          />
          <div className="service-flow-board">
            <div className="service-flow-state">
              <span className="workflow-state-label">HIỆN TRẠNG PHỔ BIẾN</span>
              <ul className="workflow-context-list">
                {section.before.map((item) => (
                  <li key={item}>
                    <Icon name="closeCircle" size={16} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <span className="service-flow-arrow" aria-hidden="true">
              <Icon name="arrowRight" size={25} />
            </span>
            <div className="service-flow-state service-flow-state-target">
              <span className="workflow-state-label">MÔ HÌNH MỤC TIÊU</span>
              <ul className="workflow-context-list workflow-context-list-after">
                {section.after.map((item) => (
                  <li key={item}>
                    <Icon name="tickCircle" size={16} />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="workflow-nodes">
                {section.stages.map((stage, stageIndex) => (
                  <div className="workflow-node" key={stage.title}>
                    <span className="workflow-node-icon" aria-hidden="true">
                      <Icon
                        name={stageIcons[stageIndex % stageIcons.length] ?? "info"}
                        size={17}
                      />
                    </span>
                    <strong>{stage.title}</strong>
                    <span>{stage.description}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (section.kind === "steps") {
    return (
      <section
        className="section service-steps-section"
        id={`service-section-${index}`}
      >
        <div className="container">
          <SectionHeading
            eyebrow={section.eyebrow}
            title={section.title}
            accent={section.accent}
            summary={section.summary}
          />
          <ol className="service-step-grid">
            {section.steps.map((step, stepIndex) => (
              <li className="service-step-card" key={step.title}>
                <span className="service-step-number">
                  {String(stepIndex + 1).padStart(2, "0")}
                </span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    );
  }

  if (section.kind === "image-callout") {
    return (
      <section
        className="section service-image-section"
        id={`service-section-${index}`}
      >
        <div className="container service-image-layout">
          <div className="service-image-frame">
            <Image
              src={section.image}
              alt={section.imageAlt}
              width={760}
              height={540}
              sizes="(max-width: 760px) 100vw, 52vw"
            />
          </div>
          <div className="service-image-copy">
            <span className="eyebrow">{section.eyebrow}</span>
            <h2 className="section-title">
              {section.title}
              <br />
              <span>{section.accent}</span>
            </h2>
            <p>{section.summary}</p>
            <ul>
              {section.points.map((point) => (
                <li key={point}>
                  <Icon name="tickCircle" size={18} />
                  {point}
                </li>
              ))}
            </ul>
            {section.disclosure ? (
              <p className="service-disclosure">{section.disclosure}</p>
            ) : null}
            {section.href && section.linkLabel ? (
              <Link className="text-link" href={section.href}>
                {section.linkLabel} <Icon name="arrowRight" size={16} />
              </Link>
            ) : null}
          </div>
        </div>
      </section>
    );
  }

  if (section.kind === "projects") {
    return (
      <section
        className="section section-pale service-project-section"
        id={`service-section-${index}`}
      >
        <div className="container">
          <SectionHeading
            eyebrow={section.eyebrow}
            title={section.title}
            summary={section.summary}
          />
          <div className="service-project-grid">
            {section.projects.map((project) => (
              <article className="service-project-card" key={project.title}>
                <Link href={project.href} className="service-project-image">
                  <Image
                    src={project.image}
                    alt={project.imageAlt}
                    width={720}
                    height={460}
                    sizes="(max-width: 760px) 100vw, 50vw"
                  />
                </Link>
                <div className="service-project-copy">
                  <span className="service-project-category">{project.category}</span>
                  <span className="sample-label">{project.disclosure}</span>
                  <h3>
                    <Link href={project.href}>{project.title}</Link>
                  </h3>
                  <p>{project.description}</p>
                  <Link className="text-link" href={project.href}>
                    Xem câu chuyện dự án <Icon name="arrowRight" size={16} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="section service-faq-section"
      id={`service-section-${index}`}
    >
      <div className="container faq-layout">
        <div className="faq-intro">
          <span className="eyebrow">{section.eyebrow}</span>
          <h2 className="section-title">{section.title}</h2>
          <p>{section.summary}</p>
        </div>
        <div className="faq-list">
          {section.faqs.map((faq, faqIndex) => (
            <details className="faq-item" key={faq.question}>
              <summary>
                <span className="faq-index">
                  {String(faqIndex + 1).padStart(2, "0")}
                </span>
                <span>{faq.question}</span>
                <span aria-hidden="true" className="faq-toggle">
                  <Icon className="faq-toggle-closed" name="addCircle" size={19} />
                  <Icon className="faq-toggle-open" name="closeCircle" size={19} />
                </span>
              </summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ServiceLanding({ service, leadContext }: Props) {
  const content: ServiceLandingContent | undefined =
    serviceLandingContent[service.slug];
  if (!content) {
    throw new Error(`Missing service landing content for "${service.slug}".`);
  }

  return (
    <main>
      <section className="service-hero">
        <div className="service-hero-image" aria-hidden="true">
          <Image
            src={content.hero.image}
            alt=""
            fill
            priority
            sizes="(max-width: 860px) 100vw, 55vw"
          />
        </div>
        <div className="container service-hero-inner">
          <div className="service-hero-copy">
            <span className="eyebrow eyebrow-light">
              {content.hero.eyebrow} <span className="eyebrow-rule" />
            </span>
            <h1>
              {content.hero.title}
              <br />
              <span>{content.hero.accent}</span>
            </h1>
            <p>{content.hero.summary}</p>
            <div className="service-hero-actions">
              <Link className="button button-primary" href="#service-contact">
                {content.hero.ctaLabel} <Icon name="arrowRight" size={17} />
              </Link>
              <Link className="button button-ghost" href="#service-section-0">
                {content.hero.secondaryLabel} <Icon name="arrowDown" size={17} />
              </Link>
            </div>
          </div>
          <div className="service-hero-visual">
            <Image
              src={content.hero.image}
              alt={content.hero.imageAlt}
              width={760}
              height={540}
              priority
              sizes="(max-width: 860px) 100vw, 45vw"
            />
            <span className="service-hero-badge">
              <Icon
                name={
                  service.slug === "erp"
                    ? "box"
                    : service.slug === "outsourcing"
                      ? "code"
                      : "people"
                }
                size={18}
              />
              {service.title}
            </span>
          </div>
        </div>
      </section>

      {content.sections.map((section, index) => (
        <ServiceSection key={`${section.kind}-${index}`} section={section} index={index} />
      ))}

      <section className="section contact-section" id="service-contact">
        <div className="container">
          <LeadForm
            context="general"
            leadContext={leadContext}
            pagePath={service.href}
            title={content.contact.title}
            description={content.contact.description}
          />
        </div>
      </section>
    </main>
  );
}
