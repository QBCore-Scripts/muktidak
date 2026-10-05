import { readDb, withoutStored } from "@/lib/db";
import { MediaView } from "./view";

export const dynamic = "force-dynamic";

export default function Page() {
  return <MediaView initial={readDb().media.map((item) => withoutStored(item))} />;
}
