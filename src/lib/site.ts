import type { Locale } from "@/i18n/routing";

/** Repositório do projeto: é onde mora o código do hub, o MCP e as estrelas.
 *  A variável NEXT_PUBLIC_GITHUB_REPO sobrescreve, para apontar um fork em
 *  ambiente de teste sem mexer no código. */
export const githubRepo = process.env.NEXT_PUBLIC_GITHUB_REPO ?? "danilodoamarall/Compound-Labs-Design";
export const githubUrl = githubRepo ? `https://github.com/${githubRepo}` : "https://github.com";

/** Quem faz o Compound Design. O nome aparece no rodapé, no hero e na página
 *  Sobre, e em todos eles leva ao perfil: o produto tem de dar o crédito a quem
 *  o constrói, não só assiná-lo. */
export const authorLinkedIn = "https://www.linkedin.com/in/danilodoamaral/";

/** As seções do hub com página própria. Uma fonte só, consumida pelo menu,
 *  pela busca e pelo rodapé, para que os três nunca discordem.
 *
 *  Radar e AI Tools saíram daqui em setembro de 2026. As duas eram listas de
 *  uma linha por ferramenta, 100% marcadas como rascunho, e juntas somavam
 *  menos texto que um único artigo. Os dados continuam em content/ como acervo
 *  do /explorar; só a página e o lugar no menu acabaram. */
export type Section = {
  key: string;
  href: "/artigos" | "/skills-agents" | "/workflow" | "/docs" | "/faq";
  /** Par de cores da capa: do topo à base. */
  cover: [string, string];
  inNav: boolean;
};

export const sections = [
  { key: "articles", href: "/artigos", cover: ["#0b8a74", "#0d3b3a"], inNav: true },
  { key: "skillsAgents", href: "/skills-agents", cover: ["#5b4bb7", "#241f4d"], inNav: true },
  { key: "workflow", href: "/workflow", cover: ["#a8802a", "#3a2a08"], inNav: true },
  { key: "docs", href: "/docs", cover: ["#3f4a52", "#171c1b"], inNav: true },
  { key: "faq", href: "/faq", cover: ["#a8456b", "#3d1a2c"], inNav: true },
] as const satisfies readonly Section[];

export type SectionKey = (typeof sections)[number]["key"];

/** Caminho já com o prefixo de idioma, para uso fora do <Link> tipado. */
export function sectionPath(href: Section["href"], locale: Locale) {
  const translated: Record<Section["href"], Record<Locale, string>> = {
    "/artigos": { pt: "/artigos", en: "/articles" },
    "/skills-agents": { pt: "/skills-agents", en: "/skills-agents" },
    "/workflow": { pt: "/workflow", en: "/workflow" },
    "/docs": { pt: "/docs", en: "/docs" },
    "/faq": { pt: "/faq", en: "/faq" },
  };
  return `/${locale}${translated[href][locale]}`;
}

/** Os destinos do menu, em quatro grupos, agrupados pelo que a pessoa veio
 *  fazer: ler (artigos e a pesquisa), achar um recurso (catálogo, workflow,
 *  índice), ligar um agente (CLI, MCP) e entender o framework (docs, sobre,
 *  FAQ). Inclui rotas que não são seções (Research, Sobre, Explorar, CLI, MCP),
 *  por isso mora aqui e não em `sections`. Uma fonte só para o cabeçalho, o
 *  rodapé e a checagem de contagens. */
export const NAV_GROUPS = [
  { key: "studies", itens: ["articles", "research"] },
  { key: "resources", itens: ["skillsAgents", "workflow", "browse"] },
  { key: "aiTools", itens: ["cli", "mcp"] },
  { key: "framework", itens: ["docs", "about", "faq"] },
] as const;

export type NavKey = (typeof NAV_GROUPS)[number]["itens"][number];

export const NAV_HREF: Record<NavKey, { pt: string; en: string }> = {
  articles: { pt: "/artigos", en: "/articles" },
  research: { pt: "/research", en: "/research" },
  skillsAgents: { pt: "/skills-agents", en: "/skills-agents" },
  cli: { pt: "/skills-agents/cli", en: "/skills-agents/cli" },
  mcp: { pt: "/skills-agents/mcp", en: "/skills-agents/mcp" },
  browse: { pt: "/explorar", en: "/browse" },
  workflow: { pt: "/workflow", en: "/workflow" },
  docs: { pt: "/docs", en: "/docs" },
  faq: { pt: "/faq", en: "/faq" },
  about: { pt: "/sobre", en: "/about" },
};

export function navPath(key: NavKey, locale: Locale) {
  return `/${locale}${NAV_HREF[key][locale]}`;
}
