import type { Locale } from "@/i18n/routing";
import { fmtNum, fmtPct } from "@/lib/format";

/* Gráficos em SVG puro, renderizados no servidor. Cores vêm dos tokens CSS
   (var(--teal), var(--warm), var(--chart-1..5), var(--neutral-mark)) para
   seguir o tema claro/escuro e manter a paleta validada do deep dive. */

export const W = 800;
const FONT = "var(--font-sans)";
const MONO = "var(--font-mono)";
const INK = "var(--foreground)";
const INK2 = "var(--muted-foreground)";
const RULE = "var(--border)";

/** Retângulo com cantos arredondados só em um lado (baseline reta). */
export function barPath(x: number, y: number, w: number, h: number, r: number, side: "right" | "left" = "right") {
  const rr = Math.min(r, w / 2, h / 2);
  if (w <= 0) return "";
  if (side === "right") {
    return `M${x},${y} H${x + w - rr} Q${x + w},${y} ${x + w},${y + rr} V${y + h - rr} Q${x + w},${y + h} ${x + w - rr},${y + h} H${x} Z`;
  }
  return `M${x + w},${y} H${x + rr} Q${x},${y} ${x},${y + rr} V${y + h - rr} Q${x},${y + h} ${x + rr},${y + h} H${x + w} Z`;
}

export type BarRow = {
  key: string;
  label: string;
  value: number;
  n?: number | null;
  color?: string;
  muted?: boolean;
  bold?: boolean;
  flag?: boolean;
};

type BarChartProps = {
  rows: BarRow[];
  max?: number;
  locale: Locale;
  showN?: boolean;
  labelWidth?: number;
  ariaLabel: string;
};

