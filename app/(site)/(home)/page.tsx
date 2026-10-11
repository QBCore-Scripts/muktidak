import Image from "next/image";
import Link from "next/link";
import { BlogCard } from "@/components/site/BlogCard";
import { CampaignBanner, CampaignCard } from "@/components/site/ObosthanSlides";
import { CountUp } from "@/components/site/CountUp";
import { LiveMembers } from "@/components/site/LiveMembers";
import { Mark } from "@/components/site/Mark";
import { NoticeRow } from "@/components/site/NoticeRow";
import { PostTeasers } from "@/components/site/PostTeasers";
import { Reveal } from "@/components/site/Reveal";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { campaignPath } from "@/lib/campaigns";
import { visionCards } from "@/lib/copy";
import { pageBySlug, paragraphs } from "@/lib/content";
import { getActivities, getCampaigns, getPublishedBlogs, getPublishedNotices, getPublishedPosts, publicCounts } from "@/lib/db";
import { pad2 } from "@/lib/i18n";
import { englishActivity, englishNotice, englishText } from "@/lib/english";
import { getSite } from "@/lib/locale";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const tiles = [
  { src: "/history/speech.jpg", tint: "tile-blue", top: false },
  { src: "/history/fighters.jpg", tint: "tile-green", top: true },
  { src: "/history/victory.jpg", tint: "tile-red", top: false },
];

const highlightArt = [
  { src: "/history/press.jpg", tint: "tile-red", top: false },
  { src: "/history/fighters.jpg", tint: "tile-green", top: true },
  { src: "/history/speech.jpg", tint: "tile-blue", top: false },
];

