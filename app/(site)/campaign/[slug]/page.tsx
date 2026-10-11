import { CampaignView, campaignMeta } from "@/components/site/CampaignView";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  return campaignMeta((await params).slug);
}

export default async function CampaignPage({ params }: Props) {
  return <CampaignView slug={(await params).slug} />;
}
