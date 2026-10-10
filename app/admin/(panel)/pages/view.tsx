"use client";

import { FormEvent, useEffect, useState } from "react";
import { adminFetch } from "@/lib/admin-api";
import type { Activity, PageContent } from "@/lib/types";

const pageNames: Record<string, string> = {
  home: "প্রচ্ছদের নিচের লেখা",
  about: "পরিচিতি",
  vision: "ভিশন",
  activities: "কার্যক্রম",
  manifesto: "ঘোষণাপত্র",
  objectives: "লক্ষ্য এবং উদ্দেশ্য",
  committee: "কেন্দ্রীয় কার্যনির্বাহী সংসদ",
};

const requiredPages = [
  { slug: "manifesto", title: "ঘোষণাপত্র" },
  { slug: "objectives", title: "লক্ষ্য এবং উদ্দেশ্য" },
  { slug: "committee", title: "কেন্দ্রীয় কার্যনির্বাহী সংসদ" },
];

export function PagesView({ pages: initialPages, activities: initialActivities }: { pages: PageContent[]; activities: Activity[] }) {
  const [pages, setPages] = useState(initialPages);
  const [activities, setActivities] = useState(initialActivities);
  const [current, setCurrent] = useState(initialPages[0]?.id ?? "");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  async function load() {
    let pageRows = await adminFetch<PageContent[]>("/api/admin/pages");
    for (const item of requiredPages) {
      if (pageRows.some((page) => page.slug === item.slug)) continue;
      await adminFetch("/api/admin/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...item, body: "" }),
      });
    }
    if (requiredPages.some((item) => !pageRows.some((page) => page.slug === item.slug))) {
      pageRows = await adminFetch<PageContent[]>("/api/admin/pages");
    }
    const activityRows = await adminFetch<Activity[]>("/api/admin/activities");
    setPages(pageRows);
    setActivities(activityRows);
    setCurrent((value) => value || pageRows[0]?.id || "");
  }

  useEffect(() => {
    load().catch(() => setError("পাতা লোড হয়নি"));
  }, []);

  const page = pages.find((item) => item.id === current);

  async function savePage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!page) return;
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    try {
      await adminFetch("/api/admin/pages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: page.id, ...data }),
      });
      setError("");
      setSaved(true);
      await load();
    } catch (err) {
      setSaved(false);
      setError(err instanceof Error ? err.message : "সংরক্ষণ হয়নি");
    }
  }

  async function removePage(id: string) {
    try {
      await adminFetch(`/api/admin/pages?id=${id}`, { method: "DELETE" });
      setError("");
      setCurrent("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "পাতা মুছা যায়নি");
    }
  }

  async function addActivity(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    try {
      await adminFetch("/api/admin/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form).entries())),
      });
      form.reset();
      setError("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "কার্যক্রম যোগ হয়নি");
    }
  }

  async function updateActivity(event: FormEvent<HTMLFormElement>, id: string) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    try {
      await adminFetch("/api/admin/activities", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...data }),
      });
      setError("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "আপডেট হয়নি");
    }
  }

  async function removeActivity(id: string) {
    try {
      await adminFetch(`/api/admin/activities?id=${id}`, { method: "DELETE" });
      setError("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "মুছা যায়নি");
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-semibold text-forest">পেজের লেখা</h1>
      <p className="mt-2 text-sm leading-relaxed text-muted">প্রতিটি পাতার শিরোনাম ও নিচের অনুচ্ছেদ এখান থেকে বদলায়। নতুন পাতা যোগ করলে সেটি সাইটে নিজের লিংকে খুলবে এবং ফুটারে দেখা যাবে। প্রচ্ছদের ওপরের বড় লাইন «সেটিংস» থেকে।</p>
      <form
        className="mt-5 grid gap-2 rounded-2xl border border-line bg-paper p-5"
        onSubmit={async (event) => {
          event.preventDefault();
          const form = event.currentTarget;
          try {
            const created = await adminFetch<PageContent>("/api/admin/pages", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(Object.fromEntries(new FormData(form).entries())),
            });
            form.reset();
            setError("");
            setSaved(true);
            await load();
            setCurrent(created.id);
          } catch (err) {
            setSaved(false);
            setError(err instanceof Error ? err.message : "পাতা যোগ হয়নি");
          }
        }}
      >
        <h2 className="font-semibold">নতুন পাতা</h2>
        <input name="title" required placeholder="শিরোনাম" className="field" aria-label="নতুন পাতার শিরোনাম" />
        <input name="slug" required placeholder="লিংক, যেমন history" pattern="[a-z0-9-]{1,40}" className="field" aria-label="পাতার লিংক" />
        <textarea name="body" rows={4} placeholder="লেখা" className="field" aria-label="নতুন পাতার লেখা" />
        <p className="text-xs text-muted">লিংকে শুধু ইংরেজি ছোট হাতের অক্ষর, সংখ্যা ও হাইফেন। যেমন history দিলে ঠিকানা হবে /history</p>
        <button className="justify-self-start rounded-lg bg-forest px-4 py-2.5 text-sm font-semibold text-paper">পাতা যোগ</button>
      </form>
      <div className="mt-5 flex flex-wrap gap-2">
        {pages.map((item) => (
          <button key={item.id} type="button" onClick={() => { setCurrent(item.id); setSaved(false); }} className={`rounded-full px-3 py-1.5 text-sm ${item.id === current ? "bg-forest text-paper" : "bg-paper border border-line"}`}>
            {pageNames[item.slug] || item.title || item.slug}
          </button>
        ))}
      </div>
      {page ? (
        <form key={page.id} onSubmit={savePage} className="mt-5 grid gap-3 rounded-2xl border border-line bg-paper p-5">
          <label className="grid gap-1 text-sm">শিরোনাম<input name="title" defaultValue={page.title} className="field" /></label>
          <label className="grid gap-1 text-sm">লেখা
            <textarea name="body" defaultValue={page.body} rows={8} className="field" />
          </label>
          <p className="text-xs text-muted">অনুচ্ছেদ আলাদা করতে এক লাইন ফাঁকা রাখুন।</p>
          {error ? <p className="text-sm text-donate">{error}</p> : null}
          {saved ? <p className="text-sm text-leaf">সংরক্ষিত।</p> : null}
          <div className="flex gap-3">
            <button className="rounded-lg bg-forest px-4 py-2.5 text-sm font-semibold text-paper">সংরক্ষণ</button>
            {pageNames[page.slug] ? null : (
              <button type="button" className="text-sm text-donate" onClick={() => removePage(page.id)}>মুছুন</button>
            )}
          </div>
        </form>
      ) : null}
      <section className="mt-8">
        <h2 className="text-lg font-semibold">কার্যক্রম</h2>
        <ul className="mt-3 grid gap-2">
          {activities.map((item) => (
            <li key={item.id}>
              <form onSubmit={(event) => updateActivity(event, item.id)} className="grid gap-2 rounded-xl border border-line bg-paper px-4 py-3">
                <input name="title" defaultValue={item.title} className="field" aria-label="কার্যক্রমের নাম" />
                <input name="summary" defaultValue={item.summary} className="field" aria-label="বিবরণ" />
                <input name="date" defaultValue={item.date} className="field" aria-label="সময়" />
                <div className="flex gap-3 text-sm">
                  <button className="rounded-lg bg-forest px-3 py-1.5 font-medium text-paper">আপডেট</button>
                  <button type="button" className="text-donate" onClick={() => removeActivity(item.id)}>মুছুন</button>
                </div>
              </form>
            </li>
          ))}
        </ul>
        <form onSubmit={addActivity} className="mt-3 grid gap-2">
          <input name="title" required placeholder="নাম" className="field" aria-label="কার্যক্রমের নাম" />
          <input name="summary" required placeholder="সংক্ষিপ্ত বিবরণ" className="field" aria-label="বিবরণ" />
          <input name="date" placeholder="সময়, যেমন রমজান" className="field" aria-label="সময়" />
          <button className="justify-self-start rounded-lg border border-line bg-paper px-4 py-2 text-sm font-medium">কার্যক্রম যোগ</button>
        </form>
      </section>
    </div>
  );
}
