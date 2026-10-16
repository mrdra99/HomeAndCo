"use client";

import { useActiveCampaign } from "@/components/campaign/useActiveCampaign";
import { Section } from "@/components/ui/Section";
import type { AisleHighlight, Campaign } from "@/lib/content/schemas";
import { featuredIdeasForCampaign } from "@/lib/featured-ideas";
import { FeaturedIdeas } from "./FeaturedIdeas";

export function CampaignFeaturedIdeas({ items, campaigns, buildCampaignId }: {
  items: AisleHighlight[]; campaigns: Campaign[]; buildCampaignId: string;
}) {
  const campaign = useActiveCampaign(campaigns, buildCampaignId);
  const visible = featuredIdeasForCampaign(items, campaign);
  if (!visible.length) return null;
  return (
    <Section tone="sand" rounded className="campaign-featured mx-3 sm:mx-6">
      <FeaturedIdeas title="Un’occhiata al reparto"
        subtitle="Qualche esempio dal nostro assortimento. Per modelli, misure e disponibilità, chiedi in negozio." items={visible} />
    </Section>
  );
}
