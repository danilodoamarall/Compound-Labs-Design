import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ExternalLink } from "lucide-react";
import type { Locale } from "@/i18n/routing";
import { aiTools, label } from "@/lib/data";
import { fmtPct } from "@/lib/format";
import { Catalog } from "@/components/catalog/Catalog";

const CATEGORY_LABELS = {
  pt: { assistant: "Assistente", coding: "Código", prototyping: "Prototipagem", research: "Pesquisa", media: "Imagem, voz e vídeo" },
  en: { assistant: "Assistant", coding: "Coding", prototyping: "Prototyping", research: "Research", media: "Image, voice & video" },
};
const PRICING = {
  pt: { free: "Grátis", freemium: "Freemium", paid: "Pago" },
  en: { free: "Free", freemium: "Freemium", paid: "Paid" },
};

export async function generateMetadata({ params }: PageProps<"/[locale]/ai-tools">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "AiTools" });
  return { title: t("title"), description: t("dek") };
}

export default async function AiToolsPage({ params }: PageProps<"/[locale]/ai-tools">) {
  const { locale: l } = await params;
  const locale = l as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("AiTools");
  const ts = await getTranslations("Site");
  const weekly = locale === "pt" ? "uso semanal na pesquisa" : "weekly use in the survey";

  const items = aiTools.items.map((i) => ({
    key: i.key, name: i.name, group: i.category, draft: i.draft,
    badge: `${t("pricing")}: ${PRICING[locale][i.pricing as keyof typeof PRICING.pt]}${i.surveyPct != null ? ` · ${fmtPct(i.surveyPct, locale)} ${weekly}` : ""}`,
    body: <p><span className="font-medium text-foreground">{t("usedFor")}:</span> {label(i.usedFor, locale)}</p>,
    footer: <a href={i.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-teal-deep hover:underline">{t("visit")} <ExternalLink size={14} /></a>,
  }));

  return (
    <main className="mx-auto w-full max-w-6xl px-5 pb-16 pt-14">
      <p className="eyebrow">{t("title")}</p>
      <h1 className="font-display mt-3 text-4xl font-semibold sm:text-5xl">{t("title")}</h1>
      <p className="measure mt-5 text-lg text-muted-foreground">{t("dek")}</p>
      <p className="mt-2 text-sm text-muted-foreground">{ts("draftHint")}</p>
      <div className="mt-10">
        <Catalog items={items} groups={aiTools.categories} groupLabels={CATEGORY_LABELS[locale]} allLabel={t("all")} filterLabel={t("filterCategory")} draftLabel={ts("draft")} />
      </div>
    </main>
  );
}
