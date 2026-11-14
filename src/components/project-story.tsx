import { getI18n } from "@/i18n/server";
import { SiteImage } from "@/components/site-image";
import type { ProjectRecord, ProjectStory } from "@/content/models";
import "./project-story.css";

export async function ProjectStoryContent({ project, story }: {
  project: ProjectRecord;
  story: ProjectStory;
}) {
  const { t } = await getI18n();
  return (
    <section className="wf-section project-story-section">
      <div className="container project-story-layout">
        <nav aria-label={t("Mục lục dự án")} className="project-story-toc">
          <span className="wf-kicker">{t("TRONG BÀI VIẾT")}</span>
          <ol>
            {story.sections.map(section => (
              <li key={section.id}><a href={`#${section.id}`}>{t(section.heading)}</a></li>
            ))}
          </ol>
        </nav>
        <article className="project-story-body">
          <figure className="project-story-figure">
            <SiteImage className="project-story-image" src={project.image!} alt={t(project.imageAlt ?? project.title)} width={1672} height={941} sizes="(max-width: 1000px) 100vw, 900px" mediaKind="background" />
          </figure>
          {story.sections.map(section => (
            <section id={section.id} key={section.id}>
              <h2>{t(section.heading)}</h2>
              {section.paragraphs?.map(paragraph => <p key={paragraph}>{t(paragraph)}</p>)}
              {section.bullets && <ul>{section.bullets.map(bullet => <li key={bullet}>{t(bullet)}</li>)}</ul>}
              {section.subsections?.map(subsection => (
                <div className="project-story-subsection" key={subsection.heading}>
                  <h3>{t(subsection.heading)}</h3>
                  {subsection.paragraphs?.map(paragraph => <p key={paragraph}>{t(paragraph)}</p>)}
                  {subsection.bullets && <ul>{subsection.bullets.map(bullet => <li key={bullet}>{t(bullet)}</li>)}</ul>}
                </div>
              ))}
            </section>
          ))}
        </article>
      </div>
    </section>
  );
}
