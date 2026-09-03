import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { sections, sectionPath } from "@/lib/site";
import { listArticles } from "@/lib/articles";
import { HeroCard } from "@/components/site/hero-card";
import { StageSection } from "@/components/site/stage-section";
import { StageResources, type StageCard } from "@/components/site/stage-resources";
import { StageArticles } from "@/components/site/stage-articles";
import { StageSubscribe } from "@/components/site/stage-subscribe";
import index from "../../../content/resources.json";

const ICON: Record<string, string> = {
  articles: "A", radar: "R", aiTools: "AI", skillsAgents: "S",
  workflow: "W", docs: "D", faq: "?",
};

/** Os spans somam 12 em cada linha, então nenhuma seção sobra sozinha no fim:
 *  5+3+4, depois 4+4+4. Artigos e Radar ficam maiores por serem a porta de
 *  entrada do hub. */
const SPAN: Record<string, number> = {
  articles: 5, radar: 3, aiTools: 4,
  skillsAgents: 4, workflow: 4, docs: 4,
  faq: 6, browse: 6,
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

  const cards: StageCard[] = [
    ...sections.map((s) => ({
      key: s.key,
      title: tn(s.key as "articles"),
      desc: th(`sections.${s.key}.short` as "sections.articles.short"),
      path: sectionPath(s.href, locale),
      cover: [...s.cover] as [string, string],
      icon: ICON[s.key] ?? "•",
      span: SPAN[s.key] ?? 4,
    })),
    {
      key: "browse",
      title: t("browseCard"),
      desc: t("browseCardDesc"),
      path: `/${locale}/${locale === "pt" ? "explorar" : "browse"}`,
      cover: ["#3f4a52", "#171c1b"] as [string, string],
      icon: "∗",
      count: String(index.resources.length),
      span: SPAN.browse,
    },
  ];

  return (
    <main className="stage flex w-full flex-col">
      <div id="inicio" className="stage-anchor">
        <HeroCard
          badge={t("badge")}
          title={t("heroTitle")}
          subtitle={t("subtitle")}
          curator={t("curator")}
          primary={{ label: t("ctaPrimary"), href: `/${locale}/${locale === "pt" ? "explorar" : "browse"}` }}
          secondary={{ label: t("ctaSecondary"), href: `/${locale}/${locale === "pt" ? "artigos" : "articles"}` }}
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
