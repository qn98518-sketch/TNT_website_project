import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageFrame } from "@/components/site-shell";
import { projectRepository } from "@/content/repositories";
import { createPageMetadata } from "@/lib/metadata";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await projectRepository.findForPreviewBySlug(slug);
  if (!project) return { title: "Không tìm thấy dự án" };

  return createPageMetadata({
    title: project.title,
    description: project.summary,
    path: `/du-an/${slug}`,
  });
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = await projectRepository.findForPreviewBySlug(slug);
  if (!project) notFound();
  const previewProjects = await projectRepository.listForPreview();
  const relatedProjects = previewProjects.filter((candidate) =>
    project.relatedProjectSlugs?.includes(candidate.slug),
  );

  return (
    <PageFrame>
      <main>
        <section className="editorial-hero">
          <div className="container editorial-hero-inner">
            <div className="editorial-hero-copy">
              <span className="eyebrow eyebrow-light">
                {project.topic} <span className="eyebrow-rule" />
              </span>
              <h1>{project.detailTitle ?? project.title}</h1>
              <p>{project.summary}</p>
              {project.sourceLabel && (
                <span className="review-label">{project.sourceLabel}</span>
              )}
            </div>
            {project.image && (
              <div className="project-detail-hero-image">
                <Image
                  alt={project.imageAlt ?? ""}
                  fill
                  priority
                  sizes="(max-width: 760px) 100vw, 48vw"
                  src={project.image}
                />
              </div>
            )}
          </div>
        </section>
        <section className="section">
          <div className="container project-detail-grid">
            <article>
              <span className="eyebrow">BỐI CẢNH</span>
              <h2>{project.challengeTitle ?? project.industry}</h2>
              <p>{project.challenge}</p>
            </article>
            <article>
              <span className="eyebrow">{project.solutionTitle ?? "CÁCH TIẾP CẬN"}</span>
              <p>{project.solution ?? project.approach}</p>
            </article>
            <article>
              <span className="eyebrow">KẾT QUẢ CẦN XÁC NHẬN</span>
              <p>{project.outcome}</p>
            </article>
            <article>
              <span className="eyebrow">THÔNG TIN DỰ ÁN</span>
              <p><strong>Khách hàng:</strong> {project.client ?? "Thông tin đang được xác nhận."}</p>
              <p><strong>Phạm vi:</strong> {project.scope ?? "Phạm vi đang được xác nhận."}</p>
              <p><strong>Dịch vụ:</strong> {project.service ?? project.topic}</p>
            </article>
          </div>
        </section>
        {project.gallery && project.gallery.length > 0 && (
          <section aria-label="Hình ảnh dự án" className="section project-gallery">
            <div className="container">
              <div className="project-gallery-grid">
                {project.gallery.map((image) => (
                  <Image
                    alt={image.alt}
                    height={image.height}
                    key={image.src}
                    src={image.src}
                    width={image.width}
                  />
                ))}
              </div>
            </div>
          </section>
        )}
        {relatedProjects.length > 0 && (
          <section aria-label="Dự án liên quan" className="section project-related">
            <div className="container">
              <h2>Dự án liên quan</h2>
              <ul>
                {relatedProjects.map((relatedProject) => (
                  <li key={relatedProject.slug}>
                    <Link href={`/du-an/${relatedProject.slug}`}>
                      {relatedProject.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
        <section className="section project-contact">
          <div className="container project-contact-inner">
            <h2>Trao đổi về nhu cầu tương tự</h2>
            <Link className="button button-primary" href="/#contact">
              Liên hệ TNT
            </Link>
          </div>
        </section>
      </main>
    </PageFrame>
  );
}
