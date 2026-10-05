import Link from "next/link";
import type { Settings } from "@/lib/types";
import { siteNameEn } from "@/lib/seo";
import { Mark } from "./Mark";

export function Footer({ settings }: { settings: Settings }) {
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
        <div className={`grid gap-10 border-t border-white/10 pt-8 md:grid-cols-3 ${settings.copy.footerLine ? "mt-10" : ""}`}>
          <div>
            <div className="flex items-center gap-3">
              <Mark className="h-9 w-9" />
              <span>
                <p className="font-semibold">{settings.shortName}</p>
                <p className="text-[11px] tracking-[0.12em] text-paper/55">{siteNameEn}</p>
              </span>
            </div>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-paper/75">{settings.tagline}</p>
          </div>
          <div>
            <p className="text-xs font-semibold tracking-wide text-paper/50">পাতা</p>
            <ul className="mt-4 grid gap-2.5 text-sm text-paper/85">
              <li><Link href="/about" className="hover:text-white">{settings.copy.navAbout}</Link></li>
              <li><Link href="/activities" className="hover:text-white">{settings.copy.navActivities}</Link></li>
              <li><Link href="/blogs" className="hover:text-white">{settings.copy.navBlogs}</Link></li>
              <li><Link href="/notices" className="hover:text-white">{settings.copy.navNotices}</Link></li>
              <li><Link href="/donate" className="hover:text-white">{settings.copy.navDonate}</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold tracking-wide text-paper/50">যোগাযোগ</p>
            <ul className="mt-4 grid gap-2.5 text-sm text-paper/85">
              <li>{settings.address}</li>
              <li><a href={`tel:${settings.phone}`} className="hover:text-white">{settings.phone}</a></li>
              <li><a href={`mailto:${settings.email}`} className="hover:text-white">{settings.email}</a></li>
            </ul>
          </div>
        </div>
      </div>
      {settings.copy.footerNote ? <FooterCredit note={settings.copy.footerNote} /> : null}
      </div>
    </footer>
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
        <span className="text-sm font-medium tracking-[0.08em] text-paper">{name}</span>
        <span className="hidden h-px w-12 bg-gradient-to-l from-transparent to-white/30 sm:block" aria-hidden="true" />
      </p>
    </div>
  );
}
