import Link from 'next/link';
import { getI18n } from '@/i18n/server';
import { SiteImage } from '@/components/site-image';
import { Icon, type IconName } from '@/components/ui/icon';
import { articles, serviceLandingContent } from '@/content/local-data';
import type { ServiceLandingSection, ServiceRecord } from '@/content/models';
import { media, projectMedia } from '@/lib/media';
import { ArticleCards, FeatureCards, WireframeContact, WireframeHeading, WireframeHero } from '@/components/wireframe-sections';
import { Accordion } from '@/components/accordion';
import { ContentCarousel } from '@/components/content-carousel';
import { ContentCard } from '@/components/content-card';

const beforeIcons: readonly IconName[] = ['data', 'documentCopy', 'monitor'];
const afterIcons: readonly IconName[] = ['link', 'taskSquare', 'chartSuccess'];
const expertiseIcons: Record<string, readonly IconName[]> = {
  erp: ['setting', 'checklist', 'chartSuccess'],
  outsourcing: ['driver', 'monitor', 'mobile', 'hierarchy', 'shield'],
  'body-shop': ['teacher', 'people', 'messageText'],
};

async function ServiceSection({ section, index, service }: { section: ServiceLandingSection; index: number; service: string }) {
  const { t } = await getI18n();
  const id = `service-section-${index}`;
  if (section.kind === 'cards') {
    const dark = section.eyebrow.includes('FIT FIRST');
    const interactiveCards = service === 'erp' && ['HỆ THỐNG / MODULE', 'BÀI TOÁN DOANH NGHIỆP'].includes(section.eyebrow);
    return <section className={`wf-section${dark ? ' wf-navy' : index % 2 ? ' wf-soft' : ''}${interactiveCards ? ' wf-interactive-cards' : ''}`} id={id}><div className="container">
      <WireframeHeading eyebrow={section.eyebrow} title={section.title} accent={section.accent} description={section.summary} />
      <FeatureCards cards={section.cards} />

    </div></section>;
  }
  if (section.kind === 'flow') return <section className="wf-section wf-soft" id={id}><div className="container">
    <WireframeHeading eyebrow={section.eyebrow} title={section.title} accent={section.accent} description={section.summary} />
    <div className="wf-compare">
      <article><h3>{t('HIỆN TRẠNG PHỔ BIẾN')}</h3><ul>{section.before.map((line,i) => <li key={line}><Icon name={beforeIcons[i]} size={20} />{t(line)}</li>)}</ul></article>
      <article><h3>{t('MÔ HÌNH MỤC TIÊU')}</h3><ul>{section.after.map((line,i) => <li key={line}><Icon name={afterIcons[i]} size={20} />{t(line)}</li>)}</ul><div className="wf-flow-stages">{section.stages.map(stage => <span key={stage.title}>{t(stage.title)}</span>)}</div></article>
    </div>
  </div></section>;
  if (section.kind === 'steps') return <section className="wf-section wf-navy" id={id}><div className="container">
    <WireframeHeading eyebrow={section.eyebrow} title={section.title} accent={section.accent} description={section.summary} />
    <ol className={`wf-process-grid${section.steps.length > 4 ? ' wf-process-six' : ''}`}>
      {section.steps.map((step,i) => <li key={step.title}>
        {step.icon ? <div className="wf-process-step-header">
          <span>{String(i+1).padStart(2,'0')}</span>
          <Icon className="wf-process-step-icon" name={step.icon} purpose="content" size={48} />
        </div> : <span>{String(i+1).padStart(2,'0')}</span>}
        <h3>{t(step.title)}</h3><p>{t(step.description)}</p>
      </li>)}
    </ol>
  </div></section>;
  if (section.kind === 'image-callout') return <section className="wf-section" id={id}><div className="container wf-split">
    <div className="wf-photo"><SiteImage src={service === 'body-shop' ? media.team : service === 'outsourcing' ? media.software : media.food} alt={t(section.imageAlt)} width={1600} height={1000} sizes="(max-width:760px) 100vw, 50vw" /></div>
    <div className="wf-split-copy"><span className="wf-kicker">{t(section.eyebrow)}</span><h2 className="tnt-section-title">{t(section.title)}<br /><em>{t(section.accent)}</em></h2><p>{t(section.summary)}</p><ul className="wf-points">{section.points.map((point,i) => <li key={point}><Icon name={expertiseIcons[service][i]} size={20} />{t(point)}</li>)}</ul>
      {section.href && section.linkLabel && <Link className="rf-button" href={section.href}>{t(section.linkLabel)}<Icon name="arrowRight" size={18} /></Link>}

    </div>
  </div></section>;
  if (section.kind === 'projects') return <section className="wf-section wf-soft" id={id}><div className="container">
    <WireframeHeading eyebrow={section.eyebrow} title={section.title} description={section.summary} />
    <ContentCarousel enabled={section.projects.length > 1} label={t(section.title)} className="content-card-grid">{section.projects.map(project => <ContentCard key={project.href}
      href={project.href} title={t(project.title)} summary={t(project.description)} image={projectMedia(project.href.split('/').pop() ?? '', project.image)} imageAlt={t(project.imageAlt)}
      metadata={<>{t(project.category)}{project.disclosure && <> · <span className="project-simulation-label">{t(project.disclosure)}</span></>}</>}
      linkLabel={t('Xem câu chuyện dự án')} />)}</ContentCarousel>
  </div></section>;
  return <section className="wf-section wf-service-faq" id={id}><div className="container">
    <WireframeHeading eyebrow={section.eyebrow} title={section.title} description={section.summary} />
    <div className="faq-list">{section.faqs.map(faq => <Accordion key={faq.question} question={t(faq.question)}><p>{t(faq.answer)}</p></Accordion>)}</div>
  </div></section>;
}

export function ServiceLanding({ service, leadContext }: { service: ServiceRecord; leadContext: 'erp'|'outsourcing'|'body-shop' }) {
  const content = serviceLandingContent[service.slug];
  if (!content) throw new Error(`Missing service landing content for ${service.slug}`);
  const image = service.slug === 'erp' ? media.food : service.slug === 'outsourcing' ? media.technology : media.team;
  const relatedArticles = articles.filter(article => content.relatedArticleSlugs?.includes(article.slug));
  return <main className="wf-page" data-service={service.slug}>
    <WireframeHero eyebrow={content.hero.eyebrow} title={content.hero.title} accent={content.hero.accent} description={content.hero.summary} image={image} action={{href:'#service-contact',label:content.hero.ctaLabel}} secondary={{href:'#service-section-0',label:content.hero.secondaryLabel}} />
    {content.sections.map((section,index) => <ServiceSection key={index} section={section} index={index} service={service.slug} />)}
    {relatedArticles.length > 0 && <section className="wf-section wf-related-articles"><div className="container">
      <WireframeHeading eyebrow="ĐỌC TIẾP" title="Bài viết liên quan" description="Những nội dung có thể bạn quan tâm." />
      <ArticleCards articles={relatedArticles} />
    </div></section>}
    <WireframeContact id="service-contact" title={content.contact.title} description={content.contact.description} pagePath={service.href} leadContext={leadContext} />
  </main>;
}
