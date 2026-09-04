import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { FaqPro } from "@/components/ui/faq-pro";
import pages from "../../../../content/pages.json";

export async function generateMetadata({ params }: PageProps<"/[locale]/faq">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Faq" });
  return { title: t("title"), description: t("dek") };
}

export default async function FaqPage({ params }: PageProps<"/[locale]/faq">) {
  const { locale: l } = await params;
  const locale = l as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("Faq");

  const items = pages.faq[locale].map((item) => ({
    id: item.id,
    question: item.q,
    answer: item.a,
  }));

  return (
    <main className="mx-auto w-full max-w-3xl px-6 pb-20 pt-14">
      <p className="eyebrow">{t("title")}</p>
      <h1 className="font-display mt-3 text-4xl font-semibold sm:text-5xl">{t("title")}</h1>
      <p className="measure mt-5 text-lg text-muted-foreground">{t("dek")}</p>

      <div className="mt-12">
        <FaqPro
          items={items}
          searchPlaceholder={t("searchPlaceholder")}
          noResultsMessage={t("noResults")}
          defaultOpenFirst
        />
      </div>
    </main>
  );
}
