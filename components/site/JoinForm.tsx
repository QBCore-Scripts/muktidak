"use client";

import Image from "next/image";
import { FormEvent, useRef, useState, type InputHTMLAttributes } from "react";
import { applicationCopy } from "@/lib/application";
import { FormLeaders } from "@/components/site/FormLeaders";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const field = "field text-base";

export function JoinForm({ logo }: { logo: string }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");
  const [formNo, setFormNo] = useState("");
  const [preview, setPreview] = useState("");
  const sending = useRef(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending.current) return;
    const form = event.currentTarget;
    const photo = form.elements.namedItem("photo");
    if (photo instanceof HTMLInputElement && photo.files?.[0] && photo.files[0].size > 1_500_000) {
      setStatus("error");
      setError("ছবি ১.৫ মেগাবাইটের কম দিন");
      return;
    }
    sending.current = true;
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/join", { method: "POST", body: new FormData(form) });
      const body = (await res.json().catch(() => ({}))) as { error?: string; formNo?: string };
      if (!res.ok || !body.formNo) {
        setStatus("error");
        setError(body.error || "আবেদন জমা হয়নি");
        return;
      }
      form.reset();
      setPreview((current) => {
        if (current) URL.revokeObjectURL(current);
        return "";
      });
      setFormNo(body.formNo);
      setStatus("sent");
    } catch {
      setStatus("error");
      setError("আবেদন জমা হয়নি। আবার চেষ্টা করুন।");
    } finally {
      sending.current = false;
    }
  }

  if (status === "sent") {
    return (
      <section className="mx-auto max-w-3xl px-4 py-10 md:py-14">
        <div className="rounded-3xl border border-line bg-paper px-5 py-10 text-center md:px-10">
          <p className="text-sm font-medium text-leaf">আবেদন জমা হয়েছে</p>
          <h2 className="mt-3 font-heading text-3xl text-forest md:text-4xl">ফরম নং {formNo}</h2>
          <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-muted">
            আপনার তথ্য কেন্দ্রীয় দপ্তরে পৌঁছেছে। যাচাই শেষে যোগাযোগ করা হবে। এই ফরম নম্বরটি রেখে দিন।
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-8 md:py-12">
        <form onSubmit={onSubmit} className="relative overflow-hidden rounded-3xl border border-line bg-paper shadow-[0_18px_50px_rgba(17,66,54,0.06)]">
        <FormLeaders />
        <div className="flex items-center gap-4 bg-forest px-5 py-5 text-paper md:px-8">
          <Image src={logo} alt="" width={56} height={56} unoptimized className="h-14 w-14 shrink-0 rounded-full bg-paper object-contain p-1" />
          <div className="min-w-0">
            <p className="text-sm text-paper/75">{applicationCopy.org}</p>
            <h2 className="font-heading text-xl leading-snug md:text-2xl">{applicationCopy.title}</h2>
          </div>
        </div>
        <div className="grid gap-5 px-5 py-6 md:px-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <div className="grid flex-1 gap-5">
              <Field label="নাম (বাংলায়)" name="nameBn" autoComplete="off" required />
              <Field label="নাম (ইংরেজিতে)" name="nameEn" autoComplete="off" required lang="en" spellCheck={false} />
              <Field label="প্রত্যাশিত পদের নাম" name="desiredPost" required />
            </div>
            <label className="order-first mx-auto grid w-36 shrink-0 gap-2 text-sm font-medium sm:order-last">
              পদপ্রার্থীর ছবি
              <span
                className="relative grid aspect-[3/4] place-items-center overflow-hidden rounded-2xl border border-dashed border-forest/30 bg-white bg-cover bg-center text-center text-xs leading-snug text-muted"
                style={preview ? { backgroundImage: `url("${preview}")` } : undefined}
              >
                {preview ? "" : "jpg, png বা webp"}
                <input
                  name="photo"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="absolute inset-0 cursor-pointer opacity-0"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    setPreview((current) => {
                      if (current) URL.revokeObjectURL(current);
                      return file ? URL.createObjectURL(file) : "";
                    });
                  }}
                />
              </span>
            </label>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="জাতীয় পরিচয়পত্র নং" name="nid" inputMode="numeric" required />
            <Field label="শিক্ষাগত যোগ্যতা" name="education" required />
            <Field label="পেশা" name="occupation" required />
            <Field label="মোবাইল" name="mobile" autoComplete="tel" inputMode="tel" required />
            <Field label="জেলা/মহানগর" name="district" required />
            <Field label="উপজেলা/থানা" name="upazila" required />
          </div>
          <label className="grid gap-2 text-sm font-medium">
            স্থায়ী ঠিকানা
            <textarea name="address" required rows={3} autoComplete="street-address" className={cn(field, "min-h-24")} />
          </label>
          <fieldset className="grid gap-3">
            <legend className="text-sm font-medium">আপনি কি নতুন সদস্য?</legend>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input type="radio" name="newMember" value="yes" required className="size-4 accent-forest" /> হ্যাঁ
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="radio" name="newMember" value="no" className="size-4 accent-forest" /> না
              </label>
            </div>
          </fieldset>
          <Field label="বাংলাদেশ মুক্তির ডাক-৭১ এর পূর্ববর্তী অথবা বর্তমান পদ" name="previousPost" required placeholder="না থাকলে লিখুন: নেই" />
          <label className="grid gap-2 text-sm font-medium leading-relaxed">
            {applicationCopy.role}
            <textarea name="roleAfter" required rows={4} className={cn(field, "min-h-28")} />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            {applicationCopy.cases}
            <textarea name="cases" required rows={3} placeholder="না থাকলে লিখুন: নেই" className={cn(field, "min-h-24")} />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            {applicationCopy.mujib}
            <textarea name="mujibRole" required rows={4} className={cn(field, "min-h-28")} />
          </label>
          <div className="rounded-2xl border border-line bg-white px-4 py-4">
            <label className="flex items-start gap-3 text-sm leading-relaxed">
              <input type="checkbox" name="pledge" value="yes" required className="mt-1 size-5 shrink-0 accent-forest" />
              <span>{applicationCopy.pledge}</span>
            </label>
            <p className="mt-4 text-xs leading-relaxed text-muted">{applicationCopy.note}</p>
          </div>
          <Field label="আবেদনকারীর স্বাক্ষর" name="signature" required placeholder="পূর্ণ নাম লিখে স্বাক্ষর করুন" />
          <label className="absolute -left-[9999px]" aria-hidden="true">
            কোম্পানি
            <input name="company" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
        <div className="flex flex-col gap-3 border-t border-line bg-cream/60 px-5 py-5 sm:flex-row sm:items-center md:px-8">
          <button type="submit" disabled={status === "sending"} className={cn(buttonVariants({ variant: "donate", size: "xl" }), "w-full sm:w-auto")}>
            {status === "sending" ? "জমা হচ্ছে…" : "আবেদন জমা দিন"}
          </button>
          {status === "error" ? <p className="min-w-0 text-sm text-destructive" role="alert">{error}</p> : null}
        </div>
      </form>
    </section>
  );
}

function Field({
  label,
  name,
  ...props
}: { label: string; name: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="grid gap-2 text-sm font-medium">
      {label}
      <input name={name} className={field} {...props} />
    </label>
  );
}
