import Link from 'next/link';
import { getI18n } from '@/i18n/server';
import { Icon, type IconName } from '@/components/ui/icon';
import { SiteImage } from '@/components/site-image';
import { LeadForm } from '@/components/lead-form';
import { articleMedia, projectMedia } from '@/lib/media';
import { ContentCard } from '@/components/content-card';
import type { ArticleRecord, ProjectRecord } from '@/content/models';
import type { LeadContext } from '@/server/leads/contract';
import { ResponsiveActions } from '@/components/responsive-actions';
import { ContentCarousel } from '@/components/content-carousel';

type Action = { href: string; label: string };

export async function WireframeHero({ eyebrow, title, accent, description, image, action, secondary, compact = false }: {
  eyebrow: string; title: string; accent?: string; description: string; image: string; action?: Action; secondary?: Action; compact?: boolean;
}) {
  const { t } = await getI18n();
  return <section className={`wf-hero${compact ? ' wf-hero-compact' : ''}`}>
    <div className="wf-hero-art" aria-hidden="true"><SiteImage src={image} alt="" width={1600} height={1000} preload sizes="(max-width: 760px) 100vw, 68vw" mediaKind="background" /></div>
    <div className="wf-hero-shade" aria-hidden="true" />
    <div className="container wf-hero-inner"><div className="wf-hero-copy">
      <span className="wf-kicker">{t(eyebrow)}</span>
      <h1>{t(title)}{accent && <><br /><em>{t(accent)}</em></>}</h1>
      <p>{t(description)}</p>
      {(action || secondary) && <ResponsiveActions className="wf-actions">
        {action && <Link className="rf-button" href={action.href}>{t(action.label)}<Icon name="arrowRight" size={19} /></Link>}
        {secondary && <Link className="rf-button rf-outline" href={secondary.href}>{t(secondary.label)}<Icon name="arrowDown" size={18} /></Link>}
      </ResponsiveActions>}
    </div></div>
  </section>;
}

export async function WireframeHeading({ eyebrow, title, accent, description, action, centered = false }: {
  eyebrow: string; title: string; accent?: string; description?: string; action?: Action; centered?: boolean;
}) {
  const { t } = await getI18n();
  return <div className={`wf-section-heading${centered ? ' wf-centered' : ''}`}>
    <div><span className="wf-kicker">{t(eyebrow)}</span><h2 className="tnt-section-title">{t(title)}{accent && <><br /><em>{t(accent)}</em></>}</h2></div>
    {description && <p>{t(description)}</p>}
    {action && <Link className="wf-text-link" href={action.href}>{t(action.label)}<Icon name="arrowRight" size={18} /></Link>}
  </div>;
}

export async function WireframeContact({ title, description, pagePath, leadContext = 'general', id = 'contact' }: {
  title: string; description: string; pagePath: string; leadContext?: LeadContext; id?: string;
}) {
  const { t } = await getI18n();
  return <section className="wf-contact" id={id}><div className="container wf-contact-grid">
    <div><span className="wf-kicker">{t('LIÊN HỆ VỚI CHÚNG TÔI')}</span><h2 className="tnt-section-title">{t(title)}</h2><p>{t(description)}</p>
      <div className="wf-contact-perks">{([['message','Tư vấn chuyên sâu'],['shield','Bảo mật thông tin'],['people','Đồng hành lâu dài']] as const).map(([icon,label]) => <span key={icon}><Icon name={icon} size={22} />{t(label)}</span>)}</div>
    </div>
    <LeadForm context="general" leadContext={leadContext} pagePath={pagePath} idPrefix={`${id}-form`} title={t('Nhận tư vấn ngay')} description={t('Điền thông tin để đội ngũ chuyên gia của TNT liên hệ với bạn.')} />
  </div></section>;
}

export async function WireframeCta({ title, description, href = '/#contact', label = 'Liên hệ tư vấn' }: { title: string; description: string; href?: string; label?: string }) {
  const { t } = await getI18n();
  return <section className="wf-small-cta"><div className="container"><div><h2 className="tnt-section-title">{t(title)}</h2><p>{t(description)}</p></div><Link className="rf-button" href={href}>{t(label)}<Icon name="arrowRight" size={18} /></Link></div></section>;
}

export async function ProjectCards({ projects, showImageArrows = true }: { projects: readonly ProjectRecord[]; showImageArrows?: boolean }) {
  const { t } = await getI18n();
  return <ContentCarousel label={t('Dự án liên quan')} className="content-card-grid">{projects.map(project => <ContentCard key={project.slug}
    href={`/du-an/${project.slug}`} title={t(project.title)} summary={t(project.summary)}
    image={projectMedia(project.slug,project.image)} imageAlt={t(project.imageAlt ?? project.title)} imageArrow={showImageArrows}
    metadata={<>{t(project.service ?? project.topic)} · {t(project.industry)}{project.isSimulation && <> · <span className="project-simulation-label">{t(project.sourceLabel ?? 'Case study mô phỏng')}</span></>}</>}
    linkLabel={t('Xem câu chuyện dự án')} />)}</ContentCarousel>;
}

export async function ArticleCards({ articles }: { articles: readonly ArticleRecord[] }) {
  const { t } = await getI18n();
  return <ContentCarousel label={t('Bài viết liên quan')} className="content-card-grid">{articles.map(article => <ContentCard key={article.slug}
    href={`/kien-thuc/blog/${article.slug}`} title={t(article.title)} summary={t(article.summary)}
    image={articleMedia(article.slug,article.image)} imageAlt={t(article.imageAlt ?? article.title)}
    metadata={<>{t(article.topic)} · <time dateTime={article.publishedAt}>{article.dateLabel}</time> · {t(article.readingTime)}</>}
    linkLabel={t('Đọc bài viết')} />)}</ContentCarousel>;
}

export async function FeatureCards({ cards, icons = ['data','box','activity','chart','code','people','shield','briefcase'] }: { cards: readonly {id?:string;title:string;description:string;icon?:IconName}[]; icons?: readonly IconName[] }) {
  const { t } = await getI18n();
  const columns = cards.length === 5 ? 3 : Math.min(cards.length,4);
  return <div className={`wf-feature-grid wf-columns-${columns}`}>{cards.map((card,index) => <article className="wf-feature-card" id={card.id} key={card.title}><span className="wf-icon-tile"><Icon name={card.icon ?? icons[index] ?? 'document'} purpose="content" size={30} /></span><h3>{t(card.title)}</h3><p>{t(card.description)}</p></article>)}</div>;
}
