/** Busca as estrelas de cada repositório de origem do catálogo.
 *
 *  O skills.sh ordena o placar por instalações. Nós não temos esse dado, e não
 *  vamos inventar um: ninguém instala nada através deste hub. As estrelas do
 *  repositório de onde a skill veio são o análogo honesto — medem a origem, que
 *  é uma coisa que existe de verdade e que dá para conferir.
 *
 *  Grava em content/repo-stars.json, que o build do registro consome.
 *
 *  Uso: node scripts/fetch-repo-stars.mjs */
import { readFileSync, writeFileSync } from "node:fs";
import { execFile } from "node:child_process";
import { join } from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const RAIZ = process.cwd();
const REGISTRO = join(RAIZ, "content", "skills-registry.json");
const DESTINO = join(RAIZ, "content", "repo-stars.json");

const registro = JSON.parse(readFileSync(REGISTRO, "utf8"));

/** O repositório do próprio hub entra na mesma tabela: o botão de estrela do
 *  cabeçalho usa este número quando a API do GitHub nega a chamada em produção. */
const HUB = process.env.NEXT_PUBLIC_GITHUB_REPO ?? "danilodoamarall/Compound-Labs-Design";

const repos = [...new Set([HUB, ...registro.skills.map((s) => `${s.source.author}/${s.source.repo}`)])].sort();
console.log(`${repos.length} repositórios de origem\n`);

/** O que a API devolve por repositório. `pushedAt` é a atividade real: um repo
 *  com muitas estrelas e parado há dois anos não é o mesmo que um vivo. */
const CAMPOS = "stargazerCount,pushedAt,isArchived,description";

const resultados = {};
let erros = 0;

// Em série, e não em paralelo: a API do GitHub limita, e 83 chamadas levam
// segundos. Paralelizar aqui só troca tempo por risco de 403.
for (const [i, repo] of repos.entries()) {
  process.stdout.write(`\r  ${i + 1}/${repos.length}  ${repo.slice(0, 44).padEnd(44)}`);
  try {
    const { stdout } = await execFileAsync("gh", ["repo", "view", repo, "--json", CAMPOS], {
      encoding: "utf8",
    });
    const d = JSON.parse(stdout);
    resultados[repo] = {
      stars: d.stargazerCount ?? 0,
      pushedAt: d.pushedAt ? d.pushedAt.slice(0, 10) : null,
      archived: Boolean(d.isArchived),
    };
  } catch (e) {
    // Um repo que sumiu ou foi renomeado não pode derrubar o build. Fica sem
    // estrela, e a interface trata a ausência como ausência, não como zero.
    resultados[repo] = { stars: null, pushedAt: null, archived: false, error: String(e.message).slice(0, 80) };
    erros++;
  }
}

process.stdout.write("\n\n");

writeFileSync(DESTINO, JSON.stringify(resultados, null, 1) + "\n");

const comEstrela = Object.values(resultados).filter((r) => typeof r.stars === "number");
const total = comEstrela.reduce((a, r) => a + r.stars, 0);
const arquivados = Object.values(resultados).filter((r) => r.archived).length;

console.log(`gravado em content/repo-stars.json`);
console.log(`com estrelas: ${comEstrela.length}/${repos.length}`);
console.log(`sem resposta: ${erros}`);
console.log(`arquivados:   ${arquivados}`);
console.log(`soma:         ${total.toLocaleString("pt-BR")}`);

console.log(`\nos dez mais estrelados:`);
for (const [repo, d] of Object.entries(resultados)
  .filter(([, d]) => typeof d.stars === "number")
  .sort((a, b) => b[1].stars - a[1].stars)
  .slice(0, 10)) {
  console.log(`  ${String(d.stars).padStart(7)}  ${repo}${d.archived ? "  (arquivado)" : ""}`);
}
