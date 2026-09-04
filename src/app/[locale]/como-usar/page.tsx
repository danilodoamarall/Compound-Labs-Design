import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowUpRight } from "lucide-react";
import type { Locale } from "@/i18n/routing";
import { navPath, sections, type NavKey } from "@/lib/site";
import { CopyCommand } from "@/components/site/copy-command";
import pages from "../../../../content/pages.json";

type Passo = { text: string; nav: NavKey };
type Perfil = {
  id: string;
  nav: NavKey;
  role: string;
  gain: string;
  steps: Passo[];
  code?: string;
};
type ComoUsar = { summary: string[]; personas: Perfil[] };

/** As cores das seções, por chave do menu. CLI e MCP não são seções, então
 *  trazem o par que a home usa nos cards; a pesquisa herda a cor dos artigos. */
const CORES: Partial<Record<NavKey, [string, string]>> = {
  ...Object.fromEntries(sections.map((s) => [s.key, s.cover])),
  cli: ["#1f7a8c", "#123049"],
  mcp: ["#c9571c", "#7a2f14"],
  research: ["#0b8a74", "#0d3b3a"],
};

export async function generateMetadata({ params }: PageProps<"/[locale]/como-usar">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "HowTo" });
  return { title: t("title"), description: t("dek") };
}

/** A página para quem não vai ler a documentação inteira: três frases que
 *  dizem o que o framework é e entrega, e um cartão por papel, cada um com uma
 *  linha de ganho e três passos que levam a páginas reais. Nada aqui é novo
 *  conteúdo: é um mapa curto do que já existe, escrito para ser lido em dois
 *  minutos e escaneado em vinte segundos. */
export default async function ComoUsarPage({ params }: PageProps<"/[locale]/como-usar">) {
  const { locale: l } = await params;
  const locale = l as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("HowTo");
  const tn = await getTranslations("Nav");
  const ts = await getTranslations("Skills");
  const conteudo = pages.howTo[locale] as ComoUsar;

  return (
    <main className="mx-auto w-full max-w-5xl px-5 pb-24 pt-14">
      <p className="eyebrow">{t("title")}</p>
      <h1 className="font-display mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">{t("title")}</h1>
      <p className="measure mt-5 text-lg leading-relaxed text-muted-foreground">{t("dek")}</p>

      {/* O resumo: três frases, uma ideia por linha, numeradas para o olho
          saber que acabou em três. */}
      <section aria-labelledby="resumo" className="mt-12 rounded-2xl border border-border bg-card p-6 sm:p-8">
        <h2 id="resumo" className="eyebrow">{t("summaryTitle")}</h2>
        <ol className="mt-4 space-y-3">
          {conteudo.summary.map((frase, i) => (
            <li key={i} className="flex gap-3 text-[17px] leading-[27px]">
              <span className="mt-[5px] flex size-6 shrink-0 items-center justify-center rounded-full border border-border font-mono text-[11.5px] tabular-nums text-muted-foreground">
                {i + 1}
              </span>
              <span className="text-balance">{frase}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* Um cartão por papel. A cor da seção de destino entra como um ponto ao
          lado do papel: pista, não decoração. */}
      <ul className="mt-6 grid gap-4 md:grid-cols-2">
        {conteudo.personas.map((p) => {
          const cor = CORES[p.nav] ?? ["#3f4a52", "#171c1b"];
          // min-w-0: sem isso o comando longo dita a largura mínima da coluna
          // e o card estoura a grade no telefone.
          return (
            <li key={p.id} id={p.id} className="flex min-w-0 flex-col rounded-2xl border border-border bg-card p-6 scroll-mt-24 sm:p-7">
              <p className="flex items-center gap-2">
                <span
                  aria-hidden
                  className="size-2.5 shrink-0 rounded-full"
                  style={{ background: `linear-gradient(150deg, ${cor[0]}, ${cor[1]})` }}
                />
                <span className="eyebrow">{p.role}</span>
              </p>
              <h2 className="font-display mt-3 text-[22px] font-semibold leading-snug tracking-tight text-balance">{p.gain}</h2>

              <ol className="mt-5 space-y-3" aria-label={t("stepsLabel")}>
                {p.steps.map((passo, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="mt-[3px] flex size-6 shrink-0 items-center justify-center rounded-full border border-border font-mono text-[11.5px] tabular-nums text-muted-foreground">
                      {i + 1}
                    </span>
                    <span className="text-[15px] leading-[24px]">
                      {passo.text}{" "}
                      <a
                        href={navPath(passo.nav, locale)}
                        className="inline-flex items-center gap-0.5 whitespace-nowrap text-teal-deep underline decoration-teal-deep/30 underline-offset-4 transition-colors hover:decoration-teal-deep"
                      >
                        {tn(passo.nav as "articles")}
                        <ArrowUpRight size={12} aria-hidden />
                      </a>
                    </span>
                  </li>
                ))}
              </ol>

              {p.code ? (
                <div className="mt-5 min-w-0 max-w-full overflow-x-auto">
                  <CopyCommand command={p.code} copyLabel={ts("copyCommand")} />
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>

      <p className="mt-10 text-[16px] leading-[26px] text-muted-foreground">
        {t("notYou")}{" "}
        <a href={navPath("docs", locale)} className="text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground">
          {t("notYouCta")}
        </a>
        .
      </p>
    </main>
  );
}
