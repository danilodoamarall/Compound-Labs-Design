import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["pt", "en"],
  defaultLocale: "pt",
  localePrefix: "always",
  pathnames: {
    "/": "/",
    "/artigos": { pt: "/artigos", en: "/articles" },
    "/artigos/[slug]": { pt: "/artigos/[slug]", en: "/articles/[slug]" },
    "/artigos/[slug]/apresentar": { pt: "/artigos/[slug]/apresentar", en: "/articles/[slug]/present" },
    "/radar": "/radar",
    "/ai-tools": "/ai-tools",
    "/skills-agents": "/skills-agents",
    "/sobre": { pt: "/sobre", en: "/about" },
    "/workflow": "/workflow",
    "/docs": "/docs",
    "/faq": "/faq",
  },
});

export type Locale = (typeof routing.locales)[number];

/** Código BCP 47 completo para o atributo lang do <html>. */
export const htmlLang: Record<Locale, string> = { pt: "pt-BR", en: "en" };
