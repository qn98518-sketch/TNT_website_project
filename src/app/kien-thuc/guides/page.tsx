import { getI18n } from '@/i18n/server';
import { PageFrame } from '@/components/site-shell';
import { CatalogBrowser } from '@/components/catalog-browser';
import { WireframeCta, WireframeHeading, WireframeHero } from '@/components/wireframe-sections';
import { guideRepository } from '@/content/repositories';
import { createPageMetadata } from '@/lib/metadata';
import { media } from '@/lib/media';

export async function generateMetadata(){return createPageMetadata({title:'Tài liệu hướng dẫn',description:'Tìm hiểu các bản mô phỏng tài liệu về ERP, sản xuất, phần mềm và nhân lực; không có tệp giả lập tải xuống.',path:'/kien-thuc/guides'});}
export default async function GuidesPage(){
  const {t}=await getI18n();
  const guides=await guideRepository.listForPreview();
  return <PageFrame><main className="wf-page">
    <WireframeHero compact eyebrow="TNT / RESOURCE" title="Nguồn tài liệu" accent="cho quyết định tốt hơn." description="Tài liệu tham khảo được trình bày trực tiếp trên trang. Các tệp PDF trong bản demo là mô phỏng, chưa phải tài liệu phát hành." image={media.technology} action={{href:'#resource-library',label:'Khám phá tài liệu'}} />
    <section className="wf-section" id="resource-library"><div className="container">
      <WireframeHeading eyebrow="TÀI LIỆU / GUIDES" title="Tài liệu để tìm hiểu sâu hơn" />
      <CatalogBrowser kind="guide" entries={guides.map(guide=>({...guide,href:guide.fileUrl,summary:`${t(guide.summary)} ${t(guide.fileType)} · ${t(guide.fileSize)}`}))} />
    </div></section>
    <WireframeCta title="Cần làm rõ nội dung tài liệu?" description="Trao đổi câu hỏi về quy trình, dữ liệu và phạm vi triển khai với TNT." href="/kien-thuc/faq" label="Câu hỏi thường gặp" />
  </main></PageFrame>;
}
