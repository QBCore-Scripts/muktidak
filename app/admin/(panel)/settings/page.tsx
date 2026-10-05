import { readDb } from "@/lib/db";
import { SettingsView } from "./view";

export const dynamic = "force-dynamic";

export default async function Page() {
  const db = await readDb();
  return <SettingsView initial={db.settings} email={db.admin.email} />;
}
