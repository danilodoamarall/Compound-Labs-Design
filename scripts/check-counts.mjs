// Confere os números que a prosa escreve sobre o próprio produto.
//
// Cerca de quarenta contagens estavam escritas à mão — "em quatro formatos",
// "os nove destinos em três grupos", "5+3+4, depois 4+4+4", "Cinco artigos" —
// e nada as conferia. Ao remover uma seção, todas ficariam silenciosamente
// erradas; duas já estavam. É o mesmo modo de falha que o ADR-0001 descreve
// para os percentuais dos artigos, e o remédio é o mesmo: derivar o valor
// real e quebrar o build quando a prosa divergir.
//
// Como funciona: cada asserção diz onde está o texto, que expressão captura o
// número, e de qual contagem real ele tem de bater. Números por extenso em
// português e inglês são aceitos até doze.
//
// Uso: node scripts/check-counts.mjs   (roda no prebuild)
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const ler = (p) => readFileSync(join(root, p), "utf8");
const json = (p) => JSON.parse(ler(p));

/* ------------------------------ contagens reais ------------------------------ */

const siteTs = ler("src/lib/site.ts");
const secoes = (siteTs.match(/^\s*\{ key: "(\w+)", href: "/gm) || []).length;
const gruposNav = (siteTs.match(/^\s*\{ key: "(\w+)", itens: \[/gm) || []).length;
const destinosNav = [...siteTs.matchAll(/itens: \[([^\]]+)\]/g)]
  .flatMap((m) => m[1].split(",").map((s) => s.trim()).filter(Boolean)).length;

const artigos = readdirSync(join(root, "content/artigos")).filter((f) => f.endsWith(".pt.mdx")).length;

const registro = json("content/skills-registry.json");
const skillsTotal = registro.counts.total;
const skillsHospedadas = registro.counts.hosted;
const skillsPonteiro = registro.counts.pointer;

const indice = json("content/resources.json");
const recursos = indice.resources.length;

const pagesJson = json("content/pages.json");
const docsSecoes = pagesJson.docs.pt.length;
const faqPerguntas = pagesJson.faq.pt.length;

// O bento: cada linha tem de somar 12. Lê o BENTO da home.
const homeTsx = ler("src/app/[locale]/page.tsx");
const spans = [...homeTsx.matchAll(/\{ key: "\w+", span: (\d+),/g)].map((m) => Number(m[1]));
const cardsBento = spans.length;

// Ferramentas do MCP: registerTool no servidor.
const mcpRoute = ler("src/app/mcp/route.ts");
const ferramentasMcp = (mcpRoute.match(/server\.registerTool\(/g) || []).length;

const reais = {
  secoes, gruposNav, destinosNav, artigos,
  skillsTotal, skillsHospedadas, skillsPonteiro,
  recursos, docsSecoes, faqPerguntas, cardsBento, ferramentasMcp,
};

/* --------------------------- números por extenso ---------------------------- */

const EXTENSO = {
  um: 1, uma: 1, one: 1,
  dois: 2, duas: 2, two: 2,
  tres: 3, três: 3, three: 3,
  quatro: 4, four: 4,
  cinco: 5, five: 5,
  seis: 6, six: 6,
  sete: 7, seven: 7,
  oito: 8, eight: 8,
  nove: 9, nine: 9,
  dez: 10, ten: 10,
  onze: 11, eleven: 11,
  doze: 12, twelve: 12,
};

const paraNumero = (s) => {
  const t = s.trim().toLowerCase().replace(/\./g, "").replace(",", ".");
  if (t in EXTENSO) return EXTENSO[t];
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
};

/* -------------------------------- asserções --------------------------------- */

/** { arquivo, regex com um grupo de captura, esperado (chave de `reais`) }.
 *  Uma regex que não casa é erro também: significa que a frase mudou e a
 *  asserção ficou órfã. */
// `\p{L}` e não `\w`: "Três" tem acento, e `\w` só casa ASCII. A primeira
// versão desta lista capturava "s" de "Três" e culpava a prosa.
const N = String.raw`([\p{L}\d.,]+)`;
const re = (fonte, flags = "") => new RegExp(fonte.replace("{N}", N), flags + "u");

const ASSERCOES = [
  // A prosa do produto
  { arquivo: "messages/pt.json", re: re(String.raw`"articlesTitle": "{N} artigos`), esperado: "artigos" },
  { arquivo: "messages/en.json", re: re(String.raw`"articlesTitle": "{N} articles`), esperado: "artigos" },
  { arquivo: "messages/pt.json", re: re(String.raw`"indexDek": "{N} artigos`), esperado: "artigos" },
  { arquivo: "messages/en.json", re: re(String.raw`"indexDek": "{N} articles`), esperado: "artigos" },

  // O README anuncia o que o pacote CLI entrega
  { arquivo: "packages/skills-cli/README.md", re: re(String.raw`O catálogo tem {N} entradas`), esperado: "skillsTotal" },
  { arquivo: "packages/skills-cli/README.md", re: re(String.raw`\*\*{N}\*\* estão sob licença permissiva`), esperado: "skillsHospedadas" },
  { arquivo: "packages/skills-cli/README.md", re: re(String.raw`\*\*{N}\*\* não declaram licença`), esperado: "skillsPonteiro" },
  { arquivo: "packages/skills-cli/README.md", re: re(String.raw`{N} ferramentas: \x60list_topics\x60`, "i"), esperado: "ferramentasMcp" },

  // Comentários de código que descrevem estrutura
  { arquivo: "src/app/mcp/route.ts", re: re(String.raw`^ \*  {N} ferramentas\.`, "m"), esperado: "ferramentasMcp" },
];

/** Invariante que não é uma frase: as linhas do bento somam 12. */
function conferirBento() {
  const problemas = [];
  let linha = [];
  let soma = 0;
  for (const s of spans) {
    linha.push(s);
    soma += s;
    if (soma === 12) { linha = []; soma = 0; }
    else if (soma > 12) { problemas.push(`linha do bento passa de 12: ${linha.join("+")} = ${soma}`); linha = []; soma = 0; }
  }
  if (soma !== 0) problemas.push(`última linha do bento incompleta: ${linha.join("+")} = ${soma} (falta ${12 - soma})`);
  return problemas;
}

/** Palavras que não deviam mais existir na prosa visível. */
const PROIBIDAS = [
  { arquivo: "messages/pt.json", re: /radar/i, motivo: "a seção Radar foi removida" },
  { arquivo: "messages/en.json", re: /radar/i, motivo: "a seção Radar foi removida" },
  { arquivo: "content/pages.json", re: /radar/i, motivo: "a seção Radar foi removida" },
  { arquivo: "messages/pt.json", re: /"[^"]*\b(usamos|eu mantenho|do meu dia|meu site)\b[^"]*"/i, motivo: "voz de curador na copy do produto" },
];

/* ------------------------------ a URL do site ------------------------------- */

/** O README do pacote npm não pode importar `site-url.ts`, então carrega a URL
 *  escrita. Esta asserção garante que ela é a mesma que o código usa como
 *  padrão de produção: se o domínio mudar, o build avisa em vez de o README
 *  publicado apontar para o lugar errado por meses. */
function conferirUrlDoSite() {
  const siteUrl = ler("src/lib/site-url.ts");
  const padrao = siteUrl.match(/return "(https:\/\/[^"]+)";/)?.[1];
  if (!padrao) return ["src/lib/site-url.ts: não achei a URL padrão de produção"];
  const readme = ler("packages/skills-cli/README.md");
  const urls = [...new Set([...readme.matchAll(/https:\/\/[a-z0-9.-]+\.vercel\.app/g)].map((m) => m[0]))];
  return urls
    .filter((u) => u !== padrao)
    .map((u) => `packages/skills-cli/README.md aponta para ${u}, mas a produção é ${padrao}`);
}

/* ----------------------------------- roda ----------------------------------- */

const erros = [];
erros.push(...conferirUrlDoSite());

for (const a of ASSERCOES) {
  if (!existsSync(join(root, a.arquivo))) { erros.push(`${a.arquivo}: arquivo não existe`); continue; }
  const texto = ler(a.arquivo);
  const m = texto.match(a.re);
  if (!m) { erros.push(`${a.arquivo}: a frase esperada não foi encontrada (${a.re})`); continue; }
  const escrito = paraNumero(m[1]);
  const real = reais[a.esperado];
  if (escrito !== real) {
    const linha = texto.slice(0, m.index).split("\n").length;
    erros.push(`${a.arquivo}:${linha} diz "${m[1]}", mas ${a.esperado} = ${real}`);
  }
}

erros.push(...conferirBento());

for (const p of PROIBIDAS) {
  const texto = ler(p.arquivo);
  const m = texto.match(p.re);
  if (m) {
    const linha = texto.slice(0, m.index).split("\n").length;
    erros.push(`${p.arquivo}:${linha} contém "${m[0].slice(0, 60)}" — ${p.motivo}`);
  }
}

console.log("contagens reais:", JSON.stringify(reais));
console.log(`bento: ${spans.join("+")} em ${cardsBento} cards`);

if (erros.length) {
  console.error(`\n${erros.length} divergência(s) entre a prosa e o produto:\n`);
  for (const e of erros) console.error(`  ✗ ${e}`);
  console.error("\nCorrija o texto, ou a asserção em scripts/check-counts.mjs se a frase mudou de propósito.\n");
  process.exit(1);
}

console.log(`\n${ASSERCOES.length} asserções, ${PROIBIDAS.length} proibições, bento fechado. Ok.`);
