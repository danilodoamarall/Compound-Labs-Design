import { LIMITE_PADRAO, pageSkills, registry } from "@/lib/skills";
import { SITE_URL } from "@/lib/site-url";

/** O registro do catálogo, em JSON.
 *
 *  Duas diferenças em relação ao registro do ui-skills:
 *
 *  1. Cada entrada carrega a licença e diz se o conteúdo está hospedado aqui.
 *     Sem isso não dá para saber o que pode ser reusado.
 *  2. Vem paginado. A resposta completa dava 157 KB, e o principal consumidor
 *     desta rota é um agente com contexto finito. Quem quiser tudo pede tudo,
 *     com `limit`, mas o padrão não despeja o catálogo inteiro.
 *
 *  Parâmetros: `query`, `topic`, `limit`, `offset`, `full=1` para a descrição
 *  sem corte. */
export function GET(request: Request) {
  const url = new URL(request.url);
  const numero = (nome: string) => {
    const bruto = url.searchParams.get(nome);
    if (bruto === null) return undefined;
    const n = Number.parseInt(bruto, 10);
    return Number.isFinite(n) ? n : undefined;
  };

  const pagina = pageSkills({
    query: url.searchParams.get("query") ?? undefined,
    topic: url.searchParams.get("topic") ?? undefined,
    limit: numero("limit"),
    offset: numero("offset"),
    full: url.searchParams.get("full") === "1",
  });

  return Response.json(
    {
      source: SITE_URL,
      updated: registry.updated,
      counts: registry.counts,
      licenses: registry.licenses,
      topics: registry.topics,
      defaultLimit: LIMITE_PADRAO,
      ...pagina,
    },
    {
      headers: {
        "cache-control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
      },
    }
  );
}
