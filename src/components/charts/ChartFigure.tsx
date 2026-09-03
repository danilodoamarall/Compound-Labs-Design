import type { ReactNode } from "react";
import type { Locale } from "@/i18n/routing";

export type LegendItem = { label: string; color: string; kind?: "swatch" | "line" };
export type TableSpec = { columns: { label: string; numeric?: boolean }[]; rows: (string | number)[][] };

const T = {
  pt: { table: "Ver tabela", source: "Fonte" },
  en: { table: "View table", source: "Source" },
};

export function ChartFigure({
  title, subtitle, legend, note, table, locale, source, children,
}: {
  title: string;
  subtitle?: string;
  legend?: LegendItem[];
  note?: ReactNode;
  table?: TableSpec;
  locale: Locale;
  source?: string;
  children: ReactNode;
}) {
  const t = T[locale];
  return (
    <figure className="chart-figure not-prose my-8 rounded-lg border border-border bg-card p-5 text-card-foreground sm:p-6">
      <figcaption>
        <div className="text-[15px] font-semibold leading-snug">{title}</div>
        {subtitle ? <div className="mt-1 font-mono text-xs text-muted-foreground">{subtitle}</div> : null}
      </figcaption>
      {legend?.length ? (
        <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-muted-foreground" aria-label="Legenda">
          {legend.map((l) => (
            <li key={l.label} className="flex items-center gap-2">
              <span
                aria-hidden
                className={l.kind === "line" ? "inline-block h-3.5 w-0.5" : "inline-block size-3 rounded-[3px]"}
                style={{ background: l.color }}
              />
              {l.label}
            </li>
          ))}
        </ul>
      ) : null}
      <div className="mt-4">{children}</div>
      {note ? <p className="mt-3 text-[13.5px] leading-relaxed text-muted-foreground">{note}</p> : null}
      {table ? (
        <details className="mt-3 border-t border-border pt-2">
          <summary className="cursor-pointer font-mono text-xs text-muted-foreground">{t.table}</summary>
          <div className="mt-2 overflow-x-auto">
            <table className="w-full text-[13.5px]">
              <thead>
                <tr>
                  {table.columns.map((c) => (
                    <th key={c.label} className={`border-b border-border py-1.5 pr-3 text-left font-mono text-[11px] font-medium uppercase tracking-wide text-muted-foreground ${c.numeric ? "text-right" : ""}`}>
                      {c.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.rows.map((r, i) => (
                  <tr key={i}>
                    {r.map((cell, j) => (
                      <td key={j} className={`border-b border-border/60 py-1.5 pr-3 align-top ${table.columns[j]?.numeric ? "tabular text-right" : ""}`}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      ) : null}
      {source ? <p className="mt-3 font-mono text-[11px] text-muted-foreground">{t.source}: {source}</p> : null}
    </figure>
  );
}
