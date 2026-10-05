import { writeFileSync } from "fs";
import path from "path";
import { clearSession, getSession, hashPassword, verifyPassword } from "@/lib/auth";
import { listOf, mediaRecord, newId, privateUploadsDir, readDb, revokeAllSessions, safeId, unlinkStored, updateDb, withoutStored } from "@/lib/db";
import { mergeCopy } from "@/lib/copy";
import { dashboardFrom } from "@/lib/admin-snapshot";
import { todayISO } from "@/lib/format";
import { assertGlobal, assertRate, assertSameOrigin, plain, readJson } from "@/lib/guard";
import type { ListKey } from "@/lib/types";
import { revalidatePath } from "next/cache";

const lists = [
  "members",
  "donations",
  "accounts",
  "notices",
  "blogs",
  "pages",
  "media",
  "districts",
  "activities",
  "messages",
] as const;

const fields: Record<ListKey, string[]> = {
  members: ["name", "phone", "district", "role", "status", "joined"],
  donations: ["donor", "phone", "amount", "method", "purpose", "date", "status"],
  accounts: ["bank", "branch", "accountName", "accountNumber", "accountType", "visible"],
  notices: ["title", "body", "date", "published"],
  blogs: ["slug", "title", "excerpt", "body", "cover", "author", "date", "published"],
  pages: ["slug", "title", "body"],
  media: ["name", "folder", "private"],
  districts: ["name", "office", "contact", "phone", "members"],
  activities: ["title", "summary", "date"],
  messages: ["read"],
};

type Ctx = { params: Promise<{ resource: string }> };

async function gate(request: Request) {
  const session = await getSession();
  if (!session) return Response.json({ error: "প্রবেশ করা প্রয়োজন" }, { status: 401 });
  return assertSameOrigin(request) ?? assertRate(request, "admin", 60, 60_000) ?? assertGlobal("admin", 180, 60_000);
}

export async function GET(_request: Request, ctx: Ctx) {
  const session = await getSession();
  if (!session) return Response.json({ error: "প্রবেশ করা প্রয়োজন" }, { status: 401 });
  const resource = (await ctx.params).resource;
  const db = readDb();
  if (resource === "dashboard") return Response.json(dashboardFrom(db));
  if (resource === "settings") {
    return Response.json({ settings: db.settings, email: db.admin.email });
  }
  if (!isList(resource)) return Response.json({ error: "অজানা বিভাগ" }, { status: 404 });
  const list = listOf(db, resource);
  if (resource === "media") return Response.json(db.media.map((item) => withoutStored(item)));
  return Response.json(list);
}

export async function POST(request: Request, ctx: Ctx) {
  const denied = await gate(request);
  if (denied) return denied;
  const resource = (await ctx.params).resource;
  if (resource === "media") return saveUpload(request);
  if (!isList(resource) || resource === "messages") {
    return Response.json({ error: "যোগ করা যায় না" }, { status: 400 });
  }
  const body = (await readJson(request, 100_000)) as Record<string, unknown> | null;
  if (!body) return Response.json({ error: "তথ্য পাওয়া যায়নি" }, { status: 400 });
  const picked = pick(body, fields[resource]);
  const error = validate(resource, picked, true);
  if (error) return Response.json({ error }, { status: 400 });
  const item = { id: newId(), ...defaults(resource), ...picked };
  if (resource === "blogs" && blogSlugTaken(String((item as { slug?: string }).slug))) {
    return Response.json({ error: "এই স্লাগ আগে ব্যবহার হয়েছে" }, { status: 400 });
  }
  updateDb((db) => {
    (db[resource] as unknown[]).unshift(item);
  });
  revalidatePath("/", "layout");
  return Response.json(item);
}

export async function PATCH(request: Request, ctx: Ctx) {
  const denied = await gate(request);
  if (denied) return denied;
  const resource = (await ctx.params).resource;
  const body = (await readJson(request, 100_000)) as Record<string, unknown> | null;
  if (!body) return Response.json({ error: "তথ্য পাওয়া যায়নি" }, { status: 400 });

  if (resource === "settings") return saveSettings(body);

  if (!isList(resource)) return Response.json({ error: "অজানা বিভাগ" }, { status: 404 });
  const id = typeof body.id === "string" ? body.id : "";
  if (!safeId(id)) return Response.json({ error: "আইডি নেই" }, { status: 400 });
  const picked = pick(body, fields[resource]);
  const error = validate(resource, picked, false);
  if (error) return Response.json({ error }, { status: 400 });
  if (resource === "blogs" && typeof picked.slug === "string" && blogSlugTaken(picked.slug, id)) {
    return Response.json({ error: "এই স্লাগ আগে ব্যবহার হয়েছে" }, { status: 400 });
  }

  let updated = false;
  updateDb((db) => {
    const list = db[resource] as { id: string }[];
    const index = list.findIndex((item) => item.id === id);
    if (index === -1) return;
    list[index] = { ...list[index], ...picked };
    updated = true;
  });
  if (!updated) return Response.json({ error: "খুঁজে পাওয়া যায়নি" }, { status: 404 });
  revalidatePath("/", "layout");
  return Response.json({ ok: true });
}

