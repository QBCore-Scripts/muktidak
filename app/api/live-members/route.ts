import { liveActiveMembers } from "@/lib/live-members";

export const dynamic = "force-dynamic";

export async function GET() {
  const live = await liveActiveMembers();
  return Response.json(live, { headers: { "Cache-Control": "no-store" } });
}
