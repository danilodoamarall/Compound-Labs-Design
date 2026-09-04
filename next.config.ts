import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  reactStrictMode: true,
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
