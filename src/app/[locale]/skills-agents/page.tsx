import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Terminal, Plug } from "lucide-react";
import type { Locale } from "@/i18n/routing";
import { registry } from "@/lib/skills";
import { SkillsCatalog } from "@/components/site/skills-catalog";

export async function generateMetadata({ params }: PageProps<"/[locale]/skills-agents">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Skills" });
  return { title: t("title"), description: t("dek") };
}

/** O catálogo de skills, na composição do ui-skills: descrição, o bloco de
 *  entrada para agente com CLI e MCP, e a grade de skills com crédito. */
export default async function SkillsPage({ params }: PageProps<"/[locale]/skills-agents">) {
  const { locale: l } = await params;
  const locale = l as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("Skills");

  return (
    <main className="mx-auto w-full max-w-5xl px-5 pb-20 pt-14">
      <p className="eyebrow">{t("title")}</p>
      <h1 className="font-display mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">{t("title")}</h1>
      <p className="measure mt-5 text-lg text-muted-foreground">{t("dek")}</p>

      <p className="mt-3 text-sm text-muted-foreground">
        {t("provenance", { hosted: registry.counts.hosted, pointer: registry.counts.pointer })}
      </p>

      <h2 className="eyebrow mt-12">{t("agentStart")}</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <a
          href={`/${locale}/skills-agents/cli`}
          className="group rounded-xl border border-border p-5 transition-colors hover:border-teal/40"
        >
          <span className="flex items-center gap-2">
            <Terminal size={16} aria-hidden className="text-muted-foreground" />
            <span className="font-medium">CLI</span>
          </span>
          <span className="mt-2 block text-[14px] text-muted-foreground">{t("cliCard")}</span>
        </a>
        <a
          href={`/${locale}/skills-agents/mcp`}
          className="group rounded-xl border border-border p-5 transition-colors hover:border-teal/40"
        >
          <span className="flex items-center gap-2">
            <Plug size={16} aria-hidden className="text-muted-foreground" />
            <span className="font-medium">MCP</span>
          </span>
          <span className="mt-2 block text-[14px] text-muted-foreground">{t("mcpCard")}</span>
        </a>
      </div>

      <h2 className="eyebrow mt-14">{t("catalog")}</h2>
      <div className="mt-4">
        <SkillsCatalog
          skills={registry.skills}
          topics={registry.topics}
          locale={locale}
          labels={{
            searchPlaceholder: t("searchPlaceholder"),
            all: t("all"),
            count: t("count"),
            of: t("of"),
            empty: t("empty"),
            hostedHint: t("hostedHint"),
            pointerHint: t("pointerHint"),
            readAtSource: t("readAtSource"),
          }}
        />
      </div>
    </main>
  );
}
