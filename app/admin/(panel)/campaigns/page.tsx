import { readDb } from "@/lib/db";
import { CampaignsView } from "./view";

export const dynamic = "force-dynamic";

export default async function Page() {
  const db = await readDb();
  return <CampaignsView initial={db.campaigns ?? []} media={db.media.filter((item) => item.url && !item.private)} />;
}
