import type { Locale } from "@/i18n/routing";
import { sections, sectionPath } from "@/lib/site";
import { resourceHref, type IndexedResource, type IndexedSection } from "@/lib/resources";
import index from "../../content/resources.json";

export type SearchItem = {
  id: string;
  /** Rótulo do grupo na paleta: "Seções", "Artigos", "Ferramentas"... */
  group: string;
  label: string;
  desc: string;
  href: string;
  /** Palavras extras que devem casar na busca sem aparecer na tela. */
  keywords: string;
};

/** Índice único da paleta de busca, montado das mesmas fontes que alimentam o
    menu, o rodapé e a página de índice. Uma fonte só, para que a busca nunca
    discorde do que o site mostra.

    Roda no servidor e vai serializado para o cliente: são ~65 itens curtos,
    pequeno o bastante para caber no payload sem uma rota de busca. */
export function buildSearchIndex(
  locale: Locale,
  labels: { sections: string; groups: Record<string, string>; navNames: Record<string, string>; sectionDeks: Record<string, string> }
): SearchItem[] {
  const items: SearchItem[] = [];

  for (const s of sections) {
    items.push({
      id: `section-${s.key}`,
      group: labels.sections,
      label: labels.navNames[s.key] ?? s.key,
      desc: labels.sectionDeks[s.key] ?? "",
      href: sectionPath(s.href, locale),
      keywords: `${s.key} ${s.href}`,
    });
  }

  const sectionsMeta = index.sections as unknown as Record<string, IndexedSection>;
  for (const r of index.resources as unknown as IndexedResource[]) {
    const home = r.sections[0];
    const section = sectionsMeta[home];
    items.push({
      id: r.key,
      // O grupo é o rótulo da seção de origem, tenha ela página ou não: para a
      // busca, "de onde veio" é informação; "para onde ir" é o href.
      group: labels.groups[home] ?? section?.[locale] ?? home,
      label: locale === "pt" ? r.name : r.nameEn,
      desc: locale === "pt" ? r.desc.pt : r.desc.en,
      href: resourceHref(r, locale, sectionsMeta, home),
      keywords: `${r.tags.join(" ")} ${r.sections.join(" ")}`,
    });
  }

  return items;
}

/** Casa termos soltos, em qualquer ordem, ignorando acento e caixa. Uma busca
    por "figma proto" acha "Figma Make · prototipagem". */
export function matches(item: SearchItem, query: string): boolean {
  // \p{Diacritic} evita escrever a faixa de marcas combinantes, que são
  // invisíveis no código-fonte e somem em qualquer edição por script.
  const norm = (s: string) => s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
  const haystack = norm(`${item.label} ${item.desc} ${item.group} ${item.keywords}`);
  return norm(query)
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => haystack.includes(term));
}
