"use client";

import { FormEvent, useState } from "react";
import { adminFetch } from "@/lib/admin-api";
import type { BankAccount } from "@/lib/types";

const empty = {
  bank: "",
  branch: "",
  accountName: "বাংলাদেশ মুক্তির ডাক-৭১",
  accountNumber: "",
  accountType: "সঞ্চয়ী",
  visible: true,
};

export function AccountsView({ initial }: { initial: BankAccount[] }) {
  const [rows, setRows] = useState(initial);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function load() {
    setRows(await adminFetch<BankAccount[]>("/api/admin/accounts"));
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    try {
      if (editing) {
        await adminFetch("/api/admin/accounts", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editing, ...form }),
        });
      } else {
        await adminFetch("/api/admin/accounts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      }
      setForm(empty);
      setEditing(null);
      setError("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "ব্যর্থ");
    }
  }

  async function toggle(item: BankAccount) {
    await adminFetch("/api/admin/accounts", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: item.id, visible: !item.visible }),
    });
    await load();
  }

  async function remove(id: string) {
    if (!confirm("এই অ্যাকাউন্ট মুছে ফেলবেন?")) return;
    await adminFetch(`/api/admin/accounts?id=${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1fr_340px]">
      <section>
        <h1 className="text-2xl font-semibold text-forest">দান অ্যাকাউন্ট</h1>
        <div className="mt-5 grid gap-3">
          {rows.map((item) => (
            <article key={item.id} className="rounded-2xl border border-line bg-paper p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-semibold">{item.bank} — {item.branch}</h2>
                  <p className="mt-1 text-sm text-muted">{item.accountName}</p>
                  <p className="mt-1 text-sm tracking-wide">{item.accountNumber}</p>
                  <p className="mt-1 text-xs text-muted">{item.accountType}</p>
                </div>
                <div className="flex gap-2 text-sm">
                  <button type="button" className="text-leaf" onClick={() => { setEditing(item.id); setForm(item); }}>সম্পাদনা</button>
                  <button type="button" className="text-donate" onClick={() => remove(item.id)}>মুছুন</button>
                </div>
              </div>
              <label className="mt-3 flex items-center justify-between gap-3 text-sm">
                দান পেজে দেখান
                <input type="checkbox" checked={item.visible} onChange={() => toggle(item)} className="h-5 w-5 accent-leaf" />
              </label>
            </article>
          ))}
        </div>
      </section>
      <form onSubmit={save} className="h-fit rounded-2xl border border-line bg-paper p-5">
        <h2 className="font-semibold">{editing ? "অ্যাকাউন্ট সম্পাদনা" : "নতুন অ্যাকাউন্ট"}</h2>
        <div className="mt-4 grid gap-3">
          <label className="grid gap-1 text-sm">ব্যাংক<input className="field" value={form.bank} onChange={(e) => setForm({ ...form, bank: e.target.value })} required /></label>
          <label className="grid gap-1 text-sm">শাখা<input className="field" value={form.branch} onChange={(e) => setForm({ ...form, branch: e.target.value })} required /></label>
          <label className="grid gap-1 text-sm">অ্যাকাউন্টের নাম<input className="field" value={form.accountName} onChange={(e) => setForm({ ...form, accountName: e.target.value })} required /></label>
          <label className="grid gap-1 text-sm">নম্বর<input className="field" value={form.accountNumber} onChange={(e) => setForm({ ...form, accountNumber: e.target.value })} required /></label>
          <label className="grid gap-1 text-sm">ধরন
            <select className="field" value={form.accountType} onChange={(e) => setForm({ ...form, accountType: e.target.value })}>
              <option>সঞ্চয়ী</option>
              <option>চলতি</option>
            </select>
          </label>
          <label className="flex items-center justify-between text-sm">
            দান পেজে দেখান
            <input type="checkbox" checked={form.visible} onChange={(e) => setForm({ ...form, visible: e.target.checked })} className="h-5 w-5 accent-leaf" />
          </label>
          {error ? <p className="text-sm text-donate">{error}</p> : null}
          <button className="rounded-lg bg-forest px-4 py-3 text-sm font-semibold text-paper">অ্যাকাউন্ট সংরক্ষণ করুন</button>
          {editing ? (
            <button type="button" className="text-sm text-muted" onClick={() => { setEditing(null); setForm(empty); }}>বাতিল</button>
          ) : null}
        </div>
      </form>
    </div>
  );
}
