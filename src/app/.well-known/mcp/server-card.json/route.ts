import { LIMITE_MAXIMO, LIMITE_PADRAO, registry } from "@/lib/skills";
import { CLI_PACKAGE, MCP_URL, SITE_URL } from "@/lib/site-url";

/** O cartão do servidor MCP, no caminho que os clientes procuram.
 *
 *  O endereço vem de `@/lib/site-url`, que prefere a URL de produção da Vercel
 *  à do deploy atual. Um preview não deve se anunciar como endereço canônico do
 *  servidor: quem salvasse o cartão ficaria apontado para uma URL efêmera. */
export function GET() {
  return Response.json(
    {
      serverInfo: { name: "Compound Design Skills", version: "1.1.0" },
      description:
        "Catálogo de skills de design engineering. Mesmo registro do CLI e da página de skills.",
      url: MCP_URL,
      transport: { type: "streamable-http", endpoint: MCP_URL },
      capabilities: { tools: true },
      tools: [
        {
          name: "list_topics",
          description: "Os tópicos do catálogo, com a contagem de cada um. Use antes de listar.",
        },
        {
          name: "list_skills",
          description: `Lista as skills, em páginas de ${LIMITE_PADRAO} (máximo ${LIMITE_MAXIMO}), com autor e licença.`,
        },
        {
          name: "get_skill",
          description: 'Busca o markdown de uma skill. Use name: "start" para a skill de roteamento.',
        },
      ],
      catalog: {
        updated: registry.updated,
        total: registry.counts.total,
        hosted: registry.counts.hosted,
        pointer: registry.counts.pointer,
        licenses: registry.licenses,
        topics: registry.topics.length,
      },
      /*  A regra de procedência faz parte do contrato, não é rodapé: quem
       *  consome precisa saber que parte do catálogo não vem com o texto. */
      provenance: {
        rule: "Skills sob licença permissiva são servidas com autor, licença e commit. As demais devolvem a ficha e o endereço da origem.",
        attribution: `${SITE_URL}/pt/skills-agents`,
      },
      cli: { package: CLI_PACKAGE, docs: `${SITE_URL}/pt/skills-agents/cli` },
    },
    { headers: { "cache-control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400" } }
  );
}
