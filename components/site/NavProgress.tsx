"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function NavProgress() {
  const pathname = usePathname();
  const pathRef = useRef(pathname);
  const timer = useRef<number | undefined>(undefined);
  const [from, setFrom] = useState<string | null>(null);
  const [skeleton, setSkeleton] = useState(false);

  useEffect(() => {
    pathRef.current = pathname;
  }, [pathname]);

  useEffect(() => {
    if (from === null) return;
    const observer = new MutationObserver(() => setSkeleton(!!document.querySelector(".skeleton-in")));
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [from]);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element | null)?.closest?.("a");
      if (!link || (link.target && link.target !== "_self") || link.hasAttribute("download")) return;
      const url = new URL(link.href, location.href);
      if (url.origin !== location.origin || url.pathname === location.pathname) return;
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setFrom(null), 12000);
      setFrom(pathRef.current);
    }
    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.clearTimeout(timer.current);
    };
  }, []);

  const state = from === null ? "idle" : from === pathname || skeleton ? "loading" : "done";

  return (
    <div
      className="nav-progress"
      data-state={state}
      aria-hidden="true"
      onTransitionEnd={(event) => {
        if (state !== "done") return;
        if (event.propertyName === "opacity" || getComputedStyle(event.currentTarget).opacity === "0") setFrom(null);
      }}
    />
  );
}
