import { readDb } from "@/lib/db";
import { NoticesView } from "./view";

export const dynamic = "force-dynamic";

export default async function Page() {
  return <NoticesView initial={(await readDb()).notices} />;
}
