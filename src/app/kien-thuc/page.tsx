import Link from 'next/link';
import { getI18n } from '@/i18n/server';
import { PageFrame } from '@/components/site-shell';
import { Icon } from '@/components/ui/icon';
import { ArticleCards, WireframeCta, WireframeHeading, WireframeHero } from '@/components/wireframe-sections';
import { articleRepository, guideRepository } from '@/content/repositories';
import { createPageMetadata } from '@/lib/metadata';
import { media } from '@/lib/media';
import { GuideCard } from '@/components/guide-card';

export async function generateMetadata(){return createPageMetadata({title:'Kiến thức',description:'Góc nhìn thực tiễn về quản trị doanh nghiệp, ERP, sản xuất, công nghệ và phát triển phần mềm.',path:'/kien-thuc'});}

export default async function InsightsPage(){
  const {t}=await getI18n();
  const [articles,guides]=await Promise.all([articleRepository.listForPreview(),guideRepository.listForPreview()]);
  if(!articles.length)throw new Error('Missing featured article');
  const topics=['ERP','Sản xuất','Outsourcing','Body Shop','Giáo dục'] as const;
  return <PageFrame breadcrumbs={[{ label: 'Kiến thức' }]}><main className="wf-page wf-insights-page">
    <WireframeHero eyebrow="GÓC NHÌN CÔNG NGHỆ" title="Kiến thức thực tiễn." accent="Góc nhìn từ chuyên gia." description="Tìm hiểu về quản trị doanh nghiệp, ERP, sản xuất, công nghệ và những kinh nghiệm triển khai phù hợp với nhu cầu thực tế." image={media.technology} action={{href:'/kien-thuc/blog',label:'Khám phá bài viết'}} secondary={{href:'/kien-thuc/guides',label:'Xem tài liệu'}} />
    <section className="wf-section"><div className="container">
      <WireframeHeading eyebrow="BÀI VIẾT NỔI BẬT" title="Xu hướng & góc nhìn" accent="đáng quan tâm" description="Các chủ đề được sắp xếp theo nhu cầu tìm hiểu của doanh nghiệp." />
      <ArticleCards articles={articles.slice(0,3)} />
    </div></section>
    <section className="wf-section wf-soft"><div className="container">
      <WireframeHeading eyebrow="CHỦ ĐỀ KIẾN THỨC" title="Tìm theo lĩnh vực quan tâm" description="Các chủ đề định hướng từ ERP đến hoạt động sản xuất và phát triển phần mềm." />
      <div className="wf-topics">{topics.map((topic,index)=><Link key={topic} href={`/kien-thuc/blog?topic=${encodeURIComponent(topic)}`}><Icon name={(['box','activity','code','people','book'] as const)[index]} size={27} /><span>{t(topic)}</span><Icon name="arrowRight" size={18} /></Link>)}</div>
    </div></section>
    <section className="wf-section"><div className="container">
      <WireframeHeading eyebrow="BÀI VIẾT MỚI" title="Cập nhật kiến thức" action={{href:'/kien-thuc/blog',label:'Xem tất cả bài viết'}} />
      <ArticleCards articles={articles.slice(0,3)} />
    </div></section>
    <section className="wf-section wf-soft"><div className="container">
      <WireframeHeading eyebrow="TÀI LIỆU / GUIDES" title="Tài liệu để tìm hiểu sâu hơn" action={{href:'/kien-thuc/guides',label:'Khám phá thư viện tài liệu'}} />
      <div className="guide-card-grid">{guides.slice(0,4).map(guide=><GuideCard guide={guide} inlinePreview={false} key={guide.slug} />)}</div>
    </div></section>
    <WireframeCta title="Có câu hỏi về giải pháp ERP?" description="Chuyển từ việc tìm hiểu kiến thức sang trao đổi bài toán doanh nghiệp." href="/dich-vu/erp" label="Nhận tư vấn ERP" />
  </main></PageFrame>;
}
