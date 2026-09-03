import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { sections, sectionPath, coverOrder, coverInitialIndex } from "@/lib/site";
import { HomeCoverFlow, type HomeSection } from "@/components/site/home-coverflow";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale: l } = await params;
  const locale = l as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("Home");
  const ts = await getTranslations("Site");
  const tn = await getTranslations("Nav");

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

  return (
    <main className="flex flex-1 flex-col items-center px-5 pt-16 pb-24 sm:pt-24">
      <p className="inline-flex max-w-full items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-center text-[13px] leading-snug text-muted-foreground">
        <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-teal" />
        <span className="text-balance">
          <span className="text-foreground">{ts("author")}</span>
          <span className="mx-1.5 text-muted-foreground/50">·</span>
          {ts("authorRole")}
        </span>
      </p>

      <h1 className="font-display mt-9 max-w-4xl text-center text-[2.75rem] font-semibold leading-[1.02] tracking-tight sm:text-6xl md:text-7xl">
        {t("title")}
      </h1>

      <p className="mt-7 max-w-xl text-center text-lg leading-relaxed text-muted-foreground sm:text-xl">
        {t("dek")}
      </p>

      <div className="mt-16 w-full sm:mt-20">
        <HomeCoverFlow sections={covers} initialIndex={coverInitialIndex} label={ts("name")} hint={t("coverHint")} />
      </div>
    </main>
  );
}
