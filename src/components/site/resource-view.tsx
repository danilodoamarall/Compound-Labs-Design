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
  /** Rótulos dos fatos, já traduzidos: anel, etapa, preço, tipo, adoção. */
  facts: Record<string, string>;
  /** Valores enumerados traduzidos: adopt/trial/assess/hold, free/freemium/paid… */
  values: Record<string, string>;
};

export type Sibling = { key: string; name: string; href: string } | null;

/** O gabarito único de recurso.
 *
 *  A estrutura é a mesma do artigo, que já existia e funciona: chapéu com
 *  contexto e status, título, resumo, uma linha de metadados que termina numa
 *  ação, o corpo, a procedência, e navegação entre irmãos.
 *
 *  Todo slot é condicional. As quatro fontes de conteúdo têm campos diferentes,
 *  e um gabarito que renderizasse tudo mostraria rótulos vazios na metade das
 *  páginas. Aqui só aparece o que o item de fato tem. */
export function ResourceView({
  item,
  locale,
  sectionLabels,
  sectionHrefs,
  labels,
  updated,
  previous,
  next,
}: {
  item: IndexedResource;
  locale: "pt" | "en";
  sectionLabels: Record<string, string>;
  sectionHrefs: Record<string, string>;
  labels: ResourceLabels;
  updated: string;
  previous: Sibling;
  next: Sibling;
}) {
  const name = locale === "pt" ? item.name : item.nameEn;
  const home = item.sections[0];
  const f = item.facts;

  // Cada fato vira uma linha só se existir. A ordem é a mesma em toda página,
  // para que o leitor aprenda onde olhar depois do primeiro recurso.
  const meta: { label: string; value: string }[] = [];
  if (f.ring) meta.push({ label: labels.facts.ring, value: labels.values[f.ring] ?? f.ring });
  if (f.stage) meta.push({ label: labels.facts.stage, value: labels.values[f.stage] ?? f.stage });
  if (f.type) meta.push({ label: labels.facts.type, value: labels.values[f.type] ?? f.type });
  if (f.pricing) meta.push({ label: labels.facts.pricing, value: labels.values[f.pricing] ?? f.pricing });
  if (f.category) meta.push({ label: labels.facts.category, value: f.category });
  if (typeof f.surveyPct === "number") {
    meta.push({
      label: labels.facts.surveyPct,
      value: `${f.surveyPct.toLocaleString(locale === "pt" ? "pt-BR" : "en-US", { minimumFractionDigits: 1 })}%`,
    });
  }

  const whenToUse = f.whenToUse?.[locale];
  const install = f.install?.[locale];
  // As notas de outras seções: o mesmo item visto de outro ângulo. Antes elas
  // eram descartadas no merge do índice.
  const otherNotes = item.sections
    .filter((s) => s !== home && item.notes[s]?.[locale])
    .map((s) => ({ section: s, text: item.notes[s][locale] }));

  return (
    <article className="mx-auto w-full max-w-3xl px-5 pb-20 pt-12">
      <header className="border-b border-border pb-8">
        <p className="eyebrow flex flex-wrap items-center gap-x-2 gap-y-1">
          <a href={sectionHrefs[home]} className="hover:text-foreground">{sectionLabels[home]}</a>
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

        {meta.length || f.url ? (
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
            {meta.map((m) => (
              <span key={m.label} className="text-muted-foreground">
                {m.label} <span className="text-foreground">{m.value}</span>
              </span>
            ))}
            {f.url ? (
              <a
                href={f.url}
                target="_blank"
                rel="noreferrer"
                className="ml-auto inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 transition-colors hover:border-teal/50 hover:text-foreground"
              >
                {labels.visit}
                <ArrowUpRight size={14} aria-hidden />
              </a>
            ) : null}
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
                <a href={sectionHrefs[n.section]} className="eyebrow hover:text-foreground">
                  {sectionLabels[n.section]}
                </a>
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
        {labels.updated} <span className="tabular">{updated}</span>
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
    <span className="rounded bg-warm/15 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-warm">
      {label}
    </span>
  );
}
