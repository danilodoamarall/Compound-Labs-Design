import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, BookOpen, Bot, Radar, Sparkles } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { listArticles } from "@/lib/articles";
import { survey } from "@/lib/data";
import { HomeHero } from "@/components/site/home-hero";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale: l } = await params;
  const locale = l as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("Home");
  const ts = await getTranslations("Site");
  const ta = await getTranslations("Articles");
  const articles = listArticles(locale);
  const prefix = `/${locale}`;
  const paths = locale === "pt"
    ? { articles: `${prefix}/artigos`, radar: `${prefix}/radar` }
    : { articles: `${prefix}/articles`, radar: `${prefix}/radar` };

  const numbers = [
    { key: "vibe50", value: survey.vibe50.pct, unit: "%", label: t("numbers.vibe50"), decimals: 1 },
    { key: "built", value: survey.headline.built_tool_with_ai, unit: "%", label: t("numbers.built"), decimals: 1 },
    { key: "claude", value: survey.tools.find((x) => x.key === "claude")!.pct, unit: "%", label: t("numbers.claude"), decimals: 1 },
    { key: "fullTrust", value: survey.trust.find((x) => x.key === "full-trust")!.pct, unit: "%", label: t("numbers.fullTrust"), decimals: 1 },
  ];

  const sections = [
    { key: "articles", href: "/artigos" as const, Icon: BookOpen },
    { key: "radar", href: "/radar" as const, Icon: Radar },
    { key: "aiTools", href: "/ai-tools" as const, Icon: Sparkles },
    { key: "skillsAgents", href: "/skills-agents" as const, Icon: Bot },
  ] as const;

  return (
    <main>
      <HomeHero
        eyebrow={t("eyebrow")} title={t("title")} dek={t("dek")}
        ctaArticles={t("ctaArticles")} ctaRadar={t("ctaRadar")} hrefArticles={paths.articles} hrefRadar={paths.radar}
        numbers={numbers} numbersSource={t("numbersSource")}
        author={ts("author")} authorRole={ts("authorRole")} madeBy={ts("madeBy")} locale={locale}
      />

      <section className="mx-auto w-full max-w-6xl px-5 py-20">
        <p className="eyebrow">{t("sectionsTitle")}</p>
        <ul className="mt-6 grid gap-5 md:grid-cols-2">
          {sections.map(({ key, href, Icon }) => (
            <li key={key}>
              <Link href={href} className="group flex h-full flex-col rounded-lg border border-border bg-card p-6 transition-colors hover:border-teal/60 hover:bg-accent">
                <Icon className="text-teal" size={22} />
                <h2 className="font-display mt-4 text-2xl font-medium leading-tight">{t(`sections.${key}.title`)}</h2>
                <p className="mt-2 text-muted-foreground">{t(`sections.${key}.desc`)}</p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm text-teal-deep group-hover:gap-2 transition-all">{ta("read")} <ArrowRight size={14} /></span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {articles.length ? (
        <section className="border-t border-border bg-card/40">
          <div className="mx-auto w-full max-w-6xl px-5 py-20">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="eyebrow">{t("latestTitle")}</p>
                <h2 className="font-display mt-3 text-3xl font-semibold sm:text-4xl">{t("seriesName")}</h2>
              </div>
              <Link href="/artigos" className="inline-flex items-center gap-1 text-sm text-teal-deep hover:underline">{ta("backToList")} <ArrowRight size={14} /></Link>
            </div>
            <ol className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              {articles.map((a) => (
                <li key={a.slug} className="min-w-0">
                  <Link href={{ pathname: "/artigos/[slug]", params: { slug: a.slug } }} className="flex h-full flex-col rounded-lg border border-border bg-card p-5 hover:bg-accent">
                    <span className="font-display text-3xl text-muted-foreground tabular">{String(a.order).padStart(2, "0")}</span>
                    <span className="font-display mt-3 text-lg font-medium leading-snug">{a.title}</span>
                    <span className="mt-auto pt-4 font-mono text-[11px] text-muted-foreground">{ta("slides", { count: a.slideCount })}</span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </section>
      ) : null}

      <section className="mx-auto w-full max-w-6xl px-5 py-20">
        <div className="grid gap-8 md:grid-cols-[1fr_2fr]">
          <div>
            <p className="eyebrow">{t("authorTitle")}</p>
            <p className="font-display mt-3 text-3xl font-semibold leading-tight">{ts("author")}</p>
            <p className="mt-1 text-muted-foreground">{ts("authorRole")}</p>
          </div>
          <p className="font-display max-w-2xl text-xl leading-snug text-muted-foreground sm:text-2xl">{t("authorBio")}</p>
        </div>
      </section>
    </main>
  );
}
