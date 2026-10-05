import { getSettings } from "@/lib/db";

export function PageHeader({
  kicker,
  title,
  text,
}: {
  kicker?: string;
  title: string;
  text?: string;
}) {
  const flavor = getSettings().copy.flavorLine;
  return (
    <header className="border-b border-line bg-paper">
      <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        {kicker ? <p className="text-sm font-medium text-leaf">{kicker}</p> : null}
        {flavor ? <p className="mt-2 text-xs font-medium tracking-wide text-donate">{flavor}</p> : null}
        <h1 className="mt-2 max-w-3xl text-3xl font-semibold tracking-tight text-forest md:text-5xl">{title}</h1>
        {text ? <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">{text}</p> : null}
      </div>
    </header>
  );
}
