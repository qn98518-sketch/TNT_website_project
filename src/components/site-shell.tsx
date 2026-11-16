import { ReferenceFrame } from "@/components/reference-frame";
import type { BreadcrumbItem } from "@/components/site-breadcrumbs";

export function PageFrame({ children, breadcrumbs }: {
    children: React.ReactNode;
    breadcrumbs?: readonly BreadcrumbItem[];
}) {
    return <ReferenceFrame variant="unified" breadcrumbs={breadcrumbs}>{children}</ReferenceFrame>;
}
