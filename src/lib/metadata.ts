import type { Metadata } from "next";
import { getI18n } from "@/i18n/server";

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
};

export async function createPageMetadata({
  title,
  description,
  path,
}: PageMetadataInput): Promise<Metadata> {
  const { locale, t } = await getI18n();
  return {
    title: t(title),
    description: t(description),
    alternates: { canonical: path },
    openGraph: {
      title: t(title),
      description: t(description),
      url: path,
      siteName: t("TNT — Trí Nghĩa Tech"),
      locale: locale === "en" ? "en_US" : "vi_VN",
      type: "website",
    },
  };
}
