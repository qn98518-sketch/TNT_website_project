import { CatalogPage } from "@/components/content-page";
import { PageFrame } from "@/components/site-shell";
import { articleRepository } from "@/content/repositories";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Blog",
  description:
    "Tìm kiếm góc nhìn về ERP, sản xuất và phát triển công nghệ. Bài viết chờ duyệt sẽ chưa được hiển thị.",
  path: "/kien-thuc/blog",
});

export default async function BlogPage() {
  const articles = await articleRepository.listPublished();

  return (
    <PageFrame>
      <CatalogPage
        description="Tìm kiếm và lọc theo chủ đề. Ngày đăng, nội dung và thông tin tác giả chỉ xuất hiện sau khi được duyệt."
        entries={articles.map((article) => ({
          slug: article.slug,
          title: article.title,
          summary: article.summary,
          topic: article.topic,
          href: `/kien-thuc/blog/${article.slug}`,
          publishedAt: article.publishedAt,
        }))}
        eyebrow="BLOG TNT"
        kind="article"
        title="Góc nhìn chuyên môn"
      />
    </PageFrame>
  );
}
