/** Links relativos dentro de uma skill copiada.
 *
 *  Um SKILL.md costuma apontar para arquivos vizinhos — `references/WCAG.md`,
 *  `../performance/SKILL.md` — que não vieram na cópia: só o SKILL.md entra em
 *  content/skills/. O agente que lê a skill é mandado abrir um arquivo que não
 *  existe. Como toda cópia é fixada num commit (`pinned`), cada link se resolve
 *  para a URL absoluta no GitHub, no MESMO commit: o leitor cai no arquivo que
 *  o autor tinha em mente quando escreveu, não no que o branch tem hoje.
 *
 *  Módulo próprio porque dois scripts precisam concordar: o ingest (ao copiar)
 *  e o fix-skill-links (para o que já foi copiado).
 *
 *  O que NÃO se toca: links absolutos, âncoras `#`, `mailto:`, `data:`, links
 *  vazios; qualquer coisa dentro de bloco ou span de código (é exemplo, não
 *  navegação); e destinos com `{{…}}`, que são placeholders de template, não
 *  caminhos. */

const RAW = "raw.githubusercontent.com";
const SHA = /^[0-9a-f]{7,40}$/;

/** Lê owner, repo, ref e caminho de uma URL do GitHub. Aceita
 *    https://raw.githubusercontent.com/<owner>/<repo>/<ref>/<caminho>
 *    https://raw.githubusercontent.com/<owner>/<repo>/refs/heads/<branch>/<caminho>
 *    https://github.com/<owner>/<repo>/blob/<ref>/<caminho>
 *  e devolve null para qualquer outra coisa.
 *
 *  Limite conhecido: um branch com barra no nome (`feat/x`) é indistinguível
 *  do caminho nessa forma de URL; só o GitHub sabe onde o ref acaba. */
export function lerUrlGitHub(url) {
  let u;
  try {
    u = new URL(url);
  } catch {
    return null;
  }
  const seg = u.pathname.split("/").filter(Boolean);
  if (u.hostname === RAW && seg.length >= 4) {
    const [owner, repo] = seg;
    // `refs/heads/<branch>` e `refs/tags/<tag>` são um ref só, em três segmentos.
    if (seg[2] === "refs" && (seg[3] === "heads" || seg[3] === "tags") && seg.length >= 6) {
      return { owner, repo, ref: seg.slice(2, 5).join("/"), caminho: seg.slice(5).join("/") };
    }
    return { owner, repo, ref: seg[2], caminho: seg.slice(3).join("/") };
  }
  if (u.hostname === "github.com" && seg.length >= 4 && (seg[2] === "blob" || seg[2] === "tree")) {
    return { owner: seg[0], repo: seg[1], ref: seg[3], caminho: seg.slice(4).join("/") };
  }
  return null;
}

/** Troca o ref (branch, tag ou sha) de uma URL raw pelo sha do commit.
 *  Substitui o SEGMENTO, não a string: `/main/` no meio do caminho de um
 *  arquivo não é branch, e `canary` é tão branch quanto `main`.
 *  Devolve null sem sha utilizável ou fora do GitHub. */
export function fixarNoCommit(rawUrl, sha) {
  if (!sha || !SHA.test(sha)) return null;
  const g = lerUrlGitHub(rawUrl);
  if (!g) return null;
  return `https://${RAW}/${g.owner}/${g.repo}/${sha}/${g.caminho}`;
}

/** O endereço legível no navegador equivalente a uma URL raw. Fora do GitHub,
 *  devolve a URL como veio: é o melhor endereço de leitura que existe. */
export function enderecoLegivel(url) {
  const g = lerUrlGitHub(url);
  if (!g || !url.includes(RAW)) return url;
  return `https://github.com/${g.owner}/${g.repo}/blob/${g.ref}/${g.caminho}`;
}

/** A pasta contra a qual os links relativos de um arquivo se resolvem. */
export function baseDoArquivo(url) {
  const g = lerUrlGitHub(url);
  if (!g) return null;
  const pasta = g.caminho.split("/").filter(Boolean);
  pasta.pop(); // sai o nome do arquivo, fica a pasta
  return { owner: g.owner, repo: g.repo, ref: g.ref, pasta };
}

/** Passa pelo filtro básico: não é absoluto, âncora nem vazio. */
function candidato(destino) {
  if (!destino) return false;
  if (destino.startsWith("#") || destino.startsWith("//")) return false;
  if (/^[a-z][a-z0-9+.-]*:/i.test(destino)) return false; // http:, https:, mailto:, data:, tel:…
  return true;
}

/** É de fato um caminho relativo que vale reescrever. */
export function ehRelativo(destino) {
  return candidato(destino) && !/[{}<>\s]/.test(destino);
}

/** Resolve um destino relativo contra a base, com a semântica normal de URL:
 *  `.` fica, `..` sobe, `/` é a raiz do repositório, `..` além da raiz para nela.
 *  Arquivo vira `blob`, pasta vira `tree`. Imagem vai para a URL raw, senão não
 *  renderiza. Âncora e query sobrevivem. */
