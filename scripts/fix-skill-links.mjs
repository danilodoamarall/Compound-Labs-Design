/** Reescreve os links relativos das skills já copiadas para URLs absolutas no
 *  GitHub, no commit fixado em `pinned`.
 *
 *  Os SKILL.md apontam para arquivos vizinhos (`references/WCAG.md`,
 *  `../performance/SKILL.md`) que não vieram na cópia. O agente que lê a skill
 *  é mandado abrir um arquivo que não existe em content/skills/. Como toda
 *  entrada hospedada tem `pinned`, dá para resolver cada link contra a pasta do
 *  arquivo original, no MESMO commit.
 *
 *  Idempotente: o que já é absoluto não é candidato, então rodar de novo não
 *  muda nada. A regra mora em lib/links.mjs e é a mesma que o ingest aplica ao
 *  copiar, para não regredir na próxima ingestão.
 *
 *  Uso: node scripts/fix-skill-links.mjs */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { reescreverLinks } from "./lib/links.mjs";

const RAIZ = process.cwd();
const DIR = join(RAIZ, "content", "skills");
const registro = JSON.parse(readFileSync(join(RAIZ, "content", "skills-registry.json"), "utf8"));

let arquivos = 0;
let links = 0;
let verificados = 0;
const semBase = [];

for (const s of registro.skills) {
  if (!s.hosted || !s.file) continue;
  verificados++;
  const caminho = join(DIR, s.file);
  const original = readFileSync(caminho, "utf8");
  const { texto, reescritos, resolvido } = reescreverLinks(original, s.pinned);
  if (!resolvido) {
    semBase.push(`${s.pathSlug} (pinned: ${JSON.stringify(s.pinned)})`);
    continue;
  }
  if (reescritos > 0) {
    writeFileSync(caminho, texto);
    arquivos++;
    links += reescritos;
  }
}

console.log(`arquivos verificados: ${verificados}`);
console.log(`arquivos reescritos:  ${arquivos}`);
console.log(`links reescritos:     ${links}`);
if (semBase.length) {
  console.log(`\nsem base do GitHub para resolver (${semBase.length}):`);
  for (const s of semBase) console.log(`  ${s}`);
}
