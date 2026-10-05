import { getPage } from "./db";
import type { PageContent } from "./types";

export function pageBySlug(slug: string): PageContent {
  const page = getPage(slug);
  if (!page) {
    return { id: slug, slug, title: slug, body: "" };
  }
  return page;
}

export function paragraphs(body: string) {
  return body
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean);
}
