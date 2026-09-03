import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { skills, label } from "@/lib/data";
import { Catalog } from "@/components/catalog/Catalog";

export async function generateMetadata({ params }: PageProps<"/[locale]/skills-agents">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Skills" });
  return { title: t("title"), description: t("dek") };
}

export default async function SkillsPage({ params }: PageProps<"/[locale]/skills-agents">) {
  const { locale: l } = await params;
  const locale = l as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("Skills");
  const ts = await getTranslations("Site");

  const groupLabels = Object.fromEntries(skills.types.map((k) => [k, t(`types.${k}` as "types.skill")]));

  const items = skills.items.map((i) => ({
    key: i.key, name: i.name, group: i.type, draft: i.draft,
    badge: i.tags.join(" · "),
    body: (
      <div className="space-y-3">
        <p>{label(i.summary, locale)}</p>
        <p><span className="font-medium text-foreground">{t("whenToUse")}:</span> {label(i.whenToUse, locale)}</p>
        <p><span className="font-medium text-foreground">{t("install")}:</span> {label(i.install, locale)}</p>
      </div>
    ),
    footer: (
      <details>
        <summary className="cursor-pointer font-mono text-xs text-muted-foreground">{t("source")}</summary>
        <pre className="mt-2 max-h-72 overflow-auto rounded-md bg-secondary p-3 font-mono text-[12px] leading-relaxed text-secondary-foreground"><code>{i.code}</code></pre>
      </details>
    ),
  }));

  return (
    <main className="mx-auto w-full max-w-6xl px-5 pb-16 pt-14">
      <p className="eyebrow">{t("title")}</p>
      <h1 className="font-display mt-3 text-4xl font-semibold sm:text-5xl">{t("title")}</h1>
      <p className="measure mt-5 text-lg text-muted-foreground">{t("dek")}</p>
      <p className="mt-2 text-sm text-muted-foreground">{ts("draftHint")}</p>
      <div className="mt-10">
        <Catalog items={items} groups={skills.types} groupLabels={groupLabels} allLabel={t("all")} filterLabel={t("filterType")} draftLabel={ts("draft")} />
      </div>
    </main>
  );
}
