import { test } from "node:test";
import assert from "node:assert/strict";
import {
  baseDoArquivo,
  ehRelativo,
  enderecoLegivel,
  fixarNoCommit,
  lerUrlGitHub,
  listarLinks,
  reescreverLinks,
  resolverDestino,
} from "./links.mjs";

const SHA = "6b56068f38110b3ee43036d952f4f1cf01918067";
const PINNED = `https://raw.githubusercontent.com/addyosmani/web-quality-skills/${SHA}/skills/accessibility/SKILL.md`;
const REPO = "https://github.com/addyosmani/web-quality-skills";
const PASTA = `${REPO}/blob/${SHA}/skills/accessibility`;
const RAW = `https://raw.githubusercontent.com/addyosmani/web-quality-skills/${SHA}/skills/accessibility`;

test("lerUrlGitHub: raw, refs/heads, blob, fora do GitHub", () => {
  assert.deepEqual(lerUrlGitHub("https://raw.githubusercontent.com/o/r/main/a/b.md"), {
    owner: "o",
    repo: "r",
    ref: "main",
    caminho: "a/b.md",
  });
  assert.deepEqual(lerUrlGitHub("https://raw.githubusercontent.com/o/r/refs/heads/canary/a/b.md"), {
    owner: "o",
    repo: "r",
    ref: "refs/heads/canary",
    caminho: "a/b.md",
  });
  assert.deepEqual(lerUrlGitHub("https://github.com/o/r/blob/main/a/b.md"), {
    owner: "o",
    repo: "r",
    ref: "main",
    caminho: "a/b.md",
  });
  assert.equal(lerUrlGitHub("https://www.rams.ai/rams.md"), null);
  assert.equal(lerUrlGitHub("https://github.com/o/r"), null);
  assert.equal(lerUrlGitHub(""), null);
  assert.equal(lerUrlGitHub(null), null);
});

test("fixarNoCommit: troca o segmento do ref, seja qual for o branch", () => {
  for (const ref of ["main", "master", "canary", "refs/heads/canary", "v1.2.3", SHA]) {
    assert.equal(
      fixarNoCommit(`https://raw.githubusercontent.com/vercel/next.js/${ref}/skills/x/SKILL.md`, SHA),
      `https://raw.githubusercontent.com/vercel/next.js/${SHA}/skills/x/SKILL.md`,
      ref
    );
  }
  // `main` no meio do caminho não é branch.
  assert.equal(
    fixarNoCommit("https://raw.githubusercontent.com/o/r/canary/src/main/SKILL.md", SHA),
    `https://raw.githubusercontent.com/o/r/${SHA}/src/main/SKILL.md`
  );
  assert.equal(fixarNoCommit("https://raw.githubusercontent.com/o/r/main/a.md", null), null);
  assert.equal(fixarNoCommit("https://raw.githubusercontent.com/o/r/main/a.md", "não-é-sha"), null);
  assert.equal(fixarNoCommit("https://www.rams.ai/rams.md", SHA), null);
});

test("enderecoLegivel: raw vira blob; fora do GitHub fica como está", () => {
  assert.equal(enderecoLegivel("https://raw.githubusercontent.com/o/r/main/a/b.md"), "https://github.com/o/r/blob/main/a/b.md");
  assert.equal(enderecoLegivel("https://www.rams.ai/rams.md"), "https://www.rams.ai/rams.md");
  assert.equal(enderecoLegivel(""), "");
});

test("ehRelativo: o que é caminho e o que não é", () => {
  for (const d of ["references/WCAG.md", "./a.md", "../b/SKILL.md", "a.md#x", "/raiz/a.md", "references/", "a.md?x=1"]) {
    assert.equal(ehRelativo(d), true, d);
  }
  for (const d of [
    "https://x.y/a",
    "http://x",
    "mailto:a@b.c",
    "#ancora",
    "//cdn.x/a.js",
    "data:image/png;base64,AAAA",
    "tel:123",
    "vscode://x",
    "",
    "{{ref:a.md}}",
    "<caminho>",
  ]) {
    assert.equal(ehRelativo(d), false, d);
  }
});

test("resolverDestino: ., .., raiz, âncora, pasta, imagem", () => {
  const base = baseDoArquivo(PINNED);
  assert.deepEqual(base.pasta, ["skills", "accessibility"]);
  assert.equal(resolverDestino("references/WCAG.md", base), `${PASTA}/references/WCAG.md`);
  assert.equal(resolverDestino("./references/WCAG.md", base), `${PASTA}/references/WCAG.md`);
  assert.equal(resolverDestino("references/A11Y.md#modal-focus-trap", base), `${PASTA}/references/A11Y.md#modal-focus-trap`);
  assert.equal(resolverDestino("../performance/SKILL.md#lcp", base), `${REPO}/blob/${SHA}/skills/performance/SKILL.md#lcp`);
  assert.equal(resolverDestino("../../README.md", base), `${REPO}/blob/${SHA}/README.md`);
  assert.equal(resolverDestino("../../../../fora.md", base), `${REPO}/blob/${SHA}/fora.md`); // não passa da raiz
  assert.equal(resolverDestino("/LICENSE", base), `${REPO}/blob/${SHA}/LICENSE`);
  assert.equal(resolverDestino("references/", base), `${REPO}/tree/${SHA}/skills/accessibility/references`);
  assert.equal(resolverDestino("..", base), `${REPO}/tree/${SHA}/skills`);
  assert.equal(resolverDestino("assets/logo.png", base, { imagem: true }), `${RAW}/assets/logo.png`);
  assert.equal(resolverDestino("a.md?x=1", base), `${PASTA}/a.md?x=1`);
});

