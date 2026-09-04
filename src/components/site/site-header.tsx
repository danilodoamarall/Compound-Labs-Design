"use client";

import { useMemo, type ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { NAV_GROUPS, NAV_HREF, navPath } from "@/lib/site";
import { MegaNav, type MegaGroup } from "./mega-nav";
import { LabsMark } from "./logo";
import { LocaleSwitcher } from "./locale-switcher";
import { ThemeToggle } from "./theme-toggle";

/** O cabeçalho. Os grupos e os caminhos vêm de `src/lib/site.ts`, a mesma fonte
 *  do rodapé e da checagem de contagens; antes cada um tinha a própria lista e
 *  as três precisavam concordar à mão. */
export function SiteHeader({
  githubSlot,
  searchSlot,
  spotlight,
}: {
  githubSlot?: ReactNode;
  searchSlot?: ReactNode;
  /** O artigo em destaque no painel, montado no servidor. */
  spotlight: { title: string; desc: string; slug: string; badge: string };
}) {
  const t = useTranslations();
  const pathname = usePathname();
  const locale = useLocale() as "pt" | "en";
  // A home é um palco preto nos dois temas; o cabeçalho se sobrepõe a ele em
  // vez de trazer a própria superfície, senão fica uma emenda clara no topo.
  const overStage = pathname === "/";

  const groups: MegaGroup[] = useMemo(
    () =>
      NAV_GROUPS.map((g) => ({
        key: g.key,
        label: t(`Nav.groups.${g.key}` as "Nav.groups.content"),
        links: g.itens.map((key) => ({
          key,
          label: t(`Nav.${key}` as "Nav.articles"),
          desc: t(`Home.sections.${key}.short` as "Home.sections.articles.short"),
          href: navPath(key, locale),
        })),
      })),
    // O `t` do next-intl é recriado a cada render, então incluí-lo invalidaria
    // o memo sempre. A dependência real é o idioma, e é ele que está aqui.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [locale]
  );

  return (
    <header
      data-over-stage={overStage ? "" : undefined}
      className={
        overStage
          ? "dark sticky top-0 z-40 bg-[#0A0A0A]/80 text-[#EDEDED] backdrop-blur-xl"
          : "sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/65"
      }
    >
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
      >
        {t("Site.skipToContent")}
      </a>

      <MegaNav
        groups={groups}
        dark={overStage}
        labels={{ open: t("Nav.openMenu"), close: t("Nav.closeMenu"), nav: t("Nav.menuLabel") }}
        spotlight={{
          eyebrow: t("Nav.spotlightEyebrow"),
          title: spotlight.title,
          desc: spotlight.desc,
          badge: spotlight.badge,
          cta: t("Nav.spotlightCta"),
          href: `/${locale}${NAV_HREF.articles[locale]}/${spotlight.slug}`,
          cover: ["#0b8a74", "#0d3b3a"],
        }}
        logo={
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2 font-display text-[17px] font-semibold tracking-tight"
          >
            <LabsMark size={22} idPrefix="hdr" />
            {/* Abaixo de 420px a marca sozinha carrega a identidade: o nome
                inteiro mais o bloco da direita não cabem num telefone. */}
            <span className="max-[419px]:sr-only">{t("Site.name")}</span>
          </Link>
        }
        actions={
          <>
            {searchSlot}
            {githubSlot}
            <LocaleSwitcher label={t("Site.language")} />
            <ThemeToggle label={t("Site.toggleTheme")} />
          </>
        }
      />
    </header>
  );
}
