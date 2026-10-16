import type { Campaign } from "./content/schemas";
import { campaignCssVars } from "./campaigns";

/**
 * Sorgente dello script ANTI-FLASH: gira nel <head> prima del primo paint e ricalcola la
 * campagna per la data reale del visitatore (fuso Europe/Rome).
 *
 * La logica DEVE restare identica a pickCampaign() di lib/campaigns.ts: e' scritta in JS
 * semplice (niente import, niente TS) perche' viene inserita come testo nella pagina.
 * Il test lib/__tests__/campaign-script.test.ts esegue questo script su molte date e
 * confronta il risultato con pickCampaign(): se le due logiche divergono, il test fallisce.
 */
export function campaignScriptSource(campaigns: Campaign[]): string {
  const data = campaigns.map((c) => ({
    id: c.id,
    inizio: c.inizio,
    fine: c.fine,
    ricorrenza: c.ricorrenza,
    priorita: c.priorita,
    tema: c.tema,
    vars: campaignCssVars(c),
  }));
  // "<" escapato per non poter chiudere il tag <script> dall'interno dei dati
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return `(function(){try{
var C=${json};
var d=new Intl.DateTimeFormat("en-CA",{timeZone:"Europe/Rome",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date());
C=C.map(function(c){if(c.ricorrenza!=="annuale"||!c.inizio||!c.fine)return c;var s=c.inizio.slice(5),e=c.fine.slice(5),cross=s>e,y=Number(d.slice(0,4))-(cross&&d.slice(5)<s?1:0);return Object.assign({},c,{inizio:y+"-"+s,fine:(y+(cross?1:0))+"-"+e})});
var isDef=function(c){return !c.inizio&&!c.fine};
var act=C.filter(function(c){if(isDef(c))return false;if(c.inizio&&d<c.inizio)return false;if(c.fine&&d>c.fine)return false;return true}).sort(function(a,b){return b.priorita-a.priorita||(b.inizio||"").localeCompare(a.inizio||"")});
var p=act[0]||C.filter(isDef)[0]||C[0];
var h=document.documentElement;
if(p){h.setAttribute("data-campaign",p.id);h.setAttribute("data-theme",p.tema);for(var k in p.vars){h.style.setProperty(k,p.vars[k])}}
}catch(e){}})();`;
}
