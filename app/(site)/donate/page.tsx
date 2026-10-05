import { AccountCards } from "@/components/site/AccountCards";
import { PageHeader } from "@/components/site/PageHeader";
import { getVisibleAccounts } from "@/lib/db";
import { getSite, localizedMeta } from "@/lib/locale";

export function generateMetadata() {
  return localizedMeta("donate");
}

export default async function DonatePage() {
  const { t, settings } = await getSite();
  const copy = settings.copy;
  const accounts = await getVisibleAccounts();

  return (
    <>
      <PageHeader
        kicker={copy.donateKicker}
        title={copy.donateTitle}
        text={copy.donateText}
      />
      <div className="mx-auto max-w-6xl px-4 py-10">
        <AccountCards accounts={accounts} t={t} />
        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted">
          {copy.donateNote}
        </p>
      </div>
    </>
  );
}
