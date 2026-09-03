import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function SiteFooter() {
  const t = await getTranslations();
  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-display text-xl font-semibold">{t("Site.name")}</p>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">{t("Site.tagline")}</p>
          <p className="mt-4 text-sm">
            <span className="text-muted-foreground">{t("Site.madeBy")} </span>
            <span className="font-medium">{t("Site.author")}</span>
            <span className="text-muted-foreground"> · {t("Site.authorRole")}</span>
          </p>
        </div>
        <nav aria-label="Seções" className="text-sm">
          <ul className="space-y-2">
            <li><Link href="/artigos" className="text-muted-foreground hover:text-foreground">{t("Nav.articles")}</Link></li>
            <li><Link href="/radar" className="text-muted-foreground hover:text-foreground">{t("Nav.radar")}</Link></li>
            <li><Link href="/ai-tools" className="text-muted-foreground hover:text-foreground">{t("Nav.aiTools")}</Link></li>
            <li><Link href="/skills-agents" className="text-muted-foreground hover:text-foreground">{t("Nav.skillsAgents")}</Link></li>
            <li><Link href="/docs" className="text-muted-foreground hover:text-foreground">{t("Nav.docs")}</Link></li>
            <li><Link href="/faq" className="text-muted-foreground hover:text-foreground">{t("Nav.faq")}</Link></li>
            <li><Link href="/sobre" className="text-muted-foreground hover:text-foreground">{t("Nav.about")}</Link></li>
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
