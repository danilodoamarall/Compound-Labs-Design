import { readFileSync } from "node:fs";
import { join } from "node:path";
import registro from "../../content/skills-registry.json";

export type SkillSource = {
  author: string;
  repo: string;
  url: string;
  license: string | null;
  licenseName: string | null;
};

export type Skill = {
  slug: string;
  /** `autor/slug`. Único no catálogo, ao contrário de `slug`, que se repete. */
  pathSlug: string;
  name: string;
  description: string;
  topics: string[];
  source: SkillSource;
  /** Se o conteúdo está aqui. Falso quando a licença não permite copiar. */
  hosted: boolean;
  file?: string;
  bytes?: number;
  fetchedAt?: string;
  commit?: string | null;
  pinned?: string | null;
  reason?: string;
  readAt?: string;
};

export type SkillRegistry = {
  updated: string;
  counts: { total: number; hosted: number; pointer: number };
  licenses: Record<string, number>;
  topics: { key: string; count: number }[];
  skills: Skill[];
};

export const registry = registro as unknown as SkillRegistry;

const DIR = join(process.cwd(), "content", "skills");

/** Acha por pathSlug, por slug, ou por nome. Aceita as três formas porque é o
 *  que um agente vai tentar: `animate`, `emilkowalski/animate`, `Animate`.
 *
 *  Quando o slug é ambíguo (oito casos no catálogo, como `animate`, que existe
 *  em dois autores), devolve a ambiguidade em vez de escolher por conta. */
export function findSkill(termo: string): { skill: Skill } | { ambiguous: Skill[] } | null {
  const t = termo.trim().toLowerCase();

  const exato = registry.skills.find((s) => s.pathSlug.toLowerCase() === t);
  if (exato) return { skill: exato };

  const porSlug = registry.skills.filter((s) => s.slug.toLowerCase() === t);
  if (porSlug.length === 1) return { skill: porSlug[0] };
  if (porSlug.length > 1) return { ambiguous: porSlug };

  const porNome = registry.skills.filter((s) => s.name.toLowerCase() === t);
  if (porNome.length === 1) return { skill: porNome[0] };
  if (porNome.length > 1) return { ambiguous: porNome };

  return null;
}

/** Filtra por texto livre sobre pathSlug, nome e descrição, e por tópico. */
export function searchSkills({ query, topic }: { query?: string; topic?: string } = {}): Skill[] {
  const norm = (s: string) => s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
  let out = registry.skills;

  if (topic) {
    const t = topic.trim().toLowerCase();
    out = out.filter((s) => s.topics.some((x) => x.toLowerCase() === t));
  }

  if (query?.trim()) {
    const termos = norm(query).split(/\s+/).filter(Boolean);
    out = out.filter((s) => {
      const palheiro = norm(`${s.pathSlug} ${s.name} ${s.description} ${s.topics.join(" ")}`);
      return termos.every((termo) => palheiro.includes(termo));
    });
  }

  return out;
}

/** O markdown da skill.
 *
 *  Só existe para as de licença permissiva. Para as demais devolvemos null e
 *  quem chama manda o leitor à origem: servir o texto de quem não autorizou
 *  seria redistribuição, que é exatamente o que o ui-skills faz e nós não. */
export function readSkillBody(skill: Skill): string | null {
  if (!skill.hosted || !skill.file) return null;
  try {
    return readFileSync(join(DIR, skill.file), "utf8");
  } catch {
    return null;
  }
}

/** A linha de atribuição que acompanha toda entrega de conteúdo. */
export function attribution(skill: Skill): string {
  const { author, repo, url, license } = skill.source;
  return `Escrito por ${author} em ${author}/${repo}, sob licença ${license}. Origem: ${url}`;
}
