"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { SiteCopy } from "@/lib/copy";
import { buttonVariants } from "@/components/ui/button";
import { LOCALE_COOKIE, type Locale, type UiText } from "@/lib/i18n";
import { siteNameEn } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { Mark } from "./Mark";

const locales: [Locale, string][] = [
  ["bn", "বাং"],
  ["en", "EN"],
];

function saveLocale(next: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
}

export function Header({ name, copy, t, locale, logo = "" }: { name: string; copy: SiteCopy; t: UiText; locale: Locale; logo?: string }) {
  const path = usePathname();
  const router = useRouter();
  const [switching, startSwitch] = useTransition();

  function switchLocale(next: Locale) {
    if (next === locale) return;
    saveLocale(next);
    startSwitch(() => router.refresh());
  }
  const primary = [
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
  const documents = [
    ["/manifesto", copy.linkManifesto],
    ["/objectives", copy.linkObjectives],
    ["/committee", copy.linkCommittee],
  ];
  const links = [...primary.slice(0, 2), ...documents, ...primary.slice(2)];
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40">
      <div className="bg-forest text-paper shadow-[0_8px_30px_rgba(12,50,40,0.18)]">
        <div className="relative overflow-hidden">
          <span className="side-photo side-photo-left" style={{ backgroundImage: "url(/history/speech.jpg)" }} aria-hidden="true" />
          <span className="side-photo side-photo-right" style={{ backgroundImage: "url(/history/fighters.jpg)" }} aria-hidden="true" />
          <div className="relative z-10 mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
          <Link href="/" className="flex min-w-0 items-center gap-3" onClick={() => setOpen(false)}>
            <Mark src={logo} />
            <span className="min-w-0">
              <span className="block truncate font-heading text-base md:text-lg">{name}</span>
              <span className="block truncate text-[10px] font-medium tracking-[0.14em] text-paper/65">{locale === "en" ? "Political party" : siteNameEn}</span>
            </span>
          </Link>
          <nav className="ml-auto hidden items-center gap-0.5 lg:flex" aria-label={t.mainMenu}>
            {primary.map(([href, label]) => {
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
          <div
            role="group"
            aria-label={t.language}
            className={cn("ml-auto flex shrink-0 rounded-full border border-white/20 bg-white/5 p-0.5 transition-opacity lg:ml-1", switching && "opacity-60")}
          >
            {locales.map(([value, label]) => (
              <button
                key={value}
                type="button"
                lang={value}
                aria-pressed={locale === value}
                disabled={switching}
                onClick={() => switchLocale(value)}
                className={cn(
                  "rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
                  locale === value ? "bg-paper text-forest" : "text-paper/75 hover:text-white",
                )}
              >
                {label}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="rounded-full border border-white/20 px-3 py-1.5 text-sm lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? t.close : t.menu}
          </button>
        </div>
        {open ? (
          <nav id="mobile-nav" className="relative z-10 border-t border-white/10 px-4 py-3 lg:hidden" aria-label={t.mobileMenu}>
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
        <nav className="relative z-10 hidden flex-wrap items-center justify-center gap-1 px-4 pb-3 lg:flex" aria-label={t.mainMenu}>
          {documents.map(([href, label]) => {
            const active = path.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`rounded-full px-3 py-1 text-sm transition-colors ${active ? "bg-white/15 font-medium text-white" : "text-paper/75 hover:bg-white/10 hover:text-white"}`}
              >
                {label}
              </Link>
            );
          })}
        </nav>
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
