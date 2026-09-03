import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import pages from "../../../../content/pages.json";

export async function generateMetadata({ params }: PageProps<"/[locale]/docs">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Docs" });
  return { title: t("title"), description: t("dek") };
}

export default async function DocsPage({ params }: PageProps<"/[locale]/docs">) {
  const { locale: l } = await params;
  const locale = l as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("Docs");
  const items = pages.docs[locale];

  return (
    <main className="mx-auto w-full max-w-4xl px-5 pb-20 pt-14">
      <p className="eyebrow">{t("title")}</p>
      <h1 className="font-display mt-3 text-4xl font-semibold sm:text-5xl">{t("title")}</h1>
      <p className="measure mt-5 text-lg text-muted-foreground">{t("dek")}</p>

      <div className="mt-14 grid gap-12 md:grid-cols-[190px_1fr] md:items-start">
        <nav aria-label={t("onThisPage")} className="md:sticky md:top-20">
          <p className="eyebrow mb-3">{t("onThisPage")}</p>
          <ul className="space-y-2 text-sm">
            {items.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="text-muted-foreground transition-colors hover:text-foreground">{s.title}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-12">
          {items.map((s) => (
            <section key={s.id} id={s.id} className="scroll-mt-20">
              <h2 className="font-display text-2xl font-medium">{s.title}</h2>
              {s.body.map((p, i) => (
                <p key={i} className="measure mt-3 leading-relaxed text-muted-foreground">{p}</p>
              ))}
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
