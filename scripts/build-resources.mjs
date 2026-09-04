// Monta o índice unificado que alimenta o /explorar, a busca e as páginas /r/.
//
// Junta artigos, workflow, os repositórios de skills e o acervo de ferramentas
// numa lista só, funde os itens que aparecem em mais de uma fonte (Figma está
// no acervo e no workflow, Claude Code em três) e anexa as tags de
// content/resource-tags.json.
//
// Sobre o acervo: radar.json e ai-tools.json deixaram de ter página própria.
// As duas listas eram 100% rascunho, com uma linha por ferramenta. Os itens
// continuam aqui como fonte do índice, para nenhum link /r/ quebrar, mas as
// seções são marcadas como não navegáveis: aparecem como rótulo, nunca como
// destino.
//
// As tags são dado editável à mão. Este script só junta e valida.
// Uso: node scripts/build-resources.mjs
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => JSON.parse(readFileSync(join(root, p), "utf8"));

const tagsByKey = read("content/resource-tags.json").tags;
const acervoFerramentas = read("content/radar.json");
const acervoIa = read("content/ai-tools.json");
const skillsCuradas = read("content/skills-agents.json");
const workflow = read("content/workflow.json");
const registroSkills = read("content/skills-registry.json");
const estrelas = read("content/repo-stars.json");

const HOJE = process.env.BUILD_DATE ?? new Date().toISOString().slice(0, 10);

/** Rótulo da coluna da direita e destino do link, por seção.
 *
 *  `navigable: false` é o acervo: a seção existe como origem do dado, não como
 *  página. O rótulo diz o que o item É (ferramenta), não de que página veio. */
const SECTION = {
  artigos: { pt: "Artigos", en: "Articles", path: { pt: "/artigos", en: "/articles" }, navigable: true },
  "skills-agents": { pt: "Skills", en: "Skills", path: { pt: "/skills-agents", en: "/skills-agents" }, navigable: true },
  workflow: { pt: "Workflow", en: "Workflow", path: { pt: "/workflow", en: "/workflow" }, navigable: true },
  ferramentas: { pt: "Ferramentas", en: "Tools", navigable: false },
  "ferramentas-ia": { pt: "Ferramentas de IA", en: "AI tools", navigable: false },
};

const items = new Map();

/** Funde pelo nome: o mesmo produto em duas seções vira uma entrada só.
 *
 *  Cada seção guarda a própria nota, e os fatos de todas se acumulam. Nenhum é
 *  sobrescrito: o primeiro valor de cada campo vence, e o resto só preenche o
 *  que faltava. */
function add(name, entry) {
  const k = name.toLowerCase().trim();
  const { section, desc, facts = {}, date, ...rest } = entry;
  const existing = items.get(k);

  if (existing) {
    if (!existing.sections.includes(section)) existing.sections.push(section);
    existing.notes[section] = desc;
    if (!existing.desc.pt && desc.pt) existing.desc = desc;
    for (const [campo, valor] of Object.entries(facts)) {
      if (valor === undefined || valor === null || valor === "") continue;
      if (existing.facts[campo] === undefined) existing.facts[campo] = valor;
    }
    if (facts.draft) existing.facts.draft = true;
    // A data mais recente entre as fontes.
    if (date && (!existing.date || date > existing.date)) existing.date = date;
    return;
  }

  const limpos = {};
  for (const [campo, valor] of Object.entries(facts)) {
    if (valor !== undefined && valor !== null && valor !== "") limpos[campo] = valor;
  }
  items.set(k, { ...rest, name, desc, date: date ?? null, sections: [section], notes: { [section]: desc }, facts: limpos });
}

