import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { ApplicationSheet } from "@/components/admin/ApplicationSheet";
import { FormPrintBar } from "@/components/admin/FormPrintBar";
import { getSession } from "@/lib/auth";
import { getSettings, readDb, safeId } from "@/lib/db";

type Props = { params: Promise<{ id: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const session = await getSession();
  const { id } = await params;
  const item = session && safeId(id) ? (await readDb()).applications.find((row) => row.id === id) : null;
  return {
    title: { absolute: item ? `${item.formNo} ${item.nameBn}` : "আবেদন ফরম" },
    robots: { index: false, follow: false },
  };
}

export default async function ApplicationFormPage({ params }: Props) {
  if (!(await getSession())) redirect("/admin/login");
  const { id } = await params;
  if (!safeId(id)) notFound();
  const item = (await readDb()).applications.find((row) => row.id === id);
  if (!item) notFound();
  const settings = await getSettings();
  const logo = settings.logoUrl.startsWith("/") && !settings.logoUrl.startsWith("//") ? settings.logoUrl : "/logo.png";
  return (
    <div className="min-h-screen bg-cream print:bg-white">
      <style>{`@page{size:A4;margin:12mm}`}</style>
      <FormPrintBar formNo={item.formNo} />
      <div className="px-3 py-6 print:px-0 print:py-0">
        <ApplicationSheet item={item} logo={logo} />
      </div>
    </div>
  );
}
