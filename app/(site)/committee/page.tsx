import { TextPage } from "@/components/site/TextPage";
import { localizedMeta } from "@/lib/locale";

export function generateMetadata() {
  return localizedMeta("committee");
}

export default function CommitteePage() {
  return <TextPage slug="committee" />;
}