export async function DELETE(request: Request, ctx: Ctx) {
  const denied = await gate(request);
  if (denied) return denied;
  const resource = (await ctx.params).resource;
  if (!isList(resource) || resource === "pages") {
    return Response.json({ error: "মুছে ফেলা যায় না" }, { status: 400 });
  }
  const id = new URL(request.url).searchParams.get("id") ?? "";
  if (!safeId(id)) return Response.json({ error: "আইডি নেই" }, { status: 400 });
  const stored = resource === "media" ? mediaRecord(id)?.stored ?? "" : "";
  let removed = false;
  updateDb((db) => {
    const list = db[resource] as { id: string }[];
    const next = list.filter((item) => item.id !== id);
    removed = next.length !== list.length;
    db[resource] = next as never;
  });
  if (removed) unlinkStored(stored);
  revalidatePath("/", "layout");
  return Response.json({ ok: true });
}

function isList(value: string): value is ListKey {
  return (lists as readonly string[]).includes(value);
}

function pick(body: Record<string, unknown>, keys: string[]) {
  const out: Record<string, unknown> = {};
  for (const key of keys) {
    if (key in body) out[key] = body[key];
  }
  return out;
}

function str(value: unknown, max = 500) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function validate(resource: ListKey, data: Record<string, unknown>, creating: boolean) {
  if ("status" in data && resource === "members" && data.status !== "active" && data.status !== "inactive") {
    return "অবস্থা সঠিক নয়";
  }
  if ("status" in data && resource === "donations" && data.status !== "received" && data.status !== "pending") {
    return "অবস্থা সঠিক নয়";
  }
  if ("visible" in data) data.visible = data.visible === true || data.visible === "true";
  if ("published" in data) data.published = data.published === true || data.published === "true";
  if ("private" in data) data.private = data.private === true || data.private === "true";
  if ("read" in data) data.read = data.read === true || data.read === "true";
  if (resource === "pages" && "slug" in data && !/^[a-z0-9-]{1,40}$/.test(str(data.slug))) return "স্লাগ সঠিক নয়";
  if (resource === "members" && creating && !str(data.name)) return "নাম লিখুন";
  if (resource === "donations") {
    if (creating && !str(data.donor)) return "দাতার নাম লিখুন";
    if ("amount" in data) {
      const amount = Number(data.amount);
      if (!Number.isFinite(amount) || amount < 0 || amount > 100_000_000) return "পরিমাণ সঠিক নয়";
      data.amount = Math.round(amount);
    }
  }
  if (resource === "accounts" && creating && !str(data.bank)) return "ব্যাংকের নাম লিখুন";
  if (resource === "accounts" && creating && !str(data.accountNumber)) return "অ্যাকাউন্ট নম্বর লিখুন";
  if (resource === "notices" && creating && !str(data.title)) return "শিরোনাম লিখুন";
  if (resource === "blogs" && "title" in data && !str(data.title)) return "শিরোনাম লিখুন";
  if (resource === "pages" && !str(data.title)) return "শিরোনাম লিখুন";
  if (resource === "districts" && creating && !str(data.name)) return "জেলার নাম লিখুন";
  if (resource === "activities" && creating && !str(data.title)) return "কার্যক্রমের নাম লিখুন";
  if ("members" in data && resource === "districts") {
    const count = Number(data.members);
    if (!Number.isFinite(count) || count < 0) return "সদস্য সংখ্যা সঠিক নয়";
    data.members = Math.round(count);
  }
  for (const key of Object.keys(data)) {
    if (typeof data[key] === "string") {
      const max = key === "body" && resource === "blogs" ? 20000 : key === "excerpt" ? 600 : key === "body" ? 5000 : 240;
      data[key] = str(data[key], max);
    }
  }
  if (resource === "blogs" && ("slug" in data || creating)) {
    const slug = blogSlug(str(data.slug, 80)) || (creating ? `lekha-${newId().replace(/-/g, "").slice(0, 8)}` : "");
    if (!slug) return "স্লাগ সঠিক নয় — শুধু ইংরেজি ছোট হাতের অক্ষর, সংখ্যা ও হাইফেন";
    data.slug = slug;
  }
  if (resource === "blogs" && data.cover && !isLocalPath(String(data.cover))) {
    return "কভার ছবির ঠিকানা সাইটের ভিতরের হতে হবে";
  }
  return "";
}

function blogSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function isLocalPath(value: string) {
  return value.startsWith("/") && !value.startsWith("//") && !value.includes("..") && /^\/[A-Za-z0-9._~/-]+$/.test(value);
}

