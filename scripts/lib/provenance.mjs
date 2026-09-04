/** Onde a procedência entra no arquivo de uma skill.
 *
 *  Existe como módulo próprio porque duas coisas precisam concordar: o script
 *  que copia as skills e o que repara as já copiadas. Quando a regra morava
 *  dentro do ingest, as duas divergiram.
 *
 *  A regra: o frontmatter fica em primeiro, sempre. Um comentário de HTML antes
 *  dele faz todo leitor de YAML desistir, e aí ninguém lê nome, descrição nem
 *  licença da skill — que é justamente o que a procedência quer preservar. */

/** O comentário de procedência, sem posição ainda. */
export function blocoProcedencia({ origem, autor, licenca, commit, data }) {
  return [
    "<!--",
    `  Origem:  ${origem}`,
    `  Autor:   ${autor}`,
    `  Licença: ${licenca}`,
    commit ? `  Commit:  ${commit}` : null,
    `  Copiado: ${data} por scripts/ingest-skills.mjs`,
    "-->",
  ]
    .filter((l) => l !== null) // só descarta o commit ausente, nunca linha vazia
    .join("\n");
}

/** Acha o fim do frontmatter YAML, ou -1 se o arquivo não tem um.
 *
 *  Reconhece a abertura como o gray-matter (o leitor que o site usa): `---` na
 *  primeira linha, sem um quarto traço — `----` é régua horizontal, não
 *  frontmatter. O fechamento é o primeiro `---` no começo de uma linha depois
 *  disso; um `---` mais adiante no corpo é régua e não conta.
 *
 *  Divergência deliberada: o arquivo que abre `---` e NUNCA fecha. O gray-matter
 *  engole o arquivo inteiro como YAML e devolve corpo vazio (ou erro de parse,
 *  se o texto não for YAML). Seguir isso obrigaria a pôr a procedência no fim do
 *  arquivo, dentro do "frontmatter", e o YAML deixaria de parsear por causa do
 *  comentário — ou a inventar um `---` de fechamento que o autor não escreveu.
 *  Nenhum dos dois cabe numa cópia de terceiros. Então: sem fechamento, não há
 *  frontmatter válido, e o comentário vai no topo. O texto original segue
 *  intacto logo abaixo; quem lê com o gray-matter vê um arquivo sem frontmatter
 *  em vez de um YAML quebrado. Nada se perde e nada se inventa. */
export function fimDoFrontmatter(md) {
  if (!md.startsWith("---") || md.charAt(3) === "-") return -1;
  const primeira = md.indexOf("\n");
  if (primeira === -1) return -1; // só a linha de abertura, e nada depois
  const fecha = md.indexOf("\n---", primeira);
  if (fecha === -1) return -1; // abre e nunca fecha: ver nota acima
  const fimDaLinha = md.indexOf("\n", fecha + 1);
  return fimDaLinha === -1 ? md.length : fimDaLinha + 1;
}

/** Insere a procedência depois do frontmatter, ou no topo se não houver.
 *
 *  Respeita o fim de linha do arquivo: um arquivo CRLF recebe o comentário em
 *  CRLF, para não sair com os dois estilos misturados. */
export function comProcedencia(md, comentario) {
  const eol = md.includes("\r\n") ? "\r\n" : "\n";
  const bloco = comentario.replace(/\r?\n/g, eol);
  const corte = fimDoFrontmatter(md);
  if (corte === -1) return `${bloco}${eol}${eol}${md.replace(/^(?:\r?\n)+/, "")}`;
  const frontmatter = md.slice(0, corte);
  const resto = md.slice(corte).replace(/^(?:\r?\n)+/, "");
  return `${frontmatter}${eol}${bloco}${eol}${eol}${resto}`;
}
