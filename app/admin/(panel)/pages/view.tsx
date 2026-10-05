"use client";

import { FormEvent, useState } from "react";
import { adminFetch } from "@/lib/admin-api";
import type { Activity, PageContent } from "@/lib/types";

export function PagesView({ pages: initialPages, activities: initialActivities }: { pages: PageContent[]; activities: Activity[] }) {
  const [pages, setPages] = useState(initialPages);
  const [activities, setActivities] = useState(initialActivities);
  const [current, setCurrent] = useState(initialPages[0]?.id ?? "");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  async function load() {
    const [pageRows, activityRows] = await Promise.all([
      adminFetch<PageContent[]>("/api/admin/pages"),
      adminFetch<Activity[]>("/api/admin/activities"),
    ]);
    setPages(pageRows);
    setActivities(activityRows);
    setCurrent((value) => value || pageRows[0]?.id || "");
  }

  const page = pages.find((item) => item.id === current);

  async function savePage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!page) return;
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    await adminFetch("/api/admin/pages", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: page.id, ...data }),
    });
    setSaved(true);
    await load();
  }

  async function addActivity(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    await adminFetch("/api/admin/activities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(new FormData(form).entries())),
    });
    form.reset();
    await load();
  }

  async function updateActivity(event: FormEvent<HTMLFormElement>, id: string) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    await adminFetch("/api/admin/activities", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...data }),
    });
    await load();
  }

  async function removeActivity(id: string) {
    await adminFetch(`/api/admin/activities?id=${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-semibold text-forest">পেজ কনটেন্ট</h1>
      <div className="mt-5 flex flex-wrap gap-2">
        {pages.map((item) => (
          <button key={item.id} type="button" onClick={() => { setCurrent(item.id); setSaved(false); }} className={`rounded-full px-3 py-1.5 text-sm ${item.id === current ? "bg-forest text-paper" : "bg-paper border border-line"}`}>
            {item.slug}
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
          <button className="justify-self-start rounded-lg bg-forest px-4 py-2.5 text-sm font-semibold text-paper">সংরক্ষণ</button>
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
