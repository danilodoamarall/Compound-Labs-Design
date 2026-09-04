import { CLI_PACKAGE } from "@/lib/site-url";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { registry } from "@/lib/skills";

export async function generateMetadata({ params }: PageProps<"/[locale]/skills-agents/cli">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "SkillsCli" });
  return { title: t("title"), description: t("dek") };
}

const COMANDOS = [
  { key: "start", cmd: `npx ${CLI_PACKAGE} start` },
  { key: "topics", cmd: `npx ${CLI_PACKAGE} topics` },
  { key: "list", cmd: `npx ${CLI_PACKAGE} list --limit 40` },
  { key: "filter", cmd: `npx ${CLI_PACKAGE} list --topic motion` },
  { key: "search", cmd: `npx ${CLI_PACKAGE} list --query shadow` },
  { key: "get", cmd: `npx ${CLI_PACKAGE} get emilkowalski/animate` },
  { key: "licenses", cmd: `npx ${CLI_PACKAGE} licenses` },
  { key: "version", cmd: `npx ${CLI_PACKAGE} --version` },
] as const;

export default async function CliPage({ params }: PageProps<"/[locale]/skills-agents/cli">) {
  const { locale: l } = await params;
  const locale = l as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("SkillsCli");
  const ts = await getTranslations("Skills");

  return (
    <main className="mx-auto w-full max-w-3xl px-6 pb-20 pt-12">
      <p className="eyebrow">
        <a href={`/${locale}/skills-agents`} className="hover:text-foreground">{ts("title")}</a>
        <span aria-hidden className="mx-2 text-muted-foreground/40">/</span>
        CLI
      </p>
      <h1 className="font-display mt-4 text-4xl font-semibold tracking-tight">CLI</h1>
      <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{t("dek")}</p>

      <h2 className="eyebrow mt-12">{t("install")}</h2>
      <pre className="mt-3 overflow-x-auto rounded-lg border border-border bg-card p-4 font-mono text-[13px]"><code>{`npx ${CLI_PACKAGE}`}</code></pre>
      <p className="mt-3 text-sm text-muted-foreground">{t("noDeps")}</p>

      <h2 className="eyebrow mt-12">{t("commands")}</h2>
      <div className="mt-4 space-y-6">
        {COMANDOS.map((c) => (
          <div key={c.key}>
            <h3 className="font-medium">{t(`cmd.${c.key}.title` as "cmd.start.title")}</h3>
            <p className="mt-1 text-[14px] text-muted-foreground">
              {t(`cmd.${c.key}.desc` as "cmd.start.desc")}
            </p>
            <pre className="mt-2 overflow-x-auto rounded-lg border border-border bg-card p-3 font-mono text-[12.5px]"><code>{c.cmd}</code></pre>
          </div>
        ))}
      </div>

      <h2 className="eyebrow mt-12">{t("attribution")}</h2>
      <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
        {/* t.rich e não t: a mensagem traz <code>get</code>, e o t simples
            imprimia a tag crua no parágrafo. */}
        {t.rich("attributionBody", {
          hosted: registry.counts.hosted,
          pointer: registry.counts.pointer,
          code: (c) => <code className="rounded bg-muted px-1 py-0.5 font-mono text-[13px]">{c}</code>,
        })}
      </p>
    </main>
  );
}
