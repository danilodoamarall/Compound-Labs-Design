import { getLocale, getTranslations } from "next-intl/server";
import { NAV_GROUPS, authorLinkedIn, navPath } from "@/lib/site";
import type { Locale } from "@/i18n/routing";
import { LabsMark } from "./logo";

/** O rodapé. Lista os mesmos destinos do menu, da mesma fonte, para nunca
 *  divergirem: antes cada um tinha a própria lista escrita à mão. */
export async function SiteFooter() {
  const t = await getTranslations();
  const locale = (await getLocale()) as Locale;

  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="flex items-center gap-2 font-display text-xl font-semibold">
            <LabsMark size={24} idPrefix="ftr" />
            {t("Site.name")}
          </p>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">{t("Site.tagline")}</p>
          <p className="mt-4 text-sm">
            <span className="text-muted-foreground">{t("Site.madeBy")} </span>
            <a
              href={authorLinkedIn}
              target="_blank"
              rel="noreferrer me"
              aria-label={t("Site.linkedin")}
              className="font-medium underline decoration-border underline-offset-4 transition-colors hover:text-teal-deep hover:decoration-teal-deep"
            >
              {t("Site.author")}
            </a>
            <span className="text-muted-foreground"> · {t("Site.authorRole")}</span>
          </p>
        </div>

        {/* O rótulo era "Seções" fixo em português, lido por leitor de tela
            também na versão em inglês. */}
        <nav aria-label={t("Nav.menuLabel")} className="text-sm">
          <ul className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-1">
            {NAV_GROUPS.flatMap((g) => g.itens).map((key) => (
              <li key={key}>
                {/* <a> e não <Link>: navPath já traz o prefixo de idioma, e o
                    Link tipado do next-intl adicionaria outro por cima. */}
                <a
                  href={navPath(key, locale)}
                  className="inline-flex min-h-6 items-center text-muted-foreground transition-colors hover:text-foreground"
                >
                  {t(`Nav.${key}` as "Nav.articles")}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-2 font-mono text-xs text-muted-foreground">
          <p>{t("Footer.rights")}</p>
          <p>{t("Footer.source")}</p>
          <p>{t("Footer.builtWith")}</p>
        </div>
      </div>
    </footer>
  );
}
