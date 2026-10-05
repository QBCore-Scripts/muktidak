import type { MetadataRoute } from "next";
import { getPublishedBlogs, getPublishedNotices } from "@/lib/db";
import { siteUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

const pages = ["", "/about", "/vision", "/activities", "/gallery", "/notices", "/blogs", "/districts", "/contact", "/donate"];

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = siteUrl();
  const now = new Date();
  const notices = getPublishedNotices().map((notice) => ({
    url: `${origin}/notices/${notice.id}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));
  const blogs = getPublishedBlogs().map((post) => ({
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
    ...notices,
    ...blogs,
  ];
}
