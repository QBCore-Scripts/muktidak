import { JoinForm } from "@/components/site/JoinForm";
import { PageHeader } from "@/components/site/PageHeader";
import { applicationCopy } from "@/lib/application";
import { getSite, localizedMeta } from "@/lib/locale";

export function generateMetadata() {
  return localizedMeta("join");
}

export default async function JoinPage() {
  const { locale, settings } = await getSite();
  const logo = settings.logoUrl.startsWith("/") && !settings.logoUrl.startsWith("//") ? settings.logoUrl : "/logo.png";
  return (
    <>
      <PageHeader
        kicker={applicationCopy.org}
        title={applicationCopy.title}
        text={
          locale === "en"
            ? "Anyone interested can apply here. The central office reviews each form from the admin panel."
            : "আগ্রহী যে কেউ এই ফরম পূরণ করে আবেদন করতে পারেন। জমা হওয়ার পর কেন্দ্রীয় দপ্তর যাচাই করবে।"
        }
      />
      <JoinForm logo={logo} />
    </>
  );
}
