import { readDb } from "@/lib/db";
import { SettingsView } from "./view";

export const dynamic = "force-dynamic";

export default function Page() {
  const db = readDb();
  return <SettingsView initial={db.settings} email={db.admin.email} />;
}
