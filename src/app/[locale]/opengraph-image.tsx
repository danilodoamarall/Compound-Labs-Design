import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { DOME_BOX, DOME_PATH, DOME_STOPS } from "@/lib/brand";
import { SITE_URL } from "@/lib/site-url";

/** A prévia do link, para quando alguém cola o endereço no Slack, no Teams ou
 *  no LinkedIn. É a primeira vez que muita gente vê a marca, então ela diz as
 *  três coisas na ordem: o nome, o que é (framework AI native) e a tese.
 *
 *  A marca é o mesmo domo de src/lib/brand.ts, sem o granulado: o filtro de
 *  ruído não existe no rasterizador que gera esta imagem. */
export const alt = "Compound Design";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  // O layout não envolve esta rota, então a guarda de idioma é daqui: sem ela,
  // /xx/opengraph-image derrubava a função em vez de responder 404.
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({ locale, namespace: "Site" });
  const dominio = SITE_URL.replace(/^https?:\/\//, "");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background:
            "radial-gradient(90% 80% at 15% 10%, rgba(11,138,116,0.35), rgba(10,10,10,0) 60%), radial-gradient(70% 70% at 95% 100%, rgba(201,87,28,0.22), rgba(10,10,10,0) 60%), #0A0A0A",
          color: "#FAFAFA",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <svg viewBox="0 0 1024 1024" width={112} height={112}>
            <defs>
              <linearGradient id="mat" gradientUnits="userSpaceOnUse" x1={DOME_BOX.x0} y1={430} x2={DOME_BOX.x1} y2={560}>
                {DOME_STOPS.map(([offset, color]) => (
                  <stop key={offset} offset={offset} stopColor={color} />
                ))}
              </linearGradient>
              <radialGradient id="luz" gradientUnits="userSpaceOnUse" cx={430} cy={350} r={255}>
                <stop offset="0" stopColor="#fffdf6" stopOpacity="0.5" />
                <stop offset="1" stopColor="#fffdf6" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="fundo" gradientUnits="userSpaceOnUse" cx={512} cy={785} r={300}>
                <stop offset="0" stopColor="#4b3f5e" stopOpacity="0.34" />
                <stop offset="1" stopColor="#4b3f5e" stopOpacity="0" />
              </radialGradient>
              <clipPath id="domo">
                <path d={DOME_PATH} />
              </clipPath>
            </defs>
            <g clipPath="url(#domo)">
              <rect width="1024" height="1024" fill="url(#mat)" />
              <rect width="1024" height="1024" fill="url(#fundo)" />
              <rect width="1024" height="1024" fill="url(#luz)" />
            </g>
          </svg>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 64, fontWeight: 600, letterSpacing: -2, lineHeight: 1.05 }}>{t("name")}</div>
            <div style={{ marginTop: 10, fontSize: 22, letterSpacing: 4, textTransform: "uppercase", color: "#4ec2a6" }}>
              {t("kind")}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 34, lineHeight: 1.3, color: "#EDEDED", maxWidth: 900, letterSpacing: -0.5 }}>
          {t("tagline")}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", fontSize: 22, color: "#A1A1A1" }}>
          <div style={{ display: "flex" }}>
            {t("author")} · {t("authorRole")}
          </div>
          <div style={{ display: "flex", color: "#888888" }}>{dominio}</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
