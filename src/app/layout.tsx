import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      data-scroll-behavior="smooth"
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
