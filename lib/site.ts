import settings from "../content/settings.json";

/** Dominio configurabile in build: il nuovo sito non dipende dall'accesso al vecchio hosting. */
export const SITE_URL = new URL(process.env.NEXT_PUBLIC_SITE_URL || settings.siteUrl).origin;
export const SITE_NAME = "Home & Co.";
export const SITE_CLAIM = "Il negozio su misura per la tua casa!";
