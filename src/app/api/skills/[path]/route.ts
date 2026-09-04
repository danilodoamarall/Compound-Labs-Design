import { attributionHeader, findSkill, readSkillBody } from "@/lib/skills";
import { routingSkill } from "@/lib/routing-skill";

/** O markdown de uma skill, em texto puro. É o que o CLI e o MCP entregam.
 *
 *  O caminho aceita `slug` ou `autor__slug`, porque o `/` do pathSlug não cabe
 *  num segmento de rota. */
export async function GET(_req: Request, ctx: { params: Promise<{ path: string }> }) {
  const { path } = await ctx.params;
  const termo = decodeURIComponent(path).replace(/__/g, "/").replace(/\.(md|txt)$/, "");

  /*  O ponto de entrada do catálogo.
   *
   *  Antes o `start` do CLI servia `ibelick/ui-skills-root`, que é a skill de
   *  roteamento do ui-skills. É MIT e podíamos redistribuir, mas o texto manda
   *  o agente rodar `npx ui-skills categories` e `npx ui-skills get`: nosso CLI
   *  estava ensinando a usar a ferramenta de outro projeto. Esta é gerada do
   *  nosso registro, com os nossos comandos e os nossos números. */
  if (termo.toLowerCase() === "start") {
    return new Response(routingSkill(), {
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "x-skill-hosted": "true",
        "x-skill-license": "MIT",
        "cache-control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  }

  const achado = findSkill(termo);

  if (!achado) {
    return new Response(`Skill "${termo}" não existe no catálogo.\n`, {
      status: 404,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }

  if ("ambiguous" in achado) {
    const opcoes = achado.ambiguous.map((s) => `  ${s.pathSlug}`).join("\n");
    return new Response(
      `"${termo}" existe em mais de um autor. Escolha:\n${opcoes}\n`,
      { status: 300, headers: { "content-type": "text/plain; charset=utf-8" } }
    );
  }

  const { skill } = achado;
  const corpo = readSkillBody(skill);

  // Sem conteúdo hospedado, mandamos à origem em vez de servir o que não
  // podemos redistribuir.
  if (!corpo) {
    return new Response(
      [
        `# ${skill.name}`,
        "",
        skill.description,
        "",
        `Esta skill não está hospedada aqui: o repositório de origem não declara`,
        `licença, então o conteúdo é do autor e só ele pode redistribuir.`,
        "",
        `Leia na origem: ${skill.readAt ?? skill.source.url}`,
        `Autor: ${skill.source.author}`,
        "",
      ].join("\n"),
      { status: 200, headers: { "content-type": "text/plain; charset=utf-8", "x-skill-hosted": "false" } }
    );
  }

  return new Response(corpo, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "x-skill-hosted": "true",
      "x-skill-license": skill.source.license ?? "",
      "x-skill-attribution": attributionHeader(skill),
      "cache-control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
