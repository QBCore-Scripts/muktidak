"use client";

import { FormEvent, useMemo, useState } from "react";
import { adminFetch } from "@/lib/admin-api";
import { formatSize } from "@/lib/format";
import type { MediaItem } from "@/lib/types";

export function MediaView({ initial }: { initial: MediaItem[] }) {
  const [rows, setRows] = useState(initial);
  const [query, setQuery] = useState("");
  const [folder, setFolder] = useState("সব");
  const [newFolder, setNewFolder] = useState("");
  const [error, setError] = useState("");

  async function load() {
    setRows(await adminFetch<MediaItem[]>("/api/admin/media"));
  }

  const folders = useMemo(() => ["সব", ...new Set(["কার্যক্রম", "অনুষ্ঠান", "ব্লগ", ...rows.map((item) => item.folder)].filter(Boolean))], [rows]);
  const visible = rows.filter((item) => {
    const matchesFolder = folder === "সব" || item.folder === folder;
    return matchesFolder && item.name.toLowerCase().includes(query.trim().toLowerCase());
  });

  async function upload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    if (newFolder.trim()) data.set("folder", newFolder.trim());
    const res = await fetch("/api/admin/media", { method: "POST", body: data });
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    if (!res.ok) {
      setError(body.error || "আপলোড হয়নি");
      return;
    }
    form.reset();
    setNewFolder("");
    setError("");
    await load();
  }

  async function toggle(item: MediaItem) {
    await adminFetch("/api/admin/media", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: item.id, private: !item.private }),
    });
    await load();
  }

  async function remove(id: string) {
    if (!confirm("ফাইল তালিকা থেকে সরাতে চান?")) return;
    await adminFetch(`/api/admin/media?id=${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-forest">ছবি ও ক্যাটাগরি</h1>
        <form onSubmit={upload} className="flex flex-wrap items-center gap-2">
          <select name="folder" className="field w-40" aria-label="ক্যাটাগরি" defaultValue="কার্যক্রম">
            {folders.filter((item) => item !== "সব").map((item) => <option key={item}>{item}</option>)}
          </select>
          <input value={newFolder} onChange={(e) => setNewFolder(e.target.value)} placeholder="নতুন ক্যাটাগরি" className="field w-44" aria-label="নতুন ক্যাটাগরি" />
          <input name="file" type="file" accept="image/*" required className="text-sm" aria-label="ছবি" />
          <label className="flex items-center gap-1 text-sm">
            <input type="checkbox" name="private" value="true" /> সুরক্ষিত
          </label>
          <button className="rounded-lg bg-forest px-4 py-2.5 text-sm font-semibold text-paper">আপলোড</button>
        </form>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="ফাইলের নাম দিয়ে খুঁজুন…" className="field max-w-md" aria-label="ফাইল খুঁজুন" />
        <select value={folder} onChange={(e) => setFolder(e.target.value)} className="field w-40" aria-label="ফোল্ডার ছাঁকনি">
          {folders.map((item) => <option key={item}>{item}</option>)}
        </select>
      </div>
      {error ? <p className="mt-3 text-sm text-donate">{error}</p> : null}
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((item) => (
          <article key={item.id} className="overflow-hidden rounded-2xl border border-line bg-paper">
            {item.url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.url} alt="" className="h-36 w-full object-cover" />
            ) : (
              <div className="h-36 bg-moss" />
            )}
            <div className="px-4 py-3 text-sm">
              <form
                className="grid gap-2"
                onSubmit={async (event) => {
                  event.preventDefault();
                  const data = Object.fromEntries(new FormData(event.currentTarget).entries());
                  try {
                    await adminFetch("/api/admin/media", {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ id: item.id, name: data.name, folder: data.folder }),
                    });
                    setError("");
                    await load();
                  } catch (err) {
                    setError(err instanceof Error ? err.message : "নাম বদলানো যায়নি");
                  }
                }}
              >
                <input name="name" defaultValue={item.name} className="field" aria-label="ফাইলের নাম" />
                <input name="folder" defaultValue={item.folder} className="field" aria-label="ক্যাটাগরি" list="media-categories" />
                <button className="justify-self-start text-sm font-medium text-leaf">নাম সংরক্ষণ</button>
              </form>
              <p className="mt-2 text-muted">{formatSize(item.size)}{item.private ? " · সুরক্ষিত" : ""}</p>
              <div className="mt-2 flex gap-3">
                <button type="button" className="text-leaf" onClick={() => toggle(item)}>{item.private ? "প্রকাশ" : "সুরক্ষিত করুন"}</button>
                <button type="button" className="text-donate" onClick={() => remove(item.id)}>মুছুন</button>
              </div>
            </div>
          </article>
        ))}
      </div>
      <datalist id="media-categories">
        {folders.filter((item) => item !== "সব").map((item) => <option key={item} value={item} />)}
      </datalist>
      <p className="mt-6 rounded-xl bg-warn px-4 py-3 text-sm leading-relaxed text-donate">
        NID স্ক্যান এই গ্যালারিতে রাখবেন না। সুরক্ষিত চিহ্ন দিলেও ফাইল সার্ভারে থাকে — সংবেদনশীল নথি আলাদা সংরক্ষণ করুন। পাবলিক গ্যালারিতে শুধু অ-সুরক্ষিত ছবি দেখা যায়।
      </p>
    </div>
  );
}
