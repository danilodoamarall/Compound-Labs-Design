import type { Locale } from "@/i18n/routing";
import survey from "../../content/data/state-of-prototyping-2026.json";
import radar from "../../content/radar.json";
import aiTools from "../../content/ai-tools.json";
import skills from "../../content/skills-agents.json";

export { survey, radar, aiTools, skills };
export type Survey = typeof survey;
export type RadarItem = (typeof radar.items)[number];
export type AiTool = (typeof aiTools.items)[number];
export type SkillItem = (typeof skills.items)[number];

export type Bilingual = { pt: string; en: string };

/** Rótulo no idioma da página. */
export function label(item: Bilingual, locale: Locale) {
  return locale === "pt" ? item.pt : item.en;
}
