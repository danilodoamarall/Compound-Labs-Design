import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { StageResearch } from "@/components/site/stage-research";
import survey from "../../../../content/data/state-of-prototyping-2026.json";

export async function generateMetadata({ params }: PageProps<"/[locale]/research">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Stage" });
  return { title: t("researchTitle"), description: t("researchDek") };
}

/** A pesquisa que originou a série. Saiu da home quando a home encurtou: é a
 *  fonte, e fonte merece endereço próprio em vez de virar um bloco de rolagem. */
export default async function ResearchPage({ params }: PageProps<"/[locale]/research">) {
  const { locale: l } = await params;
  const locale = l as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("Stage");

  const camps = survey.derived.camps.map((c) => ({
    key: c.key,
    label: locale === "pt" ? c.pt : c.en,
    pct: c.pct,
    n: c.n,
  }));

  const tools = survey.tools.slice(0, 8).map((tool) => ({
    key: tool.key,
    label: locale === "pt" ? tool.pt : tool.en,
    pct: tool.pct,
    ai: tool.ai,
  }));

  return (
    <main className="mx-auto w-full max-w-5xl px-6 pb-20 pt-14">
      <p className="eyebrow">{survey.meta.title}</p>
      <h1 className="font-display mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
        {t("researchTitle")}
      </h1>
      <p className="measure mt-5 text-lg text-muted-foreground">{t("researchDek")}</p>

      <div className="mt-14">
        <StageResearch
          responses={survey.headline.total_responses}
          builtTool={survey.headline.built_tool_with_ai}
          investing={survey.headline.ai_invest_next_12mo}
          camps={camps}
          tools={tools}
          collected={`${survey.meta.collected.from} → ${survey.meta.collected.to}`}
          license={survey.meta.license}
          csvHref="/data/state-of-prototyping-2026.csv"
          sourceHref={survey.meta.url}
          locale={locale}
          labels={{
            responses: t("researchResponses"),
            builtTool: t("researchBuilt"),
            investing: t("researchInvesting"),
            campsTitle: t("researchCamps"),
            toolsTitle: t("researchTools"),
            collected: t("researchCollected"),
            license: t("researchLicense"),
            csv: t("researchCsv"),
            source: t("researchSource"),
          }}
        />
      </div>
    </main>
  );
}
