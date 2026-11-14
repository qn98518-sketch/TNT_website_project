import Link from "next/link";
import { getI18n } from "@/i18n/server";
import "./site-breadcrumbs.css";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export async function SiteBreadcrumbs({ items = [] }: {
  items?: readonly BreadcrumbItem[];
}) {
  const { t } = await getI18n();
  const trail: readonly BreadcrumbItem[] = [
    { label: "Trang chủ", href: "/" },
    ...items,
  ];

  return (
    <nav aria-label={t("Đường dẫn trang")} className="site-breadcrumbs">
      <ol className="rf-container">
        {trail.map((item, index) => (
          <li key={`${index}-${item.label}`}>
            {index > 0 && <span aria-hidden="true" className="site-breadcrumb-separator">/</span>}
            {index < trail.length - 1 && item.href ? (
              <Link href={item.href}>{t(item.label)}</Link>
            ) : (
              <span aria-current={index === trail.length - 1 ? "page" : undefined} title={t(item.label)}>{t(item.label)}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
