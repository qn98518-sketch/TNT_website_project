import { getI18n } from "@/i18n/server";
import { projects as allProjects } from "@/content/local-data";
import { ContentCard } from "@/components/content-card";
import { projectMedia } from "@/lib/media";
import { DesktopProjectShowcase } from "@/components/desktop-project-showcase";
import { ResponsiveContent } from "@/components/responsive-content";
import { ContentCarousel } from "@/components/content-carousel";

const homeProjectSlugs = ["erp-che-bien-thuy-san", "kala", "kova", "lomonoxop-my-dinh", "cong-thong-tin-doanh-nghiep-ha-noi"];
const projects = allProjects.filter(project => homeProjectSlugs.includes(project.slug));

export async function HomeProjectShowcase() {
  const { t } = await getI18n();
  return <section className="rf-projects">
    <div className="rf-container">
      <ResponsiveContent desktop={<DesktopProjectShowcase projects={projects} />}>
      <div className="rf-project-heading">
        <div>
          <span className="rf-eyebrow">{t("CÂU CHUYỆN DỰ ÁN")}</span>
          <h2 className="tnt-section-title">{t("Giải pháp thực tế, ")}<em>{t("giá trị bền vững")}</em></h2>
        </div>
        <p>{t("TNT đồng hành cùng doanh nghiệp trong những dự án công nghệ,")}<br />{t("triển khai các giải pháp phần mềm phù hợp với nhu cầu thực tế.")}</p>
      </div>
      <ContentCarousel label={t("Dự án liên quan")} className="content-card-grid">
        {projects.map(project => <ContentCard key={project.slug}
          href={`/du-an/${project.slug}`} title={t(project.title)} summary={t(project.summary)}
          image={projectMedia(project.slug, project.image)} imageAlt={t(project.imageAlt ?? project.title)}
          metadata={<>{t(project.service ?? project.topic)} · {t(project.industry)}{project.isSimulation && <> · <span className="project-simulation-label">{t(project.sourceLabel ?? "Case study mô phỏng")}</span></>}</>}
          linkLabel={t("Xem câu chuyện dự án")} />)}
      </ContentCarousel>
      </ResponsiveContent>
    </div>
  </section>;
}
