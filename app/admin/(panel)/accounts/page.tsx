import { readDb } from "@/lib/db";
import { AccountsView } from "./view";

export const dynamic = "force-dynamic";

export default async function Page() {
  return <AccountsView initial={(await readDb()).accounts} />;
}
