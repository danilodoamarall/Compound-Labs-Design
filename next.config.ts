import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Habilita app/global-not-found.tsx: um 404 com marca e status 404 correto
  // para toda chamada de notFound(). Sem ele, o Next cai no 404 cru, em inglês
  // e sem layout, porque o projeto não tem um layout raiz fora de [locale].
  experimental: { globalNotFound: true },
  // As 207 skills são lidas do disco em tempo de pedido pelas rotas de API e
  // pelo MCP. Sem declarar aqui, o tracing não empacota os arquivos com a
  // função e a leitura falha em produção, sem falhar no build.
  outputFileTracingIncludes: {
    "/api/skills": ["./content/skills/**"],
    "/api/skills/[path]": ["./content/skills/**"],
    "/mcp": ["./content/skills/**"],
  },
};

export default withNextIntl(nextConfig);
