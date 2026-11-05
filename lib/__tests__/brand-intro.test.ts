import vm from "node:vm";
import { describe, expect, it } from "vitest";
import { BRAND_INTRO_ATTRIBUTE, BRAND_INTRO_SESSION_KEY, brandIntroScriptSource } from "../brand-intro";

function visit(options: { seen?: boolean; reduced?: boolean; blockedStorage?: boolean; path?: string } = {}) {
  const attributes = new Map<string, string>();
  const storage = new Map<string, string>(options.seen ? [[BRAND_INTRO_SESSION_KEY, "1"]] : []);
  const timers: { callback: () => void; delay: number }[] = [];
  vm.runInNewContext(brandIntroScriptSource(), {
    document: { documentElement: {
      setAttribute: (name: string, value: string) => attributes.set(name, value),
      removeAttribute: (name: string) => attributes.delete(name),
    } },
    window: {
      matchMedia: () => ({ matches: options.reduced ?? false }),
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
  return { attributes, storage, timers };
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
    expect(result.timers[0].delay).toBeLessThanOrEqual(3200);
    result.timers[0].callback();
    expect(result.attributes.has(BRAND_INTRO_ATTRIBUTE)).toBe(false);
  });
  it("non blocca il sito quando lo storage del browser è disabilitato", () => {
    const result = visit({ blockedStorage: true });
    expect(result.attributes.has(BRAND_INTRO_ATTRIBUTE)).toBe(true);
    result.timers[0].callback();
    expect(result.attributes.has(BRAND_INTRO_ATTRIBUTE)).toBe(false);
  });
  it("lascia libera la pagina interna di verifica dei componenti", () => {
    expect(visit({ path: "/design-system/" }).attributes.size).toBe(0);
  });
});
