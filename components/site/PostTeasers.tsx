import Link from "next/link";
import type { Post } from "@/lib/types";

export function PostTeasers({ posts, readMore }: { posts: Post[]; readMore: string }) {
  if (posts.length === 0) return null;
  return (
    <ul className="grid gap-4">
      {posts.map((post) => (
        <li key={post.id} className="border-t border-forest/10 pt-4 first:border-0 first:pt-0">
          <p className="break-words text-base leading-snug text-ink">{post.title}</p>
          <Link
            href={`/posts/${post.id}`}
            className="mt-1 inline-block text-sm font-semibold text-leaf underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            aria-label={`${readMore}: ${post.title}`}
          >
            {readMore}
          </Link>
        </li>
      ))}
    </ul>
  );
}
