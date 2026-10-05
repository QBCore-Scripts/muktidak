import type { Metadata } from "next";
import { PageHeader } from "@/components/site/PageHeader";
import { pageBySlug, paragraphs } from "@/lib/content";
import { getActivities, getSettings } from "@/lib/db";

export const metadata: Metadata = {
  title: "পরিচিতি",
  description: "বাংলাদেশ মুক্তির ডাক-৭১ (Bangladesh Muktir Dak 71) রাজনৈতিক দলের পরিচিতি।",
};

export default function AboutPage() {
  const page = pageBySlug("about");
  const parts = paragraphs(page.body);
  const settings = getSettings();
  const activities = getActivities();

  return (
    <>
      <PageHeader kicker={settings.shortName} title={page.title} text={parts[0]} />
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-[1.1fr_.9fr]">
        <div className="grid gap-4">
          <blockquote className="panel border-l-4 border-donate bg-[#f8ece8] px-5 py-4 text-lg leading-relaxed">
            {settings.quote}
          </blockquote>
          {parts.slice(1).map((part) => (
            <p key={part} className="leading-relaxed text-ink/90">{part}</p>
          ))}
        </div>
        <aside className="grid content-start gap-3">
          {activities.slice(0, 3).map((item, index) => (
            <div key={item.id} className="panel rounded-xl border border-leaf/30 bg-paper p-4">
              <p className="text-sm font-semibold text-leaf">{new Intl.NumberFormat("bn-BD").format(index + 1).padStart(2, "০")}</p>
              <h2 className="mt-1 font-semibold">{item.title}</h2>
              <p className="mt-1 text-sm text-muted">{item.summary}</p>
            </div>
          ))}
        </aside>
      </div>
    </>
  );
}
