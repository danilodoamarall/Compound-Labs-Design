import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { BrowseResources } from "@/components/site/browse-resources";
import {
  TAG_ORDER,
  resourceHref,
  type IndexedResource,
  type IndexedSection,
  type Resource,
  type ResourceTag,
} from "@/lib/resources";
import index from "../../../../content/resources.json";

export async function generateMetadata({ params }: PageProps<"/[locale]/explorar">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Browse" });
  return { title: t("heading"), description: t("dek") };
}

/** Tudo que o hub publica num lugar só, como um índice datado: uma linha
 *  por item com nome, descrição e data, do mais recente ao mais antigo, com
 *  filtro pelas mesmas dez tags e um botão de abrir um ao acaso.
 *
 *  O índice inclui os repositórios do catálogo de skills. Antes o /explorar
 *  listava cinco skills curadas à mão enquanto o catálogo tinha duzentas; agora
 *  cada repositório hospedado é uma linha e abre o placar filtrado pelo autor. */
export default async function BrowsePage({ params }: PageProps<"/[locale]/explorar">) {
  const { locale: l } = await params;
  const locale = l as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("Browse");

  const sections = index.sections as unknown as Record<string, IndexedSection>;

  const resources: Resource[] = (index.resources as unknown as IndexedResource[]).map((r) => {
    const home = r.sections[0];
    const section = sections[home];
    return {
      key: r.key,
      name: locale === "pt" ? r.name : r.nameEn,
      desc: locale === "pt" ? r.desc.pt : r.desc.en,
      tags: r.tags as ResourceTag[],
      href: resourceHref(r, locale, sections, home),
      external: false,
      // O rótulo diz de onde o item veio, com ou sem página para onde voltar.
      meta: section?.[locale] ?? home,
      date: r.date ?? null,
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
    random: t("random"),
  };

  return (
    <main className="mx-auto w-full max-w-5xl px-5 pb-20 pt-14">
      <p className="eyebrow">{t("eyebrow")}</p>
      <h1 className="font-display mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">{t("heading")}</h1>
      <p className="measure mt-5 text-lg text-muted-foreground">{t("dek")}</p>

      <div className="mt-14">
        <BrowseResources resources={resources} labels={labels} locale={locale} />
      </div>
    </main>
  );
}
