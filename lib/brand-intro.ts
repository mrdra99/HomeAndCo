/** Runs before the first paint: no intro flash on return visits or without JavaScript. */
export const BRAND_INTRO_SESSION_KEY = "homeco:intro-seen:v1";
export const BRAND_INTRO_ATTRIBUTE = "data-brand-intro";

export function brandIntroScriptSource(): string {
  return `(function(){
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if(window.location.pathname === '/design-system/') return;
    try {
      if(window.sessionStorage.getItem('${BRAND_INTRO_SESSION_KEY}') === '1') return;
      window.sessionStorage.setItem('${BRAND_INTRO_SESSION_KEY}', '1');
    } catch(e) { /* Storage can be unavailable; the animation still has a finite lifetime. */ }
    document.documentElement.setAttribute('${BRAND_INTRO_ATTRIBUTE}', 'active');
    window.setTimeout(function(){ document.documentElement.removeAttribute('${BRAND_INTRO_ATTRIBUTE}'); }, 3200);
  })();`;
}
