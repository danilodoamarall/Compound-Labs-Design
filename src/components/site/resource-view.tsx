import { ArrowUpRight, ArrowLeft, ArrowRight } from "lucide-react";
import type { IndexedResource } from "@/lib/resources";

export type ResourceLabels = {
  draft: string;
  visit: string;
  whenToUse: string;
  install: string;
  code: string;
  appearsIn: string;
  source: string;
  updated: string;
  previous: string;
  next: string;
  openCatalog: string;
  /** Rótulos dos fatos, já traduzidos: etapa, preço, tipo, adoção, estrelas. */
  facts: Record<string, string>;
  /** Valores enumerados traduzidos: free/freemium/paid, design/prototype… */
  values: Record<string, string>;
};

export type Sibling = { key: string; name: string; href: string } | null;

/** O gabarito único de recurso.
 *
 *  A estrutura é a mesma do artigo, que já existia e funciona: chapéu com
 *  contexto e status, título, resumo, uma linha de metadados que termina numa
 *  ação, o corpo, a procedência, e navegação entre irmãos.
 *
 *  Todo slot é condicional. As fontes de conteúdo têm campos diferentes, e um
 *  gabarito que renderizasse tudo mostraria rótulos vazios na metade das
 *  páginas. Aqui só aparece o que o item de fato tem.
 *
 *  As seções sem página (o acervo) aparecem pelo nome, sem link: `sectionHrefs`
 *  só traz as navegáveis, e o rótulo vira texto quando não há destino. */
