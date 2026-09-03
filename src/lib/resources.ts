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
  headingAccent: string;
  searchPlaceholder: string;
  clearAll: string;
  tags: Record<ResourceTag, string>;
  empty: string;
  countAll: string;
  countFiltered: string;
};
