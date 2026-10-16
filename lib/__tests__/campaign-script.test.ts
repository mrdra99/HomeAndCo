import { readFileSync } from "node:fs";
import { join } from "node:path";
import vm from "node:vm";
import { describe, expect, it } from "vitest";
import { campaignScriptSource } from "../campaign-script";
import { campaignCssVars, pickCampaign } from "../campaigns";
import { CampaignSchema } from "../content/schemas";

const campaigns = CampaignSchema.array().parse(
  JSON.parse(readFileSync(join(process.cwd(), "content", "campaigns.json"), "utf8")),
);

/** Esegue lo script con una data finta e legge tema e colori applicati prima del paint. */
function runScript(source: string, now: Date) {
  const attrs = new Map<string, string>();
  const vars: Record<string, string> = {};
  const documentElement = {
    getAttribute: (k: string) => attrs.get(k) ?? null,
    setAttribute: (k: string, v: string) => void attrs.set(k, v),
    style: { setProperty: (name: string, value: string) => { vars[name] = value; } },
  };
  class FakeDate extends Date {
    constructor(...args: []) {
      if (args.length) super(...args);
      else super(now.getTime());
    }
  }
  vm.runInNewContext(source, { document: { documentElement }, Intl, Date: FakeDate });
  return { id: attrs.get("data-campaign"), tema: attrs.get("data-theme"), vars };
}

describe("script anti-flash vs pickCampaign", () => {
  const source = campaignScriptSource(campaigns);
  it("sceglie la stessa campagna di pickCampaign su ogni giorno di due anni", () => {
    const start = Date.UTC(2026, 0, 1, 12);
    for (let i = 0; i < 800; i++) {
      for (const hour of [0, 22]) {
        const now = new Date(start + i * 86_400_000 + hour * 3_600_000);
        const expected = pickCampaign(campaigns, now).id;
        const got = runScript(source, now).id;
        expect(got, now.toISOString()).toBe(expected);
      }
    }
  });
  it.each([
    ["2026-09-30T21:59:59Z", "default"],
    ["2026-09-30T22:00:00Z", "halloween-2026"],
    ["2026-10-25T00:30:00Z", "halloween-2026"],
    ["2026-10-25T01:30:00Z", "halloween-2026"],
    ["2026-11-01T22:59:59Z", "halloween-2026"],
    ["2026-11-01T23:00:00Z", "default"],
    ["2026-11-26T23:00:00Z", "natale-2026"],
    ["2027-01-06T23:00:00Z", "default"],
    ["2027-09-30T22:00:00Z", "halloween-2026"],
    ["2027-11-01T23:00:00Z", "default"],
    ["2027-11-26T23:00:00Z", "natale-2026"],
    ["2028-01-06T22:59:59Z", "natale-2026"],
  ])("sincronizza tema e colori alla data %s", (timestamp, id) => {
    const date = new Date(timestamp);
    const campaign = pickCampaign(campaigns, date);
    const state = runScript(source, date);
    expect(state.id).toBe(id);
    expect(state.tema).toBe(campaign.tema);
    expect(state.vars).toEqual(campaignCssVars(campaign));
  });
});
