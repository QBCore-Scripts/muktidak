import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublishedNotice } from "@/lib/db";
import { siteNameBn, siteNameEn } from "@/lib/seo";
import { formatDate } from "@/lib/format";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const notice = await getPublishedNotice(id);
  const title = notice?.title ?? "নোটিশ";
  return {
    title,
    description: `${title} — ${siteNameBn} (${siteNameEn})`,
  };
}

export default async function NoticePage({ params }: Props) {
  const { id } = await params;
  const notice = await getPublishedNotice(id);
  if (!notice) notFound();

  return (
    <article className="panel mx-auto my-10 max-w-3xl rounded-2xl border border-line bg-paper px-6 py-10">
      <Link href="/notices" className="text-sm font-medium text-leaf">← সব নোটিশ</Link>
      <p className="mt-6 text-sm text-muted">{formatDate(notice.date)}</p>
      <h1 className="mt-2 text-3xl font-semibold text-forest md:text-4xl">{notice.title}</h1>
      <p className="mt-6 whitespace-pre-wrap leading-relaxed">{notice.body}</p>
    </article>
  );
}
