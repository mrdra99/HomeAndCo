import { readFileSync } from "node:fs";
import { join } from "node:path";
import vm from "node:vm";
import { describe, expect, it } from "vitest";
import { campaignScriptSource } from "../campaign-script";
import { pickCampaign } from "../campaigns";
import { CampaignSchema } from "../content/schemas";

const campaigns = CampaignSchema.array().parse(
  JSON.parse(readFileSync(join(process.cwd(), "content", "campaigns.json"), "utf8")),
);

/** Esegue lo script anti-flash con una "data corrente" finta e ritorna il data-campaign risultante. */
function runScript(source: string, now: Date): string | null {
  const attrs = new Map<string, string>();
  const documentElement = {
    getAttribute: (k: string) => attrs.get(k) ?? null,
    setAttribute: (k: string, v: string) => void attrs.set(k, v),
    style: { setProperty: () => undefined },
  };
  class FakeDate extends Date {
    constructor(...args: []) {
      if (args.length) super(...args);
      else super(now.getTime());
    }
  }
  vm.runInNewContext(source, { document: { documentElement }, Intl, Date: FakeDate });
  return attrs.get("data-campaign") ?? null;
}

describe("script anti-flash vs pickCampaign", () => {
  const source = campaignScriptSource(campaigns);
  it("sceglie la stessa campagna di pickCampaign su ogni giorno di due anni", () => {
    const start = Date.UTC(2026, 0, 1, 12);
    for (let i = 0; i < 800; i++) {
      for (const hour of [0, 22]) {
        const now = new Date(start + i * 86_400_000 + hour * 3_600_000);
        const expected = pickCampaign(campaigns, now).id;
        // lo script scrive l'attributo solo se diverso da quello di build: simuliamo la build = default
        const got = runScript(source, now) ?? "default";
        expect(got, now.toISOString()).toBe(expected);
      }
    }
  });
});
