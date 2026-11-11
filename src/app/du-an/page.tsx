import { CatalogPage } from "@/components/content-page";
import { PageFrame } from "@/components/site-shell";
import { projectRepository } from "@/content/repositories";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Dự án",
  description:
    "Dự án và minh chứng sẽ được đăng sau khi phạm vi, kết quả và quyền công bố được xác nhận.",
  path: "/du-an",
});

export default async function ProjectsPage() {
  const projects = await projectRepository.listPublished();

  return (
    <PageFrame>
      <CatalogPage
        description="Tìm kiếm và lọc dự án theo lĩnh vực. TNT chỉ công bố thông tin đã được xác nhận và cho phép chia sẻ."
        entries={projects.map((project) => ({
          slug: project.slug,
          title: project.title,
          summary: project.summary,
          topic: project.topic,
          industry: project.industry,
          href: `/du-an/${project.slug}`,
        }))}
        eyebrow="DỰ ÁN & MINH CHỨNG"
        kind="project"
        title="Dự án tiêu biểu"
      />
    </PageFrame>
  );
}
