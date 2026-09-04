import type { Locale } from "@/i18n/routing";
import survey from "../../content/data/state-of-prototyping-2026.json";

/** A pesquisa que alimenta os gráficos dos artigos.
 *
 *  Este módulo já reexportou radar.json, ai-tools.json e skills-agents.json.
 *  Ninguém importava esses três daqui: os gráficos usam só a pesquisa, e o
 *  índice de recursos lê os JSON direto no script de build. Saíram junto com
 *  as páginas de Radar e AI Tools. */
export { survey };
export type Survey = typeof survey;

export type Bilingual = { pt: string; en: string };

/** Rótulo no idioma da página. */
export function label(item: Bilingual, locale: Locale) {
  return locale === "pt" ? item.pt : item.en;
}
