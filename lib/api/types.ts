/**
 * Interfacce per lo shop FUTURO (/shop su API .NET). Oggi NON sono usate da nessuna pagina.
 *
 * Mappatura prevista sulle DTO .NET (vertical slice, ApiResponse<T>):
 * - Category  <- CategoryDto  { Id, Slug, Name, ParentId }
 * - Product   <- ProductDto   { Id, Slug, Name, PriceCents, Currency, Images[], Availability, CategoryId, BrandId }
 * - Price     <- PriceDto     { AmountCents, Currency, CompareAtCents? }
 * Le chiavi JSON .NET sono camelCase: basta un mapper sottile nel client shop / ApiContentSource.
 * Gli importi sono SEMPRE in centesimi (interi), mai float.
 */

export type Availability = "disponibile" | "esaurito" | "in-arrivo" | "solo-negozio";

export interface Price {
  /** centesimi di euro */
  importo: number;
  valuta: string; // "EUR"
  /** prezzo pieno barrato, se in offerta (centesimi) */
  importoPieno?: number;
}

export interface Category {
  id: string;
  slug: string;
  nome: string;
  parentId?: string;
  /** slug del corridoio del sito vetrina collegato (Aisle.categoryId <-> Category.id) */
  corridoio?: string;
}

export interface Product {
  id: string;
  slug: string;
  nome: string;
  /** centesimi */
  prezzo: number;
  valuta: string;
  immagini: { src: string; alt: string }[];
  disponibilita: Availability;
  categoryId: string;
  brandId?: string;
}
