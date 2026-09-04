import { MDXRemote } from "next-mdx-remote/rsc";
import { getTranslations } from "next-intl/server";
import { ArrowLeft, ArrowRight, BookOpen, Presentation } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getArticle, neighbors } from "@/lib/articles";
import { fmtDate } from "@/lib/format";
import { survey } from "@/lib/data";
import { Chart, type ChartName } from "@/components/charts/Chart";
import { Deck } from "./Deck";
import { Slide } from "./Slide";
import { Stat, Stats, Callout, Question, Two } from "./Blocks";
import { notFound } from "next/navigation";

export async function ArticleView({ slug, locale, mode }: { slug: string; locale: Locale; mode: "read" | "present" }) {
  const article = getArticle(slug, locale);
  if (!article) notFound();
  const t = await getTranslations("Articles");
  const { previous, next } = neighbors(slug, locale);

  const components = {
    Slide,
    Stats,
    Callout,
    Question,
    Two,
    Chart: (p: { name: ChartName }) => <Chart name={p.name} locale={locale} />,
    Stat: (p: Omit<Parameters<typeof Stat>[0], "locale">) => <Stat {...p} locale={locale} />,
  };

  const labels = {
    previous: t("previous"),
    next: t("next"),
    slideOf: t("slideOf", { n: "{n}", total: "{total}" }),
    notes: t("speakerNotes"),
    fullscreen: "Fullscreen",
    exit: t("readMode"),
    keyboardHint: t("keyboardHint"),
  };

  const presentHref = { pathname: "/artigos/[slug]/apresentar", params: { slug } } as const;
  const exitHref = `/${locale}${locale === "pt" ? "/artigos/" : "/articles/"}${slug}`;

  const body = (
    <Deck mode={mode} exitHref={exitHref} labels={labels}>
      <MDXRemote source={article.body} components={components} />
    </Deck>
  );

  if (mode === "present") return body;

  return (
    <main className="mx-auto w-full max-w-4xl px-5 pb-16 pt-12">
      <header className="mb-12 border-b border-border pb-10">
        <p className="eyebrow">
          {article.series} · {t("part", { n: article.order, total: article.total })}
          {article.draft ? <span className="ml-3 rounded bg-warm/15 px-1.5 py-0.5 text-warm-text">draft</span> : null}
        </p>
        <h1 className="font-display mt-4 text-4xl font-semibold leading-[1.05] sm:text-5xl md:text-6xl">{article.title}</h1>
        <p className="font-display mt-6 max-w-3xl text-xl leading-snug text-muted-foreground sm:text-2xl">{article.dek}</p>
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
          <span>{t("readingTime", { minutes: article.readingMinutes })}</span>
          <span>{t("slides", { count: article.slideCount })}</span>
          {article.date ? <span>{t("publishedOn", { date: fmtDate(article.date, locale) })}</span> : null}
          <span className="ml-auto inline-flex overflow-hidden rounded-md border border-border text-sm">
            <span className="inline-flex items-center gap-1.5 bg-accent px-3 py-1.5 text-accent-foreground"><BookOpen size={15} /> {t("readMode")}</span>
            <Link href={presentHref} className="inline-flex items-center gap-1.5 px-3 py-1.5 hover:bg-accent hover:text-accent-foreground"><Presentation size={15} /> {t("presentMode")}</Link>
          </span>
        </div>
      </header>

      {body}

      <section className="mt-16 rounded-lg border border-border bg-card p-6 text-sm text-card-foreground">
        <h2 className="font-semibold">{t("methodologyTitle")}</h2>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-muted-foreground">
          {(locale === "pt" ? survey.meta.notes.pt : survey.meta.notes.en).map((n) => <li key={n}>{n}</li>)}
        </ul>
        <h3 className="mt-5 font-semibold">{t("citationTitle")}</h3>
        <p className="mt-2 font-mono text-xs text-muted-foreground">{survey.meta.citation}</p>
      </section>

      <nav className="mt-10 grid gap-4 sm:grid-cols-2" aria-label={t("series")}>
        {previous ? (
          <Link href={{ pathname: "/artigos/[slug]", params: { slug: previous.slug } }} className="group rounded-lg border border-border p-5 hover:bg-accent">
            <span className="eyebrow inline-flex items-center gap-1"><ArrowLeft size={12} /> {t("previous")}</span>
            <span className="font-display mt-2 block text-lg leading-snug group-hover:text-accent-foreground">{previous.title}</span>
          </Link>
        ) : <span />}
        {next ? (
          <Link href={{ pathname: "/artigos/[slug]", params: { slug: next.slug } }} className="group rounded-lg border border-border p-5 text-right hover:bg-accent">
            <span className="eyebrow inline-flex items-center gap-1">{t("next")} <ArrowRight size={12} /></span>
            <span className="font-display mt-2 block text-lg leading-snug group-hover:text-accent-foreground">{next.title}</span>
          </Link>
        ) : null}
      </nav>
      <p className="mt-8"><Link href="/artigos" className="text-sm text-teal-deep underline underline-offset-4">{t("backToList")}</Link></p>
    </main>
  );
}
