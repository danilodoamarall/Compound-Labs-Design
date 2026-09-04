import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { registry } from "@/lib/skills";

export async function generateMetadata({ params }: PageProps<"/[locale]/skills-agents/mcp">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "SkillsMcp" });
  return { title: t("title"), description: t("dek") };
}

const CONFIG = `{
  "mcpServers": {
    "ai-builders-lab": {
      "type": "http",
      "url": "https://labs-hub-five.vercel.app/mcp"
    }
  }
}`;

export default async function McpPage({ params }: PageProps<"/[locale]/skills-agents/mcp">) {
  const { locale: l } = await params;
  const locale = l as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("SkillsMcp");
  const ts = await getTranslations("Skills");

  return (
    <main className="mx-auto w-full max-w-3xl px-5 pb-20 pt-12">
      <p className="eyebrow">
        <a href={`/${locale}/skills-agents`} className="hover:text-foreground">{ts("title")}</a>
        <span aria-hidden className="mx-2 text-muted-foreground/40">/</span>
        MCP
      </p>
      <h1 className="font-display mt-4 text-4xl font-semibold tracking-tight">MCP</h1>
      <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{t("dek")}</p>

      <h2 className="eyebrow mt-12">{t("endpoint")}</h2>
      <pre className="mt-3 overflow-x-auto rounded-lg border border-border bg-card p-4 font-mono text-[13px]"><code>https://labs-hub-five.vercel.app/mcp</code></pre>

      <h2 className="eyebrow mt-8">{t("serverCard")}</h2>
      <pre className="mt-3 overflow-x-auto rounded-lg border border-border bg-card p-4 font-mono text-[13px]"><code>https://labs-hub-five.vercel.app/.well-known/mcp/server-card.json</code></pre>

      {/* O ui-skills não documenta a configuração em lugar nenhum: quem integra
          precisa adivinhar. Aqui ela está escrita. */}
      <h2 className="eyebrow mt-12">{t("howToConnect")}</h2>
      <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{t("connectBody")}</p>
      <pre className="mt-3 overflow-x-auto rounded-lg border border-border bg-card p-4 font-mono text-[12.5px]"><code>{CONFIG}</code></pre>

      <h2 className="eyebrow mt-12">{t("tools")}</h2>
      <div className="mt-4 space-y-6">
        <div>
          <h3 className="font-mono font-medium">list_skills</h3>
          <p className="mt-1 text-[14px] text-muted-foreground">{t("listSkills")}</p>
        </div>
        <div>
          <h3 className="font-mono font-medium">get_skill</h3>
          <p className="mt-1 text-[14px] text-muted-foreground">{t("getSkill")}</p>
        </div>
      </div>

      <h2 className="eyebrow mt-12">{t("provenance")}</h2>
      <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
        {t("provenanceBody", { hosted: registry.counts.hosted, pointer: registry.counts.pointer })}
      </p>
    </main>
  );
}
