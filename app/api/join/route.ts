import { nextFormNo, nidOf, phoneOf } from "@/lib/application";
import { deleteMediaFile, newId, saveMediaFile, updateDb } from "@/lib/db";
import { todayISO } from "@/lib/format";
import { assertGlobal, assertRate, assertSameOrigin } from "@/lib/guard";
import type { Application } from "@/lib/types";
import { revalidatePath } from "next/cache";

const MAX_BODY = 2_200_000;
const MAX_PHOTO = 1_500_000;

export async function POST(request: Request) {
  const blocked = assertSameOrigin(request) ?? assertGlobal("join", 400, 60 * 60 * 1000);
  if (blocked) return blocked;
  const advertised = Number(request.headers.get("content-length") || "0");
  if (Number.isFinite(advertised) && advertised > MAX_BODY) {
    return Response.json({ error: "ফাইল ১.৫ মেগাবাইটের কম দিন" }, { status: 413 });
  }
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return Response.json({ error: "তথ্য পাওয়া যায়নি" }, { status: 400 });
  }
  if (text(form.get("company"), 80)) return Response.json({ ok: true });

  const nameBn = text(form.get("nameBn"), 80);
  const nameEn = text(form.get("nameEn"), 80).replace(/\s+/g, " ");
  const desiredPost = text(form.get("desiredPost"), 120);
  const nid = nidOf(text(form.get("nid"), 30));
  const education = text(form.get("education"), 160);
  const occupation = text(form.get("occupation"), 120);
  const mobile = phoneOf(text(form.get("mobile"), 30));
  const district = text(form.get("district"), 80);
  const upazila = text(form.get("upazila"), 80);
  const address = text(form.get("address"), 400);
  const newMember = form.get("newMember") === "yes" ? "yes" : form.get("newMember") === "no" ? "no" : "";
  const previousPost = text(form.get("previousPost"), 240);
  const roleAfter = text(form.get("roleAfter"), 2000);
  const cases = text(form.get("cases"), 1000);
  const mujibRole = text(form.get("mujibRole"), 2000);
  const signature = text(form.get("signature"), 80);
  const pledged = form.get("pledge") === "yes";

  if (!/[\u0980-\u09FF]/.test(nameBn)) return Response.json({ error: "নাম বাংলায় লিখুন" }, { status: 400 });
  if (!/^[A-Za-z][A-Za-z .'-]*$/.test(nameEn)) return Response.json({ error: "ইংরেজি নাম শুধু ইংরেজি অক্ষরে লিখুন" }, { status: 400 });
  if (desiredPost.length < 2) return Response.json({ error: "প্রত্যাশিত পদের নাম লিখুন" }, { status: 400 });
  if (!nid) return Response.json({ error: "জাতীয় পরিচয়পত্র নম্বর সঠিক নয়" }, { status: 400 });
  if (education.length < 2) return Response.json({ error: "শিক্ষাগত যোগ্যতা লিখুন" }, { status: 400 });
  if (occupation.length < 2) return Response.json({ error: "পেশা লিখুন" }, { status: 400 });
  if (!mobile) return Response.json({ error: "মোবাইল নম্বর সঠিক নয়" }, { status: 400 });
  if (district.length < 2) return Response.json({ error: "জেলা বা মহানগর লিখুন" }, { status: 400 });
  if (upazila.length < 2) return Response.json({ error: "উপজেলা বা থানা লিখুন" }, { status: 400 });
  if (address.length < 8) return Response.json({ error: "স্থায়ী ঠিকানা লিখুন" }, { status: 400 });
  if (!newMember) return Response.json({ error: "নতুন সদস্য কি না বেছে নিন" }, { status: 400 });
  if (previousPost.length < 1) return Response.json({ error: "পূর্ববর্তী বা বর্তমান পদ লিখুন। না থাকলে «নেই» লিখুন" }, { status: 400 });
  if (roleAfter.length < 8) return Response.json({ error: "আগস্ট ২০২৪-এর পর আপনার ভূমিকা লিখুন" }, { status: 400 });
  if (cases.length < 1) return Response.json({ error: "মামলার সংখ্যা ও কারণ লিখুন। না থাকলে «নেই» লিখুন" }, { status: 400 });
  if (mujibRole.length < 8) return Response.json({ error: "মুজিববাদ প্রতিষ্ঠার লড়াইয়ে আপনার ভূমিকা লিখুন" }, { status: 400 });
  if (signature.length < 2) return Response.json({ error: "আবেদনকারীর স্বাক্ষর লিখুন" }, { status: 400 });
  if (!pledged) return Response.json({ error: "অঙ্গীকারে সম্মতি দিন" }, { status: 400 });

  const photo = await readPhoto(form.get("photo"));
  if (photo === "bad") return Response.json({ error: "ছবি jpg, png বা webp হতে হবে এবং ১.৫ মেগাবাইটের কম" }, { status: 400 });
  const limited = assertRate(request, "join", 12, 60 * 60 * 1000);
  if (limited) return limited;

  const id = newId();
  const photoStored = photo ? `${id}.${photo.ext}` : "";
  const item: Application = {
    id,
    formNo: "",
    nameBn,
    nameEn,
    desiredPost,
    nid,
    education,
    occupation,
    mobile,
    district,
    upazila,
    address,
    newMember,
    previousPost,
    roleAfter,
    cases,
    mujibRole,
    signature,
    photoStored,
    date: todayISO(),
    status: "new",
    note: "",
  };

  let reason = "";
  const saved = await updateDb((db) => {
    if (db.applications.some((row) => row.nid === nid)) {
      reason = "duplicate";
      return;
    }
    if (db.applications.length >= 2000) {
      reason = "full";
      return;
    }
    reason = "";
    item.formNo = nextFormNo(db.applications);
    db.applications.unshift(item);
  });
  const kept = saved.applications.find((row) => row.id === id);
  if (!kept) {
    return Response.json(
      { error: reason === "full" ? "এখন নতুন আবেদন নেওয়া হচ্ছে না" : "এই জাতীয় পরিচয়পত্র দিয়ে আগেই আবেদন জমা হয়েছে" },
      { status: reason === "full" ? 503 : 409 },
    );
  }
  if (photo && photoStored) {
    try {
      await saveMediaFile(photoStored, photo.bytes);
    } catch (error) {
      try {
        await updateDb((db) => {
          db.applications = db.applications.filter((row) => row.id !== id);
        });
      } finally {
        await deleteMediaFile(photoStored);
      }
      throw error;
    }
  }
  revalidatePath("/", "layout");
  return Response.json({ ok: true, formNo: kept.formNo }, { headers: { "Cache-Control": "no-store" } });
}

function text(value: FormDataEntryValue | null, max: number) {
  if (typeof value !== "string") return "";
  return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").replace(/\r\n/g, "\n").replace(/\r/g, "").trim().slice(0, max);
}

function sniff(bytes: Buffer) {
  if (bytes.length > 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "jpg" as const;
  if (bytes.length > 8 && bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "png" as const;
  if (bytes.length > 12 && bytes.subarray(0, 4).toString("ascii") === "RIFF" && bytes.subarray(8, 12).toString("ascii") === "WEBP") return "webp" as const;
  return "";
}

async function readPhoto(value: FormDataEntryValue | null) {
  if (!(value instanceof File) || value.size === 0) return null;
  if (value.size > MAX_PHOTO) return "bad" as const;
  const bytes = Buffer.from(await value.arrayBuffer());
  const ext = sniff(bytes);
  if (!ext) return "bad" as const;
  return { bytes, ext };
}
