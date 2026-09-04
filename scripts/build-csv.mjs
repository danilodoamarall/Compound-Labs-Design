// Gera o CSV público da pesquisa a partir do JSON já validado, para que o link
// da seção Research aponte para um arquivo que existe de verdade.
// Roda no prebuild, junto com as outras verificações.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";

const ROOT = process.cwd();
const SRC = join(ROOT, "content", "data", "state-of-prototyping-2026.json");
const OUT = join(ROOT, "public", "data", "state-of-prototyping-2026.csv");

const data = JSON.parse(readFileSync(SRC, "utf8"));

/** Escapa um campo conforme o RFC 4180: aspas dobradas e campo entre aspas
    quando houver vírgula, aspas ou quebra de linha. */
function cell(value) {
  if (value === null || value === undefined) return "";
  const s = String(value);
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

const rows = [["bloco", "chave", "rotulo_pt", "rotulo_en", "n", "pct"]];

/** Achata uma série de {key, pt, en, n, pct} num bloco de linhas. */
function push(bloco, arr) {
  if (!Array.isArray(arr)) return;
  for (const item of arr) {
    rows.push([
      bloco,
      item.key ?? "",
      item.pt ?? "",
      item.en ?? "",
      item.n ?? "",
      item.pct ?? "",
    ]);
  }
}

for (const [k, v] of Object.entries(data.headline ?? {})) {
  rows.push(["headline", k, "", "", "", v]);
}

push("camps", data.derived?.camps);
push("roles", data.roles);
push("regions", data.regions);
push("vibe", data.vibe);
push("satisfaction", data.satisfaction);
push("outlook", data.outlook);
push("tools", data.tools);
push("company", data.company);
push("builtTool", data.builtTool);
push("trust", data.trust);
push("blockers", data.blockers);
push("workflowChange", data.workflowChange);
push("investing", data.investing);

const meta = data.meta ?? {};
const header = [
  `# ${meta.title ?? "State of Prototyping 2026"}`,
  `# fonte: ${meta.url ?? ""}`,
  `# licenca: ${meta.license ?? ""}`,
  `# n=${meta.n ?? ""} coleta=${meta.collected?.from ?? ""} a ${meta.collected?.to ?? ""}`,
  `# tratamento: AI Builders Lab`,
].join("\n");

const csv = header + "\n" + rows.map((r) => r.map(cell).join(",")).join("\n") + "\n";

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, csv, "utf8");

console.log(`CSV gerado: ${rows.length - 1} linhas em public/data/state-of-prototyping-2026.csv`);
