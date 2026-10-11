import { PageHeader } from "@/components/site/PageHeader";
import { PostTeasers } from "@/components/site/PostTeasers";
import { Reveal } from "@/components/site/Reveal";
import { pageBySlug, paragraphs } from "@/lib/content";
import { getPublishedPosts } from "@/lib/db";
import { pageMeta, type PageKey } from "@/lib/i18n";
import { getSite } from "@/lib/locale";

export async function TextPage({ slug }: { slug: Extract<PageKey, "manifesto" | "objectives" | "committee"> }) {
  const { locale, t, settings } = await getSite();
  const page = await pageBySlug(slug);
  const parts = paragraphs(page.body);
  const posts = (await getPublishedPosts()).filter((item) => item.section === slug);
  const fallback = pageMeta[locale][slug].title;
  const title = page.title && page.title !== slug ? (locale === "en" ? fallback : page.title) : fallback;

  return (
    <>
      <PageHeader kicker={settings.shortName} title={title} text={parts[0]} />
      {posts.length > 0 ? (
        <div className="mx-auto max-w-3xl px-4 py-12">
          <PostTeasers posts={posts} readMore={t.readMore} />
        </div>
      ) : null}
      {parts.length > 1 ? (
        <div className="mx-auto grid max-w-3xl gap-5 px-4 py-12">
          {parts.slice(1).map((part) => (
            <Reveal key={part}>
              <p className="text-ink/90">{part}</p>
            </Reveal>
          ))}
        </div>
      ) : null}
    </>
  );
}
