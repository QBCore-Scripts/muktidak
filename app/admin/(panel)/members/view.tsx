"use client";

import { FormEvent, useState } from "react";
import { adminFetch } from "@/lib/admin-api";
import type { Member } from "@/lib/types";

const roles = ["সদস্য", "সমন্বয়ক", "স্বেচ্ছাসেবক"];

const emptyMember = { name: "", phone: "", district: "", role: "সদস্য", status: "active" as Member["status"], joined: "" };

export function MembersView({ initial }: { initial: Member[] }) {
  const [rows, setRows] = useState(initial);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(emptyMember);

  async function load() {
    setRows(await adminFetch<Member[]>("/api/admin/members"));
  }

  function edit(member: Member) {
    setEditing(member.id);
    setForm({
      name: member.name,
      phone: member.phone,
      district: member.district,
      role: member.role,
      status: member.status,
      joined: member.joined,
    });
    setError("");
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    const payload = form.joined ? form : { name: form.name, phone: form.phone, district: form.district, role: form.role, status: form.status };
    try {
      if (editing) {
        await adminFetch("/api/admin/members", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editing, ...payload }),
        });
      } else {
        await adminFetch("/api/admin/members", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      setForm(emptyMember);
      setEditing(null);
      setError("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "ব্যর্থ");
    }
  }

  async function toggle(member: Member) {
    try {
      await adminFetch("/api/admin/members", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: member.id, status: member.status === "active" ? "inactive" : "active" }),
      });
      setError("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "অবস্থা বদলানো যায়নি");
    }
  }

  async function remove(id: string) {
    if (!confirm("এই সদস্য মুছে ফেলবেন?")) return;
    await adminFetch(`/api/admin/members?id=${id}`, { method: "DELETE" });
    await load();
  }

  const visible = rows.filter((item) => `${item.name} ${item.district} ${item.phone}`.includes(query.trim()));

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-2xl font-semibold text-forest">সদস্য ব্যবস্থাপনা</h1>
      <form onSubmit={save} className="mt-6 grid gap-3 rounded-2xl border border-line bg-paper p-4 md:grid-cols-4">
        <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required placeholder="নাম" className="field" aria-label="নাম" />
        <input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} required placeholder="ফোন" className="field" aria-label="ফোন" />
        <input value={form.district} onChange={(event) => setForm({ ...form, district: event.target.value })} required placeholder="জেলা" className="field" aria-label="জেলা" />
        <select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })} className="field" aria-label="ভূমিকা">
          {(roles.includes(form.role) ? roles : [form.role, ...roles]).map((role) => (
            <option key={role}>{role}</option>
          ))}
        </select>
        {editing ? (
          <>
            <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value === "inactive" ? "inactive" : "active" })} className="field" aria-label="অবস্থা">
              <option value="active">সক্রিয়</option>
              <option value="inactive">নিষ্ক্রিয়</option>
            </select>
            <input value={form.joined} onChange={(event) => setForm({ ...form, joined: event.target.value })} type="date" className="field" aria-label="যোগদানের তারিখ" />
          </>
        ) : null}
        <div className="flex items-center gap-3 md:col-span-4">
          <button className="rounded-lg bg-forest px-4 py-2.5 text-sm font-semibold text-paper">{editing ? "সদস্য আপডেট" : "সদস্য যোগ"}</button>
          {editing ? (
            <button type="button" className="text-sm text-muted" onClick={() => { setEditing(null); setForm(emptyMember); }}>বাতিল</button>
          ) : null}
        </div>
      </form>
      {error ? <p className="mt-3 text-sm text-donate">{error}</p> : null}
      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="নাম, ফোন বা জেলা…" className="field mt-4 max-w-sm" aria-label="সদস্য খুঁজুন" />
      <div className="mt-4 overflow-x-auto rounded-2xl border border-line bg-paper">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">নাম</th>
              <th className="px-4 py-3 font-medium">ফোন</th>
              <th className="px-4 py-3 font-medium">জেলা</th>
              <th className="px-4 py-3 font-medium">ভূমিকা</th>
              <th className="px-4 py-3 font-medium">অবস্থা</th>
              <th className="px-4 py-3 font-medium">কাজ</th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-muted">এই ছাঁকনিতে কোনো সদস্য নেই।</td>
              </tr>
            ) : null}
            {visible.map((item) => (
              <tr key={item.id} className="border-t border-line">
                <td className="px-4 py-3">{item.name}</td>
                <td className="px-4 py-3">{item.phone}</td>
                <td className="px-4 py-3">{item.district}</td>
                <td className="px-4 py-3">{item.role}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${item.status === "active" ? "bg-moss text-forest" : "bg-warn text-donate"}`}>
                    {item.status === "active" ? "সক্রিয়" : "নিষ্ক্রিয়"}
                  </span>
                </td>
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
