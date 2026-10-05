"use client";

import Link from "next/link";
import { useState } from "react";
import { adminFetch } from "@/lib/admin-api";
import { formatBdt, formatDate } from "@/lib/format";
import type { Donation, Message } from "@/lib/types";

type Dash = {
  members: number;
  activeMembers: number;
  donationTotal: number;
  monthTotal: number;
  donations: Donation[];
  messages: Message[];
};

export function DashboardView({ initial }: { initial: Dash }) {
  const [data, setData] = useState(initial);
  const [error, setError] = useState("");

  async function markRead(id: string) {
    await adminFetch("/api/admin/messages", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, read: true }),
    });
    setData((current) =>
      current
        ? { ...current, messages: current.messages.map((item) => (item.id === id ? { ...item, read: true } : item)) }
        : current,
    );
  }

  const stats = [
    [formatBdt(data.donationTotal), "মোট গৃহীত দান"],
    [formatBdt(data.monthTotal), "এই মাসের দান"],
    [new Intl.NumberFormat("bn-BD").format(data.activeMembers), "সক্রিয় সদস্য"],
    [new Intl.NumberFormat("bn-BD").format(data.members), "মোট সদস্য"],
  ];

  return (
    <div className="mx-auto max-w-6xl">
      <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-donate">আজকের হিসাব</p>
      <h1 className="mt-1 text-3xl font-semibold text-forest">ড্যাশবোর্ড</h1>
      {error ? <p className="mt-3 text-sm text-donate">{error}</p> : null}
      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(([value, label], index) => (
          <article key={label} className="rounded-2xl border border-line bg-paper p-5 shadow-[0_8px_24px_rgba(17,66,54,0.04)]">
            <p className={`text-2xl font-semibold ${index === 0 ? "text-donate" : "text-forest"}`}>{value}</p>
            <p className="mt-1 text-sm text-muted">{label}</p>
          </article>
        ))}
      </div>
      <section className="mt-8 overflow-hidden rounded-2xl border border-line bg-paper">
        <h2 className="border-b border-line px-5 py-4 font-semibold">সাম্প্রতিক দান</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="text-muted">
              <tr>
                <th className="px-5 py-3 font-medium">দাতা</th>
                <th className="px-5 py-3 font-medium">উদ্দেশ্য</th>
                <th className="px-5 py-3 font-medium">পরিমাণ</th>
                <th className="px-5 py-3 font-medium">অবস্থা</th>
              </tr>
            </thead>
            <tbody>
              {data.donations.map((item) => (
                <tr key={item.id} className="border-t border-line">
                  <td className="px-5 py-3">{item.donor}</td>
                  <td className="px-5 py-3">{item.purpose}</td>
                  <td className="px-5 py-3">{formatBdt(item.amount)}</td>
                  <td className="px-5 py-3">
                    <Status ok={item.status === "received"} on="গৃহীত" off="অপেক্ষমাণ" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="mt-6 rounded-2xl border border-line bg-paper p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-semibold">যোগাযোগের বার্তা</h2>
          <Link href="/admin/messages" className="text-sm font-medium text-leaf">সব বার্তা</Link>
        </div>
        {data.messages.length === 0 ? <p className="mt-3 text-sm text-muted">এখনো কোনো বার্তা নেই।</p> : null}
        <ul className="mt-3 grid gap-3">
          {data.messages.map((item) => (
            <li key={item.id} className="rounded-xl border border-line px-4 py-3 text-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-medium">{item.name} · {item.phone}</p>
                <p className="text-xs text-muted">{formatDate(item.date)}</p>
              </div>
              <p className="mt-2 leading-relaxed">{item.body}</p>
              {!item.read ? (
                <button type="button" onClick={() => markRead(item.id)} className="mt-2 text-sm font-medium text-leaf">পঠিত</button>
              ) : (
                <p className="mt-2 text-xs text-muted">পঠিত</p>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Status({ ok, on, off }: { ok: boolean; on: string; off: string }) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${ok ? "bg-moss text-forest" : "bg-warn text-donate"}`}>
      {ok ? on : off}
    </span>
  );
}
