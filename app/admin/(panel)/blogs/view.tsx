"use client";

import { FormEvent, useMemo, useState } from "react";
import { adminFetch } from "@/lib/admin-api";
import { formatDate, todayISO } from "@/lib/format";
import type { BlogPost, MediaItem } from "@/lib/types";

type Draft = {
  id: string | null;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  cover: string;
  author: string;
  date: string;
  published: boolean;
};

function blank(): Draft {
  return { id: null, title: "", slug: "", excerpt: "", body: "", cover: "", author: "", date: todayISO(), published: true };
}

function fromPost(post: BlogPost): Draft {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    body: post.body,
    cover: post.cover,
    author: post.author,
    date: post.date,
    published: post.published,
  };
}

export function BlogsView({ initial, media }: { initial: BlogPost[]; media: MediaItem[] }) {
  const [rows, setRows] = useState(initial);
  const [draft, setDraft] = useState<Draft>(blank);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [pending, setPending] = useState(false);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return rows;
    return rows.filter((item) => `${item.title} ${item.slug} ${item.excerpt}`.toLowerCase().includes(needle));
  }, [rows, query]);

  function set<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
    setSaved(false);
  }

  async function load(selectId?: string | null) {
    const next = await adminFetch<BlogPost[]>("/api/admin/blogs");
    setRows(next);
    if (selectId) {
      const match = next.find((item) => item.id === selectId);
      if (match) setDraft(fromPost(match));
    }
    return next;
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");
    setSaved(false);
    const payload = {
      title: draft.title,
      slug: draft.slug,
      excerpt: draft.excerpt,
      body: draft.body,
      cover: draft.cover,
      author: draft.author,
      date: draft.date,
      published: draft.published,
    };
    try {
      if (draft.id) {
        await adminFetch("/api/admin/blogs", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: draft.id, ...payload }),
        });
        await load(draft.id);
      } else {
        const created = await adminFetch<BlogPost>("/api/admin/blogs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        await load(created.id);
      }
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "সংরক্ষণ হয়নি");
    } finally {
      setPending(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("এই লেখা মুছে ফেলবেন?")) return;
    try {
      await adminFetch(`/api/admin/blogs?id=${id}`, { method: "DELETE" });
      if (draft.id === id) setDraft(blank());
      setError("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "মুছে ফেলা যায়নি");
    }
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[280px_1fr]">
      <aside>
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold text-forest">ব্লগ</h1>
          <button type="button" className="text-sm font-medium text-leaf" onClick={() => { setDraft(blank()); setSaved(false); setError(""); }}>
            নতুন
          </button>
        </div>
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="লেখা খুঁজুন…" className="field mt-4" aria-label="লেখা খুঁজুন" />
        <ul className="mt-3 grid gap-2">
          {visible.length === 0 ? <li className="rounded-xl border border-dashed border-line px-3 py-4 text-sm text-muted">কোনো লেখা নেই।</li> : null}
          {visible.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => { setDraft(fromPost(item)); setSaved(false); setError(""); }}
                className={`w-full rounded-xl border px-3 py-3 text-left ${draft.id === item.id ? "border-forest bg-paper" : "border-line bg-paper/70"}`}
              >
                <p className="line-clamp-2 text-sm font-medium">{item.title || "শিরোনামহীন"}</p>
                <p className="mt-1 text-xs text-muted">{formatDate(item.date)} · {item.published ? "প্রকাশিত" : "খসড়া"}</p>
              </button>
            </li>
          ))}
        </ul>
      </aside>
      <form onSubmit={save} className="grid gap-3 rounded-2xl border border-line bg-paper p-5">
        <h2 className="font-semibold">{draft.id ? "লেখা সম্পাদনা" : "নতুন লেখা"}</h2>
        <label className="grid gap-1 text-sm font-medium">
          শিরোনাম
          <input className="field" value={draft.title} onChange={(event) => set("title", event.target.value)} required />
        </label>
        <label className="grid gap-1 text-sm font-medium">
          স্লাগ
          <input className="field" value={draft.slug} onChange={(event) => set("slug", event.target.value)} placeholder="field-notes — খালি রাখলে নিজে বানবে" aria-label="স্লাগ" />
        </label>
        <label className="grid gap-1 text-sm font-medium">
          সংক্ষিপ্ত
          <textarea className="field" rows={2} value={draft.excerpt} onChange={(event) => set("excerpt", event.target.value)} />
        </label>
        <label className="grid gap-1 text-sm font-medium">
          লেখা
          <textarea className="field min-h-64" rows={14} value={draft.body} onChange={(event) => set("body", event.target.value)} required />
        </label>
        <p className="text-xs text-muted">অনুচ্ছেদ আলাদা করতে এক লাইন ফাঁকা রাখুন। স্লাগে শুধু ইংরেজি ছোট হাতের অক্ষর, সংখ্যা ও হাইফেন।</p>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="grid gap-1 text-sm font-medium">
            লেখক
            <input className="field" value={draft.author} onChange={(event) => set("author", event.target.value)} placeholder="খালি রাখলে সাইটের নাম" />
          </label>
          <label className="grid gap-1 text-sm font-medium">
            তারিখ
            <input className="field" type="date" value={draft.date} onChange={(event) => set("date", event.target.value)} required />
          </label>
        </div>
        <label className="grid gap-1 text-sm font-medium">
          কভার ছবি
          <select className="field" value={media.some((item) => item.url === draft.cover) ? draft.cover : ""} onChange={(event) => set("cover", event.target.value)} aria-label="গ্যালারি থেকে কভার">
            <option value="">গ্যালারি থেকে বাছাই</option>
            {media.map((item) => (
              <option key={item.id} value={item.url}>{item.name}</option>
            ))}
          </select>
          <input className="field" value={draft.cover} onChange={(event) => set("cover", event.target.value)} placeholder="/media/eid.svg" aria-label="কভার ঠিকানা" />
        </label>
        {draft.cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={draft.cover} alt="" className="h-40 w-full rounded-xl object-cover" />
        ) : null}
        <label className="flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" checked={draft.published} onChange={(event) => set("published", event.target.checked)} className="h-4 w-4 accent-leaf" />
          প্রকাশ করুন
        </label>
        {error ? <p className="text-sm text-donate">{error}</p> : null}
        {saved ? <p className="text-sm text-leaf">সংরক্ষিত।</p> : null}
        <div className="flex flex-wrap gap-3">
          <button disabled={pending} className="rounded-lg bg-forest px-4 py-2.5 text-sm font-semibold text-paper disabled:opacity-60">
            {pending ? "সংরক্ষণ হচ্ছে…" : "লেখা সংরক্ষণ"}
          </button>
          {draft.id ? (
            <button type="button" className="text-sm text-donate" onClick={() => remove(draft.id!)}>মুছুন</button>
          ) : null}
        </div>
      </form>
    </div>
  );
}
