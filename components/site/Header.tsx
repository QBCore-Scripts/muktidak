"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { SiteCopy } from "@/lib/copy";
import { buttonVariants } from "@/components/ui/button";
import { siteNameEn } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { Mark } from "./Mark";

export function Header({ name, copy }: { name: string; copy: SiteCopy }) {
  const path = usePathname();
  const links = [
    ["/", copy.navHome],
    ["/about", copy.navAbout],
    ["/vision", copy.navVision],
    ["/activities", copy.navActivities],
    ["/gallery", copy.navGallery],
    ["/notices", copy.navNotices],
    ["/blogs", copy.navBlogs],
    ["/districts", copy.navDistricts],
    ["/contact", copy.navContact],
  ];
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40">
      <div className="bg-forest text-paper shadow-[0_8px_30px_rgba(12,50,40,0.18)]">
        <div className="relative overflow-hidden">
          <span className="side-photo side-photo-left" style={{ backgroundImage: "url(/history/speech.jpg)" }} aria-hidden="true" />
          <span className="side-photo side-photo-right" style={{ backgroundImage: "url(/history/fighters.jpg)" }} aria-hidden="true" />
          <div className="relative z-10 mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
          <Link href="/" className="flex min-w-0 items-center gap-3" onClick={() => setOpen(false)}>
            <Mark />
            <span className="min-w-0">
              <span className="block truncate font-heading text-base md:text-lg">{name}</span>
              <span className="block truncate text-[10px] font-medium tracking-[0.14em] text-paper/65">{siteNameEn}</span>
            </span>
          </Link>
          <nav className="ml-auto hidden items-center gap-0.5 lg:flex" aria-label="প্রধান মেনু">
            {links.map(([href, label]) => {
              const active = href === "/" ? path === "/" : path.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-full px-3 py-1.5 text-sm transition-colors ${active ? "bg-white/15 font-medium text-white" : "text-paper/80 hover:bg-white/10 hover:text-white"}`}
                >
                  {label}
                </Link>
              );
            })}
            <Link href="/donate" className={cn(buttonVariants({ variant: "donate" }), "ml-2 rounded-full px-4")}>
              {copy.navDonate}
            </Link>
          </nav>
          <button
            type="button"
            className="ml-auto rounded-full border border-white/20 px-3 py-1.5 text-sm lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? "বন্ধ" : "মেনু"}
          </button>
        </div>
        {open ? (
          <nav id="mobile-nav" className="relative z-10 border-t border-white/10 px-4 py-3 lg:hidden" aria-label="মোবাইল মেনু">
            <div className="grid gap-1">
              {links.map(([href, label]) => (
                <Link key={href} href={href} className="rounded-xl px-3 py-3 hover:bg-white/10" onClick={() => setOpen(false)}>
                  {label}
                </Link>
              ))}
              <Link href="/donate" className={cn(buttonVariants({ variant: "donate", size: "xl" }), "mt-1 w-full")} onClick={() => setOpen(false)}>
                {copy.navDonate}
              </Link>
            </div>
          </nav>
        ) : null}
        </div>
        <svg viewBox="0 0 1440 28" preserveAspectRatio="none" className="block h-4 w-full bg-paper/90 text-forest" aria-hidden="true">
          <path fill="currentColor" d="M0 0h1440v5C1040 28 400 28 0 5V0z" />
        </svg>
      </div>
      {copy.headerLine ? (
        <div className="border-b border-line bg-paper/90 backdrop-blur-md">
          <p className="mx-auto flex max-w-6xl items-center justify-center gap-2 px-4 py-2 text-center text-xs font-medium tracking-wide text-forest">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-donate" aria-hidden="true" />
            {copy.headerLine}
          </p>
        </div>
      ) : null}
    </header>
  );
}
