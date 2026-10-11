"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { CampaignImage } from "@/lib/types";

const INTERVAL = 3000;

function useSlide(count: number) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || count < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % count);
    }, INTERVAL);
    return () => window.clearInterval(id);
  }, [paused, count, index]);

  function go(next: number) {
    setIndex(((next % count) + count) % count);
  }

  return { index, go, setPaused };
}

function Controls({ index, count, go }: { index: number; count: number; go: (next: number) => void }) {
  if (count < 2) return null;
  return (
    <>
      <button
        type="button"
        className="absolute top-1/2 left-2 z-30 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-2xl leading-none text-forest shadow-md"
        aria-label="আগের ছবি"
        onClick={() => go(index - 1)}
      >
        <span aria-hidden="true">‹</span>
      </button>
      <button
        type="button"
        className="absolute top-1/2 right-2 z-30 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-2xl leading-none text-forest shadow-md"
        aria-label="পরের ছবি"
        onClick={() => go(index + 1)}
      >
        <span aria-hidden="true">›</span>
      </button>
      <div className="absolute top-3 left-1/2 z-30 flex -translate-x-1/2 gap-1.5">
        {Array.from({ length: count }, (_, dot) => (
          <button
            key={dot}
            type="button"
            className={`h-2.5 w-2.5 rounded-full ring-1 ring-black/25 ${dot === index ? "bg-white" : "bg-white/45"}`}
            aria-label={`ছবি ${dot + 1}`}
            aria-current={dot === index ? "true" : undefined}
            onClick={() => go(dot)}
          />
        ))}
      </div>
    </>
  );
}

function Track({ index, images, fit }: { index: number; images: CampaignImage[]; fit: "cover" | "contain" }) {
  const count = Math.max(images.length, 1);
  return (
    <div
      className="flex h-full transition-transform duration-500 ease-out motion-reduce:transition-none"
      style={{ width: `${count * 100}%`, transform: `translateX(-${(index * 100) / count}%)` }}
    >
      {images.map((slide, slideIndex) => (
        <div key={`${slide.url}-${slideIndex}`} className="relative h-full shrink-0 bg-black" style={{ width: `${100 / count}%` }} aria-hidden={slideIndex !== index}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={slide.url} alt={slide.alt} className={`absolute inset-0 h-full w-full ${fit === "contain" ? "object-contain" : "object-cover"}`} />
        </div>
      ))}
    </div>
  );
}

function pauseHandlers(setPaused: (value: boolean) => void) {
  return {
    onMouseEnter: () => setPaused(true),
    onMouseLeave: () => setPaused(false),
    onFocus: () => setPaused(true),
    onBlur: (event: React.FocusEvent<HTMLElement>) => {
      const next = event.relatedTarget;
      if (!(next instanceof Node) || !event.currentTarget.contains(next)) setPaused(false);
    },
  };
}

export function CampaignCard({ title, href, images }: { title: string; href: string; images: CampaignImage[] }) {
  const slides = images.length > 0 ? images : [];
  const { index, go, setPaused } = useSlide(slides.length);

  return (
    <article className="lift overflow-hidden rounded-[1.25rem] bg-white text-forest ring-1 ring-forest/10" {...pauseHandlers(setPaused)}>
      <div className="relative aspect-[4/3] overflow-hidden bg-black">
        {slides.length > 0 ? (
          <div className="absolute inset-0">
            <Track index={index} images={slides} fit="cover" />
          </div>
        ) : null}
        <Link href={href} className="absolute inset-0 z-10" aria-label={title} />
        <Controls index={index} count={slides.length} go={go} />
      </div>
      <Link href={href} className="block px-4 py-4 text-center text-sm leading-relaxed md:text-base">
        {title}
      </Link>
    </article>
  );
}

export function CampaignBanner({ title, href, images }: { title: string; href: string; images: CampaignImage[] }) {
  const slides = images.length > 0 ? images : [{ url: "", alt: "" }];
  const visible = slides.filter((item) => item.url);
  const { index, go, setPaused } = useSlide(visible.length);

  if (visible.length < 2) {
    const image = visible[0];
    return (
      <Link href={href} className="tile tile-statement tile-green lift group flex items-end p-6 sm:p-10">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image.url} alt={image.alt} />
        ) : null}
        <span className="font-heading w-full text-center text-xl leading-snug [text-shadow:0_2px_16px_rgba(0,0,0,0.45)] sm:text-2xl md:text-4xl">{title}</span>
      </Link>
    );
  }

  return (
    <article className="tile-statement tile-green lift relative flex items-end overflow-hidden rounded-[1.25rem] bg-forest-deep p-6 text-white sm:p-10" {...pauseHandlers(setPaused)}>
      <div className="absolute inset-0">
        <Track index={index} images={visible} fit="cover" />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-forest-deep/95 via-forest-deep/45 to-transparent" />
      <Link href={href} className="absolute inset-0 z-10" aria-label={title} />
      <span className="pointer-events-none relative z-20 font-heading w-full text-center text-xl leading-snug [text-shadow:0_2px_16px_rgba(0,0,0,0.45)] sm:text-2xl md:text-4xl">
        {title}
      </span>
      <Controls index={index} count={visible.length} go={go} />
    </article>
  );
}

export function CampaignStage({ images }: { images: CampaignImage[] }) {
  const slides = images.filter((item) => item.url);
  const { index, go, setPaused } = useSlide(slides.length);
  if (slides.length === 0) return null;

  return (
    <div
      className="relative aspect-video overflow-hidden rounded-[1.25rem] bg-black"
      aria-roledescription="carousel"
      aria-label="কর্মসূচির ছবি"
      {...pauseHandlers(setPaused)}
    >
      <div className="absolute inset-0">
        <Track index={index} images={slides} fit="contain" />
      </div>
      <Controls index={index} count={slides.length} go={go} />
    </div>
  );
}
