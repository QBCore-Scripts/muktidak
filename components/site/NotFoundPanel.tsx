import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import type { UiText } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function NotFoundPanel({ t }: { t: UiText }) {
  return (
    <div className="mx-auto flex max-w-xl flex-col px-4 py-24">
      <p className="text-sm font-medium tracking-wide text-destructive">404</p>
      <h1 className="mt-2 text-4xl text-forest">{t.notFoundTitle}</h1>
      <p className="mt-3 text-muted-foreground">{t.notFoundText}</p>
      <Link href="/" className={cn(buttonVariants({ variant: "donate", size: "xl" }), "mt-8 self-start")}>
        {t.backHome}
      </Link>
    </div>
  );
}
