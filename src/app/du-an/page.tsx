import Link from 'next/link';
import { getI18n } from '@/i18n/server';
import { PageFrame } from '@/components/site-shell';
import { SiteImage } from '@/components/site-image';
import { CatalogBrowser } from '@/components/catalog-browser';
import { Icon } from '@/components/ui/icon';
import { WireframeCta, WireframeHeading, WireframeHero } from '@/components/wireframe-sections';
import { projectRepository } from '@/content/repositories';
import { createPageMetadata } from '@/lib/metadata';
import { projectMedia } from '@/lib/media';

export async function generateMetadata() { return createPageMetadata({title:'Dự án',description:'Khám phá các dự án tham khảo và bài toán doanh nghiệp; nội dung mẫu cần được TNT phê duyệt công bố.',path:'/du-an'}); }

export default async function ProjectsPage() {
  const { t } = await getI18n();
  const projects = await projectRepository.listForPreview();
  const featured = projects[0];
  if (!featured) throw new Error('Missing featured project');
  return <PageFrame><main className="wf-page">
    <WireframeHero eyebrow="CÂU CHUYỆN DỰ ÁN" title="Giải pháp thực tế." accent="Giá trị bền vững." description="Khám phá cách giới thiệu dự án công nghệ và bài toán doanh nghiệp. KALA và các nội dung minh họa chưa xác nhận đây là dự án TNT đã thực hiện; cần TNT phê duyệt trước khi công bố." image={projectMedia(featured.slug,featured.image)} action={{href:'#project-list',label:'Khám phá dự án'}} secondary={{href:'/#contact',label:'Liên hệ tư vấn'}} />
    <section className="wf-section"><div className="container wf-split">
      <Link className="wf-photo" href={`/du-an/${featured.slug}`}><SiteImage src={projectMedia(featured.slug,featured.image)} alt={t(featured.imageAlt ?? featured.title)} width={1600} height={1000} sizes="(max-width:760px) 100vw, 50vw" /></Link>
      <div className="wf-split-copy"><span className="wf-kicker">{t('DỰ ÁN THAM KHẢO · MẪU DEMO')}</span><h2>{t('Nhà máy kính KALA:')}<br /><em>{t('quản lý sản xuất TNM')}</em></h2><span className="wf-meta">{t(featured.service)} · {t(featured.industry)}</span><h3>{t(featured.title)}</h3><p>{t(featured.summary)}</p><small className="wf-disclosure">{t(featured.sourceLabel)}</small><Link className="rf-button" href={`/du-an/${featured.slug}`}>{t('Xem chi tiết dự án')}<Icon name="arrowRight" size={18} /></Link></div>
    </div></section>
    <section className="wf-section wf-soft" id="project-list"><div className="container">
      <WireframeHeading eyebrow="DANH SÁCH DỰ ÁN" title="Tìm câu chuyện" accent="phù hợp với nhu cầu" description="Lọc theo dịch vụ và ngành nghề. Các dự án có thể thuộc nhiều góc nhìn phân loại." />
      <CatalogBrowser kind="project" entries={projects.map(project => ({...project,href:`/du-an/${project.slug}`,image:projectMedia(project.slug,project.image)}))} />
    </div></section>
    <WireframeCta title="Bạn có bài toán tương tự?" description="TNT có thể trao đổi để đánh giá phương án triển khai phù hợp." label="Nhận tư vấn giải pháp" />
  </main></PageFrame>;
}
