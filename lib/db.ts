import { randomBytes, randomUUID, scryptSync } from "crypto";
import { chmodSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from "fs";
import { createRequire } from "node:module";
import path from "path";
import { mergeCopy, parseCopy } from "./copy";
import type {
  Activity,
  AdminAuth,
  BankAccount,
  BlogPost,
  Database,
  District,
  Donation,
  ListKey,
  MediaItem,
  Member,
  Message,
  Notice,
  PageContent,
  Settings,
} from "./types";

type Stmt = {
  all: (...args: unknown[]) => Record<string, unknown>[];
  get: (...args: unknown[]) => Record<string, unknown> | undefined;
  run: (...args: unknown[]) => unknown;
};

type Sql = {
  exec: (source: string) => void;
  prepare: (source: string) => Stmt;
};

const globalForDb = globalThis as unknown as { muktidakSql?: Sql };

function ensureCopy(db: Sql) {
  const columns = db.prepare("PRAGMA table_info(settings)").all();
  if (columns.length && !columns.some((column) => column.name === "copy")) {
    db.exec("ALTER TABLE settings ADD COLUMN copy TEXT NOT NULL DEFAULT ''");
  }
}

function ensureBlogs(db: Sql) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS blogs (
      id TEXT PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      excerpt TEXT NOT NULL,
      body TEXT NOT NULL,
      cover TEXT NOT NULL,
      author TEXT NOT NULL,
      date TEXT NOT NULL,
      published INTEGER NOT NULL,
      sort INTEGER NOT NULL
    );
  `);
}

function open(): Sql {
  if (globalForDb.muktidakSql) {
    ensureCopy(globalForDb.muktidakSql);
    ensureBlogs(globalForDb.muktidakSql);
    return globalForDb.muktidakSql;
  }
  const dir = path.join(process.cwd(), "data");
  mkdirSync(dir, { recursive: true });
  const file = path.join(dir, "app.db");
  const { DatabaseSync } = createRequire(path.join(process.cwd(), "package.json"))("node:sqlite") as {
    DatabaseSync: new (filename: string) => Sql;
  };
  const db = new DatabaseSync(file);
  db.exec("PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON; PRAGMA busy_timeout = 3000;");
  migrate(db);
  try {
    chmodSync(file, 0o600);
  } catch {
    /* Windows does not honor the Unix mode. The file stays outside public/. */
  }
  globalForDb.muktidakSql = db;
  return db;
}

function migrate(db: Sql) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      name TEXT NOT NULL,
      short_name TEXT NOT NULL,
      tagline TEXT NOT NULL,
      quote TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT NOT NULL,
      address TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS admin (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      email TEXT NOT NULL,
      salt TEXT NOT NULL,
      password_hash TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS members (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      district TEXT NOT NULL,
      role TEXT NOT NULL,
      status TEXT NOT NULL,
      joined TEXT NOT NULL,
      sort INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS donations (
      id TEXT PRIMARY KEY,
      donor TEXT NOT NULL,
      phone TEXT NOT NULL,
      amount INTEGER NOT NULL,
      method TEXT NOT NULL,
      purpose TEXT NOT NULL,
      date TEXT NOT NULL,
      status TEXT NOT NULL,
      sort INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS accounts (
      id TEXT PRIMARY KEY,
      bank TEXT NOT NULL,
      branch TEXT NOT NULL,
      account_name TEXT NOT NULL,
      account_number TEXT NOT NULL,
      account_type TEXT NOT NULL,
      visible INTEGER NOT NULL,
      sort INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS notices (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      date TEXT NOT NULL,
      published INTEGER NOT NULL,
      sort INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS pages (
      id TEXT PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      sort INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS media (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      folder TEXT NOT NULL,
      size INTEGER NOT NULL,
      url TEXT NOT NULL,
      private INTEGER NOT NULL,
      stored TEXT NOT NULL DEFAULT '',
      sort INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS districts (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      office TEXT NOT NULL,
      contact TEXT NOT NULL,
      phone TEXT NOT NULL,
      members INTEGER NOT NULL,
      sort INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS activities (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      summary TEXT NOT NULL,
      date TEXT NOT NULL,
      sort INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT NOT NULL,
      body TEXT NOT NULL,
      date TEXT NOT NULL,
      read INTEGER NOT NULL,
      sort INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS sessions (
      token_hash TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      expires INTEGER NOT NULL
    );
  `);
  ensureCopy(db);
  ensureBlogs(db);
  const seeded = db.prepare("SELECT COUNT(*) AS n FROM admin").get();
  if (!seeded || Number(seeded.n) === 0) {
    const seed = JSON.parse(readFileSync(path.join(process.cwd(), "data", "db.json"), "utf8")) as Database;
    sealAdmin(seed);
    writeAll(db, seed);
  }
}

