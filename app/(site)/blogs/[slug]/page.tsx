import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { paragraphs } from "@/lib/content";
import { getPublishedBlog, getSettings } from "@/lib/db";
import { formatDate } from "@/lib/format";
import { siteNameBn, siteNameEn, siteUrl } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedBlog(slug);
  const title = post?.title ?? "ব্লগ";
  return {
    title,
    description: post?.excerpt || `${title} — ${siteNameBn} (${siteNameEn})`,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPublishedBlog(slug);
  if (!post) notFound();
  const settings = await getSettings();
  const author = post.author || settings.shortName;
  const origin = siteUrl();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    datePublished: post.date,
    description: post.excerpt || post.title,
    author: { "@type": "Organization", name: author },
    publisher: { "@type": "Organization", name: siteNameBn },
    mainEntityOfPage: `${origin}/blogs/${post.slug}`,
    image: post.cover ? `${origin}${post.cover}` : undefined,
  };

  return (
    <article className="panel mx-auto my-10 max-w-3xl rounded-2xl border border-line bg-paper px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Link href="/blogs" className="text-sm font-medium text-leaf">← সব লেখা</Link>
      {post.cover ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={post.cover} alt="" className="mt-6 aspect-[16/8] w-full rounded-2xl object-cover" />
      ) : null}
      <p className="mt-6 text-sm text-muted">{formatDate(post.date)} · {author}</p>
      <h1 className="mt-2 text-3xl font-semibold text-forest md:text-4xl">{post.title}</h1>
      {post.excerpt ? <p className="mt-4 text-lg leading-relaxed text-muted">{post.excerpt}</p> : null}
      <div className="mt-6 grid gap-4 leading-relaxed">
        {paragraphs(post.body).map((part, index) => (
          <p key={index}>{part}</p>
        ))}
      </div>
    </article>
  );
}
