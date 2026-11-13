import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getI18n } from '@/i18n/server';
import { PageFrame } from '@/components/site-shell';
import { SiteImage } from '@/components/site-image';
import { Icon } from '@/components/ui/icon';
import { ArticleCards, WireframeHeading } from '@/components/wireframe-sections';
import { articleRepository } from '@/content/repositories';
import { createPageMetadata } from '@/lib/metadata';
import { createAnchorId } from '@/lib/anchor-id';
import { articleMedia } from '@/lib/media';

type Props={params:Promise<{slug:string}>};
export async function generateMetadata({params}:Props):Promise<Metadata>{
  const {slug}=await params;
  const article=await articleRepository.findForPreviewBySlug(slug);
  const {t}=await getI18n();
  return article?createPageMetadata({title:article.title,description:article.summary,path:`/kien-thuc/blog/${slug}`}):{title:t('Không tìm thấy bài viết')};
}

export default async function ArticlePage({params}:Props){
  const {slug}=await params;
  const article=await articleRepository.findForPreviewBySlug(slug);
  if(!article)notFound();
  const {t}=await getI18n();
  const all=await articleRepository.listForPreview();
  const related=all.filter(item=>article.relatedArticleSlugs.includes(item.slug));
  return <PageFrame><main className="wf-page">
    <section className="wf-article-top"><div className="container">
      <nav className="wf-breadcrumb" aria-label="Breadcrumb"><Link href="/kien-thuc">{t('Kiến thức')}</Link><span>/</span><Link href="/kien-thuc/blog">Blog</Link><span>/</span><span>{t(article.topic)}</span></nav>
      <span className="wf-meta">{t(article.topic)} · <time dateTime={article.publishedAt}>{article.dateLabel}</time> · {t(article.readingTime)}</span>
      <h1>{t(article.title)}</h1><p>{t(article.summary)}</p><small className="wf-disclosure">{t(article.sourceLabel)}</small>
    </div></section>
    <section className="wf-article-photo-wrap"><div className="container wf-article-photo"><div className="wf-photo"><SiteImage src={articleMedia(article.slug,article.image)} alt={t(article.imageAlt??article.title)} width={1600} height={1000} preload sizes="(max-width:760px) 100vw, 80vw" /></div></div></section>
    <section className="wf-section"><div className="container wf-article-layout">
      <nav className="wf-article-toc" aria-label={t('Mục lục bài viết')}><span className="wf-kicker">{t('TRONG BÀI VIẾT')}</span><ol>{article.sections.map((section,index)=><li key={section.heading}><span>{String(index+1).padStart(2,'0')}</span><a href={`#${createAnchorId(section.heading)}`}>{t(section.heading)}</a></li>)}</ol></nav>
      <article className="wf-article-body">{article.sections.map(section=><section id={createAnchorId(section.heading)} key={section.heading}><h2>{t(section.heading)}</h2>{section.paragraphs.map(paragraph=><p key={paragraph}>{t(paragraph)}</p>)}</section>)}
        {article.relatedServiceHref&&article.relatedServiceLabel&&<aside className="wf-article-callout"><h3>{t('Quan tâm đến giải pháp?')}</h3><p>{t('Khám phá cách TNT tiếp cận bài toán quản trị doanh nghiệp.')}</p><Link className="wf-text-link" href={article.relatedServiceHref}>{t(article.relatedServiceLabel)}<Icon name="arrowRight" size={18} /></Link></aside>}
      </article>
    </div></section>
    {related.length>0&&<section className="wf-section wf-soft"><div className="container"><WireframeHeading eyebrow="ĐỌC TIẾP" title="Bài viết liên quan" description="Những nội dung có thể bạn quan tâm." /><ArticleCards articles={related} /></div></section>}
  </main></PageFrame>;
}
