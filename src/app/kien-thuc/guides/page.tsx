import { CatalogPage } from "@/components/content-page";
import { PageFrame } from "@/components/site-shell";
import { guideRepository } from "@/content/repositories";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Tài liệu hướng dẫn",
  description:
    "Tìm kiếm tài liệu có tệp tải xuống và quyền phát hành đã được xác nhận.",
  path: "/kien-thuc/guides",
});

export default async function GuidesPage() {
  const guides = await guideRepository.listPublished();

  return (
    <PageFrame>
      <CatalogPage
        description="Tài liệu chỉ được hiển thị khi tệp tải xuống và quyền phát hành được xác nhận."
        entries={guides.map((guide) => ({
          slug: guide.slug,
          title: guide.title,
          summary: `${guide.summary} ${guide.fileType} · ${guide.fileSize}`,
          topic: guide.topic,
          href: guide.fileUrl,
        }))}
        eyebrow="TÀI LIỆU & HƯỚNG DẪN"
        kind="guide"
        title="Tài nguyên hữu ích"
      />
    </PageFrame>
  );
}
