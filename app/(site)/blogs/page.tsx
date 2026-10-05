import type { Metadata } from "next";
import { BlogCard } from "@/components/site/BlogCard";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { getPublishedBlogs, getSettings } from "@/lib/db";

export const metadata: Metadata = {
  title: "ব্লগ",
  description: "বাংলাদেশ মুক্তির ডাক-৭১ (Bangladesh Muktir Dak 71) এর ব্লগ।",
};

export default async function BlogsPage() {
  const copy = (await getSettings()).copy;
  const posts = await getPublishedBlogs();

  return (
    <>
      <PageHeader kicker={copy.blogsKicker} title={copy.blogsTitle} text={copy.blogsText} />
      <div className="mx-auto max-w-6xl px-4 py-12">
        {posts.length === 0 ? <p className="text-sm text-muted">এখনো কোনো লেখা প্রকাশ হয়নি।</p> : null}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((item, index) => (
            <Reveal key={item.id} index={index % 3}>
              <BlogCard post={item} index={index} />
            </Reveal>
          ))}
        </div>
      </div>
    </>
  );
}
