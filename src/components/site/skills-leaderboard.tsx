"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, ChevronDown, Search } from "lucide-react";

/** Uma linha do placar. Serializada no servidor: o cliente não carrega o
 *  registro inteiro só para desenhar uma tabela. */
export type LinhaSkill = {
  rank: number;
  pathSlug: string;
  name: string;
  description: string;
  topics: string[];
  author: string;
  repo: string;
  license: string | null;
  hosted: boolean;
  stars: number | null;
  starsLabel: string;
  href: string;
  externo: boolean;
};

export type RotulosPlacar = {
  searchPlaceholder: string;
  all: string;
  empty: string;
  colSkill: string;
  colStars: string;
  colLicense: string;
  colTopics: string;
  maisDe: string;
  pointerHint: string;
  resultados: string;
};

/** Quantas skills de um mesmo repositório aparecem antes de colapsar.
 *
 *  Sem isto o placar não funciona. Ordenando só por estrelas, os vinte
 *  primeiros lugares vêm de quatro repositórios, e um só deles ocupa treze:
 *  as skills herdam a nota do repo, então um repo popular varre a lista e o
 *  placar deixa de dizer qualquer coisa. É o mesmo motivo pelo qual o skills.sh
 *  tem o "+N more from". */
const TETO_POR_REPO = 2;

type Grupo = { tipo: "linha"; linha: LinhaSkill } | { tipo: "colapso"; repo: string; itens: LinhaSkill[] };

/** Percorre a lista já ordenada e colapsa o excedente de cada repositório na
 *  posição em que ele apareceria. A ordem geral do placar não muda. */
function agrupar(linhas: LinhaSkill[]): Grupo[] {
  const vistos = new Map<string, number>();
  const excedente = new Map<string, LinhaSkill[]>();
  const saida: Grupo[] = [];

  for (const linha of linhas) {
    const repo = `${linha.author}/${linha.repo}`;
    const n = (vistos.get(repo) ?? 0) + 1;
    vistos.set(repo, n);

    if (n <= TETO_POR_REPO) {
      saida.push({ tipo: "linha", linha });
      continue;
    }

    if (n === TETO_POR_REPO + 1) {
      const itens: LinhaSkill[] = [];
      excedente.set(repo, itens);
      saida.push({ tipo: "colapso", repo, itens });
    }
    excedente.get(repo)!.push(linha);
  }

  // Um colapso de um item só é ruído: melhor mostrar a linha.
  return saida.flatMap((g) =>
    g.tipo === "colapso" && g.itens.length === 1
      ? [{ tipo: "linha" as const, linha: g.itens[0] }]
      : [g]
  );
}

function Celulas({ linha, rotulos }: { linha: LinhaSkill; rotulos: RotulosPlacar }) {
  return (
    <>
      <span className="shrink-0 pt-0.5 text-right font-mono text-[13px] tabular-nums text-muted-foreground/70 sm:w-9">
        {linha.rank}
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex items-baseline gap-1.5">
          <span className="truncate text-[15px] font-semibold">{linha.name}</span>
          {linha.externo ? (
            <ArrowUpRight size={12} aria-hidden className="shrink-0 text-muted-foreground" />
          ) : null}
        </span>
        <span className="mt-0.5 block truncate font-mono text-[12.5px] text-muted-foreground">
          {linha.author}/{linha.repo}
        </span>
        <span className="mt-1 line-clamp-1 block text-[13px] text-muted-foreground sm:hidden">
          {linha.description}
        </span>
      </span>

      <span className="hidden w-[15ch] shrink-0 truncate pt-0.5 font-mono text-[12px] text-muted-foreground lg:block">
        {linha.topics.slice(0, 2).join(", ")}
      </span>

      <span className="w-[6ch] shrink-0 pt-0.5 text-right font-mono text-[13px] tabular-nums">
        {linha.starsLabel}
      </span>

      <span className="hidden w-[10ch] shrink-0 pt-0.5 text-right font-mono text-[11.5px] uppercase tracking-wide text-muted-foreground sm:block">
        {linha.license ?? rotulos.pointerHint}
      </span>
    </>
  );
}

function Linha({ linha, rotulos }: { linha: LinhaSkill; rotulos: RotulosPlacar }) {
  return (
    <li>
      <a
        href={linha.href}
        target={linha.externo ? "_blank" : undefined}
        rel={linha.externo ? "noreferrer" : undefined}
        className="flex items-start gap-3 rounded-lg px-2 py-3 outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring sm:gap-4"
      >
        <Celulas linha={linha} rotulos={rotulos} />
      </a>
    </li>
  );
}

