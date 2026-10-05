import { readDb } from "@/lib/db";
import { DonationsView } from "./view";

export const dynamic = "force-dynamic";

export default function Page() {
  return <DonationsView initial={readDb().donations} />;
}
