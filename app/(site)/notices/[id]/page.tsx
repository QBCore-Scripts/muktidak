import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { englishNotice } from "@/lib/english";
import { getPublishedNotice } from "@/lib/db";
import { formatDate } from "@/lib/format";
import { getSite, shareMeta } from "@/lib/locale";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const found = await getPublishedNotice(id);
  const { locale, t } = await getSite();
  const notice = found && locale === "en" ? englishNotice(found) : found;
  const title = notice?.title ?? t.notice;
  const description = notice?.body.replace(/\s+/g, " ").trim().slice(0, 160) || title;
  return shareMeta(found ? `/notices/${found.id}` : "/notices", title, description);
}

export default async function NoticePage({ params }: Props) {
  const { id } = await params;
  const found = await getPublishedNotice(id);
  if (!found) notFound();
  const { locale, t } = await getSite();
  const notice = locale === "en" ? englishNotice(found) : found;

  return (
    <article className="panel mx-auto my-10 max-w-3xl rounded-2xl border border-line bg-paper px-6 py-10">
      <Link href="/notices" className="text-sm font-medium text-leaf">{t.allNotices}</Link>
      <p className="mt-6 text-sm text-muted">{formatDate(notice.date, locale)}</p>
      <h1 className="mt-2 text-3xl font-semibold text-forest md:text-4xl">{notice.title}</h1>
      <p className="mt-6 whitespace-pre-wrap leading-relaxed">{notice.body}</p>
    </article>
  );
}
