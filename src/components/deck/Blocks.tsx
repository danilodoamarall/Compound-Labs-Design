import type { ReactNode } from "react";
import type { Locale } from "@/i18n/routing";
import { fmtNum } from "@/lib/format";

/** Número grande para um slide.
    `value` chega do MDX sempre como string (o pipeline de MDX descarta
    atributos com expressão JSX). Se for numérica, é formatada no idioma da
    página; senão, passa direto. `sign="true"` mostra o + em valores positivos. */
export function Stat({ value, unit = "", label, digits, locale, sign }: { value: string; unit?: string; label: ReactNode; digits?: string; locale: Locale; sign?: string }) {
  const n = Number(value);
  const isNum = value.trim() !== "" && Number.isFinite(n);
  const d = digits !== undefined ? Number(digits) : Math.min(2, (value.split(".")[1] ?? "").length);
  const text = isNum ? `${sign === "true" && n > 0 ? "+" : ""}${fmtNum(n, locale, d)}` : value;
  return (
    <div className="stat">
      <div className="stat-value">
        {text}
        {unit ? <span className="stat-unit">{unit}</span> : null}
      </div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

export function Stats({ children }: { children: ReactNode }) {
  return <div className="stats">{children}</div>;
}

export function Callout({ kind = "tension", title, children }: { kind?: "tension" | "caveat" | "idea"; title: string; children: ReactNode }) {
  return (
    <aside className={`callout callout-${kind}`}>
      <p className="callout-title">{title}</p>
      <div className="callout-body">{children}</div>
    </aside>
  );
}

export function Question({ children }: { children: ReactNode }) {
  return <p className="question font-display">{children}</p>;
}

export function Two({ children }: { children: ReactNode }) {
  return <div className="two">{children}</div>;
}
