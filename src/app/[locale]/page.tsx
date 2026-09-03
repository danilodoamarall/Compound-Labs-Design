import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { sections, sectionPath, coverOrder, coverInitialIndex } from "@/lib/site";
import { HomeCoverFlow, type HomeSection } from "@/components/site/home-coverflow";
import { BrowseResources } from "@/components/site/browse-resources";
import { RevealText } from "@/components/ui/reveal-text";
import StatusDot from "@/components/ui/status-dot";
import { TAG_ORDER, type Resource, type ResourceTag } from "@/lib/resources";
import index from "../../../content/resources.json";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale: l } = await params;
  const locale = l as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("Home");
  const ts = await getTranslations("Site");
  const tn = await getTranslations("Nav");
  const tb = await getTranslations("Browse");

  const covers: HomeSection[] = coverOrder.map((key) => {
    const s = sections.find((x) => x.key === key)!;
    return {
      key: s.key,
      path: sectionPath(s.href, locale),
      title: tn(s.key as "articles"),
      subtitle: t(`sections.${s.key}.short` as "sections.articles.short"),
      cover: [...s.cover] as [string, string],
    };
  });

  // O índice vem de scripts/build-resources.mjs, que junta as quatro seções de
  // conteúdo e funde os itens que aparecem em mais de uma.
  const resources: Resource[] = index.resources.map((r) => {
    const home = r.sections[0] as keyof typeof index.sections;
    const section = index.sections[home];
    const isArticle = r.kind === "article";
    return {
      key: r.key,
      name: locale === "pt" ? r.name : r.nameEn,
      desc: locale === "pt" ? r.desc.pt : r.desc.en,
      tags: r.tags as ResourceTag[],
      href: isArticle
        ? `/${locale}${section.path[locale]}/${r.key.replace(/^artigo-/, "")}`
        : `/${locale}${section.path[locale]}#${r.key}`,
      external: false,
      meta: section[locale],
    };
  });

  const browseLabels = {
    heading: tb("heading"),
    headingAccent: tb("headingAccent"),
    searchPlaceholder: tb("searchPlaceholder"),
    clearAll: tb("clearAll"),
    tags: Object.fromEntries(TAG_ORDER.map((k) => [k, tb(`tags.${k}` as "tags.read")])) as Record<ResourceTag, string>,
    empty: tb("empty"),
    items: tb("items"),
    of: tb("of"),
  };

  return (
    <main className="flex flex-1 flex-col items-center pb-24 pt-16 sm:pt-24">
      <div className="flex flex-col items-center px-5">
        <p className="inline-flex max-w-full items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-center text-[13px] leading-snug text-muted-foreground">
          <StatusDot tone="active" size="sm" animate className="shrink-0" />
          <span className="text-balance">
            <span className="text-foreground">{ts("author")}</span>
            <span className="mx-1.5 text-muted-foreground/50">·</span>
            {ts("authorRole")}
          </span>
        </p>

        <RevealText
          text={t("title")}
          as="h1"
          split="word"
          stagger={0.06}
          className="font-display mt-9 max-w-4xl text-center text-[2.75rem] font-semibold leading-[1.02] tracking-tight sm:text-6xl md:text-7xl"
        />

        <p className="mt-7 max-w-xl text-center text-lg leading-relaxed text-muted-foreground sm:text-xl">
          {t("dek")}
        </p>
      </div>

      <div className="mt-20 w-full sm:mt-24">
        <BrowseResources resources={resources} labels={browseLabels} />
      </div>

      <div className="mt-24 w-full border-t border-border pt-16 sm:mt-28">
        <HomeCoverFlow sections={covers} initialIndex={coverInitialIndex} label={ts("name")} hint={t("coverHint")} />
      </div>
    </main>
  );
}
