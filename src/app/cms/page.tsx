import type { Metadata } from "next";
import { CmsApp } from "@/components/cms/cms-app";
export const metadata: Metadata = { title: "Quản trị nội dung form | TNT", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";
export default function CmsPage() { return <CmsApp />; }
