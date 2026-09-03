import type { Metadata } from "next";
import { Newsreader, IBM_Plex_Sans, IBM_Plex_Mono, Geist } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, htmlLang, type Locale } from "@/i18n/routing";
import { ThemeProvider } from "@/components/site/theme-provider";
import { SiteHeader } from "@/components/site/site-header";
import { GithubStar } from "@/components/site/github-star";
import { SiteSearch } from "@/components/site/site-search";
import { buildSearchIndex } from "@/lib/search";
import { sections } from "@/lib/site";
import { SiteFooter } from "@/components/site/site-footer";
import "../globals.css";

const serif = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-serif",
  display: "swap",
});

const sans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

/** Fonte do palco da home. A referência que reconstruímos usa Geist, e a -2px
    de tracking a diferença para a IBM Plex Sans aparece no desenho das letras.
    Fica escopada ao palco, sem trocar a tipografia do resto do hub. */
const stage = Geist({
  subsets: ["latin"],
  // Sem lista de pesos: carrega o eixo variável, porque a escala que seguimos
  // usa 575, um peso que não existe numa lista fixa.
  variable: "--font-stage",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Omit<LayoutProps<"/[locale]">, "children">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Site" });
  return {
    title: { default: t("name"), template: `%s · ${t("name")}` },
    description: t("tagline"),
    authors: [{ name: t("author") }],
    creator: t("author"),
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Site" });
  const tn = await getTranslations({ locale, namespace: "Nav" });
  const th = await getTranslations({ locale, namespace: "Home" });
  const tq = await getTranslations({ locale, namespace: "Search" });

  // O índice da busca sai das mesmas fontes do menu e do rodapé, montado aqui
  // no servidor para não mandar o conteúdo bruto ao cliente duas vezes.
  const searchItems = buildSearchIndex(locale as Locale, {
    sections: tq("groupSections"),
    groups: {},
    navNames: Object.fromEntries(sections.map((s) => [s.key, tn(s.key as "articles")])),
    sectionDeks: Object.fromEntries(
      sections.map((s) => [s.key, th(`sections.${s.key}.short` as "sections.articles.short")])
    ),
  });

  const searchLabels = {
    trigger: tq("trigger"), placeholder: tq("placeholder"), empty: tq("empty"),
    noQuery: tq("noQuery"), results: tq("results"), resultsOne: tq("resultsOne"),
    a11yTitle: tq("a11yTitle"),
    a11yDescription: tq("a11yDescription"), close: tq("close"),
  };

  return (
    <html
      lang={htmlLang[locale as Locale]}
      className={`${serif.variable} ${sans.variable} ${mono.variable} ${stage.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <NextIntlClientProvider>
            <SiteHeader
              searchSlot={<SiteSearch items={searchItems} labels={searchLabels} />}
              githubSlot={<GithubStar label={t("github")} />}
            />
            <div id="conteudo" className="flex flex-1 flex-col">{children}</div>
            <SiteFooter />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