function sealAdmin(seed: Database) {
  const fromEnv = process.env.ADMIN_PASSWORD?.slice(0, 200) ?? "";
  const password = fromEnv.length >= 12 ? fromEnv : randomBytes(18).toString("base64url");
  const salt = randomBytes(16).toString("hex");
  seed.admin.email = seed.admin.email || "admin@muktidak71.org";
  seed.admin.salt = salt;
  seed.admin.passwordHash = scryptSync(password, salt, 32).toString("hex");
  if (fromEnv.length < 12) {
    writeFileSync(path.join(process.cwd(), "data", ".admin-password"), `${seed.admin.email}\n${password}\n`, { mode: 0o600 });
  }
}

function str(value: unknown) {
  return typeof value === "string" ? value : "";
}

function num(value: unknown) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function yes(value: unknown) {
  return Number(value) === 1;
}

function bit(value: boolean) {
  return value ? 1 : 0;
}

function readAll(db: Sql): Database {
  const settings = db.prepare("SELECT * FROM settings WHERE id = 1").get();
  const admin = db.prepare("SELECT email, salt, password_hash FROM admin WHERE id = 1").get();
  if (!settings || !admin) throw new Error("ডেটাবেস খালি");
  return {
    settings: mapSettings(settings),
    admin: {
      email: str(admin.email),
      salt: str(admin.salt),
      passwordHash: str(admin.password_hash),
    },
    members: db.prepare("SELECT * FROM members ORDER BY sort ASC").all().map(mapMember),
    donations: db.prepare("SELECT * FROM donations ORDER BY sort ASC").all().map(mapDonation),
    accounts: db.prepare("SELECT * FROM accounts ORDER BY sort ASC").all().map(mapAccount),
    notices: db.prepare("SELECT * FROM notices ORDER BY sort ASC").all().map(mapNotice),
    blogs: db.prepare("SELECT * FROM blogs ORDER BY sort ASC").all().map(mapBlog),
    pages: db.prepare("SELECT * FROM pages ORDER BY sort ASC").all().map(mapPage),
    media: db.prepare("SELECT * FROM media ORDER BY sort ASC").all().map(mapMedia),
    districts: db.prepare("SELECT * FROM districts ORDER BY sort ASC").all().map(mapDistrict),
    activities: db.prepare("SELECT * FROM activities ORDER BY sort ASC").all().map(mapActivity),
    messages: db.prepare("SELECT * FROM messages ORDER BY sort ASC").all().map(mapMessage),
  };
}

