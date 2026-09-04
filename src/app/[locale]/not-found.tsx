import { getLocale, getTranslations } from "next-intl/server";

/** O 404 localizado, acionado pela rota curinga /[locale]/[...rest].
 *
 *  É componente de servidor (getLocale + getTranslations) em vez de cliente:
 *  uma página de erro renderizada como boundary nem sempre tem o provedor de
 *  mensagens do cliente hidratado, e aí o next-intl caía no 404 cru do Next.
 *  No servidor, o locale vem do contexto da requisição e o texto sai certo. */
export default async function NotFound() {
  const locale = await getLocale();
  const t = await getTranslations("NotFound");
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-start justify-center px-6 py-24">
      <p className="eyebrow">404</p>
      <h1 className="font-display mt-3 text-4xl font-semibold">{t("title")}</h1>
      <p className="mt-3 text-muted-foreground">{t("desc")}</p>
      <a href={`/${locale}`} className="mt-8 text-teal-deep underline underline-offset-4">
        {t("home")}
      </a>
    </main>
  );
}
