import { registry, searchSkills } from "@/lib/skills";

/** O registro do catálogo, em JSON.
 *
 *  Ao contrário do registro do ui-skills, cada entrada carrega a licença e diz
 *  se o conteúdo está hospedado aqui. Sem isso não dá para saber o que pode ser
 *  reusado, que é o problema que o catálogo deles tem. */
export function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.get("query") ?? undefined;
  const topic = url.searchParams.get("topic") ?? undefined;

  const skills = query || topic ? searchSkills({ query, topic }) : registry.skills;

  return Response.json(
    {
      updated: registry.updated,
      counts: registry.counts,
      licenses: registry.licenses,
      topics: registry.topics,
      count: skills.length,
      skills,
    },
    { headers: { "cache-control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400" } }
  );
}
