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

export async function generateMetadata() { return createPageMetadata({title:'Dự án',description:'Khám phá các dự án công nghệ và hướng tiếp cận bài toán vận hành doanh nghiệp.',path:'/du-an'}); }

export default async function ProjectsPage() {
  const { t } = await getI18n();
  const projects = await projectRepository.listForPreview();
  const featured = projects[0];
  if (!featured) throw new Error('Missing featured project');
  return <PageFrame breadcrumbs={[{ label: 'Dự án' }]}><main className="wf-page">
    <WireframeHero eyebrow="CÂU CHUYỆN DỰ ÁN" title="Giải pháp thực tế." accent="Giá trị bền vững." description="Khám phá các bài toán công nghệ, giải pháp quản trị sản xuất và phát triển phần mềm theo nhu cầu doanh nghiệp." image={projectMedia(featured.slug,featured.image)} action={{href:'#project-list',label:'Khám phá dự án'}} secondary={{href:'/#contact',label:'Liên hệ tư vấn'}} />
    <section className="wf-section"><div className="container wf-split">
      <Link className="wf-photo" href={`/du-an/${featured.slug}`}><SiteImage src={projectMedia(featured.slug,featured.image)} alt={t(featured.imageAlt ?? featured.title)} width={1600} height={1000} sizes="(max-width:760px) 100vw, 50vw" /></Link>
      <div className="wf-split-copy"><span className="wf-kicker">{t('DỰ ÁN NỔI BẬT')}</span><h2 className="tnt-section-title">{t(featured.title)}</h2><span className="wf-meta">{t(featured.service)} · {t(featured.industry)}</span>{featured.isSimulation && <span className="project-simulation-label">{t(featured.sourceLabel ?? 'Case study mô phỏng')}</span>}<p>{t(featured.summary)}</p><Link className="rf-button" href={`/du-an/${featured.slug}`}>{t('Xem chi tiết dự án')}<Icon name="arrowRight" size={18} /></Link></div>
    </div></section>
    <section className="wf-section wf-soft" id="project-list"><div className="container">
      <WireframeHeading eyebrow="DANH SÁCH DỰ ÁN" title="Tìm câu chuyện" accent="phù hợp với nhu cầu" description="Lọc theo dịch vụ và ngành nghề. Các dự án có thể thuộc nhiều góc nhìn phân loại." />
      <CatalogBrowser kind="project" entries={projects.map(project => ({...project,href:`/du-an/${project.slug}`,image:projectMedia(project.slug,project.image)}))} />
    </div></section>
    <WireframeCta title="Bạn có bài toán tương tự?" description="TNT có thể trao đổi để đánh giá phương án triển khai phù hợp." label="Nhận tư vấn giải pháp" />
  </main></PageFrame>;
}
