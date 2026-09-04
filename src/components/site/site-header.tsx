"use client";

import { useMemo, type ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { MegaNav, type MegaGroup } from "./mega-nav";
import { LabsMark } from "./logo";
import { LocaleSwitcher } from "./locale-switcher";
import { ThemeToggle } from "./theme-toggle";

/** Os nove destinos em três grupos.
 *
 *  Eram sete nomes de seção lado a lado e a barra ficava larga. Agora são três
 *  gatilhos que abrem um painel, e couberam Research e Sobre, que não cabiam na
 *  linha. As chaves batem com as de `Nav` e `Home.sections` nos idiomas. */
const GRUPOS = [
  { key: "content", itens: ["articles", "radar", "research"] },
  { key: "tools", itens: ["aiTools", "skillsAgents", "workflow"] },
  { key: "hub", itens: ["docs", "faq", "about"] },
] as const;

/** Caminho por chave. Fica aqui e não em `sections` porque o menu inclui duas
 *  rotas que não são seções do hub: a pesquisa e a página Sobre. */
const HREF: Record<string, { pt: string; en: string }> = {
  articles: { pt: "/artigos", en: "/articles" },
  radar: { pt: "/radar", en: "/radar" },
  research: { pt: "/research", en: "/research" },
  aiTools: { pt: "/ai-tools", en: "/ai-tools" },
  skillsAgents: { pt: "/skills-agents", en: "/skills-agents" },
  workflow: { pt: "/workflow", en: "/workflow" },
  docs: { pt: "/docs", en: "/docs" },
  faq: { pt: "/faq", en: "/faq" },
  about: { pt: "/sobre", en: "/about" },
};

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
      GRUPOS.map((g) => ({
        key: g.key,
        label: t(`Nav.groups.${g.key}` as "Nav.groups.content"),
        links: g.itens.map((key) => ({
          key,
          label: t(`Nav.${key}` as "Nav.articles"),
          desc: t(`Home.sections.${key}.short` as "Home.sections.articles.short"),
          href: `/${locale}${HREF[key][locale]}`,
        })),
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- o `t` do next-intl
    // é recriado a cada render e invalidaria o memo sempre.
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
          href: `/${locale}${HREF.articles[locale]}/${spotlight.slug}`,
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
