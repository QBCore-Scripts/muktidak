import { readDb } from "@/lib/db";
import { MessagesView } from "./view";

export const dynamic = "force-dynamic";

export default async function Page() {
  return <MessagesView initial={(await readDb()).messages} />;
}
