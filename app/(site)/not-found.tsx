import type { Metadata } from "next";
import { NotFoundPanel } from "@/components/site/NotFoundPanel";
import { getSite, shareMeta } from "@/lib/locale";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getSite();
  return { ...shareMeta("/404", t.notFoundTitle, t.notFoundText), robots: { index: false, follow: false } };
}

export default async function NotFound() {
  const { t } = await getSite();
  return <NotFoundPanel t={t} />;
}
