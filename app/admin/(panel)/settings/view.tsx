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
      ["footerAlt", "ফুটারে নামের নিচের লাইন"],
      ["footerPagesTitle", "ফুটার — পাতার শিরোনাম"],
      ["footerContactTitle", "ফুটার — যোগাযোগের শিরোনাম"],
      ["footerLinks", "ফুটার লিংক — প্রতি লাইনে নাম | /পথ। খালি রাখলে মেনু থেকে আসে। লুকাতে: লুকান | /পথ", true],
      ["footerNote", "ফুটার নোট"],
      ["flavorLine", "পাতার ছোট লাইন"],
    ],
  },
  {
    title: "প্রচ্ছদের ওপরের অংশ",
    fields: [
      ["homeDate", "প্রচ্ছদের ছোট লাইন"],
      ["heroTitle", "বড় শিরোনাম", true],
      ["heroPhilosophy", "সবুজ লাইন"],
      ["homeFreedom", "প্রচ্ছদের ব্যাখ্যা", true],
      ["heroPillars", "চার মূলনীতি — প্রতি লাইনে একটি", true],
      ["homeDonate", "প্রচ্ছদের দান বোতাম"],
      ["homeAbout", "প্রচ্ছদের পরিচিতি বোতাম"],
      ["linkManifesto", "কার্ড: ঘোষণাপত্র"],
      ["linkObjectives", "কার্ড: লক্ষ্য এবং উদ্দেশ্য"],
      ["linkCommittee", "কার্ড: কেন্দ্রীয় কার্যনির্বাহী সংসদ"],
      ["highlightKicker", "হাইলাইট ১ — ছোট লাইন (তারিখ)"],
      ["highlightOne", "হাইলাইট ১ — বড় লাইন", true],
      ["highlightTwo", "হাইলাইট ২", true],
      ["highlightThree", "হাইলাইট ৩"],
      ["heroVideo", "ইউটিউব ভিডিও কোড"],
    ],
  },
  {
    title: "প্রচ্ছদের নিচের অংশ",
    fields: [
      ["homeWorkTitle", "কর্মসূচির শিরোনাম"],
      ["homeNoticeTitle", "নোটিশের শিরোনাম"],
      ["homeNoticesLink", "নোটিশ — সব দেখুন"],
      ["homeBlogTitle", "ব্লগের শিরোনাম"],
      ["homeBlogsLink", "ব্লগ — সব লেখা"],
      ["homeNote", "নোটিশ বক্সের নিচের নোট", true],
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
      ["quoteLabel", "পরিচিতির উক্তির ছোট শিরোনাম"],
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
    ["name", "সাইটের নাম (হেডারে)"],
    ["shortName", "সংক্ষিপ্ত নাম (ফুটারে)"],
    ["tagline", "ফুটারের ছোট বিবরণ"],
    ["quote", "পরিচিতি পাতার উক্তি"],
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
        এখান থেকে নাম, লোগো, মেনু, প্রচ্ছদের বড় লেখা, দান, গ্যালারি, নোটিশ, জেলা ও ফুটার বদলায়। পাতার লম্বা লেখা «পেজ» থেকে। নোটিশ, ব্লগ, ছবি, সদস্য, দান, অ্যাকাউন্ট ও জেলা নিজ নিজ মেনু থেকে। বদলানোর পর নিচে «সংরক্ষণ করুন» চাপুন।
      </p>
      <label className="grid gap-1 text-sm font-medium">
        অ্যাডমিন ইমেইল
        <input className="field" type="email" value={adminEmail} onChange={(event) => setAdminEmail(event.target.value)} autoComplete="username" />
      </label>
      <p className="text-xs text-muted">ইমেইল বা পাসওয়ার্ড বদলালে আবার প্রবেশ করতে হবে। তখন বর্তমান পাসওয়ার্ড দিন।</p>
      <fieldset className="grid gap-3 rounded-2xl border border-line bg-paper p-4">
        <legend className="px-1 text-sm font-semibold">লোগো</legend>
        <p className="text-xs leading-relaxed text-muted">হেডার, ফুটার, প্রচ্ছদ, ফ্যাভিকনের জায়গায় সাইটের লোগো। নতুন ছবি বাছলে আগে আপলোড হবে, তারপর নিচে সংরক্ষণ চাপুন। খালি রাখলে আগের লোগো থাকে।</p>
        <img src={current.logoUrl || "/logo.png"} alt="" className="h-20 w-20 rounded-xl bg-forest object-contain" />
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          className="text-sm"
          onChange={async (event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            if (!file) return;
            const body = new FormData();
            body.set("file", file);
            body.set("folder", "লোগো");
            try {
              const item = await adminFetch<{ url: string }>("/api/admin/media", { method: "POST", body });
              setSettings({ ...current, logoUrl: item.url });
              setError("");
              setMessage("লোগো বসানো হয়েছে। এখন সংরক্ষণ করুন।");
            } catch (err) {
              setMessage("");
              setError(err instanceof Error ? err.message : "লোগো আপলোড হয়নি");
            }
          }}
        />
      </fieldset>
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
                <textarea className="field" rows={key === "visionPoints" || key === "footerLinks" ? 8 : 3} value={current.copy[key]} onChange={(e) => setCopy(key, e.target.value)} />
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
