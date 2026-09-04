import { registry } from "@/lib/skills";

/** O cartão do servidor MCP, no caminho que os clientes procuram. */
export function GET() {
  return Response.json({
    serverInfo: { name: "AI Builders Lab Skills", version: "1.0.0" },
    description:
      "Catálogo de skills de design engineering. Mesmo registro do CLI e da página de skills.",
    url: "https://labs-hub-five.vercel.app/mcp",
    transport: { type: "streamable-http", endpoint: "https://labs-hub-five.vercel.app/mcp" },
    capabilities: { tools: true },
    tools: [
      { name: "list_skills", description: "Lista as skills do catálogo, com autor e licença." },
      { name: "get_skill", description: "Busca o markdown de uma skill por nome, slug ou pathSlug." },
    ],
    catalog: {
      updated: registry.updated,
      total: registry.counts.total,
      hosted: registry.counts.hosted,
      pointer: registry.counts.pointer,
      licenses: registry.licenses,
    },
  });
}
