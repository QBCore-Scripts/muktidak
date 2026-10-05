import { readDb } from "@/lib/db";
import { AccountsView } from "./view";

export const dynamic = "force-dynamic";

export default function Page() {
  return <AccountsView initial={readDb().accounts} />;
}
