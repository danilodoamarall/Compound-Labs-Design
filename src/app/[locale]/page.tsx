import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { sections, sectionPath } from "@/lib/site";
import { listArticles } from "@/lib/articles";
import { HeroStage } from "@/components/site/hero-stage";
import { StageSection } from "@/components/site/stage-section";
import { StageResources, type StageCard } from "@/components/site/stage-resources";
import { StageArticles, StageMarquee } from "@/components/site/stage-articles";
import { StageResearch } from "@/components/site/stage-research";
import { StageSubscribe } from "@/components/site/stage-subscribe";
import survey from "../../../content/data/state-of-prototyping-2026.json";
import index from "../../../content/resources.json";

const ICON: Record<string, string> = {
  articles: "A", radar: "R", aiTools: "AI", skillsAgents: "S",
  workflow: "W", docs: "D", faq: "?",
};

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale: l } = await params;
  const locale = l as Locale;
  setRequestLocale(locale);

  const t = await getTranslations("Stage");
  const th = await getTranslations("Home");
  const tn = await getTranslations("Nav");
  const tsub = await getTranslations("Subscribe");
  const articles = listArticles(locale);

  const subscribeLabels = {
    placeholder: tsub("placeholder"), cta: tsub("cta"), sending: tsub("sending"),
    success: tsub("success"), errorInvalid: tsub("errorInvalid"),
    errorGeneric: tsub("errorGeneric"), errorNotConfigured: tsub("errorNotConfigured"),
    privacy: tsub("privacy"),
  };

  // Os cards saem da mesma fonte de seções que alimenta o menu e o rodapé, mais
  // um card final para a busca, que agora mora em página própria.
  const cards: StageCard[] = [
    ...sections.map((s) => ({
      key: s.key,
      title: tn(s.key as "articles"),
      desc: th(`sections.${s.key}.short` as "sections.articles.short"),
      path: sectionPath(s.href, locale),
      cover: [...s.cover] as [string, string],
      icon: ICON[s.key] ?? "•",
    })),
    {
      key: "browse",
      title: t("browseCard"),
      desc: t("browseCardDesc"),
      path: `/${locale}/${locale === "pt" ? "explorar" : "browse"}`,
      cover: ["#3f4a52", "#171c1b"] as [string, string],
      icon: "∗",
      count: String(index.resources.length),
    },
  ];

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

  const nav = [
    { id: "inicio", label: t("navHome") },
    { id: "resources", label: t("navResources") },
    { id: "artigos", label: t("navArticles") },
    { id: "research", label: t("navResearch") },
  ];

  return (
    <main id="conteudo" className="stage flex w-full flex-col">
      <div id="inicio" className="stage-anchor">
        <HeroStage
          line1={t("line1")}
          outlined={t("outlined")}
          middle={t("middle")}
          blurred={t("blurred")}
          tail={t("tail")}
          measureLabel={t("measure")}
          subtitle={t("subtitle")}
          curator={t("curator")}
          curatorRole={t("curatorRole")}
          nav={nav}
          navLabel={t("navLabel")}
        />
      </div>

      <StageSection id="resources" title={t("resourcesTitle")} dek={t("resourcesDek")}>
        <StageResources cards={cards} />
      </StageSection>

      <StageSection
        id="artigos"
        title={t("articlesTitle")}
        dek={t("articlesDek")}
        headingExtra={<StageMarquee words={articles.map((a) => a.title)} />}
      >
        <StageArticles
          articles={articles}
          locale={locale}
          labels={{ of: t("of"), slides: t("of"), minutes: t("minutes"), article: t("articleWord") }}
        />
      </StageSection>

      <StageSection id="research" title={t("researchTitle")} dek={t("researchDek")}>
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
      </StageSection>

      <StageSubscribe
        id="inscricao"
        titleBefore={t("subscribeBefore")}
        titleMark={t("subscribeMark")}
        titleAfter={t("subscribeAfter")}
        dek={t("subscribeDek")}
        cadence={t("subscribeCadence")}
        labels={subscribeLabels}
      />
    </main>
  );
}
