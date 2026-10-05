import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/format";
import type { Notice } from "@/lib/types";

export function NoticeRow({ notice, excerpt = false }: { notice: Notice; excerpt?: boolean }) {
  return (
    <Link href={`/notices/${notice.id}`} className="group block rounded-xl focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
      <Card className="doc-row gap-2 border-l-4 border-l-transparent ring-forest/8 group-hover:border-l-destructive">
        <CardHeader>
          <Badge variant="outline" className="h-6 border-forest/15 px-2.5 text-forest/70">
            {formatDate(notice.date)}
          </Badge>
          <CardTitle className="mt-1 line-clamp-2 text-lg leading-snug text-ink transition-colors group-hover:text-forest">
            {notice.title}
          </CardTitle>
          {excerpt && notice.body ? <CardDescription className="line-clamp-2">{notice.body}</CardDescription> : null}
        </CardHeader>
      </Card>
    </Link>
  );
}
