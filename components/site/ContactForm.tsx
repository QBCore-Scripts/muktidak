"use client";

import { FormEvent, useState } from "react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus("sending");
    setError("");
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    if (!res.ok) {
      setStatus("error");
      setError(body.error || "পাঠানো যায়নি");
      return;
    }
    form.reset();
    setStatus("sent");
  }

  return (
    <form onSubmit={onSubmit} className="panel grid gap-4 rounded-2xl border border-line bg-paper p-5 md:p-6">
      <label className="grid gap-1.5 text-sm font-medium">
        নাম
        <input name="name" required autoComplete="name" className="field" />
      </label>
      <label className="grid gap-1.5 text-sm font-medium">
        ফোন
        <input name="phone" required autoComplete="tel" className="field" />
      </label>
      <label className="grid gap-1.5 text-sm font-medium">
        ইমেইল
        <input name="email" type="email" autoComplete="email" className="field" />
      </label>
      <label className="grid gap-1.5 text-sm font-medium">
        বার্তা
        <textarea name="body" required rows={5} className="field" />
      </label>
      <label className="absolute -left-[9999px]" aria-hidden="true">
        কোম্পানি
        <input name="company" tabIndex={-1} autoComplete="off" />
      </label>
      <button type="submit" disabled={status === "sending"} className="rounded-lg bg-forest px-4 py-3 text-sm font-semibold text-paper hover:bg-forest-deep disabled:opacity-60">
        {status === "sending" ? "পাঠানো হচ্ছে…" : "বার্তা পাঠান"}
      </button>
      {status === "sent" ? <p className="text-sm text-leaf">বার্তা পৌঁছেছে। দপ্তর থেকে উত্তর আসবে।</p> : null}
      {status === "error" ? <p className="text-sm text-donate">{error}</p> : null}
    </form>
  );
}
