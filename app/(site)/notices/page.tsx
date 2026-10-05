import type { Metadata } from "next";
import { NoticeRow } from "@/components/site/NoticeRow";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { Card, CardContent } from "@/components/ui/card";
import { getPublishedNotices, getSettings } from "@/lib/db";

export const metadata: Metadata = {
  title: "নোটিশ",
  description: "বাংলাদেশ মুক্তির ডাক-৭১ (Bangladesh Muktir Dak 71) এর নোটিশ ও ঘোষণা।",
};

export default async function NoticesPage() {
  const copy = (await getSettings()).copy;
  const notices = await getPublishedNotices();

  return (
    <>
      <PageHeader kicker={copy.noticesKicker} title={copy.noticesTitle} text={copy.noticesText} />
      <div className="mx-auto max-w-3xl px-4 py-12">
        <Card className="rounded-[1.75rem] bg-[#e6eef0] py-5 ring-0 md:py-6">
          <CardContent className="grid gap-3 px-4 md:px-6">
            {notices.length === 0 ? <p className="rounded-xl bg-white px-5 py-6 text-sm text-muted-foreground">এখনো কোনো নোটিশ নেই।</p> : null}
            {notices.map((item, index) => (
              <Reveal key={item.id} index={index}>
                <NoticeRow notice={item} excerpt />
              </Reveal>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
