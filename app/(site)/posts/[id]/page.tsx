import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { paragraphs } from "@/lib/content";
import { getPublishedPost } from "@/lib/db";
import { formatDate } from "@/lib/format";
import { getSite, shareMeta } from "@/lib/locale";
import type { PostSection } from "@/lib/types";

type Props = { params: Promise<{ id: string }> };

const sectionHref: Record<PostSection, string> = {
  manifesto: "/manifesto",
  objectives: "/objectives",
  committee: "/committee",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const post = await getPublishedPost(id);
  const title = post?.title || "পোস্ট";
  const description = post?.body.replace(/\s+/g, " ").trim().slice(0, 160) || title;
  return shareMeta(post ? `/posts/${post.id}` : "/", title, description);
}

export default async function PostPage({ params }: Props) {
  const { id } = await params;
  const post = await getPublishedPost(id);
  if (!post) notFound();
  const { locale, settings } = await getSite();
  const copy = settings.copy;
  const labels: Record<PostSection, string> = {
    manifesto: copy.linkManifesto,
    objectives: copy.linkObjectives,
    committee: copy.linkCommittee,
  };
  const parts = paragraphs(post.body);

  return (
    <article className="panel mx-auto my-10 max-w-3xl rounded-2xl border border-line bg-paper px-6 py-10">
      <Link href={sectionHref[post.section]} className="text-sm font-medium text-leaf">
        ← {labels[post.section]}
      </Link>
      {post.cover ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={post.cover} alt="" className="mt-6 aspect-[16/8] w-full rounded-2xl object-cover" />
      ) : null}
      <p className="mt-6 text-sm text-muted">{formatDate(post.date, locale)}</p>
      <h1 className="mt-2 text-3xl font-semibold leading-snug text-forest md:text-4xl">{post.title}</h1>
      {parts.length > 0 ? (
        <div className="mt-6 grid gap-4 leading-relaxed">
          {parts.map((part, index) => (
            <p key={index}>{part}</p>
          ))}
        </div>
      ) : null}
    </article>
  );
}
