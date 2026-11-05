import vm from "node:vm";
import { describe, expect, it } from "vitest";
import { BRAND_INTRO_ATTRIBUTE, BRAND_INTRO_SESSION_KEY, brandIntroScriptSource } from "../brand-intro";

function visit(options: { seen?: boolean; reduced?: boolean; blockedStorage?: boolean; path?: string; mobile?: boolean } = {}) {
  const attributes = new Map<string, string>();
  const storage = new Map<string, string>(options.seen ? [[BRAND_INTRO_SESSION_KEY, "1"]] : []);
  const timers: { callback: () => void; delay: number }[] = [];
  const listeners = new Map<string, () => void>();
  vm.runInNewContext(brandIntroScriptSource(), {
    document: { addEventListener: (event: string, callback: () => void) => listeners.set(event, callback), documentElement: {
      setAttribute: (name: string, value: string) => attributes.set(name, value),
      removeAttribute: (name: string) => attributes.delete(name),
    } },
    window: {
      matchMedia: (query: string) => ({ matches: query.includes("reduced-motion") ? options.reduced ?? false : options.mobile ?? false }),
      location: { pathname: options.path ?? "/" },
      sessionStorage: {
        getItem: (key: string) => {
          if (options.blockedStorage) throw new Error("Storage disabled");
          return storage.get(key) ?? null;
        },
        setItem: (key: string, value: string) => storage.set(key, value),
      },
      setTimeout: (callback: () => void, delay: number) => timers.push({ callback, delay }),
    },
  });
  return { attributes, storage, timers, ready: () => listeners.get("DOMContentLoaded")?.() };
}

describe("ingresso con logo", () => {
  it("appare al primo ingresso e si registra per evitare ripetizioni nella sessione", () => {
    const result = visit();
    expect(result.attributes.has(BRAND_INTRO_ATTRIBUTE)).toBe(true);
    expect(result.storage.get(BRAND_INTRO_SESSION_KEY)).toBe("1");
    expect(visit({ seen: true }).attributes.has(BRAND_INTRO_ATTRIBUTE)).toBe(false);
  });
  it("lascia il sito immediatamente visibile quando sono richieste animazioni ridotte", () => {
    const result = visit({ reduced: true });
    expect(result.attributes.size).toBe(0);
    expect(result.timers).toHaveLength(0);
  });
  it("scompare comunque se l'idratazione o l'evento di fine animazione non arrivano", () => {
    const result = visit();
    result.ready();
    expect(result.timers[0].delay).toBeLessThanOrEqual(3200);
    result.timers[0].callback();
    expect(result.attributes.has(BRAND_INTRO_ATTRIBUTE)).toBe(false);
  });
  it("non blocca il sito quando lo storage del browser è disabilitato", () => {
    const result = visit({ blockedStorage: true });
    expect(result.attributes.has(BRAND_INTRO_ATTRIBUTE)).toBe(true);
    result.ready();
    result.timers[0].callback();
    expect(result.attributes.has(BRAND_INTRO_ATTRIBUTE)).toBe(false);
  });
  it("non consuma il tempo dello splash durante il caricamento iniziale su smartphone", () => {
    const result = visit({ mobile: true });
    expect(result.attributes.has(BRAND_INTRO_ATTRIBUTE)).toBe(true);
    expect(result.timers).toHaveLength(0);
    result.ready();
    expect(result.timers[0].delay).toBe(4200);
    result.timers[0].callback();
    expect(result.attributes.has(BRAND_INTRO_ATTRIBUTE)).toBe(false);
  });
  it("lascia libera la pagina interna di verifica dei componenti", () => {
    expect(visit({ path: "/design-system/" }).attributes.size).toBe(0);
  });
});
