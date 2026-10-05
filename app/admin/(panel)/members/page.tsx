import { readDb } from "@/lib/db";
import { MembersView } from "./view";

export const dynamic = "force-dynamic";

export default async function Page() {
  return <MembersView initial={(await readDb()).members} />;
}
