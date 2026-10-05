import { getSession } from "@/lib/auth";
import { newId, readDb, updateDb } from "@/lib/db";
import { todayISO } from "@/lib/format";
import { assertGlobal, assertRate, assertSameOrigin, plain, readJson } from "@/lib/guard";
import { revalidatePath } from "next/cache";

const MAX = 2000;

export async function POST(request: Request) {
  const blocked =
    assertSameOrigin(request) ??
    assertRate(request, "contact", 5, 60 * 60 * 1000) ??
    assertGlobal("contact", 40, 60 * 60 * 1000);
  if (blocked) return blocked;
  const body = (await readJson(request, 8_000)) as Record<string, unknown> | null;
  if (!body) return Response.json({ error: "তথ্য পাওয়া যায়নি" }, { status: 400 });
  if (plain(body.company, 80)) return Response.json({ ok: true });
  const name = plain(body.name, 80);
  const phone = plain(body.phone, 30);
  const email = plain(body.email, 120);
  const message = plain(body.body, MAX);
  if (!name || !phone || !message) {
    return Response.json({ error: "নাম, ফোন ও বার্তা দিন" }, { status: 400 });
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: "ইমেইল সঠিক নয়" }, { status: 400 });
  }
  await updateDb((db) => {
    db.messages.unshift({
      id: newId(),
      name,
      phone,
      email,
      body: message,
      date: todayISO(),
      read: false,
    });
    db.messages = db.messages.slice(0, 200);
  });
  revalidatePath("/", "layout");
  return Response.json({ ok: true });
}

export async function GET() {
  const session = await getSession();
  if (!session) return Response.json({ error: "প্রবেশ করা প্রয়োজন" }, { status: 401 });
  return Response.json(
    (await readDb()).messages.map(({ name, phone, email, body, date, read, id }) => ({ id, name, phone, email, body, date, read })),
  );
}
