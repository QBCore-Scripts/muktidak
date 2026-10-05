"use client";

import { FormEvent, useState } from "react";
import { adminFetch } from "@/lib/admin-api";
import type { SiteCopy } from "@/lib/copy";
import type { Settings } from "@/lib/types";

type TextKey = Exclude<keyof Settings, "copy">;
type CopyField = [keyof SiteCopy, string, boolean?];

const groups: { title: string; fields: CopyField[] }[] = [
  {
    title: "মেনু",
    fields: [
      ["navHome", "প্রচ্ছদ"],
      ["navAbout", "পরিচিতি"],
      ["navVision", "ভিশন"],
      ["navActivities", "কার্যক্রম"],
      ["navGallery", "গ্যালারি"],
      ["navNotices", "নোটিশ"],
      ["navBlogs", "ব্লগ"],
      ["navDistricts", "জেলা"],
      ["navContact", "যোগাযোগ"],
      ["navDonate", "দান বোতাম"],
    ],
  },
  {
    title: "হেডার ও ফুটার",
    fields: [
      ["headerLine", "হেডারের লাইন"],
      ["footerLine", "ফুটারের লাইন"],
      ["footerNote", "ফুটার নোট"],
      ["flavorLine", "পাতার ছোট লাইন"],
    ],
  },
  {
    title: "প্রচ্ছদ",
    fields: [
      ["homeDate", "তারিখ"],
      ["homeFreedom", "মুক্তির লাইন"],
      ["quoteLabel", "উক্তির শিরোনাম"],
      ["homeDonate", "দান বোতাম"],
      ["homeAbout", "পরিচিতি বোতাম"],
      ["homeWorkTitle", "কাজের শিরোনাম"],
      ["homeNoticeTitle", "নোটিশের শিরোনাম"],
      ["homeNoticesLink", "সব দেখুন"],
      ["homeBlogTitle", "ব্লগের শিরোনাম"],
      ["homeBlogsLink", "সব লেখা"],
      ["homeNote", "নিচের নোট", true],
    ],
  },
  {
    title: "অন্য পাতা",
    fields: [
      ["donateKicker", "দান — ছোট শিরোনাম"],
      ["donateTitle", "দান — শিরোনাম"],
      ["donateText", "দান — ভূমিকা", true],
      ["donateNote", "দান — নিচের নোট", true],
      ["galleryKicker", "গ্যালারি — ছোট শিরোনাম"],
      ["galleryTitle", "গ্যালারি — শিরোনাম"],
      ["galleryText", "গ্যালারি — ভূমিকা", true],
      ["noticesKicker", "নোটিশ — ছোট শিরোনাম"],
      ["noticesTitle", "নোটিশ — শিরোনাম"],
      ["noticesText", "নোটিশ — ভূমিকা", true],
      ["blogsKicker", "ব্লগ — ছোট শিরোনাম"],
      ["blogsTitle", "ব্লগ — শিরোনাম"],
      ["blogsText", "ব্লগ — ভূমিকা", true],
      ["districtsKicker", "জেলা — ছোট শিরোনাম"],
      ["districtsTitle", "জেলা — শিরোনাম"],
      ["districtsText", "জেলা — ভূমিকা", true],
      ["contactKicker", "যোগাযোগ — ছোট শিরোনাম"],
      ["contactTitle", "যোগাযোগ — শিরোনাম"],
      ["contactOffice", "দপ্তরের শিরোনাম"],
      ["visionKicker", "ভিশন — ছোট শিরোনাম"],
      ["activitiesKicker", "কার্যক্রম — ছোট শিরোনাম"],
      ["visionPoints", "ভিশনের বক্স (শিরোনাম, পরের লাইনে বিবরণ, মাঝে ফাঁকা লাইন)", true],
    ],
  },
];

