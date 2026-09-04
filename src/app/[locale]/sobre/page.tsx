import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowUpRight } from "lucide-react";
import { authorLinkedIn } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/[locale]/sobre">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "About" });
  return { title: t("title"), description: t("dek") };
}

export default async function AboutPage({ params }: PageProps<"/[locale]/sobre">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("About");
  const ts = await getTranslations("Site");

  const blocks = [
    ["purposeTitle", "purpose"],
    // A filosofia vem antes da biografia: é a tese do produto, e explica o nome.
    ["philosophyTitle", "philosophy"],
    ["authorTitle", "authorBio"],
    ["howTitle", "how"],
    ["licenseTitle", "license"],
  ] as const;

  return (
    <main className="mx-auto w-full max-w-4xl px-6 pb-16 pt-14">
      <p className="eyebrow">{t("title")}</p>
      <h1 className="font-display mt-3 text-4xl font-semibold sm:text-5xl">{t("title")}</h1>
      <p className="measure mt-5 text-lg text-muted-foreground">{t("dek")}</p>

      <div className="mt-12 grid gap-10 md:grid-cols-[220px_1fr]">
        <aside className="md:sticky md:top-20 md:self-start">
          <div className="rounded-lg border border-border bg-card p-5">
            <p className="font-display text-2xl font-semibold leading-tight">{ts("author")}</p>
            <p className="mt-1 text-sm text-muted-foreground">{ts("authorRole")}</p>
            {/* O crédito leva a quem faz: o nome sozinho não leva a lugar nenhum. */}
            <a
              href={authorLinkedIn}
              target="_blank"
              rel="noreferrer me"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-teal transition-colors hover:text-teal-deep"
            >
              LinkedIn
              <ArrowUpRight size={14} aria-hidden />
            </a>
          </div>
        </aside>
        <div className="space-y-10">
          {blocks.map(([h, p]) => (
            <section key={h}>
              <h2 className="font-display text-2xl font-medium">{t(h)}</h2>
              <p className="measure mt-3 leading-relaxed text-muted-foreground">{t(p)}</p>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
