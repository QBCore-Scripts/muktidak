import { CampaignView, campaignMeta } from "@/components/site/CampaignView";

export function generateMetadata() {
  return campaignMeta("char-dofa");
}

export default function CharDofaPage() {
  return <CampaignView slug="char-dofa" />;
}
