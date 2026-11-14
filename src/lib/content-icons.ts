import type { IconName } from "@/components/ui/icon";

const guideIcons: Record<string, IconName> = {
  "tong-quan-trien-khai-erp": "book",
  "checklist-du-lieu-nha-may": "checklist",
  "mau-ghi-nhan-yeu-cau-phan-mem": "document",
  "bo-cau-hoi-nhu-cau-nhan-luc": "faq",
};

export function guideIcon(slug: string): IconName {
  return guideIcons[slug] ?? "document";
}