export function resolverDestino(destino, base, { imagem = false } = {}) {
  const corte = destino.search(/[?#]/);
  const caminho = corte === -1 ? destino : destino.slice(0, corte);
  const sufixo = corte === -1 ? "" : destino.slice(corte);
  const pilha = caminho.startsWith("/") ? [] : [...base.pasta];
  const partes = caminho.split("/");
  for (const p of partes) {
    if (p === "" || p === ".") continue;
    if (p === "..") pilha.pop();
    else pilha.push(p);
  }
  const ultimo = partes[partes.length - 1];
  const ehPasta = ultimo === "" || ultimo === "." || ultimo === "..";
  const trilha = pilha.join("/");
  if (imagem) return `https://${RAW}/${base.owner}/${base.repo}/${base.ref}/${trilha}${sufixo}`;
  const modo = ehPasta ? "tree" : "blob";
  return `https://github.com/${base.owner}/${base.repo}/${modo}/${base.ref}${trilha ? `/${trilha}` : ""}${sufixo}`;
}

// [texto](destino "título") — o texto admite um nível de colchetes aninhados
// ([![badge](img)](link)); o destino admite um nível de parênteses (foo_(bar).md).
const LINK = /(!?)\[((?:[^[\]]|\[[^[\]]*\])*)\]\(((?:[^()\s]|\([^()\s]*\))*)(\s+(?:"[^"]*"|'[^']*'|\([^()]*\)))?\)/g;
// [rótulo]: destino — definição de referência no começo da linha. `[^1]:` é nota
// de rodapé, não link; e só vale se o destino parece caminho (tem `/` ou `.`).
const REFDEF = /^(\s{0,3}\[)([^\]^][^\]]*)(\]:\s*)(\S+)([^\r]*)(\r?)$/;
// `código`, com os runs de crases casados
const SPAN = /(`+)(.*?[^`])\1(?!`)/g;
// ``` ou ~~~, com indentação qualquer: listas aninham blocos de código
const CERCA = /^\s*(`{3,}|~{3,})([^\r]*)\r?$/;

/** Os trechos de `código` de uma linha, como pares [início, fim). */
function spans(texto) {
  const lista = [];
  SPAN.lastIndex = 0;
  for (let s; (s = SPAN.exec(texto)); ) lista.push([s.index, s.index + s[0].length]);
  return lista;
}

function visitarTrecho(texto, numero, emCodigo, visitar) {
  const dentro = emCodigo ? [] : spans(texto);
  return texto.replace(LINK, (tudo, bang, rotulo, destino, titulo, posicao) => {
    // O link se casa na linha inteira; só depois se pergunta se o `[` caiu
    // dentro de crases. `[span_1](start_span)` é exemplo, não navegação. Já
    // [`useSSRWidth`](references/x.md) é link de verdade com código no texto:
    // o `[` fica fora do span. Partir a linha pelos spans antes de casar
    // quebraria esse segundo caso ao meio — e ele é o comum em tabelas.
    const noSpan = dentro.some(([a, b]) => posicao >= a && posicao < b);
    const codigo = emCodigo || noSpan;
    // Links aninhados no texto do link: [![badge](img)](link).
    const rotuloNovo = visitarTrecho(rotulo, numero, codigo, visitar);
    let destinoNovo = destino;
    if (candidato(destino)) {
      const r = visitar({ linha: numero, destino, imagem: bang === "!", refdef: false, emCodigo: codigo });
      if (typeof r === "string" && !codigo) destinoNovo = r;
    }
    if (rotuloNovo === rotulo && destinoNovo === destino) return tudo;
    return `${bang}[${rotuloNovo}](${destinoNovo}${titulo ?? ""})`;
  });
}

function visitarLinha(linha, numero, visitar) {
  const r = REFDEF.exec(linha);
  if (r && candidato(r[4]) && /[/.]/.test(r[4])) {
    const novo = visitar({ linha: numero, destino: r[4], imagem: false, refdef: true, emCodigo: false });
    return typeof novo === "string" ? `${r[1]}${r[2]}${r[3]}${novo}${r[5]}${r[6]}` : linha;
  }
  return visitarTrecho(linha, numero, false, visitar);
}

/** Percorre todos os links do markdown, fora e dentro de código, chamando
 *  `visitar({ linha, destino, imagem, refdef, emCodigo })` para cada destino que
 *  não é absoluto nem âncora. Se o visitante devolve uma string e o link não
 *  está em código, o destino é trocado por ela. Devolve o texto resultante com
 *  os fins de linha originais — CRLF incluído, porque cada linha guarda o seu `\r`. */
export function percorrerLinks(md, visitar) {
  const linhas = md.split("\n");
  let cerca = null;
  for (let i = 0; i < linhas.length; i++) {
    const linha = linhas[i];
    const m = CERCA.exec(linha);
    // Cerca de crases não admite crase na linha de abertura: aí é span, não bloco.
    const ehCerca = m && !(m[1][0] === "`" && m[2].includes("`"));
    if (cerca) {
      if (ehCerca && m[1][0] === cerca.char && m[1].length >= cerca.n && m[2].trim() === "") {
        cerca = null;
        continue;
      }
      linhas[i] = visitarTrecho(linha, i + 1, true, visitar);
      continue;
    }
    if (ehCerca) {
      cerca = { char: m[1][0], n: m[1].length };
      continue;
    }
    linhas[i] = visitarLinha(linha, i + 1, visitar);
  }
  return linhas.join("\n");
}

/** Reescreve os links relativos de `md` para URLs absolutas no GitHub, no
 *  commit da `url` (o `pinned` da entrada). Idempotente: o que já é absoluto
 *  não é candidato. Sem base do GitHub, devolve o texto como veio. */
export function reescreverLinks(md, url) {
  const base = baseDoArquivo(url);
  if (!base) return { texto: md, reescritos: 0, resolvido: false };
  let reescritos = 0;
  const texto = percorrerLinks(md, ({ destino, imagem, emCodigo }) => {
    if (emCodigo || !ehRelativo(destino)) return null;
    reescritos++;
    return resolverDestino(destino, base, { imagem });
  });
  return { texto, reescritos, resolvido: true };
}

/** Lista todo destino que não é absoluto nem âncora, com linha e contexto, para
 *  o script de checagem provar o que sobrou e por quê. */
export function listarLinks(md) {
  const itens = [];
  percorrerLinks(md, (info) => {
    itens.push(info);
    return null;
  });
  return itens;
}
