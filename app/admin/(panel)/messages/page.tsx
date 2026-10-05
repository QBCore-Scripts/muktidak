import { readDb } from "@/lib/db";
import { MessagesView } from "./view";

export const dynamic = "force-dynamic";

export default function Page() {
  return <MessagesView initial={readDb().messages} />;
}
