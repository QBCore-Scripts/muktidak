import Image from "next/image";
import Link from "next/link";
import { BlogCard } from "@/components/site/BlogCard";
import { CountUp } from "@/components/site/CountUp";
import { Mark } from "@/components/site/Mark";
import { NoticeRow } from "@/components/site/NoticeRow";
import { Reveal } from "@/components/site/Reveal";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { visionCards } from "@/lib/copy";
import { pageBySlug, paragraphs } from "@/lib/content";
import { getActivities, getPublishedBlogs, getPublishedNotices, publicCounts } from "@/lib/db";
import { pad2 } from "@/lib/i18n";
import { getSite } from "@/lib/locale";
import { cn } from "@/lib/utils";

const tiles = [
  { src: "/history/speech.jpg", tint: "tile-blue", top: false },
  { src: "/history/fighters.jpg", tint: "tile-green", top: true },
  { src: "/history/victory.jpg", tint: "tile-red", top: false },
];

const highlightArt = [
  { src: "/history/victory.jpg", tint: "tile-red", top: false },
  { src: "/history/fighters.jpg", tint: "tile-green", top: true },
  { src: "/history/speech.jpg", tint: "tile-blue", top: false },
];

export default async function HomePage() {
  const { locale, t, settings } = await getSite();
  const copy = settings.copy;
  const counts = await publicCounts();
  const activities = await getActivities();
  const home = await pageBySlug("home");
  const notices = (await getPublishedNotices()).slice(0, 5);
  const blogs = (await getPublishedBlogs()).slice(0, 3);
  const points = visionCards(copy.visionPoints).slice(0, 3);
  const body = paragraphs(home.body);
  const pillars = copy.heroPillars.split(/\n/).map((item) => item.trim()).filter(Boolean);
  const heroVideo = /^[\w-]{6,20}$/.test(copy.heroVideo) ? copy.heroVideo : "Wh0q8vdH-ro";
  const sections = [
    { href: "/manifesto", label: copy.linkManifesto },
    { href: "/objectives", label: copy.linkObjectives },
    { href: "/committee", label: copy.linkCommittee },
  ];
  const spotlight = [
    { kicker: copy.highlightKicker, title: copy.highlightOne },
    { kicker: "", title: copy.highlightTwo },
    { kicker: "", title: copy.highlightThree },
  ];
  const stats = [
    { value: counts.donationTotal, prefix: "৳", label: t.statDonations },
    { value: counts.activeMembers, prefix: "", label: t.statMembers },
    { value: counts.districtCount, prefix: "", label: t.statDistricts },
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
          </Reveal>
          <Reveal index={3}>
            <div className="mt-10" role="img" aria-label={settings.shortName}>
              <Mark src={settings.logoUrl} priority className="mx-auto h-40 w-40 drop-shadow-[0_12px_30px_rgba(0,0,0,0.35)] md:h-48 md:w-48" />
            </div>
          </Reveal>
        </div>
      </section>

      <nav aria-label={copy.navHome} className="relative z-10 mx-auto -mt-16 grid max-w-6xl gap-3 px-4 sm:grid-cols-3">
        {sections.map((item, index) => (
          <Reveal key={item.href} index={index}>
            <Link
              href={item.href}
              className="lift flex min-h-28 items-center justify-center rounded-2xl bg-white px-5 py-6 text-center shadow-[0_24px_50px_-24px_rgba(12,50,40,0.45)] ring-1 ring-forest/8 hover:ring-leaf/40"
            >
              <span className="font-heading text-2xl leading-snug text-forest md:text-3xl">{item.label}</span>
            </Link>
          </Reveal>
        ))}
      </nav>

      <section aria-label={copy.highlightOne} className="mx-auto grid max-w-6xl gap-5 px-4 pt-10 sm:grid-cols-3">
        {spotlight.map((item, index) => {
          const art = highlightArt[index];
          return (
          <Reveal key={item.title} as="article" variant="zoom" index={index} className={`tile lift flex p-6 ${art.tint} ${art.top ? "tile-top items-start" : "items-end"}`}>
            <Image src={art.src} alt="" fill sizes="(min-width: 640px) 33vw, 100vw" />
            <div className="w-full text-center">
              {item.kicker ? <p className="text-sm font-medium tracking-wide text-[#9fe0b9]">{item.kicker}</p> : null}
              <h2 className="font-heading text-2xl leading-snug [text-shadow:0_2px_12px_rgba(0,0,0,0.35)] md:text-3xl">{item.title}</h2>
            </div>
          </Reveal>
          );
        })}
      </section>

      <section className="relative z-10 mx-auto mt-8 max-w-6xl px-4">
        <Reveal className="grid gap-3 sm:grid-cols-3">
          {stats.map(({ value, prefix, label }, index) => (
            <Card
              key={label}
              className={cn(
                "lift gap-1 rounded-2xl px-6 py-6 shadow-[0_24px_50px_-24px_rgba(12,50,40,0.45)]",
                index === 0 ? "bg-destructive text-white ring-0" : "ring-forest/8",
              )}
            >
              <p className={cn("text-sm", index === 0 ? "text-white/80" : "text-muted-foreground")}>{label}</p>
              <p className={cn("text-4xl font-semibold", index === 0 ? "text-white" : "text-forest")}>
                <CountUp value={value} prefix={prefix} locale={locale} />
              </p>
            </Card>
          ))}
        </Reveal>
      </section>

      {points.length > 0 ? (
        <section className="mx-auto grid max-w-6xl gap-5 px-4 pt-14 sm:grid-cols-3">
          {points.map((point, index) => {
            const tile = tiles[index % tiles.length];
            return (
              <Reveal key={point.title} variant="zoom" index={index}>
                <Link href="/vision" className={`tile lift group flex p-6 ${tile.tint} ${tile.top ? "tile-top items-start" : "items-end"}`}>
                  <Image src={tile.src} alt="" fill sizes="(min-width: 640px) 33vw, 100vw" />
                  <span className="font-heading w-full text-center text-2xl leading-snug [text-shadow:0_2px_12px_rgba(0,0,0,0.35)] md:text-3xl">
                    {point.title}
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </section>
      ) : null}

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-[1.05fr_.95fr]">
        <div>
          <Reveal>
            <Badge variant="secondary">{copy.activitiesKicker}</Badge>
            <h2 className="mt-3 text-3xl text-forest md:text-4xl">{copy.homeWorkTitle}</h2>
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
