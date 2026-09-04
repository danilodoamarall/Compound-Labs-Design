/** O endereço público do hub, num lugar só.
 *
 *  Antes estava escrito à mão no servidor MCP, no cartão do servidor, nas rotas
 *  de API, na página do MCP, no CLI e no package.json. Trocar o domínio
 *  significava caçar cada ocorrência, e o CLI publicado no npm carrega a sua
 *  cópia congelada de qualquer jeito.
 *
 *  A ordem de precedência é deliberada:
 *
 *  1. `NEXT_PUBLIC_SITE_URL`, quando alguém hospeda isto em outro domínio.
 *  2. `VERCEL_PROJECT_PRODUCTION_URL`, que a Vercel injeta e aponta sempre para
 *     produção, mesmo dentro de um deploy de pré-visualização. É o que queremos
 *     no cartão do MCP: um preview não deve anunciar a si mesmo como endereço
 *     canônico do servidor.
 *  3. O domínio de produção, para o `next build` local, que não tem nenhuma
 *     das duas. */
export const SITE_URL = (() => {
  const explicito = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicito) return explicito.replace(/\/+$/, "");

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercel) return `https://${vercel.replace(/^https?:\/\//, "").replace(/\/+$/, "")}`;

  return "https://compounddesign.vercel.app";
})();

export const MCP_URL = `${SITE_URL}/mcp`;
export const SERVER_CARD_URL = `${SITE_URL}/.well-known/mcp/server-card.json`;

/** O nome do pacote no npm. Aparece em toda instrução de instalação, na página
 *  do CLI e na do MCP, e precisa ser o mesmo em todas. */
export const CLI_PACKAGE = "@compound-design/skills";
export const CLI_BIN = "ai-skills";
