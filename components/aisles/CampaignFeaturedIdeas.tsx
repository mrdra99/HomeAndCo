"use client";

import { useActiveCampaign } from "@/components/campaign/useActiveCampaign";
import { Container } from "@/components/ui/Container";
import type { AisleHighlight, Campaign, PagesCopy } from "@/lib/content/schemas";
import { featuredIdeasForCampaign } from "@/lib/featured-ideas";
import { FeaturedIdeas } from "./FeaturedIdeas";

export function CampaignFeaturedIdeas({ items, campaigns, buildCampaignId, copy }: {
  items: AisleHighlight[]; campaigns: Campaign[]; buildCampaignId: string; copy: PagesCopy["corridoi"]["idee"];
}) {
  const campaign = useActiveCampaign(campaigns, buildCampaignId);
  const visible = featuredIdeasForCampaign(items, campaign);
  if (!visible.length) return null;
  return (
    <section className="bg-sand py-7 sm:py-10">
      <Container size="wide">
        <FeaturedIdeas title={copy.titolo} subtitle={copy.testo} items={visible} />
      </Container>
    </section>
  );
}
