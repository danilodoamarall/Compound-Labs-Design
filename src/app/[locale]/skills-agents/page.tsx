import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Terminal, Plug } from "lucide-react";
import type { Locale } from "@/i18n/routing";
import { formatStars, rankedSkills, registry } from "@/lib/skills";
import { SkillsLeaderboard, type LinhaSkill } from "@/components/site/skills-leaderboard";

export async function generateMetadata({ params }: PageProps<"/[locale]/skills-agents">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Skills" });
  return { title: t("title"), description: t("dek") };
}

/** O catálogo de skills, na composição do skills.sh: placar ordenado, com o
 *  autor de cada skill ao lado do nome e a licença como coluna fixa.
 *
 *  Duas diferenças de propósito em relação a eles:
 *
 *  1. A licença é coluna do placar, não detalhe escondido. O skills.sh não
 *     mostra licença em lugar nenhum, então dá para instalar uma skill sem
 *     saber se pode reusá-la.
 *  2. A ordenação é por estrelas do repositório de origem, e a página diz isso
 *     em texto. Eles ordenam por instalações; nós não temos esse dado e não
 *     vamos fabricar um. */
export default async function SkillsPage({ params, searchParams }: PageProps<"/[locale]/skills-agents">) {
  const { locale: l } = await params;
  const locale = l as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("Skills");

  // `?q=autor` vem do /explorar: cada repositório do catálogo abre o placar já
  // filtrado por quem o escreveu.
  const sp = await searchParams;
  const q = typeof sp?.q === "string" ? sp.q.slice(0, 80) : "";

  // O ranking é calculado no servidor: o cliente recebe linhas prontas, não o
  // registro inteiro com o corpo de cada skill.
  const linhas: LinhaSkill[] = rankedSkills().map((s) => ({
    rank: s.rank,
    pathSlug: s.pathSlug,
    name: s.name,
    description: s.description,
    topics: s.topics,
    author: s.source.author,
    repo: s.source.repo,
    license: s.source.license,
    hosted: s.hosted,
    stars: s.signals.stars,
    starsLabel: formatStars(s.signals.stars),
    href: s.hosted
      ? `/${locale}/skills-agents/${encodeURIComponent(s.pathSlug.replace("/", "__"))}`
      : s.readAt ?? s.source.url,
    externo: !s.hosted,
  }));

  const portas = [
    { chave: "cli", rotulo: "CLI", Icone: Terminal, texto: t("cliCard") },
    { chave: "mcp", rotulo: "MCP", Icone: Plug, texto: t("mcpCard") },
  ];

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
        {portas.map(({ chave, rotulo, Icone, texto }) => (
          <a
            key={chave}
            href={`/${locale}/skills-agents/${chave}`}
            className="rounded-xl border border-border p-5 outline-none transition-colors hover:border-teal/40 focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="flex items-center gap-2">
              <Icone size={16} aria-hidden className="text-muted-foreground" />
              <span className="font-medium">{rotulo}</span>
            </span>
            <span className="mt-2 block text-[14px] text-muted-foreground">{texto}</span>
          </a>
        ))}
      </div>

      <h2 className="eyebrow mt-14">{t("catalog")}</h2>

      {/* O critério do placar, escrito. Um número na tela sem a regra que o
          produziu é decoração, não governança. */}
      <details className="mt-3 text-sm">
        <summary className="cursor-pointer text-muted-foreground transition-colors hover:text-foreground">
          {t("criterio")}
        </summary>
        <p className="measure mt-2 leading-relaxed text-muted-foreground">{t("criterioBody")}</p>
      </details>

      <div className="mt-5">
        <SkillsLeaderboard
          linhas={linhas}
          topics={registry.topics}
          initialQuery={q}
          rotulos={{
            searchPlaceholder: t("searchPlaceholder"),
            all: t("all"),
            empty: t("empty"),
            colSkill: t("colSkill"),
            colStars: t("colStars"),
            colLicense: t("colLicense"),
            colTopics: t("colTopics"),
            maisDe: t("maisDe"),
            pointerHint: t("pointerHint"),
            resultados: t("resultados"),
          }}
        />
      </div>
    </main>
  );
}
