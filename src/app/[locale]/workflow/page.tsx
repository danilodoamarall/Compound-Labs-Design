import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowUpRight } from "lucide-react";
import type { Locale } from "@/i18n/routing";
import workflow from "../../../../content/workflow.json";

/** Ordem das etapas na página: o fluxo do trabalho, não a ordem alfabética. */
const STAGES = ["design", "prototype", "build", "agents", "ship", "run"] as const;

export async function generateMetadata({ params }: PageProps<"/[locale]/workflow">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Workflow" });
  return { title: t("title"), description: t("dek") };
}

export default async function WorkflowPage({ params }: PageProps<"/[locale]/workflow">) {
  const { locale: l } = await params;
  const locale = l as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("Workflow");

  const byStage = STAGES.map((stage) => ({
    stage,
    items: workflow.tools.filter((tool) => tool.stage === stage),
  })).filter((g) => g.items.length > 0);

  return (
    <main className="mx-auto w-full max-w-5xl px-5 pb-20 pt-14">
      <p className="eyebrow">{t("title")} · {t("count", { count: workflow.tools.length })}</p>
      <h1 className="font-display mt-3 text-4xl font-semibold sm:text-5xl">{t("title")}</h1>
      <p className="measure mt-5 text-lg text-muted-foreground">{t("dek")}</p>
      <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
        {t("sourceNote")}{" "}
        <a href={workflow.source.url} target="_blank" rel="noreferrer" className="text-teal-deep underline underline-offset-4">
          {workflow.source.label}
        </a>
      </p>

      <div className="mt-14 space-y-14">
        {byStage.map(({ stage, items }) => (
          <section key={stage}>
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-border pb-3">
              <h2 className="font-display text-2xl font-medium">{t(`stages.${stage}` as "stages.design")}</h2>
              <p className="text-sm text-muted-foreground">{t(`stageHints.${stage}` as "stageHints.design")}</p>
              <span className="ml-auto font-mono text-xs text-muted-foreground tabular">{items.length}</span>
            </div>

            <ul className="mt-1 divide-y divide-border/70">
              {items.map((tool) => (
                <li key={tool.key} id={tool.key} className="scroll-mt-20">
                  <a
                    href={tool.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group grid gap-x-5 gap-y-1 py-4 sm:grid-cols-[minmax(140px,1fr)_minmax(0,2fr)] sm:items-baseline"
                  >
                    <span className="flex items-baseline gap-2">
                      <span className="font-medium group-hover:text-teal-deep">{tool.name}</span>
                      <ArrowUpRight size={13} className="shrink-0 translate-y-px text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                    </span>
                    <span className="text-[15px] leading-relaxed text-muted-foreground">
                      {locale === "pt" ? tool.pt : tool.en}
                      <span className="ml-2 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                        {tool.category}
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
