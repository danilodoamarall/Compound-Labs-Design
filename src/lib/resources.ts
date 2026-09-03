/** Taxonomia do índice de conteúdo. A nomenclatura é a do desengs.com.
 *
 *  Este módulo é neutro de propósito: um Server Component que importa um valor
 *  de um módulo "use client" recebe uma referência de cliente, não o valor. Por
 *  isso a ordem e as cores moram aqui, e não no componente. */

export type ResourceTag =
  | "read" | "watch" | "listen" | "browse" | "use"
  | "build" | "learn" | "join" | "follow" | "apply";

/** Ordem canônica, a mesma em que o desengs.com exibe as tags. */
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
};

export type BrowseLabels = {
  heading: string;
  searchPlaceholder: string;
  clearAll: string;
  tags: Record<ResourceTag, string>;
  empty: string;
  items: string;
  of: string;
};

/** Fatos que uma fonte pode contribuir sobre um recurso. Todos opcionais: a
 *  página mostra só o que existe, e nenhum campo vazio aparece na tela. */
export type ResourceFacts = {
  url?: string;
  ring?: string;
  quadrant?: string;
  stage?: string;
  category?: string;
  pricing?: string;
  surveyPct?: number;
  type?: string;
  whenToUse?: { pt: string; en: string };
  install?: { pt: string; en: string };
  code?: string;
  draft?: boolean;
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
  notes: Record<string, { pt: string; en: string }>;
  facts: ResourceFacts;
};

/** Endereço canônico de um recurso. Única fonte da regra: antes ela estava
 *  duplicada, caractere por caractere, na página de índice e na busca, e as
 *  duas mandavam para uma âncora que não abria nada. */
export function resourceHref(
  item: { key: string; kind: string },
  locale: string,
  sectionPaths: Record<string, { pt: string; en: string }>,
  homeSection: string,
): string {
  if (item.kind === "article") {
    const path = sectionPaths[homeSection]?.[locale as "pt" | "en"] ?? "/artigos";
    return `/${locale}${path}/${item.key.replace(/^artigo-/, "")}`;
  }
  return `/${locale}/r/${item.key}`;
}
