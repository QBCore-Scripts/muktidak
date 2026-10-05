import { readDb } from "@/lib/db";
import { BlogsView } from "./view";

export const dynamic = "force-dynamic";

export default function Page() {
  const db = readDb();
  return <BlogsView initial={db.blogs} media={db.media.filter((item) => item.url)} />;
}
