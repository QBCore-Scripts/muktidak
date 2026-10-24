import { readDb } from "@/lib/db";
import { ApplicationsView } from "./view";

export const dynamic = "force-dynamic";

export default async function Page() {
  return <ApplicationsView initial={(await readDb()).applications} />;
}
