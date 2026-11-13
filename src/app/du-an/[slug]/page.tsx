import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getI18n } from '@/i18n/server';
import { PageFrame } from '@/components/site-shell';
import { SiteImage } from '@/components/site-image';
import { ProjectCards, WireframeCta, WireframeHeading, WireframeHero } from '@/components/wireframe-sections';
import { projectRepository } from '@/content/repositories';
import { createPageMetadata } from '@/lib/metadata';
import { media, projectMedia } from '@/lib/media';

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
  const gallery=project.gallery?.length ? project.gallery : [
    {src:photo,alt:project.imageAlt??project.title},
    {src:media.consulting,alt:'Tư vấn giải pháp tại nhà máy'},
    {src:project.topic==='ERP'?media.warehouse:media.team,alt:'Đội ngũ dự án trao đổi cùng nhau'},
  ];
  return <PageFrame><main className="wf-page">
    <WireframeHero eyebrow={project.topic} title={project.detailTitle??project.title} description={project.summary} image={photo} action={{href:'#project-story',label:'Xem câu chuyện dự án'}} secondary={{href:'/#contact',label:'Liên hệ tư vấn'}} />
    <section className="wf-section" id="project-story"><div className="container">
      <dl className="wf-project-facts">{[
        ['Khách hàng:',project.client??'Thông tin đang được xác nhận.'],
        ['Ngành nghề',project.industry],
        ['Dịch vụ:',project.service??project.topic],
        ['Phạm vi:',project.scope??'Phạm vi đang được xác nhận.'],
      ].map(([label,value])=><div key={label}><dt>{t(label)}</dt><dd>{t(value)}</dd></div>)}</dl>
      <small className="wf-disclosure">{t(project.sourceLabel)}</small>
    </div></section>
    <section className="wf-section wf-soft"><div className="container wf-split">
      <div className="wf-split-copy"><span className="wf-kicker">{t('BỐI CẢNH')}</span><h2>{t(project.challengeTitle??'Bài toán')}</h2><p>{t(project.challenge)}</p></div>
      <div className="wf-photo"><SiteImage src={photo} alt={t(project.imageAlt??project.title)} width={1600} height={1000} sizes="(max-width:760px) 100vw, 50vw" /></div>
    </div></section>
    <section className="wf-section"><div className="container wf-split">
      <div className="wf-photo"><SiteImage src={project.topic==='ERP'?media.consulting:media.software} alt={t('Đội ngũ trao đổi trong buổi tư vấn')} width={1600} height={1000} sizes="(max-width:760px) 100vw, 50vw" /></div>
      <div className="wf-split-copy"><span className="wf-kicker">{t('HƯỚNG TIẾP CẬN')}</span><h2>{t(project.solutionTitle??'Giải pháp')}</h2><p>{t(project.solution??project.approach)}</p></div>
    </div></section>
    <section className="wf-section wf-navy"><div className="container wf-outcome"><span className="wf-kicker">{t('KẾT QUẢ CẦN XÁC NHẬN')}</span><h2>{t('Giá trị mang lại')}</h2><p>{t(project.outcome)}</p></div></section>
    <section className="wf-section"><div className="container">
      <WireframeHeading eyebrow="DỰ ÁN & MINH CHỨNG" title="Hình ảnh dự án" description={project.sourceLabel} />
      <div className="wf-gallery">{gallery.map((image,index)=><div className="wf-photo" key={`${image.src}-${index}`}><SiteImage src={image.src} alt={t(image.alt)} width={1600} height={1000} sizes="(max-width:760px) 100vw, 33vw" /></div>)}</div>
    </div></section>
    {related.length>0&&<section className="wf-section wf-soft"><div className="container"><WireframeHeading eyebrow="DỰ ÁN LIÊN QUAN · MẪU DEMO" title="Dự án liên quan" /><ProjectCards projects={related} /></div></section>}
    <WireframeCta title="Trao đổi về nhu cầu tương tự" description="TNT có thể trao đổi để đánh giá phương án triển khai phù hợp." />
  </main></PageFrame>;
}
