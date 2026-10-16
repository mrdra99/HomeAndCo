import type { AisleHighlight, Campaign } from "./content/schemas";

/** Le idee stagionali richiedono un'associazione esplicita nei contenuti. */
export function featuredIdeasForCampaign(items: AisleHighlight[], campaign: Campaign) {
  const seasonal = items.filter((item) => item.campagne?.includes(campaign.id));
  const evergreen = items.filter((item) => !item.campagne);
  return [
    ...seasonal.map((item) => ({ ...item, badge: campaign.etichetta ?? campaign.titolo, badgeTone: "accent" as const })),
    ...evergreen,
  ];
}
