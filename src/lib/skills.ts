import { readFileSync } from "node:fs";
import { join } from "node:path";
import registro from "../../content/skills-registry.json";
import estrelasBrutas from "../../content/repo-stars.json";

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

/** A linha de atribuição que acompanha toda entrega de conteúdo.
 *
 *  Bilíngue porque aparece no rodapé da página da skill nos dois idiomas. Antes
 *  saía em português fixo também em /en, a única frase da página fora do
 *  idioma do leitor. O MCP e o CLI recebem a versão em português: são
 *  ferramentas de um hub brasileiro e o agente lê qualquer uma das duas. */
export function attribution(skill: Skill, locale: "pt" | "en" = "pt"): string {
  const { author, repo, url, license } = skill.source;
  return locale === "en"
    ? `Written by ${author} in ${author}/${repo}, under the ${license} licence. Source: ${url}`
    : `Escrito por ${author} em ${author}/${repo}, sob licença ${license}. Origem: ${url}`;
}

/** Uma vista compacta de uma skill, para listagem.
 *
 *  A listagem inteira em objeto cheio dá 157 KB, que é cerca de 40 mil tokens
 *  entrando no contexto de um agente que só queria saber o que existe. Esta
 *  forma tem o que serve para escolher, e nada do que só serve para ler. */
export type SkillCard = {
  pathSlug: string;
  name: string;
  description: string;
  topics: string[];
  author: string;
  license: string | null;
  hosted: boolean;
};

/** Corta a descrição no fim de uma frase, não no meio de uma palavra. */
function resumir(texto: string, limite = 180): string {
  if (texto.length <= limite) return texto;
  const corte = texto.slice(0, limite);
  const ponto = Math.max(corte.lastIndexOf(". "), corte.lastIndexOf("? "));
  if (ponto > limite * 0.5) return corte.slice(0, ponto + 1);
  const espaco = corte.lastIndexOf(" ");
  return `${corte.slice(0, espaco > 0 ? espaco : limite)}…`;
}

export function toCard(s: Skill, { full = false } = {}): SkillCard {
  return {
    pathSlug: s.pathSlug,
    name: s.name,
    description: full ? s.description : resumir(s.description),
    topics: s.topics,
    // A procedência viaja com a listagem, não só com o conteúdo.
    author: s.source.author,
    license: s.source.license,
    hosted: s.hosted,
  };
}

export const LIMITE_PADRAO = 40;
export const LIMITE_MAXIMO = 200;

/** Uma página do catálogo.
 *
 *  Devolver as 269 de uma vez não é generosidade, é despejo: o consumidor é um
 *  agente com contexto finito. A página diz quanto ficou de fora e como pedir o
 *  resto, então nada é escondido em silêncio. */
export function pageSkills({
  query,
  topic,
  limit,
  offset = 0,
  full = false,
}: {
  query?: string;
  topic?: string;
  limit?: number;
  offset?: number;
  full?: boolean;
} = {}) {
  const achados = searchSkills({ query, topic });
  const tamanho = Math.min(Math.max(1, limit ?? LIMITE_PADRAO), LIMITE_MAXIMO);
  const inicio = Math.max(0, offset);
  const pagina = achados.slice(inicio, inicio + tamanho);

  return {
    total: achados.length,
    returned: pagina.length,
    offset: inicio,
    hasMore: inicio + pagina.length < achados.length,
    nextOffset: inicio + pagina.length < achados.length ? inicio + pagina.length : null,
    skills: pagina.map((s) => toCard(s, { full })),
  };
}

/** A atribuição em ASCII, para cabeçalho HTTP.
 *
 *  Um cabeçalho não carrega acento: o valor sai percent-encoded e chega como
 *  `sob licen%C3%A7a MIT`, que ninguém lê. O crédito ao autor é o ponto deste
 *  cabeçalho, então ele vai em texto que se lê sem decodificar. */
export function attributionHeader(skill: Skill): string {
  const { author, repo, url, license } = skill.source;
  return `${author} in ${author}/${repo}, ${license}. Source: ${url}`;
}

/* -------------------------------------------------------------------------
   Sinais de procedência do repositório de origem
   ------------------------------------------------------------------------- */

/** As estrelas ficam num arquivo separado do registro, de propósito.
 *
 *  Estrela é número que muda toda semana; o registro é o resultado de uma
 *  cópia datada e fixada num commit. Misturar os dois obrigaria a reingerir as
 *  207 skills só para atualizar um contador. Separados, `fetch-repo-stars.mjs`
 *  roda sozinho.
 *
 *  Por que estrelas, e não instalações: o skills.sh ordena o placar por
 *  instalações. Nós não temos esse dado, porque ninguém instala nada através
 *  deste hub, e um número inventado seria o contrário da procedência que o
 *  catálogo defende. As estrelas medem o repositório de onde a skill veio, que
 *  é uma coisa que existe e que qualquer um confere. */
export type RepoSinais = {
  stars: number | null;
  pushedAt: string | null;
  archived: boolean;
};

const estrelas = estrelasBrutas as unknown as Record<string, RepoSinais>;

export function repoSinais(skill: Skill): RepoSinais {
  const chave = `${skill.source.author}/${skill.source.repo}`;
  return estrelas[chave] ?? { stars: null, pushedAt: null, archived: false };
}

/** O catálogo ordenado por estrelas do repositório de origem.
 *
 *  Sem estrela vai para o fim, não para o zero: ausência de dado não é o mesmo
 *  que popularidade zero, e empurrar um repo sem resposta da API para o fundo
 *  do placar como se fosse impopular seria mentir por omissão.
 *
 *  O desempate é alfabético, para a ordem ser estável entre builds. */
export function rankedSkills(lista: Skill[] = registry.skills): (Skill & { rank: number; signals: RepoSinais })[] {
  return [...lista]
    .map((s) => ({ ...s, signals: repoSinais(s) }))
    .sort((a, b) => {
      const ea = a.signals.stars;
      const eb = b.signals.stars;
      if (ea === null && eb === null) return a.pathSlug.localeCompare(b.pathSlug);
      if (ea === null) return 1;
      if (eb === null) return -1;
      if (eb !== ea) return eb - ea;
      return a.pathSlug.localeCompare(b.pathSlug);
    })
    .map((s, i) => ({ ...s, rank: i + 1 }));
}

/** 30344 -> "30.3K". O formato do skills.sh, que cabe numa coluna estreita. */
export function formatStars(n: number | null): string {
  if (n === null) return "—";
  if (n < 1000) return String(n);
  if (n < 1_000_000) {
    const k = n / 1000;
    return `${k < 10 ? k.toFixed(1) : Math.round(k)}K`;
  }
  return `${(n / 1_000_000).toFixed(1)}M`;
}
