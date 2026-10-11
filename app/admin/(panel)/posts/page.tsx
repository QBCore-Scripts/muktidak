import { readDb } from "@/lib/db";
import { PostsView } from "./view";

export const dynamic = "force-dynamic";

export default async function Page() {
  const db = await readDb();
  return <PostsView initial={db.posts ?? []} media={db.media.filter((item) => item.url)} />;
}
