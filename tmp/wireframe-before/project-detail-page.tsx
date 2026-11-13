import { getI18n } from "@/i18n/server";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageFrame } from "@/components/site-shell";
import { projectRepository } from "@/content/repositories";
import { createPageMetadata } from "@/lib/metadata";
type Props = {
    params: Promise<{
        slug: string;
    }>;
};
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { t } = await getI18n();
    const { slug } = await params;
    const project = await projectRepository.findForPreviewBySlug(slug);
    if (!project)
        return { title: t("Không tìm thấy dự án") };
    return createPageMetadata({
        title: project.title,
        description: project.summary,
        path: `/du-an/${slug}`,
    });
}
export default async function ProjectDetailPage({ params }: Props) {
    const { t } = await getI18n();
    const { slug } = await params;
    const project = await projectRepository.findForPreviewBySlug(slug);
    if (!project)
        notFound();
    const previewProjects = await projectRepository.listForPreview();
    const relatedProjects = previewProjects.filter((candidate) => project.relatedProjectSlugs?.includes(candidate.slug));
    return (<PageFrame>
      <main>
        <section className="editorial-hero">
          <div className="container editorial-hero-inner">
            <div className="editorial-hero-copy">
              <span className="eyebrow eyebrow-light">
                {t(project.topic)} <span className="eyebrow-rule"/>
              </span>
              <h1>{t(project.detailTitle ?? project.title)}</h1>
              <p>{t(project.summary)}</p>
              {t(project.sourceLabel && (<span className="review-label">{t(project.sourceLabel)}</span>))}
            </div>
            {t(project.image && (<div className="project-detail-hero-image">
                <Image alt={t(project.imageAlt ?? "")} fill priority sizes="(max-width: 760px) 100vw, 48vw" src={project.image}/>
              </div>))}
          </div>
        </section>
        <section className="section">
          <div className="container project-detail-grid">
            <article>
              <span className="eyebrow">{t("BỐI CẢNH")}</span>
              <h2>{t(project.challengeTitle ?? project.industry)}</h2>
              <p>{t(project.challenge)}</p>
            </article>
            <article>
              <span className="eyebrow">{t(project.solutionTitle ?? "CÁCH TIẾP CẬN")}</span>
              <p>{t(project.solution ?? project.approach)}</p>
            </article>
            <article>
              <span className="eyebrow">{t("KẾT QUẢ CẦN XÁC NHẬN")}</span>
              <p>{t(project.outcome)}</p>
            </article>
            <article>
              <span className="eyebrow">{t("THÔNG TIN DỰ ÁN")}</span>
              <p><strong>{t("Khách hàng:")}</strong> {t(project.client ?? "Thông tin đang được xác nhận.")}</p>
              <p><strong>{t("Phạm vi:")}</strong> {t(project.scope ?? "Phạm vi đang được xác nhận.")}</p>
              <p><strong>{t("Dịch vụ:")}</strong> {t(project.service ?? project.topic)}</p>
            </article>
          </div>
        </section>
        {t(project.gallery && project.gallery.length > 0 && (<section aria-label={t("Hình ảnh dự án")} className="section project-gallery">
            <div className="container">
              <div className="project-gallery-grid">
                {t(project.gallery.map((image) => (<Image alt={t(image.alt)} height={image.height} key={image.src} src={image.src} width={image.width}/>)))}
              </div>
            </div>
          </section>))}
        {t(relatedProjects.length > 0 && (<section aria-label={t("Dự án liên quan")} className="section project-related">
            <div className="container">
              <h2>{t("Dự án liên quan")}</h2>
              <ul>
                {t(relatedProjects.map((relatedProject) => (<li key={relatedProject.slug}>
                    <Link href={`/du-an/${relatedProject.slug}`}>
                      {t(relatedProject.title)}
                    </Link>
                  </li>)))}
              </ul>
            </div>
          </section>))}
        <section className="section project-contact">
          <div className="container project-contact-inner">
            <h2>{t("Trao đổi về nhu cầu tương tự")}</h2>
            <Link className="button button-primary" href="/#contact">{t("Liên hệ TNT")}</Link>
          </div>
        </section>
      </main>
    </PageFrame>);
}
