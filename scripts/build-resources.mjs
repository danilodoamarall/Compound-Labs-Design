// Monta o índice unificado que alimenta a busca por tags da home.
//
// Junta artigos, radar, AI tools, skills e workflow numa lista só, funde os
// itens que aparecem em mais de uma seção (Figma está no radar e no workflow,
// Claude Code em três) e anexa as tags de content/resource-tags.json.
//
// As tags são dado editável à mão. Este script só junta e valida.
// Uso: node scripts/build-resources.mjs
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => JSON.parse(readFileSync(join(root, p), "utf8"));

const tagsByKey = read("content/resource-tags.json").tags;
const radar = read("content/radar.json");
const aiTools = read("content/ai-tools.json");
const skills = read("content/skills-agents.json");
const workflow = read("content/workflow.json");

/** Rótulo da coluna da direita e destino do link, por seção. */
const SECTION = {
  artigos: { pt: "Artigos", en: "Articles", path: { pt: "/artigos", en: "/articles" } },
  radar: { pt: "Radar", en: "Radar", path: { pt: "/radar", en: "/radar" } },
  "ai-tools": { pt: "AI Tools", en: "AI Tools", path: { pt: "/ai-tools", en: "/ai-tools" } },
  "skills-agents": { pt: "Skills", en: "Skills", path: { pt: "/skills-agents", en: "/skills-agents" } },
  workflow: { pt: "Workflow", en: "Workflow", path: { pt: "/workflow", en: "/workflow" } },
};

const items = new Map();

/** Funde pelo nome: o mesmo produto em duas seções vira uma entrada só. */
function add(name, entry) {
  const k = name.toLowerCase().trim();
  const existing = items.get(k);
  if (existing) {
    if (!existing.sections.includes(entry.section)) existing.sections.push(entry.section);
    if (!existing.desc.pt && entry.desc.pt) existing.desc = entry.desc;
    return;
  }
  items.set(k, { ...entry, name, sections: [entry.section] });
}

// Artigos: o slug e o frontmatter vêm do MDX em português, que é a fonte.
for (const file of readdirSync(join(root, "content/artigos")).filter((f) => f.endsWith(".pt.mdx"))) {
  const slug = file.replace(".pt.mdx", "");
  const src = readFileSync(join(root, "content/artigos", file), "utf8");
  const field = (k) => (src.match(new RegExp(`^${k}: (.*)$`, "m")) || [])[1]?.trim() ?? "";
  const en = readFileSync(join(root, "content/artigos", `${slug}.en.mdx`), "utf8");
  const fieldEn = (k) => (en.match(new RegExp(`^${k}: (.*)$`, "m")) || [])[1]?.trim() ?? "";
  add(field("title"), {
    key: `artigo-${slug}`,
    slug,
    kind: "article",
    section: "artigos",
    nameEn: fieldEn("title"),
    desc: { pt: field("dek"), en: fieldEn("dek") },
    order: Number(field("order") || 0),
  });
}

const tools = [
  ...workflow.tools.map((t) => ({ t, section: "workflow", desc: { pt: t.pt, en: t.en } })),
  ...aiTools.items.map((t) => ({ t, section: "ai-tools", desc: t.usedFor })),
  ...radar.items.map((t) => ({ t, section: "radar", desc: t.note })),
  ...skills.items.map((t) => ({ t, section: "skills-agents", desc: t.summary })),
];

for (const { t, section, desc } of tools) {
  add(t.name, { key: t.key, kind: section === "skills-agents" ? "skill" : "tool", section, nameEn: t.name, desc });
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
  };
});

// Artigos primeiro, na ordem da série; depois o resto em ordem alfabética.
resources.sort((a, b) => {
  if (a.kind === "article" && b.kind === "article") return (a.order ?? 0) - (b.order ?? 0);
  if (a.kind === "article") return -1;
  if (b.kind === "article") return 1;
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
  JSON.stringify({ sections: SECTION, resources }, null, 2) + "\n",
);

console.log(`${resources.length} itens no índice`);
console.log(`fundidos de ${tools.length + resources.filter((r) => r.kind === "article").length} entradas nas seções`);
console.log(`tags: ${Object.entries(dist).sort((a, b) => b[1] - a[1]).map(([t, n]) => `${t} ${n}`).join(" · ")}`);
