"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Mark } from "@/components/site/Mark";
import { siteNameEn } from "@/lib/seo";

const links = [
  ["/admin", "ড্যাশবোর্ড"],
  ["/admin/members", "সদস্য"],
  ["/admin/donations", "দান"],
  ["/admin/accounts", "অ্যাকাউন্ট"],
  ["/admin/notices", "নোটিশ"],
  ["/admin/blogs", "ব্লগ"],
  ["/admin/pages", "পেজ"],
  ["/admin/media", "গ্যালারি"],
  ["/admin/districts", "জেলা"],
  ["/admin/messages", "বার্তা"],
  ["/admin/settings", "সেটিংস"],
];

export function AdminShell({ email, children }: { email: string; children: React.ReactNode }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const current = links.find(([href]) => (href === "/admin" ? path === href : path.startsWith(href)))?.[1] ?? "অ্যাডমিন";

  async function logout() {
    await fetch("/api/auth", { method: "DELETE" });
    window.location.href = "/admin/login";
  }

  const nav = (
    <nav className="grid gap-1" aria-label="অ্যাডমিন মেনু">
      {links.map(([href, label]) => {
        const active = href === "/admin" ? path === href : path.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            className={`rounded-full px-3.5 py-2 text-sm transition-colors ${active ? "bg-white/15 font-medium text-white" : "text-white/70 hover:bg-white/10 hover:text-white"}`}
            aria-current={active ? "page" : undefined}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-cream md:grid md:grid-cols-[272px_1fr]">
      <aside className="relative hidden min-h-screen flex-col overflow-hidden bg-forest-deep px-4 py-6 text-paper md:flex">
        <span className="side-photo side-photo-deep side-photo-left" style={{ backgroundImage: "url(/history/speech.jpg)" }} aria-hidden="true" />
        <span className="side-photo side-photo-deep side-photo-right" style={{ backgroundImage: "url(/history/fighters.jpg)" }} aria-hidden="true" />
        <div className="relative z-10 flex items-center gap-3 px-2">
          <Mark className="h-10 w-10" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">অ্যাডমিন প্যানেল</p>
            <p className="truncate text-[10px] tracking-[0.12em] text-paper/55">{siteNameEn}</p>
          </div>
        </div>
        <div className="relative z-10 mt-8 flex-1">{nav}</div>
        <div className="relative z-10 mt-6 rounded-2xl border border-white/10 bg-white/5 p-3">
          <p className="truncate text-xs text-paper/70">{email}</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Link href="/" className="rounded-full px-3 py-2 text-center text-xs text-paper/80 hover:bg-white/10">
              সাইট
            </Link>
            <button type="button" onClick={logout} className="rounded-full px-3 py-2 text-xs text-paper/80 hover:bg-white/10">
              প্রস্থান
            </button>
          </div>
        </div>
      </aside>
      <div className="admin-canvas min-w-0">
        <div className="admin-bar sticky top-0 z-20 flex items-center justify-between border-b border-line bg-paper/90 px-4 py-3 backdrop-blur-md md:px-8">
          <div className="min-w-0">
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-muted">মুক্তির ডাক-৭১</p>
            <p className="truncate text-sm font-semibold text-forest">{current}</p>
          </div>
          <button
            type="button"
            className="rounded-full border border-line px-3 py-1.5 text-sm md:hidden"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? "বন্ধ" : "মেনু"}
          </button>
        </div>
        {open ? (
          <div className="admin-menu bg-forest-deep px-4 py-4 text-paper md:hidden">
            {nav}
            <button type="button" onClick={logout} className="mt-3 px-3 text-sm text-white/80">
              প্রস্থান
            </button>
          </div>
        ) : null}
        <div className="admin-main px-4 py-6 md:px-8 md:py-8">{children}</div>
      </div>
    </div>
  );
}
