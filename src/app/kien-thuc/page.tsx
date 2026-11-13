import Link from 'next/link';
import { getI18n } from '@/i18n/server';
import { PageFrame } from '@/components/site-shell';
import { SiteImage } from '@/components/site-image';
import { Icon } from '@/components/ui/icon';
import { ArticleCards, WireframeCta, WireframeHeading, WireframeHero } from '@/components/wireframe-sections';
import { articleRepository, guideRepository } from '@/content/repositories';
import { createPageMetadata } from '@/lib/metadata';
import { articleMedia, media } from '@/lib/media';

export async function generateMetadata(){return createPageMetadata({title:'Kiến thức',description:'Góc nhìn thực tiễn về quản trị doanh nghiệp, ERP, sản xuất, công nghệ và phát triển phần mềm.',path:'/kien-thuc'});}

export default async function InsightsPage(){
  const {t}=await getI18n();
  const [articles,guides]=await Promise.all([articleRepository.listForPreview(),guideRepository.listForPreview()]);
  const featured=articles[0];
  if(!featured)throw new Error('Missing featured article');
  const topics=['ERP','Sản xuất','Outsourcing','Body Shop'] as const;
  return <PageFrame><main className="wf-page">
    <WireframeHero eyebrow="GÓC NHÌN CÔNG NGHỆ" title="Kiến thức thực tiễn." accent="Góc nhìn từ chuyên gia." description="Tìm hiểu về quản trị doanh nghiệp, ERP, sản xuất, công nghệ và những kinh nghiệm triển khai phù hợp với nhu cầu thực tế." image={media.technology} action={{href:'/kien-thuc/blog',label:'Khám phá bài viết'}} secondary={{href:'/kien-thuc/guides',label:'Xem tài liệu'}} />
    <section className="wf-section"><div className="container">
      <WireframeHeading eyebrow="BÀI VIẾT NỔI BẬT" title="Xu hướng & góc nhìn" accent="đáng quan tâm" description="Các chủ đề được sắp xếp theo nhu cầu tìm hiểu của doanh nghiệp. Bài viết mẫu cần được duyệt trước khi phát hành." />
      <div className="wf-editorial-grid">
        <article className="wf-feature-article"><Link className="wf-photo" href={`/kien-thuc/blog/${featured.slug}`}><SiteImage src={articleMedia(featured.slug,featured.image)} alt={t(featured.imageAlt??featured.title)} width={1600} height={1000} sizes="(max-width:1100px) 100vw, 50vw" /></Link><div className="wf-feature-article-copy"><span className="wf-meta">{t(featured.topic)} · {featured.dateLabel}</span><h3><Link href={`/kien-thuc/blog/${featured.slug}`}>{t(featured.title)}</Link></h3><p>{t(featured.summary)}</p><Link className="rf-button" href={`/kien-thuc/blog/${featured.slug}`}>{t('Đọc bài viết')}<Icon name="arrowRight" size={18} /></Link></div></article>
        <div className="wf-editorial-side">{articles.slice(1,3).map(article=><article className="wf-content-card" key={article.slug}><Link className="wf-photo" href={`/kien-thuc/blog/${article.slug}`}><SiteImage src={articleMedia(article.slug,article.image)} alt={t(article.imageAlt??article.title)} width={1600} height={1000} sizes="(max-width:760px) 100vw, 28vw" /></Link><div className="wf-card-copy"><span className="wf-meta">{t(article.topic)} · {article.dateLabel}</span><h3><Link href={`/kien-thuc/blog/${article.slug}`}>{t(article.title)}</Link></h3><Link className="wf-text-link" href={`/kien-thuc/blog/${article.slug}`}>{t('Đọc bài viết')}<Icon name="arrowRight" size={16} /></Link></div></article>)}</div>
      </div>
    </div></section>
    <section className="wf-section wf-soft"><div className="container">
      <WireframeHeading eyebrow="CHỦ ĐỀ KIẾN THỨC" title="Tìm theo lĩnh vực quan tâm" description="Các chủ đề định hướng từ ERP đến hoạt động sản xuất và phát triển phần mềm." />
      <div className="wf-topics">{topics.map((topic,index)=><Link key={topic} href={`/kien-thuc/blog?topic=${encodeURIComponent(topic)}`}><Icon name={(['box','activity','code','people'] as const)[index]} size={27} /><span>{t(topic)}</span><Icon name="arrowRight" size={18} /></Link>)}</div>
    </div></section>
    <section className="wf-section"><div className="container">
      <WireframeHeading eyebrow="BÀI VIẾT MỚI" title="Cập nhật kiến thức" action={{href:'/kien-thuc/blog',label:'Xem tất cả bài viết'}} />
      <ArticleCards articles={articles.slice(0,3)} />
    </div></section>
    <section className="wf-section wf-soft"><div className="container">
      <WireframeHeading eyebrow="TÀI LIỆU / GUIDES" title="Tài liệu để tìm hiểu sâu hơn" action={{href:'/kien-thuc/guides',label:'Khám phá thư viện tài liệu'}} />
      <div className="wf-resource-grid">{guides.slice(0,3).map(guide=><article className="wf-resource" key={guide.slug}><span className="wf-icon-tile"><Icon name="document" size={31} /></span><h3>{t(guide.title)}</h3><p>{t(guide.summary)}</p><span className="wf-meta">{t(guide.fileType)} · {t(guide.fileSize)}</span><p><Link className="wf-text-link" href={`/kien-thuc/guides#guide-${guide.slug}`}>{t('Xem bản mô phỏng')}<Icon name="arrowRight" size={16} /></Link></p></article>)}</div>
    </div></section>
    <WireframeCta title="Có câu hỏi về giải pháp ERP?" description="Chuyển từ việc tìm hiểu kiến thức sang trao đổi bài toán doanh nghiệp." href="/dich-vu/erp" label="Nhận tư vấn ERP" />
  </main></PageFrame>;
}