function writeAll(db: Sql, data: Database) {
  db.exec("BEGIN IMMEDIATE");
  try {
    db.exec(`
      DELETE FROM settings;
      DELETE FROM admin;
      DELETE FROM members;
      DELETE FROM donations;
      DELETE FROM accounts;
      DELETE FROM notices;
      DELETE FROM blogs;
      DELETE FROM pages;
      DELETE FROM media;
      DELETE FROM districts;
      DELETE FROM activities;
      DELETE FROM messages;
    `);
    db.prepare(
      "INSERT INTO settings (id, name, short_name, tagline, quote, phone, email, address, copy) VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?)",
    ).run(
      data.settings.name,
      data.settings.shortName,
      data.settings.tagline,
      data.settings.quote,
      data.settings.phone,
      data.settings.email,
      data.settings.address,
      JSON.stringify(mergeCopy(data.settings.copy)),
    );
    db.prepare("INSERT INTO admin (id, email, salt, password_hash) VALUES (1, ?, ?, ?)").run(
      data.admin.email,
      data.admin.salt,
      data.admin.passwordHash,
    );
    const member = db.prepare(
      "INSERT INTO members (id, name, phone, district, role, status, joined, sort) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    );
    data.members.forEach((item, sort) => member.run(item.id, item.name, item.phone, item.district, item.role, item.status, item.joined, sort));
    const donation = db.prepare(
      "INSERT INTO donations (id, donor, phone, amount, method, purpose, date, status, sort) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    );
    data.donations.forEach((item, sort) =>
      donation.run(item.id, item.donor, item.phone, Math.round(item.amount), item.method, item.purpose, item.date, item.status, sort),
    );
    const account = db.prepare(
      "INSERT INTO accounts (id, bank, branch, account_name, account_number, account_type, visible, sort) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    );
    data.accounts.forEach((item, sort) =>
      account.run(item.id, item.bank, item.branch, item.accountName, item.accountNumber, item.accountType, bit(item.visible), sort),
    );
    const notice = db.prepare(
      "INSERT INTO notices (id, title, body, date, published, sort) VALUES (?, ?, ?, ?, ?, ?)",
    );
    data.notices.forEach((item, sort) => notice.run(item.id, item.title, item.body, item.date, bit(item.published), sort));
    const blog = db.prepare(
      "INSERT INTO blogs (id, slug, title, excerpt, body, cover, author, date, published, sort) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    );
    (data.blogs ?? []).forEach((item, sort) =>
      blog.run(item.id, item.slug, item.title, item.excerpt, item.body, item.cover, item.author, item.date, bit(item.published), sort),
    );
    const page = db.prepare("INSERT INTO pages (id, slug, title, body, sort) VALUES (?, ?, ?, ?, ?)");
    data.pages.forEach((item, sort) => page.run(item.id, item.slug, item.title, item.body, sort));
    const media = db.prepare(
      "INSERT INTO media (id, name, folder, size, url, private, stored, sort) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    );
    data.media.forEach((item, sort) =>
      media.run(item.id, item.name, item.folder, Math.round(item.size), item.url, bit(item.private), item.stored ?? "", sort),
    );
    const district = db.prepare(
      "INSERT INTO districts (id, name, office, contact, phone, members, sort) VALUES (?, ?, ?, ?, ?, ?, ?)",
    );
    data.districts.forEach((item, sort) =>
      district.run(item.id, item.name, item.office, item.contact, item.phone, Math.round(item.members), sort),
    );
    const activity = db.prepare(
      "INSERT INTO activities (id, title, summary, date, sort) VALUES (?, ?, ?, ?, ?)",
    );
    data.activities.forEach((item, sort) => activity.run(item.id, item.title, item.summary, item.date, sort));
    const message = db.prepare(
      "INSERT INTO messages (id, name, phone, email, body, date, read, sort) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    );
    data.messages.forEach((item, sort) =>
      message.run(item.id, item.name, item.phone, item.email, item.body, item.date, bit(item.read), sort),
    );
    db.exec("COMMIT");
  } catch (error) {
    try {
      db.exec("ROLLBACK");
    } catch {
      /* already closed */
    }
    throw error;
  }
}

function mapSettings(row: Record<string, unknown>): Settings {
  return {
    name: str(row.name),
    shortName: str(row.short_name),
    tagline: str(row.tagline),
    quote: str(row.quote),
    phone: str(row.phone),
    email: str(row.email),
    address: str(row.address),
    copy: parseCopy(row.copy),
  };
}

function mapMember(row: Record<string, unknown>): Member {
  return {
    id: str(row.id),
    name: str(row.name),
    phone: str(row.phone),
    district: str(row.district),
    role: str(row.role),
    status: row.status === "inactive" ? "inactive" : "active",
    joined: str(row.joined),
  };
}

function mapDonation(row: Record<string, unknown>): Donation {
  return {
    id: str(row.id),
    donor: str(row.donor),
    phone: str(row.phone),
    amount: num(row.amount),
    method: str(row.method),
    purpose: str(row.purpose),
    date: str(row.date),
    status: row.status === "pending" ? "pending" : "received",
  };
}

function mapAccount(row: Record<string, unknown>): BankAccount {
  return {
    id: str(row.id),
    bank: str(row.bank),
    branch: str(row.branch),
    accountName: str(row.account_name),
    accountNumber: str(row.account_number),
    accountType: str(row.account_type),
    visible: yes(row.visible),
  };
}

function mapNotice(row: Record<string, unknown>): Notice {
  return {
    id: str(row.id),
    title: str(row.title),
    body: str(row.body),
    date: str(row.date),
    published: yes(row.published),
  };
}

function mapBlog(row: Record<string, unknown>): BlogPost {
  return {
    id: str(row.id),
    slug: str(row.slug),
    title: str(row.title),
    excerpt: str(row.excerpt),
    body: str(row.body),
    cover: str(row.cover),
    author: str(row.author),
    date: str(row.date),
    published: yes(row.published),
  };
}

function mapPage(row: Record<string, unknown>): PageContent {
  return { id: str(row.id), slug: str(row.slug), title: str(row.title), body: str(row.body) };
}

function mapMedia(row: Record<string, unknown>): MediaItem {
  return {
    id: str(row.id),
    name: str(row.name),
    folder: str(row.folder),
    size: num(row.size),
    url: str(row.url),
    private: yes(row.private),
    stored: str(row.stored),
  };
}

function mapDistrict(row: Record<string, unknown>): District {
  return {
    id: str(row.id),
    name: str(row.name),
    office: str(row.office),
    contact: str(row.contact),
    phone: str(row.phone),
    members: num(row.members),
  };
}

function mapActivity(row: Record<string, unknown>): Activity {
  return { id: str(row.id), title: str(row.title), summary: str(row.summary), date: str(row.date) };
}

function mapMessage(row: Record<string, unknown>): Message {
  return {
    id: str(row.id),
    name: str(row.name),
    phone: str(row.phone),
    email: str(row.email),
    body: str(row.body),
    date: str(row.date),
    read: yes(row.read),
  };
}

export function readDb(): Database {
  return readAll(open());
}

export function writeDb(db: Database) {
  writeAll(open(), db);
}

export function updateDb(mutator: (db: Database) => void) {
  const db = readAll(open());
  mutator(db);
  writeAll(open(), db);
  return db;
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

export function getSettings(): Settings {
  const row = open()
    .prepare("SELECT name, short_name, tagline, quote, phone, email, address, copy FROM settings WHERE id = 1")
    .get();
  if (!row) throw new Error("সেটিংস নেই");
  return mapSettings(row);
}

export function getActivities(): Activity[] {
  return open().prepare("SELECT id, title, summary, date FROM activities ORDER BY sort ASC").all().map(mapActivity);
}

export function getPublishedNotices(): Notice[] {
  return open()
    .prepare("SELECT id, title, body, date, published FROM notices WHERE published = 1 ORDER BY sort ASC")
    .all()
    .map(mapNotice);
}

export function getPublishedBlogs(): BlogPost[] {
  return open()
    .prepare("SELECT id, slug, title, excerpt, body, cover, author, date, published FROM blogs WHERE published = 1 ORDER BY sort ASC")
    .all()
    .map(mapBlog);
}

export function getPublishedBlog(slug: string): BlogPost | null {
  if (!/^[a-z0-9-]{1,80}$/.test(slug)) return null;
  const row = open()
    .prepare("SELECT id, slug, title, excerpt, body, cover, author, date, published FROM blogs WHERE slug = ? AND published = 1")
    .get(slug);
  return row ? mapBlog(row) : null;
}

export function getPublishedNotice(id: string): Notice | null {
  if (!safeId(id)) return null;
  const row = open()
    .prepare("SELECT id, title, body, date, published FROM notices WHERE id = ? AND published = 1")
    .get(id);
  return row ? mapNotice(row) : null;
}

export function getPublicMedia(): MediaItem[] {
  return open()
    .prepare("SELECT id, name, folder, size, url, private FROM media WHERE private = 0 AND url != '' ORDER BY sort ASC")
    .all()
    .map(mapMedia);
}

export function getDistricts(): District[] {
  return open()
    .prepare("SELECT id, name, office, contact, phone, members FROM districts ORDER BY sort ASC")
    .all()
    .map(mapDistrict);
}

export function getVisibleAccounts(): BankAccount[] {
  return open()
    .prepare(
      "SELECT id, bank, branch, account_name, account_number, account_type, visible FROM accounts WHERE visible = 1 ORDER BY sort ASC",
    )
    .all()
    .map(mapAccount);
}

export function getPage(slug: string): PageContent | null {
  if (!/^[a-z0-9-]{1,40}$/.test(slug)) return null;
  const row = open().prepare("SELECT id, slug, title, body FROM pages WHERE slug = ?").get(slug);
  return row ? mapPage(row) : null;
}

export function publicCounts() {
  const db = open();
  const total = db.prepare("SELECT COALESCE(SUM(amount), 0) AS n FROM donations WHERE status = 'received'").get();
  const active = db.prepare("SELECT COUNT(*) AS n FROM members WHERE status = 'active'").get();
  const districts = db.prepare("SELECT COUNT(*) AS n FROM districts").get();
  return {
    donationTotal: num(total?.n),
    activeMembers: num(active?.n),
    districtCount: num(districts?.n),
  };
}

export function getAdmin(): AdminAuth {
  const row = open().prepare("SELECT email, salt, password_hash FROM admin WHERE id = 1").get();
  if (!row) throw new Error("অ্যাডমিন নেই");
  return { email: str(row.email), salt: str(row.salt), passwordHash: str(row.password_hash) };
}

export function saveSession(tokenHash: string, email: string, expires: number) {
  const db = open();
  db.prepare("INSERT INTO sessions (token_hash, email, expires) VALUES (?, ?, ?)").run(tokenHash, email, expires);
  db.prepare("DELETE FROM sessions WHERE expires < ?").run(Date.now());
}

export function findSession(tokenHash: string) {
  const row = open().prepare("SELECT email, expires FROM sessions WHERE token_hash = ?").get(tokenHash);
  if (!row) return null;
  return { email: str(row.email), expires: num(row.expires) };
}

export function deleteSession(tokenHash: string) {
  open().prepare("DELETE FROM sessions WHERE token_hash = ?").run(tokenHash);
}

export function revokeAllSessions() {
  open().exec("DELETE FROM sessions");
}

export function privateUploadsDir() {
  const dir = path.join(process.cwd(), "data", "uploads");
  mkdirSync(dir, { recursive: true });
  return dir;
}

export function mediaRecord(id: string) {
  if (!safeId(id)) return null;
  const row = open().prepare("SELECT private, url, stored FROM media WHERE id = ?").get(id);
  if (!row) return null;
  return { private: yes(row.private), url: str(row.url), stored: str(row.stored) };
}

export function unlinkStored(stored: string) {
  if (!stored) return;
  const name = path.basename(stored);
  if (!/^[A-Za-z0-9-]+\.(jpg|jpeg|png|webp|gif)$/.test(name)) return;
  const target = path.join(process.cwd(), "data", "uploads", name);
  try {
    unlinkSync(target);
  } catch {
    /* already gone */
  }
}
