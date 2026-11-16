import Link from 'next/link';
import { getI18n } from '@/i18n/server';
import { PageFrame } from '@/components/site-shell';
import { SiteImage } from '@/components/site-image';
import { CatalogBrowser } from '@/components/catalog-browser';
import { Icon } from '@/components/ui/icon';
import { WireframeCta, WireframeHeading, WireframeHero } from '@/components/wireframe-sections';
import { articleRepository } from '@/content/repositories';
import { createPageMetadata } from '@/lib/metadata';
import { articleMedia, media } from '@/lib/media';

export async function generateMetadata(){return createPageMetadata({title:'Blog',description:'Tìm kiếm góc nhìn về ERP, sản xuất và phát triển công nghệ.',path:'/kien-thuc/blog'});}

export default async function BlogPage(){
  const {t}=await getI18n();
  const articles=await articleRepository.listForPreview();
  const featured=articles[0];
  if(!featured)throw new Error('Missing featured article');
  return <PageFrame breadcrumbs={[{ label: 'Kiến thức', href: '/kien-thuc' }, { label: 'Blog' }]}><main className="wf-page wf-insights-page">
    <WireframeHero eyebrow="BLOG / KIẾN THỨC" title="Góc nhìn công nghệ" accent="gắn với vận hành." description="Bài viết về ERP, sản xuất, phát triển phần mềm và chuyển đổi số cho doanh nghiệp." image={media.technology} action={{href:'#blog-list',label:'Khám phá bài viết'}} />
    <section className="wf-section"><div className="container wf-split">
      <Link className="wf-photo" href={`/kien-thuc/blog/${featured.slug}`}><SiteImage src={articleMedia(featured.slug,featured.image)} alt={t(featured.imageAlt??featured.title)} width={1600} height={1000} sizes="(max-width:760px) 100vw, 50vw" /></Link>
      <div className="wf-split-copy"><span className="wf-kicker">{t('BÀI VIẾT NỔI BẬT')}</span><h2 className="tnt-section-title">{t(featured.title)}</h2><span className="wf-meta">{t(featured.topic)} · {featured.dateLabel} · {t(featured.readingTime)}</span><p>{t(featured.summary)}</p><Link className="rf-button" href={`/kien-thuc/blog/${featured.slug}`}>{t('Đọc bài viết')}<Icon name="arrowRight" size={18} /></Link></div>
    </div></section>
    <section className="wf-section wf-soft" id="blog-list"><div className="container">
      <WireframeHeading eyebrow="THƯ VIỆN BÀI VIẾT" title="Khám phá theo chủ đề" description="Tìm kiếm và lọc bài viết theo lĩnh vực bạn quan tâm." />
      <CatalogBrowser kind="article" entries={articles.map(article=>({...article,href:`/kien-thuc/blog/${article.slug}`,image:articleMedia(article.slug,article.image)}))} />
    </div></section>
    <WireframeCta title="Bạn đang tìm giải pháp phù hợp cho doanh nghiệp?" description="Trao đổi với TNT về ERP và bài toán vận hành thực tế." href="/dich-vu/erp" label="Khám phá ERP" />
  </main></PageFrame>;
}
