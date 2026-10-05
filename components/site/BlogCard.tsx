import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/format";
import type { BlogPost } from "@/lib/types";

const fallbacks = [
  { src: "/history/speech.jpg", tint: "tile-blue" },
  { src: "/history/fighters.jpg", tint: "tile-green" },
  { src: "/history/victory.jpg", tint: "tile-red" },
];

export function BlogCard({ post, index = 0 }: { post: BlogPost; index?: number }) {
  const fallback = fallbacks[index % fallbacks.length];
  return (
    <Link href={`/blogs/${post.slug}`} className="group block h-full rounded-xl">
      <Card className="lift h-full gap-0 pt-0">
        <div className={`tile rounded-none ${fallback.tint}`} style={{ aspectRatio: "16 / 9" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.cover || fallback.src} alt="" loading="lazy" />
        </div>
        <CardHeader className="pt-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{formatDate(post.date)}</Badge>
            {post.author ? <span className="text-xs text-muted-foreground">{post.author}</span> : null}
          </div>
          <CardTitle className="mt-2 text-xl text-forest">{post.title}</CardTitle>
        </CardHeader>
        {post.excerpt ? (
          <CardContent className="pt-2">
            <CardDescription className="line-clamp-3 leading-relaxed">{post.excerpt}</CardDescription>
          </CardContent>
        ) : null}
        <CardFooter className="mt-auto border-t-0 bg-transparent pt-4 text-sm font-medium text-destructive">
          <span className="border-b border-transparent transition-colors group-hover:border-destructive">পড়ুন</span>
        </CardFooter>
      </Card>
    </Link>
  );
}
