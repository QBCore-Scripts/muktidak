"use client";

import { FormEvent, useState } from "react";
import { adminFetch } from "@/lib/admin-api";
import type { Campaign, CampaignImage, CampaignSpot, MediaItem } from "@/lib/types";

type Draft = {
  id: string | null;
  spot: CampaignSpot;
  slug: string;
  title: string;
  intro: string;
  lead: string;
  place: string;
  host: string;
  demands: string;
  images: CampaignImage[];
  published: boolean;
};

const spotLabel: Record<CampaignSpot, string> = {
  banner: "প্রচ্ছদের বড় ব্যানার",
  highlight: "হাইলাইট স্লাইড",
};

function blank(): Draft {
  return { id: null, spot: "banner", slug: "", title: "", intro: "", lead: "", place: "", host: "", demands: "", images: [], published: true };
}

function fromCampaign(item: Campaign): Draft {
  return {
    id: item.id,
    spot: item.spot,
    slug: item.slug,
    title: item.title,
    intro: item.intro,
    lead: item.lead,
    place: item.place,
    host: item.host,
    demands: item.demands,
    images: item.images.map((image) => ({ url: image.url, alt: image.alt })),
    published: item.published,
  };
}

export function CampaignsView({ initial, media: initialMedia }: { initial: Campaign[]; media: MediaItem[] }) {
  const [rows, setRows] = useState(initial);
  const [media, setMedia] = useState(initialMedia);
  const [draft, setDraft] = useState<Draft>(initial[0] ? fromCampaign(initial[0]) : blank());
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [saved, setSaved] = useState(false);

  function set<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
    setSaved(false);
  }

  function setImage(index: number, patch: Partial<CampaignImage>) {
    setDraft((current) => ({
      ...current,
      images: current.images.map((image, imageIndex) => (imageIndex === index ? { ...image, ...patch } : image)),
    }));
    setSaved(false);
  }

  function addImage(url: string, alt = "") {
    if (!url || draft.images.some((image) => image.url === url) || draft.images.length >= 8) return;
    set("images", [...draft.images, { url, alt }]);
  }

  function moveImage(index: number, direction: -1 | 1) {
    const next = index + direction;
    if (next < 0 || next >= draft.images.length) return;
    const images = [...draft.images];
    const [item] = images.splice(index, 1);
    images.splice(next, 0, item);
    set("images", images);
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    setSaved(false);
    try {
      const body = {
        spot: draft.spot,
        slug: draft.slug,
        title: draft.title,
        intro: draft.intro,
        lead: draft.lead,
        place: draft.place,
        host: draft.host,
        demands: draft.demands,
        images: draft.images,
        published: draft.published,
      };
      if (draft.id) {
        await adminFetch("/api/admin/campaigns", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: draft.id, ...body }),
        });
      } else {
        const created = await adminFetch<Campaign>("/api/admin/campaigns", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        setDraft(fromCampaign(created));
      }
      const next = await adminFetch<Campaign[]>("/api/admin/campaigns");
      setRows(next);
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "সংরক্ষণ হয়নি");
    } finally {
      setPending(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("এই কর্মসূচি সাইট থেকে মুছে ফেলবেন?")) return;
    await adminFetch(`/api/admin/campaigns?id=${id}`, { method: "DELETE" });
    const next = await adminFetch<Campaign[]>("/api/admin/campaigns");
    setRows(next);
    setDraft(next[0] ? fromCampaign(next[0]) : blank());
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[280px_1fr]">
      <aside>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold text-forest">কর্মসূচি</h1>
          <button type="button" className="text-sm text-leaf" onClick={() => { setDraft(blank()); setSaved(false); setError(""); }}>
            নতুন
          </button>
        </div>
        <p className="mb-4 text-xs leading-relaxed text-muted">প্রচ্ছদের ব্যানার ও হাইলাইট স্লাইড এখান থেকে বদলানো, লুকানো বা মুছে ফেলা যায়। যোগ দিন বোতামের লেখা সেটিংসে আছে।</p>
        <ul className="grid gap-2">
          {rows.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => { setDraft(fromCampaign(item)); setSaved(false); setError(""); }}
                className={`w-full rounded-2xl border px-3 py-3 text-left ${draft.id === item.id ? "border-leaf bg-white" : "border-line bg-paper"}`}
              >
                <p className="text-sm font-medium">{spotLabel[item.spot]}</p>
                <p className="mt-1 line-clamp-2 text-xs text-muted">{item.title || "শিরোনামহীন"}</p>
                <p className="mt-1 text-xs text-muted">{item.published ? "প্রকাশিত" : "লুকানো"} · /campaign/{item.slug}</p>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <form onSubmit={save} className="grid h-fit gap-3 rounded-2xl border border-line bg-paper p-5">
        <h2 className="font-semibold">{draft.id ? "কর্মসূচি সম্পাদনা" : "নতুন কর্মসূচি"}</h2>
        <label className="grid gap-1 text-sm font-medium">
          প্রচ্ছদে জায়গা
          <select className="field" value={draft.spot} onChange={(event) => set("spot", event.target.value as CampaignSpot)}>
            <option value="banner">প্রচ্ছদের বড় ব্যানার</option>
            <option value="highlight">হাইলাইট স্লাইড — ৩ সেকেন্ডে বদলায়</option>
          </select>
        </label>
        <label className="grid gap-1 text-sm font-medium">
          কার্ডের লেখা
          <textarea className="field" rows={3} required value={draft.title} onChange={(event) => set("title", event.target.value)} />
        </label>
        <label className="grid gap-1 text-sm font-medium">
          ভেতরের পাতার বড় শিরোনাম
          <textarea className="field" rows={3} value={draft.intro} onChange={(event) => set("intro", event.target.value)} placeholder="খালি থাকলে কার্ডের লেখাই শিরোনাম হবে" />
        </label>
        <label className="grid gap-1 text-sm font-medium">
          মূল কথা
          <textarea className="field" rows={4} value={draft.lead} onChange={(event) => set("lead", event.target.value)} />
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-sm font-medium">
            স্থান
            <input className="field" value={draft.place} onChange={(event) => set("place", event.target.value)} />
          </label>
          <label className="grid gap-1 text-sm font-medium">
            আয়োজনে
            <input className="field" value={draft.host} onChange={(event) => set("host", event.target.value)} />
          </label>
        </div>
        <label className="grid gap-1 text-sm font-medium">
          দাবি — প্রতি লাইনে একটি
          <textarea className="field min-h-40" rows={8} value={draft.demands} onChange={(event) => set("demands", event.target.value)} />
        </label>
        <label className="grid gap-1 text-sm font-medium">
          লিংক
          <input className="field" value={draft.slug} onChange={(event) => set("slug", event.target.value)} placeholder="char-dofa" aria-label="লিংক" />
        </label>
        <p className="text-xs text-muted">খালি রাখলে নতুন কর্মসূচির লিংক নিজে তৈরি হবে। লিংক বদলালে পুরনো ঠিকানা বন্ধ হয়।</p>

        <div className="grid gap-3">
          <p className="text-sm font-medium">ছবি</p>
          {draft.images.map((image, index) => (
            <div key={`${image.url}-${index}`} className="grid gap-2 rounded-xl border border-line p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image.url} alt="" className="h-36 w-full rounded-lg object-cover" />
              <input className="field" value={image.alt} aria-label="ছবির বিবরণ" placeholder="ছবির বিবরণ" onChange={(event) => setImage(index, { alt: event.target.value })} />
              <div className="flex flex-wrap gap-3 text-sm">
                <button type="button" className="text-leaf" onClick={() => moveImage(index, -1)}>উপরে</button>
                <button type="button" className="text-leaf" onClick={() => moveImage(index, 1)}>নিচে</button>
                <button type="button" className="text-donate" onClick={() => set("images", draft.images.filter((_, imageIndex) => imageIndex !== index))}>ছবি মুছুন</button>
              </div>
            </div>
          ))}
          <select
            className="field"
            value=""
            aria-label="গ্যালারি থেকে ছবি"
            onChange={(event) => {
              addImage(event.target.value);
              event.target.value = "";
            }}
          >
            <option value="">গ্যালারি থেকে যোগ</option>
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
              body.set("folder", "কর্মসূচি");
              try {
                const item = await adminFetch<MediaItem>("/api/admin/media", { method: "POST", body });
                addImage(item.url, item.name);
                setMedia((current) => [item, ...current]);
                setError("");
              } catch (err) {
                setError(err instanceof Error ? err.message : "ছবি আপলোড হয়নি");
              }
            }}
          />
          <p className="text-xs text-muted">একাধিক ছবি থাকলে স্লাইড হবে এবং ৩ সেকেন্ড পর পর বদলাবে। ছবির ক্রম উপরে-নিচে দিয়ে বদলানো যায়।</p>
        </div>

        <label className="flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" checked={draft.published} onChange={(event) => set("published", event.target.checked)} className="h-4 w-4 accent-leaf" />
          সাইটে দেখাও
        </label>
        <p className="text-xs text-muted">লুকালে বা মুছলে প্রচ্ছদ থেকে উঠে যাবে। হাইলাইট সরিয়ে ফেললে আগের কার্ড ফিরে আসে।</p>
        {error ? <p className="text-sm text-donate">{error}</p> : null}
        {saved ? <p className="text-sm text-leaf">সংরক্ষিত।</p> : null}
        <div className="flex flex-wrap gap-3">
          <button disabled={pending} className="rounded-lg bg-forest px-4 py-2.5 text-sm font-semibold text-paper disabled:opacity-60">
            {pending ? "সংরক্ষণ হচ্ছে…" : "সংরক্ষণ"}
          </button>
          {draft.id ? (
            <button type="button" className="text-sm text-donate" onClick={() => remove(draft.id!)}>মুছুন</button>
          ) : null}
        </div>
      </form>
    </div>
  );
}
