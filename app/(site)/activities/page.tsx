import type { Metadata } from "next";
import { PageHeader } from "@/components/site/PageHeader";
import { pageBySlug, paragraphs } from "@/lib/content";
import { getActivities, getSettings } from "@/lib/db";

export const metadata: Metadata = {
  title: "কার্যক্রম",
  description: "বাংলাদেশ মুক্তির ডাক-৭১ (Bangladesh Muktir Dak 71) এর মাঠের কার্যক্রম।",
};

export default function ActivitiesPage() {
  const page = pageBySlug("activities");
  const intro = paragraphs(page.body)[0];
  const copy = getSettings().copy;
  const activities = getActivities();

  return (
    <>
      <PageHeader kicker={copy.activitiesKicker} title={page.title} text={intro} />
      <div className="mx-auto grid max-w-6xl gap-4 px-4 py-10 md:grid-cols-2">
        {activities.map((item) => (
          <article key={item.id} className="panel rounded-2xl border border-line bg-paper p-6">
            <p className="text-xs font-medium text-leaf">{item.date}</p>
            <h2 className="mt-2 text-2xl font-semibold text-forest">{item.title}</h2>
            <p className="mt-3 leading-relaxed text-muted">{item.summary}</p>
          </article>
        ))}
      </div>
    </>
  );
}
