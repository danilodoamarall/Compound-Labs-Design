/** Taxonomia do índice de conteúdo. Dez verbos: o que o leitor faz com o item.
 *
 *  Este módulo é neutro de propósito: um Server Component que importa um valor
 *  de um módulo "use client" recebe uma referência de cliente, não o valor. Por
 *  isso a ordem e as cores moram aqui, e não no componente. */

export type ResourceTag =
  | "read" | "watch" | "listen" | "browse" | "use"
  | "build" | "learn" | "join" | "follow" | "apply";

/** Ordem canônica, do consumo passivo ao ativo. */
export const TAG_ORDER: ResourceTag[] = [
  "read", "watch", "listen", "browse", "use", "build", "learn", "join", "follow", "apply",
];

/** Um ponto colorido por tag. São marcadores de categoria, não escala de dado:
 *  o que importa é serem distinguíveis entre si e legíveis nos dois temas. */
export const TAG_DOT: Record<ResourceTag, string> = {
  read: "#8b7bea",
  watch: "#e879a8",
  listen: "#3fb6d8",
  browse: "#e8735e",
  use: "#22a18c",
  build: "#e0913a",
  learn: "#4ec2a6",
  join: "#5fbf6a",
  follow: "#b8c04a",
  apply: "#dfb03c",
};

export type Resource = {
  key: string;
  name: string;
  desc: string;
  tags: ResourceTag[];
  href: string;
  external: boolean;
  /** Coluna da direita: a seção onde o item vive. */
  meta: string;
  /** ISO (AAAA-MM-DD) quando a fonte tem data de verdade; null quando não tem.
   *  Ausência não vira data falsa. */
  date: string | null;
};

export type BrowseLabels = {
  heading: string;
  searchPlaceholder: string;
  clearAll: string;
  tags: Record<ResourceTag, string>;
  empty: string;
  items: string;
  of: string;
  random: string;
};

/** Fatos que uma fonte pode contribuir sobre um recurso. Todos opcionais: a
 *  página mostra só o que existe, e nenhum campo vazio aparece na tela. */
export type ResourceFacts = {
  url?: string;
  stage?: string;
  category?: string;
  pricing?: string;
  surveyPct?: number;
  type?: string;
  whenToUse?: { pt: string; en: string };
  install?: { pt: string; en: string };
  code?: string;
  draft?: boolean;
  /** Só nos repositórios do catálogo de skills. */
  license?: string;
  stars?: number;
  skillCount?: number;
  /** O termo que abre o placar filtrado por este autor. */
  catalogQuery?: string;
};

/** O item cru do índice, como o scripts/build-resources.mjs escreve. */
export type IndexedResource = {
  key: string;
  name: string;
  nameEn: string;
  desc: { pt: string; en: string };
  tags: string[];
  kind: "article" | "tool" | "skill";
  sections: string[];
  order: number | null;
  date: string | null;
  notes: Record<string, { pt: string; en: string }>;
  facts: ResourceFacts;
};

export type IndexedSection = {
  pt: string;
  en: string;
  navigable: boolean;
  path?: Record<string, string>;
};

/** Endereço canônico de um recurso. Única fonte da regra: antes ela estava
 *  duplicada, caractere por caractere, na página de índice e na busca, e as
 *  duas mandavam para uma âncora que não abria nada.
 *
 *  Um repositório do catálogo de skills não tem página própria em /r/: abre o
 *  placar já filtrado pelo autor, que é onde as skills dele estão. */
export function resourceHref(
  item: { key: string; kind: string; facts?: ResourceFacts },
  locale: string,
  sectionPaths: Record<string, { pt: string; en: string } | { path?: Record<string, string> }>,
  homeSection: string,
): string {
  if (item.kind === "article") {
    const sec = sectionPaths[homeSection] as { path?: Record<string, string> } | undefined;
    const path = sec?.path?.[locale] ?? "/artigos";
    return `/${locale}${path}/${item.key.replace(/^artigo-/, "")}`;
  }
  if (item.facts?.catalogQuery) {
    return `/${locale}/skills-agents?q=${encodeURIComponent(item.facts.catalogQuery)}`;
  }
  return `/${locale}/r/${item.key}`;
}

/** "2026-08-31" → "31 AGO 26" / "AUG 31, 26", no formato curto de índice. */
export function formatResourceDate(iso: string, locale: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  const mes = d.toLocaleString(locale === "pt" ? "pt-BR" : "en-US", { month: "short", timeZone: "UTC" }).replace(".", "").toUpperCase();
  const dia = String(d.getUTCDate()).padStart(2, "0");
  const ano = String(d.getUTCFullYear()).slice(-2);
  return locale === "pt" ? `${dia} ${mes} ${ano}` : `${mes} ${dia}, ${ano}`;
}