export function BarChart({ rows, max, locale, showN, labelWidth = 230, ariaLabel }: BarChartProps) {
  const rowH = 34, barH = 14, top = 6, valueW = 64, gap = 12;
  const x0 = labelWidth + gap;
  const trackW = W - x0 - gap - valueW;
  const m = max ?? Math.ceil(Math.max(...rows.map((r) => r.value)) / 10) * 10;
  const H = top * 2 + rows.length * rowH;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label={ariaLabel} style={{ display: "block", overflow: "visible" }}>
      <line x1={x0} x2={x0} y1={top} y2={H - top} stroke={RULE} strokeWidth={1} />
      {rows.map((r, i) => {
        const y = top + i * rowH;
        const w = Math.max(2, (r.value / m) * trackW);
        const color = r.color ?? (r.muted ? "var(--neutral-mark)" : "var(--teal)");
        return (
          <g key={r.key}>
            <title>{`${r.label} — ${fmtPct(r.value, locale)}${r.n ? ` · n=${fmtNum(r.n, locale)}` : ""}`}</title>
            <text x={labelWidth} y={y + rowH / 2} textAnchor="end" dominantBaseline="central" fontFamily={FONT} fontSize={14} fontWeight={r.bold ? 600 : 400} fill={r.muted ? INK2 : INK}>
              {r.label}
              {r.flag ? <tspan fill="var(--warm)" fontFamily={MONO} fontSize={11}> *</tspan> : null}
              {showN && r.n ? <tspan fill={INK2} fontFamily={MONO} fontSize={11}>{`  (${fmtNum(r.n, locale)})`}</tspan> : null}
            </text>
            <path d={barPath(x0, y + (rowH - barH) / 2, w, barH, 4)} fill={color} />
            <text x={W} y={y + rowH / 2} textAnchor="end" dominantBaseline="central" fontFamily={FONT} fontSize={13} fill={INK2} style={{ fontVariantNumeric: "tabular-nums" }}>
              {fmtPct(r.value, locale)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export type BandSegment = { key: string; label: string; value: number; n?: number; color: string };
export type BandGroup = { key: string; label: string; sub: string; from: number; to: number };

export function BandChart({ segments, groups, locale, ariaLabel }: { segments: BandSegment[]; groups: BandGroup[]; locale: Locale; ariaLabel: string }) {
  const bandH = 56, gap = 2, top = 4;
  const total = segments.reduce((a, s) => a + s.value, 0);
  const usable = W - gap * (segments.length - 1);
  let x = 0;
  const placed = segments.map((s) => {
    const w = (s.value / total) * usable;
    const out = { ...s, x, w };
    x += w + gap;
    return out;
  });
  const tierY = top + bandH + 18;
  const groupY = tierY + 30;
  const H = groupY + 46;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label={ariaLabel} style={{ display: "block", overflow: "visible" }}>
      {placed.map((s) => (
        <g key={s.key}>
          <title>{`${s.label} — ${fmtPct(s.value, locale)}${s.n ? ` · n=${fmtNum(s.n, locale)}` : ""}`}</title>
          <rect x={s.x} y={top} width={s.w} height={bandH} rx={3} fill={s.color} />
          {s.w > 64 ? (
            <text x={s.x + s.w / 2} y={top + bandH / 2} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontSize={15} fontWeight={500} fill="#fff" style={{ fontVariantNumeric: "tabular-nums" }}>
              {fmtPct(s.value, locale)}
            </text>
          ) : null}
          <text x={s.x + 2} y={tierY} fontFamily={MONO} fontSize={11} fill={INK2}>
            {s.w > 90 ? s.label : s.label.length > 12 ? `${s.label.slice(0, 11)}…` : s.label}
          </text>
        </g>
      ))}
      {groups.map((g) => {
        const a = placed[g.from], b = placed[g.to];
        const gx = a.x, gw = b.x + b.w - a.x;
        return (
          <g key={g.key}>
            <path d={`M${gx},${groupY - 10} V${groupY - 2} H${gx + gw} V${groupY - 10}`} fill="none" stroke={INK2} strokeWidth={1} />
            <text x={gx} y={groupY + 14} fontFamily={FONT} fontSize={15} fontWeight={600} fill={INK}>{g.label}</text>
            <text x={gx} y={groupY + 34} fontFamily={MONO} fontSize={12} fill={INK2}>{g.sub}</text>
          </g>
        );
      })}
    </svg>
  );
}

export type ButterflyRow = { key: string; label: string; n: number; left: number; right: number; flag?: boolean };

export function ButterflyChart({ rows, max = 50, locale, leftHead, rightHead, ariaLabel }: { rows: ButterflyRow[]; max?: number; locale: Locale; leftHead: string; rightHead: string; ariaLabel: string }) {
  const rowH = 40, barH = 14, headH = 24, valW = 52, midW = 150, gap = 8;
  const trackW = (W - valW * 2 - midW - gap * 4) / 2;
  const lx1 = valW + gap + trackW; // fim da trilha esquerda
  const rx0 = lx1 + gap + midW + gap; // início da trilha direita
  const H = headH + rows.length * rowH + 4;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label={ariaLabel} style={{ display: "block", overflow: "visible" }}>
      <text x={lx1} y={12} textAnchor="end" fontFamily={MONO} fontSize={11.5} fill={INK2} letterSpacing={0.5}>{`← ${leftHead.toUpperCase()}`}</text>
      <text x={rx0} y={12} fontFamily={MONO} fontSize={11.5} fill={INK2} letterSpacing={0.5}>{`${rightHead.toUpperCase()} →`}</text>
      <line x1={lx1} x2={lx1} y1={headH} y2={H - 4} stroke={RULE} />
      <line x1={rx0} x2={rx0} y1={headH} y2={H - 4} stroke={RULE} />
      {rows.map((r, i) => {
        const y = headH + i * rowH;
        const lw = (r.left / max) * trackW, rw = (r.right / max) * trackW;
        const cy = y + rowH / 2;
        const net = r.right - r.left;
        return (
          <g key={r.key}>
            <title>{`${r.label} · ${rightHead}: ${fmtPct(r.right, locale)} · ${leftHead}: ${fmtPct(r.left, locale)} · ${net > 0 ? "+" : ""}${fmtNum(net, locale, 1)} pts · n=${fmtNum(r.n, locale)}`}</title>
            <text x={valW} y={cy} textAnchor="end" dominantBaseline="central" fontFamily={FONT} fontSize={13} fill={INK2} style={{ fontVariantNumeric: "tabular-nums" }}>{fmtPct(r.left, locale)}</text>
            <path d={barPath(lx1 - lw, cy - barH / 2, lw, barH, 4, "left")} fill="var(--warm)" />
            <text x={lx1 + gap + midW / 2} y={cy - 7} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontSize={14} fill={INK}>
              {r.label}{r.flag ? <tspan fill="var(--warm)" fontFamily={MONO} fontSize={11}> *</tspan> : null}
            </text>
            <text x={lx1 + gap + midW / 2} y={cy + 9} textAnchor="middle" dominantBaseline="central" fontFamily={MONO} fontSize={11} fill={INK2}>{`n=${fmtNum(r.n, locale)}`}</text>
            <path d={barPath(rx0, cy - barH / 2, rw, barH, 4)} fill="var(--teal)" />
            <text x={W - valW + gap + 36} y={cy} textAnchor="end" dominantBaseline="central" fontFamily={FONT} fontSize={13} fill={INK2} style={{ fontVariantNumeric: "tabular-nums" }}>{fmtPct(r.right, locale)}</text>
          </g>
        );
      })}
    </svg>
  );
}

export type DotRow = { key: string; label: string; value: number; n: number; color: string };

export function DotPlot({ rows, min = 1, max = 10, mean, meanLabel, locale, ariaLabel }: { rows: DotRow[]; min?: number; max?: number; mean: number; meanLabel: string; locale: Locale; ariaLabel: string }) {
  const labelW = 170, gap = 12, rowH = 36, axisH = 24, top = 4, right = 40;
  const x0 = labelW + gap, trackW = W - x0 - right;
  const px = (v: number) => x0 + ((v - min) / (max - min)) * trackW;
  const H = top + axisH + rows.length * rowH + 22;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label={ariaLabel} style={{ display: "block", overflow: "visible" }}>
      {Array.from({ length: max - min + 1 }, (_, i) => min + i).map((t) => (
        <g key={t}>
          <text x={px(t)} y={top + 10} textAnchor="middle" fontFamily={MONO} fontSize={11.5} fill={INK2}>{t}</text>
          <line x1={px(t)} x2={px(t)} y1={top + axisH} y2={H - 22} stroke={RULE} strokeWidth={1} />
        </g>
      ))}
      <line x1={px(mean)} x2={px(mean)} y1={top + axisH - 4} y2={H - 18} stroke={INK2} strokeWidth={1.5} />
      <text x={px(mean)} y={H - 4} textAnchor="middle" fontFamily={MONO} fontSize={11} fill={INK2}>{meanLabel}</text>
      {rows.map((r, i) => {
        const cy = top + axisH + i * rowH + rowH / 2;
        const leftSide = r.value < mean;
        return (
          <g key={r.key}>
            <title>{`${r.label} — ${fmtNum(r.value, locale, 2)} / ${max} · n=${fmtNum(r.n, locale)}`}</title>
            <text x={labelW} y={cy} textAnchor="end" dominantBaseline="central" fontFamily={FONT} fontSize={14} fill={INK}>{r.label}</text>
            <line x1={x0} x2={W - right} y1={cy} y2={cy} stroke={RULE} strokeWidth={1} />
            <circle cx={px(r.value)} cy={cy} r={7} fill={r.color} stroke="var(--card)" strokeWidth={2} />
            <text x={px(r.value) + (leftSide ? -12 : 12)} y={cy} textAnchor={leftSide ? "end" : "start"} dominantBaseline="central" fontFamily={FONT} fontSize={13} fill={INK2} style={{ fontVariantNumeric: "tabular-nums" }}>
              {fmtNum(r.value, locale, 2)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
