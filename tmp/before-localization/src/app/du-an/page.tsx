import Image from "next/image";
import Link from "next/link";
import { CatalogBrowser } from "@/components/catalog-browser";
import { Icon } from "@/components/ui/icon";
import { PageFrame } from "@/components/site-shell";
import { projectRepository } from "@/content/repositories";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Dự án",
  description:
    "Khám phá các dự án tham khảo và bài toán doanh nghiệp; nội dung mẫu cần được TNT phê duyệt công bố.",
  path: "/du-an",
});

export default async function ProjectsPage() {
  const projects = await projectRepository.listForPreview();
  const featuredProject = projects[0];
  if (!featuredProject) {
    throw new Error("Missing featured project content.");
  }
  if (!featuredProject.image || !featuredProject.imageAlt) {
    throw new Error(`Missing project image for "${featuredProject.slug}".`);
  }

  return (
    <PageFrame>
      <main>
        <section className="projects-hero">
          <Image
            src={featuredProject.image}
            alt=""
            fill
            priority
            sizes="100vw"
          />
          <div className="container projects-hero-inner">
            <span className="eyebrow eyebrow-light">
              CÂU CHUYỆN DỰ ÁN <span className="eyebrow-rule" />
            </span>
            <h1>
              Giải pháp thực tế.
              <br />
              <span>Giá trị bền vững.</span>
            </h1>
            <p>
              Khám phá cách giới thiệu dự án công nghệ và bài toán doanh nghiệp.
              KALA và các nội dung minh họa chưa xác nhận đây là dự án TNT đã
              thực hiện; cần TNT phê duyệt trước khi công bố.
            </p>
            <div className="projects-hero-actions">
              <Link className="button button-primary" href="#project-list">
                Khám phá dự án <Icon name="arrowDown" size={16} />
              </Link>
              <Link className="button button-ghost" href="/dich-vu/erp">
                Liên hệ tư vấn <Icon name="arrowRight" size={16} />
              </Link>
            </div>
          </div>
        </section>
        <section className="section">
          <div className="container featured-project-layout">
            <div className="featured-project-image">
              <Image
                src={featuredProject.image}
                alt={featuredProject.imageAlt}
                fill
                sizes="(max-width: 760px) 100vw, 52vw"
              />
              <span className="sample-label">{featuredProject.sourceLabel}</span>
            </div>
            <div className="featured-project-copy">
              <span className="eyebrow">DỰ ÁN THAM KHẢO · MẪU DEMO</span>
              <h2>
                Nhà máy kính KALA:
                <br />
                <span>quản lý sản xuất TNM</span>
              </h2>
              <p>
                Dự án được sử dụng để minh họa cấu trúc giới thiệu từ thiết kế
                trang chủ của TNT.
              </p>
              <div className="featured-project-card">
                <span className="service-proof-meta">
                  ERP / SẢN XUẤT
                </span>
                <h3>{featuredProject.title}</h3>
                <p>
                  Giới thiệu bài toán về dữ liệu sản xuất, giải pháp theo dõi
                  công đoạn và giá trị khi phối hợp giữa các bộ phận.
                </p>
                <Link
                  className="text-link"
                  href={`/du-an/${featuredProject.slug}`}
                >
                  Xem chi tiết dự án <Icon name="arrowRight" size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="section section-pale" id="project-list">
          <div className="container">
            <div className="section-heading">
              <span className="eyebrow">DANH SÁCH DỰ ÁN</span>
              <h2 className="section-title">
                Tìm câu chuyện
                <br />
                <span>phù hợp với nhu cầu</span>
              </h2>
              <p className="section-lede">
                Lọc theo dịch vụ và ngành nghề. Các dự án có thể thuộc nhiều góc
                nhìn phân loại.
              </p>
            </div>
            <CatalogBrowser
              entries={projects.map((project) => ({
                slug: project.slug,
                title: project.title,
                summary: project.summary,
                topic: project.topic,
                industry: project.industry,
                href: `/du-an/${project.slug}`,
                image: project.image,
                imageAlt: project.imageAlt,
                sourceLabel: project.sourceLabel,
              }))}
              kind="project"
            />
          </div>
        </section>

        <section className="section project-list-cta">
          <div className="container">
            <span className="eyebrow">TRAO ĐỔI CÙNG TNT</span>
            <h2>Bạn có bài toán tương tự?</h2>
            <p>TNT có thể trao đổi để đánh giá phương án triển khai phù hợp.</p>
            <Link className="button button-primary" href="/dich-vu/erp">
              Nhận tư vấn giải pháp <Icon name="arrowRight" size={16} />
            </Link>
          </div>
        </section>
      </main>
    </PageFrame>
  );
}
