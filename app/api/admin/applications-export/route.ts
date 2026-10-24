import { applicationStatusLabel, memberLabel } from "@/lib/application";
import { getSession } from "@/lib/auth";
import { readDb } from "@/lib/db";

export async function GET() {
  if (!(await getSession())) return Response.json({ error: "প্রবেশ করা প্রয়োজন" }, { status: 401 });
  const rows = (await readDb()).applications;
  const header = [
    "ফরম নং",
    "তারিখ",
    "অবস্থা",
    "নাম (বাংলা)",
    "নাম (ইংরেজি)",
    "প্রত্যাশিত পদ",
    "জাতীয় পরিচয়পত্র",
    "শিক্ষা",
    "পেশা",
    "মোবাইল",
    "জেলা",
    "উপজেলা",
    "ঠিকানা",
    "নতুন সদস্য",
    "পূর্ববর্তী বা বর্তমান পদ",
    "৫ই আগষ্ট ২০২৪-এর পর ভূমিকা",
    "মামলা",
    "মুজিববাদ প্রতিষ্ঠায় ভূমিকা",
    "স্বাক্ষর",
    "নোট",
  ];
  const body = rows.map((item) =>
    [
      item.formNo,
      item.date,
      applicationStatusLabel[item.status],
      item.nameBn,
      item.nameEn,
      item.desiredPost,
      item.nid,
      item.education,
      item.occupation,
      item.mobile,
      item.district,
      item.upazila,
      item.address,
      memberLabel(item.newMember),
      item.previousPost,
      item.roleAfter,
      item.cases,
      item.mujibRole,
      item.signature,
      item.note,
    ]
      .map(cell)
      .join(","),
  );
  const csv = `\uFEFF${header.map(cell).join(",")}\n${body.join("\n")}\n`;
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=\"muktidak-applications.csv\"",
      "Cache-Control": "private, no-store",
    },
  });
}

function cell(value: string) {
  const text = String(value ?? "");
  const safe = /^[=+\-@\t\r]/.test(text) ? `'${text}` : text;
  return `"${safe.replace(/"/g, '""')}"`;
}
