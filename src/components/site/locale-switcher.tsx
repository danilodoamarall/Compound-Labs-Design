"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { routing, type Locale } from "@/i18n/routing";

/** Troca o locale mantendo a rota, traduzindo o primeiro segmento via routing.pathnames. */
export function switchLocalePath(rawPath: string, from: Locale, to: Locale) {
  const stripped = rawPath.replace(new RegExp(`^/${from}(?=/|$)`), "") || "/";
  const [, first = "", ...rest] = stripped.split("/");
  let internal: string | null = null;
  for (const [key, val] of Object.entries(routing.pathnames)) {
    const ext = typeof val === "string" ? val : val[from];
    if (ext.replace(/^\//, "").split("/")[0] === first) { internal = key; break; }
  }
  const target = internal ? routing.pathnames[internal as keyof typeof routing.pathnames] : null;
  const toFirst = target ? (typeof target === "string" ? target : target[to]).replace(/^\//, "").split("/")[0] : first;
  const path = ["", toFirst, ...rest].join("/").replace(/\/+$/, "") || "/";
  return `/${to}${path === "/" ? "" : path}`;
}

export function LocaleSwitcher({ label }: { label: string }) {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  return (
    // Controle segmentado de 40px, com 4 de respiro interno: raio externo 8,
    // interno 4, concêntricos. É um controle, então tem borda como a busca.
    <nav aria-label={label} className="flex h-10 items-center gap-1 rounded-lg border border-border p-[3px] font-mono text-[12px]">
      {routing.locales.map((l) => (
        <Link
          key={l}
          href={switchLocalePath(pathname, locale, l)}
          hrefLang={l === "pt" ? "pt-BR" : "en"}
          aria-current={l === locale ? "true" : undefined}
          className={`inline-flex h-full items-center rounded px-2 uppercase tracking-wide transition-colors ${l === locale ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"}`}
        >
          {l === "pt" ? "PT" : "EN"}
        </Link>
      ))}
    </nav>
  );
}
