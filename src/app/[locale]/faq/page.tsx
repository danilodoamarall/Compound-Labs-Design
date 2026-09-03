import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
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
  const items = pages.faq[locale];

  return (
    <main className="mx-auto w-full max-w-3xl px-5 pb-20 pt-14">
      <p className="eyebrow">{t("title")}</p>
      <h1 className="font-display mt-3 text-4xl font-semibold sm:text-5xl">{t("title")}</h1>
      <p className="measure mt-5 text-lg text-muted-foreground">{t("dek")}</p>

      <dl className="mt-12 border-t border-border">
        {items.map((item) => (
          <div key={item.id} className="border-b border-border py-7">
            <dt id={item.id} className="scroll-mt-20 font-display text-xl font-medium leading-snug">{item.q}</dt>
            <dd className="mt-3 leading-relaxed text-muted-foreground">{item.a}</dd>
          </div>
        ))}
      </dl>
    </main>
  );
}
