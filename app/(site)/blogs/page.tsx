import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/site/PageHeader";
import { getPublishedBlogs, getSettings } from "@/lib/db";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "ব্লগ",
  description: "বাংলাদেশ মুক্তির ডাক-৭১ (Bangladesh Muktir Dak 71) এর ব্লগ।",
};

export default function BlogsPage() {
  const copy = getSettings().copy;
  const posts = getPublishedBlogs();

  return (
    <>
      <PageHeader kicker={copy.blogsKicker} title={copy.blogsTitle} text={copy.blogsText} />
      <div className="mx-auto grid max-w-3xl gap-3 px-4 py-10">
        {posts.length === 0 ? <p className="text-sm text-muted">এখনো কোনো লেখা প্রকাশ হয়নি।</p> : null}
        {posts.map((item) => (
          <Link key={item.id} href={`/blogs/${item.slug}`} className="panel overflow-hidden rounded-2xl border border-line bg-paper hover:border-leaf">
            {item.cover ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.cover} alt="" className="h-44 w-full object-cover" />
            ) : null}
            <div className="p-5">
              <p className="text-xs text-muted">{formatDate(item.date)}{item.author ? ` · ${item.author}` : ""}</p>
              <h2 className="mt-1 text-xl font-semibold text-forest">{item.title}</h2>
              {item.excerpt ? <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">{item.excerpt}</p> : null}
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
