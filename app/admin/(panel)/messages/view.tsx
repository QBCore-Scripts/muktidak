"use client";

import { useState } from "react";
import { adminFetch } from "@/lib/admin-api";
import { formatDate } from "@/lib/format";
import type { Message } from "@/lib/types";

export function MessagesView({ initial }: { initial: Message[] }) {
  const [rows, setRows] = useState(initial);
  const [error, setError] = useState("");

  async function load() {
    setRows(await adminFetch<Message[]>("/api/admin/messages"));
  }

  async function toggle(item: Message) {
    try {
      await adminFetch("/api/admin/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id, read: !item.read }),
      });
      setError("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "অবস্থা বদলানো যায়নি");
    }
  }

  async function remove(id: string) {
    if (!confirm("এই বার্তা মুছে ফেলবেন?")) return;
    try {
      await adminFetch(`/api/admin/messages?id=${id}`, { method: "DELETE" });
      setError("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "মুছে ফেলা যায়নি");
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-semibold text-forest">যোগাযোগের বার্তা</h1>
      <p className="mt-2 text-sm text-muted">সাইটের যোগাযোগ ফর্ম থেকে আসা বার্তা। এখান থেকে পড়া ও মুছে ফেলা যায়।</p>
      {error ? <p className="mt-3 text-sm text-donate">{error}</p> : null}
      {rows.length === 0 ? <p className="mt-6 text-sm text-muted">এখনো কোনো বার্তা নেই।</p> : null}
      <ul className="mt-5 grid gap-3">
        {rows.map((item) => (
          <li key={item.id} className="rounded-2xl border border-line bg-paper px-4 py-4 text-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-medium">{item.name} · {item.phone}</p>
              <p className="text-xs text-muted">{formatDate(item.date)} · {item.read ? "পঠিত" : "নতুন"}</p>
            </div>
            {item.email ? <p className="mt-1 text-muted">{item.email}</p> : null}
            <p className="mt-3 whitespace-pre-wrap leading-relaxed">{item.body}</p>
            <div className="mt-3 flex gap-3">
              <button type="button" className="text-leaf" onClick={() => toggle(item)}>{item.read ? "অপঠিত" : "পঠিত"}</button>
              <button type="button" className="text-donate" onClick={() => remove(item.id)}>মুছুন</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
