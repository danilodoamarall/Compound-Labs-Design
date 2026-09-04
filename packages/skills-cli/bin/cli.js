#!/usr/bin/env node
/**
 * CLI do catálogo de skills do Compound Design.
 *
 * JavaScript puro, zero dependências, um arquivo. O ui-skills declara astro,
 * react e tailwind como dependências de produção e transpila TypeScript a cada
 * invocação, então o `npx` baixa a stack de um site inteiro para imprimir um
 * markdown. Isto aqui é `fetch` e `console.log`.
 *
 * Lê o mesmo registro que a página e o servidor MCP.
 */
import { readFileSync } from "node:fs";

const SITE = (process.env.AI_SKILLS_SITE_URL ?? "https://compounddesign.vercel.app").replace(/\/+$/, "");

const VERSAO = (() => {
  try {
    return JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8")).version;
  } catch {
    return "desconhecida";
  }
})();

/** O teto de uma página no servidor. `--all` pagina até o fim usando isto. */
const TETO_SERVIDOR = 200;

const AJUDA = `
  ai-skills — catálogo de skills de design engineering

  Uso:
    npx @compound-design/skills [comando]

  Comandos:
    start                       Imprime a skill de roteamento do catálogo
    topics                      Lista os tópicos, com a contagem de cada um
    list [--topic <t>]          Lista as skills de um tópico
    list --query <termo>        Busca por texto
    list --all                  Lista o catálogo inteiro, paginando
    get <slug>                  Imprime o markdown de uma skill
    licenses                    Mostra a distribuição de licenças

  Opções de list:
    --limit <n>                 Quantas devolver (padrão 40, máximo ${TETO_SERVIDOR})
    --offset <n>                A partir de qual posição

  Outras:
    --version, -v               A versão deste CLI
    --help, -h                  Esta ajuda

  Exemplos:
    npx @compound-design/skills list --topic motion
    npx @compound-design/skills get emilkowalski/animate

  Cada skill é de quem a escreveu. O catálogo hospeda só o que tem licença
  permissiva, e aponta para a origem no resto.
`;

/** Códigos de saída distintos, para dar para tratar em script. */
const SAIDA = { ARGS: 1, COMANDO: 2, NAO_ACHOU: 3, REDE: 4 };

/** Uma saída com código, propagada como exceção.
 *
 *  Antes `morrer` escrevia no stderr e chamava `process.exit()` na hora. No
 *  Windows, quando a saída é um cano, a escrita é assíncrona: matar o processo
 *  com ela pendente dispara `Assertion failed: !(handle->flags &
 *  UV_HANDLE_CLOSING)` no libuv e o processo termina com 127, não com o código
 *  pedido. Todo erro de "não encontrado" saía errado por causa disso.
 *
 *  Agora a mensagem é escrita num lugar só, no fim, e o código vai em
 *  `process.exitCode`, que deixa o node terminar sozinho depois de esvaziar as
 *  saídas. */
class Saida extends Error {
  constructor(mensagem, codigo) {
    super(mensagem);
    this.name = "Saida";
    this.codigo = codigo;
  }
}

function morrer(mensagem, codigo) {
  throw new Saida(mensagem, codigo);
}

const CABECALHOS = { "user-agent": `ai-skills-cli/${VERSAO}` };

/** Traduz uma falha de rede ou de status para uma Saida com a mensagem certa.
 *
 *  Uma `Saida` que já subiu de dentro do `try` passa direto: sem isto, um 404
 *  legítimo seria reembalado como falha de rede pelo próprio `catch` que
 *  deveria só tratar rede. */
function comoSaida(e) {
  if (e instanceof Saida) return e;
  return new Saida(`Não consegui falar com ${SITE}: ${e.message}`, SAIDA.REDE);
}

async function buscarJson(caminho) {
  try {
    const res = await fetch(`${SITE}${caminho}`, { headers: CABECALHOS });
    if (res.status === 429) morrer("O servidor pediu para desacelerar. Tente em um minuto.", SAIDA.REDE);
    if (!res.ok) morrer(`Erro do servidor: HTTP ${res.status}`, SAIDA.REDE);
    return await res.json();
  } catch (e) {
    throw comoSaida(e);
  }
}

async function buscarTexto(caminho) {
  try {
    const res = await fetch(`${SITE}${caminho}`, { headers: CABECALHOS });
    const texto = await res.text();
    // 300 é ambiguidade: o corpo já lista as opções.
    if (res.status === 300 || res.status === 404) morrer(texto.trim(), SAIDA.NAO_ACHOU);
    if (res.status === 429) morrer("O servidor pediu para desacelerar. Tente em um minuto.", SAIDA.REDE);
    if (!res.ok) morrer(`Erro do servidor: HTTP ${res.status}`, SAIDA.REDE);
    return texto;
  } catch (e) {
    throw comoSaida(e);
  }
}

/** Lê `--chave valor` de um vetor de argumentos. */
function flag(args, nome) {
  const i = args.indexOf(`--${nome}`);
  if (i === -1) return undefined;
  const v = args[i + 1];
  if (!v || v.startsWith("--")) morrer(`A opção --${nome} precisa de um valor.`, SAIDA.ARGS);
  return v;
}

