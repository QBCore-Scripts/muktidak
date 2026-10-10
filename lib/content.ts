import { getPage } from "./db";
import { englishPages } from "./english";
import { getLocale } from "./locale";
import type { PageContent } from "./types";

export async function pageBySlug(slug: string): Promise<PageContent> {
  const page = (await getPage(slug)) ?? { id: slug, slug, title: slug, body: "" };
  if ((await getLocale()) !== "en") return page;
  const english = englishPages[slug];
  return english ? { ...page, title: english.title, body: english.body } : page;
}

export function paragraphs(body: string) {
  return body
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean);
}
