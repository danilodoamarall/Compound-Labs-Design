import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { BookOpen, Presentation } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { listArticles } from "@/lib/articles";

export async function generateMetadata({ params }: PageProps<"/[locale]/artigos">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Articles" });
  return { title: t("title"), description: t("dek") };
}

export default async function ArticlesPage({ params }: PageProps<"/[locale]/artigos">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Articles");
  const articles = listArticles(locale as Locale);
  const series = articles[0]?.series;

  return (
    <main className="mx-auto w-full max-w-5xl px-5 pb-16 pt-14">
      <p className="eyebrow">{t("title")}</p>
      <h1 className="font-display mt-3 text-4xl font-semibold sm:text-5xl">{series ?? t("title")}</h1>
      <p className="measure mt-5 text-lg text-muted-foreground">{t("dek")}</p>

      <ol className="mt-12 divide-y divide-border border-y border-border">
        {articles.map((a) => (
          <li key={a.slug} className="grid gap-4 py-8 md:grid-cols-[72px_1fr_auto] md:items-start">
            <span className="font-display text-4xl text-muted-foreground tabular">{String(a.order).padStart(2, "0")}</span>
            <div>
              <h2 className="font-display text-2xl font-medium leading-tight sm:text-3xl">
                <Link href={{ pathname: "/artigos/[slug]", params: { slug: a.slug } }} className="hover:underline hover:underline-offset-4">{a.title}</Link>
                {a.draft ? <span className="ml-3 align-middle rounded bg-warm/15 px-1.5 py-0.5 font-mono text-[11px] text-warm">draft</span> : null}
              </h2>
              <p className="mt-3 max-w-2xl text-muted-foreground">{a.dek}</p>
              <p className="mt-3 font-mono text-xs text-muted-foreground">{t("readingTime", { minutes: a.readingMinutes })} · {t("slides", { count: a.slideCount })}</p>
            </div>
            <div className="flex gap-2 md:flex-col">
              <Link href={{ pathname: "/artigos/[slug]", params: { slug: a.slug } }} className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm hover:bg-accent"><BookOpen size={15} /> {t("read")}</Link>
              <Link href={{ pathname: "/artigos/[slug]/apresentar", params: { slug: a.slug } }} className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground hover:opacity-90"><Presentation size={15} /> {t("present")}</Link>
            </div>
          </li>
        ))}
      </ol>
    </main>
  );
}
