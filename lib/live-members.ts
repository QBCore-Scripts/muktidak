import mongoose from "mongoose";
import connectToDatabase from "./mongodb";

const BASE = 28790;
const DAY_MS = 24 * 60 * 60 * 1000;
const DHAKA_MS = 6 * 60 * 60 * 1000;
const ID = "active";

type LiveDoc = {
  _id: string;
  base?: number;
  count?: number;
  appliedUntil?: number;
  originMs?: number;
};

function liveModel() {
  const cached = mongoose.models.LiveMembers as mongoose.Model<LiveDoc> | undefined;
  if (cached?.schema.path("appliedUntil")) return cached;
  if (cached) mongoose.deleteModel("LiveMembers");
  return mongoose.model<LiveDoc>(
    "LiveMembers",
    new mongoose.Schema(
      {
        _id: String,
        base: Number,
        count: Number,
        appliedUntil: Number,
        originMs: Number,
      },
      { versionKey: false, collection: "live_members" },
    ),
  );
}

let memory: { count: number; nextAt: number } | null = null;

function mix(n: number) {
  let x = (n | 0) ^ 0x9e3779b9;
  x = Math.imul(x, 0x85ebca6b);
  x ^= x >>> 13;
  x = Math.imul(x, 0xc2b2ae35);
  x ^= x >>> 16;
  return x >>> 0;
}

export function dayIndex(ms: number) {
  return Math.floor((ms + DHAKA_MS) / DAY_MS);
}

export function dayStart(day: number) {
  return day * DAY_MS - DHAKA_MS;
}

export function dayTotal(day: number) {
  return 10 + (mix(day) % 21);
}

/** One +1 at a random moment inside each slice of the Dhaka day. A full day adds 10–30. */
export function tickOffsets(day: number) {
  const total = dayTotal(day);
  const slot = Math.floor(DAY_MS / total);
  const margin = Math.floor(slot * 0.2);
  const room = Math.max(1, slot - margin * 2);
  const offsets: number[] = [];
  for (let i = 0; i < total; i++) offsets.push(i * slot + margin + (mix(day ^ (i + 1) * 0x45d9f3b) % room));
  return offsets;
}

export function countTicks(fromExclusive: number, toInclusive: number) {
  if (toInclusive <= fromExclusive) return 0;
  let total = 0;
  const endDay = dayIndex(toInclusive);
  for (let day = dayIndex(fromExclusive); day <= endDay; day++) {
    const start = dayStart(day);
    for (const offset of tickOffsets(day)) {
      const at = start + offset;
      if (at > fromExclusive && at <= toInclusive) total += 1;
    }
  }
  return total;
}

export function nextTickAfter(ms: number) {
  const startDay = dayIndex(ms);
  for (let day = startDay; day <= startDay + 3; day++) {
    const start = dayStart(day);
    for (const offset of tickOffsets(day)) {
      const at = start + offset;
      if (at > ms) return at;
    }
  }
  return dayStart(startDay + 4);
}

async function readDoc(now: number) {
  const LiveMembers = liveModel();
  const existing = await LiveMembers.findById(ID).lean<LiveDoc>();
  if (existing) return existing;
  try {
    await LiveMembers.create({ _id: ID, base: BASE, count: BASE, appliedUntil: now, originMs: now });
  } catch (error) {
    if ((error as { code?: number }).code !== 11000) throw error;
  }
  const doc = await LiveMembers.findById(ID).lean<LiveDoc>();
  if (!doc) throw new Error("সদস্য সংখ্যা সেভ হয়নি");
  return doc;
}

export async function liveActiveMembers() {
  const now = Date.now();
  if (memory && now < memory.nextAt) return memory;

  await connectToDatabase();
  const LiveMembers = liveModel();
  let doc = await readDoc(now);
  for (let attempt = 0; attempt < 5; attempt++) {
    const at = Date.now();
    if (typeof doc.appliedUntil !== "number" || typeof doc.count !== "number") {
      const count = typeof doc.count === "number" ? doc.count : BASE;
      const saved = await LiveMembers.updateOne(
        { _id: ID, appliedUntil: { $exists: false } },
        { $set: { base: BASE, count, appliedUntil: at, originMs: at } },
      );
      if (saved.matchedCount === 1) doc = { ...doc, base: BASE, count, appliedUntil: at, originMs: at };
      else {
        const fresh = await LiveMembers.findById(ID).lean<LiveDoc>();
        if (!fresh) throw new Error("সদস্য সংখ্যা সেভ হয়নি");
        doc = fresh;
      }
      continue;
    }

    const due = countTicks(doc.appliedUntil, at);
    const nextAt = nextTickAfter(Math.max(at, doc.appliedUntil));
    if (due === 0) {
      memory = { count: doc.count, nextAt };
      return memory;
    }
    const count = doc.count + due;
    const saved = await LiveMembers.updateOne({ _id: ID, appliedUntil: doc.appliedUntil }, { $set: { count, appliedUntil: at } });
    if (saved.matchedCount === 1) {
      memory = { count, nextAt: nextTickAfter(at) };
      return memory;
    }
    const fresh = await LiveMembers.findById(ID).lean<LiveDoc>();
    if (!fresh) throw new Error("সদস্য সংখ্যা সেভ হয়নি");
    doc = fresh;
  }
  throw new Error("সদস্য সংখ্যা সেভ হয়নি");
}
