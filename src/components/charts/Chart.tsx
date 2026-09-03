import type { Locale } from "@/i18n/routing";
import { survey, label } from "@/lib/data";
import { fmtNum, fmtPct, fmtSigned } from "@/lib/format";
import { BarChart, BandChart, ButterflyChart, DotPlot } from "./primitives";
import { ChartFigure, type LegendItem } from "./ChartFigure";

export type ChartName =
  | "vibe-band" | "vibe-tiers" | "vibe-by-role" | "satisfaction" | "trust" | "tools"
  | "outlook" | "blockers" | "workflow" | "ai-central-by-company" | "investing"
  | "built-tool" | "roles" | "regions" | "company";

const ORDINAL = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];
const SOURCE = "UX Tools, State of Prototyping Spring 2026 (CC BY 4.0)";

const C = {
  pt: {
    pctCol: "%", nCol: "n",
    vibeBand: { title: "Que parte da sua produção é vibe coding?", sub: "vibe_distribution · n=1.478 · “código gerado por IA que você talvez não entenda por completo, mas funciona”" },
    camps: [["Não usa", "Zero código gerado por IA"], ["Complementa", "Ocasionalmente ou cerca de metade"], ["Maioria da produção", "A maior parte ou quase tudo"]],
    vibeTiers: { title: "Que parte da sua produção é vibe coding?", sub: "vibe_distribution · n=1.478 · cor codifica a intensidade" , col: "Faixa" },
    vibeByRole: { title: "Quem gera 50% ou mais com vibe coding, por papel", sub: "vibe_by_role · % de cada papel · n entre parênteses", col: "Papel", note: "* Researcher: n=23, leitura apenas direcional." },
    satisfaction: { title: "Satisfação média com o workflow, por faixa de vibe coding", sub: "satisfaction · escala 1–10", col: "Faixa", meanCol: "Média (1–10)", mean: "média", legend: "Média geral", delta: "Δ Nenhum → Quase tudo" },
    trust: { title: "Quanto você confia na saída da IA para produção?", sub: "trust_level · ordenado do menor ao maior nível de confiança", col: "Nível de confiança", note: (g: typeof survey.derived.trustGroups, l: Locale) => `Agrupando: ${fmtPct(g.draftOrExploration, l)} tratam a saída como rascunho ou exploração; ${fmtPct(g.shipWithReview, l)} confiam para entregar com algum grau de revisão; ${fmtPct(g.dontUse, l)} não usam.` },
    tools: { title: "Ferramentas usadas toda semana, top 10", sub: "tools · múltipla escolha · % dos 1.478 respondentes", col: "Ferramenta", ai: "Ferramenta de IA", nonAi: "Não IA" },
    outlook: { title: "Como a IA vai afetar o seu papel nos próximos 2 anos?", sub: "outlook por papel · “about the same” só na tabela", left: "menos seguro", right: "mais valioso", same: "Igual", net: "Saldo (pts)", col: "Papel", note: "* Researcher: n=23, direcional. Os três percentuais por papel não somam 100%; as categorias restantes não constam do extrato." },
    blockers: { title: "O que mais atrapalha o seu workflow hoje?", sub: "blockers · múltipla escolha", col: "Bloqueio" },
    workflow: { title: "Como seu workflow mudou nos últimos 6 meses?", sub: "workflow_change", col: "Mudança" },
    aiCentral: { title: "“A IA agora é central”, por tipo de empresa", sub: "workflow_change_by_company · % que marcou “AI is now central”", col: "Contexto" },
    investing: { title: "Onde você vai investir nos próximos 12 meses? (escolha 3)", sub: "investing_next", col: "Prioridade" },
    built: { title: "Construiu uma ferramenta própria com código de IA nos últimos 6 meses?", sub: "built_tool", col: "Resposta" },
    roles: { title: "Papel principal", sub: "role_distribution · n=1.477", col: "Papel" },
    regions: { title: "Região", sub: "region_distribution · n=1.476 · 10 maiores; o restante agregado", col: "Região", other: "Outras 8 regiões" },
    company: { title: "Contexto de empresa", sub: "company_context", col: "Contexto" },
  },
  en: {
    pctCol: "%", nCol: "n",
    vibeBand: { title: "How much of your output is vibe coding?", sub: "vibe_distribution · n=1,478 · “AI-generated code you may not fully understand, but that works”" },
    camps: [["Don't use", "Zero AI-generated code"], ["Complements", "Occasionally or about half"], ["Majority of output", "Most of it or nearly all"]],
    vibeTiers: { title: "How much of your output is vibe coding?", sub: "vibe_distribution · n=1,478 · color encodes intensity", col: "Tier" },
    vibeByRole: { title: "Who generates 50% or more with vibe coding, by role", sub: "vibe_by_role · % of each role · n in parentheses", col: "Role", note: "* Researcher: n=23, directional only." },
    satisfaction: { title: "Average workflow satisfaction, by vibe-coding tier", sub: "satisfaction · 1–10 scale", col: "Tier", meanCol: "Mean (1–10)", mean: "mean", legend: "Overall mean", delta: "Δ None → Nearly all" },
    trust: { title: "How much do you trust AI output for production?", sub: "trust_level · ordered from least to most trust", col: "Trust level", note: (g: typeof survey.derived.trustGroups, l: Locale) => `Grouped: ${fmtPct(g.draftOrExploration, l)} treat output as draft or exploration; ${fmtPct(g.shipWithReview, l)} trust it to ship with some review; ${fmtPct(g.dontUse, l)} don't use it.` },
    tools: { title: "Tools used every week, top 10", sub: "tools · multi-select · % of 1,478 respondents", col: "Tool", ai: "AI tool", nonAi: "Not AI" },
    outlook: { title: "How will AI affect your role in the next 2 years?", sub: "outlook by role · “about the same” in the table only", left: "less secure", right: "more valuable", same: "Same", net: "Net (pts)", col: "Role", note: "* Researcher: n=23, directional. The three percentages per role do not sum to 100%; remaining categories are not in the extract." },
    blockers: { title: "What gets in the way of your workflow today?", sub: "blockers · multi-select", col: "Blocker" },
    workflow: { title: "How did your workflow change in the last 6 months?", sub: "workflow_change", col: "Change" },
    aiCentral: { title: "“AI is now central”, by company type", sub: "workflow_change_by_company · % who picked “AI is now central”", col: "Context" },
    investing: { title: "Where will you invest in the next 12 months? (pick 3)", sub: "investing_next", col: "Priority" },
    built: { title: "Built a custom tool with AI code in the last 6 months?", sub: "built_tool", col: "Answer" },
    roles: { title: "Primary role", sub: "role_distribution · n=1,477", col: "Role" },
    regions: { title: "Region", sub: "region_distribution · n=1,476 · top 10; the rest aggregated", col: "Region", other: "Other 8 regions" },
    company: { title: "Company context", sub: "company_context", col: "Context" },
  },
};

