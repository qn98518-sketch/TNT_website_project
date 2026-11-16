import Link from 'next/link';
import { getI18n } from '@/i18n/server';
import { PageFrame } from '@/components/site-shell';
import { Icon } from '@/components/ui/icon';
import { ProjectCards, WireframeContact, WireframeHeading, WireframeHero } from '@/components/wireframe-sections';
import { projectRepository, serviceRepository } from '@/content/repositories';
import { createPageMetadata } from '@/lib/metadata';
import { media } from '@/lib/media';

export async function generateMetadata() { return createPageMetadata({title:'Dịch vụ',description:'Tìm hiểu các hướng dịch vụ ERP, phát triển phần mềm và nhân lực công nghệ của TNT.',path:'/dich-vu'}); }

const advantages = [
  { title:'Tập trung nghiệp vụ',description:'Ưu tiên nhu cầu vận hành.',icon:'briefcase' },
  { title:'Giải pháp kết nối',description:'Tổ chức dữ liệu đồng nhất.',icon:'data' },
  { title:'Linh hoạt triển khai',description:'Cấu hình theo phạm vi.',icon:'setting' },
  { title:'Đồng hành cùng bạn',description:'Từ tư vấn đến hỗ trợ.',icon:'people' },
] as const;
const process = [
  { title:'Tiếp nhận',description:'Lắng nghe nhu cầu và hiện trạng.' },
  { title:'Tư vấn',description:'Phân tích phương án phù hợp.' },
  { title:'Triển khai',description:'Phối hợp thực hiện theo kế hoạch.' },
  { title:'Đồng hành',description:'Bàn giao và hỗ trợ vận hành.' },
] as const;

export default async function ServicesPage() {
  const { t } = await getI18n();
  const [services,projects] = await Promise.all([serviceRepository.listPublished(),projectRepository.listForPreview()]);
  return <PageFrame breadcrumbs={[{ label: 'Dịch vụ' }]}><main className="wf-page">
    <WireframeHero eyebrow="DỊCH VỤ CÔNG NGHỆ TNT" title="Giải pháp đúng nhu cầu." accent="Đồng hành cùng tăng trưởng." description="Từ hệ thống ERP đến phát triển phần mềm và cung ứng nhân lực CNTT, TNT đồng hành cùng doanh nghiệp ở từng giai đoạn chuyển đổi." image={media.technology} action={{href:'#services',label:'Khám phá dịch vụ'}} />
    <section className="wf-section" id="services"><div className="container">
      <WireframeHeading eyebrow="GIẢI PHÁP & DỊCH VỤ" title="Công nghệ toàn diện" accent="cho doanh nghiệp" description="Ba nhóm dịch vụ cốt lõi được thiết kế xoay quanh nhu cầu vận hành và phát triển hệ thống." />
      <div className="wf-service-grid">{services.map((service,index) => <article className="wf-service-tile" key={service.slug}>
        <div><span className="wf-icon-tile"><Icon name={(['box','code','people'] as const)[index]} size={32} /></span><Link className="wf-image-arrow" style={{position:'static'}} href={service.href} aria-label={t(service.title)}><Icon name="arrowRight" size={20} /></Link></div>
        <h3>{t(service.title)}</h3><p>{t(service.summary)}</p><Link className="wf-text-link" href={service.href}>{t('Khám phá dịch vụ')}<Icon name="arrowRight" size={17} /></Link>
      </article>)}</div>
    </div></section>
    <section className="wf-section wf-navy"><div className="container wf-values-layout">
      <div><span className="wf-kicker">{t('VÌ SAO TNT?')}</span><h2 className="tnt-section-title">{t('Hiểu bài toán.')}<br /><em>{t('Thiết kế giải pháp phù hợp.')}</em></h2><p>{t('Đội ngũ hướng tới việc giải quyết đúng vấn đề và triển khai phù hợp với quy trình thực tế của doanh nghiệp.')}</p></div>
      <div className="wf-value-grid">{advantages.map(item => <article key={item.title}><Icon name={item.icon} size={38} /><h3>{t(item.title)}</h3><p>{t(item.description)}</p></article>)}</div>
    </div></section>
    <section className="wf-section wf-soft"><div className="container">
      <WireframeHeading eyebrow="DỰ ÁN THAM KHẢO" title="Năng lực được thể hiện" accent="qua dự án tham khảo" description="Tìm hiểu các bài toán công nghệ và hướng tiếp cận giải pháp cho hoạt động doanh nghiệp." />
      <ProjectCards projects={projects.slice(0,3)} showImageArrows={false} /><div className="wf-center-action"><Link className="rf-button" href="/du-an">{t('Xem tất cả dự án')}<Icon name="arrowRight" size={18} /></Link></div>
    </div></section>
    <section className="wf-section"><div className="container">
      <WireframeHeading eyebrow="QUY TRÌNH HỢP TÁC" title="Từ nhu cầu đến" accent="giải pháp phù hợp" description="Các bước phối hợp từ tìm hiểu nhu cầu đến triển khai giải pháp." />
      <ol className="wf-process-grid">{process.map((step,index) => <li key={step.title}><span>{String(index+1).padStart(2,'0')}</span><h3>{t(step.title)}</h3><p>{t(step.description)}</p></li>)}</ol>
    </div></section>
    <WireframeContact title="Cùng nhau kiến tạo giải pháp phù hợp" description="Chia sẻ bài toán vận hành. TNT sẽ cùng bạn tìm hướng tiếp cận phù hợp." pagePath="/dich-vu" />
  </main></PageFrame>;
}
