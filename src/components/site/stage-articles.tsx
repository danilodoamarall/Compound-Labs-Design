import type { ArticleMeta } from "@/lib/articles";

/** Escala de cor da série: cada artigo herda um par próprio, para que as cinco
    capas se leiam como uma sequência e não como cinco cartazes soltos. */
const SERIES: [string, string][] = [
  ["#0b8a74", "#0d3b3a"],
  ["#1f7a8c", "#123049"],
  ["#5b4bb7", "#241f4d"],
  ["#c9571c", "#7a2f14"],
  ["#a8456b", "#3d1a2c"],
];

/** Os cinco artigos, numa linha só de cinco colunas.
 *
 *  Em três colunas sobrava uma segunda linha com dois cards, que lia como
 *  sobra. Cinco cabem lado a lado e a série se lê como sequência.
 *
 *  Onde uma galeria de fotos poria imagem, entra a capa gerada: o número, o par
 *  de cores da posição na série, e o nome do gráfico que o próprio artigo
 *  declara no frontmatter. É dado que já existe, não enfeite novo. */
export function StageArticles({
  articles,
  labels,
  locale,
}: {
  articles: ArticleMeta[];
  labels: { of: string; slides: string; minutes: string; article: string };
  locale: string;
}) {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {articles.map((a, i) => {
        const [from, to] = SERIES[i % SERIES.length];
        const n = String(a.order).padStart(2, "0");
        return (
          <li key={a.slug}>
            <a
              href={`/${locale}/${locale === "pt" ? "artigos" : "articles"}/${a.slug}`}
              className="group relative flex h-full flex-col overflow-hidden rounded-2xl border-[0.67px] border-[var(--stage-line)] bg-black/40 outline-none transition-colors hover:border-white/25 focus-visible:ring-2 focus-visible:ring-white/60"
            >
              <span aria-hidden className="relative aspect-[4/3] overflow-hidden">
                <span
                  className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.04]"
                  style={{ background: `linear-gradient(155deg, ${from}, ${to})` }}
                />
                <span className="absolute inset-0 opacity-30 mix-blend-overlay" style={{ background: "radial-gradient(80% 60% at 30% 20%, #fff, transparent 70%)" }} />
                <span className="absolute inset-0 flex flex-col justify-between p-5">
                  <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/70">
                    {a.chart || a.series}
                  </span>
                  <span className="font-mono text-[48px] font-medium leading-none tracking-[-0.06em] text-white/90">
                    {n}
                  </span>
                </span>
              </span>

              <span className="flex flex-1 flex-col gap-1 border-t border-[var(--stage-line)] p-4">
                <span className="text-[14px] font-medium leading-snug text-[#EDEDED]">{a.title}</span>
                <span className="mt-auto flex items-baseline gap-3 pt-3">
                  <span className="font-mono text-[12px] text-[var(--stage-dim)]">
                    {labels.article} {n} {labels.of} {String(a.total).padStart(2, "0")}
                  </span>
                  <span className="ml-auto text-[14px] text-[var(--stage-dim)]">
                    {a.readingMinutes} {labels.minutes}
                  </span>
                </span>
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
