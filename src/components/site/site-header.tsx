"use client";

import { useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { sections } from "@/lib/site";
import { LabsMark } from "./logo";
import { LocaleSwitcher } from "./locale-switcher";
import { ThemeToggle } from "./theme-toggle";

const NAV = sections.filter((s) => s.inNav);

export function SiteHeader({ githubSlot, searchSlot }: { githubSlot?: ReactNode; searchSlot?: ReactNode }) {
  const t = useTranslations();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  // A home e um palco preto nos dois temas; o cabecalho se sobrepoe a ele em
  // vez de trazer a propria superficie, senao fica uma emenda clara no topo.
  const overStage = pathname === "/";

  return (
    <header
      data-over-stage={overStage ? "" : undefined}
      className={
        overStage
          ? "dark sticky top-0 z-40 border-b border-white/[0.06] bg-[#0A0A0A]/80 text-[#EDEDED] backdrop-blur-xl"
          : "sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/65"
      }
    >
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground">
        {t("Site.skipToContent")}
      </a>
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-3 px-5">
        <Link href="/" className="flex shrink-0 items-center gap-2 font-display text-[17px] font-semibold tracking-tight" onClick={() => setOpen(false)}>
          <LabsMark size={22} idPrefix="hdr" />
          {/* Abaixo de 420px a marca sozinha carrega a identidade: o nome inteiro
              mais o bloco da direita não cabem na mesma linha num telefone. */}
          <span className="max-[419px]:sr-only">{t("Site.name")}</span>
        </Link>

        <nav className="ml-auto hidden items-center md:flex" aria-label="Principal">
          {NAV.map((s) => {
            const active = pathname === s.href || pathname.startsWith(`${s.href}/`);
            return (
              <Link key={s.key} href={s.href} aria-current={active ? "page" : undefined}
                className={`rounded-md px-2.5 py-1.5 text-[13.5px] transition-colors ${active ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                {t(`Nav.${s.key}` as "Nav.articles")}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-1.5 md:ml-3">
          {searchSlot}
          {githubSlot}
          <LocaleSwitcher label={t("Site.language")} />
          <ThemeToggle label={t("Site.toggleTheme")} />
          <button type="button" className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground md:hidden" aria-expanded={open} aria-label="Menu" onClick={() => setOpen((v) => !v)}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open ? (
        <nav className="border-t border-border bg-background px-5 py-3 md:hidden" aria-label="Principal">
          <ul className="flex flex-col">
            {NAV.map((s) => (
              <li key={s.key}>
                <Link href={s.href} onClick={() => setOpen(false)} className="block rounded-md px-3 py-2.5 text-[15px] text-foreground hover:bg-accent">
                  {t(`Nav.${s.key}` as "Nav.articles")}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
