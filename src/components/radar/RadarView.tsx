"use client";

import { useMemo, useState } from "react";

export type RadarPoint = {
  key: string;
  name: string;
  quadrant: string;
  ring: string;
  surveyPct: number | null;
  url: string;
  note: string;
  draft: boolean;
};

export type RadarLabels = {
  rings: Record<string, string>;
  ringHints: Record<string, string>;
  quadrants: Record<string, string>;
  weeklyUse: string;
  all: string;
  filterQuadrant: string;
  notInSurvey: string;
  draft: string;
};

const QUADRANT_ORDER = ["canvas", "assistants", "coding", "delivery"];
const RING_ORDER = ["adopt", "trial", "assess", "hold"];
const RING_COLORS = ["var(--chart-5)", "var(--chart-4)", "var(--chart-2)", "var(--neutral-mark)"];

/** Posição determinística dentro do setor (quadrante × anel). */
function place(items: RadarPoint[], size: number) {
  const c = size / 2, R = size / 2 - 24;
  const out: (RadarPoint & { x: number; y: number; idx: number })[] = [];
  let idx = 0;
  QUADRANT_ORDER.forEach((q, qi) => {
    RING_ORDER.forEach((r, ri) => {
      const group = items.filter((i) => i.quadrant === q && i.ring === r);
      const a0 = (qi * Math.PI) / 2 + 0.16, a1 = ((qi + 1) * Math.PI) / 2 - 0.16;
      const r0 = (R * ri) / 4 + 22, r1 = (R * (ri + 1)) / 4 - 14;
      group.forEach((it, k) => {
        const tA = group.length === 1 ? 0.5 : k / (group.length - 1);
        const angle = a0 + (a1 - a0) * (0.15 + 0.7 * tA);
        const radius = r0 + (r1 - r0) * (k % 2 === 0 ? 0.35 : 0.75);
        idx += 1;
        out.push({ ...it, idx, x: c + radius * Math.cos(angle), y: c + radius * Math.sin(angle) });
      });
    });
  });
  return out;
}

