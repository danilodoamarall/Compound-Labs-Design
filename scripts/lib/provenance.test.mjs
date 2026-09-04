import { test } from "node:test";
import assert from "node:assert/strict";
import matter from "gray-matter";
import { blocoProcedencia, comProcedencia, fimDoFrontmatter } from "./provenance.mjs";

const COMENTARIO = blocoProcedencia({
  origem: "https://github.com/o/r/blob/main/SKILL.md",
  autor: "o",
  licenca: "MIT",
  commit: "abc",
  data: "2026-09-04",
});

test("blocoProcedencia: sem commit, sem linha de commit; nunca linha vazia", () => {
  const semCommit = blocoProcedencia({ origem: "x", autor: "a", licenca: "MIT", commit: null, data: "d" });
  assert.equal(semCommit.split("\n").length, 6);
  assert.ok(!semCommit.includes("Commit:"));
  assert.ok(!semCommit.includes("\n\n"));
  assert.ok(COMENTARIO.includes("  Commit:  abc"));
});

test("com frontmatter: o comentário vai depois, e o YAML continua legível", () => {
  const md = "---\nname: x\ndescription: y\n---\n\n# Título\n\ncorpo\n";
  const saida = comProcedencia(md, COMENTARIO);
  // Linha em branco entre o `---` e o comentário: é o formato dos 189 arquivos já copiados.
  assert.equal(saida, `---\nname: x\ndescription: y\n---\n\n${COMENTARIO}\n\n# Título\n\ncorpo\n`);
  const lido = matter(saida);
  assert.deepEqual(lido.data, { name: "x", description: "y" });
  assert.ok(lido.content.includes(COMENTARIO));
  assert.ok(lido.content.includes("# Título"));
});

test("sem frontmatter: o comentário vai no topo", () => {
  const md = "# Título\n\ncorpo\n";
  const saida = comProcedencia(md, COMENTARIO);
  assert.equal(saida, `${COMENTARIO}\n\n${md}`);
  assert.deepEqual(matter(saida).data, {});
});

test("abre `---` e nunca fecha: não há frontmatter válido; comentário no topo, texto intacto", () => {
  const md = "---\nname: x\n\n# Título\n\ncorpo sem fechamento\n";
  assert.equal(fimDoFrontmatter(md), -1);

  const saida = comProcedencia(md, COMENTARIO);
  assert.equal(saida, `${COMENTARIO}\n\n${md}`);

  // A divergência deliberada: o gray-matter trata a ENTRADA como YAML do
  // começo ao fim (corpo vazio, ou erro de parse). A SAÍDA ele lê como um
  // arquivo sem frontmatter, com todo o texto original no corpo.
  const entradaEngolida = (() => {
    try {
      return matter(md).content === "";
    } catch {
      return true;
    }
  })();
  assert.equal(entradaEngolida, true);
  const lido = matter(saida);
  assert.deepEqual(lido.data, {});
  assert.ok(lido.content.includes("corpo sem fechamento"));
});

test("vazio", () => {
  assert.equal(fimDoFrontmatter(""), -1);
  assert.equal(comProcedencia("", COMENTARIO), `${COMENTARIO}\n\n`);
});

test("`---` de novo no corpo: só o primeiro fechamento conta", () => {
  const md = "---\nname: x\n---\n\n# T\n\n---\n\ntexto\n";
  const saida = comProcedencia(md, COMENTARIO);
  assert.equal(saida, `---\nname: x\n---\n\n${COMENTARIO}\n\n# T\n\n---\n\ntexto\n`);
  const lido = matter(saida);
  assert.deepEqual(lido.data, { name: "x" });
  assert.ok(lido.content.includes("\n---\n\ntexto"));
});

test("CRLF: comentário em CRLF, frontmatter intacto, nenhum \\n solto", () => {
  const md = "---\r\nname: x\r\n---\r\n\r\n# T\r\n\r\ncorpo\r\n";
  const saida = comProcedencia(md, COMENTARIO);
  assert.equal(saida, `---\r\nname: x\r\n---\r\n\r\n${COMENTARIO.replace(/\n/g, "\r\n")}\r\n\r\n# T\r\n\r\ncorpo\r\n`);
  assert.equal((saida.match(/(?<!\r)\n/g) ?? []).length, 0);
  assert.deepEqual(matter(saida).data, { name: "x" });
});

test("CRLF sem frontmatter: comentário em CRLF no topo", () => {
  const md = "# T\r\n\r\ncorpo\r\n";
  const saida = comProcedencia(md, COMENTARIO);
  assert.equal(saida, `${COMENTARIO.replace(/\n/g, "\r\n")}\r\n\r\n${md}`);
});

test("`----` na primeira linha é régua, não frontmatter (como o gray-matter lê)", () => {
  const md = "----\n\ntexto\n";
  assert.equal(fimDoFrontmatter(md), -1);
  assert.equal(comProcedencia(md, COMENTARIO), `${COMENTARIO}\n\n${md}`);
  assert.deepEqual(matter(md).data, {});
});

test("fimDoFrontmatter: posição do corte", () => {
  assert.equal(fimDoFrontmatter("---\nname: x\n---\ncorpo"), "---\nname: x\n---\n".length);
  assert.equal(fimDoFrontmatter("---\nname: x\n---"), "---\nname: x\n---".length); // sem \n final
  assert.equal(fimDoFrontmatter("---\n---\n"), "---\n---\n".length); // frontmatter vazio, mas fechado
  assert.equal(fimDoFrontmatter("---"), -1);
  assert.equal(fimDoFrontmatter("--- x"), -1);
});
