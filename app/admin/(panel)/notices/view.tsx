"use client";

import { FormEvent, useState } from "react";
import { adminFetch } from "@/lib/admin-api";
import { formatDate } from "@/lib/format";
import type { Notice } from "@/lib/types";

export function NoticesView({ initial }: { initial: Notice[] }) {
  const [rows, setRows] = useState(initial);
  const [editing, setEditing] = useState<Notice | null>(null);
  const [error, setError] = useState("");

  async function load() {
    setRows(await adminFetch<Notice[]>("/api/admin/notices"));
  }

  async function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      await adminFetch("/api/admin/notices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, published: data.published === "on" }),
      });
      form.reset();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "ব্যর্থ");
    }
  }

  async function saveEdit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    await adminFetch("/api/admin/notices", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: editing.id, ...data, published: data.published === "on" }),
    });
    setEditing(null);
    await load();
  }

  async function toggle(item: Notice) {
    await adminFetch("/api/admin/notices", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: item.id, published: !item.published }),
    });
    await load();
  }

  async function remove(id: string) {
    if (!confirm("নোটিশ মুছে ফেলবেন?")) return;
    await adminFetch(`/api/admin/notices?id=${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1fr_320px]">
      <section>
        <h1 className="text-2xl font-semibold text-forest">নোটিশ ও ঘোষণা</h1>
        <div className="mt-5 grid gap-3">
          {rows.map((item) => (
            <article key={item.id} className="rounded-2xl border border-line bg-paper p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-semibold">{item.title}</h2>
                  <p className="mt-1 text-xs text-muted">{formatDate(item.date)} · {item.published ? "প্রকাশিত" : "খসড়া"}</p>
                </div>
                <div className="flex gap-3 text-sm">
                  <button type="button" className="text-leaf" onClick={() => setEditing(item)}>সম্পাদনা</button>
                  <button type="button" className="text-leaf" onClick={() => toggle(item)}>{item.published ? "লুকান" : "প্রকাশ"}</button>
                  <button type="button" className="text-donate" onClick={() => remove(item.id)}>মুছুন</button>
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted">{item.body}</p>
            </article>
          ))}
        </div>
      </section>
      {editing ? (
        <form key={editing.id} onSubmit={saveEdit} className="h-fit rounded-2xl border border-line bg-paper p-5">
          <h2 className="font-semibold">নোটিশ সম্পাদনা</h2>
          <div className="mt-4 grid gap-3">
            <input name="title" required defaultValue={editing.title} className="field" aria-label="শিরোনাম" />
            <textarea name="body" required rows={6} defaultValue={editing.body} className="field" aria-label="বিবরণ" />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="published" defaultChecked={editing.published} className="h-4 w-4 accent-leaf" />
              প্রকাশিত
            </label>
            <button className="rounded-lg bg-forest px-4 py-3 text-sm font-semibold text-paper">আপডেট</button>
            <button type="button" className="text-sm text-muted" onClick={() => setEditing(null)}>বাতিল</button>
          </div>
        </form>
      ) : null}
      <form onSubmit={create} className="h-fit rounded-2xl border border-line bg-paper p-5">
        <h2 className="font-semibold">নতুন নোটিশ</h2>
        <div className="mt-4 grid gap-3">
          <input name="title" required placeholder="শিরোনাম" className="field" aria-label="শিরোনাম" />
          <textarea name="body" required rows={6} placeholder="বিবরণ" className="field" aria-label="বিবরণ" />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="published" defaultChecked className="h-4 w-4 accent-leaf" />
            এখনই প্রকাশ
          </label>
          {error ? <p className="text-sm text-donate">{error}</p> : null}
          <button className="rounded-lg bg-forest px-4 py-3 text-sm font-semibold text-paper">সংরক্ষণ</button>
        </div>
      </form>
    </div>
  );
}
