import { readDb } from "@/lib/db";
import { MembersView } from "./view";

export const dynamic = "force-dynamic";

export default function Page() {
  return <MembersView initial={readDb().members} />;
}
