import { PageFrame } from '@/components/site-shell';
import { FaqBrowser } from '@/components/faq-browser';
import { WireframeCta, WireframeHeading, WireframeHero } from '@/components/wireframe-sections';
import { faqRepository } from '@/content/repositories';
import { createPageMetadata } from '@/lib/metadata';
import { media } from '@/lib/media';

export async function generateMetadata(){return createPageMetadata({title:'Câu hỏi thường gặp',description:'Tìm kiếm câu trả lời về ERP, sản xuất, phát triển phần mềm và nhân lực công nghệ.',path:'/kien-thuc/faq'});}
export default async function FaqPage(){
  const faqs=await faqRepository.listForPreview();
  return <PageFrame breadcrumbs={[{ label: 'Kiến thức', href: '/kien-thuc' }, { label: 'FAQ' }]}><main className="wf-page">
    <WireframeHero compact eyebrow="FAQ TNT" title="Những câu hỏi" accent="thường gặp." description="Tìm câu trả lời theo nhóm chủ đề hoặc từ khóa." image={media.technology} />
    <section className="wf-section"><div className="container wf-faq-intro">
      <WireframeHeading eyebrow="FAQ TNT" title="Bạn đang quan tâm" accent="vấn đề nào?" description="Các câu hỏi được nhóm theo nội dung quan tâm để bạn dễ tìm kiếm." />
      <FaqBrowser items={faqs} />
    </div></section>
    <WireframeCta title="Có câu hỏi về giải pháp ERP?" description="Chuyển từ việc tìm hiểu kiến thức sang trao đổi bài toán doanh nghiệp." href="/dich-vu/erp" label="Nhận tư vấn ERP" />
  </main></PageFrame>;
}
