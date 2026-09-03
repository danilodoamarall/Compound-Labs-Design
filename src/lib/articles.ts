import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";
import type { Locale } from "@/i18n/routing";

const DIR = join(process.cwd(), "content", "artigos");

export type ArticleMeta = {
  slug: string;
  locale: Locale;
  title: string;
  dek: string;
  thesis: string;
  series: string;
  order: number;
  total: number;
  date: string;
  chart: string;
  tags: string[];
  readingMinutes: number;
  slideCount: number;
  draft: boolean;
};

export type Article = ArticleMeta & { body: string };

function fileFor(slug: string, locale: Locale) {
  return join(DIR, `${slug}.${locale}.mdx`);
}

function parse(slug: string, locale: Locale): Article | null {
  const path = fileFor(slug, locale);
  if (!existsSync(path)) return null;
  const { data, content } = matter(readFileSync(path, "utf8"));
  const words = content.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  const slideCount = (content.match(/<Slide\b/g) ?? []).length;
  return {
    slug,
    locale,
    title: String(data.title ?? slug),
    dek: String(data.dek ?? ""),
    thesis: String(data.thesis ?? ""),
    series: String(data.series ?? ""),
    order: Number(data.order ?? 0),
    total: Number(data.total ?? 0),
    date: String(data.date ?? ""),
    chart: String(data.chart ?? ""),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    readingMinutes: Math.max(1, Math.round(words / 200)),
    slideCount,
    draft: Boolean(data.draft ?? false),
    body: content,
  };
}

/** Slugs únicos (um arquivo por locale, mesmo slug). */
export function listSlugs(): string[] {
  if (!existsSync(DIR)) return [];
  const slugs = new Set<string>();
  for (const f of readdirSync(DIR)) {
    const m = f.match(/^(.+)\.(pt|en)\.mdx$/);
    if (m) slugs.add(m[1]);
  }
  return [...slugs];
}

export function listArticles(locale: Locale): ArticleMeta[] {
  return listSlugs()
    .map((slug) => parse(slug, locale) ?? parse(slug, "pt"))
    .filter((a): a is Article => a !== null)
    .sort((a, b) => a.order - b.order)
    .map(({ body: _body, ...meta }) => meta);
}

export function getArticle(slug: string, locale: Locale): Article | null {
  return parse(slug, locale) ?? parse(slug, "pt");
}

export function neighbors(slug: string, locale: Locale) {
  const all = listArticles(locale);
  const i = all.findIndex((a) => a.slug === slug);
  return { previous: i > 0 ? all[i - 1] : null, next: i >= 0 && i < all.length - 1 ? all[i + 1] : null, all };
}
