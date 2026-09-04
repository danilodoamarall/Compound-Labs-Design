import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Next.js 16: o arquivo chama-se proxy.ts e roda em Node.js.
export default createMiddleware(routing);

export const config = {
  // Ignora rotas internas, API e arquivos estáticos (qualquer caminho com extensão).
  //
  // `mcp` e `.well-known` entram na exclusão porque são endereços de máquina,
  // não de leitura: um cliente MCP pede `/mcp` e não pode ser redirecionado
  // para `/pt/mcp`. Sem isto o servidor responde o caminho em vez do protocolo.
  matcher: "/((?!api|mcp|\\.well-known|_next|_vercel|.*\\..*).*)",
};
