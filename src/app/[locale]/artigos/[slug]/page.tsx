import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { getArticle, listSlugs } from "@/lib/articles";
import { ArticleView } from "@/components/deck/ArticleView";

export function generateStaticParams() {
  return listSlugs().flatMap((slug) => routing.locales.map((locale) => ({ locale, slug })));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/artigos/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const a = getArticle(slug, locale as Locale);
  return a ? { title: a.title, description: a.dek } : {};
}

export default async function ArticlePage({ params }: PageProps<"/[locale]/artigos/[slug]">) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  return <ArticleView slug={slug} locale={locale as Locale} mode="read" />;
}
