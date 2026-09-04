import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowUpRight } from "lucide-react";
import { routing, type Locale } from "@/i18n/routing";
import { attribution, findSkill, readSkillBody, registry } from "@/lib/skills";

const HOSPEDADAS = registry.skills.filter((s) => s.hosted);
const paraParam = (pathSlug: string) => pathSlug.replace("/", "__");

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    HOSPEDADAS.map((s) => ({ locale, skill: paraParam(s.pathSlug) }))
  );
}

export async function generateMetadata({ params }: PageProps<"/[locale]/skills-agents/[skill]">): Promise<Metadata> {
  const { skill } = await params;
  const achado = findSkill(decodeURIComponent(skill).replace("__", "/"));
  if (!achado || "ambiguous" in achado) return {};
  return { title: achado.skill.name, description: achado.skill.description };
}

/** A página de uma skill. Mostra o markdown de quem escreveu, com a atribuição
 *  no topo, e não só embaixo: o leitor sabe de quem é antes de ler. */
export default async function SkillPage({ params }: PageProps<"/[locale]/skills-agents/[skill]">) {
  const { locale: l, skill: param } = await params;
  const locale = l as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("Skills");

  const achado = findSkill(decodeURIComponent(param).replace("__", "/"));
  if (!achado || "ambiguous" in achado) notFound();

  const { skill } = achado;
  const corpo = readSkillBody(skill);
  if (!corpo) notFound();

  // O cabeçalho de procedência sai da leitura: ele já está no card acima.
  const markdown = corpo.replace(/^<!--[\s\S]*?-->\n*/, "");

  return (
    <main className="mx-auto w-full max-w-3xl px-5 pb-20 pt-12">
      <p className="eyebrow">
        <a href={`/${locale}/skills-agents`} className="hover:text-foreground">{t("title")}</a>
        <span aria-hidden className="mx-2 text-muted-foreground/40">·</span>
        {skill.topics.join(", ")}
      </p>

      <h1 className="font-display mt-4 text-4xl font-semibold tracking-tight">{skill.name}</h1>
      <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{skill.description}</p>

      {/* A atribuição vem antes do conteúdo, não depois. É de quem escreveu. */}
      <div className="mt-8 rounded-lg border border-border bg-card p-4 text-sm">
        <p className="text-muted-foreground">
          {t("writtenBy")} <span className="font-medium text-foreground">{skill.source.author}</span>
          <span aria-hidden className="mx-2 text-muted-foreground/40">·</span>
          {t("license")} <span className="font-mono text-foreground">{skill.source.license}</span>
        </p>
        <a
          href={skill.source.url}
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
        >
          {skill.source.author}/{skill.source.repo}
          <ArrowUpRight size={13} aria-hidden />
        </a>
        {skill.commit ? (
          <p className="mt-2 font-mono text-[11.5px] text-muted-foreground">
            {t("copiedAt")} {skill.fetchedAt} · {skill.commit.slice(0, 10)}
          </p>
        ) : null}
      </div>

      <pre className="mt-8 overflow-x-auto whitespace-pre-wrap rounded-lg border border-border bg-card p-5 font-mono text-[12.5px] leading-relaxed">
        <code>{markdown}</code>
      </pre>

      <p className="mt-8 border-t border-border pt-6 text-sm text-muted-foreground">{attribution(skill)}</p>
    </main>
  );
}
