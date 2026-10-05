import { readDb } from "@/lib/db";
import { NoticesView } from "./view";

export const dynamic = "force-dynamic";

export default function Page() {
  return <NoticesView initial={readDb().notices} />;
}