export function SkillsLeaderboard({
  linhas,
  topics,
  rotulos,
  initialQuery = "",
}: {
  linhas: LinhaSkill[];
  topics: { key: string; count: number }[];
  rotulos: RotulosPlacar;
  /** Busca já preenchida ao abrir. O /explorar chega aqui com `?q=autor`. */
  initialQuery?: string;
}) {
  const [busca, setBusca] = useState(initialQuery);
  const [topico, setTopico] = useState<string | null>(null);
  const [abertos, setAbertos] = useState<Set<string>>(() => new Set());

  const filtradas = useMemo(() => {
    const norm = (s: string) => s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
    const termos = norm(busca).split(/\s+/).filter(Boolean);
    return linhas.filter((s) => {
      if (topico && !s.topics.includes(topico)) return false;
      if (!termos.length) return true;
      const palheiro = norm(`${s.pathSlug} ${s.name} ${s.description} ${s.topics.join(" ")} ${s.author}`);
      return termos.every((t) => palheiro.includes(t));
    });
  }, [linhas, busca, topico]);

  // Com filtro ativo a lista já está curta e o colapso atrapalharia: quem
  // buscou por um autor quer ver as skills dele, não um resumo.
  const grupos = useMemo(
    () => (busca.trim() || topico ? filtradas.map((l) => ({ tipo: "linha" as const, linha: l })) : agrupar(filtradas)),
    [filtradas, busca, topico]
  );

  const alternar = (repo: string) =>
    setAbertos((anterior) => {
      const proximo = new Set(anterior);
      if (proximo.has(repo)) proximo.delete(repo);
      else proximo.add(repo);
      return proximo;
    });

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <label className="relative min-w-[220px] flex-1">
          <Search size={15} aria-hidden className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder={rotulos.searchPlaceholder}
            className="h-10 w-full rounded-lg border border-border bg-card pl-9 pr-3 text-[14px] outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </label>
        <span className="font-mono text-[12px] tabular-nums text-muted-foreground">
          {filtradas.length} {rotulos.resultados}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => setTopico(null)}
          aria-pressed={topico === null}
          className={`rounded-full border px-3 py-1 text-[12.5px] transition-colors ${
            topico === null
              ? "border-teal/50 bg-teal/10 text-foreground"
              : "border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          {rotulos.all}
        </button>
        {topics.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTopico(topico === t.key ? null : t.key)}
            aria-pressed={topico === t.key}
            className={`rounded-full border px-3 py-1 text-[12.5px] transition-colors ${
              topico === t.key
                ? "border-teal/50 bg-teal/10 text-foreground"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.key} <span className="font-mono text-[11px] opacity-60">{t.count}</span>
          </button>
        ))}
      </div>

      {filtradas.length === 0 ? (
        <p className="mt-10 text-muted-foreground">{rotulos.empty}</p>
      ) : (
        <>
          {/* O cabeçalho da tabela, na chave do skills.sh: mono, versalete,
              esmaecido. É o que dá o tom técnico sem precisar de cor. */}
          <div
            aria-hidden
            className="mt-6 flex items-center gap-3 border-b border-border px-2 pb-2 font-mono text-[11.5px] uppercase tracking-[0.08em] text-muted-foreground sm:gap-4"
          >
            <span className="shrink-0 text-right sm:w-9">#</span>
            <span className="min-w-0 flex-1">{rotulos.colSkill}</span>
            <span className="hidden w-[15ch] shrink-0 lg:block">{rotulos.colTopics}</span>
            <span className="w-[6ch] shrink-0 text-right">{rotulos.colStars}</span>
            <span className="hidden w-[10ch] shrink-0 text-right sm:block">{rotulos.colLicense}</span>
          </div>

          <ul className="divide-y divide-border">
            {grupos.map((g) =>
              g.tipo === "linha" ? (
                <Linha key={g.linha.pathSlug} linha={g.linha} rotulos={rotulos} />
              ) : (
                <li key={`colapso-${g.repo}`}>
                  <button
                    type="button"
                    onClick={() => alternar(g.repo)}
                    aria-expanded={abertos.has(g.repo)}
                    className="flex w-full items-center gap-2 rounded-lg px-2 py-2.5 text-left font-mono text-[12.5px] text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <ChevronDown
                      size={13}
                      aria-hidden
                      className={`shrink-0 transition-transform ${abertos.has(g.repo) ? "rotate-180" : ""}`}
                    />
                    <span className="sm:ml-7">
                      {rotulos.maisDe.replace("%n", String(g.itens.length)).replace("%repo", g.repo)}
                    </span>
                  </button>

                  {abertos.has(g.repo) ? (
                    <ul className="divide-y divide-border border-t border-border">
                      {g.itens.map((linha) => (
                        <Linha key={linha.pathSlug} linha={linha} rotulos={rotulos} />
                      ))}
                    </ul>
                  ) : null}
                </li>
              )
            )}
          </ul>
        </>
      )}
    </div>
  );
}