export function RadarView({ items, labels, locale }: { items: RadarPoint[]; labels: RadarLabels; locale: "pt" | "en" }) {
  const size = 760;
  const [quadrant, setQuadrant] = useState<string | null>(null);
  const [active, setActive] = useState<string | null>(null);
  const placed = useMemo(() => place(items, size), [items]);
  const visible = placed.filter((p) => !quadrant || p.quadrant === quadrant);
  const fmt = (v: number) => new Intl.NumberFormat(locale === "pt" ? "pt-BR" : "en-US", { maximumFractionDigits: 1, minimumFractionDigits: 1 }).format(v);
  const c = size / 2, R = size / 2 - 24;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
      <div>
        <div className="flex flex-wrap gap-2" role="group" aria-label={labels.filterQuadrant}>
          <button type="button" onClick={() => setQuadrant(null)} aria-pressed={!quadrant} className={`rounded-full border px-3 py-1 text-sm ${!quadrant ? "border-teal bg-accent text-accent-foreground" : "border-border text-muted-foreground hover:text-foreground"}`}>{labels.all}</button>
          {QUADRANT_ORDER.map((q) => (
            <button key={q} type="button" onClick={() => setQuadrant(quadrant === q ? null : q)} aria-pressed={quadrant === q} className={`rounded-full border px-3 py-1 text-sm ${quadrant === q ? "border-teal bg-accent text-accent-foreground" : "border-border text-muted-foreground hover:text-foreground"}`}>{labels.quadrants[q]}</button>
          ))}
        </div>
        <svg viewBox={`0 0 ${size} ${size}`} className="mt-4 w-full" role="img" aria-label="Radar">
          {RING_ORDER.map((r, i) => (
            <circle key={r} cx={c} cy={c} r={(R * (4 - i)) / 4} fill={i % 2 === 0 ? "var(--card)" : "var(--wash)"} stroke="var(--border)" />
          ))}
          <line x1={c} x2={c} y1={c - R} y2={c + R} stroke="var(--border)" />
          <line x1={c - R} x2={c + R} y1={c} y2={c} stroke="var(--border)" />
          {RING_ORDER.map((r, i) => (
            <text key={r} x={c + 6} y={c - (R * (4 - i)) / 4 + 16} fontFamily="var(--font-mono)" fontSize={11} fill="var(--muted-foreground)" letterSpacing={0.6}>{labels.rings[r].toUpperCase()}</text>
          ))}
          {QUADRANT_ORDER.map((q, qi) => {
            const pos = [[c + R - 4, c + 22], [c - R + 4, c + 22], [c - R + 4, c - 10], [c + R - 4, c - 10]][qi];
            const anchor = qi === 0 || qi === 3 ? "end" : "start";
            return <text key={q} x={pos[0]} y={pos[1]} textAnchor={anchor} fontFamily="var(--font-sans)" fontSize={13} fontWeight={600} fill={quadrant && quadrant !== q ? "var(--muted-foreground)" : "var(--foreground)"}>{labels.quadrants[q]}</text>;
          })}
          {placed.map((p) => {
            const dim = quadrant && p.quadrant !== quadrant;
            const isActive = active === p.key;
            const color = RING_COLORS[RING_ORDER.indexOf(p.ring)];
            return (
              <g key={p.key} opacity={dim ? 0.2 : 1} style={{ cursor: "pointer" }} onMouseEnter={() => setActive(p.key)} onMouseLeave={() => setActive(null)} onClick={() => setActive(p.key)} tabIndex={0} onFocus={() => setActive(p.key)} onBlur={() => setActive(null)}>
                <title>{`${p.name} · ${labels.rings[p.ring]}${p.surveyPct != null ? ` · ${fmt(p.surveyPct)}% ${labels.weeklyUse}` : ""}`}</title>
                <circle cx={p.x} cy={p.y} r={isActive ? 15 : 12} fill={color} stroke="var(--card)" strokeWidth={2} />
                <text x={p.x} y={p.y} textAnchor="middle" dominantBaseline="central" fontFamily="var(--font-mono)" fontSize={10.5} fontWeight={600} fill="#fff">{p.idx}</text>
                {isActive ? <text x={p.x} y={p.y - 20} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={13} fontWeight={600} fill="var(--foreground)" style={{ paintOrder: "stroke", stroke: "var(--background)", strokeWidth: 4 }}>{p.name}</text> : null}
              </g>
            );
          })}
        </svg>
      </div>
      <div>
        {RING_ORDER.map((r, ri) => {
          const group = visible.filter((p) => p.ring === r);
          if (!group.length) return null;
          return (
            <section key={r} className="mb-7">
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <span aria-hidden className="inline-block size-3 rounded-full" style={{ background: RING_COLORS[ri] }} />
                {labels.rings[r]}
                <span className="font-normal text-muted-foreground">· {labels.ringHints[r]}</span>
              </h3>
              <ul className="mt-3 divide-y divide-border border-y border-border">
                {group.map((p) => (
                  <li key={p.key} id={p.key} className={`py-3 ${active === p.key ? "bg-wash" : ""}`} onMouseEnter={() => setActive(p.key)} onMouseLeave={() => setActive(null)}>
                    <div className="flex items-baseline gap-3">
                      <span className="w-6 shrink-0 font-mono text-xs text-muted-foreground tabular">{p.idx}</span>
                      <a href={p.url} target="_blank" rel="noreferrer" className="font-medium hover:underline">{p.name}</a>
                      <span className="text-xs text-muted-foreground">{labels.quadrants[p.quadrant]}</span>
                      <span className="ml-auto font-mono text-xs text-muted-foreground tabular">{p.surveyPct != null ? `${fmt(p.surveyPct)}% ${labels.weeklyUse}` : labels.notInSurvey}</span>
                      {p.draft ? <span className="rounded bg-warm/15 px-1.5 py-0.5 font-mono text-[10px] uppercase text-warm">{labels.draft}</span> : null}
                    </div>
                    <p className="mt-1.5 pl-9 text-sm text-muted-foreground">{p.note}</p>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
