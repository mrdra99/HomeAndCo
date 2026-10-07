import type { Campaign } from "@/lib/content/schemas";
import { campaignScriptSource } from "@/lib/campaign-script";

/**
 * Script inline nel <head>: prima del paint ricalcola la campagna per la data reale del
 * visitatore e, se diversa da quella di build, aggiorna data-campaign e le CSS vars su <html>.
 * Vedi lib/campaign-script.ts per la logica (identica a pickCampaign, coperta da test).
 */
export function CampaignThemeScript({ campaigns }: { campaigns: Campaign[] }) {
  return <script dangerouslySetInnerHTML={{ __html: campaignScriptSource(campaigns) }} />;
}
