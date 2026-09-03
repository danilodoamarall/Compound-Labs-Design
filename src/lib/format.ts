import type { Locale } from "@/i18n/routing";

export const intlLocale = (locale: Locale) => (locale === "pt" ? "pt-BR" : "en-US");

export function fmtNum(value: number, locale: Locale, digits = 0) {
  return new Intl.NumberFormat(intlLocale(locale), {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

export function fmtPct(value: number, locale: Locale, digits = 1) {
  return `${fmtNum(value, locale, digits)}%`;
}

export function fmtSigned(value: number, locale: Locale, digits = 1) {
  const sign = value > 0 ? "+" : value < 0 ? "−" : "";
  return `${sign}${fmtNum(Math.abs(value), locale, digits)}`;
}

export function fmtDate(iso: string, locale: Locale) {
  return new Intl.DateTimeFormat(intlLocale(locale), { dateStyle: "long", timeZone: "UTC" }).format(new Date(iso));
}
