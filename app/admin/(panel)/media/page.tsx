import { readDb, withoutStored } from "@/lib/db";
import { MediaView } from "./view";

export const dynamic = "force-dynamic";

export default async function Page() {
  return <MediaView initial={(await readDb()).media.map((item) => withoutStored(item))} />;
}