type Row = { key: string; pt: string; en: string; pct: number; n?: number | null };
const rowsToTable = (rows: Row[], locale: Locale, col: string, withN: boolean) => ({
  columns: [{ label: col }, { label: C[locale].pctCol, numeric: true }, ...(withN ? [{ label: C[locale].nCol, numeric: true }] : [])],
  rows: rows.map((r) => [label(r, locale), fmtPct(r.pct, locale), ...(withN && r.n ? [fmtNum(r.n, locale)] : withN ? ["—"] : [])]),
});

export async function Chart({ name, locale }: { name: ChartName; locale: Locale }) {
  const c = C[locale];
  const s = survey;

  switch (name) {
    case "vibe-band": {
      const segs = s.vibe.map((v, i) => ({ key: v.key, label: label(v, locale), value: v.pct, n: v.n, color: ORDINAL[i] }));
      const groups = s.derived.camps.map((g, i) => ({
        key: g.key, label: c.camps[i][0], sub: `${fmtPct(g.pct, locale)} · n=${fmtNum(g.n, locale)}`,
        from: s.vibe.findIndex((v) => v.key === g.tiers[0]), to: s.vibe.findIndex((v) => v.key === g.tiers[g.tiers.length - 1]),
      }));
      return (
        <ChartFigure title={c.vibeBand.title} subtitle={c.vibeBand.sub} locale={locale} source={SOURCE}
          table={rowsToTable(s.vibe, locale, c.vibeTiers.col, true)}>
          <BandChart segments={segs} groups={groups} locale={locale} ariaLabel={c.vibeBand.title} />
        </ChartFigure>
      );
    }
    case "vibe-tiers":
      return (
        <ChartFigure title={c.vibeTiers.title} subtitle={c.vibeTiers.sub} locale={locale} source={SOURCE} table={rowsToTable(s.vibe, locale, c.vibeTiers.col, true)}>
          <BarChart locale={locale} max={40} ariaLabel={c.vibeTiers.title} labelWidth={190}
            rows={s.vibe.map((v, i) => ({ key: v.key, label: label(v, locale), value: v.pct, n: v.n, color: ORDINAL[i] }))} />
        </ChartFigure>
      );
    case "vibe-by-role":
      return (
        <ChartFigure title={c.vibeByRole.title} subtitle={c.vibeByRole.sub} locale={locale} source={SOURCE} note={c.vibeByRole.note}
          table={rowsToTable(s.vibeByRole, locale, c.vibeByRole.col, true)}>
          <BarChart locale={locale} max={100} showN ariaLabel={c.vibeByRole.title}
            rows={s.vibeByRole.map((v) => ({ key: v.key, label: label(v, locale), value: v.pct, n: v.n, flag: v.directional }))} />
        </ChartFigure>
      );
    case "satisfaction": {
      const legend: LegendItem[] = [{ label: `${c.satisfaction.legend} ${fmtNum(s.satisfactionOverall, locale, 2)}`, color: "var(--muted-foreground)", kind: "line" }];
      return (
        <ChartFigure title={c.satisfaction.title} subtitle={c.satisfaction.sub} locale={locale} source={SOURCE} legend={legend}
          note={`${c.satisfaction.delta}: ${fmtSigned(s.satisfactionDelta, locale, 2)}`}
          table={{ columns: [{ label: c.satisfaction.col }, { label: c.satisfaction.meanCol, numeric: true }, { label: c.nCol, numeric: true }],
            rows: s.satisfaction.map((r) => [label(r, locale), fmtNum(r.mean, locale, 2), fmtNum(r.n, locale)]) }}>
          <DotPlot locale={locale} mean={s.satisfactionOverall} meanLabel={`${c.satisfaction.mean} ${fmtNum(s.satisfactionOverall, locale, 2)}`} ariaLabel={c.satisfaction.title}
            rows={s.satisfaction.map((r, i) => ({ key: r.key, label: label(r, locale), value: r.mean, n: r.n, color: ORDINAL[i] }))} />
        </ChartFigure>
      );
    }
    case "trust":
      return (
        <ChartFigure title={c.trust.title} subtitle={c.trust.sub} locale={locale} source={SOURCE} note={c.trust.note(s.derived.trustGroups, locale)}
          table={rowsToTable(s.trust, locale, c.trust.col, false)}>
          <BarChart locale={locale} max={40} ariaLabel={c.trust.title}
            rows={s.trust.map((v, i) => ({ key: v.key, label: label(v, locale), value: v.pct, color: ORDINAL[Math.min(i, 4)] }))} />
        </ChartFigure>
      );
    case "tools":
      return (
        <ChartFigure title={c.tools.title} subtitle={c.tools.sub} locale={locale} source={SOURCE}
          legend={[{ label: c.tools.ai, color: "var(--teal)" }, { label: c.tools.nonAi, color: "var(--neutral-mark)" }]}
          table={rowsToTable(s.tools, locale, c.tools.col, true)}>
          <BarChart locale={locale} max={100} ariaLabel={c.tools.title} labelWidth={150}
            rows={s.tools.map((t) => ({ key: t.key, label: t.en, value: t.pct, n: t.n, muted: !t.ai }))} />
        </ChartFigure>
      );
    case "outlook":
      return (
        <ChartFigure title={c.outlook.title} subtitle={c.outlook.sub} locale={locale} source={SOURCE} note={c.outlook.note}
          legend={[{ label: c.outlook.left, color: "var(--warm)" }, { label: c.outlook.right, color: "var(--teal)" }]}
          table={{ columns: [{ label: c.outlook.col }, { label: c.outlook.right, numeric: true }, { label: c.outlook.left, numeric: true }, { label: c.outlook.same, numeric: true }, { label: c.outlook.net, numeric: true }, { label: c.nCol, numeric: true }],
            rows: s.outlook.map((o) => [label(o, locale), fmtPct(o.moreValuable, locale), fmtPct(o.lessSecure, locale), fmtPct(o.aboutSame, locale), fmtSigned(o.net, locale), fmtNum(o.n, locale)]) }}>
          <ButterflyChart locale={locale} leftHead={c.outlook.left} rightHead={c.outlook.right} ariaLabel={c.outlook.title}
            rows={s.outlook.map((o) => ({ key: o.key, label: label(o, locale), n: o.n, left: o.lessSecure, right: o.moreValuable, flag: o.directional }))} />
        </ChartFigure>
      );
    case "blockers":
      return (
        <ChartFigure title={c.blockers.title} subtitle={c.blockers.sub} locale={locale} source={SOURCE} table={rowsToTable(s.blockers, locale, c.blockers.col, false)}>
          <BarChart locale={locale} max={60} ariaLabel={c.blockers.title} rows={s.blockers.map((b) => ({ key: b.key, label: label(b, locale), value: b.pct }))} />
        </ChartFigure>
      );
    case "workflow":
      return (
        <ChartFigure title={c.workflow.title} subtitle={c.workflow.sub} locale={locale} source={SOURCE} table={rowsToTable(s.workflowChange, locale, c.workflow.col, false)}>
          <BarChart locale={locale} max={40} ariaLabel={c.workflow.title} rows={s.workflowChange.map((b) => ({ key: b.key, label: label(b, locale), value: b.pct, bold: b.key === "consolidated" }))} />
        </ChartFigure>
      );
    case "ai-central-by-company":
      return (
        <ChartFigure title={c.aiCentral.title} subtitle={c.aiCentral.sub} locale={locale} source={SOURCE} table={rowsToTable(s.aiCentralByCompany, locale, c.aiCentral.col, true)}>
          <BarChart locale={locale} max={40} showN ariaLabel={c.aiCentral.title} rows={s.aiCentralByCompany.map((b) => ({ key: b.key, label: label(b, locale), value: b.pct, n: b.n }))} />
        </ChartFigure>
      );
    case "investing":
      return (
        <ChartFigure title={c.investing.title} subtitle={c.investing.sub} locale={locale} source={SOURCE} table={rowsToTable(s.investing, locale, c.investing.col, false)}>
          <BarChart locale={locale} max={70} ariaLabel={c.investing.title} rows={s.investing.map((b) => ({ key: b.key, label: label(b, locale), value: b.pct, bold: b.key === "design-systems" || b.key === "simplify" }))} />
        </ChartFigure>
      );
    case "built-tool":
      return (
        <ChartFigure title={c.built.title} subtitle={c.built.sub} locale={locale} source={SOURCE} table={rowsToTable(s.builtTool, locale, c.built.col, false)}>
          <BarChart locale={locale} max={40} ariaLabel={c.built.title} rows={s.builtTool.map((b) => ({ key: b.key, label: label(b, locale), value: b.pct }))} />
        </ChartFigure>
      );
    case "roles":
      return (
        <ChartFigure title={c.roles.title} subtitle={c.roles.sub} locale={locale} source={SOURCE} table={rowsToTable(s.roles, locale, c.roles.col, true)}>
          <BarChart locale={locale} max={60} showN ariaLabel={c.roles.title} rows={s.roles.map((b) => ({ key: b.key, label: label(b, locale), value: b.pct, n: b.n }))} />
        </ChartFigure>
      );
    case "regions": {
      const top = s.regions.slice(0, 10);
      const rest = s.regions.slice(10);
      const other = { key: "other", pt: c.regions.other, en: c.regions.other, pct: Math.round(rest.reduce((a, r) => a + r.pct, 0) * 10) / 10, n: rest.reduce((a, r) => a + r.n, 0) };
      const rows = [...top, other];
      return (
        <ChartFigure title={c.regions.title} subtitle={c.regions.sub} locale={locale} source={SOURCE} table={rowsToTable(s.regions, locale, c.regions.col, true)}>
          <BarChart locale={locale} max={40} ariaLabel={c.regions.title} rows={rows.map((b) => ({ key: b.key, label: label(b, locale), value: b.pct, n: b.n, muted: b.key === "other", bold: b.key === "south-america" }))} />
        </ChartFigure>
      );
    }
    case "company":
      return (
        <ChartFigure title={c.company.title} subtitle={c.company.sub} locale={locale} source={SOURCE} table={rowsToTable(s.company, locale, c.company.col, false)}>
          <BarChart locale={locale} max={30} ariaLabel={c.company.title} rows={s.company.map((b) => ({ key: b.key, label: label(b, locale), value: b.pct }))} />
        </ChartFigure>
      );
  }
}
