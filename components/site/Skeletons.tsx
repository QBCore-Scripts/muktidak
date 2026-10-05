import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

function Shell({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("skeleton-in", className)} aria-busy="true" aria-live="polite">
      {children}
    </div>
  );
}

function Lines({ count = 2, className }: { count?: number; className?: string }) {
  return (
    <div className={cn("grid gap-2", className)}>
      {Array.from({ length: count }, (_, index) => (
        <Skeleton key={index} className={cn("h-3.5", index === count - 1 ? "w-2/3" : "w-full")} />
      ))}
    </div>
  );
}

export function PageHeaderSkeleton() {
  return (
    <header className="border-b border-line bg-paper">
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div className="flex items-center gap-3">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-3 w-32" />
        </div>
        <Skeleton className="mt-5 h-11 w-3/4 max-w-xl md:h-14" />
        <Lines count={2} className="mt-5 max-w-2xl" />
      </div>
    </header>
  );
}

function CardSkeleton({ image = false }: { image?: boolean }) {
  return (
    <Card className={cn("h-full ring-forest/8", image && "gap-0 pt-0")}>
      {image ? <Skeleton className="aspect-video w-full rounded-none" /> : null}
      <CardHeader className={image ? "pt-5" : undefined}>
        <Skeleton className="h-5 w-24 rounded-full" />
        <Skeleton className="mt-2 h-6 w-4/5" />
      </CardHeader>
      <CardContent className={image ? "pt-3" : undefined}>
        <Lines count={3} />
      </CardContent>
    </Card>
  );
}

export function CardGridSkeleton({ count = 4, columns = 2, image = false }: { count?: number; columns?: 2 | 3; image?: boolean }) {
  return (
    <Shell>
      <PageHeaderSkeleton />
      <div className={cn("mx-auto grid max-w-6xl gap-5 px-4 py-12", columns === 3 ? "sm:grid-cols-2 lg:grid-cols-3" : "md:grid-cols-2")}>
        {Array.from({ length: count }, (_, index) => (
          <CardSkeleton key={index} image={image} />
        ))}
      </div>
    </Shell>
  );
}

function RowSkeleton() {
  return (
    <Card className="gap-2 ring-forest/8">
      <CardHeader>
        <Skeleton className="h-6 w-28 rounded-full" />
        <Skeleton className="mt-1 h-5 w-3/4" />
      </CardHeader>
    </Card>
  );
}

export function ListSkeleton() {
  return (
    <Shell>
      <PageHeaderSkeleton />
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="grid gap-3 rounded-[1.75rem] bg-[#e6eef0] p-4 md:p-6">
          {Array.from({ length: 4 }, (_, index) => (
            <RowSkeleton key={index} />
          ))}
        </div>
      </div>
    </Shell>
  );
}

export function TileGridSkeleton() {
  return (
    <Shell>
      <PageHeaderSkeleton />
      <div className="mx-auto grid max-w-6xl gap-5 px-4 py-12 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton key={index} className="aspect-[4/3] rounded-2xl" />
        ))}
      </div>
    </Shell>
  );
}

export function ArticleSkeleton() {
  return (
    <Shell className="mx-auto my-10 max-w-3xl rounded-2xl border border-line bg-paper px-6 py-10">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="mt-6 h-4 w-40" />
      <Skeleton className="mt-3 h-10 w-4/5" />
      <Lines count={4} className="mt-8" />
      <Lines count={3} className="mt-6" />
    </Shell>
  );
}

export function ContactSkeleton() {
  return (
    <Shell>
      <PageHeaderSkeleton />
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-[.8fr_1.1fr]">
        <Skeleton className="h-72 rounded-3xl bg-forest/15" />
        <Card className="rounded-3xl ring-forest/8">
          <CardHeader>
            <Skeleton className="h-7 w-40" />
            <Skeleton className="mt-2 h-4 w-2/3" />
          </CardHeader>
          <CardContent className="grid gap-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Skeleton className="h-11" />
              <Skeleton className="h-11" />
            </div>
            <Skeleton className="h-11" />
            <Skeleton className="h-32" />
          </CardContent>
          <CardFooter className="bg-paper">
            <Skeleton className="h-12 w-36 rounded-full" />
          </CardFooter>
        </Card>
      </div>
    </Shell>
  );
}

export function HomeSkeleton() {
  return (
    <Shell>
      <section className="bg-forest-deep">
        <div className="mx-auto grid min-h-[min(82vh,46rem)] max-w-6xl content-center gap-6 px-4 pb-40 pt-16">
          <Skeleton className="h-7 w-28 rounded-full bg-white/10" />
          <Skeleton className="h-16 w-full max-w-xl bg-white/10 md:h-24" />
          <Skeleton className="h-16 w-3/4 max-w-md bg-white/10 md:h-24" />
          <Skeleton className="h-4 w-full max-w-lg bg-white/10" />
          <div className="mt-4 flex gap-3">
            <Skeleton className="h-12 w-36 rounded-full bg-white/15" />
            <Skeleton className="h-12 w-36 rounded-full bg-white/10" />
          </div>
        </div>
      </section>
      <div className="relative mx-auto -mt-24 grid max-w-6xl gap-3 px-4 sm:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <Card key={index} className="gap-3 rounded-2xl px-6 py-6 ring-forest/8">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-9 w-32" />
          </Card>
        ))}
      </div>
      <div className="mx-auto grid max-w-6xl gap-5 px-4 pt-14 sm:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <Skeleton key={index} className="aspect-[4/3] rounded-2xl" />
        ))}
      </div>
    </Shell>
  );
}

export function AdminSkeleton() {
  return (
    <Shell className="grid gap-6">
      <div className="flex items-center justify-between gap-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-9 w-28 rounded-full" />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <Skeleton key={index} className="h-24 rounded-2xl" />
        ))}
      </div>
      <div className="grid gap-2 rounded-2xl border border-line bg-paper p-4">
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton key={index} className="h-10" />
        ))}
      </div>
    </Shell>
  );
}
