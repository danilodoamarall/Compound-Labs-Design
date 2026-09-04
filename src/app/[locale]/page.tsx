import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { authorLinkedIn, navPath } from "@/lib/site";
import { listArticles } from "@/lib/articles";
import { HeroCard } from "@/components/site/hero-card";
import { StageSection } from "@/components/site/stage-section";
import { StageResources, type StageCard } from "@/components/site/stage-resources";
import { VisualArtigos, VisualSkills, VisualCli, VisualMcp, VisualBrowse } from "@/components/site/bento-visuals";
import survey from "../../../content/data/state-of-prototyping-2026.json";
import { StageArticles } from "@/components/site/stage-articles";
import { StageSubscribe } from "@/components/site/stage-subscribe";
import index from "../../../content/resources.json";

/** Os cinco cards do bento, nas duas linhas de 12 colunas: 8+4 e 4+4+4.
 *
 *  São os cinco lugares em que o hub tem substância, medida em conteúdo
 *  próprio: os artigos (68 KB de MDX com slides), o catálogo de skills (2,2 MB
 *  de markdown com licença verificada), o CLI e o MCP que dão acesso a ele, e o
 *  índice que reúne tudo. Workflow, Docs e FAQ continuam no menu e no rodapé;
 *  saíram só da vitrine, porque juntos somam menos texto que um artigo. */
const BENTO = [
  { key: "articles", span: 8, cover: ["#0b8a74", "#0d3b3a"] },
  { key: "skillsAgents", span: 4, cover: ["#5b4bb7", "#241f4d"] },
  { key: "cli", span: 4, cover: ["#1f7a8c", "#123049"] },
  { key: "mcp", span: 4, cover: ["#c9571c", "#7a2f14"] },
  { key: "browse", span: 4, cover: ["#3f4a52", "#171c1b"] },
] as const;

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
    emailLabel: tsub("emailLabel"), placeholder: tsub("placeholder"), cta: tsub("cta"), sending: tsub("sending"),
    success: tsub("success"), errorInvalid: tsub("errorInvalid"),
    errorGeneric: tsub("errorGeneric"), errorNotConfigured: tsub("errorNotConfigured"),
    privacy: tsub("privacy"),
  };

  // Cada artigo declara um gráfico no frontmatter, e o nome aponta para uma
  // série de verdade da pesquisa. A capa passa a mostrar esse dado.
  const paraSerie = (arr: { pt: string; en: string; pct?: number | null }[]) =>
    arr.map((d) => ({ label: locale === "pt" ? d.pt : d.en, pct: typeof d.pct === "number" ? d.pct : 0 }));
  const seriesPorGrafico = {
    "vibe-band": paraSerie(survey.vibe),
    trust: paraSerie(survey.trust),
    outlook: paraSerie(survey.outlook),
    investing: paraSerie(survey.investing).slice(0, 7),
    blockers: paraSerie(survey.blockers),
  };

  const visuais: Record<(typeof BENTO)[number]["key"], React.ReactNode> = {
    articles: <VisualArtigos titles={articles.map((a) => a.title)} />,
    skillsAgents: <VisualSkills />,
    cli: <VisualCli />,
    mcp: <VisualMcp />,
    browse: <VisualBrowse total={index.resources.length} />,
  };

  const cards: StageCard[] = BENTO.map((b) => ({
    key: b.key,
    title: tn(b.key as "articles"),
    desc: th(`sections.${b.key}.short` as "sections.articles.short"),
    path: navPath(b.key, locale),
    cover: [...b.cover] as [string, string],
    span: b.span,
    visual: visuais[b.key],
    count: b.key === "browse" ? String(index.resources.length) : undefined,
  }));

  return (
    <main className="stage flex w-full flex-col">
      <div id="inicio" className="stage-anchor">
        <HeroCard
          badge={t("badge")}
          title={t("heroTitle")}
          subtitle={t("subtitle")}
          curator={t("curator")}
          curatorRole={t("curatorRole")}
          curatorHref={authorLinkedIn}
          // Duas portas: as AI Tools (CLI e MCP, na seção "Agente, comece por
          // aqui" do catálogo) para quem já tem um agente, e o "Como usar" para
          // quem quer o mapa em três passos antes de qualquer comando.
          primary={{ label: t("ctaPrimary"), href: `${navPath("skillsAgents", locale)}#agente` }}
          secondary={{ label: t("ctaSecondary"), href: navPath("howTo", locale) }}
          // A documentação completa fica como terceiro caminho, discreto.
          tertiary={{ label: t("docsCta"), href: navPath("docs", locale) }}
        />
      </div>

      <StageSection id="resources" title={t("resourcesTitle")} dek={t("resourcesDek")}>
        <StageResources cards={cards} />
      </StageSection>

      <StageSection id="artigos" title={t("articlesTitle")} dek={t("articlesDek")}>
        <StageArticles
          articles={articles}
          locale={locale}
          labels={{ of: t("of"), slides: t("of"), minutes: t("minutes"), article: t("articleWord") }}
          series={seriesPorGrafico}
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
