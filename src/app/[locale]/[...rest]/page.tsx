import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";

/** Rota curinga: qualquer caminho desconhecido dentro de um idioma cai aqui e
 *  aciona o not-found localizado (src/app/[locale]/not-found.tsx), com cabeçalho,
 *  rodapé e no idioma da URL — em vez do 404 cru do Next, em inglês e sem saída.
 *
 *  Padrão do next-intl para 404 localizado: sem esta rota, /pt/qualquer-coisa
 *  escapa do segmento [locale] e renderiza o 404 raiz. */
export default async function CatchAll({ params }: PageProps<"/[locale]/[...rest]">) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  notFound();
}
