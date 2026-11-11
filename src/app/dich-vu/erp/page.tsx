import { PageFrame } from "@/components/site-shell";
import { ServiceLanding } from "@/components/service-landing";
import { serviceRepository } from "@/content/repositories";
import { createPageMetadata } from "@/lib/metadata";
import { notFound } from "next/navigation";

export const metadata = createPageMetadata({
  title: "TNM ERP",
  description:
    "Trao đổi về ERP theo nhu cầu vận hành, dữ liệu và phạm vi phù hợp với doanh nghiệp.",
  path: "/dich-vu/erp",
});

export default async function ErpServicePage() {
  const service = await serviceRepository.findPublishedBySlug("erp");
  if (!service) notFound();

  return (
    <PageFrame>
      <ServiceLanding service={service} leadContext="erp" />
    </PageFrame>
  );
}
