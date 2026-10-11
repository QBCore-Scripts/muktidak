"use client";

import { FormEvent, useMemo, useState } from "react";
import { adminFetch } from "@/lib/admin-api";
import { formatDate, todayISO } from "@/lib/format";
import { postSections, type MediaItem, type Post, type PostSection } from "@/lib/types";

const sectionLabel: Record<PostSection, string> = {
  manifesto: "ঘোষণাপত্র",
  objectives: "লক্ষ্য এবং উদ্দেশ্য",
  committee: "কেন্দ্রীয় কার্যনির্বাহী সংসদ",
};

type Draft = {
  id: string | null;
  section: PostSection;
  title: string;
  body: string;
  cover: string;
  date: string;
  published: boolean;
};

function blank(section: PostSection = "manifesto"): Draft {
  return { id: null, section, title: "", body: "", cover: "", date: todayISO(), published: true };
}

function fromPost(post: Post): Draft {
  return {
    id: post.id,
    section: post.section,
    title: post.title,
    body: post.body,
    cover: post.cover,
    date: post.date,
    published: post.published,
  };
}

export function PostsView({ initial, media: initialMedia }: { initial: Post[]; media: MediaItem[] }) {
  const [rows, setRows] = useState(initial);
  const [media, setMedia] = useState(initialMedia);
  const [filter, setFilter] = useState<PostSection | "">("");
  const [draft, setDraft] = useState<Draft>(blank());
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [pending, setPending] = useState(false);

  const visible = useMemo(() => (filter ? rows.filter((item) => item.section === filter) : rows), [rows, filter]);

  function set<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
    setSaved(false);
  }

  async function load(selectId?: string | null) {
    const next = await adminFetch<Post[]>("/api/admin/posts");
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
      section: draft.section,
      title: draft.title,
      body: draft.body,
      cover: draft.cover,
      date: draft.date,
      published: draft.published,
    };
    try {
      if (draft.id) {
        await adminFetch("/api/admin/posts", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: draft.id, ...payload }),
        });
        await load(draft.id);
      } else {
        const created = await adminFetch<Post>("/api/admin/posts", {
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
    if (!confirm("এই পোস্ট মুছে ফেলবেন?")) return;
    try {
      await adminFetch(`/api/admin/posts?id=${id}`, { method: "DELETE" });
      if (draft.id === id) setDraft(blank(filter || "manifesto"));
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
          <h1 className="text-2xl font-semibold text-forest">পোস্ট</h1>
          <button
            type="button"
            className="text-sm font-medium text-leaf"
            onClick={() => {
              setDraft(blank(filter || "manifesto"));
              setSaved(false);
              setError("");
            }}
          >
            নতুন
          </button>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-muted">প্রচ্ছদের তিন কার্ডে প্রতি বিভাগের সর্বশেষ ৩টি প্রকাশিত পোস্ট দেখায়। শিরোনাম পুরোটা থাকবে, সাথে আরও পড়ুন।</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" onClick={() => setFilter("")} className={`rounded-full px-3 py-1.5 text-sm ${filter ? "border border-line bg-paper" : "bg-forest text-paper"}`}>
            সব
          </button>
          {postSections.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              className={`rounded-full px-3 py-1.5 text-sm ${filter === item ? "bg-forest text-paper" : "border border-line bg-paper"}`}
            >
              {sectionLabel[item]}
            </button>
          ))}
        </div>
        <ul className="mt-3 grid gap-2">
          {visible.length === 0 ? <li className="rounded-xl border border-dashed border-line px-3 py-4 text-sm text-muted">কোনো পোস্ট নেই।</li> : null}
          {visible.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => {
                  setDraft(fromPost(item));
                  setSaved(false);
                  setError("");
                }}
                className={`w-full rounded-xl border px-3 py-3 text-left ${draft.id === item.id ? "border-forest bg-paper" : "border-line bg-paper/70"}`}
              >
                <p className="text-sm font-medium">{item.title || "শিরোনামহীন"}</p>
                <p className="mt-1 text-xs text-muted">{[sectionLabel[item.section], formatDate(item.date), item.published ? "প্রকাশিত" : "খসড়া"].filter(Boolean).join(" · ")}</p>
              </button>
            </li>
          ))}
        </ul>
      </aside>
      <form onSubmit={save} className="grid h-fit gap-3 rounded-2xl border border-line bg-paper p-5">
        <h2 className="font-semibold">{draft.id ? "পোস্ট সম্পাদনা" : "নতুন পোস্ট"}</h2>
        <label className="grid gap-1 text-sm font-medium">
          কার্ড
          <select className="field" value={draft.section} onChange={(event) => set("section", event.target.value as PostSection)}>
            {postSections.map((item) => (
              <option key={item} value={item}>{sectionLabel[item]}</option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm font-medium">
          শিরোনাম
          <textarea className="field" rows={2} value={draft.title} onChange={(event) => set("title", event.target.value)} required />
        </label>
        <label className="grid gap-1 text-sm font-medium">
          বিস্তারিত
          <textarea className="field min-h-48" rows={10} value={draft.body} onChange={(event) => set("body", event.target.value)} />
        </label>
        <p className="text-xs text-muted">আরও পড়ুন-এ এই লেখা খুলবে। অনুচ্ছেদ আলাদা করতে এক লাইন ফাঁকা রাখুন।</p>
        <label className="grid gap-1 text-sm font-medium">
          তারিখ
          <input className="field" type="date" value={draft.date} onChange={(event) => set("date", event.target.value)} required />
        </label>
        <label className="grid gap-1 text-sm font-medium">
          ছবি
          <select className="field" value={media.some((item) => item.url === draft.cover) ? draft.cover : ""} onChange={(event) => set("cover", event.target.value)} aria-label="গ্যালারি থেকে ছবি">
            <option value="">গ্যালারি থেকে বাছাই</option>
            {media.map((item) => (
              <option key={item.id} value={item.url}>{item.name}</option>
            ))}
          </select>
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="text-sm"
            aria-label="নতুন ছবি"
            onChange={async (event) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              if (!file) return;
              const body = new FormData();
              body.set("file", file);
              body.set("folder", sectionLabel[draft.section]);
              try {
                const item = await adminFetch<MediaItem>("/api/admin/media", { method: "POST", body });
                set("cover", item.url);
                setMedia((current) => [item, ...current]);
                setError("");
              } catch (err) {
                setError(err instanceof Error ? err.message : "ছবি আপলোড হয়নি");
              }
            }}
          />
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
        {saved ? <p className="text-sm text-leaf">সংরক্ষিত। প্রচ্ছদে এই কার্ডের সর্বশেষ ৩টিতে দেখা যাবে।</p> : null}
        <div className="flex flex-wrap gap-3">
          <button disabled={pending} className="rounded-lg bg-forest px-4 py-2.5 text-sm font-semibold text-paper disabled:opacity-60">
            {pending ? "সংরক্ষণ হচ্ছে…" : "পোস্ট সংরক্ষণ"}
          </button>
          {draft.id ? (
            <button type="button" className="text-sm text-donate" onClick={() => remove(draft.id!)}>মুছুন</button>
          ) : null}
        </div>
      </form>
    </div>
  );
}