function blogSlugTaken(slug: string, exceptId = "") {
  return readDb().blogs.some((item) => item.slug === slug && item.id !== exceptId);
}

function defaults(resource: ListKey) {
  const date = todayISO();
  if (resource === "members") return { status: "active", joined: date, role: "সদস্য" };
  if (resource === "donations") return { status: "received", date, method: "ব্যাংক", phone: "" };
  if (resource === "accounts") return { visible: true, accountType: "সঞ্চয়ী", accountName: "" };
  if (resource === "notices") return { published: true, date, body: "" };
  if (resource === "blogs") return { published: false, date, excerpt: "", body: "", cover: "", author: "", slug: "" };
  if (resource === "districts") return { members: 0, phone: "", office: "", contact: "" };
  if (resource === "activities") return { date: "", summary: "" };
  return {};
}

async function saveSettings(body: Record<string, unknown>) {
  const settings = body.settings;
  if (!settings || typeof settings !== "object") {
    return Response.json({ error: "সেটিংস পাওয়া যায়নি" }, { status: 400 });
  }
  const next = settings as Record<string, unknown>;
  const currentPassword = typeof body.currentPassword === "string" ? body.currentPassword.slice(0, 200) : "";
  const newPassword = typeof body.newPassword === "string" ? body.newPassword.slice(0, 200) : "";
  const nextEmail = str(body.adminEmail, 120).toLowerCase();
  if (newPassword && newPassword.length < 12) {
    return Response.json({ error: "নতুন পাসওয়ার্ড অন্তত ১২ অক্ষরের হতে হবে" }, { status: 400 });
  }
  const existing = readDb();
  const emailChanging = Boolean(nextEmail) && nextEmail !== existing.admin.email.toLowerCase();
  if (emailChanging && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nextEmail)) {
    return Response.json({ error: "অ্যাডমিন ইমেইল সঠিক নয়" }, { status: 400 });
  }
  if ((newPassword || emailChanging) && !verifyPassword(currentPassword, existing.admin.salt, existing.admin.passwordHash)) {
    return Response.json({ error: "বর্তমান পাসওয়ার্ড মিলছে না" }, { status: 400 });
  }
  updateDb((db) => {
    db.settings = {
      name: str(next.name, 120) || db.settings.name,
      shortName: str(next.shortName, 80) || db.settings.shortName,
      tagline: str(next.tagline, 400),
      quote: str(next.quote, 400),
      phone: str(next.phone, 40),
      email: str(next.email, 120),
      address: str(next.address, 240),
      copy: mergeCopy(next.copy),
    };
    if (emailChanging) db.admin.email = nextEmail;
    if (newPassword) {
      const hashed = hashPassword(newPassword);
      db.admin.salt = hashed.salt;
      db.admin.passwordHash = hashed.passwordHash;
    }
  });
  const signedOut = Boolean(newPassword || emailChanging);
  if (signedOut) {
    revokeAllSessions();
    await clearSession();
  }
  revalidatePath("/", "layout");
  return Response.json({ ok: true, signedOut });
}

function sniff(bytes: Buffer) {
  if (bytes.length > 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "jpg";
  if (bytes.length > 8 && bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "png";
  if (bytes.length > 12 && bytes.subarray(0, 4).toString("ascii") === "RIFF" && bytes.subarray(8, 12).toString("ascii") === "WEBP") return "webp";
  const head = bytes.subarray(0, 6).toString("ascii");
  if (head === "GIF87a" || head === "GIF89a") return "gif";
  return "";
}

async function saveUpload(request: Request) {
  const advertised = Number(request.headers.get("content-length") || "0");
  if (!Number.isFinite(advertised) || advertised <= 0 || advertised > 2_500_000) {
    return Response.json({ error: "২ এমবির কম ফাইল দিন" }, { status: 413 });
  }
  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return Response.json({ error: "ফাইল নেই" }, { status: 400 });
  if (file.size > 2_000_000) return Response.json({ error: "২ এমবির কম ফাইল দিন" }, { status: 400 });
  const bytes = Buffer.from(await file.arrayBuffer());
  const ext = sniff(bytes);
  if (!ext) return Response.json({ error: "শুধু jpg, png, webp বা gif ছবি আপলোড করা যাবে" }, { status: 400 });
  const id = newId();
  privateUploadsDir();
  const target = path.join(process.cwd(), "data", "uploads", `${id}.${ext}`);
  writeFileSync(target, bytes, { mode: 0o600 });
  const item = {
    id,
    name: plain(file.name, 120) || "image",
    folder: plain(form.get("folder"), 40) || "কার্যক্রম",
    size: bytes.length,
    url: `/api/media/${id}`,
    private: form.get("private") === "true",
    stored: target,
  };
  updateDb((db) => {
    db.media.unshift(item);
  });
  revalidatePath("/", "layout");
  return Response.json(withoutStored(item));
}
