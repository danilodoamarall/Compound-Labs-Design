"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { LocaleSwitcher } from "./locale-switcher";
import { ThemeToggle } from "./theme-toggle";

const NAV = [
  { key: "articles", href: "/artigos" },
  { key: "radar", href: "/radar" },
  { key: "aiTools", href: "/ai-tools" },
  { key: "skillsAgents", href: "/skills-agents" },
  { key: "about", href: "/sobre" },
] as const;

export function SiteHeader() {
  const t = useTranslations();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground">
        {t("Site.skipToContent")}
      </a>
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-4 px-5">
        <Link href="/" className="flex items-baseline gap-2 font-display text-lg font-semibold tracking-tight" onClick={() => setOpen(false)}>
          <span aria-hidden className="inline-block size-2.5 translate-y-[-1px] rounded-sm bg-teal" />
          {t("Site.name")}
        </Link>
        <nav className="ml-auto hidden items-center gap-1 md:flex" aria-label="Principal">
          {NAV.map((n) => {
            const active = pathname === n.href || pathname.startsWith(`${n.href}/`);
            return (
              <Link key={n.key} href={n.href} aria-current={active ? "page" : undefined}
                className={`rounded-md px-3 py-1.5 text-sm transition-colors ${active ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                {t(`Nav.${n.key}`)}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto flex items-center gap-1 md:ml-2">
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
            {NAV.map((n) => (
              <li key={n.key}>
                <Link href={n.href} onClick={() => setOpen(false)} className="block rounded-md px-3 py-2.5 text-[15px] text-foreground hover:bg-accent">
                  {t(`Nav.${n.key}`)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
