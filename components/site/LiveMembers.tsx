"use client";

import { useEffect, useRef, useState } from "react";
import { intlLocale, type Locale } from "@/lib/i18n";

function Roller({ char, glyphs }: { char: string; glyphs: string[] }) {
  const index = glyphs.indexOf(char);
  const prev = useRef(index);
  const [pos, setPos] = useState(index);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (index < 0 || index === prev.current) return;
    const from = prev.current;
    prev.current = index;
    if (index === 0 && from === glyphs.length - 1) {
      setAnimate(true);
      setPos(glyphs.length);
      const timer = window.setTimeout(() => {
        setAnimate(false);
        setPos(0);
      }, 720);
      return () => window.clearTimeout(timer);
    }
    setAnimate(true);
    setPos(index);
  }, [glyphs.length, index]);

  if (index < 0) return <>{char}</>;

  const strip = [...glyphs, glyphs[0]];
  return (
    <span className="inline-grid h-[1em] overflow-hidden leading-none">
      <span
        className={
          animate
            ? "col-start-1 row-start-1 flex flex-col transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
            : "col-start-1 row-start-1 flex flex-col"
        }
        style={{ transform: `translateY(calc(${pos} * -1em))` }}
      >
        {strip.map((digit, i) => (
          <span key={i} className="flex h-[1em] items-center justify-center leading-none">
            {digit}
          </span>
        ))}
      </span>
    </span>
  );
}

export function LiveMembers({ value, nextAt, locale }: { value: number; nextAt: number; locale: Locale }) {
  const [count, setCount] = useState(value);
  const [propValue, setPropValue] = useState(value);
  if (value !== propValue) {
    setPropValue(value);
    if (value > count) setCount(value);
  }
  const dueRef = useRef(nextAt);
  const localeKey = intlLocale(locale);
  const glyphs = Array.from({ length: 10 }, (_, n) => new Intl.NumberFormat(localeKey, { useGrouping: false }).format(n));
  const text = new Intl.NumberFormat(localeKey).format(count);

  useEffect(() => {
    let timer = 0;
    let stop = false;

    const arm = (at: number) => {
      dueRef.current = at;
      const wait = Math.min(Math.max(1000, at - Date.now() + 500), 2_147_000_000);
      timer = window.setTimeout(() => void pull(), wait);
    };

    async function pull() {
      try {
        const res = await fetch("/api/live-members", { cache: "no-store" });
        if (stop) return;
        const data = res.ok ? ((await res.json()) as { count?: number; nextAt?: number }) : null;
        if (!data || typeof data.count !== "number" || typeof data.nextAt !== "number") {
          arm(Date.now() + 60_000);
          return;
        }
        setCount((current) => (data.count! > current ? data.count! : current));
        arm(data.nextAt);
      } catch {
        if (!stop) arm(Date.now() + 60_000);
      }
    }

    arm(dueRef.current);
    const onVis = () => {
      if (document.visibilityState === "visible" && Date.now() >= dueRef.current - 1000) void pull();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      stop = true;
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <span className="inline-flex items-baseline tabular-nums">
      {text.split("").map((char, index) => (
        <Roller key={text.length - index} char={char} glyphs={glyphs} />
      ))}
    </span>
  );
}
