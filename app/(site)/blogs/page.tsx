import Link from "next/link";
import { BlogCard } from "@/components/site/BlogCard";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { englishText } from "@/lib/english";
import { getPublishedBlogs } from "@/lib/db";
import { getSite, localizedMeta } from "@/lib/locale";

export function generateMetadata() {
  return localizedMeta("blogs");
}

export default async function BlogsPage({ searchParams }: { searchParams: Promise<{ cat?: string }> }) {
  const { locale, t, settings } = await getSite();
  const copy = settings.copy;
  const cat = ((await searchParams).cat || "").trim();
  const all = await getPublishedBlogs();
  const categories = [...new Set(all.map((item) => item.category).filter(Boolean))];
  const posts = (cat ? all.filter((item) => item.category === cat) : all).map((item) =>
    locale === "en" ? { ...item, category: englishText(item.category) } : item,
  );

  return (
    <>
      <PageHeader kicker={copy.blogsKicker} title={copy.blogsTitle} text={copy.blogsText} />
      {categories.length > 0 ? (
        <nav aria-label={t.category} className="mx-auto flex max-w-6xl flex-wrap gap-2 px-4 pt-8">
          <Link href="/blogs" className={`rounded-full px-3 py-1.5 text-sm ${cat ? "border border-line bg-paper" : "bg-forest text-paper"}`}>{t.all}</Link>
          {categories.map((item) => (
            <Link key={item} href={`/blogs?cat=${encodeURIComponent(item)}`} className={`rounded-full px-3 py-1.5 text-sm ${cat === item ? "bg-forest text-paper" : "border border-line bg-paper"}`}>
              {locale === "en" ? englishText(item) : item}
            </Link>
          ))}
        </nav>
      ) : null}
      <div className="mx-auto max-w-6xl px-4 py-12">
        {posts.length === 0 ? <p className="text-sm text-muted">{cat ? t.emptyCategory : t.noPosts}</p> : null}
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
