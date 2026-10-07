import type {
  Aisle,
  Brand,
  Campaign,
  Flyer,
  LoyaltyProgram,
  Navigation,
  Promotion,
  Settings,
  Store,
} from "./schemas";

/**
 * Contratto di una sorgente di contenuti. Tutte le letture sono async così la stessa
 * interfaccia vale per file locali (oggi), CMS headless o API .NET (domani).
 * I componenti NON importano mai da /content: passano da qui (via lib/content/index.ts).
 */
export interface ContentSource {
  getSettings(): Promise<Settings>;
  getNavigation(): Promise<Navigation>;
  getCampaigns(): Promise<Campaign[]>;
  getAisles(): Promise<Aisle[]>;
  getStores(): Promise<Store[]>;
  getBrands(): Promise<Brand[]>;
  getFlyers(): Promise<Flyer[]>;
  getPromotions(): Promise<Promotion[]>;
  getLoyalty(): Promise<LoyaltyProgram>;
}
