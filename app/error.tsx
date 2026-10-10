"use client";

import { ErrorPanel } from "@/components/site/ErrorPanel";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <ErrorPanel reset={reset} />;
}
