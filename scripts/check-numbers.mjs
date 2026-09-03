// Confere todo percentual citado nos artigos contra o JSON da pesquisa.
// Uso: node scripts/check-numbers.mjs
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const data = JSON.parse(readFileSync(join(root, "content/data/state-of-prototyping-2026.json"), "utf8"));

/** Todo número presente no dataset, incluindo derivados e somas de dois valores. */
function knownNumbers() {
  const set = new Set();
  const add = (v) => { if (typeof v === "number" && Number.isFinite(v)) set.add(Math.round(v * 100) / 100); };
  const walk = (node) => {
    if (Array.isArray(node)) node.forEach(walk);
    else if (node && typeof node === "object") Object.values(node).forEach(walk);
    else add(node);
  };
  walk(data);

  // Diferenças e somas entre percentuais do mesmo grupo aparecem no texto como
  // "46 pontos", "4,1 pontos", "71,1%". Gera os pares para não acusar falso positivo.
  const groups = [data.vibe, data.vibeByRole, data.trust, data.tools, data.blockers,
    data.workflowChange, data.aiCentralByCompany, data.investing, data.builtTool, data.roles, data.company];
  for (const g of groups) {
    if (!Array.isArray(g)) continue;
    const pcts = g.map((x) => x.pct).filter((v) => typeof v === "number");
    for (let i = 0; i < pcts.length; i++) {
      for (let j = 0; j < pcts.length; j++) {
        if (i === j) continue;
        add(Math.round((pcts[i] + pcts[j]) * 10) / 10);
        add(Math.round(Math.abs(pcts[i] - pcts[j]) * 10) / 10);
      }
    }
  }
  for (const o of data.outlook) {
    add(Math.abs(o.net));
    add(Math.round(Math.abs(o.moreValuable - o.lessSecure) * 10) / 10);
  }
  return set;
}

const known = knownNumbers();
// Tolerâncias: números arredondados no texto ("46 pontos" para 45,9) e valores
// que não vêm da pesquisa (datas, contagens de artigo, escala 1 a 10).
const IGNORE = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 100, 12, 2026, 2025, 14, 6]);
const near = (v) => [...known].some((k) => Math.abs(k - v) < 0.55);

const dir = join(root, "content/artigos");
let problems = 0, checked = 0;

for (const file of readdirSync(dir).filter((f) => f.endsWith(".mdx"))) {
  const text = readFileSync(join(dir, file), "utf8");
  const body = text.replace(/^---[\s\S]*?\n---\n/, "");
  // Percentuais e pontos citados: "43,8%", "43.8%", "1.478", "+39,4 pontos"
  const matches = body.matchAll(/(\d{1,3}(?:[.,]\d{1,3})?)\s*(%|pontos?|points?|pts)/g);
  for (const m of matches) {
    const value = Number(m[1].replace(",", "."));
    checked += 1;
    if (IGNORE.has(value) || near(value)) continue;
    const line = body.slice(0, m.index).split("\n").length;
    console.log(`  ${file}:${line}  ${m[0]}  não encontrado no dataset`);
    problems += 1;
  }
  // n= citados
  for (const m of body.matchAll(/n=(\d{1,3}(?:[.,]\d{3})?)/g)) {
    const value = Number(m[1].replace(/[.,]/g, ""));
    checked += 1;
    if (known.has(value)) continue;
    const line = body.slice(0, m.index).split("\n").length;
    console.log(`  ${file}:${line}  n=${m[1]}  não encontrado no dataset`);
    problems += 1;
  }
}

console.log(`\n${checked} números verificados, ${problems} divergência(s).`);
process.exit(problems ? 1 : 0);
