import { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import {
  LIMITE_MAXIMO,
  LIMITE_PADRAO,
  attribution,
  findSkill,
  pageSkills,
  readSkillBody,
  registry,
} from "@/lib/skills";
import { routingSkill } from "@/lib/routing-skill";
import { SITE_URL } from "@/lib/site-url";
import { clientIp, rateLimited } from "@/lib/rate-limit";

/** O servidor MCP do catálogo de skills.
 *
 *  Três ferramentas. Duas vêm do ui-skills; a terceira existe porque a primeira
 *  precisa dela para ser usável.
 *
 *  A diferença de propósito em relação ao deles é a procedência: cada resposta
 *  carrega autor e licença, e `get_skill` só entrega markdown do que temos
 *  licença para redistribuir. Para o resto devolve a ficha e o endereço.
 *
 *  A diferença de forma é a paginação. Listar as 269 de uma vez dá 157 KB de
 *  JSON, cerca de 40 mil tokens, no contexto de um agente que só queria saber
 *  o que existe. A listagem vem em página, diz quanto ficou de fora, e a
 *  ferramenta de tópicos existe para que dê para filtrar antes de pedir.
 */
const handler = createMcpHandler(
  (server) => {
    server.registerTool(
      "list_topics",
      {
        description:
          "Os tópicos do catálogo, com quantas skills há em cada um. Use antes de list_skills para escolher um filtro: o catálogo tem centenas de entradas e listar tudo enche o contexto sem necessidade.",
        inputSchema: {},
      },
      async () => ({
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                source: SITE_URL,
                updated: registry.updated,
                total: registry.counts.total,
                topics: registry.topics,
              },
              null,
              2
            ),
          },
        ],
      })
    );

    server.registerTool(
      "list_skills",
      {
        description:
          `Lista as skills do catálogo do Compound Design, em páginas de ${LIMITE_PADRAO}. ` +
          "Filtre por tópico ou texto sempre que possível. Cada item traz autor e licença.",
        inputSchema: {
          query: z
            .string()
            .optional()
            .describe("Filtro sobre pathSlug, nome, descrição e tópicos. Termos em qualquer ordem."),
          topic: z
            .string()
            .optional()
            .describe("Um tópico do catálogo. Use list_topics para ver quais existem."),
          limit: z
            .number()
            .int()
            .min(1)
            .max(LIMITE_MAXIMO)
            .optional()
            .describe(`Quantas devolver. Padrão ${LIMITE_PADRAO}, máximo ${LIMITE_MAXIMO}.`),
          offset: z
            .number()
            .int()
            .min(0)
            .optional()
            .describe("A partir de qual posição. Use o nextOffset da resposta anterior."),
        },
      },
      async ({ query, topic, limit, offset }) => {
        const pagina = pageSkills({ query, topic, limit, offset });

        /*  A mesma forma de envelope em todo caso, inclusive o vazio. Antes a
         *  lista vazia devolvia só {total, skills, hint} e um cliente que lia
         *  offset ou returned recebia undefined conforme o motivo de estar
         *  vazia. Um contrato que muda de forma pelo conteúdo não é contrato. */
        const hint =
          pagina.total === 0
            ? topic
              ? `Nenhuma skill no tópico "${topic}". Use list_topics para ver os que existem.`
              : "Nada com esse filtro. Tente um termo mais curto, ou list_topics."
            : pagina.hasMore
              ? `Faltam ${pagina.total - pagina.offset - pagina.returned} de ${pagina.total}. ` +
                `Chame de novo com offset: ${pagina.nextOffset}, ou filtre por topic para reduzir.`
              : undefined;

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({ source: SITE_URL, updated: registry.updated, ...pagina, hint }, null, 2),
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
            .describe(
              'Nome, slug ou pathSlug. Por exemplo "animate" ou "emilkowalski/animate". ' +
                'Use "start" para a skill de roteamento do catálogo.'
            ),
        },
      },
      async ({ name }) => {
        // O ponto de entrada do catálogo, sem precisar saber o slug de nada.
        if (name.trim().toLowerCase() === "start") {
          return { content: [{ type: "text" as const, text: routingSkill() }] };
        }

        const achado = findSkill(name);

        if (!achado) {
          return {
            isError: true,
            content: [
              {
                type: "text" as const,
                text: `Skill "${name}" não existe no catálogo. Use list_topics e depois list_skills para ver o que há.`,
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
    serverInfo: { name: "Compound Design Skills", version: "1.1.0" },
    instructions:
      "Catálogo de skills de design engineering. Comece por get_skill com name: \"start\", " +
      "que devolve a skill de roteamento. Use list_topics para escolher um filtro e " +
      "list_skills para descobrir dentro dele. Cada resposta traz autor e licença: " +
      "preserve o crédito ao usar uma skill.",
  }
);

// O catálogo é leitura de arquivo local, então 30s sobra.
export const maxDuration = 30;

/*  Um teto por IP antes de entregar ao handler.
 *
 *  É frouxo de propósito, e vale dizer por quê: a contagem vive na memória da
 *  instância, então numa função sem estado o limite é por instância, não global.
 *  Não segura ataque coordenado — para isso o lugar é a borda.
 *
 *  O que ele segura é o caso real: um agente preso em laço, repetindo get_skill
 *  centenas de vezes por minuto. Uma sessão honesta faz uma dezena de chamadas,
 *  então 120 por minuto não incomoda ninguém que esteja usando o catálogo. */
const TETO = { max: 120, windowMs: 60_000 };

async function comLimite(request: Request) {
  if (rateLimited(`mcp:${clientIp(request)}`, TETO)) {
    return Response.json(
      {
        jsonrpc: "2.0",
        error: {
          code: -32000,
          message: `Limite de ${TETO.max} chamadas por minuto atingido. Aguarde e tente de novo.`,
        },
        id: null,
      },
      { status: 429, headers: { "retry-after": "60" } }
    );
  }
  return handler(request);
}

export { comLimite as GET, comLimite as POST };
