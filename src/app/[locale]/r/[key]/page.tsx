import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { ResourceView, type Sibling } from "@/components/site/resource-view";
import type { IndexedResource } from "@/lib/resources";
import index from "../../../../../content/resources.json";

type SectionMeta = { pt: string; en: string; navigable: boolean; path?: Record<string, string> };

const RESOURCES = index.resources as unknown as IndexedResource[];
const SECTIONS = index.sections as unknown as Record<string, SectionMeta>;

/** Só ferramentas e skills ganham página aqui. Os artigos já têm a própria, com
 *  modo leitura e modo apresentação, que é mais rica que este gabarito. */
const OPENABLE = RESOURCES.filter((r) => r.kind !== "article");

function find(key: string) {
  return OPENABLE.find((r) => r.key === key) ?? null;
}

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => OPENABLE.map((r) => ({ locale, key: r.key })));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/r/[key]">): Promise<Metadata> {
  const { locale, key } = await params;
  const item = find(key);
  if (!item) return {};
  const l = locale as Locale;
  return {
    title: l === "pt" ? item.name : item.nameEn,
    description: item.desc[l],
  };
}

export default async function ResourcePage({ params }: PageProps<"/[locale]/r/[key]">) {
  const { locale: l, key } = await params;
  const locale = l as Locale;
  setRequestLocale(locale);

  const item = find(key);
  if (!item) notFound();

  const t = await getTranslations("Resource");

  /*  Rótulo para toda seção; link só para as navegáveis. As do acervo (as
   *  antigas Radar e AI Tools) continuam como origem do dado e aparecem pelo
   *  nome, mas não têm mais página para onde mandar o leitor. */
  const sectionLabels: Record<string, string> = {};
  const sectionHrefs: Record<string, string> = {};
  for (const [id, meta] of Object.entries(SECTIONS)) {
    sectionLabels[id] = meta[locale];
    if (meta.navigable && meta.path) sectionHrefs[id] = `/${locale}${meta.path[locale]}`;
  }

  // Irmãos dentro da mesma seção, para o leitor seguir sem voltar à lista.
  const home = item.sections[0];
  const family = OPENABLE.filter((r) => r.sections[0] === home);
  const i = family.findIndex((r) => r.key === item.key);
  const toSibling = (r: IndexedResource | undefined): Sibling =>
    r ? { key: r.key, name: locale === "pt" ? r.name : r.nameEn, href: `/${locale}/r/${r.key}` } : null;

  const labels = {
    draft: t("draft"),
    visit: t("visit"),
    whenToUse: t("whenToUse"),
    install: t("install"),
    code: t("code"),
    appearsIn: t("appearsIn"),
    source: t("source"),
    updated: t("updated"),
    previous: t("previous"),
    next: t("next"),
    openCatalog: t("openCatalog"),
    facts: {
      stage: t("facts.stage"),
      type: t("facts.type"),
      pricing: t("facts.pricing"),
      category: t("facts.category"),
      surveyPct: t("facts.surveyPct"),
      stars: t("facts.stars"),
      skillCount: t("facts.skillCount"),
      license: t("facts.license"),
    },
    values: {
      free: t("values.free"), freemium: t("values.freemium"), paid: t("values.paid"),
      skill: t("values.skill"), agent: t("values.agent"), mcp: t("values.mcp"),
      tool: t("values.tool"),
      design: t("values.design"), prototype: t("values.prototype"),
      build: t("values.build"), agents: t("values.agents"),
      ship: t("values.ship"), run: t("values.run"),
    },
  };

  return (
    <main>
      <ResourceView
        item={item}
        locale={locale}
        sectionLabels={sectionLabels}
        sectionHrefs={sectionHrefs}
        labels={labels}
        // A data do índice, não a de um arquivo de seção: antes vinha de
        // radar.json e valia para todo recurso, inclusive os que nada tinham
        // a ver com o radar.
        updated={index.updated}
        catalogHref={`/${locale}/skills-agents`}
        previous={toSibling(family[i - 1])}
        next={toSibling(family[i + 1])}
      />
    </main>
  );
}
