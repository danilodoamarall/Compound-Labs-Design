"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, Search } from "lucide-react";
import type { Skill } from "@/lib/skills";

export type CatalogLabels = {
  searchPlaceholder: string;
  all: string;
  count: string;
  of: string;
  empty: string;
  hostedHint: string;
  pointerHint: string;
  readAtSource: string;
};

/** A grade de skills, na composição do ui-skills: cards compactos com nome,
 *  descrição e a assinatura do autor.
 *
 *  Duas colunas que o deles não tem: a licença de cada skill, e a marca de
 *  quando o conteúdo não está aqui. Sem isso o leitor não sabe de quem é o que
 *  está lendo nem o que pode reusar. */
export function SkillsCatalog({
  skills,
  topics,
  labels,
  locale,
}: {
  skills: Skill[];
  topics: { key: string; count: number }[];
  labels: CatalogLabels;
  locale: string;
}) {
  const [busca, setBusca] = useState("");
  const [topico, setTopico] = useState<string | null>(null);

  const filtradas = useMemo(() => {
    const norm = (s: string) => s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
    const termos = norm(busca).split(/\s+/).filter(Boolean);
    return skills.filter((s) => {
      if (topico && !s.topics.includes(topico)) return false;
      if (!termos.length) return true;
      const palheiro = norm(`${s.pathSlug} ${s.name} ${s.description} ${s.topics.join(" ")} ${s.source.author}`);
      return termos.every((t) => palheiro.includes(t));
    });
  }, [skills, busca, topico]);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <label className="relative flex-1 min-w-[220px]">
          <Search size={15} aria-hidden className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder={labels.searchPlaceholder}
            className="h-10 w-full rounded-lg border border-border bg-card pl-9 pr-3 text-[14px] outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </label>
        <span className="font-mono text-[12px] tabular-nums text-muted-foreground">
          {filtradas.length} {labels.of} {skills.length} {labels.count}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => setTopico(null)}
          aria-pressed={topico === null}
          className={`rounded-full border px-3 py-1 text-[12.5px] transition-colors ${
            topico === null ? "border-teal/50 bg-teal/10 text-foreground" : "border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          {labels.all}
        </button>
        {topics.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTopico(topico === t.key ? null : t.key)}
            aria-pressed={topico === t.key}
            className={`rounded-full border px-3 py-1 text-[12.5px] transition-colors ${
              topico === t.key ? "border-teal/50 bg-teal/10 text-foreground" : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.key} <span className="font-mono text-[11px] opacity-60">{t.count}</span>
          </button>
        ))}
      </div>

      {filtradas.length === 0 ? (
        <p className="mt-10 text-muted-foreground">{labels.empty}</p>
      ) : (
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {filtradas.map((s) => (
            <li key={s.pathSlug}>
              <a
                href={
                  s.hosted
                    ? `/${locale}/skills-agents/${encodeURIComponent(s.pathSlug.replace("/", "__"))}`
                    : s.readAt ?? s.source.url
                }
                target={s.hosted ? undefined : "_blank"}
                rel={s.hosted ? undefined : "noreferrer"}
                className="group flex h-full flex-col rounded-xl border border-border p-4 outline-none transition-colors hover:border-teal/40 focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span className="flex items-baseline gap-2">
                  <span className="font-mono text-[13.5px] font-medium">{s.name}</span>
                  {!s.hosted ? (
                    <ArrowUpRight size={12} aria-hidden className="shrink-0 text-muted-foreground" />
                  ) : null}
                  <span className="ml-auto shrink-0 font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
                    {s.source.license ?? labels.pointerHint}
                  </span>
                </span>

                <span className="mt-2 block text-[13px] leading-relaxed text-muted-foreground">
                  {s.description}
                </span>

                <span className="mt-3 flex items-center gap-2 pt-1 text-[12px] text-muted-foreground">
                  <span className="font-mono">{s.source.author}</span>
                  <span aria-hidden className="text-muted-foreground/40">·</span>
                  <span className="truncate">{s.topics.slice(0, 3).join(", ")}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
