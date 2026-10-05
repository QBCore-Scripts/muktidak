"use client";

import { FormEvent, useState } from "react";
import { Mark } from "@/components/site/Mark";
import { siteNameBn, siteNameEn } from "@/lib/seo";

export function LoginForm() {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    if (!res.ok) {
      setPending(false);
      setError(body.error || "প্রবেশ হয়নি");
      return;
    }
    window.location.href = "/admin";
  }

  return (
    <main className="login-stage relative grid min-h-screen place-items-center overflow-hidden px-4 py-10">
      <span className="login-wash login-wash-left" style={{ backgroundImage: "url(/history/fighters.jpg)" }} aria-hidden="true" />
      <span className="login-wash login-wash-right" style={{ backgroundImage: "url(/history/speech.jpg)" }} aria-hidden="true" />
      <span className="login-ring" aria-hidden="true">
        <span className="login-ring-inner" />
      </span>
      <form method="post" action="/admin/login" onSubmit={onSubmit} className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-black/5 bg-white shadow-[0_24px_60px_rgba(17,66,54,0.12)]">
        <div className="relative overflow-hidden bg-forest-deep px-6 py-6 text-paper">
          <span className="side-photo side-photo-deep side-photo-right" style={{ backgroundImage: "url(/history/speech.jpg)" }} aria-hidden="true" />
          <div className="relative z-10 flex items-center gap-3">
            <Mark />
            <div className="min-w-0">
              <p className="font-semibold">অ্যাডমিন প্যানেল</p>
              <p className="truncate font-heading text-base text-paper/90">{siteNameBn}</p>
              <p className="truncate text-[10px] tracking-[0.14em] text-paper/55">{siteNameEn}</p>
            </div>
          </div>
        </div>
        <div className="grid gap-4 px-6 py-6">
          <label className="grid gap-1.5 text-sm font-medium">
            ইমেইল
            <input name="email" type="email" autoComplete="username" required className="field" />
          </label>
          <label className="grid gap-1.5 text-sm font-medium">
            পাসওয়ার্ড
            <input name="password" type="password" autoComplete="current-password" required className="field" />
          </label>
          {error ? <p className="text-sm text-donate">{error}</p> : null}
          <button type="submit" disabled={pending} className="rounded-full bg-forest px-4 py-3 text-sm font-semibold text-paper disabled:opacity-60">
            {pending ? "যাচাই হচ্ছে…" : "প্রবেশ"}
          </button>
        </div>
      </form>
    </main>
  );
}
