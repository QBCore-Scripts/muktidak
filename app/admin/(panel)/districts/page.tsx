import { readDb } from "@/lib/db";
import { DistrictsView } from "./view";

export const dynamic = "force-dynamic";

export default function Page() {
  return <DistrictsView initial={readDb().districts} />;
}
