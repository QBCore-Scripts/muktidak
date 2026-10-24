"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { applicationCopy, applicationStatusLabel, digitsOnly, memberLabel } from "@/lib/application";
import { adminFetch } from "@/lib/admin-api";
import { formatDate } from "@/lib/format";
import { applicationStatuses, type Application, type ApplicationStatus } from "@/lib/types";

export function ApplicationsView({ initial }: { initial: Application[] }) {
  const [rows, setRows] = useState(initial);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<ApplicationStatus | "all">("all");
  const [open, setOpen] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState("");
  const router = useRouter();

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const qDigits = digitsOnly(query);
    return rows.filter((item) => {
      if (filter !== "all" && item.status !== filter) return false;
      if (!q) return true;
      const text = [item.formNo, item.nameBn, item.nameEn, item.mobile, item.nid, item.district, item.upazila, item.desiredPost]
        .join(" ")
        .toLowerCase();
      if (text.includes(q)) return true;
      return qDigits.length >= 3 && (String(item.mobile ?? "").includes(qDigits) || String(item.nid ?? "").includes(qDigits));
    });
  }, [rows, query, filter]);

  async function load() {
    setRows(await adminFetch<Application[]>("/api/admin/applications"));
  }

  async function save(item: Application, status: ApplicationStatus, note: string) {
    setPending(item.id);
    try {
      await adminFetch("/api/admin/applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id, status, note }),
      });
      setError("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "সংরক্ষণ হয়নি");
    } finally {
      setPending("");
    }
  }

  async function remove(id: string) {
    if (!confirm("এই আবেদন মুছে ফেলবেন? ফরম আর ছবি দুটোই চলে যাবে।")) return;
    setPending(id);
    try {
      await adminFetch(`/api/admin/applications?id=${id}`, { method: "DELETE" });
      setError("");
      if (open === id) setOpen("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "মুছে ফেলা যায়নি");
    } finally {
      setPending("");
    }
  }

  const fresh = rows.filter((item) => item.status === "new").length;

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-forest">আবেদন ফরম</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
            যোগ দিন থেকে জমা হওয়া সব আবেদন। খুলে তথ্য দেখুন, অবস্থা বদলান, আর ফরম ডাউনলোড করুন।
          </p>
        </div>
        <button type="button" onClick={() => downloadCsv(router, setError)} className="rounded-full bg-forest px-4 py-2 text-sm font-medium text-paper">
          সব তথ্য CSV
        </button>
      </div>
      <p className="mt-4 text-sm text-forest">
        মোট {bn(rows.length)} · নতুন {bn(fresh)}
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="নাম, ফোন, এনআইডি, জেলা বা ফরম নং"
          className="field"
        />
        <select value={filter} onChange={(event) => setFilter(event.target.value as ApplicationStatus | "all")} className="field sm:w-44">
          <option value="all">সব অবস্থা</option>
          {applicationStatuses.map((status) => (
            <option key={status} value={status}>{applicationStatusLabel[status]}</option>
          ))}
        </select>
      </div>
      {error ? <p className="mt-3 text-sm text-donate">{error}</p> : null}
      {visible.length === 0 ? <p className="mt-6 text-sm text-muted">কোনো আবেদন নেই।</p> : null}
      <ul className="mt-5 grid gap-3">
        {visible.map((item) => (
          <li key={item.id} className="rounded-2xl border border-line bg-paper">
            <button
              type="button"
              className="grid w-full gap-3 px-4 py-4 text-left sm:grid-cols-[4.5rem_1fr_auto] sm:items-center"
              aria-expanded={open === item.id}
              onClick={() => setOpen((current) => (current === item.id ? "" : item.id))}
            >
              <span className="grid h-16 w-14 place-items-center overflow-hidden rounded-xl bg-cream text-[10px] text-muted">
                {item.photoStored ? (
                  <Image src={`/api/admin/application-photo/${item.id}`} alt="" width={56} height={64} unoptimized className="h-full w-full object-cover" />
                ) : (
                  "ছবি নেই"
                )}
              </span>
              <span className="min-w-0">
                <span className="block font-medium text-forest">{item.nameBn} · {item.formNo}</span>
                <span className="mt-1 block truncate text-sm text-muted">
                  {item.desiredPost} · {item.district} · {item.mobile}
                </span>
              </span>
              <span className="flex flex-wrap items-center gap-2 text-xs">
                <Status status={applicationStatuses.includes(item.status) ? item.status : "new"} />
                <span className="text-muted">{formatDate(item.date)}</span>
              </span>
            </button>
            {open === item.id ? (
              <Detail key={`${item.id}:${item.status}:${item.note}`} item={item} pending={pending === item.id} onSave={save} onRemove={remove} />
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Detail({
  item,
  pending,
  onSave,
  onRemove,
}: {
  item: Application;
  pending: boolean;
  onSave: (item: Application, status: ApplicationStatus, note: string) => void;
  onRemove: (id: string) => void;
}) {
  const [status, setStatus] = useState<ApplicationStatus>(applicationStatuses.includes(item.status) ? item.status : "new");
  const [note, setNote] = useState(item.note || "");
  const facts: [string, string][] = [
    ["ইংরেজি নাম", item.nameEn],
    ["প্রত্যাশিত পদ", item.desiredPost],
    ["জাতীয় পরিচয়পত্র", item.nid],
    ["শিক্ষা", item.education],
    ["পেশা", item.occupation],
    ["মোবাইল", item.mobile],
    ["জেলা/মহানগর", item.district],
    ["উপজেলা/থানা", item.upazila],
    ["স্থায়ী ঠিকানা", item.address],
    ["নতুন সদস্য", memberLabel(item.newMember)],
    ["পূর্ববর্তী বা বর্তমান পদ", item.previousPost],
    [applicationCopy.role, item.roleAfter],
    [applicationCopy.cases, item.cases],
    [applicationCopy.mujib, item.mujibRole],
    ["স্বাক্ষর", item.signature],
  ];
  return (
    <div className="border-t border-line px-4 py-4">
      <dl className="grid gap-3 sm:grid-cols-2">
        {facts.map(([label, value]) => (
          <div key={label} className={value.length > 80 ? "sm:col-span-2" : ""}>
            <dt className="text-xs text-muted">{label}</dt>
            <dd className="whitespace-pre-wrap text-sm leading-relaxed">{value}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-4 grid gap-3 sm:grid-cols-[12rem_1fr]">
        <label className="grid gap-1 text-sm font-medium">
          অবস্থা
          <select value={status} onChange={(event) => setStatus(event.target.value as ApplicationStatus)} className="field">
            {applicationStatuses.map((value) => (
              <option key={value} value={value}>{applicationStatusLabel[value]}</option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm font-medium">
          অফিস নোট
          <textarea value={note} onChange={(event) => setNote(event.target.value)} rows={2} className="field min-h-20" />
        </label>
      </div>
      <div className="mt-4 flex flex-wrap gap-3 text-sm">
        <button
          type="button"
          disabled={pending}
          onClick={() => onSave(item, status, note)}
          className="rounded-lg bg-forest px-4 py-2 font-medium text-paper disabled:opacity-60"
        >
          সংরক্ষণ
        </button>
        <Link href={`/admin/form/${item.id}`} target="_blank" className="rounded-lg border border-line px-4 py-2 font-medium">
          ফরম ডাউনলোড
        </Link>
        <button type="button" disabled={pending} onClick={() => onRemove(item.id)} className="text-donate">
          মুছুন
        </button>
      </div>
    </div>
  );
}

function Status({ status }: { status: ApplicationStatus }) {
  const tone = status === "accepted" ? "bg-moss text-forest" : status === "rejected" ? "bg-warn text-donate" : "bg-cream text-forest";
  return <span className={`rounded-full px-2.5 py-1 font-medium ${tone}`}>{applicationStatusLabel[status]}</span>;
}

async function downloadCsv(router: { push: (href: string) => void }, setError: (value: string) => void) {
  try {
    const res = await fetch("/api/admin/applications-export");
    if (res.status === 401) {
      router.push("/admin/login");
      return;
    }
    if (!res.ok) {
      setError("তথ্য ডাউনলোড হয়নি");
      return;
    }
    setError("");
    const url = URL.createObjectURL(await res.blob());
    const link = document.createElement("a");
    link.href = url;
    link.download = "muktidak-applications.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1500);
  } catch {
    setError("তথ্য ডাউনলোড হয়নি");
  }
}

function bn(value: number) {
  return new Intl.NumberFormat("bn-BD").format(value);
}
