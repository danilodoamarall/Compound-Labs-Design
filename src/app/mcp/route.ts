import { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import { attribution, findSkill, readSkillBody, registry, searchSkills } from "@/lib/skills";

/** O servidor MCP do catálogo de skills.
 *
 *  Duas ferramentas, como no ui-skills, com duas diferenças de propósito:
 *
 *  1. `list_skills` devolve a licença e o autor de cada item. O deles remove a
 *     procedência da resposta, então o agente recebe texto sem saber de quem é.
 *  2. `get_skill` só entrega markdown do que temos licença para redistribuir.
 *     Para o resto devolve a ficha e o endereço da origem.
 */
const handler = createMcpHandler(
  (server) => {
    server.registerTool(
      "list_skills",
      {
        description:
          "Lista as skills do catálogo do AI Builders Lab. Filtra por texto livre e por tópico. Cada item traz autor e licença.",
        inputSchema: {
          query: z
            .string()
            .optional()
            .describe("Filtro sobre pathSlug, nome, descrição e tópicos. Termos em qualquer ordem."),
          topic: z
            .string()
            .optional()
            .describe("Um tópico do catálogo, como motion, accessibility ou frontend."),
        },
      },
      async ({ query, topic }) => {
        const achados = searchSkills({ query, topic });
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(
                {
                  source: "https://labs-hub-five.vercel.app",
                  updated: registry.updated,
                  count: achados.length,
                  skills: achados.map((s) => ({
                    name: s.name,
                    pathSlug: s.pathSlug,
                    description: s.description,
                    topics: s.topics,
                    // A procedência viaja com a resposta.
                    author: s.source.author,
                    license: s.source.license,
                    sourceUrl: s.source.url,
                    hosted: s.hosted,
                  })),
                },
                null,
                2
              ),
            },
          ],
        };
      }
    );

    server.registerTool(
      "get_skill",
      {
        description:
          "Busca o markdown de uma skill por nome, slug ou pathSlug. Devolve a atribuição junto com o conteúdo.",
        inputSchema: {
          name: z
            .string()
            .describe('Nome, slug ou pathSlug. Por exemplo "animate" ou "emilkowalski/animate".'),
        },
      },
      async ({ name }) => {
        const achado = findSkill(name);

        if (!achado) {
          return {
            isError: true,
            content: [
              {
                type: "text" as const,
                text: `Skill "${name}" não existe no catálogo. Use list_skills para ver o que há.`,
              },
            ],
          };
        }

        if ("ambiguous" in achado) {
          return {
            isError: true,
            content: [
              {
                type: "text" as const,
                text: `"${name}" existe em mais de um autor. Escolha um destes:\n${achado.ambiguous
                  .map((s) => `  ${s.pathSlug}`)
                  .join("\n")}`,
              },
            ],
          };
        }

        const { skill } = achado;
        const corpo = readSkillBody(skill);

        if (!corpo) {
          return {
            content: [
              {
                type: "text" as const,
                text: [
                  `# ${skill.name}`,
                  "",
                  skill.description,
                  "",
                  "Esta skill não está hospedada no catálogo: o repositório de origem não",
                  "declara licença, então o conteúdo é do autor e só ele pode redistribuir.",
                  "",
                  `Leia na origem: ${skill.readAt ?? skill.source.url}`,
                ].join("\n"),
              },
            ],
          };
        }

        return {
          content: [
            { type: "text" as const, text: corpo },
            { type: "text" as const, text: `\n---\n${attribution(skill)}` },
          ],
        };
      }
    );
  },
  {
    serverInfo: { name: "AI Builders Lab Skills", version: "1.0.0" },
    instructions:
      "Catálogo de skills de design engineering. Use list_skills para descobrir e get_skill para ler. Cada resposta traz autor e licença.",
  }
);

// O catálogo é leitura de arquivo local, então 30s sobra.
export const maxDuration = 30;

export { handler as GET, handler as POST };
