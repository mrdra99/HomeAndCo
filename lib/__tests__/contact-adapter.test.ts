import { afterEach, describe, expect, it, vi } from "vitest";
import { FormspreeAdapter, getContactAdapter, type ContactData } from "../contact/adapter";

const endpoint = "https://formspree.io/f/test1234";
const message: ContactData = { nome: "Mario Rossi", email: "mario@example.com", oggetto: "Informazioni", messaggio: "Vorrei informazioni sul negozio di Sesto.", privacy: true };

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe("attivazione del modulo", () => {
  it("non simula un invio in produzione se manca il provider", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_CONTACT_ADAPTER", undefined);
    const adapter = getContactAdapter();
    expect(adapter.available).toBe(false);
    expect(await adapter.send(message)).toMatchObject({ ok: false });
  });
  it.each([undefined, "http://formspree.io/f/test1234", "https://altro.example/f/test1234", "https://formspree.io/f/test1234?redirect=x", "https://formspree.io/"])("mantiene l'alternativa email con endpoint non valido: %s", (url) => {
    vi.stubEnv("NEXT_PUBLIC_CONTACT_ADAPTER", "formspree");
    vi.stubEnv("NEXT_PUBLIC_FORMSPREE_URL", url);
    expect(getContactAdapter().available).toBe(false);
  });
  it("attiva il provider configurato e distingue la prova da un invio reale", async () => {
    vi.stubEnv("NEXT_PUBLIC_CONTACT_ADAPTER", "formspree");
    vi.stubEnv("NEXT_PUBLIC_FORMSPREE_URL", endpoint);
    expect(getContactAdapter()).toBeInstanceOf(FormspreeAdapter);
    vi.stubEnv("NEXT_PUBLIC_CONTACT_ADAPTER", "mock");
    expect(await getContactAdapter().send(message)).toEqual({ ok: true, simulated: true });
  });
});

describe("invio al servizio email", () => {
  it("trasmette i campi e l'indirizzo di risposta solo dopo una richiesta valida", async () => {
    const fetch = vi.fn().mockResolvedValue(Response.json({ ok: true, next: "/thanks" }));
    vi.stubGlobal("fetch", fetch);
    expect(await new FormspreeAdapter(endpoint).send(message)).toEqual({ ok: true });
    expect(fetch).toHaveBeenCalledTimes(1);
    const [url, request] = fetch.mock.calls[0];
    expect(url).toBe(endpoint);
    expect(JSON.parse(request.body)).toEqual(message);
    expect(request).toMatchObject({ method: "POST", credentials: "omit", redirect: "error", headers: { "Content-Type": "application/json", Accept: "application/json" } });
  });
  it("non trasmette dati senza consenso valido", async () => {
    const fetch = vi.fn();
    vi.stubGlobal("fetch", fetch);
    expect(await new FormspreeAdapter(endpoint).send({ ...message, privacy: false } as unknown as ContactData)).toMatchObject({ ok: false });
    expect(fetch).not.toHaveBeenCalled();
  });
  it.each([
    [429, { errors: [{ message: "Quota exceeded" }] }],
    [400, { errors: [{ message: "Invalid email" }] }],
    [500, { error: "Server error" }],
    [200, { ok: false }],
    [200, { errors: [{ message: "Rejected" }] }],
  ])("non conferma richieste rifiutate o fallite (%s)", async (status, body) => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json(body, { status })));
    expect(await new FormspreeAdapter(endpoint).send(message)).toMatchObject({ ok: false });
  });
  it("non tratta una pagina HTML come conferma di invio", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("<html>Not found</html>")));
    expect(await new FormspreeAdapter(endpoint).send(message)).toMatchObject({ ok: false });
  });
  it("gestisce una connessione interrotta senza confermare l'invio", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("Failed to fetch")));
    expect(await new FormspreeAdapter(endpoint).send(message)).toMatchObject({ ok: false });
  });
  it("interrompe una richiesta bloccata e non la ripete automaticamente", async () => {
    vi.useFakeTimers();
    const fetch = vi.fn((_url, request) => new Promise((_resolve, reject) => {
      request.signal.addEventListener("abort", () => reject(new Error("Aborted")));
    }));
    vi.stubGlobal("fetch", fetch);
    const pending = new FormspreeAdapter(endpoint).send(message);
    await vi.advanceTimersByTimeAsync(15_000);
    expect(await pending).toMatchObject({ ok: false });
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(vi.getTimerCount()).toBe(0);
  });
});
