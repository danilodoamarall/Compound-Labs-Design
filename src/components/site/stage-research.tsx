"use client";

import { Download } from "lucide-react";
import CountUp from "@/components/reactbits/CountUp";

export type Camp = { key: string; label: string; pct: number; n: number };
export type ToolStat = { key: string; label: string; pct: number; ai: boolean };

export type ResearchLabels = {
  responses: string;
  builtTool: string;
  investing: string;
  campsTitle: string;
  toolsTitle: string;
  collected: string;
  license: string;
  csv: string;
  source: string;
};

/** A seção Research: a pesquisa que originou a série, mostrada como fonte e não
    como opinião. Todos os números vêm de content/data/state-of-prototyping-2026
    .json, que o scripts/check-numbers.mjs já confere contra os artigos. */
export function StageResearch({
  responses,
  builtTool,
  investing,
  camps,
  tools,
  collected,
  license,
  csvHref,
  sourceHref,
  labels,
  locale,
}: {
  responses: number;
  builtTool: number;
  investing: number;
  camps: Camp[];
  tools: ToolStat[];
  collected: string;
  license: string;
  csvHref: string;
  sourceHref: string;
  labels: ResearchLabels;
  locale: string;
}) {
  const intl = locale === "pt" ? "pt-BR" : "en-US";

  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
      <div>
        <dl className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3">
          <Stat value={responses} label={labels.responses} intl={intl} sep="." />
          <Stat value={builtTool} label={labels.builtTool} intl={intl} suffix="%" decimals />
          <Stat value={investing} label={labels.investing} intl={intl} suffix="%" />
        </dl>

        <h3 className="mt-14 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--stage-dim)]">
          {labels.campsTitle}
        </h3>
        <ul className="mt-5 space-y-4">
          {camps.map((camp, i) => (
            <li key={camp.key}>
              <div className="flex items-baseline justify-between gap-4 text-[15px]">
                <span className="text-[#EDEDED]">{camp.label}</span>
                <span className="font-mono tabular-nums text-[var(--stage-dim)]">
                  {camp.pct.toLocaleString(intl, { minimumFractionDigits: 1 })}%
                </span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.07]">
                <div
                  className="stage-bar h-full rounded-full"
                  style={{
                    width: `${camp.pct}%`,
                    animationDelay: `${i * 140}ms`,
                    background: ["#0b8a74", "#1f7a8c", "#c9571c"][i % 3],
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--stage-dim)]">
          {labels.toolsTitle}
        </h3>
        <ul className="mt-5 flex flex-wrap gap-2">
          {tools.map((tool) => (
            <li
              key={tool.key}
              className="inline-flex items-baseline gap-2 rounded-full border border-[var(--stage-line)] px-3.5 py-1.5"
              style={tool.ai ? { borderColor: "rgba(11,138,116,0.45)" } : undefined}
            >
              <span className="text-[14px] text-[#EDEDED]">{tool.label}</span>
              <span className="font-mono text-[12px] tabular-nums text-[var(--stage-dim)]">
                {tool.pct.toLocaleString(intl, { minimumFractionDigits: 1 })}%
              </span>
            </li>
          ))}
        </ul>

        <dl className="mt-12 space-y-3 border-t border-[var(--stage-line)] pt-6 text-[14px]">
          <div className="flex gap-3">
            <dt className="w-28 shrink-0 text-[var(--stage-dim)]">{labels.collected}</dt>
            <dd className="font-mono tabular-nums">{collected}</dd>
          </div>
          <div className="flex gap-3">
            <dt className="w-28 shrink-0 text-[var(--stage-dim)]">{labels.license}</dt>
            <dd className="font-mono">{license}</dd>
          </div>
        </dl>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={csvHref}
            download
            className="inline-flex h-10 items-center gap-2 rounded-full bg-[#EDEDED] px-4 text-[16px] font-medium text-[#0A0A0A] outline-none transition-colors hover:bg-white focus-visible:ring-2 focus-visible:ring-white/60"
          >
            <Download size={15} aria-hidden />
            {labels.csv}
          </a>
          <a
            href={sourceHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-10 items-center rounded-full border border-[var(--stage-line)] px-4 text-[16px] text-[var(--stage-dim)] outline-none transition-colors hover:text-[#EDEDED] focus-visible:ring-2 focus-visible:ring-white/60"
          >
            {labels.source}
          </a>
        </div>
      </div>
    </div>
  );
}

function Stat({
  value,
  label,
  intl,
  suffix,
  sep,
  decimals,
}: {
  value: number;
  label: string;
  intl: string;
  suffix?: string;
  sep?: string;
  decimals?: boolean;
}) {
  return (
    <div>
      <dt className="sr-only">{label}</dt>
      <dd>
        <span className="block font-mono text-[40px] font-medium leading-none tracking-[-0.04em] tabular-nums text-[var(--stage-fg)] sm:text-[48px]">
          {decimals ? (
            <span>{value.toLocaleString(intl, { minimumFractionDigits: 1 })}</span>
          ) : (
            <CountUp to={value} duration={1.4} separator={sep ?? ""} locale={intl} />
          )}
          {suffix ? <span className="text-[0.6em] text-[var(--stage-dim)]">{suffix}</span> : null}
        </span>
        <span aria-hidden className="mt-3 block max-w-[15rem] text-[14px] leading-snug text-[var(--stage-dim)]">
          {label}
        </span>
      </dd>
    </div>
  );
}
