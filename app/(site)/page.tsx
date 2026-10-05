import Link from "next/link";
import { pageBySlug, paragraphs } from "@/lib/content";
import { getActivities, getPublishedBlogs, getPublishedNotices, getSettings, publicCounts } from "@/lib/db";
import { formatBdt, formatDate } from "@/lib/format";

export default function HomePage() {
  const settings = getSettings();
  const copy = settings.copy;
  const counts = publicCounts();
  const activities = getActivities();
  const home = pageBySlug("home");
  const notices = getPublishedNotices().slice(0, 3);
  const blogs = getPublishedBlogs().slice(0, 3);
  const [lead, rest] = paragraphs(home.body);

  return (
    <>
      <section className="border-b border-line bg-paper">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-[1.35fr_.75fr] md:py-16">
          <div>
            {copy.homeDate ? <p className="text-sm font-medium text-donate">{copy.homeDate}</p> : null}
            <h1 className="mt-3 max-w-xl text-4xl font-semibold leading-tight tracking-tight text-forest md:text-6xl">
              {home.title}
            </h1>
            {copy.homeFreedom ? <p className="mt-4 text-base font-medium text-leaf">{copy.homeFreedom}</p> : null}
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted">{lead}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/donate" className="rounded-lg bg-donate px-5 py-3 text-sm font-semibold text-white hover:bg-[#a82c25]">
                {copy.homeDonate}
              </Link>
              <Link href="/about" className="rounded-lg border border-line bg-cream px-5 py-3 text-sm font-semibold text-forest hover:border-leaf">
                {copy.homeAbout}
              </Link>
            </div>
          </div>
          <aside className="panel panel-forest flex flex-col justify-between rounded-2xl bg-forest p-6 text-paper">
            <p className="text-sm text-paper/70">{copy.quoteLabel}</p>
            <p className="mt-6 text-2xl font-medium leading-snug">{settings.quote}</p>
            <p className="mt-6 text-sm text-paper/70">{settings.shortName}</p>
          </aside>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-px overflow-hidden px-4 py-8 sm:grid-cols-3">
        {[
          [formatBdt(counts.donationTotal), "গৃহীত দান"],
          [new Intl.NumberFormat("bn-BD").format(counts.activeMembers), "সক্রিয় সদস্য"],
          [new Intl.NumberFormat("bn-BD").format(counts.districtCount), "জেলা দপ্তর"],
        ].map(([value, label]) => (
          <div key={label} className="panel border border-line bg-paper px-5 py-6 first:rounded-l-2xl last:rounded-r-2xl">
            <p className="text-2xl font-semibold text-forest">{value}</p>
            <p className="mt-1 text-sm text-muted">{label}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-6 md:grid-cols-[1fr_1fr] md:py-10">
        <div>
          <h2 className="text-2xl font-semibold text-forest">{copy.homeWorkTitle}</h2>
          <p className="mt-3 leading-relaxed text-muted">{rest}</p>
          <div className="mt-6 grid gap-3">
            {activities.map((item) => (
              <article key={item.id} className="panel rounded-xl border border-line bg-paper p-4">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-semibold">{item.title}</h3>
                  <span className="text-xs text-muted">{item.date}</span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.summary}</p>
              </article>
            ))}
          </div>
        </div>
        <div>
          <div className="flex items-end justify-between">
            <h2 className="text-2xl font-semibold text-forest">{copy.homeNoticeTitle}</h2>
            <Link href="/notices" className="text-sm font-medium text-leaf">{copy.homeNoticesLink}</Link>
          </div>
          <div className="mt-6 grid gap-3">
            {notices.map((item) => (
              <Link key={item.id} href={`/notices/${item.id}`} className="panel rounded-xl border border-line bg-paper p-4 hover:border-leaf">
                <p className="text-xs text-muted">{formatDate(item.date)}</p>
                <h3 className="mt-1 font-semibold">{item.title}</h3>
              </Link>
            ))}
          </div>
          {copy.homeNote ? (
          <div className="panel mt-6 rounded-xl border border-dashed border-leaf/40 bg-moss px-4 py-4 text-sm leading-relaxed text-forest">
            {copy.homeNote}
          </div>
          ) : null}
        </div>
      </section>

      {blogs.length > 0 ? (
        <section className="mx-auto max-w-6xl px-4 py-6 md:py-10">
          <div className="flex items-end justify-between">
            <h2 className="text-2xl font-semibold text-forest">{copy.homeBlogTitle}</h2>
            <Link href="/blogs" className="text-sm font-medium text-leaf">{copy.homeBlogsLink}</Link>
          </div>
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {blogs.map((item) => (
              <Link key={item.id} href={`/blogs/${item.slug}`} className="panel rounded-xl border border-line bg-paper p-4 hover:border-leaf">
                <p className="text-xs text-muted">{formatDate(item.date)}</p>
                <h3 className="mt-1 font-semibold">{item.title}</h3>
                {item.excerpt ? <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">{item.excerpt}</p> : null}
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
