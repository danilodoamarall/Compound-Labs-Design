import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("NotFound");
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-start justify-center px-6 py-24">
      <p className="eyebrow">404</p>
      <h1 className="font-display mt-3 text-4xl font-semibold">{t("title")}</h1>
      <p className="mt-3 text-muted-foreground">{t("desc")}</p>
      <Link href="/" className="mt-8 text-teal-deep underline underline-offset-4">
        {t("home")}
      </Link>
    </main>
  );
}
