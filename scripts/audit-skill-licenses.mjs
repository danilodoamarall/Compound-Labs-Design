// Audita a licença de cada repositório de origem das skills.
//
// O catálogo do ui-skills não expõe licença nenhuma, e sem isso não dá para
// saber o que pode ser copiado. Este script pergunta ao GitHub, repositório por
// repositório, e classifica em três baldes:
//
//   copiar    licença permissiva, redistribuição permitida com atribuição
//   apontar   sem licença declarada, ou licença que não permite redistribuir
//   checar    algo que a API não resolveu e precisa de olho humano
//
// Uso: node scripts/audit-skill-licenses.mjs .tmp-skills/registry.json
import { readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

/** SPDX que permitem redistribuir desde que se mantenha aviso e atribuição. */
const PERMISSIVAS = new Set([
  "MIT", "MIT-0", "Apache-2.0", "BSD-2-Clause", "BSD-3-Clause", "ISC",
  "Unlicense", "CC0-1.0", "0BSD", "MPL-2.0", "CC-BY-4.0",
]);

/** Copyleft: redistribuir é permitido, mas contamina o que for derivado.
 *  Fica separado porque a decisão é diferente. */
const COPYLEFT = new Set(["GPL-2.0", "GPL-3.0", "AGPL-3.0", "LGPL-3.0", "CC-BY-SA-4.0"]);

const registro = JSON.parse(readFileSync(process.argv[2] ?? ".tmp-skills/registry.json", "utf8"));
const skills = Array.isArray(registro) ? registro : Object.values(registro).find(Array.isArray);

const repos = new Map();
for (const s of skills) {
  const chave = `${s.user}/${s.repo}`;
  if (!repos.has(chave)) repos.set(chave, []);
  repos.get(chave).push(s.slug);
}

console.log(`${skills.length} skills em ${repos.size} repositórios. Consultando o GitHub...\n`);

const resultado = [];
let i = 0;
for (const [repo, slugs] of repos) {
  i++;
  let licenca = null;
  let erro = null;
  try {
    const bruto = execFileSync("gh", ["api", `repos/${repo}`, "--jq", "{spdx: .license.spdx_id, nome: .license.name, arquivado: .archived}"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
    licenca = JSON.parse(bruto);
  } catch (e) {
    erro = String(e.stderr || e.message).split("\n")[0].slice(0, 90);
  }

  const spdx = licenca?.spdx ?? null;
  let balde;
  if (erro) balde = "checar";
  else if (spdx && PERMISSIVAS.has(spdx)) balde = "copiar";
  else if (spdx && COPYLEFT.has(spdx)) balde = "copyleft";
  else balde = "apontar"; // sem licença, ou NOASSERTION: todos os direitos reservados

  resultado.push({ repo, skills: slugs.length, slugs, spdx, nome: licenca?.nome ?? null, arquivado: licenca?.arquivado ?? null, balde, erro });
  process.stdout.write(`\r  ${i}/${repos.size}  ${repo.padEnd(42).slice(0, 42)}`);
}
process.stdout.write("\n\n");

const porBalde = {};
for (const r of resultado) {
  porBalde[r.balde] ??= { repos: 0, skills: 0 };
  porBalde[r.balde].repos++;
  porBalde[r.balde].skills += r.skills;
}

console.log("=== resumo ===");
for (const [b, n] of Object.entries(porBalde)) {
  console.log(`  ${b.padEnd(9)} ${String(n.repos).padStart(3)} repos · ${String(n.skills).padStart(3)} skills`);
}

console.log("\n=== licenças encontradas ===");
const porLicenca = {};
for (const r of resultado) {
  const k = r.spdx ?? (r.erro ? "ERRO" : "sem licença");
  porLicenca[k] = (porLicenca[k] || 0) + r.skills;
}
for (const [k, n] of Object.entries(porLicenca).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${String(n).padStart(3)} skills  ${k}`);
}

console.log("\n=== os que NÃO podem ser copiados ===");
for (const r of resultado.filter((x) => x.balde !== "copiar").sort((a, b) => b.skills - a.skills)) {
  console.log(`  ${String(r.skills).padStart(3)}  ${r.repo.padEnd(40)} ${r.spdx ?? r.erro ?? "sem licença"}`);
}

writeFileSync(".tmp-skills/licencas.json", JSON.stringify(resultado, null, 1));
console.log("\ndetalhe em .tmp-skills/licencas.json");
