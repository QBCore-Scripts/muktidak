import { readFileSync } from "fs";
import path from "path";
import { getSession } from "@/lib/auth";
import { mediaRecord } from "@/lib/db";

const types: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
};

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, ctx: Ctx) {
  const row = mediaRecord((await ctx.params).id);
  if (!row) return new Response(null, { status: 404 });
  if (row.private && !(await getSession())) return new Response(null, { status: 404 });
  const name = storedName(row.stored);
  if (!name) return new Response(null, { status: 404 });
  const type = types[path.extname(name).slice(1).toLowerCase()];
  if (!type) return new Response(null, { status: 404 });
  return new Response(readFileSync(path.join(process.cwd(), "data", "uploads", name)), {
    headers: {
      "Content-Type": type,
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'",
      "Cache-Control": row.private ? "private, no-store" : "public, max-age=86400",
    },
  });
}

function storedName(stored: string) {
  if (!stored) return "";
  const name = path.basename(stored);
  if (!/^[A-Za-z0-9-]+\.(jpg|jpeg|png|webp|gif)$/.test(name)) return "";
  const root = path.resolve(process.cwd(), "data", "uploads");
  const target = path.resolve(root, name);
  if (!target.startsWith(root + path.sep)) return "";
  return name;
}
