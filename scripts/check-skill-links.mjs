/** A prova: nenhum link relativo restante nas skills hospedadas.
 *
 *  Conta, em cada arquivo listado como hospedado no registro, todo destino de
 *  link que não é absoluto nem âncora. O que fica fora de código e é um caminho
 *  de verdade é defeito, e o script sai com 1. O que está dentro de bloco ou
 *  span de código (exemplo, não navegação) ou é placeholder de template
 *  (`{{…}}`) é listado à parte, para que se veja exatamente o que foi deixado
 *  e por quê.
 *
 *  Uso: node scripts/check-skill-links.mjs */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ehRelativo, listarLinks } from "./lib/links.mjs";

const RAIZ = process.cwd();
const DIR = join(RAIZ, "content", "skills");
const registro = JSON.parse(readFileSync(join(RAIZ, "content", "skills-registry.json"), "utf8"));

let verificados = 0;
const pendentes = [];
const emCodigo = [];
const placeholders = [];

for (const s of registro.skills) {
  if (!s.hosted || !s.file) continue;
  verificados++;
  const texto = readFileSync(join(DIR, s.file), "utf8");
  for (const item of listarLinks(texto)) {
    const onde = `${s.file}:${item.linha}`;
    if (item.emCodigo) emCodigo.push(`${onde}  ${item.destino}`);
    else if (!ehRelativo(item.destino)) placeholders.push(`${onde}  ${item.destino}`);
    else pendentes.push(`${onde}  ${item.destino}`);
  }
}

console.log(`arquivos verificados:       ${verificados}`);
console.log(`links relativos restantes:  ${pendentes.length}`);
for (const p of pendentes) console.log(`  ${p}`);

console.log(`\nignorados de propósito:     ${emCodigo.length + placeholders.length}`);
if (emCodigo.length) {
  console.log(`  em bloco ou span de código (exemplo, não navegação): ${emCodigo.length}`);
  for (const p of emCodigo) console.log(`    ${p}`);
}
if (placeholders.length) {
  console.log(`  placeholder de template, não caminho: ${placeholders.length}`);
  for (const p of placeholders) console.log(`    ${p}`);
}

if (pendentes.length) {
  console.error("\nAinda há links relativos quebrados.");
  process.exit(1);
}
console.log("\nOk.");
