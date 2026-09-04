import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { CopyCommand } from "@/components/site/copy-command";
import pages from "../../../../content/pages.json";

type Secao = {
  id: string;
  group: string;
  title: string;
  body: string[];
  steps?: string[];
  code?: string;
};

export async function generateMetadata({ params }: PageProps<"/[locale]/docs">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Docs" });
  return { title: t("title"), description: t("dek") };
}

/** A documentação, na composição da introdução do shadcn/ui: um índice à
 *  esquerda agrupado por assunto, e à direita uma coluna de leitura com um
 *  conceito por título, frases curtas, e um bloco de comando com botão de copiar
 *  onde há algo para rodar.
 *
 *  O texto vem de content/pages.json, em pt e en, e foi escrito para quem nunca
 *  abriu um agente de IA: toda palavra técnica é definida na primeira vez que
 *  aparece. A ordem dos grupos é a ordem de leitura de alguém que chegou agora:
 *  comece aqui, conceitos, como usar, como funciona, participe. */
export default async function DocsPage({ params }: PageProps<"/[locale]/docs">) {
  const { locale: l } = await params;
  const locale = l as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("Docs");
  const ts = await getTranslations("Skills");
  const secoes = pages.docs[locale] as Secao[];

  // Agrupa preservando a ordem em que os grupos aparecem no conteúdo.
  const grupos: { nome: string; itens: Secao[] }[] = [];
  for (const s of secoes) {
    const g = grupos.find((x) => x.nome === s.group);
    if (g) g.itens.push(s);
    else grupos.push({ nome: s.group, itens: [s] });
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-5 pb-24 pt-14">
      <p className="eyebrow">{t("title")}</p>
      <h1 className="font-display mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">{t("title")}</h1>
      <p className="measure mt-5 text-lg leading-relaxed text-muted-foreground">{t("dek")}</p>

      <div className="mt-14 grid gap-12 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-start">
        {/* No telefone e no tablet, o índice de 18 itens recolhe num acordeão
            nativo para não empurrar o conteúdo para baixo da dobra. No desktop,
            fica fixo na coluna lateral. */}
        <details className="rounded-lg border border-border lg:hidden">
          <summary className="cursor-pointer px-4 py-3 text-sm font-medium">{t("onThisPage")}</summary>
          <nav aria-label={t("onThisPage")} className="px-4 pb-4">
          <ul className="space-y-6 text-sm">
            {grupos.map((g) => (
              <li key={g.nome}>
                <p className="eyebrow mb-2">{g.nome}</p>
                <ul className="space-y-1.5 border-l border-border">
                  {g.itens.map((s) => (
                    <li key={s.id}>
                      <a
                        href={`#${s.id}`}
                        className="-ml-px block border-l border-transparent pl-3 text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
                      >
                        {s.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
          </nav>
        </details>
        <nav aria-label={t("onThisPage")} className="hidden lg:block lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
          <ul className="space-y-6 text-sm">
            {grupos.map((g) => (
              <li key={g.nome}>
                <p className="eyebrow mb-2">{g.nome}</p>
                <ul className="space-y-1.5 border-l border-border">
                  {g.itens.map((s) => (
                    <li key={s.id}>
                      <a
                        href={`#${s.id}`}
                        className="-ml-px block border-l border-transparent pl-3 text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
                      >
                        {s.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </nav>

        <div className="min-w-0 max-w-[68ch] space-y-16">
          {grupos.map((g) => (
            <section key={g.nome} aria-label={g.nome} className="space-y-12">
              <p className="eyebrow border-b border-border pb-2">{g.nome}</p>
              {g.itens.map((s) => (
                <article key={s.id} id={s.id} className="scroll-mt-24">
                  <h2 className="font-display text-[26px] font-semibold leading-tight tracking-tight">{s.title}</h2>
                  <div className="mt-4 space-y-4">
                    {s.body.map((p, i) => (
                      // 16px/26px como a leitura do shadcn: parágrafo curto, uma
                      // ideia por vez.
                      <p key={i} className="text-[16px] leading-[26px] text-muted-foreground">{p}</p>
                    ))}
                  </div>

                  {s.steps ? (
                    <ol className="mt-5 space-y-3" aria-label={t("stepsLabel")}>
                      {s.steps.map((passo, i) => (
                        <li key={i} className="flex gap-3">
                          <span className="mt-[3px] flex size-6 shrink-0 items-center justify-center rounded-full border border-border font-mono text-[11.5px] tabular-nums text-muted-foreground">
                            {i + 1}
                          </span>
                          <span className="text-[16px] leading-[26px]">{passo}</span>
                        </li>
                      ))}
                    </ol>
                  ) : null}

                  {s.code ? (
                    <div className="mt-5">
                      <CopyCommand command={s.code} copyLabel={ts("copyCommand")} />
                    </div>
                  ) : null}
                </article>
              ))}
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