export default async function HomePage() {
  const { locale, t, settings } = await getSite();
  const copy = settings.copy;
  const counts = await publicCounts();
  const activities = (await getActivities()).map((item) => (locale === "en" ? englishActivity(item) : item));
  const home = await pageBySlug("home");
  const notices = (await getPublishedNotices()).slice(0, 5).map((item) => (locale === "en" ? englishNotice(item) : item));
  const blogs = (await getPublishedBlogs()).slice(0, 3).map((item) => (locale === "en" ? { ...item, category: englishText(item.category) } : item));
  const campaigns = (await getCampaigns()).filter((item) => item.published);
  const banners = campaigns.filter((item) => item.spot === "banner");
  const highlight = campaigns.find((item) => item.spot === "highlight");
  const points = visionCards(copy.visionPoints)
    .slice(0, 3)
    .filter((point) => banners.length === 0 || point.title !== "গণতন্ত্রের মাঠের রাজনীতি");
  const body = paragraphs(home.body);
  const pillars = copy.heroPillars.split(/\n/).map((item) => item.trim()).filter(Boolean);
  const heroVideo = /^[\w-]{6,20}$/.test(copy.heroVideo) ? copy.heroVideo : "Wh0q8vdH-ro";
  const cardPosts = await getPublishedPosts();
  const sections = [
    { href: "/manifesto", section: "manifesto" as const, label: copy.linkManifesto },
    { href: "/objectives", section: "objectives" as const, label: copy.linkObjectives },
    { href: "/committee", section: "committee" as const, label: copy.linkCommittee },
  ];
  const spotlight = [
    { href: "/vision", kicker: copy.highlightKicker, title: copy.highlightOne },
    { href: "/about", kicker: "", title: copy.highlightTwo },
    { href: "/objectives", kicker: "", title: copy.highlightThree },
  ];
  const stats = [
    { href: "/donate", value: counts.donationTotal, prefix: "৳", label: t.statDonations, live: false },
    { href: "", value: counts.activeMembers, prefix: "", label: t.statMembers, live: true },
    { href: "/districts", value: counts.districtCount, prefix: "", label: t.statDistricts, live: false },
  ];

  return (
    <>
      <section className="hero relative isolate overflow-hidden bg-forest-deep text-white">
        <Image src="/history/speech.jpg" alt="" fill priority sizes="100vw" className="hero-photo -z-30 object-cover" />
        <div className="hero-video absolute inset-0 -z-30" aria-hidden="true">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${heroVideo}?autoplay=1&mute=1&loop=1&playlist=${heroVideo}&controls=0&playsinline=1&rel=0&disablekb=1&iv_load_policy=3&fs=0`}
            title={t.heroVideo}
            allow="autoplay; encrypted-media; picture-in-picture"
            referrerPolicy="strict-origin-when-cross-origin"
            tabIndex={-1}
          />
        </div>
        <div className="hero-shade absolute inset-0 -z-20" aria-hidden="true" />
        <span className="hero-sun absolute -z-10" aria-hidden="true" />

        <div className="mx-auto flex min-h-[min(78vh,44rem)] max-w-4xl flex-col items-center justify-center px-4 pb-28 pt-16 text-center">
          <Reveal index={0}>
            {copy.homeDate ? <p className="mb-4 text-sm font-medium tracking-wide text-[#9fe0b9]">{copy.homeDate}</p> : null}
            <h1 className="text-3xl leading-[1.28] text-white [text-shadow:0_6px_30px_rgba(0,0,0,0.35)] sm:text-4xl md:text-5xl lg:text-6xl">
              {copy.heroTitle}
            </h1>
          </Reveal>
          <Reveal index={1} className="mt-6">
            <p className="text-xl text-[#9fe0b9] md:text-2xl">{copy.heroPhilosophy}</p>
          </Reveal>
          <Reveal index={2}>
            <ul className="mt-4 flex flex-wrap items-center justify-center text-lg text-white/90">
              {pillars.map((item, index) => (
                <li key={item} className="flex items-center">
                  {index > 0 ? <span className="mx-3 h-1.5 w-1.5 rounded-full bg-[#9fe0b9]" aria-hidden="true" /> : null}
                  {item}
                </li>
              ))}
            </ul>
            {copy.homeFreedom ? <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/80">{copy.homeFreedom}</p> : null}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href="/donate" className={cn(buttonVariants({ variant: "donate", size: "xl" }))}>
                {copy.homeDonate}
              </Link>
              <Link href="/about" className={cn(buttonVariants({ size: "xl" }), "border border-white/30 bg-white/10 text-white hover:bg-white/20")}>
                {copy.homeAbout}
              </Link>
            </div>
          </Reveal>
          <Reveal index={3}>
            <div className="mt-10" role="img" aria-label={settings.shortName}>
              <Mark src={settings.logoUrl} priority className="mx-auto h-40 w-40 drop-shadow-[0_12px_30px_rgba(0,0,0,0.35)] md:h-48 md:w-48" />
            </div>
          </Reveal>
        </div>
      </section>

      <nav aria-label={copy.navHome} className="relative z-10 mx-auto -mt-16 grid max-w-6xl items-stretch gap-3 px-4 sm:grid-cols-3">
        {sections.map((item, index) => {
          const latest = cardPosts.filter((post) => post.section === item.section).slice(0, 3);
          return (
            <Reveal key={item.href} index={index} className="h-full">
              {latest.length === 0 ? (
                <Link
                  href={item.href}
                  className="lift flex h-full min-h-28 items-center justify-center rounded-2xl bg-white px-5 py-6 text-center shadow-[0_24px_50px_-24px_rgba(12,50,40,0.45)] ring-1 ring-forest/8 hover:ring-leaf/40"
                >
                  <span className="font-heading text-2xl leading-snug text-forest md:text-3xl">{item.label}</span>
                </Link>
              ) : (
                <div className="lift flex h-full min-h-28 flex-col rounded-2xl bg-white px-5 py-6 text-center shadow-[0_24px_50px_-24px_rgba(12,50,40,0.45)] ring-1 ring-forest/8">
                  <Link
                    href={item.href}
                    className="font-heading text-2xl leading-snug text-forest hover:text-leaf focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 md:text-3xl"
                  >
                    {item.label}
                  </Link>
                  <div className="mt-5 border-t border-forest/10 pt-4 text-left">
                    <PostTeasers posts={latest} readMore={t.readMore} />
                  </div>
                </div>
              )}
            </Reveal>
          );
        })}
      </nav>

      <section aria-label={copy.highlightOne} className="mx-auto grid max-w-6xl items-start gap-5 px-4 pt-10 sm:grid-cols-3">
        {spotlight.map((item, index) => {
          if (index === 2 && highlight) {
            return (
              <Reveal key={highlight.id} variant="zoom" index={index}>
                <CampaignCard title={highlight.title} href={campaignPath(highlight.slug)} images={highlight.images} />
              </Reveal>
            );
          }
          const art = highlightArt[index];
          return (
          <Reveal key={item.href} variant="zoom" index={index}>
            <Link href={item.href} className={`tile lift flex p-6 ${art.tint} ${art.top ? "tile-top items-start" : "items-end"}`}>
              <Image src={art.src} alt="" fill sizes="(min-width: 640px) 33vw, 100vw" />
              <div className="w-full text-center">
                {item.kicker ? <p className="text-sm font-medium tracking-wide text-[#9fe0b9]">{item.kicker}</p> : null}
                <h2 className="font-heading text-2xl leading-snug [text-shadow:0_2px_12px_rgba(0,0,0,0.35)] md:text-3xl">{item.title}</h2>
              </div>
            </Link>
          </Reveal>
          );
        })}
      </section>

      <section className="relative z-10 mx-auto mt-8 max-w-6xl px-4">
        <Reveal className="grid gap-3 sm:grid-cols-3">
          {stats.map(({ href, value, prefix, label, live }, index) => {
            const card = (
              <Card
                className={cn(
                  "lift gap-1 rounded-2xl px-6 py-6 shadow-[0_24px_50px_-24px_rgba(12,50,40,0.45)]",
                  index === 0 ? "bg-destructive text-white ring-0" : "ring-forest/8",
                  href && "h-full",
                )}
              >
                <p className={cn("inline-flex items-center gap-2 text-sm", index === 0 ? "text-white/80" : "text-muted-foreground")}>
                  {live ? (
                    <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-leaf opacity-70 motion-reduce:animate-none" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-leaf" />
                    </span>
                  ) : null}
                  {label}
                </p>
                <p className={cn("text-4xl font-semibold", index === 0 ? "text-white" : "text-forest")}>
                  {live ? (
                    <LiveMembers value={value} nextAt={counts.membersNextAt} locale={locale} />
                  ) : (
                    <CountUp value={value} prefix={prefix} locale={locale} />
                  )}
                </p>
              </Card>
            );
            return href ? (
              <Link key={label} href={href} className="block h-full rounded-2xl focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
                {card}
              </Link>
            ) : (
              <div key={label}>{card}</div>
            );
          })}
        </Reveal>
      </section>

      {banners.length > 0 || points.length > 0 ? (
      <section className="mx-auto grid max-w-6xl gap-5 px-4 pt-14" aria-label={banners[0]?.title || copy.navVision}>
        {banners.map((item) => (
          <Reveal key={item.id} variant="zoom">
            <CampaignBanner title={item.title} href={campaignPath(item.slug)} images={item.images} />
          </Reveal>
        ))}
        {points.length > 0 ? (
          <div className={`grid gap-5 ${banners.length > 0 ? "sm:grid-cols-2" : "sm:grid-cols-3"}`}>
            {points.map((point, index) => {
              const tile = tiles[(banners.length > 0 ? index + 1 : index) % tiles.length];
              return (
                <Reveal key={point.title} variant="zoom" index={index + 1}>
                  <Link href="/vision" className={`tile lift group flex p-6 ${tile.tint} ${tile.top ? "tile-top items-start" : "items-end"}`}>
                    <Image src={tile.src} alt="" fill sizes="(min-width: 640px) 33vw, 100vw" />
                    <span className="font-heading w-full text-center text-2xl leading-snug [text-shadow:0_2px_12px_rgba(0,0,0,0.35)] md:text-3xl">
                      {point.title}
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        ) : null}
      </section>
      ) : null}

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-[1.05fr_.95fr]">
        <div>
          <Reveal>
            <div className="flex items-end justify-between gap-4">
              <div>
                <Badge variant="secondary">{copy.activitiesKicker}</Badge>
                <h2 className="mt-3 text-3xl text-forest md:text-4xl">{copy.homeWorkTitle}</h2>
              </div>
              <Link href="/activities" className={cn(buttonVariants({ variant: "outline" }), "shrink-0 rounded-full")}>
                {copy.navActivities}
              </Link>
            </div>
            {body.map((part) => (
              <p key={part} className="mt-3 text-muted-foreground">{part}</p>
            ))}
          </Reveal>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {activities.map((item, index) => (
              <Reveal key={item.id} index={index}>
                <Card className="lift h-full ring-forest/8 hover:ring-leaf/40">
                  <CardHeader>
                    <CardTitle className="text-xl text-forest">{item.title}</CardTitle>
                    <CardAction>
                      <span className="text-sm text-forest/30 tabular-nums">{pad2(index + 1, locale)}</span>
                    </CardAction>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="leading-relaxed">{item.summary}</CardDescription>
                  </CardContent>
                  {item.date ? (
                    <CardContent className="mt-auto">
                      <Badge variant="outline" className="border-leaf/30 text-leaf">{item.date}</Badge>
                    </CardContent>
                  ) : null}
                </Card>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal variant="right" className="self-start md:sticky md:top-32">
          <Card className="gap-4 rounded-[1.75rem] bg-[#e6eef0] py-6 ring-0">
            <CardHeader className="px-6">
              <CardTitle className="text-3xl text-[#1f4f9a]">{copy.homeNoticeTitle}</CardTitle>
              <CardAction>
                <Link href="/notices" className={cn(buttonVariants({ variant: "outline", size: "sm" }), "rounded-full border-[#1f4f9a]/20 bg-white text-[#1f4f9a]")}>
                  {copy.homeNoticesLink}
                </Link>
              </CardAction>
            </CardHeader>
            <CardContent className="grid gap-3 px-4 md:px-5">
              {notices.length === 0 ? <p className="rounded-xl bg-white px-5 py-6 text-sm text-muted-foreground">{t.noNotices}</p> : null}
              {notices.map((item, index) => (
                <Reveal key={item.id} index={index}>
                  <NoticeRow notice={item} locale={locale} />
                </Reveal>
              ))}
            </CardContent>
            {copy.homeNote ? (
              <CardFooter className="mx-4 rounded-xl border border-dashed border-leaf/40 bg-white/60 px-4 py-3 text-sm leading-relaxed text-forest md:mx-5">
                {copy.homeNote}
              </CardFooter>
            ) : null}
          </Card>
        </Reveal>
      </section>

      {blogs.length > 0 ? (
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <Reveal className="flex items-end justify-between gap-4">
            <div>
              <Badge variant="secondary">{copy.blogsKicker}</Badge>
              <h2 className="mt-3 text-3xl text-forest md:text-4xl">{copy.homeBlogTitle}</h2>
            </div>
            <Link href="/blogs" className={cn(buttonVariants({ variant: "outline" }), "rounded-full")}>
              {copy.homeBlogsLink}
            </Link>
          </Reveal>
          <Separator className="my-6" />
          <div className="grid gap-5 md:grid-cols-3">
            {blogs.map((item, index) => (
              <Reveal key={item.id} index={index}>
                <BlogCard post={item} index={index} locale={locale} />
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
