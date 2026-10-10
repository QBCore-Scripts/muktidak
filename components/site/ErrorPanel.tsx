"use client";

import { useEffect, useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { uiText, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function ErrorPanel({ reset }: { reset: () => void }) {
  const [locale, setLocale] = useState<Locale>("bn");

  useEffect(() => {
    setLocale(document.documentElement.lang === "en" ? "en" : "bn");
  }, []);

  const t = uiText[locale];

  return (
    <div className="mx-auto flex max-w-xl flex-col px-4 py-24">
      <h1 className="text-4xl text-forest">{t.errorTitle}</h1>
      <p className="mt-3 text-muted-foreground">{t.errorText}</p>
      <button type="button" onClick={() => reset()} className={cn(buttonVariants({ variant: "donate", size: "xl" }), "mt-8 self-start")}>
        {t.retry}
      </button>
    </div>
  );
}
