import { TextPage } from "@/components/site/TextPage";
import { localizedMeta } from "@/lib/locale";

export function generateMetadata() {
  return localizedMeta("manifesto");
}

export default function ManifestoPage() {
  return <TextPage slug="manifesto" />;
}
