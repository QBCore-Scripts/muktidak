import { readDb } from "@/lib/db";
import { BlogsView } from "./view";

export const dynamic = "force-dynamic";

export default async function Page() {
  const db = await readDb();
  return <BlogsView initial={db.blogs} media={db.media.filter((item) => item.url)} />;
}
