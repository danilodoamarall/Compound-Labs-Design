#!/usr/bin/env node
/**
 * CLI do catálogo de skills do AI Builders Lab.
 *
 * JavaScript puro, zero dependências, um arquivo. O ui-skills declara astro,
 * react e tailwind como dependências de produção e transpila TypeScript a cada
 * invocação, então o `npx` baixa a stack de um site inteiro para imprimir um
 * markdown. Isto aqui é `fetch` e `console.log`.
 *
 * Lê o mesmo registro que a página e o servidor MCP.
 */

const SITE = process.env.AI_SKILLS_SITE_URL ?? "https://labs-hub-five.vercel.app";

const AJUDA = `
  ai-skills — catálogo de skills de design engineering

  Uso:
    npx @ai-builders-lab/skills [comando]

  Comandos:
    start                       Imprime a skill de roteamento
    topics                      Lista os tópicos do catálogo
    list [--topic <t>]          Lista as skills
    list --query <termo>        Busca por texto
    get <slug>                  Imprime o markdown de uma skill
    licenses                    Mostra a distribuição de licenças

  Exemplos:
    npx @ai-builders-lab/skills list --topic motion
    npx @ai-builders-lab/skills get emilkowalski/animate

  Cada skill é de quem a escreveu. O catálogo hospeda só o que tem licença
  permissiva, e aponta para a origem no resto.
`;

/** Códigos de saída distintos, para dar para tratar em script. */
const SAIDA = { ARGS: 1, COMANDO: 2, NAO_ACHOU: 3, REDE: 4 };

function morrer(msg, codigo) {
  process.stderr.write(msg + "\n");
  process.exit(codigo);
}

async function buscarJson(caminho) {
  try {
    const res = await fetch(`${SITE}${caminho}`, { headers: { "user-agent": "ai-skills-cli" } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (e) {
    morrer(`Não consegui falar com ${SITE}: ${e.message}`, SAIDA.REDE);
  }
}

async function buscarTexto(caminho) {
  try {
    const res = await fetch(`${SITE}${caminho}`, { headers: { "user-agent": "ai-skills-cli" } });
    const texto = await res.text();
    // 300 é ambiguidade: o corpo já lista as opções.
    if (res.status === 300) morrer(texto.trim(), SAIDA.NAO_ACHOU);
    if (res.status === 404) morrer(texto.trim(), SAIDA.NAO_ACHOU);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return texto;
  } catch (e) {
    if (e.message?.startsWith("HTTP")) morrer(`Erro do servidor: ${e.message}`, SAIDA.REDE);
    morrer(`Não consegui falar com ${SITE}: ${e.message}`, SAIDA.REDE);
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

async function main() {
  const [comando, ...resto] = process.argv.slice(2);

  if (!comando || comando === "help" || comando === "--help" || comando === "-h") {
    process.stdout.write(AJUDA);
    return;
  }

  if (comando === "start") {
    process.stdout.write(await buscarTexto("/api/skills/ibelick__ui-skills-root"));
    return;
  }

  if (comando === "topics" || comando === "categories") {
    const dados = await buscarJson("/api/skills");
    for (const t of dados.topics) process.stdout.write(`${t.key}\t${t.count}\n`);
    return;
  }

  if (comando === "licenses") {
    const dados = await buscarJson("/api/skills");
    process.stdout.write(`${dados.counts.hosted} hospedadas, ${dados.counts.pointer} só apontadas\n\n`);
    for (const [lic, n] of Object.entries(dados.licenses)) {
      process.stdout.write(`${String(n).padStart(4)}  ${lic}\n`);
    }
    return;
  }

  if (comando === "list") {
    const topic = flag(resto, "topic") ?? flag(resto, "category");
    const query = flag(resto, "query");
    const params = new URLSearchParams();
    if (topic) params.set("topic", topic);
    if (query) params.set("query", query);
    const dados = await buscarJson(`/api/skills${params.size ? `?${params}` : ""}`);

    if (!dados.count) {
      morrer(topic ? `Nada em "${topic}".` : "Nada encontrado.", SAIDA.NAO_ACHOU);
    }

    for (const s of dados.skills) {
      // A marca do que não está hospedado: quem lê sabe que vai à origem.
      const marca = s.hosted ? " " : "↗";
      process.stdout.write(`${marca} ${s.pathSlug} — ${s.topics.join(", ")} — ${s.description}\n`);
    }
    return;
  }

  if (comando === "get") {
    const alvo = resto[0];
    if (!alvo) morrer("Faltou o nome da skill. Exemplo: get emilkowalski/animate", SAIDA.ARGS);
    process.stdout.write(await buscarTexto(`/api/skills/${encodeURIComponent(alvo.replace(/\//g, "__"))}`));
    return;
  }

  morrer(`Comando desconhecido: ${comando}\n${AJUDA}`, SAIDA.COMANDO);
}

main();