test("reescreverLinks: reescreve o que deve e preserva o resto", () => {
  const md = [
    "# Skill",
    "",
    'Veja [WCAG](references/WCAG.md) e o [padrão](references/A11Y.md#modal "Título").',
    "Absoluto [site](https://example.com/a.md), âncora [aqui](#secao), [mail](mailto:a@b.c), vazio []().",
    "Imagem ![logo](assets/logo.png) e dado ![p](data:image/png;base64,AAAA).",
    "Badge [![ci](badge.svg)](docs/ci.md).",
    "Template [voz]({{ref:voice.md}}) fica.",
    "Código `[span_1](start_span)` fica; `` [x](a`b.md) `` também.",
    "Parênteses [p](foo_(bar).md).",
    "| [`useSSRWidth`](references/useSSRWidth.md) | como [`useMediaQuery`](../useMediaQuery/index.md) ou `x` | AUTO |",
    "",
    "```md",
    "[exemplo](references/EXEMPLO.md)",
    "```",
    "",
    "  1. Passo",
    "     ```",
    "     [Snapshot](.playwright-cli/page.yml)",
    "     ```",
    "",
    "~~~",
    "[t](tilde.md)",
    "~~~",
    "",
    "[wcag-ref]: references/WCAG.md",
    '[com-titulo]: ./references/B.md "B"',
    "[^1]: nota de rodapé, não link.",
    "[abs]: https://example.com",
  ].join("\n");

  const { texto, reescritos, resolvido } = reescreverLinks(md, PINNED);
  assert.equal(resolvido, true);
  assert.equal(reescritos, 10); // WCAG, A11Y#modal, logo.png, badge.svg, docs/ci.md, foo_(bar).md, 2 na tabela, 2 refdefs

  const esperado = [
    "# Skill",
    "",
    `Veja [WCAG](${PASTA}/references/WCAG.md) e o [padrão](${PASTA}/references/A11Y.md#modal "Título").`,
    "Absoluto [site](https://example.com/a.md), âncora [aqui](#secao), [mail](mailto:a@b.c), vazio []().",
    `Imagem ![logo](${RAW}/assets/logo.png) e dado ![p](data:image/png;base64,AAAA).`,
    `Badge [![ci](${RAW}/badge.svg)](${PASTA}/docs/ci.md).`,
    "Template [voz]({{ref:voice.md}}) fica.",
    "Código `[span_1](start_span)` fica; `` [x](a`b.md) `` também.",
    `Parênteses [p](${PASTA}/foo_(bar).md).`,
    `| [\`useSSRWidth\`](${PASTA}/references/useSSRWidth.md) | como [\`useMediaQuery\`](${REPO}/blob/${SHA}/skills/useMediaQuery/index.md) ou \`x\` | AUTO |`,
    "",
    "```md",
    "[exemplo](references/EXEMPLO.md)",
    "```",
    "",
    "  1. Passo",
    "     ```",
    "     [Snapshot](.playwright-cli/page.yml)",
    "     ```",
    "",
    "~~~",
    "[t](tilde.md)",
    "~~~",
    "",
    `[wcag-ref]: ${PASTA}/references/WCAG.md`,
    `[com-titulo]: ${PASTA}/references/B.md "B"`,
    "[^1]: nota de rodapé, não link.",
    "[abs]: https://example.com",
  ].join("\n");
  assert.equal(texto, esperado);

  // Idempotente: a segunda passada não encontra nada.
  const segunda = reescreverLinks(texto, PINNED);
  assert.equal(segunda.reescritos, 0);
  assert.equal(segunda.texto, texto);
});

test("reescreverLinks: preserva CRLF", () => {
  const md = "# T\r\n\r\n[a](references/a.md)\r\n\r\n```\r\n[b](references/b.md)\r\n```\r\n[c]: references/c.md\r\n";
  const { texto, reescritos } = reescreverLinks(md, PINNED);
  assert.equal(reescritos, 2);
  assert.equal(
    texto,
    `# T\r\n\r\n[a](${PASTA}/references/a.md)\r\n\r\n\`\`\`\r\n[b](references/b.md)\r\n\`\`\`\r\n[c]: ${PASTA}/references/c.md\r\n`
  );
  assert.equal((texto.match(/(?<!\r)\n/g) ?? []).length, 0);
});

test("reescreverLinks: cerca não fechada engole até o fim; cerca curta não fecha longa", () => {
  const md = "````\n[a](a.md)\n```\n[b](b.md)\n";
  const { texto, reescritos } = reescreverLinks(md, PINNED);
  assert.equal(reescritos, 0);
  assert.equal(texto, md);
});

test("reescreverLinks: sem base do GitHub, não toca", () => {
  const md = "[a](references/a.md)";
  const r = reescreverLinks(md, "https://www.rams.ai/rams.md");
  assert.equal(r.resolvido, false);
  assert.equal(r.texto, md);
  assert.equal(r.reescritos, 0);
  assert.equal(reescreverLinks(md, null).resolvido, false);
});

test("listarLinks: separa o que está em código e o que é placeholder", () => {
  const md = "[a](references/a.md) `[b](c)` [d]({{x}}) [e](#x) [f](https://g)\n```\n[h](i.md)\n```\n[j]: k.md\n";
  const itens = listarLinks(md);
  assert.deepEqual(
    itens.map((i) => [i.destino, i.emCodigo, i.refdef, i.linha]),
    [
      ["references/a.md", false, false, 1],
      ["c", true, false, 1],
      ["{{x}}", false, false, 1],
      ["i.md", true, false, 3],
      ["k.md", false, true, 5],
    ]
  );
});
