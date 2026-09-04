// Traz o conteúdo das skills de licença permissiva para dentro do repositório,
// e monta o registro do catálogo.
//
// Três decisões que divergem do ui-skills de propósito:
//
//  1. O registro carrega a licença de cada skill. O deles não carrega nenhuma,
//     em nenhuma das 269 entradas, o que torna impossível saber o que pode ser
//     reusado.
//  2. A cópia é fixada num commit, não no branch. Os ponteiros deles apontam
//     para /main/, então o conteúdo muda debaixo do catálogo sem aviso.
//  3. Só entra conteúdo de licença permissiva. Sem licença declarada significa
//     todos os direitos reservados, e esses ficam como ponteiro.
//  4. Os links relativos do SKILL.md (`references/…`, `../outra/SKILL.md`) são
//     reescritos para a URL absoluta no commit fixado. Os arquivos vizinhos não
//     vêm na cópia; sem isso, o agente é mandado abrir arquivos que não existem.
//
// Uso: node scripts/ingest-skills.mjs
import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";
import { blocoProcedencia, comProcedencia } from "./lib/provenance.mjs";
import { enderecoLegivel, fixarNoCommit, reescreverLinks } from "./lib/links.mjs";

/** O slug se repete entre autores (oito casos nas 269), então o nome do arquivo
 *  sai do pathSlug, que é único. Sem isso uma skill sobrescreve a outra. */
const nomeArquivo = (pathSlug) => pathSlug.replace(/[^a-zA-Z0-9._-]+/g, "__") + ".md";

const RAIZ = process.cwd();
const DESTINO = join(RAIZ, "content", "skills");
const REGISTRO = join(RAIZ, "content", "skills-registry.json");

const bruto = JSON.parse(readFileSync(join(RAIZ, ".tmp-skills", "registry.json"), "utf8"));
const skills = Array.isArray(bruto) ? bruto : Object.values(bruto).find(Array.isArray);
const licencas = JSON.parse(readFileSync(join(RAIZ, ".tmp-skills", "licencas.json"), "utf8"));
const porRepo = new Map(licencas.map((l) => [l.repo, l]));

/** O commit em que o repositório estava quando copiamos. Fixa a procedência:
 *  sem isso, "copiado de main" não diz de qual versão. */
const shaCache = new Map();
function headSha(repo) {
  if (shaCache.has(repo)) return shaCache.get(repo);
  let sha = null;
  try {
    sha = execFileSync("gh", ["api", `repos/${repo}/commits`, "--jq", ".[0].sha"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    }).trim().slice(0, 40);
  } catch {
    sha = null;
  }
  shaCache.set(repo, sha);
  return sha;
}

/** A Apache-2.0 pede que o NOTICE, se existir, seja preservado na redistribuição.
 *  A MIT não pede. Guardamos o texto para o arquivo de atribuição. */
const noticeCache = new Map();
function notice(repo) {
  if (noticeCache.has(repo)) return noticeCache.get(repo);
  let texto = null;
  try {
    const b64 = execFileSync("gh", ["api", `repos/${repo}/contents/NOTICE`, "--jq", ".content"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    }).trim();
    texto = Buffer.from(b64, "base64").toString("utf8").slice(0, 4000);
  } catch {
    texto = null;
  }
  noticeCache.set(repo, texto);
  return texto;
}

rmSync(DESTINO, { recursive: true, force: true });
mkdirSync(DESTINO, { recursive: true });

const HOJE = process.env.INGEST_DATE ?? new Date().toISOString().slice(0, 10);

const entradas = [];
const notices = new Map();
let copiadas = 0;
let apontadas = 0;
let falhas = 0;
let linksReescritos = 0;

