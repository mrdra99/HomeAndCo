/** Chiave nel browser: splash della home gia' visto (components/motion/HomeSplash.tsx). */
export const SPLASH_SEEN_KEY = "hco-splash";

/**
 * Script inline sincrono nell'<head> del root layout (app/layout.tsx): se e' gia' stato visto,
 * `html[data-splash=seen]` lo nasconde via CSS prima che il browser lo disegni (nessun lampo per chi torna).
 * Modulo normale, non "use client": lo importa il root layout, server.
 */
export const SPLASH_SEEN_SCRIPT = `try{if(localStorage.getItem("${SPLASH_SEEN_KEY}"))document.documentElement.setAttribute("data-splash","seen")}catch(e){}`;
