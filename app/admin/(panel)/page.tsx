import { dashboardFrom } from "@/lib/admin-snapshot";
import { readDb } from "@/lib/db";
import { DashboardView } from "./dashboard-view";

export const dynamic = "force-dynamic";

export default function Page() {
  return <DashboardView initial={dashboardFrom(readDb())} />;
}
