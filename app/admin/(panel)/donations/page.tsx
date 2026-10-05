import { readDb } from "@/lib/db";
import { DonationsView } from "./view";

export const dynamic = "force-dynamic";

export default async function Page() {
  return <DonationsView initial={(await readDb()).donations} />;
}
