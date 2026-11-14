import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@/components/section-typography.css";
import { getI18n } from "@/i18n/server";
import { LanguageProvider } from "@/i18n/provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baseMetadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
  title: {
    default: "TNT | Trí Nghĩa Tech",
    template: "%s | TNT — Trí Nghĩa Tech",
  },
  description:
    "TNT kết nối công nghệ với hoạt động kinh doanh thông qua TNM ERP, phát triển phần mềm và dịch vụ nhân sự công nghệ.",
  openGraph: {
    title: "TNT | Trí Nghĩa Tech",
    description:
      "Kết nối công nghệ với hoạt động kinh doanh qua TNM ERP, phần mềm và nhân lực công nghệ.",
    locale: "vi_VN",
    type: "website",
  },
  alternates: {
    canonical: "/",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const { locale, t } = await getI18n();
  return {
    ...baseMetadata,
    title: { default: t("TNT | Trí Nghĩa Tech"), template: t("%s | TNT — Trí Nghĩa Tech") },
    description: t(String(baseMetadata.description)),
    openGraph: {
      ...baseMetadata.openGraph,
      title: t("TNT | Trí Nghĩa Tech"),
      description: t("Kết nối công nghệ với hoạt động kinh doanh qua TNM ERP, phần mềm và nhân lực công nghệ."),
      locale: locale === "en" ? "en_US" : "vi_VN",
    },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const { locale } = await getI18n();
  return (
    <html
      data-scroll-behavior="smooth"
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col"><LanguageProvider locale={locale}>{children}</LanguageProvider></body>
    </html>
  );
}
