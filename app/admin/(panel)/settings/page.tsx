import { getSettings, readDb } from "@/lib/db";
import { SettingsView } from "./view";

export const dynamic = "force-dynamic";

export default async function Page() {
  const [settings, db] = await Promise.all([getSettings(), readDb()]);
  return <SettingsView initial={settings} email={db.admin.email} />;
}
