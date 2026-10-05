const hits = new Map<string, { n: number; reset: number }>();

export function clientKey(request: Request, bucket: string) {
  const forwarded =
    process.env.TRUST_PROXY === "1" ? (request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "") : "";
  const ip = (forwarded || "local").slice(0, 64).replace(/[^a-zA-Z0-9:.]/g, "");
  return `${bucket}:${ip || "local"}`;
}

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  if (hits.size > 5000) {
    for (const [name, row] of hits) {
      if (row.reset < now) hits.delete(name);
    }
  }
  const row = hits.get(key);
  if (!row || row.reset < now) {
    hits.set(key, { n: 1, reset: now + windowMs });
    return true;
  }
  row.n += 1;
  return row.n <= limit;
}

function limited() {
  return Response.json(
    { error: "অনেকবার চেষ্টা হয়েছে। কিছুক্ষণ পর আবার চেষ্টা করুন।" },
    { status: 429, headers: { "Retry-After": "60", "Cache-Control": "no-store" } },
  );
}

export function assertRate(request: Request, bucket: string, limit: number, windowMs: number) {
  const key = clientKey(request, bucket);
  if (key.endsWith(":local")) return null;
  if (rateLimit(key, limit, windowMs)) return null;
  return limited();
}

export function assertGlobal(bucket: string, limit: number, windowMs: number) {
  if (rateLimit(`global:${bucket}`, limit, windowMs)) return null;
  return limited();
}

export function assertSameOrigin(request: Request) {
  const host = request.headers.get("host");
  const origin = request.headers.get("origin");
  if (!host || !origin) return Response.json({ error: "অনুরোধ গ্রহণযোগ্য নয়" }, { status: 403 });
  try {
    if (new URL(origin).host !== host) {
      return Response.json({ error: "অনুরোধ গ্রহণযোগ্য নয়" }, { status: 403 });
    }
  } catch {
    return Response.json({ error: "অনুরোধ গ্রহণযোগ্য নয়" }, { status: 403 });
  }
  return null;
}

export async function readJson(request: Request, max: number) {
  const advertised = Number(request.headers.get("content-length") || "0");
  if (!Number.isFinite(advertised) || advertised <= 0 || advertised > max) return null;
  const text = await request.text();
  if (text.length > max) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}

export function plain(value: unknown, max: number) {
  if (typeof value !== "string") return "";
  return value.replace(/[\u0000-\u001F\u007F]/g, "").trim().slice(0, max);
}