for (const [i, s] of skills.entries()) {
  const repo = `${s.user}/${s.repo}`;
  const lic = porRepo.get(repo);
  const podeCopiar = lic?.balde === "copiar";

  /*  Onde ler a skill na origem. O registro upstream deixa `githubUrl` vazio
   *  quando a origem não é o GitHub (rams.ai) ou quando esqueceu de preencher
   *  (cursor/plugins); nesses casos deriva-se da `rawUrl`. Nunca fica string
   *  vazia: um ponteiro sem endereço não aponta para nada. */
  const endereco = s.githubUrl || enderecoLegivel(s.rawUrl) || null;

  const base = {
    slug: s.slug,
    pathSlug: s.pathSlug,
    name: s.name,
    description: s.description,
    topics: s.topics ?? [],
    // A atribuição é a condição das licenças permissivas, não um enfeite.
    source: {
      author: s.user,
      repo: s.repo,
      url: endereco,
      license: lic?.spdx ?? null,
      licenseName: lic?.nome ?? null,
    },
  };

  if (!podeCopiar) {
    entradas.push({
      ...base,
      hosted: false,
      reason: lic?.spdx ? "licenca-restritiva" : "sem-licenca-declarada",
      // Sem conteúdo hospedado, o leitor vai à origem.
      readAt: endereco,
    });
    apontadas++;
    process.stdout.write(`\r  ${i + 1}/${skills.length}  ponteiro  ${s.slug.slice(0, 32).padEnd(32)}`);
    continue;
  }

  const sha = headSha(repo);
  if (lic.spdx === "Apache-2.0" && !notices.has(repo)) {
    const n = notice(repo);
    if (n) notices.set(repo, n);
  }

  try {
    const res = await fetch(s.rawUrl, { headers: { "User-Agent": "compound-design-ingest" } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const md = await res.text();

    /*  Procedência colada no arquivo: viaja junto se alguém copiar solto.
     *
     *  Vai DEPOIS do frontmatter, não antes. Um comentário antes do `---` da
     *  primeira linha faz todo leitor de YAML desistir, e a skill perde nome,
     *  descrição e licença para quem a carrega. */
    const cabecalho = blocoProcedencia({
      origem: s.githubUrl,
      autor: s.user,
      licenca: lic.spdx,
      commit: sha,
      data: HOJE,
    });

    // A URL fixada no commit, para reproduzir a cópia exata. Troca o SEGMENTO
    // do ref, seja ele main, master, canary ou qualquer outro branch.
    const pinned = fixarNoCommit(s.rawUrl, sha);

    // Links relativos viram URL absoluta no commit fixado (lib/links.mjs). Sem
    // sha, resolvem contra o branch: pior que o commit, melhor que um arquivo
    // que não existe.
    const { texto, reescritos } = reescreverLinks(md, pinned ?? s.rawUrl);
    linksReescritos += reescritos;

    writeFileSync(join(DESTINO, nomeArquivo(s.pathSlug)), comProcedencia(texto, cabecalho));
    entradas.push({
      ...base,
      hosted: true,
      file: nomeArquivo(s.pathSlug),
      bytes: md.length, // o tamanho do original na origem
      fetchedAt: HOJE,
      commit: sha,
      pinned,
    });
    copiadas++;
    process.stdout.write(`\r  ${i + 1}/${skills.length}  copiada   ${s.slug.slice(0, 32).padEnd(32)}`);
  } catch (e) {
    entradas.push({ ...base, hosted: false, reason: "falha-ao-buscar", error: String(e.message).slice(0, 60), readAt: endereco });
    falhas++;
    process.stdout.write(`\r  ${i + 1}/${skills.length}  FALHOU    ${s.slug.slice(0, 32).padEnd(32)}`);
  }
}

process.stdout.write("\n\n");

const topicos = {};
for (const e of entradas) for (const t of e.topics) topicos[t] = (topicos[t] || 0) + 1;

const porLicenca = {};
for (const e of entradas) {
  const k = e.source.license ?? "sem licença";
  porLicenca[k] = (porLicenca[k] || 0) + 1;
}

writeFileSync(
  REGISTRO,
  JSON.stringify(
    {
      updated: HOJE,
      counts: { total: entradas.length, hosted: copiadas, pointer: apontadas + falhas },
      licenses: porLicenca,
      topics: Object.entries(topicos).sort((a, b) => b[1] - a[1]).map(([key, count]) => ({ key, count })),
      skills: entradas,
    },
    null,
    1
  ) + "\n"
);

// O arquivo de atribuição: quem escreveu o quê, sob qual licença, de qual
// commit. É o que a MIT e a Apache pedem em troca da redistribuição.
const copiadasList = entradas.filter((e) => e.hosted);
const porAutor = new Map();
for (const e of copiadasList) {
  const k = `${e.source.author}/${e.source.repo}`;
  if (!porAutor.has(k)) porAutor.set(k, { license: e.source.license, itens: [] });
  porAutor.get(k).itens.push(e);
}

const linhas = [
  "# Atribuição",
  "",
  `As skills em \`content/skills/\` foram escritas por outras pessoas e estão aqui`,
  `sob licença permissiva, copiadas em ${HOJE}.`,
  "",
  `São ${copiadasList.length} skills de ${porAutor.size} repositórios. As outras`,
  `${apontadas + falhas} entradas do catálogo **não têm conteúdo aqui**: sem licença`,
  `declarada, a obra é do autor, então o hub só aponta para a origem.`,
  "",
  "Cada arquivo em `content/skills/` traz origem, autor, licença e commit no topo.",
  "",
  "## Por repositório",
  "",
  "| Repositório | Licença | Skills |",
  "|---|---|---|",
  ...[...porAutor.entries()]
    .sort((a, b) => b[1].itens.length - a[1].itens.length)
    .map(([repo, d]) => `| [${repo}](https://github.com/${repo}) | ${d.license} | ${d.itens.length} |`),
];

if (notices.size) {
  linhas.push(
    "",
    "## NOTICE",
    "",
    "A Apache-2.0 exige preservar o NOTICE do projeto de origem na redistribuição.",
    ""
  );
  for (const [repo, texto] of notices) {
    linhas.push(`### ${repo}`, "", "```", texto.trim(), "```", "");
  }
}

writeFileSync(join(DESTINO, "ATTRIBUTION.md"), linhas.join("\n") + "\n");

const bytes = copiadasList.reduce((s, e) => s + e.bytes, 0);
console.log(`copiadas:  ${copiadas}`);
console.log(`ponteiros: ${apontadas}`);
console.log(`falhas:    ${falhas}`);
console.log(`peso:      ${(bytes / 1024).toFixed(0)} KB`);
console.log(`links:     ${linksReescritos} relativos reescritos para o commit fixado`);
console.log(`licenças:  ${Object.entries(porLicenca).map(([k, n]) => `${k} ${n}`).join(" · ")}`);
console.log(`\nregistro:  content/skills-registry.json`);
console.log(`atribuição: content/skills/ATTRIBUTION.md`);
if (falhas) console.log(`\nATENÇÃO: ${falhas} skill(s) não baixaram.`);
