"use client";

import Image from "next/image";
import { useState, type CSSProperties } from "react";
import { campaignCssVars, campaignPeriod, pickCampaign } from "@/lib/campaigns";
import { isoDate, type Campaign } from "@/lib/content/schemas";
import { HeroArt } from "./HeroArt";

/** Anteprima isolata: non modifica la campagna del sito né salva preferenze. */
export function CampaignCalendar({ campaigns, buildDate }: { campaigns: Campaign[]; buildDate: string }) {
  const [date, setDate] = useState(buildDate);
  const selectedDate = isoDate.safeParse(date).success ? date : buildDate;
  const campaign = pickCampaign(campaigns, new Date(`${selectedDate}T12:00:00Z`));
  const period = campaignPeriod(campaign, selectedDate);
  return (
    <div className="mt-8">
      <label htmlFor="campaign-date" className="block font-semibold text-brand-blue-900">Data da visualizzare (Europe/Rome)</label>
      <input id="campaign-date" type="date" value={date} onChange={(event) => setDate(event.target.value)}
        className="mt-2 min-h-12 rounded-xl border border-brand-blue-100 bg-white px-4 text-ink" />
      <div className="mt-6 grid items-center gap-6 rounded-lg bg-white p-6 sm:grid-cols-2" style={campaignCssVars(campaign) as CSSProperties}>
        <div aria-live="polite">
          <p className="font-bold text-[var(--accent-ink)]">{campaign.etichetta ?? campaign.tema}</p>
          <h3 className="mt-3 text-brand-blue-900">{campaign.titolo}</h3>
          <p className="mt-3 text-muted">{campaign.sottotitolo}</p>
          <p className="mt-4 text-sm font-semibold text-[var(--accent-ink)]">{period.inizio ?? "Sempre"}{period.fine ? ` / ${period.fine} (incluso)` : ""}{campaign.ricorrenza ? " · Ogni anno" : ""}</p>
        </div>
        <div className="relative aspect-[8/7] overflow-hidden rounded-lg bg-brand-blue-50">
          {campaign.immagineHero.src ? <Image src={campaign.immagineHero.src} alt={campaign.immagineHero.alt} fill sizes="(min-width: 640px) 50vw, 100vw" className="object-cover" />
            : <HeroArt tema={campaign.tema} className="h-full w-full" />}
        </div>
      </div>
    </div>
  );
}
