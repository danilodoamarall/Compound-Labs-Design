import type { ArticleMeta } from "@/lib/articles";
import { ArticleSpark, type Serie } from "./article-spark";

/** Escala de cor da série: cada artigo herda um par próprio, para que as cinco
    capas se leiam como uma sequência e não como cinco cartazes soltos. */
const SERIES: [string, string][] = [
  ["#0b8a74", "#0d3b3a"],
  ["#1f7a8c", "#123049"],
  ["#5b4bb7", "#241f4d"],
  ["#c9571c", "#7a2f14"],
  ["#a8456b", "#3d1a2c"],
];

/** A cor do traço do gráfico, mais clara que o par do fundo para ler por cima. */
const TRACO = ["#4ec2a6", "#3fb6d8", "#8b7bea", "#e0913a", "#e879a8"];

/** Os cinco artigos, numa linha só de cinco colunas.
 *
 *  A capa mostra o gráfico do próprio artigo, com dado real da pesquisa. Antes
 *  era um gradiente com um número grande em cima, igual nos cinco: bonito e
 *  mudo. Agora a capa é uma prévia do que o artigo argumenta, e o número desceu
 *  para o canto, como referência da posição na série.
 *
 *  A série de cada capa vem do campo `chart` do frontmatter, que já apontava
 *  para o gráfico certo dentro do JSON validado da pesquisa. */
export function StageArticles({
  articles,
  labels,
  locale,
  series,
}: {
  articles: ArticleMeta[];
  labels: { of: string; slides: string; minutes: string; article: string };
  locale: string;
  /** Série de dados por nome de gráfico, montada no servidor. */
  series: Record<string, Serie>;
}) {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {articles.map((a, i) => {
        const [from, to] = SERIES[i % SERIES.length];
        const n = String(a.order).padStart(2, "0");
        const serie = series[a.chart] ?? [];
        return (
          <li key={a.slug}>
            <a
              href={`/${locale}/${locale === "pt" ? "artigos" : "articles"}/${a.slug}`}
              className="group relative flex h-full flex-col overflow-hidden rounded-2xl border-[0.67px] border-[var(--stage-line)] bg-black/40 outline-none transition-colors hover:border-white/25 focus-visible:ring-2 focus-visible:ring-white/60"
            >
              <span aria-hidden className="relative aspect-[4/3] overflow-hidden">
                <span
                  className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.03]"
                  style={{ background: `linear-gradient(155deg, ${from}, ${to})` }}
                />
                {/* O gráfico é o assunto da capa; o gradiente virou o fundo dele. */}
                {serie.length ? (
                  <ArticleSpark chart={a.chart} serie={serie} cor={TRACO[i % TRACO.length]} />
                ) : null}

                <span className="absolute left-4 top-3.5 font-mono text-[10px] uppercase tracking-[0.14em] text-white/55">
                  {a.chart || a.series}
                </span>
                <span className="absolute right-4 top-3 font-mono text-[13px] font-medium tabular-nums text-white/45">
                  {n}
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
