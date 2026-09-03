// Detecta conteúdo MDX que o pipeline descarta em silêncio.
//
// next-mdx-remote@6 remove expressões JavaScript do MDX por padrão (blockJS),
// incluindo props como <Stat value={82.6} />. A prop simplesmente não chega ao
// componente: sem erro, sem log, sem build quebrado. Ver docs/adr/0001.
//
// A checagem compila cada arquivo duas vezes, com e sem o bloqueio, e compara.
// Qualquer diferença é conteúdo perdido. Sem heurística, sem falso positivo.
//
// Uso: node scripts/check-mdx.mjs
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { serialize } from "next-mdx-remote/serialize";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(root, "content/artigos");

/** Localiza a linha de cada expressão JSX no fonte, para apontar o erro. */
function findExpressions(source) {
  const hits = [];
  source.split("\n").forEach((line, i) => {
    for (const m of line.matchAll(/([A-Za-z-]+)=\{/g)) hits.push({ line: i + 1, text: `${m[1]}={…}` });
  });
  return hits;
}

let problems = 0;
const files = readdirSync(dir).filter((f) => f.endsWith(".mdx"));

for (const file of files) {
  const path = join(dir, file);
  const source = readFileSync(path, "utf8");
  const opts = { parseFrontmatter: true };

  const [blocked, full] = await Promise.all([
    serialize(source, opts, true),
    serialize(source, { ...opts, blockJS: false }, true),
  ]);

  if (blocked.compiledSource === full.compiledSource) continue;

  problems += 1;
  console.error(`\n${relative(root, path)}`);
  const hits = findExpressions(source);
  if (hits.length) {
    for (const h of hits) console.error(`  linha ${h.line}: ${h.text} é descartado antes de chegar ao componente`);
  } else {
    console.error("  há uma expressão {…} no texto que é removida na compilação");
  }
}

if (problems) {
  console.error(`\n${problems} de ${files.length} arquivo(s) com conteúdo descartado.`);
  console.error("Props em MDX são sempre string: use value=\"82.6\", nunca value={82.6}.");
  console.error("O componente formata o número no idioma da página. Ver docs/adr/0001-pipeline-de-conteudo-mdx.md\n");
  process.exit(1);
}

console.log(`${files.length} arquivos MDX verificados, nenhum conteúdo descartado.`);
