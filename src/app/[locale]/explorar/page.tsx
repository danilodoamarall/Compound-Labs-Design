import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { BrowseResources } from "@/components/site/browse-resources";
import { TAG_ORDER, resourceHref, type Resource, type ResourceTag } from "@/lib/resources";
import index from "../../../../content/resources.json";

export async function generateMetadata({ params }: PageProps<"/[locale]/explorar">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Browse" });
  return { title: t("heading"), description: t("dek") };
}

/** Todo o conteúdo do hub num lugar só, com busca e filtro por tag.
    Saiu da home quando a home virou palco: lá ele era o maior bloco da página e
    repetia os artigos que já apareciam logo acima. Aqui ele é o assunto. */
export default async function BrowsePage({ params }: PageProps<"/[locale]/explorar">) {
  const { locale: l } = await params;
  const locale = l as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("Browse");

  const resources: Resource[] = index.resources.map((r) => {
    const home = r.sections[0] as keyof typeof index.sections;
    const section = index.sections[home];
    return {
      key: r.key,
      name: locale === "pt" ? r.name : r.nameEn,
      desc: locale === "pt" ? r.desc.pt : r.desc.en,
      tags: r.tags as ResourceTag[],
      href: resourceHref(r, locale, index.sections as never, home),
      external: false,
      meta: section[locale],
    };
  });

  const labels = {
    heading: t("heading"),
    searchPlaceholder: t("searchPlaceholder"),
    clearAll: t("clearAll"),
    tags: Object.fromEntries(TAG_ORDER.map((k) => [k, t(`tags.${k}` as "tags.read")])) as Record<ResourceTag, string>,
    empty: t("empty"),
    items: t("items"),
    of: t("of"),
  };

  return (
    <main className="mx-auto w-full max-w-5xl px-5 pb-20 pt-14">
      <p className="eyebrow">{t("eyebrow")}</p>
      <h1 className="font-display mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">{t("heading")}</h1>
      <p className="measure mt-5 text-lg text-muted-foreground">{t("dek")}</p>

      <div className="mt-14">
        <BrowseResources resources={resources} labels={labels} />
      </div>
    </main>
  );
}
