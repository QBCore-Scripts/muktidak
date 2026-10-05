import { formatBdt, monthKey } from "@/lib/format";
import type { Database } from "@/lib/types";

export function dashboardFrom(db: Database) {
  const month = monthKey();
  const received = db.donations.filter((item) => item.status === "received");
  const total = received.reduce((sum, item) => sum + item.amount, 0);
  return {
    members: db.members.length,
    activeMembers: db.members.filter((item) => item.status === "active").length,
    donationTotal: total,
    monthTotal: received.filter((item) => item.date.startsWith(month)).reduce((sum, item) => sum + item.amount, 0),
    donations: db.donations.slice(0, 6),
    messages: db.messages.slice(0, 5),
    formattedTotal: formatBdt(total),
  };
}
