import { PageFrame } from "@/components/site-shell";
import { ServiceLanding } from "@/components/service-landing";
import { serviceRepository } from "@/content/repositories";
import { createPageMetadata } from "@/lib/metadata";
import { notFound } from "next/navigation";

export async function generateMetadata() { return createPageMetadata({
  title: "Body Shop",
  description:
    "Trao đổi về vai trò và kỹ năng công nghệ cần thiết theo nhu cầu của dự án.",
  path: "/dich-vu/body-shop",
}); }

export default async function BodyShopPage() {
  const service = await serviceRepository.findPublishedBySlug("body-shop");
  if (!service) notFound();

  return (
    <PageFrame breadcrumbs={[{ label: "Dịch vụ", href: "/dich-vu" }, { label: "Body Shop" }]}>
      <ServiceLanding service={service} leadContext="body-shop" />
    </PageFrame>
  );
}