// Artigos: o slug e o frontmatter vêm do MDX em português, que é a fonte.
for (const file of readdirSync(join(root, "content/artigos")).filter((f) => f.endsWith(".pt.mdx"))) {
  const slug = file.replace(".pt.mdx", "");
  const src = readFileSync(join(root, "content/artigos", file), "utf8");
  const field = (k) => (src.match(new RegExp(`^${k}: (.*)$`, "m")) || [])[1]?.trim().replace(/^["']|["']$/g, "") ?? "";
  const en = readFileSync(join(root, "content/artigos", `${slug}.en.mdx`), "utf8");
  const fieldEn = (k) => (en.match(new RegExp(`^${k}: (.*)$`, "m")) || [])[1]?.trim().replace(/^["']|["']$/g, "") ?? "";
  add(field("title"), {
    key: `artigo-${slug}`,
    slug,
    kind: "article",
    section: "artigos",
    nameEn: fieldEn("title"),
    desc: { pt: field("dek"), en: fieldEn("dek") },
    order: Number(field("order") || 0),
    // A data de publicação, do frontmatter. É a única data por item que os
    // artigos têm de verdade.
    date: field("date").slice(0, 10) || null,
  });
}

// As fontes chamam a descrição de nomes diferentes. A normalização acontece
// aqui, uma vez, e o resto do site lê um campo só.
const tools = [
  ...workflow.tools.map((t) => ({
    t, section: "workflow", desc: { pt: t.pt, en: t.en },
    facts: { url: t.url, stage: t.stage, category: t.category },
  })),
  ...acervoIa.items.map((t) => ({
    t, section: "ferramentas-ia", desc: t.usedFor,
    facts: { url: t.url, category: t.category, pricing: t.pricing, surveyPct: t.surveyPct, draft: t.draft },
  })),
  // O anel e o quadrante do antigo radar não entram: eram a interface de uma
  // página que não existe mais. O percentual da pesquisa e a URL ficam, porque
  // são fatos sobre a ferramenta, não sobre a página.
  ...acervoFerramentas.items.map((t) => ({
    t, section: "ferramentas", desc: t.note,
    facts: { url: t.url, surveyPct: t.surveyPct, draft: t.draft },
  })),
  ...skillsCuradas.items.map((t) => ({
    t, section: "skills-agents", desc: t.summary,
    facts: { type: t.type, whenToUse: t.whenToUse, install: t.install, code: t.code, draft: t.draft },
  })),
];

for (const { t, section, desc, facts } of tools) {
  add(t.name, {
    key: t.key,
    kind: section === "skills-agents" ? "skill" : "tool",
    section,
    nameEn: t.name,
    desc,
    facts,
  });
}

/*  Os repositórios de skills do catálogo, um item por repositório.
 *
 *  O /explorar listava 5 skills curadas à mão enquanto o catálogo tinha 207
 *  hospedadas de 60 e poucos repositórios. Por repositório, e não por skill,
 *  porque 207 linhas afogariam o índice e porque a unidade que o leitor
 *  reconhece é `emilkowalski/skills`, não cada arquivo dentro dele.
 *
 *  A data é o último push do repositório, vinda de repo-stars.json: é a
 *  atividade real de quem escreveu. A tag é `build` por construção: são coisas
 *  que se instalam. Não passam pelo resource-tags.json editado à mão, porque a
 *  lista muda a cada ingestão e obrigar a etiquetar 60 repositórios à mão faria
 *  o build quebrar toda vez. */
const porRepo = new Map();
for (const s of registroSkills.skills) {
  if (!s.hosted) continue;
  const chave = `${s.source.author}/${s.source.repo}`;
  if (!porRepo.has(chave)) porRepo.set(chave, { skills: [], license: s.source.license, url: `https://github.com/${chave}`, author: s.source.author });
  porRepo.get(chave).skills.push(s);
}

const repoItems = [];
for (const [chave, r] of porRepo) {
  const sinais = estrelas[chave] ?? {};
  const n = r.skills.length;
  const key = `skills-${chave.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  repoItems.push({
    key,
    name: chave,
    nameEn: chave,
    desc: {
      pt: `${n} ${n === 1 ? "skill" : "skills"} de design engineering, sob ${r.license}.`,
      en: `${n} design-engineering ${n === 1 ? "skill" : "skills"}, under ${r.license}.`,
    },
    tags: ["build"],
    kind: "skill",
    sections: ["skills-agents"],
    order: null,
    date: sinais.pushedAt ?? null,
    notes: {},
    facts: {
      url: r.url,
      license: r.license,
      stars: typeof sinais.stars === "number" ? sinais.stars : undefined,
      skillCount: n,
      // O destino é o placar filtrado pelo autor, não uma página nova.
      catalogQuery: r.author,
    },
  });
}

const missing = [];
const resources = [...items.values()].map((item) => {
  const tags = tagsByKey[item.key];
  if (!tags || !tags.length) missing.push(`${item.key} (${item.name})`);
  return {
    key: item.key,
    name: item.name,
    nameEn: item.nameEn || item.name,
    desc: item.desc,
    tags: tags ?? [],
    kind: item.kind,
    sections: item.sections,
    order: item.order ?? null,
    date: item.date ?? null,
    notes: item.notes ?? {},
    facts: item.facts ?? {},
  };
});

resources.push(...repoItems);

// Com data, do mais novo para o mais velho, como um índice cronológico. Sem data,
// depois, em ordem alfabética: ausência de data não vira data falsa.
resources.sort((a, b) => {
  if (a.date && b.date) return b.date.localeCompare(a.date) || a.name.localeCompare(b.name, "pt-BR");
  if (a.date) return -1;
  if (b.date) return 1;
  return a.name.localeCompare(b.name, "pt-BR");
});

if (missing.length) {
  console.error(`\n${missing.length} item(ns) sem tag em content/resource-tags.json:`);
  missing.forEach((m) => console.error(`  ${m}`));
  console.error("\nCada item do índice precisa de pelo menos uma tag. Ver scripts/build-resources.mjs\n");
  process.exit(1);
}

const dist = {};
resources.forEach((r) => r.tags.forEach((t) => { dist[t] = (dist[t] || 0) + 1; }));

writeFileSync(
  join(root, "content/resources.json"),
  JSON.stringify({ updated: HOJE, sections: SECTION, resources }, null, 2) + "\n",
);

const comData = resources.filter((r) => r.date).length;
console.log(`${resources.length} itens no índice (${repoItems.length} repositórios de skills, ${comData} com data)`);
console.log(`fundidos de ${tools.length + resources.filter((r) => r.kind === "article").length} entradas nas seções`);
console.log(`tags: ${Object.entries(dist).sort((a, b) => b[1] - a[1]).map(([t, n]) => `${t} ${n}`).join(" · ")}`);
