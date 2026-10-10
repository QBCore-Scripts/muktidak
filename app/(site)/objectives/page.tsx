import { TextPage } from "@/components/site/TextPage";
import { localizedMeta } from "@/lib/locale";

export function generateMetadata() {
  return localizedMeta("objectives");
}

export default function ObjectivesPage() {
  return <TextPage slug="objectives" />;
}
