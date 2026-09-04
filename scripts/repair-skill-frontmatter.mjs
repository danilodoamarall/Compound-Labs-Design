/** Move o comentário de procedência para depois do frontmatter.
 *
 *  Os 207 arquivos foram gravados com o comentário no topo, colado no `---` da
 *  primeira linha. Isso deixou o frontmatter ilegível para qualquer leitor de
 *  YAML: nome, descrição e licença de cada skill ficaram invisíveis para quem
 *  carrega o arquivo.
 *
 *  Repara no lugar, sem rebuscar nada no GitHub: o texto já está aqui, só está
 *  na ordem errada. Rodar de novo não muda nada. */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { comProcedencia } from "./lib/provenance.mjs";

const DIR = join(process.cwd(), "content", "skills");
const CABECALHO = /^<!--\r?\n(?:\s{2}(?:Origem|Autor|Licença|Commit|Copiado):[^\r\n]*\r?\n)+-->/;

let reparados = 0;
let jaOk = 0;
let semCabecalho = 0;

for (const arquivo of readdirSync(DIR)) {
  if (!arquivo.endsWith(".md") || arquivo === "ATTRIBUTION.md") continue;

  const caminho = join(DIR, arquivo);
  const original = readFileSync(caminho, "utf8");

  if (original.startsWith("---")) {
    jaOk++;
    continue;
  }

  const achou = original.match(CABECALHO);
  if (!achou) {
    semCabecalho++;
    console.warn(`  sem cabeçalho reconhecível: ${arquivo}`);
    continue;
  }

  const comentario = achou[0];
  const corpo = original.slice(comentario.length).replace(/^\r?\n+/, "");
  const novo = comProcedencia(corpo, comentario);

  if (novo !== original) {
    writeFileSync(caminho, novo);
    reparados++;
  }
}

console.log(`reparados: ${reparados}`);
console.log(`já corretos: ${jaOk}`);
if (semCabecalho) console.log(`sem cabeçalho: ${semCabecalho}`);

/*  A prova. A regra não é "todo arquivo tem frontmatter": 18 skills são markdown
 *  puro e nunca tiveram um. A regra é que, quando existe, ele está na primeira
 *  linha — e que a procedência sobreviveu em todos. */
let comFrontmatter = 0;
let markdownPuro = 0;
let procedenciaOk = 0;
let escondido = 0;
let total = 0;

for (const arquivo of readdirSync(DIR)) {
  if (!arquivo.endsWith(".md") || arquivo === "ATTRIBUTION.md") continue;
  total++;
  const t = readFileSync(join(DIR, arquivo), "utf8");

  if (t.startsWith("---")) comFrontmatter++;
  else markdownPuro++;

  if (t.includes("  Origem:  ")) procedenciaOk++;

  // O defeito que motivou este script: frontmatter atrás do comentário.
  if (!t.startsWith("---") && /-->\s*\r?\n\s*---\r?\n/.test(t)) {
    escondido++;
    console.error(`  frontmatter ainda escondido: ${arquivo}`);
  }
}

console.log(`\nfrontmatter na primeira linha: ${comFrontmatter}`);
console.log(`markdown puro, sem frontmatter: ${markdownPuro}`);
console.log(`procedência preservada:         ${procedenciaOk}/${total}`);
console.log(`frontmatter escondido:          ${escondido}`);

if (escondido > 0 || procedenciaOk !== total) {
  console.error("\nAlgum arquivo ficou fora da regra.");
  process.exit(1);
}
console.log("\nOk.");
