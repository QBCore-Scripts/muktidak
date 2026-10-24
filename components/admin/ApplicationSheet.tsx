import Image from "next/image";
import { FormLeaders } from "@/components/site/FormLeaders";
import { applicationCopy, applicationStatusLabel, memberLabel } from "@/lib/application";
import { formatDate } from "@/lib/format";
import type { Application } from "@/lib/types";

export function ApplicationSheet({ item, logo }: { item: Application; logo: string }) {
  const photo = item.photoStored ? `/api/admin/application-photo/${item.id}` : "";
  return (
    <article className="relative mx-auto max-w-[820px] overflow-hidden bg-white px-4 py-6 text-[15px] leading-relaxed text-ink shadow-sm print:max-w-none print:px-0 print:py-0 print:shadow-none sm:px-8 sm:py-8">
      <Image src={logo || "/logo.png"} alt="" width={224} height={224} unoptimized className="pointer-events-none absolute top-1/2 left-1/2 w-56 -translate-x-1/2 -translate-y-1/2 opacity-[0.07]" />
      <div className="relative">
        <FormLeaders className="px-0 pt-0 sm:px-0" />
        <div className="mt-1 flex flex-col gap-4 border-b-2 border-forest pb-4 sm:flex-row sm:items-center">
          <Image src={logo || "/logo.png"} alt="" width={72} height={72} unoptimized priority className="h-16 w-16 object-contain" />
          <div className="min-w-0 flex-1">
            <p className="text-sm text-forest">{applicationCopy.org}</p>
            <h1 className="mt-1 bg-forest px-3 py-1.5 text-center font-heading text-lg leading-snug text-paper sm:text-xl">{applicationCopy.title}</h1>
          </div>
          <div className="mx-auto grid h-28 w-24 shrink-0 place-items-center overflow-hidden border border-forest/30 text-center text-xs text-muted sm:mx-0">
            {photo ? (
              <Image src={photo} alt="পদপ্রার্থীর ছবি" width={96} height={112} unoptimized priority className="h-full w-full object-cover" />
            ) : (
              "পদপ্রার্থীর ছবি"
            )}
          </div>
        </div>
        <p className="mt-4 text-sm">
          ফরম নং : <strong>{item.formNo}</strong>
          <span className="mx-2 text-muted">·</span>
          তারিখ : {formatDate(item.date)}
          <span className="mx-2 text-muted">·</span>
          {applicationStatusLabel[item.status] ?? ""}
        </p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <Line label="নাম (বাংলায়)" value={item.nameBn} />
          <Line label="(ইংরেজিতে)" value={item.nameEn} />
          <Line label="প্রত্যাশিত পদের নাম" value={item.desiredPost} wide />
          <Line label="জাতীয় পরিচয়পত্র নং" value={item.nid} />
          <Line label="শিক্ষাগত যোগ্যতা" value={item.education} />
          <Line label="পেশা" value={item.occupation} />
          <Line label="মোবাইল" value={item.mobile} />
          <Line label="জেলা/মহানগর" value={item.district} />
          <Line label="উপজেলা/থানা" value={item.upazila} />
          <Line label="স্থায়ী ঠিকানা" value={item.address} wide />
        </div>
        <p className="mt-4">
          আপনি কি নতুন সদস্য: <strong>{memberLabel(item.newMember)}</strong>
        </p>
        <Block label="বাংলাদেশ মুক্তির ডাক-৭১ এর পূর্ববর্তী অথবা বর্তমান পদ:" value={item.previousPost} />
        <Block label={applicationCopy.role} value={item.roleAfter} />
        <Block label={applicationCopy.cases} value={item.cases} />
        <Block label={applicationCopy.mujib} value={item.mujibRole} />
        <p className="mt-5 text-sm leading-relaxed">{applicationCopy.pledge}</p>
        <div className="mt-8 grid gap-8 sm:grid-cols-2">
          <p className="border-t border-dotted border-forest/50 pt-2 text-center text-sm">সভাপতি</p>
          <div className="border-t border-dotted border-forest/50 pt-2 text-center">
            <p className="font-heading text-2xl leading-none text-forest">{item.signature}</p>
            <p className="mt-2 text-sm">আবেদনকারীর স্বাক্ষর</p>
          </div>
        </div>
        <p className="mt-6 text-xs leading-relaxed text-muted">{applicationCopy.note}</p>
      </div>
    </article>
  );
}

function Line({ label, value, wide = false }: { label: string; value: string; wide?: boolean }) {
  return (
    <p className={wide ? "sm:col-span-2" : ""}>
      <span>{label} : </span>
      <span className="border-b border-dotted border-forest/40 font-medium break-words">{value}</span>
    </p>
  );
}

function Block({ label, value }: { label: string; value: string }) {
  return (
    <div className="mt-4">
      <p>{label}</p>
      <p className="mt-1 whitespace-pre-wrap break-words border-b border-dotted border-forest/30 font-medium">{value}</p>
    </div>
  );
}
