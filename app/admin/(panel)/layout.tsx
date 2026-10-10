import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { getSession } from "@/lib/auth";
import { getSettings } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "অ্যাডমিন",
  robots: { index: false, follow: false },
};

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  const settings = await getSettings();
  return <AdminShell email={session.email} logo={settings.logoUrl}>{children}</AdminShell>;
}
