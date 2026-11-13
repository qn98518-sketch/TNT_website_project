import { PageFrame } from "@/components/site-shell";
import { ServiceLanding } from "@/components/service-landing";
import { serviceRepository } from "@/content/repositories";
import { createPageMetadata } from "@/lib/metadata";
import { notFound } from "next/navigation";

export async function generateMetadata() { return createPageMetadata({
  title: "Outsourcing",
  description:
    "Trao đổi nhu cầu phát triển hoặc mở rộng phần mềm theo mục tiêu và phạm vi cụ thể.",
  path: "/dich-vu/outsourcing",
}); }

export default async function OutsourcingServicePage() {
  const service = await serviceRepository.findPublishedBySlug("outsourcing");
  if (!service) notFound();

  return (
    <PageFrame>
      <ServiceLanding service={service} leadContext="outsourcing" />
    </PageFrame>
  );
}
