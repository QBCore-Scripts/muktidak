import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/site/PageHeader";
import { getPublishedNotices, getSettings } from "@/lib/db";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "নোটিশ",
  description: "বাংলাদেশ মুক্তির ডাক-৭১ (Bangladesh Muktir Dak 71) এর নোটিশ ও ঘোষণা।",
};

export default function NoticesPage() {
  const copy = getSettings().copy;
  const notices = getPublishedNotices();

  return (
    <>
      <PageHeader kicker={copy.noticesKicker} title={copy.noticesTitle} text={copy.noticesText} />
      <div className="mx-auto grid max-w-3xl gap-3 px-4 py-10">
        {notices.map((item) => (
          <Link key={item.id} href={`/notices/${item.id}`} className="panel rounded-2xl border border-line bg-paper p-5 hover:border-leaf">
            <p className="text-xs text-muted">{formatDate(item.date)}</p>
            <h2 className="mt-1 text-xl font-semibold text-forest">{item.title}</h2>
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">{item.body}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
