import { CampaignView, campaignMeta } from "@/components/site/CampaignView";

export function generateMetadata() {
  return campaignMeta("obosthan");
}

export default function ObosthanPage() {
  return <CampaignView slug="obosthan" />;
}
