import { createHash, timingSafeEqual } from "crypto";
import { clearSession, getSession, setSession, verifyPassword } from "@/lib/auth";
import { getAdmin } from "@/lib/db";
import { assertGlobal, assertRate, assertSameOrigin, plain, readJson } from "@/lib/guard";

export async function POST(request: Request) {
  const blocked =
    assertSameOrigin(request) ??
    assertRate(request, "login", 8, 15 * 60 * 1000) ??
    assertGlobal("login", 30, 15 * 60 * 1000);
  if (blocked) return blocked;
  const body = (await readJson(request, 2_000)) as { email?: unknown; password?: unknown } | null;
  const email = plain(body?.email, 120).toLowerCase();
  const password = typeof body?.password === "string" ? body.password.slice(0, 200) : "";
  const admin = getAdmin();
  const passwordOk = verifyPassword(password, admin.salt, admin.passwordHash);
  const emailOk = timingSafeEqual(createHash("sha256").update(email).digest(), createHash("sha256").update(admin.email.toLowerCase()).digest());
  if (!emailOk || !passwordOk) {
    return Response.json({ error: "ইমেইল বা পাসওয়ার্ড মিলছে না" }, { status: 401, headers: { "Cache-Control": "no-store" } });
  }
  await setSession(admin.email);
  return Response.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
}

export async function DELETE(request: Request) {
  const blocked = assertSameOrigin(request);
  if (blocked) return blocked;
  await clearSession();
  return Response.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
}

export async function GET() {
  const session = await getSession();
  if (!session) return Response.json({ user: null }, { status: 401, headers: { "Cache-Control": "no-store" } });
  return Response.json({ user: { email: session.email } }, { headers: { "Cache-Control": "no-store" } });
}