export function ResourceView({
  item,
  locale,
  sectionLabels,
  sectionHrefs,
  labels,
  updated,
  catalogHref,
  previous,
  next,
}: {
  item: IndexedResource;
  locale: "pt" | "en";
  sectionLabels: Record<string, string>;
  sectionHrefs: Record<string, string>;
  labels: ResourceLabels;
  updated: string;
  /** O placar de skills, para os itens que são um repositório do catálogo. */
  catalogHref: string;
  previous: Sibling;
  next: Sibling;
}) {
  const name = locale === "pt" ? item.name : item.nameEn;
  const home = item.sections[0];
  const f = item.facts;
  const numero = (n: number) => n.toLocaleString(locale === "pt" ? "pt-BR" : "en-US");

  // Cada fato vira uma linha só se existir. A ordem é a mesma em toda página,
  // para que o leitor aprenda onde olhar depois do primeiro recurso.
  const meta: { label: string; value: string }[] = [];
  if (f.stage) meta.push({ label: labels.facts.stage, value: labels.values[f.stage] ?? f.stage });
  if (f.type) meta.push({ label: labels.facts.type, value: labels.values[f.type] ?? f.type });
  if (f.pricing) meta.push({ label: labels.facts.pricing, value: labels.values[f.pricing] ?? f.pricing });
  if (f.category) meta.push({ label: labels.facts.category, value: f.category });
  if (f.license) meta.push({ label: labels.facts.license, value: f.license });
  if (typeof f.skillCount === "number") meta.push({ label: labels.facts.skillCount, value: numero(f.skillCount) });
  if (typeof f.stars === "number") meta.push({ label: labels.facts.stars, value: numero(f.stars) });
  if (typeof f.surveyPct === "number") {
    meta.push({
      label: labels.facts.surveyPct,
      value: `${f.surveyPct.toLocaleString(locale === "pt" ? "pt-BR" : "en-US", { minimumFractionDigits: 1 })}%`,
    });
  }

  const whenToUse = f.whenToUse?.[locale];
  const install = f.install?.[locale];
  // As notas de outras seções: o mesmo item visto de outro ângulo.
  const otherNotes = item.sections
    .filter((s) => s !== home && item.notes[s]?.[locale])
    .map((s) => ({ section: s, text: item.notes[s][locale] }));

  const rotulo = (section: string, className?: string) => (
    <SectionLabel section={section} className={className} hrefs={sectionHrefs} labels={sectionLabels} />
  );

  return (
    <article className="mx-auto w-full max-w-3xl px-5 pb-20 pt-12">
      <header className="border-b border-border pb-8">
        <p className="eyebrow flex flex-wrap items-center gap-x-2 gap-y-1">
          {rotulo(home)}
          <span aria-hidden className="text-muted-foreground/40">·</span>
          <span>{labels.values[item.kind] ?? item.kind}</span>
          {f.draft ? <DraftBadge label={labels.draft} /> : null}
        </p>

        <h1 className="font-display mt-4 text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
          {name}
        </h1>

        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          {item.desc[locale]}
        </p>

        {meta.length || f.url || f.catalogQuery ? (
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
            {meta.map((m) => (
              <span key={m.label} className="text-muted-foreground">
                {m.label} <span className="text-foreground tabular-nums">{m.value}</span>
              </span>
            ))}
            <span className="ml-auto flex items-center gap-2">
              {/* Um repositório do catálogo leva ao placar já filtrado pelo
                  autor: é lá que as skills dele estão, uma a uma. */}
              {f.catalogQuery ? (
                <a
                  href={`${catalogHref}?q=${encodeURIComponent(f.catalogQuery)}`}
                  className="inline-flex items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-background transition-opacity hover:opacity-90"
                >
                  {labels.openCatalog}
                  <ArrowRight size={14} aria-hidden />
                </a>
              ) : null}
              {f.url ? (
                <a
                  href={f.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 transition-colors hover:border-teal/50 hover:text-foreground"
                >
                  {labels.visit}
                  <ArrowUpRight size={14} aria-hidden />
                </a>
              ) : null}
            </span>
          </div>
        ) : null}
      </header>

      {whenToUse ? (
        <Section title={labels.whenToUse}>
          <p className="text-[17px] leading-relaxed text-muted-foreground">{whenToUse}</p>
        </Section>
      ) : null}

      {otherNotes.length ? (
        <Section title={labels.appearsIn}>
          <ul className="space-y-4">
            {otherNotes.map((n) => (
              <li key={n.section}>
                {rotulo(n.section, "eyebrow")}
                <p className="mt-1.5 text-[17px] leading-relaxed text-muted-foreground">{n.text}</p>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {install ? (
        <Section title={labels.install}>
          <p className="text-[17px] leading-relaxed text-muted-foreground">{install}</p>
        </Section>
      ) : null}

      {f.code ? (
        <Section title={labels.code}>
          <pre className="overflow-x-auto rounded-lg border border-border bg-card p-4 font-mono text-[12.5px] leading-relaxed">
            <code>{f.code}</code>
          </pre>
        </Section>
      ) : null}

      <p className="mt-14 border-t border-border pt-6 text-sm text-muted-foreground">
        {labels.source} <span className="text-foreground">{sectionLabels[home]}</span>
        <span aria-hidden className="mx-2 text-muted-foreground/40">·</span>
        {labels.updated} <span className="tabular-nums">{item.date ?? updated}</span>
      </p>

      {previous || next ? (
        <nav aria-label={labels.appearsIn} className="mt-10 grid gap-4 sm:grid-cols-2">
          {previous ? (
            <a href={previous.href} className="group rounded-lg border border-border p-4 transition-colors hover:border-teal/50">
              <span className="eyebrow flex items-center gap-1.5">
                <ArrowLeft size={12} aria-hidden />
                {labels.previous}
              </span>
              <span className="mt-1.5 block font-medium">{previous.name}</span>
            </a>
          ) : <span />}
          {next ? (
            <a href={next.href} className="group rounded-lg border border-border p-4 text-right transition-colors hover:border-teal/50 sm:col-start-2">
              <span className="eyebrow flex items-center justify-end gap-1.5">
                {labels.next}
                <ArrowRight size={12} aria-hidden />
              </span>
              <span className="mt-1.5 block font-medium">{next.name}</span>
            </a>
          ) : null}
        </nav>
      ) : null}
    </article>
  );
}

/** O nome de uma seção: link quando ela tem página, texto quando é acervo.
 *  Fora do componente principal para não ser recriado a cada render. */
function SectionLabel({
  section,
  className,
  hrefs,
  labels,
}: {
  section: string;
  className?: string;
  hrefs: Record<string, string>;
  labels: Record<string, string>;
}) {
  return hrefs[section] ? (
    <a href={hrefs[section]} className={`${className ?? ""} hover:text-foreground`}>{labels[section]}</a>
  ) : (
    <span className={className}>{labels[section]}</span>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-12">
      <h2 className="eyebrow">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

/** O selo de rascunho existia escrito à mão em quatro lugares, em três
 *  tamanhos. Agora é um só. */
export function DraftBadge({ label }: { label: string }) {
  return (
    <span className="rounded bg-warm/15 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-warm-text">
      {label}
    </span>
  );
}
