"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

type Variant = "up" | "left" | "right" | "zoom";

let observer: IntersectionObserver | null = null;

function shared() {
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-in", "");
          observer?.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
  }
  return observer;
}

export function Reveal({
  children,
  as: Tag = "div",
  variant = "up",
  index = 0,
  className,
}: {
  children: ReactNode;
  as?: "div" | "section" | "article" | "li" | "header" | "figure" | "aside";
  variant?: Variant;
  index?: number;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const io = shared();
    io.observe(node);
    return () => io.unobserve(node);
  }, []);

  return (
    <Tag
      ref={ref as never}
      data-reveal={variant}
      className={className}
      style={{ "--i": Math.min(index, 8) } as CSSProperties}
    >
      {children}
    </Tag>
  );
}
