import { z } from "zod";
import settingsJson from "../../content/settings.json";
import navigationJson from "../../content/navigation.json";
import campaignsJson from "../../content/campaigns.json";
import aislesJson from "../../content/aisles.json";
import storesJson from "../../content/stores.json";
import brandsJson from "../../content/brands.json";
import flyersJson from "../../content/flyers.json";
import promotionsJson from "../../content/promotions.json";
import loyaltyJson from "../../content/loyalty.json";
import {
  AisleSchema,
  BrandSchema,
  CampaignSchema,
  FlyerSchema,
  LoyaltyProgramSchema,
  NavigationSchema,
  PromotionSchema,
  SettingsSchema,
  StoreSchema,
} from "./schemas";
import type { ContentSource } from "./source";

/** Valida i dati e, se malformati, solleva un errore leggibile (file + percorso + motivo). */
function parse<S extends z.ZodType>(file: string, schema: S, data: unknown): z.output<S> {
  const result = schema.safeParse(data);
  if (result.success) return result.data;
  const dettagli = result.error.issues
    .map((i) => `  - ${i.path.length ? i.path.join(".") : "(radice)"}: ${i.message}`)
    .join("\n");
  throw new Error(`Contenuto non valido in content/${file}:\n${dettagli}`);
}

/** Sorgente di contenuti basata sui file JSON in /content (validati con Zod). */
export class FileContentSource implements ContentSource {
  private cache = new Map<string, unknown>();

  private load<S extends z.ZodType>(file: string, schema: S, data: unknown): z.output<S> {
    if (!this.cache.has(file)) this.cache.set(file, parse(file, schema, data));
    return this.cache.get(file) as z.output<S>;
  }

  async getSettings() {
    return this.load("settings.json", SettingsSchema, settingsJson);
  }
  async getNavigation() {
    return this.load("navigation.json", NavigationSchema, navigationJson);
  }
  async getCampaigns() {
    return this.load("campaigns.json", z.array(CampaignSchema), campaignsJson);
  }
  async getAisles() {
    const aisles = this.load("aisles.json", z.array(AisleSchema), aislesJson);
    return [...aisles].sort((a, b) => a.ordine - b.ordine);
  }
  async getStores() {
    return this.load("stores.json", z.array(StoreSchema), storesJson);
  }
  async getBrands() {
    return this.load("brands.json", z.array(BrandSchema), brandsJson);
  }
  async getFlyers() {
    return this.load("flyers.json", z.array(FlyerSchema), flyersJson);
  }
  async getPromotions() {
    return this.load("promotions.json", z.array(PromotionSchema), promotionsJson);
  }
  async getLoyalty() {
    return this.load("loyalty.json", LoyaltyProgramSchema, loyaltyJson);
  }
}
