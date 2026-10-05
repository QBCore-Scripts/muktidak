"use client";

import { FormEvent, useState } from "react";
import { adminFetch } from "@/lib/admin-api";
import type { District } from "@/lib/types";

export function DistrictsView({ initial }: { initial: District[] }) {
  const [rows, setRows] = useState(initial);
  const [editing, setEditing] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function load() {
    setRows(await adminFetch<District[]>("/api/admin/districts"));
  }

  async function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    try {
      await adminFetch("/api/admin/districts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form).entries())),
      });
      form.reset();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "ব্যর্থ");
    }
  }

  async function update(event: FormEvent<HTMLFormElement>, id: string) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    await adminFetch("/api/admin/districts", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...data }),
    });
    setEditing(null);
    await load();
  }

  async function remove(id: string) {
    if (!confirm("দপ্তর মুছে ফেলবেন?")) return;
    await adminFetch(`/api/admin/districts?id=${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-2xl font-semibold text-forest">জেলা ও দপ্তর</h1>
      <form onSubmit={create} className="mt-6 grid gap-3 rounded-2xl border border-line bg-paper p-4 md:grid-cols-3">
        <input name="name" required placeholder="জেলা" className="field" aria-label="জেলা" />
        <input name="office" required placeholder="দপ্তর" className="field" aria-label="দপ্তর" />
        <input name="contact" required placeholder="দায়িত্বে" className="field" aria-label="দায়িত্বে" />
        <input name="phone" required placeholder="ফোন" className="field" aria-label="ফোন" />
        <input name="members" type="number" min="0" placeholder="সদস্য" className="field" aria-label="সদস্য" />
        <button className="rounded-lg bg-forest px-4 py-2.5 text-sm font-semibold text-paper">দপ্তর যোগ</button>
      </form>
      {error ? <p className="mt-3 text-sm text-donate">{error}</p> : null}
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {rows.map((item) => (
          <article key={item.id} className="rounded-2xl border border-line bg-paper p-4">
            {editing === item.id ? (
              <form onSubmit={(event) => update(event, item.id)} className="grid gap-2">
                <input name="name" defaultValue={item.name} className="field" aria-label="জেলা" />
                <input name="office" defaultValue={item.office} className="field" aria-label="দপ্তর" />
                <input name="contact" defaultValue={item.contact} className="field" aria-label="দায়িত্বে" />
                <input name="phone" defaultValue={item.phone} className="field" aria-label="ফোন" />
                <input name="members" type="number" min="0" defaultValue={item.members} className="field" aria-label="সদস্য" />
                <div className="flex gap-3 text-sm">
                  <button className="rounded-lg bg-forest px-3 py-1.5 font-medium text-paper">আপডেট</button>
                  <button type="button" className="text-muted" onClick={() => setEditing(null)}>বাতিল</button>
                </div>
              </form>
            ) : (
              <>
            <div className="flex justify-between gap-3">
              <h2 className="font-semibold">{item.name}</h2>
              <div className="flex gap-3 text-sm">
                <button type="button" className="text-leaf" onClick={() => setEditing(item.id)}>সম্পাদনা</button>
                <button type="button" className="text-donate" onClick={() => remove(item.id)}>মুছুন</button>
              </div>
            </div>
            <p className="mt-1 text-sm text-muted">{item.office}</p>
            <p className="mt-3 text-sm">{item.contact} · {item.phone}</p>
            <p className="text-sm text-muted">{item.members} সদস্য</p>
              </>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
