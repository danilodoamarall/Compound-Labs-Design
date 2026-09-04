import type { Metadata } from "next";
import Link from "next/link";
import { DOME_PATH, DOME_STOPS, DOME_BOX } from "@/lib/brand";

export const metadata: Metadata = { title: "404 · Compound Design" };

/** O 404 de todo o site. Renderiza para qualquer notFound(), com status 404 de
 *  verdade (é o que o global-not-found do Next dá), fora do layout de [locale].
 *
 *  Por isso é autossuficiente: html/body próprios, estilos embutidos, sem
 *  depender das fontes ou do CSS carregados no layout. É bilíngue porque, fora
 *  do segmento de idioma, não há locale confiável para escolher um só — e um
 *  404 honesto em duas línguas é melhor que adivinhar. */
export default function GlobalNotFound() {
  const grad = DOME_STOPS.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join("");
  const logo = `<svg viewBox="0 0 1024 1024" width="34" height="34" role="img" aria-label="Compound Design" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g404" x1="${DOME_BOX.x0}" y1="0" x2="${DOME_BOX.x1}" y2="0" gradientUnits="userSpaceOnUse">${grad}</linearGradient></defs><path d="${DOME_PATH}" fill="url(#g404)"/></svg>`;

  return (
    <html lang="pt-BR">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0A0A0A",
          color: "#EDEDED",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif",
          padding: "2rem",
        }}
      >
        <main style={{ maxWidth: 420, textAlign: "center" }}>
          <span
            style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 28 }}
            dangerouslySetInnerHTML={{
              __html:
                logo +
                `<span style="font-size:18px;font-weight:600;letter-spacing:-0.01em">Compound Design</span>`,
            }}
          />
          <p style={{ margin: "0 0 8px", fontFamily: "ui-monospace, monospace", fontSize: 13, letterSpacing: "0.08em", color: "#8a8a8a" }}>
            404
          </p>
          <h1 style={{ margin: "0 0 6px", fontSize: 26, fontWeight: 600, lineHeight: 1.2 }}>
            Página não encontrada
          </h1>
          <p style={{ margin: "0 0 4px", color: "#b5b5b5", fontSize: 15 }}>
            O endereço não existe ou mudou.
          </p>
          <p style={{ margin: "0 0 28px", color: "#8a8a8a", fontSize: 14 }}>
            Page not found — the address doesn&apos;t exist or has moved.
          </p>
          <span style={{ display: "inline-flex", gap: 20, fontSize: 15 }}>
            <Link href="/pt" style={{ color: "#5cc5b2", textDecoration: "underline", textUnderlineOffset: 4 }}>
              Voltar ao início
            </Link>
            <Link href="/en" style={{ color: "#5cc5b2", textDecoration: "underline", textUnderlineOffset: 4 }}>
              Back home
            </Link>
          </span>
        </main>
      </body>
    </html>
  );
}
