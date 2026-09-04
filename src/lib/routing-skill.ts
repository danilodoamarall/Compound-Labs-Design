import { registry } from "./skills";
import { CLI_BIN, CLI_PACKAGE, MCP_URL } from "./site-url";

/** A skill de roteamento do catálogo: o que `ai-skills start` imprime.
 *
 *  Antes o comando servia `ibelick/ui-skills-root`, que é a skill de roteamento
 *  do ui-skills. Ela é MIT e podíamos redistribuir, mas o texto manda o agente
 *  rodar `npx ui-skills categories` e `npx ui-skills get`, que são comandos de
 *  outra ferramenta. Nosso CLI estava ensinando a usar o CLI de outro projeto.
 *
 *  Esta é gerada do registro, então os números e os tópicos nunca divergem do
 *  catálogo que ela descreve. */
export function routingSkill(): string {
  const topicos = registry.topics
    .slice(0, 14)
    .map((t) => `- \`${t.key}\` (${t.count})`)
    .join("\n");

  const { total, hosted, pointer } = registry.counts;

  return `---
name: compound-design-root
description: Use antes de trabalho de interface para escolher o menor contexto de skill útil no catálogo do Compound Design.
license: MIT
metadata:
  author: Compound Design
  updated: "${registry.updated}"
---

# Catálogo de skills do Compound Design

Você é a camada de roteamento deste catálogo. São ${total} skills de design
engineering escritas por outras pessoas, reunidas e creditadas aqui.

## Protocolo

1. Se a tarefa não é de interface, responda \`nenhuma skill necessária\` e siga.
2. Se o objetivo está vago, faça **uma** pergunta curta.
3. Escolha o tópico provável na lista abaixo.
4. Liste só aquele tópico. Não liste o catálogo inteiro: são ${total} entradas.
5. Carregue a **menor** skill que resolve, não todas as que combinam.
6. Implemente com esse contexto.

## Tópicos

${topicos}

## Comandos

\`\`\`bash
npx ${CLI_PACKAGE} topics                  # os tópicos, com a contagem
npx ${CLI_PACKAGE} list --topic motion     # só um tópico
npx ${CLI_PACKAGE} list --query shadow     # busca por texto
npx ${CLI_PACKAGE} get emilkowalski/animate
\`\`\`

Instalado como \`${CLI_BIN}\`. Há também um servidor MCP em ${MCP_URL},
com as ferramentas \`list_skills\`, \`get_skill\` e \`list_topics\`.

## Procedência

Cada skill é de quem a escreveu, e o catálogo trata isso como regra, não
cortesia:

- **${hosted}** estão sob licença permissiva e são servidas daqui, sempre com
  autor, licença e o commit de onde vieram.
- **${pointer}** não declaram licença. O catálogo devolve a ficha e o endereço
  da origem em vez do texto, porque sem licença declarada só o autor pode
  redistribuir.

Ao usar uma skill, preserve o crédito do autor.
`;
}
