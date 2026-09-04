import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowUpRight } from "lucide-react";
import { routing, type Locale } from "@/i18n/routing";
import { attribution, findSkill, formatStars, rankedSkills, readSkillBody, registry, repoSinais } from "@/lib/skills";
import { CLI_PACKAGE } from "@/lib/site-url";
import { CopyCommand } from "@/components/site/copy-command";
import { SkillMarkdown } from "@/components/site/skill-markdown";

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

/** Uma linha do painel lateral. Só aparece quando há dado: um rótulo sobre um
 *  traço é ruído, e sete deles fazem a página parecer vazia. */
function Campo({ rotulo, children }: { rotulo: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">{rotulo}</dt>
      <dd className="mt-1 text-[13.5px]">{children}</dd>
    </div>
  );
}

/** A página de uma skill, na composição do skills.sh: conteúdo à esquerda,
 *  trilho de procedência à direita.
 *
 *  O painel deles traz instalações, estrelas e auditorias de segurança. Nós não
 *  temos instalação nem auditoria de terceiro, e não vamos simular nenhuma das
 *  duas. Trazemos o que eles não trazem em nenhuma das 269 entradas: a licença
 *  verificada repositório a repositório, e o commit em que a cópia foi feita. */
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

  // O cabeçalho de procedência sai da leitura: ele já está no painel lateral.
  const markdown = corpo.replace(/^(---\r?\n[\s\S]*?\r?\n---\r?\n)?\s*<!--[\s\S]*?-->\s*/, "").trimStart();

  const sinais = repoSinais(skill);
  const comando = `npx ${CLI_PACKAGE} get ${skill.pathSlug}`;

  // Relacionadas: as mais bem colocadas que dividem um tópico com esta.
  const relacionadas = rankedSkills(HOSPEDADAS)
    .filter((s) => s.pathSlug !== skill.pathSlug && s.topics.some((x) => skill.topics.includes(x)))
    .slice(0, 5);

  return (
    <main className="mx-auto w-full max-w-5xl px-5 pb-20 pt-12">
      <p className="eyebrow">
        <a href={`/${locale}/skills-agents`} className="hover:text-foreground">{t("title")}</a>
        <span aria-hidden className="mx-2 text-muted-foreground/40">/</span>
        <span className="normal-case">{skill.source.author}</span>
        <span aria-hidden className="mx-2 text-muted-foreground/40">/</span>
        <span className="normal-case text-foreground">{skill.name}</span>
      </p>

      <h1 className="font-display mt-4 text-4xl font-semibold tracking-tight">{skill.name}</h1>
      <p className="measure mt-4 text-lg leading-relaxed text-muted-foreground">{skill.description}</p>

      <div className="mt-10 flex flex-col gap-10 lg:flex-row lg:gap-12">
        <div className="min-w-0 flex-1">
          <h2 className="eyebrow">{t("installation")}</h2>
          <div className="mt-3">
            <CopyCommand command={comando} copyLabel={t("copyCommand")} />
          </div>

          <h2 className="eyebrow mt-10">{t("content")}</h2>
          <div className="mt-4">
            <SkillMarkdown>{markdown}</SkillMarkdown>
          </div>

          {relacionadas.length > 0 ? (
            <>
              <h2 className="eyebrow mt-12">{t("related")}</h2>
              <ul className="mt-3 divide-y divide-border">
                {relacionadas.map((s) => (
                  <li key={s.pathSlug}>
                    <a
                      href={`/${locale}/skills-agents/${encodeURIComponent(paraParam(s.pathSlug))}`}
                      className="flex items-baseline gap-3 rounded-lg px-2 py-3 outline-hidden transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[14.5px] font-medium">{s.name}</span>
                        <span className="mt-0.5 block truncate font-mono text-[12px] text-muted-foreground">
                          {s.source.author}/{s.source.repo}
                        </span>
                      </span>
                      <span className="shrink-0 font-mono text-[12px] tabular-nums text-muted-foreground">
                        {formatStars(s.signals.stars)}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </div>

        {/* O trilho de procedência. É o que o skills.sh não tem: lá dá para
            instalar uma skill sem descobrir sob qual licença ela está. */}
        <aside className="w-full shrink-0 lg:w-56">
          <h2 className="eyebrow">{t("provenanceLabel")}</h2>
          <dl className="mt-3 space-y-4 border-t border-border pt-4">
            <Campo rotulo={t("license")}>
              <span className="font-mono">{skill.source.license}</span>
            </Campo>

            <Campo rotulo={t("repository")}>
              <a
                href={skill.source.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-baseline gap-1 font-mono text-[12.5px] break-all transition-colors hover:text-teal-deep"
              >
                {skill.source.author}/{skill.source.repo}
                <ArrowUpRight size={11} aria-hidden className="shrink-0 translate-y-0.5" />
              </a>
            </Campo>

            <Campo rotulo={t("stars")}>
              <span className="font-mono tabular-nums">
                {sinais.stars === null ? (
                  <span className="text-muted-foreground">{t("noStars")}</span>
                ) : (
                  sinais.stars.toLocaleString(locale === "pt" ? "pt-BR" : "en-US")
                )}
              </span>
              {sinais.archived ? (
                <span className="ml-2 font-mono text-[11px] uppercase text-muted-foreground">{t("archived")}</span>
              ) : null}
            </Campo>

            {sinais.pushedAt ? (
              <Campo rotulo={t("lastPush")}>
                <span className="font-mono text-[12.5px] tabular-nums">{sinais.pushedAt}</span>
              </Campo>
            ) : null}

            {skill.fetchedAt ? (
              <Campo rotulo={t("copiedAt")}>
                <span className="font-mono text-[12.5px] tabular-nums">{skill.fetchedAt}</span>
              </Campo>
            ) : null}

            {skill.commit ? (
              <Campo rotulo={t("commit")}>
                {skill.pinned ? (
                  <a
                    href={skill.pinned}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-[12.5px] transition-colors hover:text-teal-deep"
                  >
                    {skill.commit.slice(0, 10)}
                  </a>
                ) : (
                  <span className="font-mono text-[12.5px]">{skill.commit.slice(0, 10)}</span>
                )}
              </Campo>
            ) : null}

            <div className="border-t border-border pt-4">
              <p className="flex items-center gap-2 text-[13px] font-medium">
                <span aria-hidden className="size-1.5 rounded-full bg-teal" />
                {t("hostedHere")}
              </p>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted-foreground">{t("hostedWhy")}</p>
            </div>
          </dl>
        </aside>
      </div>

      <p className="mt-14 border-t border-border pt-6 text-sm text-muted-foreground">{attribution(skill, locale)}</p>
    </main>
  );
}
