import type { Locale } from "@/i18n/routing";

/** Repositório usado pelo botão de estrela do GitHub.
 *  Defina NEXT_PUBLIC_GITHUB_REPO como "owner/repo" para ligar a contagem ao vivo.
 *  Sem isso, o botão vira só um link e não mostra número. */
export const githubRepo = process.env.NEXT_PUBLIC_GITHUB_REPO ?? "";
export const githubUrl = githubRepo ? `https://github.com/${githubRepo}` : "https://github.com";

/** As seções do hub. Uma fonte só, consumida pelo menu, pelo carrossel da home e
 *  pelo rodapé, para que os três nunca discordem. */
export type Section = {
  key: string;
  href:
    | "/artigos" | "/radar" | "/ai-tools" | "/skills-agents" | "/workflow" | "/docs" | "/faq";
  /** Par de cores da capa no carrossel: do topo à base. */
  cover: [string, string];
  inNav: boolean;
};

export const sections = [
  { key: "articles", href: "/artigos", cover: ["#0b8a74", "#0d3b3a"], inNav: true },
  { key: "radar", href: "/radar", cover: ["#1f7a8c", "#123049"], inNav: true },
  { key: "aiTools", href: "/ai-tools", cover: ["#c9571c", "#7a2f14"], inNav: true },
  { key: "skillsAgents", href: "/skills-agents", cover: ["#5b4bb7", "#241f4d"], inNav: true },
  { key: "workflow", href: "/workflow", cover: ["#a8802a", "#3a2a08"], inNav: true },
  { key: "docs", href: "/docs", cover: ["#3f4a52", "#171c1b"], inNav: true },
  { key: "faq", href: "/faq", cover: ["#a8456b", "#3d1a2c"], inNav: true },
] as const satisfies readonly Section[];

export type SectionKey = (typeof sections)[number]["key"];

/** Ordem das capas no carrossel da home, diferente da ordem do menu: põe Artigos
 *  no centro, para o leque abrir dos dois lados como na referência. */
export const coverOrder = ["docs", "radar", "workflow", "articles", "aiTools", "skillsAgents", "faq"] as const;
export const coverInitialIndex = coverOrder.indexOf("articles");

/** Caminho já com o prefixo de idioma, para uso fora do <Link> tipado. */
export function sectionPath(href: Section["href"], locale: Locale) {
  const translated: Record<Section["href"], Record<Locale, string>> = {
    "/artigos": { pt: "/artigos", en: "/articles" },
    "/radar": { pt: "/radar", en: "/radar" },
    "/ai-tools": { pt: "/ai-tools", en: "/ai-tools" },
    "/skills-agents": { pt: "/skills-agents", en: "/skills-agents" },
    "/workflow": { pt: "/workflow", en: "/workflow" },
    "/docs": { pt: "/docs", en: "/docs" },
    "/faq": { pt: "/faq", en: "/faq" },
  };
  return `/${locale}${translated[href][locale]}`;
}
