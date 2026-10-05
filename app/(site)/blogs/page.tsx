import { BlogCard } from "@/components/site/BlogCard";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { getPublishedBlogs } from "@/lib/db";
import { getSite, localizedMeta } from "@/lib/locale";

export function generateMetadata() {
  return localizedMeta("blogs");
}

export default async function BlogsPage() {
  const { locale, t, settings } = await getSite();
  const copy = settings.copy;
  const posts = await getPublishedBlogs();

  return (
    <>
      <PageHeader kicker={copy.blogsKicker} title={copy.blogsTitle} text={copy.blogsText} />
      <div className="mx-auto max-w-6xl px-4 py-12">
        {posts.length === 0 ? <p className="text-sm text-muted">{t.noPosts}</p> : null}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((item, index) => (
            <Reveal key={item.id} index={index % 3}>
              <BlogCard post={item} index={index} locale={locale} />
            </Reveal>
          ))}
        </div>
      </div>
    </>
  );
}
