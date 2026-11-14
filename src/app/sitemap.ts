import type { MetadataRoute } from "next";

const routes = [
  "/",
  "/ve-tnt",
  "/giai-phap-nganh-thuc-pham",
  "/dich-vu",
  "/dich-vu/erp",
  "/dich-vu/outsourcing",
  "/dich-vu/body-shop",
  "/du-an",
  "/du-an/erp-che-bien-thuy-san",
  "/kien-thuc",
  "/kien-thuc/blog",
  "/kien-thuc/guides",
  "/kien-thuc/faq",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return routes.map((route) => ({
    url: new URL(route, siteUrl).toString(),
  }));
}
