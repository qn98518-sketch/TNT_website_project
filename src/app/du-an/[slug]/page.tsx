import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getI18n } from '@/i18n/server';
import { PageFrame } from '@/components/site-shell';
import { SiteImage } from '@/components/site-image';
import { ProjectCards, WireframeCta, WireframeHeading, WireframeHero } from '@/components/wireframe-sections';
import { projectRepository } from '@/content/repositories';
import { createPageMetadata } from '@/lib/metadata';
import { media, projectMedia } from '@/lib/media';
import { seafoodProject, seafoodProjectStory } from '@/content/seafood-project';
import { ProjectStoryContent } from '@/components/project-story';

type Props = { params:Promise<{slug:string}> };
export async function generateMetadata({params}:Props):Promise<Metadata> {
  const {slug}=await params;
  const project=await projectRepository.findForPreviewBySlug(slug);
  const {t}=await getI18n();
  return project ? createPageMetadata({title:project.title,description:project.summary,path:`/du-an/${slug}`}) : {title:t('Không tìm thấy dự án')};
}

export default async function ProjectDetailPage({params}:Props) {
  const {slug}=await params;
  const project=await projectRepository.findForPreviewBySlug(slug);
  if(!project)notFound();
  const {t}=await getI18n();
  const projects=await projectRepository.listForPreview();
  const related=projects.filter(item=>project.relatedProjectSlugs?.includes(item.slug));
  const photo=projectMedia(project.slug,project.image);
  const story = project.slug === seafoodProject.slug ? seafoodProjectStory : null;
  const gallery=project.gallery?.length ? project.gallery : [
    {src:photo,alt:project.imageAlt??project.title},
    {src:media.consulting,alt:'Tư vấn giải pháp tại nhà máy'},
    {src:project.topic==='ERP'?media.warehouse:media.team,alt:'Đội ngũ dự án trao đổi cùng nhau'},
  ];
  return <PageFrame breadcrumbs={[{ label: 'Dự án', href: '/du-an' }, { label: project.title }]}><main className={story ? 'wf-page wf-project-story' : 'wf-page'}>
    <WireframeHero eyebrow={story ? 'NGÀNH CHẾ BIẾN THỦY SẢN' : project.topic} title={project.detailTitle??project.title} description={project.summary} image={photo} action={{href:'#project-story',label:'Xem câu chuyện dự án'}} secondary={{href:'/#contact',label:'Liên hệ tư vấn'}} />
    <section className="wf-section" id="project-story"><div className="container">
      {!story && project.disclosure && <aside className="project-disclosure" role="note">{t(project.disclosure)}</aside>}
      <dl className="wf-project-facts">{[
        ...(project.client ? [['Khách hàng:',project.client]] : []),
        ['Ngành nghề',project.industry],
        ['Dịch vụ:',project.service??project.topic],
        ...(project.scope ? [[story ? 'Trọng tâm' : 'Phạm vi:',project.scope]] : []),
      ].map(([label,value])=><div key={label}><dt>{t(label)}</dt><dd>{t(value)}</dd></div>)}</dl>

    </div></section>
    {story ? <ProjectStoryContent project={project} story={story} /> : <>
    <section className="wf-section wf-soft"><div className="container wf-split">
      <div className="wf-split-copy"><span className="wf-kicker">{t('BỐI CẢNH')}</span><h2 className="tnt-section-title">{t(project.challengeTitle??'Bài toán')}</h2><p>{t(project.challenge)}</p></div>
      <div className="wf-photo"><SiteImage src={photo} alt={t(project.imageAlt??project.title)} width={1600} height={1000} sizes="(max-width:760px) 100vw, 50vw" /></div>
    </div></section>
    <section className="wf-section"><div className="container wf-split">
      <div className="wf-photo"><SiteImage src={project.topic==='ERP'?media.consulting:media.software} alt={t('Đội ngũ trao đổi trong buổi tư vấn')} width={1600} height={1000} sizes="(max-width:760px) 100vw, 50vw" /></div>
      <div className="wf-split-copy"><span className="wf-kicker">{t('HƯỚNG TIẾP CẬN')}</span><h2 className="tnt-section-title">{t(project.solutionTitle??'Giải pháp')}</h2><p>{t(project.solution??project.approach)}</p></div>
    </div></section>
    <section className="wf-section wf-navy"><div className="container wf-outcome"><span className="wf-kicker">{t('GIÁ TRỊ HƯỚNG TỚI')}</span><h2 className="tnt-section-title">{t('Giá trị mang lại')}</h2><p>{t(project.outcome)}</p></div></section>
    <section className="wf-section"><div className="container">
      <WireframeHeading eyebrow="DỰ ÁN & MINH CHỨNG" title="Hình ảnh dự án" />
      <div className="wf-gallery">{gallery.map((image,index)=><div className="wf-photo" key={`${image.src}-${index}`}><SiteImage src={image.src} alt={t(image.alt)} width={1600} height={1000} sizes="(max-width:760px) 100vw, 33vw" /></div>)}</div>
    </div></section>
    </>}
    {related.length>0&&<section className="wf-section wf-soft"><div className="container"><WireframeHeading eyebrow="DỰ ÁN LIÊN QUAN" title="Dự án liên quan" /><ProjectCards projects={related} /></div></section>}
    <WireframeCta title="Trao đổi về nhu cầu tương tự" description="TNT có thể trao đổi để đánh giá phương án triển khai phù hợp." />
  </main></PageFrame>;
}
