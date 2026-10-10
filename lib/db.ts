import { randomUUID } from "crypto";
import { readFileSync } from "fs";
import path from "path";
import mongoose from "mongoose";
import { mergeCopy } from "./copy";
import connectToDatabase from "./mongodb";
import type {
  Activity,
  AdminAuth,
  BankAccount,
  BlogPost,
  Database,
  District,
  ListKey,
  MediaItem,
  Notice,
  PageContent,
  Settings,
} from "./types";

const STATE_ID = "main";
const ADMIN_LOGIN = {
  email: "admin@muktidak71.org",
  revision: 1,
  salt: "05973c18359689671322b9e9545679db",
  passwordHash: "7f7c942c3af0c499bbf6b6fe0d9e23cd1fcbef3c920a7b319126021a2836a60c",
};
const LIST_KEYS: ListKey[] = [
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
];

type StateDoc = Partial<Database> & { _id: string; rev?: number };

const AppState =
  (mongoose.models.AppState as mongoose.Model<StateDoc>) ||
  mongoose.model<StateDoc>(
    "AppState",
    new mongoose.Schema({ _id: String, rev: { type: Number, default: 0 } }, { strict: false, versionKey: false, collection: "app_state" }),
  );

const SessionModel =
  (mongoose.models.Session as mongoose.Model<{ token_hash: string; email: string; expires: number }>) ||
  mongoose.model(
    "Session",
    new mongoose.Schema(
      {
        token_hash: { type: String, required: true, unique: true },
        email: { type: String, required: true },
        expires: { type: Number, required: true, index: true },
      },
      { versionKey: false, collection: "sessions" },
    ),
  );

const MediaFile =
  (mongoose.models.MediaFile as mongoose.Model<{ _id: string; data: Buffer }>) ||
  mongoose.model(
    "MediaFile",
    new mongoose.Schema({ _id: String, data: { type: Buffer, required: true } }, { versionKey: false, collection: "media_files" }),
  );

function sealAdmin(seed: Database) {
  seed.admin.email = ADMIN_LOGIN.email;
  seed.admin.salt = ADMIN_LOGIN.salt;
  seed.admin.passwordHash = ADMIN_LOGIN.passwordHash;
  seed.admin.loginRevision = ADMIN_LOGIN.revision;
  return "";
}

async function seedState() {
  const seed = JSON.parse(readFileSync(path.join(process.cwd(), "data", "db.json"), "utf8")) as Database;
  const generated = sealAdmin(seed);
  try {
    const result = await AppState.updateOne({ _id: STATE_ID }, { $setOnInsert: { ...seed, rev: 0 } }, { upsert: true });
    if (generated && result.upsertedCount === 1) {
      console.warn(`[muktidak] ADMIN_PASSWORD not set. Generated admin login: ${seed.admin.email} / ${generated}`);
    }
  } catch (error) {
    if ((error as { code?: number }).code !== 11000) throw error;
  }
}

let adminLoginReady = false;

async function ensureAdminLogin() {
  if (adminLoginReady) return;
  await connectToDatabase();
  const doc = await AppState.findById(STATE_ID, { admin: 1 }).lean<StateDoc>();
  const admin = doc?.admin;
  if (!admin) return;
  if (admin.loginRevision !== ADMIN_LOGIN.revision) {
    await AppState.updateOne(
      { _id: STATE_ID },
      {
        $set: {
          "admin.email": ADMIN_LOGIN.email,
          "admin.salt": ADMIN_LOGIN.salt,
          "admin.passwordHash": ADMIN_LOGIN.passwordHash,
          "admin.loginRevision": ADMIN_LOGIN.revision,
        },
      },
    );
  }
  adminLoginReady = true;
}

async function loadState(projection?: Record<string, 1>): Promise<StateDoc> {
  await ensureAdminLogin();
  let doc = await AppState.findById(STATE_ID, projection).lean<StateDoc>();
  if (!doc) {
    await seedState();
    await ensureAdminLogin();
    doc = await AppState.findById(STATE_ID, projection).lean<StateDoc>();
  }
  if (!doc) throw new Error("ডেটাবেস খালি");
  return doc;
}

function toDatabase(doc: StateDoc): Database {
  if (!doc.settings || !doc.admin) throw new Error("ডেটাবেস খালি");
  const db = { settings: doc.settings, admin: doc.admin } as Database;
  for (const key of LIST_KEYS) (db as Record<ListKey, unknown[]>)[key] = doc[key] ?? [];
  return db;
}

function fields(db: Database) {
  const out: Record<string, unknown> = { settings: db.settings, admin: db.admin };
  for (const key of LIST_KEYS) out[key] = db[key];
  return out;
}

export async function readDb(): Promise<Database> {
  return toDatabase(await loadState());
}

export async function writeDb(db: Database) {
  await connectToDatabase();
  await AppState.updateOne({ _id: STATE_ID }, { $set: fields(db), $inc: { rev: 1 } }, { upsert: true });
}

