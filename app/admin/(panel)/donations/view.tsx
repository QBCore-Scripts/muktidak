"use client";

import { FormEvent, useState } from "react";
import { adminFetch } from "@/lib/admin-api";
import { formatBdt, formatDate } from "@/lib/format";
import type { Donation } from "@/lib/types";

const emptyDonation = { donor: "", phone: "", amount: "", purpose: "", method: "ব্যাংক", status: "received" as Donation["status"], date: "" };

export function DonationsView({ initial }: { initial: Donation[] }) {
  const [rows, setRows] = useState(initial);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(emptyDonation);

  async function load() {
    setRows(await adminFetch<Donation[]>("/api/admin/donations"));
  }

  function edit(item: Donation) {
    setEditing(item.id);
    setForm({
      donor: item.donor,
      phone: item.phone,
      amount: String(item.amount),
      purpose: item.purpose,
      method: item.method,
      status: item.status,
      date: item.date,
    });
    setError("");
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    const body = {
      donor: form.donor,
      phone: form.phone,
      amount: Number(form.amount),
      purpose: form.purpose,
      method: form.method,
      status: form.status,
      ...(form.date ? { date: form.date } : {}),
    };
    try {
      if (editing) {
        await adminFetch("/api/admin/donations", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editing, ...body }),
        });
      } else {
        await adminFetch("/api/admin/donations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }
      setForm(emptyDonation);
      setEditing(null);
      setError("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "ব্যর্থ");
    }
  }

  async function toggle(item: Donation) {
    await adminFetch("/api/admin/donations", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: item.id, status: item.status === "received" ? "pending" : "received" }),
    });
    await load();
  }

  async function remove(id: string) {
    if (!confirm("এই দান মুছে ফেলবেন?")) return;
    await adminFetch(`/api/admin/donations?id=${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-2xl font-semibold text-forest">দান ব্যবস্থাপনা</h1>
      <form onSubmit={save} className="mt-6 grid gap-3 rounded-2xl border border-line bg-paper p-4 md:grid-cols-3">
        <input value={form.donor} onChange={(event) => setForm({ ...form, donor: event.target.value })} required placeholder="দাতার নাম" className="field" aria-label="দাতার নাম" />
        <input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} placeholder="ফোন" className="field" aria-label="ফোন" />
        <input value={form.amount} onChange={(event) => setForm({ ...form, amount: event.target.value })} required type="number" min="0" placeholder="পরিমাণ" className="field" aria-label="পরিমাণ" />
        <input value={form.purpose} onChange={(event) => setForm({ ...form, purpose: event.target.value })} required placeholder="উদ্দেশ্য" className="field" aria-label="উদ্দেশ্য" />
        <select value={form.method} onChange={(event) => setForm({ ...form, method: event.target.value })} className="field" aria-label="মাধ্যম">
          {["ব্যাংক", "বিকাশ", "নগদ", "হাতে"].concat(form.method && !["ব্যাংক", "বিকাশ", "নগদ", "হাতে"].includes(form.method) ? [form.method] : []).map((method) => (
            <option key={method}>{method}</option>
          ))}
        </select>
        <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value === "pending" ? "pending" : "received" })} className="field" aria-label="অবস্থা">
          <option value="received">গৃহীত</option>
          <option value="pending">অপেক্ষমাণ</option>
        </select>
        <input value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} type="date" className="field" aria-label="তারিখ" />
        <div className="flex items-center gap-3 md:col-span-3">
          <button className="rounded-lg bg-forest px-4 py-2.5 text-sm font-semibold text-paper">{editing ? "দান আপডেট" : "দান যোগ"}</button>
          {editing ? (
            <button type="button" className="text-sm text-muted" onClick={() => { setEditing(null); setForm(emptyDonation); }}>বাতিল</button>
          ) : null}
        </div>
      </form>
      {error ? <p className="mt-3 text-sm text-donate">{error}</p> : null}
      <div className="mt-4 overflow-x-auto rounded-2xl border border-line bg-paper">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">দাতা</th>
              <th className="px-4 py-3 font-medium">উদ্দেশ্য</th>
              <th className="px-4 py-3 font-medium">মাধ্যম</th>
              <th className="px-4 py-3 font-medium">তারিখ</th>
              <th className="px-4 py-3 font-medium">পরিমাণ</th>
              <th className="px-4 py-3 font-medium">অবস্থা</th>
              <th className="px-4 py-3 font-medium">কাজ</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((item) => (
              <tr key={item.id} className="border-t border-line">
                <td className="px-4 py-3">{item.donor}</td>
                <td className="px-4 py-3">{item.purpose}</td>
                <td className="px-4 py-3">{item.method}</td>
                <td className="px-4 py-3">{formatDate(item.date)}</td>
                <td className="px-4 py-3">{formatBdt(item.amount)}</td>
                <td className="px-4 py-3">{item.status === "received" ? "গৃহীত" : "অপেক্ষমাণ"}</td>
                <td className="px-4 py-3">
                  <button type="button" onClick={() => edit(item)} className="mr-3 text-leaf">সম্পাদনা</button>
                  <button type="button" onClick={() => toggle(item)} className="mr-3 text-leaf">অবস্থা</button>
                  <button type="button" onClick={() => remove(item.id)} className="text-donate">মুছুন</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
