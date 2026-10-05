import { readDb } from "@/lib/db";
import { PagesView } from "./view";

export const dynamic = "force-dynamic";

export default function Page() {
  const db = readDb();
  return <PagesView pages={db.pages} activities={db.activities} />;
}
