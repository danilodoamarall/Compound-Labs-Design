"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { Search, Shuffle, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/r-togglegroup";
import {
  TAG_ORDER,
  TAG_DOT,
  formatResourceDate,
  type Resource,
  type ResourceTag,
  type BrowseLabels,
} from "@/lib/resources";

function normalize(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

/** A lista do índice, uma linha por item: nome • descrição numa linha,
 *  a data à direita, ponto colorido da tag à esquerda. Sem data, a coluna fica
 *  vazia em vez de inventar uma. */
export function BrowseResources({
  resources,
  labels,
  locale,
}: {
  resources: Resource[];
  labels: BrowseLabels;
  locale: "pt" | "en";
}) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<ResourceTag[]>([]);
  const deferred = useDeferredValue(query);

  const available = useMemo(() => {
    const present = new Set<ResourceTag>();
    resources.forEach((r) => r.tags.forEach((t) => present.add(t)));
    return TAG_ORDER.filter((t) => present.has(t));
  }, [resources]);

  const counts = useMemo(() => {
    const c = {} as Record<ResourceTag, number>;
    available.forEach((t) => { c[t] = resources.filter((r) => r.tags.includes(t)).length; });
    return c;
  }, [resources, available]);

  const filtered = useMemo(() => {
    const q = normalize(deferred.trim());
    return resources.filter((r) => {
      if (active.length && !active.some((t) => r.tags.includes(t))) return false;
      if (!q) return true;
      return normalize(`${r.name} ${r.desc} ${r.meta}`).includes(q);
    });
  }, [resources, deferred, active]);

  const dirty = active.length > 0 || query.length > 0;

  /*  Um ao acaso, dentro do filtro atual. Navegação plena, não estado: o
   *  botão é um jeito de descobrir, e a URL de destino é a mesma da linha. */
  const aoAcaso = () => {
    if (!filtered.length) return;
    const alvo = filtered[Math.floor(Math.random() * filtered.length)];
    window.location.assign(alvo.href);
  };

  return (
    <section className="w-full">
      <div className="flex flex-wrap items-center gap-2">
        <Input
          type="search"
          value={query}
          onValueChange={(v) => setQuery(v)}
          placeholder={labels.searchPlaceholder}
          aria-label={labels.searchPlaceholder}
          showClear
          startAdornment={<Search size={15} aria-hidden />}
          size="sm"
          wrapperClassName="w-[min(100%,17rem)]"
        />

        <ToggleGroup
          type="multiple"
          value={active}
          onValueChange={(v) => setActive(v as ResourceTag[])}
          spacing={8}
          className="flex-wrap"
          aria-label={labels.heading}
        >
          {available.map((tag) => (
            <ToggleGroupItem key={tag} value={tag} variant="outline" size="lg" aria-label={labels.tags[tag]} className="gap-2 px-3.5">
              <span aria-hidden className="size-2 rounded-full" style={{ background: TAG_DOT[tag] }} />
              {labels.tags[tag]}
              <span className="font-mono text-[11px] text-muted-foreground tabular-nums">{counts[tag]}</span>
            </ToggleGroupItem>
          ))}
        </ToggleGroup>

        <button
          type="button"
          onClick={aoAcaso}
          disabled={!filtered.length}
          className="inline-flex h-10 items-center gap-1.5 rounded-md border border-border px-3 text-[14px] text-muted-foreground transition-colors hover:border-teal/50 hover:text-foreground disabled:opacity-40"
        >
          <Shuffle size={14} aria-hidden />
          {labels.random}
        </button>

        {dirty ? (
          <button
            type="button"
            onClick={() => { setActive([]); setQuery(""); }}
            className="inline-flex h-10 items-center gap-1.5 rounded-md border border-transparent px-3 text-[15px] text-muted-foreground transition-colors hover:text-foreground"
          >
            <X size={14} aria-hidden />
            {labels.clearAll}
          </button>
        ) : null}
      </div>

      <p className="mt-4 font-mono text-[11.5px] uppercase tracking-[0.12em] text-muted-foreground" aria-live="polite">
        {dirty
          ? `${filtered.length} ${labels.of} ${resources.length} ${labels.items}`
          : `${resources.length} ${labels.items}`}
      </p>

      {filtered.length === 0 ? (
        <p className="mt-10 text-muted-foreground">{labels.empty}</p>
      ) : (
        <ul className="mt-4 divide-y divide-border/60">
          {filtered.map((r) => (
            <li key={r.key}>
              <a
                href={r.href}
                target={r.external ? "_blank" : undefined}
                rel={r.external ? "noreferrer" : undefined}
                className="group flex items-baseline gap-3 rounded-md px-2 py-2.5 transition-colors hover:bg-wash"
              >
                <span aria-hidden className="size-2 shrink-0 self-center rounded-full" style={{ background: TAG_DOT[r.tags[0]] }} />
                <span className="min-w-0 flex-1 truncate">
                  <span className="font-medium group-hover:text-teal-deep">{r.name}</span>
                  {r.desc ? (
                    <>
                      <span aria-hidden className="mx-1.5 text-muted-foreground/50">•</span>
                      <span className="text-muted-foreground">{r.desc}</span>
                    </>
                  ) : null}
                </span>
                <span className="hidden shrink-0 font-mono text-[11px] uppercase tracking-wide text-muted-foreground/70 md:block">
                  {r.meta}
                </span>
                {/* A data, no formato curto. Vazia quando a fonte
                    não tem uma: coluna em branco é honesta, data inventada não. */}
                <span className="w-[9ch] shrink-0 text-right font-mono text-[11px] uppercase tabular-nums text-muted-foreground">
                  {r.date ? formatResourceDate(r.date, locale) : ""}
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
