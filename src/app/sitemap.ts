import type { MetadataRoute } from "next";
import { articles, projects } from "@/content/local-data";

const routes = [
  "/",
  "/ve-tnt",
  "/giai-phap-nganh-thuc-pham",
  "/dich-vu",
  "/dich-vu/erp",
  "/dich-vu/outsourcing",
  "/dich-vu/body-shop",
  "/du-an",
  "/kien-thuc",
  "/kien-thuc/blog",
  "/kien-thuc/guides",
  "/kien-thuc/faq",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const contentRoutes = [
    ...projects.map(project => `/du-an/${project.slug}`),
    ...articles.map(article => `/kien-thuc/blog/${article.slug}`),
  ];
  return [...routes, ...contentRoutes].map((route) => ({
    url: new URL(route, siteUrl).toString(),
  }));
}
