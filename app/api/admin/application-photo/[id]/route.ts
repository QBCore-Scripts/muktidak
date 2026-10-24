import { getSession } from "@/lib/auth";
import { readDb, readMediaFile, safeId } from "@/lib/db";

const types: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, ctx: Ctx) {
  if (!(await getSession())) return new Response(null, { status: 401 });
  const { id } = await ctx.params;
  if (!safeId(id)) return new Response(null, { status: 404 });
  const item = (await readDb()).applications.find((row) => row.id === id);
  const stored = item?.photoStored ?? "";
  const type = types[stored.split(".").pop()?.toLowerCase() ?? ""];
  if (!item || !type) return new Response(null, { status: 404 });
  const data = await readMediaFile(stored);
  if (!data) return new Response(null, { status: 404 });
  return new Response(new Uint8Array(data), {
    headers: {
      "Content-Type": type,
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'",
      "Cache-Control": "private, no-store",
    },
  });
}