/** Um número de opção, recusando o que não é número em vez de virar NaN.
 *
 *  `min` existe porque `--limit 0` passava na validação e depois era descartado
 *  em silêncio, devolvendo 40. Recusar é melhor que ignorar: quem pediu zero
 *  errou, e um resultado diferente do pedido sem aviso é o pior desfecho. */
function flagNumero(args, nome, { min = 0 } = {}) {
  const bruto = flag(args, nome);
  if (bruto === undefined) return undefined;
  const n = Number.parseInt(bruto, 10);
  if (!Number.isFinite(n) || String(n) !== bruto.trim()) {
    morrer(`A opção --${nome} precisa de um número inteiro. Recebi "${bruto}".`, SAIDA.ARGS);
  }
  if (n < min) morrer(`A opção --${nome} precisa ser ${min} ou mais. Recebi ${n}.`, SAIDA.ARGS);
  return n;
}

function imprimirSkills(skills) {
  for (const s of skills) {
    // A marca do que não está hospedado: quem lê sabe que vai à origem.
    const marca = s.hosted ? " " : "↗";
    process.stdout.write(`${marca} ${s.pathSlug} — ${s.topics.join(", ")} — ${s.description}\n`);
  }
}

async function comandoList(resto) {
  const topic = flag(resto, "topic") ?? flag(resto, "category");
  const query = flag(resto, "query");
  const limit = flagNumero(resto, "limit", { min: 1 });
  const offset = flagNumero(resto, "offset", { min: 0 });
  const tudo = resto.includes("--all");

  const params = new URLSearchParams();
  if (topic) params.set("topic", topic);
  if (query) params.set("query", query);
  if (offset) params.set("offset", String(offset));
  if (limit) params.set("limit", String(limit));

  const buscarPagina = async (deslocamento) => {
    const p = new URLSearchParams(params);
    if (deslocamento !== undefined) p.set("offset", String(deslocamento));
    if (tudo) p.set("limit", String(TETO_SERVIDOR));
    return buscarJson(`/api/skills${p.size ? `?${p}` : ""}`);
  };

  const primeira = await buscarPagina(offset);

  if (!primeira.total) {
    morrer(topic ? `Nada no tópico "${topic}".` : "Nada encontrado.", SAIDA.NAO_ACHOU);
  }

  imprimirSkills(primeira.skills);

  /*  `--all` diz "o catálogo inteiro", então precisa entregar o catálogo
   *  inteiro. Antes ele mandava limit=200 uma vez só e parava em 200 de 269,
   *  o que é pior que paginar: a ajuda promete tudo e a saída entrega parte
   *  sem dizer que parou. */
  if (tudo) {
    let pagina = primeira;
    while (pagina.hasMore) {
      pagina = await buscarPagina(pagina.nextOffset);
      imprimirSkills(pagina.skills);
    }
    return;
  }

  //  O que ficou de fora é dito, e no stderr, para não sujar quem canaliza.
  if (primeira.hasMore) {
    const faltam = primeira.total - primeira.offset - primeira.returned;
    process.stderr.write(
      `\n${primeira.returned} de ${primeira.total}. Faltam ${faltam}: ` +
        `use --offset ${primeira.nextOffset}, --limit, --all, ou filtre com --topic.\n`
    );
  }
}

async function main() {
  const [comando, ...resto] = process.argv.slice(2);

  if (comando === "--version" || comando === "-v" || comando === "version") {
    process.stdout.write(`${VERSAO}\n`);
    return;
  }

  if (!comando || comando === "help" || comando === "--help" || comando === "-h") {
    process.stdout.write(AJUDA);
    return;
  }

  if (comando === "start") {
    // A skill de roteamento é gerada do nosso registro, com os nossos comandos.
    process.stdout.write(await buscarTexto("/api/skills/start"));
    return;
  }

  if (comando === "topics" || comando === "categories") {
    const dados = await buscarJson("/api/skills?limit=1");
    for (const t of dados.topics) process.stdout.write(`${t.key}\t${t.count}\n`);
    return;
  }

  if (comando === "licenses") {
    const dados = await buscarJson("/api/skills?limit=1");
    process.stdout.write(`${dados.counts.hosted} hospedadas, ${dados.counts.pointer} só apontadas\n\n`);
    for (const [lic, n] of Object.entries(dados.licenses)) {
      process.stdout.write(`${String(n).padStart(4)}  ${lic}\n`);
    }
    return;
  }

  if (comando === "list") return comandoList(resto);

  if (comando === "get") {
    const alvo = resto[0];
    if (!alvo) morrer("Faltou o nome da skill. Exemplo: get emilkowalski/animate", SAIDA.ARGS);
    process.stdout.write(await buscarTexto(`/api/skills/${encodeURIComponent(alvo.replace(/\//g, "__"))}`));
    return;
  }

  morrer(`Comando desconhecido: ${comando}\n${AJUDA}`, SAIDA.COMANDO);
}

main().catch((e) => {
  const saida = e instanceof Saida ? e : new Saida(`Erro inesperado: ${e?.message ?? e}`, SAIDA.ARGS);
  process.stderr.write(saida.message + "\n");
  // `exitCode` e não `exit()`: deixa o node esvaziar stdout e stderr antes de
  // sair. Ver o comentário da classe Saida.
  process.exitCode = saida.codigo;
});
