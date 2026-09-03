import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Next.js 16: o arquivo chama-se proxy.ts e roda em Node.js.
export default createMiddleware(routing);

export const config = {
  // Ignora rotas internas, API e arquivos estáticos (qualquer caminho com extensão).
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
