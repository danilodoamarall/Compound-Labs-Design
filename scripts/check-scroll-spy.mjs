// Testa a regra do scroll-spy sem navegador. O painel de preview não dispara
// evento de rolagem nem IntersectionObserver de forma confiável, então a lógica
// é verificada aqui, com as medidas reais da home.
import { readFileSync } from "node:fs";

// Lê a função direto do TypeScript, sem compilar: o arquivo é uma função pura.
const src = readFileSync(new URL("../src/lib/scroll-spy.ts", import.meta.url), "utf8");
const body = src
  .replace(/export function/, "function")
  .replace(/: \{ id: string; top: number \}\[\]/g, "")
  .replace(/: string\b/g, "")
  .replace(/: number/g, "")
  .replace(/\/\*\*[\s\S]*?\*\//g, "");
const activeSectionId = new Function(`${body}; return activeSectionId;`)();

// Posições medidas na home em 1440x900.
const SECOES = [
  { id: "inicio", top: 57 },
  { id: "resources", top: 752 },
  { id: "artigos", top: 2568 },
  { id: "research", top: 3872 },
];
const DOC = 5747;
const VH = 900;

const casos = [
  { nome: "topo da página", scroll: 0, esperado: "inicio" },
  { nome: "ainda no hero", scroll: 300, esperado: "inicio" },
  { nome: "entrando em Resources", scroll: 620, esperado: "resources" },
  { nome: "meio de Resources", scroll: 1500, esperado: "resources" },
  { nome: "um pixel antes de Artigos", scroll: 2417, esperado: "resources" },
  { nome: "entrando em Artigos", scroll: 2419, esperado: "artigos" },
  { nome: "meio de Artigos", scroll: 3000, esperado: "artigos" },
  { nome: "entrando em Research", scroll: 3730, esperado: "research" },
  { nome: "fim da página", scroll: DOC - VH, esperado: "research" },
];

let falhas = 0;
for (const caso of casos) {
  const obtido = activeSectionId(SECOES, caso.scroll, VH, DOC);
  if (obtido !== caso.esperado) {
    falhas++;
    console.error(`FALHOU  ${caso.nome}: scroll=${caso.scroll} deu "${obtido}", esperado "${caso.esperado}"`);
  }
}

// Casos de borda que quebram implementações ingênuas.
const bordas = [
  { nome: "lista vazia", args: [[], 0, VH, DOC], esperado: "" },
  { nome: "uma seção só", args: [[{ id: "a", top: 0 }], 500, VH, DOC], esperado: "a" },
  {
    nome: "última seção curta demais para cruzar a linha",
    args: [[{ id: "a", top: 0 }, { id: "b", top: 5700 }], 4847, VH, DOC],
    esperado: "b",
  },
  {
    nome: "janela maior que o documento",
    args: [[{ id: "a", top: 0 }, { id: "b", top: 300 }], 0, 2000, 1000],
    esperado: "b",
  },
];
for (const b of bordas) {
  const obtido = activeSectionId(...b.args);
  if (obtido !== b.esperado) {
    falhas++;
    console.error(`FALHOU  borda "${b.nome}": deu "${obtido}", esperado "${b.esperado}"`);
  }
}

const total = casos.length + bordas.length;
if (falhas) {
  console.error(`\n${falhas} de ${total} casos falharam.`);
  process.exit(1);
}
console.log(`scroll-spy: ${total} casos verificados, 0 falha.`);
