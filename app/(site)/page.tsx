import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BlogCard } from "@/components/site/BlogCard";
import { CountUp } from "@/components/site/CountUp";
import { NoticeRow } from "@/components/site/NoticeRow";
import { Reveal } from "@/components/site/Reveal";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { visionCards } from "@/lib/copy";
import { pageBySlug, paragraphs } from "@/lib/content";
import { getActivities, getPublishedBlogs, getPublishedNotices, getSettings, publicCounts } from "@/lib/db";
import { cn } from "@/lib/utils";

const tiles = [
  { src: "/history/speech.jpg", tint: "tile-blue", top: false },
  { src: "/history/fighters.jpg", tint: "tile-green", top: true },
  { src: "/history/victory.jpg", tint: "tile-red", top: false },
];

const heroVideo = "Wh0q8vdH-ro";

const bn2 = new Intl.NumberFormat("bn-BD", { minimumIntegerDigits: 2 });

export default async function HomePage() {
  const settings = await getSettings();
  const copy = settings.copy;
  const counts = await publicCounts();
  const activities = await getActivities();
  const home = await pageBySlug("home");
  const notices = (await getPublishedNotices()).slice(0, 5);
  const blogs = (await getPublishedBlogs()).slice(0, 3);
  const points = visionCards(copy.visionPoints).slice(0, 3);
  const [lead, rest] = paragraphs(home.body);
  const stats = [
    { value: counts.donationTotal, prefix: "৳", label: "গৃহীত দান" },
    { value: counts.activeMembers, prefix: "", label: "সক্রিয় সদস্য" },
    { value: counts.districtCount, prefix: "", label: "জেলা দপ্তর" },
  ];

  return (
    <>
      <section className="hero relative isolate overflow-hidden bg-forest-deep text-white">
        <Image src="/history/speech.jpg" alt="" fill priority sizes="100vw" className="hero-photo -z-30 object-cover" />
        <div className="hero-video absolute inset-0 -z-30" aria-hidden="true">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${heroVideo}?autoplay=1&mute=1&loop=1&playlist=${heroVideo}&controls=0&playsinline=1&rel=0&disablekb=1&iv_load_policy=3&fs=0`}
            title="ব্যাকগ্রাউন্ড ভিডিও"
            allow="autoplay; encrypted-media; picture-in-picture"
            referrerPolicy="strict-origin-when-cross-origin"
            tabIndex={-1}
          />
        </div>
        <div className="hero-shade absolute inset-0 -z-20" aria-hidden="true" />
        <span className="hero-sun absolute -z-10" aria-hidden="true" />

        <div className="mx-auto grid min-h-[min(82vh,46rem)] max-w-6xl content-center gap-10 px-4 pb-40 pt-16 md:pb-44 lg:grid-cols-[1.25fr_.75fr] lg:items-end">
          <div className="min-w-0">
            {copy.homeDate ? (
              <Reveal index={0}>
                <Badge className="glass h-7 rounded-full px-3 text-sm font-normal text-white">
                  <span className="h-1.5 w-1.5 rounded-full bg-destructive" aria-hidden="true" />
                  {copy.homeDate}
                </Badge>
              </Reveal>
            ) : null}
            <Reveal index={1}>
              <h1 className="mt-6 max-w-2xl text-6xl leading-[1.08] text-white [text-shadow:0_6px_30px_rgba(0,0,0,0.35)] md:text-7xl lg:text-8xl">
                {home.title}
              </h1>
            </Reveal>
            {copy.homeFreedom ? (
              <Reveal index={2} className="mt-6 flex items-center gap-3">
                <Separator className="bg-[#9fe0b9] data-horizontal:w-10" />
                <p className="text-xl text-[#9fe0b9]">{copy.homeFreedom}</p>
              </Reveal>
            ) : null}
            <Reveal index={3}>
              <p className="mt-4 max-w-xl text-lg text-white/80">{lead}</p>
            </Reveal>
            <Reveal index={4} className="mt-9 flex flex-wrap gap-3">
              <Link href="/donate" className={cn(buttonVariants({ variant: "donate", size: "xl" }), "group")}>
                {copy.homeDonate}
                <ArrowRight data-icon="inline-end" className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
              <Link href="/about" className={cn(buttonVariants({ variant: "outline", size: "xl" }), "glass border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white")}>
                {copy.homeAbout}
              </Link>
            </Reveal>
          </div>

          <Reveal as="aside" variant="right" index={3} className="max-w-xl lg:mb-2">
            <Card className="glass gap-0 rounded-3xl bg-white/10 py-6 text-white ring-0">
              <CardHeader className="px-6">
                <CardDescription className="text-white/60">{copy.quoteLabel}</CardDescription>
              </CardHeader>
              <CardContent className="px-6 pt-3">
                <p className="font-heading text-2xl leading-snug md:text-3xl">“{settings.quote}”</p>
              </CardContent>
              <CardFooter className="mt-5 border-white/15 bg-transparent px-6 pb-0 pt-4 text-sm text-white/70">
                — {settings.shortName}
              </CardFooter>
            </Card>
          </Reveal>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-24 max-w-6xl px-4">
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
                <CountUp value={value} prefix={prefix} />
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
            {rest ? <p className="mt-3 text-muted-foreground">{rest}</p> : null}
          </Reveal>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {activities.map((item, index) => (
              <Reveal key={item.id} index={index}>
                <Card className="lift h-full ring-forest/8 hover:ring-leaf/40">
                  <CardHeader>
                    <CardTitle className="text-xl text-forest">{item.title}</CardTitle>
                    <CardAction>
                      <span className="text-sm text-forest/30 tabular-nums">{bn2.format(index + 1)}</span>
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
              {notices.length === 0 ? <p className="rounded-xl bg-white px-5 py-6 text-sm text-muted-foreground">এখনো কোনো নোটিশ নেই।</p> : null}
              {notices.map((item, index) => (
                <Reveal key={item.id} index={index}>
                  <NoticeRow notice={item} />
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
                <BlogCard post={item} index={index} />
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
