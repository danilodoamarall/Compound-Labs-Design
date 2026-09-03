import { ArrowRight, Presentation } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { ArticleMeta } from "@/lib/articles";

export type ArticleIndexLabels = {
  title: string;
  dek: string;
  slides: (count: number) => string;
  minutes: (n: number) => string;
  present: string;
};

/** Sumário numerado da série, no espírito das issues do interfaces.dev: cada peça
    legível de fora, com número, tempo e quantos slides tem. */
export function ArticleIndex({ articles, labels }: { articles: ArticleMeta[]; labels: ArticleIndexLabels }) {
  return (
    <section className="mx-auto w-full max-w-5xl px-5">
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-2">
        <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">{labels.title}</h2>
        <p className="max-w-md text-[15px] text-muted-foreground">{labels.dek}</p>
      </div>

      <ol className="mt-10 border-t border-border">
        {articles.map((a) => (
          <li key={a.slug} className="border-b border-border">
            <div className="group relative grid grid-cols-[auto_1fr] items-baseline gap-x-5 gap-y-2 py-6 sm:grid-cols-[auto_1fr_auto]">
              <span className="font-mono text-[13px] text-muted-foreground tabular">
                {String(a.order).padStart(2, "0")}
              </span>

              <div className="min-w-0">
                <h3 className="font-display text-xl font-medium leading-snug sm:text-2xl">
                  <Link
                    href={{ pathname: "/artigos/[slug]", params: { slug: a.slug } }}
                    className="after:absolute after:inset-0 hover:text-teal-deep"
                  >
                    {a.title}
                  </Link>
                </h3>
                <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">{a.dek}</p>
                <p className="mt-3 flex flex-wrap items-center gap-x-4 font-mono text-[11px] uppercase tracking-wide text-muted-foreground/80">
                  <span>{labels.slides(a.slideCount)}</span>
                  <span>{labels.minutes(a.readingMinutes)}</span>
                </p>
              </div>

              <Link
                href={{ pathname: "/artigos/[slug]/apresentar", params: { slug: a.slug } }}
                className="relative z-10 col-start-2 inline-flex w-fit items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-teal/50 hover:text-foreground sm:col-start-3 sm:self-center"
              >
                <Presentation size={14} aria-hidden />
                {labels.present}
              </Link>
            </div>
          </li>
        ))}
      </ol>

      <p className="mt-6">
        <Link href="/artigos" className="inline-flex items-center gap-1.5 text-sm text-teal-deep hover:underline">
          {labels.title}
          <ArrowRight size={14} aria-hidden />
        </Link>
      </p>
    </section>
  );
}
