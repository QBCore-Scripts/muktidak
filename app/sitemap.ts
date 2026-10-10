import type { MetadataRoute } from "next";
import { getPages, getPublishedBlogs, getPublishedNotices } from "@/lib/db";
import { siteUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

const pages = ["", "/manifesto", "/objectives", "/committee", "/about", "/vision", "/activities", "/gallery", "/notices", "/blogs", "/districts", "/contact", "/donate"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = siteUrl();
  const now = new Date();
  const notices = (await getPublishedNotices()).map((notice) => ({
    url: `${origin}/notices/${notice.id}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));
  const extra = (await getPages())
    .filter((page) => page.slug && page.slug !== "home" && !pages.includes(`/${page.slug}`))
    .map((page) => ({
      url: `${origin}/${page.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    }));
  const blogs = (await getPublishedBlogs()).map((post) => ({
    url: `${origin}/blogs/${post.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));
  return [
    ...pages.map((path) => ({
      url: `${origin}${path || "/"}`,
      lastModified: now,
      changeFrequency: path === "" ? ("daily" as const) : ("weekly" as const),
      priority: path === "" ? 1 : 0.8,
    })),
    ...extra,
    ...notices,
    ...blogs,
  ];
}
