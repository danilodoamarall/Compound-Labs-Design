import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { radar, label } from "@/lib/data";
import { fmtDate } from "@/lib/format";
import { RadarView } from "@/components/radar/RadarView";
import RadarBackdrop from "@/components/reactbits/Radar";

export async function generateMetadata({ params }: PageProps<"/[locale]/radar">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Radar" });
  return { title: t("title"), description: t("dek") };
}

export default async function RadarPage({ params }: PageProps<"/[locale]/radar">) {
  const { locale: l } = await params;
  const locale = l as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("Radar");
  const ts = await getTranslations("Site");

  const items = radar.items.map((i) => ({
    key: i.key, name: i.name, quadrant: i.quadrant, ring: i.ring, surveyPct: i.surveyPct, url: i.url, draft: i.draft,
    note: label(i.note, locale),
  }));

  const labels = {
    rings: Object.fromEntries(radar.rings.map((r) => [r, t(`rings.${r}` as "rings.adopt")])),
    ringHints: Object.fromEntries(radar.rings.map((r) => [r, t(`ringHints.${r}` as "ringHints.adopt")])),
    quadrants: Object.fromEntries(radar.quadrants.map((q) => [q, t(`quadrants.${q}` as "quadrants.canvas")])),
    weeklyUse: t("weeklyUse"), all: t("all"), filterQuadrant: t("filterQuadrant"), notInSurvey: t("notInSurvey"), draft: ts("draft"),
  };

  return (
    <main className="relative isolate mx-auto w-full max-w-6xl px-5 pb-16 pt-14">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 -top-14 -z-10 h-[420px] opacity-[0.22] dark:opacity-[0.3]">
        <RadarBackdrop color="#22a18c" backgroundColor="transparent" speed={0.35} scale={1.15} sweepSpeed={0.5} />
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-x-0 -top-14 -z-10 h-[420px] bg-[linear-gradient(to_bottom,transparent_10%,var(--background)_82%)]" />
      <p className="eyebrow">{t("title")} · {fmtDate(radar.updated, locale)}</p>
      <h1 className="font-display mt-3 text-4xl font-semibold sm:text-5xl">{t("title")}</h1>
      <p className="measure mt-5 text-lg text-muted-foreground">{t("dek")}</p>
      <p className="mt-3 max-w-3xl text-sm text-muted-foreground">{label(radar.sourceNote, locale)}</p>
      <div className="mt-10">
        <RadarView items={items} labels={labels} locale={locale} />
      </div>
    </main>
  );
}
