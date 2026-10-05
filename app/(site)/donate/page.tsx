import type { Metadata } from "next";
import { AccountCards } from "@/components/site/AccountCards";
import { PageHeader } from "@/components/site/PageHeader";
import { getSettings, getVisibleAccounts } from "@/lib/db";

export const metadata: Metadata = {
  title: "দান",
  description: "বাংলাদেশ মুক্তির ডাক-৭১ (Bangladesh Muktir Dak 71) এর খোলা দান হিসাব।",
};

export default function DonatePage() {
  const copy = getSettings().copy;
  const accounts = getVisibleAccounts();

  return (
    <>
      <PageHeader
        kicker={copy.donateKicker}
        title={copy.donateTitle}
        text={copy.donateText}
      />
      <div className="mx-auto max-w-6xl px-4 py-10">
        <AccountCards accounts={accounts} />
        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted">
          {copy.donateNote}
        </p>
      </div>
    </>
  );
}