export async function updateDb(mutator: (db: Database) => void) {
  for (let attempt = 0; attempt < 5; attempt++) {
    const doc = await loadState();
    const db = toDatabase(doc);
    mutator(db);
    const rev = doc.rev ?? 0;
    const filter = doc.rev === undefined ? { _id: STATE_ID, rev: { $exists: false } } : { _id: STATE_ID, rev };
    const result = await AppState.updateOne(filter, { $set: { ...fields(db), rev: rev + 1 } });
    if (result.matchedCount === 1) return db;
  }
  throw new Error("ডেটাবেস ব্যস্ত, আবার চেষ্টা করুন");
}

export function newId() {
  return randomUUID();
}

export function safeId(id: string) {
  return /^[A-Za-z0-9-]{1,80}$/.test(id);
}

export function listOf(db: Database, key: ListKey) {
  return db[key];
}

export function withoutStored<T extends { stored?: string }>(item: T) {
  const copy = { ...item };
  delete copy.stored;
  return copy;
}

export async function getSettings(): Promise<Settings> {
  const { settings } = await loadState({ settings: 1 });
  if (!settings) throw new Error("সেটিংস নেই");
  return { ...settings, logoUrl: settings.logoUrl || "", copy: mergeCopy(settings.copy) };
}

export async function getActivities(): Promise<Activity[]> {
  return (await loadState({ activities: 1 })).activities ?? [];
}

export async function getPublishedNotices(): Promise<Notice[]> {
  return ((await loadState({ notices: 1 })).notices ?? []).filter((item) => item.published);
}

export async function getPublishedBlogs(): Promise<BlogPost[]> {
  return ((await loadState({ blogs: 1 })).blogs ?? []).filter((item) => item.published);
}

export async function getPublishedBlog(slug: string): Promise<BlogPost | null> {
  if (!/^[a-z0-9-]{1,80}$/.test(slug)) return null;
  return (await getPublishedBlogs()).find((item) => item.slug === slug) ?? null;
}

export async function getPublishedNotice(id: string): Promise<Notice | null> {
  if (!safeId(id)) return null;
  return (await getPublishedNotices()).find((item) => item.id === id) ?? null;
}

export async function getPublicMedia(): Promise<MediaItem[]> {
  return ((await loadState({ media: 1 })).media ?? [])
    .filter((item) => !item.private && item.url)
    .map((item) => withoutStored(item));
}

export async function getDistricts(): Promise<District[]> {
  return (await loadState({ districts: 1 })).districts ?? [];
}

export async function getVisibleAccounts(): Promise<BankAccount[]> {
  return ((await loadState({ accounts: 1 })).accounts ?? []).filter((item) => item.visible);
}

export async function getPages(): Promise<PageContent[]> {
  return (await loadState({ pages: 1 })).pages ?? [];
}

export async function getPage(slug: string): Promise<PageContent | null> {
  if (!/^[a-z0-9-]{1,40}$/.test(slug)) return null;
  return ((await loadState({ pages: 1 })).pages ?? []).find((item) => item.slug === slug) ?? null;
}

export async function publicCounts() {
  const doc = await loadState({ donations: 1, members: 1, districts: 1 });
  const donationTotal = (doc.donations ?? [])
    .filter((item) => item.status === "received")
    .reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  return {
    donationTotal,
    activeMembers: (doc.members ?? []).filter((item) => item.status === "active").length,
    districtCount: (doc.districts ?? []).length,
  };
}

export async function getAdmin(): Promise<AdminAuth> {
  const { admin } = await loadState({ admin: 1 });
  if (!admin) throw new Error("অ্যাডমিন নেই");
  return admin;
}

export async function saveSession(tokenHash: string, email: string, expires: number) {
  await connectToDatabase();
  await SessionModel.create({ token_hash: tokenHash, email, expires });
  await SessionModel.deleteMany({ expires: { $lt: Date.now() } });
}

export async function findSession(tokenHash: string) {
  await connectToDatabase();
  const row = await SessionModel.findOne({ token_hash: tokenHash }).lean();
  if (!row) return null;
  return { email: row.email, expires: row.expires };
}

export async function deleteSession(tokenHash: string) {
  await connectToDatabase();
  await SessionModel.deleteOne({ token_hash: tokenHash });
}

export async function revokeAllSessions() {
  await connectToDatabase();
  await SessionModel.deleteMany({});
}

export async function mediaRecord(id: string) {
  if (!safeId(id)) return null;
  const item = ((await loadState({ media: 1 })).media ?? []).find((m) => m.id === id);
  if (!item) return null;
  return { private: Boolean(item.private), url: item.url, stored: item.stored ?? "" };
}

const STORED_NAME = /^[A-Za-z0-9-]{1,80}\.(jpg|jpeg|png|webp|gif)$/;

export async function saveMediaFile(stored: string, data: Buffer) {
  if (!STORED_NAME.test(stored)) throw new Error("ফাইলের নাম সঠিক নয়");
  await connectToDatabase();
  await MediaFile.create({ _id: stored, data });
}

export async function readMediaFile(stored: string): Promise<Buffer | null> {
  if (!STORED_NAME.test(stored)) return null;
  await connectToDatabase();
  const file = await MediaFile.findById(stored);
  return file ? Buffer.from(file.data) : null;
}

export async function deleteMediaFile(stored: string) {
  if (!STORED_NAME.test(stored)) return;
  await connectToDatabase();
  await MediaFile.deleteOne({ _id: stored });
}
