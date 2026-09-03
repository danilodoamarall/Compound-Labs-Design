"use client";

import { Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { CommandPalette, type CommandMenuGroupDef } from "@/components/ui/command-palette";
import { matches, type SearchItem } from "@/lib/search";

export type SearchLabels = {
  trigger: string;
  placeholder: string;
  empty: string;
  noQuery: string;
  results: string;
  resultsOne: string;
  a11yTitle: string;
  a11yDescription: string;
  close: string;
};

/** Busca do hub, no espírito do Ctrl+K do Geist: uma caixa só que alcança as
    seções, os artigos e as 57 ferramentas indexadas.

    O índice vem pronto do servidor, montado por buildSearchIndex a partir das
    mesmas fontes que alimentam o menu e o rodapé. São itens curtos, então cabem
    no payload e a busca responde sem ida ao servidor. */
export function SiteSearch({ items, labels }: { items: SearchItem[]; labels: SearchLabels }) {
  const pathname = usePathname();

  // Agrupa preservando a ordem em que os grupos aparecem no índice.
  const groups: CommandMenuGroupDef[] = [];
  const byHeading = new Map<string, CommandMenuGroupDef>();
  for (const item of items) {
    let group = byHeading.get(item.group);
    if (!group) {
      group = { heading: item.group, items: [] };
      byHeading.set(item.group, group);
      groups.push(group);
    }
    group.items.push({
      id: item.id,
      label: item.label,
      description: item.desc,
      href: item.href,
      keywords: item.keywords.split(/\s+/).filter(Boolean),
    });
  }

  return (
    <CommandPalette
      groups={groups}
      // Reusa o casador do índice: sem acento, termos em qualquer ordem.
      filter={(entry, query) =>
        matches(
          {
            id: String(entry.id ?? entry.label),
            group: "",
            label: entry.label,
            desc: entry.description ?? "",
            href: entry.href ?? "",
            keywords: (entry.keywords ?? []).join(" "),
          },
          query
        )
      }
      currentPath={pathname}
      closeOnRouteChange
      // A lista de recentes grava em localStorage com chave não namespaced, e
      // o ganho não paga o dado guardado no navegador de quem visita.
      showRecentGroup={false}
      showThemeGroup={false}
      placeholder={labels.placeholder}
      emptyMessage={labels.empty}
      noQueryMessage={labels.noQuery}
      resultsLabel={(n) => (n === 1 ? labels.resultsOne : labels.results.replace("%n", String(n)))}
      a11yTitle={labels.a11yTitle}
      a11yDescription={labels.a11yDescription}
      closeLabel={labels.close}
      triggerProps={{
        "aria-label": labels.trigger,
        showShortcut: true,
      }}
      trigger={
        <button
          type="button"
          aria-label={labels.trigger}
          className="inline-flex h-9 items-center gap-2 rounded-md border border-border px-2.5 text-[13px] text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Search size={15} aria-hidden />
          <span className="hidden lg:inline">{labels.trigger}</span>
          <kbd
            aria-hidden
            className="ml-1 hidden rounded border border-border px-1.5 py-0.5 font-mono text-[10.5px] leading-none lg:inline"
          >
            Ctrl K
          </kbd>
        </button>
      }
    />
  );
}
