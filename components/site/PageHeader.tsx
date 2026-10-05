import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getSettings } from "@/lib/db";
import { Reveal } from "./Reveal";

export async function PageHeader({
  kicker,
  title,
  text,
}: {
  kicker?: string;
  title: string;
  text?: string;
}) {
  const flavor = (await getSettings()).copy.flavorLine;
  return (
    <header className="border-b border-line bg-paper">
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <Reveal index={0} className="flex flex-wrap items-center gap-3">
          {kicker ? <Badge variant="secondary" className="h-6 px-2.5">{kicker}</Badge> : null}
          {kicker && flavor ? <Separator orientation="vertical" className="h-4" /> : null}
          {flavor ? <span className="text-xs font-medium tracking-wide text-destructive">{flavor}</span> : null}
        </Reveal>
        <Reveal index={1}>
          <h1 className="mt-4 max-w-3xl text-4xl leading-[1.2] text-forest md:text-6xl">{title}</h1>
        </Reveal>
        {text ? (
          <Reveal index={2}>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{text}</p>
          </Reveal>
        ) : null}
      </div>
    </header>
  );
}
