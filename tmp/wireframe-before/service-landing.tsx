import { getI18n } from "@/i18n/server";
import Image from "next/image";
import Link from "next/link";
import { LeadForm } from "@/components/lead-form";
import { Icon, type IconName } from "@/components/ui/icon";
import { serviceLandingContent } from "@/content/local-data";
import type { ServiceLandingContent, ServiceLandingSection, ServiceRecord, } from "@/content/models";
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
async function SectionHeading({ eyebrow, title, accent, summary, }: {
    eyebrow: string;
    title: string;
    accent?: string;
    summary: string;
}) {
    const { t } = await getI18n();
    return (<div className="section-heading centered-heading">
      <span className="eyebrow">{t(eyebrow)}</span>
      <h2 className="section-title">
        {t(title)}
        {t(accent ? (<>
            <br />
            <span>{t(accent)}</span>
          </>) : null)}
      </h2>
      <p className="section-lede">{t(summary)}</p>
    </div>);
}
async function ServiceSection({ section, index, }: {
    section: ServiceLandingSection;
    index: number;
}) {
    const { t } = await getI18n();
    if (section.kind === "cards") {
        return (<section className={`section service-data-section ${index % 2 ? "section-pale" : ""}`} id={`service-section-${index}`}>
        <div className="container">
          <SectionHeading eyebrow={t(section.eyebrow)} title={t(section.title)} accent={section.accent} summary={section.summary}/>
          <div className="service-content-card-grid">
            {t(section.cards.map((card, cardIndex) => (<article className="service-content-card" key={card.title}>
                <span className="service-content-icon" aria-hidden="true">
                  <Icon name={cardIcons[cardIndex % cardIcons.length] ?? "info"} size={21}/>
                </span>
                <h3>{t(card.title)}</h3>
                <p>{t(card.description)}</p>
              </article>)))}
          </div>
          {t(section.disclosure ? (<p className="service-disclosure">{t(section.disclosure)}</p>) : null)}
        </div>
      </section>);
    }
    if (section.kind === "flow") {
        return (<section className="section section-pale service-flow-section" id={`service-section-${index}`}>
        <div className="container">
          <SectionHeading eyebrow={t(section.eyebrow)} title={t(section.title)} accent={section.accent} summary={section.summary}/>
          <div className="service-flow-board">
            <div className="service-flow-state">
              <span className="workflow-state-label">{t("HIỆN TRẠNG PHỔ BIẾN")}</span>
              <ul className="workflow-context-list">
                {t(section.before.map((item) => (<li key={item}>
                    <Icon name="closeCircle" size={16}/>
                    {t(item)}
                  </li>)))}
              </ul>
            </div>
            <span className="service-flow-arrow" aria-hidden="true">
              <Icon name="arrowRight" size={25}/>
            </span>
            <div className="service-flow-state service-flow-state-target">
              <span className="workflow-state-label">{t("MÔ HÌNH MỤC TIÊU")}</span>
              <ul className="workflow-context-list workflow-context-list-after">
                {t(section.after.map((item) => (<li key={item}>
                    <Icon name="tickCircle" size={16}/>
                    {t(item)}
                  </li>)))}
              </ul>
              <div className="workflow-nodes">
                {t(section.stages.map((stage, stageIndex) => (<div className="workflow-node" key={stage.title}>
                    <span className="workflow-node-icon" aria-hidden="true">
                      <Icon name={stageIcons[stageIndex % stageIcons.length] ?? "info"} size={17}/>
                    </span>
                    <strong>{t(stage.title)}</strong>
                    <span>{t(stage.description)}</span>
                  </div>)))}
              </div>
            </div>
          </div>
        </div>
      </section>);
    }
    if (section.kind === "steps") {
        return (<section className="section service-steps-section" id={`service-section-${index}`}>
        <div className="container">
          <SectionHeading eyebrow={t(section.eyebrow)} title={t(section.title)} accent={section.accent} summary={section.summary}/>
          <ol className="service-step-grid">
            {t(section.steps.map((step, stepIndex) => (<li className="service-step-card" key={step.title}>
                <span className="service-step-number">
                  {t(String(stepIndex + 1).padStart(2, "0"))}
                </span>
                <h3>{t(step.title)}</h3>
                <p>{t(step.description)}</p>
              </li>)))}
          </ol>
        </div>
      </section>);
    }
    if (section.kind === "image-callout") {
        return (<section className="section service-image-section" id={`service-section-${index}`}>
        <div className="container service-image-layout">
          <div className="service-image-frame">
            <Image src={section.image} alt={t(section.imageAlt)} width={760} height={540} sizes="(max-width: 760px) 100vw, 52vw"/>
          </div>
          <div className="service-image-copy">
            <span className="eyebrow">{t(section.eyebrow)}</span>
            <h2 className="section-title">
              {t(section.title)}
              <br />
              <span>{t(section.accent)}</span>
            </h2>
            <p>{t(section.summary)}</p>
            <ul>
              {t(section.points.map((point) => (<li key={point}>
                  <Icon name="tickCircle" size={18}/>
                  {t(point)}
                </li>)))}
            </ul>
            {t(section.disclosure ? (<p className="service-disclosure">{t(section.disclosure)}</p>) : null)}
            {t(section.href && section.linkLabel ? (<Link className="text-link" href={section.href}>
                {t(section.linkLabel)} <Icon name="arrowRight" size={16}/>
              </Link>) : null)}
          </div>
        </div>
      </section>);
    }
    if (section.kind === "projects") {
        return (<section className="section section-pale service-project-section" id={`service-section-${index}`}>
        <div className="container">
          <SectionHeading eyebrow={t(section.eyebrow)} title={t(section.title)} summary={section.summary}/>
          <div className="service-project-grid">
            {t(section.projects.map((project) => (<article className="service-project-card" key={project.title}>
                <Link href={project.href} className="service-project-image">
                  <Image src={project.image} alt={t(project.imageAlt)} width={720} height={460} sizes="(max-width: 760px) 100vw, 50vw"/>
                </Link>
                <div className="service-project-copy">
                  <span className="service-project-category">{t(project.category)}</span>
                  <span className="sample-label">{t(project.disclosure)}</span>
                  <h3>
                    <Link href={project.href}>{t(project.title)}</Link>
                  </h3>
                  <p>{t(project.description)}</p>
                  <Link className="text-link" href={project.href}>{t("Xem câu chuyện dự án ")}<Icon name="arrowRight" size={16}/>
                  </Link>
                </div>
              </article>)))}
          </div>
        </div>
      </section>);
    }
    return (<section className="section service-faq-section" id={`service-section-${index}`}>
      <div className="container faq-layout">
        <div className="faq-intro">
          <span className="eyebrow">{t(section.eyebrow)}</span>
          <h2 className="section-title">{t(section.title)}</h2>
          <p>{t(section.summary)}</p>
        </div>
        <div className="faq-list">
          {t(section.faqs.map((faq, faqIndex) => (<details className="faq-item" key={faq.question}>
              <summary>
                <span className="faq-index">
                  {t(String(faqIndex + 1).padStart(2, "0"))}
                </span>
                <span>{t(faq.question)}</span>
                <span aria-hidden="true" className="faq-toggle">
                  <Icon className="faq-toggle-closed" name="addCircle" size={19}/>
                  <Icon className="faq-toggle-open" name="closeCircle" size={19}/>
                </span>
              </summary>
              <p>{t(faq.answer)}</p>
            </details>)))}
        </div>
      </div>
    </section>);
}
export async function ServiceLanding({ service, leadContext }: Props) {
    const { t } = await getI18n();
    const content: ServiceLandingContent | undefined = serviceLandingContent[service.slug];
    if (!content) {
        throw new Error(`Missing service landing content for "${service.slug}".`);
    }
    return (<main>
      <section className="service-hero">
        <div className="service-hero-image" aria-hidden="true">
          <Image src={content.hero.image} alt={t("")} fill priority sizes="(max-width: 860px) 100vw, 55vw"/>
        </div>
        <div className="container service-hero-inner">
          <div className="service-hero-copy">
            <span className="eyebrow eyebrow-light">
              {t(content.hero.eyebrow)} <span className="eyebrow-rule"/>
            </span>
            <h1>
              {t(content.hero.title)}
              <br />
              <span>{t(content.hero.accent)}</span>
            </h1>
            <p>{t(content.hero.summary)}</p>
            <div className="service-hero-actions">
              <Link className="button button-primary" href="#service-contact">
                {t(content.hero.ctaLabel)} <Icon name="arrowRight" size={17}/>
              </Link>
              <Link className="button button-ghost" href="#service-section-0">
                {t(content.hero.secondaryLabel)} <Icon name="arrowDown" size={17}/>
              </Link>
            </div>
          </div>
          <div className="service-hero-visual">
            <Image src={content.hero.image} alt={t(content.hero.imageAlt)} width={760} height={540} priority sizes="(max-width: 860px) 100vw, 45vw"/>
            <span className="service-hero-badge">
              <Icon name={service.slug === "erp"
            ? "box"
            : service.slug === "outsourcing"
                ? "code"
                : "people"} size={18}/>
              {t(service.title)}
            </span>
          </div>
        </div>
      </section>

      {t(content.sections.map((section, index) => (<ServiceSection key={`${section.kind}-${index}`} section={section} index={index}/>)))}

      <section className="section contact-section" id="service-contact">
        <div className="container">
          <LeadForm context="general" leadContext={leadContext} pagePath={service.href} title={t(content.contact.title)} description={t(content.contact.description)}/>
        </div>
      </section>
    </main>);
}
