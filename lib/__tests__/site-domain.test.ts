import { afterEach, expect, it, vi } from "vitest";

afterEach(() => { vi.unstubAllEnvs(); vi.resetModules(); });

it("aggiorna metadati, dati strutturati e impostazioni con il dominio nuovo", async () => {
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://nuovo-homeco.example/");
  vi.resetModules();
  const { buildMetadata, jsonLdLocalBusiness } = await import("../seo");
  const { FileContentSource } = await import("../content/file-source");
  const source = new FileContentSource();
  const settings = await source.getSettings();
  const stores = await source.getStores();
  const metadata = buildMetadata({ title: "Offerte", description: "Catalogo", path: "/offerte/" });
  expect(settings.siteUrl).toBe("https://nuovo-homeco.example");
  expect(metadata.alternates?.canonical).toBe("https://nuovo-homeco.example/offerte/");
  const ld = jsonLdLocalBusiness(stores, settings);
  expect(ld[0].url).toBe("https://nuovo-homeco.example");
  for (const shop of ld.slice(1)) expect(shop.url).toBe("https://nuovo-homeco.example/dove-siamo/");
  // Il dominio del sito non deve modificare gli indirizzi di posta aziendali.
  expect(settings.societa.email).toBe("info@home-co.it");
});
