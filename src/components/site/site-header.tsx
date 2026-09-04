"use client";

import { useMemo, type ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import CardNav, { type CardNavItem } from "@/components/reactbits/CardNav";
import { LabsMark } from "./logo";
import { LocaleSwitcher } from "./locale-switcher";
import { ThemeToggle } from "./theme-toggle";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

/** Os nove destinos agrupados em três cartões.
 *
 *  Antes eram sete nomes de seção lado a lado e a barra ficava larga demais.
 *  O `CardNav` só aceita três cartões, o que aqui vira restrição útil: obriga a
 *  agrupar em vez de listar, e ainda coube o que não cabia antes, Research e
 *  Sobre. As chaves batem com as de `Nav` nos arquivos de idioma, e os caminhos
 *  traduzidos vêm de `src/i18n/routing.ts` pelo `Link` tipado. */
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

/** Fundos dos três cartões. A primeira escolha ficou quase igual à cor da
 *  barra e os cartões sumiam: precisam de degrau visível contra #111111. */
const FUNDOS = ["#221f1d", "#1a2422", "#182029"];

export function SiteHeader({ githubSlot, searchSlot }: { githubSlot?: ReactNode; searchSlot?: ReactNode }) {
  const t = useTranslations();
  const pathname = usePathname();
  const locale = useLocale() as "pt" | "en";
  const reduced = usePrefersReducedMotion();
  // A home é um palco preto nos dois temas; o cabeçalho se sobrepõe a ele em
  // vez de trazer a própria superfície, senão fica uma emenda clara no topo.
  const overStage = pathname === "/";

  // O efeito do CardNav tem `items` na lista de dependências e mata a linha do
  // tempo do gsap quando ela muda. Um array novo a cada render matava a
  // animação no instante em que o menu abria, porque abrir muda o estado e
  // dispara outro render. Memoizar é o que faz o componente funcionar.
  const items: CardNavItem[] = useMemo(() => GRUPOS.map((g, i) => ({
    label: t(`Nav.groups.${g.key}` as "Nav.groups.content"),
    bgColor: FUNDOS[i],
    textColor: "#EDEDED",
    links: g.itens.map((key) => ({
      label: t(`Nav.${key}` as "Nav.articles"),
      href: `/${locale}${HREF[key][locale]}`,
      ariaLabel: t(`Nav.${key}` as "Nav.articles"),
    })),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- o `t` do
    // next-intl é recriado a cada render; incluí-lo invalidaria o memo sempre,
    // que é exatamente o que matava a animação do menu.
  })), [locale]);

  return (
    <header
      data-over-stage={overStage ? "" : undefined}
      className={
        overStage
          ? "dark sticky top-0 z-40 bg-[#0A0A0A]/80 text-[#EDEDED] backdrop-blur-xl"
          : "sticky top-0 z-40 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/65"
      }
    >
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
      >
        {t("Site.skipToContent")}
      </a>

      <div className="mx-auto w-full max-w-6xl px-4 py-2 sm:px-5">
        <CardNav
          items={items}
          openLabel={t("Nav.openMenu")}
          closeLabel={t("Nav.closeMenu")}
          baseColor={overStage ? "#111111" : "var(--card)"}
          menuColor={overStage ? "#EDEDED" : "var(--foreground)"}
          // Sem movimento pedido, a abertura é instantânea em vez de animada.
          ease={reduced ? "none" : "power3.out"}
          className="relative w-full"
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
          cta={
            <div className="flex items-center gap-1.5 pr-1">
              {searchSlot}
              {githubSlot}
              <LocaleSwitcher label={t("Site.language")} />
              <ThemeToggle label={t("Site.toggleTheme")} />
            </div>
          }
        />
      </div>
    </header>
  );
}
