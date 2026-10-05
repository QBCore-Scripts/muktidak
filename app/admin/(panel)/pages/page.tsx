import { readDb } from "@/lib/db";
import { PagesView } from "./view";

export const dynamic = "force-dynamic";

export default async function Page() {
  const db = await readDb();
  return <PagesView pages={db.pages} activities={db.activities} />;
}
