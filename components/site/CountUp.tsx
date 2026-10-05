"use client";

import { useEffect, useRef, useState } from "react";
import { intlLocale, type Locale } from "@/lib/i18n";

export function CountUp({ value, prefix = "", locale }: { value: number; prefix?: string; locale: Locale }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value);

  useEffect(() => {
    const node = ref.current;
    if (!node || value <= 0 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - start) / 1400, 1);
        setShown(Math.round(value * (1 - Math.pow(1 - t, 4))));
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      setShown(0);
      frame = requestAnimationFrame(tick);
    });
    io.observe(node);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {new Intl.NumberFormat(intlLocale(locale)).format(shown)}
    </span>
  );
}