export function SettingsView({ initial, email }: { initial: Settings; email: string }) {
  const [settings, setSettings] = useState(initial);
  const [adminEmail, setAdminEmail] = useState(email);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!settings) return;
    const form = new FormData(event.currentTarget);
    try {
      const result = await adminFetch<{ ok: boolean; signedOut?: boolean }>("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          settings,
          adminEmail,
          currentPassword: form.get("currentPassword"),
          newPassword: form.get("newPassword"),
        }),
      });
      if (result.signedOut) {
        window.location.href = "/admin/login";
        return;
      }
      setError("");
      setMessage("সংরক্ষিত।");
    } catch (err) {
      setMessage("");
      setError(err instanceof Error ? err.message : "ব্যর্থ");
    }
  }

  const current = settings;

  const fields: [TextKey, string][] = [
    ["name", "সাইটের নাম"],
    ["shortName", "সংক্ষিপ্ত নাম"],
    ["tagline", "ট্যাগলাইন"],
    ["quote", "উক্তি"],
    ["phone", "ফোন"],
    ["email", "ইমেইল"],
    ["address", "ঠিকানা"],
  ];

  function setCopy(key: keyof SiteCopy, value: string) {
    setSettings({ ...current, copy: { ...current.copy, [key]: value } });
  }

  return (
    <form onSubmit={save} className="mx-auto grid max-w-2xl gap-4">
      <h1 className="text-2xl font-semibold text-forest">সেটিংস</h1>
      <p className="text-sm leading-relaxed text-muted">
        এখান থেকে সাইটের নাম, মেনু, প্রচ্ছদ, দান, গ্যালারি, নোটিশ, জেলা ও ফুটারের লেখা বদলায়। পাতার মূল লেখা «পেজ কনটেন্ট» থেকে, নোটিশ/ছবি/সদস্য/দান/অ্যাকাউন্ট/জেলা নিজ নিজ মেনু থেকে।
      </p>
      <label className="grid gap-1 text-sm font-medium">
        অ্যাডমিন ইমেইল
        <input className="field" type="email" value={adminEmail} onChange={(event) => setAdminEmail(event.target.value)} autoComplete="username" />
      </label>
      <p className="text-xs text-muted">ইমেইল বা পাসওয়ার্ড বদলালে আবার প্রবেশ করতে হবে। তখন বর্তমান পাসওয়ার্ড দিন।</p>
      {fields.map(([key, label]) => (
        <label key={key} className="grid gap-1 text-sm font-medium">
          {label}
          {key === "tagline" || key === "quote" || key === "address" ? (
            <textarea className="field" rows={3} value={current[key]} onChange={(e) => setSettings({ ...current, [key]: e.target.value })} />
          ) : (
            <input className="field" value={current[key]} onChange={(e) => setSettings({ ...current, [key]: e.target.value })} />
          )}
        </label>
      ))}
      {groups.map((group) => (
        <fieldset key={group.title} className="grid gap-3 rounded-2xl border border-line bg-paper p-4">
          <legend className="px-1 text-sm font-semibold">{group.title}</legend>
          {group.fields.map(([key, label, long]) => (
            <label key={key} className="grid gap-1 text-sm font-medium">
              {label}
              {long ? (
                <textarea className="field" rows={key === "visionPoints" ? 8 : 3} value={current.copy[key]} onChange={(e) => setCopy(key, e.target.value)} />
              ) : (
                <input className="field" value={current.copy[key]} onChange={(e) => setCopy(key, e.target.value)} />
              )}
            </label>
          ))}
        </fieldset>
      ))}
      <fieldset className="grid gap-3 rounded-2xl border border-line bg-paper p-4">
        <legend className="px-1 text-sm font-semibold">পাসওয়ার্ড বদল</legend>
        <input name="currentPassword" type="password" placeholder="বর্তমান পাসওয়ার্ড" className="field" autoComplete="current-password" />
        <input name="newPassword" type="password" placeholder="নতুন পাসওয়ার্ড, অন্তত ১২ অক্ষর (খালি রাখলে বদলাবে না)" className="field" autoComplete="new-password" />
      </fieldset>
      {message ? <p className="text-sm text-leaf">{message}</p> : null}
      {error ? <p className="text-sm text-donate">{error}</p> : null}
      <button className="justify-self-start rounded-lg bg-forest px-4 py-3 text-sm font-semibold text-paper">সংরক্ষণ করুন</button>
    </form>
  );
}
