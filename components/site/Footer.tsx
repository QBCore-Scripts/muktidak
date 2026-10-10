import Link from "next/link";
import { englishPages, telHref } from "@/lib/english";
import { footerLinkList } from "@/lib/copy";
import { getPages } from "@/lib/db";
import type { Locale } from "@/lib/i18n";
import type { Settings } from "@/lib/types";
import { Mark } from "./Mark";

const listed = new Set(["home", "manifesto", "objectives", "committee", "about", "vision", "activities", "gallery", "blogs", "notices", "districts", "contact", "donate"]);

const linkClass = "text-paper/85 transition-colors hover:text-white";

export async function Footer({ settings, locale }: { settings: Settings; locale: Locale }) {
  const configured = footerLinkList(settings.copy.footerLinks);
  const extra = (await getPages())
    .filter((page) => page.slug && page.title && !listed.has(page.slug))
    .map((page) => (locale === "en" && englishPages[page.slug] ? { ...page, title: englishPages[page.slug].title } : page))
    .map((page) => ({ href: `/${page.slug}`, label: page.title }))
    .filter((page) => !configured.hidden.has(page.href) && !configured.links.some((item) => item.href === page.href));
  const builtin = [
    { href: "/manifesto", label: settings.copy.linkManifesto },
    { href: "/objectives", label: settings.copy.linkObjectives },
    { href: "/committee", label: settings.copy.linkCommittee },
    { href: "/about", label: settings.copy.navAbout },
    { href: "/vision", label: settings.copy.navVision },
    { href: "/activities", label: settings.copy.navActivities },
    { href: "/gallery", label: settings.copy.navGallery },
    { href: "/blogs", label: settings.copy.navBlogs },
    { href: "/notices", label: settings.copy.navNotices },
    { href: "/districts", label: settings.copy.navDistricts },
    { href: "/contact", label: settings.copy.navContact },
    { href: "/donate", label: settings.copy.navDonate },
  ].filter((page) => page.label && !configured.hidden.has(page.href));
  const pages = [...(configured.links.length ? configured.links : builtin), ...extra];
  return (
    <footer className="mt-16 text-paper">
      <svg viewBox="0 0 1440 28" preserveAspectRatio="none" className="block h-5 w-full text-forest-deep" aria-hidden="true">
        <path fill="currentColor" d="M0 28h1440V9C1040 0 400 0 0 9v19z" />
      </svg>
      <div className="relative overflow-hidden bg-forest-deep">
        <span className="side-photo side-photo-deep side-photo-left" style={{ backgroundImage: "url(/history/fighters.jpg)" }} aria-hidden="true" />
        <span className="side-photo side-photo-deep side-photo-right" style={{ backgroundImage: "url(/history/speech.jpg)" }} aria-hidden="true" />
        <div className="h-1 bg-gradient-to-r from-forest via-donate to-forest" />
        <div className="relative z-10 mx-auto max-w-6xl px-4 pb-10 pt-10">
        {settings.copy.footerLine ? (
          <p className="max-w-xl text-2xl font-semibold leading-snug tracking-tight md:text-3xl">{settings.copy.footerLine}</p>
        ) : null}
        <div className={`grid items-start gap-10 border-t border-white/10 pt-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.45fr)_minmax(0,0.85fr)] lg:gap-0 ${settings.copy.footerLine ? "mt-10" : ""}`}>
          <div className="lg:pr-10">
            <div className="flex items-center gap-3">
              <Mark src={settings.logoUrl} className="h-12 w-12" />
              <span>
                <p className="font-heading text-lg">{settings.shortName}</p>
                {settings.copy.footerAlt ? <p className="text-[11px] tracking-[0.12em] text-paper/55">{settings.copy.footerAlt}</p> : null}
              </span>
            </div>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-paper/75">{settings.tagline}</p>
          </div>
          <div className="lg:border-x lg:border-white/10 lg:px-10">
            {settings.copy.footerPagesTitle ? <p className="text-xs font-semibold tracking-[0.16em] text-paper/50">{settings.copy.footerPagesTitle}</p> : null}
            <ul className="mt-4 columns-2 gap-x-10 text-sm [column-fill:balance]">
              {pages.map((page) => (
                <li key={page.href} className="break-inside-avoid pb-2.5">
                  <Link href={page.href} className={`${linkClass} block leading-snug`}>{page.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:pl-10">
            {settings.copy.footerContactTitle ? <p className="text-xs font-semibold tracking-[0.16em] text-paper/50">{settings.copy.footerContactTitle}</p> : null}
            <ul className="mt-4 grid gap-2.5 text-sm">
              {settings.address ? <li className="leading-relaxed text-paper/85">{settings.address}</li> : null}
              {settings.phone ? <li><a href={telHref(settings.phone)} className={linkClass}>{settings.phone}</a></li> : null}
              {settings.email ? <li><a href={`mailto:${settings.email}`} className={`${linkClass} break-all`}>{settings.email}</a></li> : null}
            </ul>
          </div>
        </div>
      </div>
      {settings.copy.footerNote ? <FooterCredit note={settings.copy.footerNote} /> : null}
      </div>
    </footer>
  );
}

function CreditName({ name }: { name: string }) {
  const parts = name.split(/(Syntaxx Technology)/i);
  return (
    <span className="text-sm font-medium tracking-[0.08em] text-paper">
      {parts.map((part, index) =>
        /^syntaxx technology$/i.test(part) ? (
          <a
            key={index}
            href="https://syntaxx.tech/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-white/35 underline-offset-4 hover:text-white hover:decoration-white"
          >
            {part}
          </a>
        ) : (
          <span key={index}>{part}</span>
        ),
      )}
    </span>
  );
}

function FooterCredit({ note }: { note: string }) {
  const match = note.match(/^(developed by)\s+(.+)$/i);
  const lead = match?.[1] ?? "";
  const name = match?.[2] ?? note;

  return (
    <div className="relative z-10 border-t border-white/10">
      <p className="mx-auto flex max-w-6xl flex-col items-center gap-1.5 px-4 py-5 sm:flex-row sm:justify-center sm:gap-4">
        <span className="hidden h-px w-12 bg-gradient-to-r from-transparent to-white/30 sm:block" aria-hidden="true" />
        {lead ? (
          <span className="text-[10px] font-medium uppercase tracking-[0.34em] text-paper/40">{lead}</span>
        ) : null}
        <CreditName name={name} />
        <span className="hidden h-px w-12 bg-gradient-to-l from-transparent to-white/30 sm:block" aria-hidden="true" />
      </p>
    </div>
  );
}
