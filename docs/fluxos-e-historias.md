# Fluxos de usuário e histórias — v1

**Status:** especificação da v1, setembro de 2026. Descreve o produto depois da
poda de Radar e AI Tools. É contra este documento que o teste de ponta a ponta
roda: cada critério de aceite abaixo é verificável por um comando ou por uma
página.

## Quem usa

| Persona | O que quer | Como chega |
|---|---|---|
| **Designer ou engenheiro** que constrói com IA | Entender o cenário e achar skills que elevem o padrão do que constrói | Busca, link compartilhado, home |
| **Agente** (Claude Code, Cursor, Codex) | Descobrir e carregar a menor skill útil para a tarefa de interface em mãos | `npx @compound-design/skills start` ou MCP |
| **Autor de skill** | Ver a própria obra creditada, com licença e commit certos | Página da skill, ATTRIBUTION |
| **Leitor da série** | Ler ou apresentar os artigos da State of Prototyping 2026 | Home, /artigos, link direto |

## Mapa do produto

```
/                       home: hero + 5 cards + artigos + inscrição
/artigos                a série, 5 artigos
/artigos/[slug]         leitura
/artigos/[slug]/apresentar   modo slides
/skills-agents          placar de skills (269), busca, filtro por tópico, ?q=
/skills-agents/[skill]  a skill: conteúdo + trilho de procedência (207)
/skills-agents/cli      como instalar e usar o CLI
/skills-agents/mcp      como conectar o agente
/explorar               índice de tudo (119), por data, 10 tags, um ao acaso
/r/[key]                página de um recurso do índice (114 não-artigo)
/workflow               ferramentas por etapa
/research               a pesquisa
/docs · /faq · /sobre   o hub sobre si mesmo
/api/skills             registro paginado (JSON)
/api/skills/[path]      markdown de uma skill; `start` = roteamento
/mcp                    servidor MCP: list_topics, list_skills, get_skill
/.well-known/mcp/server-card.json
```

Tudo em `pt` e `en`, prefixo sempre presente.

---

## Fluxo 1 — Chegar e entender o valor

**Gatilho:** abre `/pt` ou `/en` pela primeira vez.

1. Vê o hero: título, subtítulo em voz de produto, dois CTAs.
2. Rola e vê cinco cards: Artigos, Skills, CLI, MCP, Explorar.
3. Vê os cinco artigos com o gráfico real de cada um.
4. Vê a inscrição.

### US-1.1 Entender em uma tela o que o hub entrega
Como visitante, quero saber em segundos o que há aqui e para quem é.

- [ ] O subtítulo do hero não usa primeira pessoa do curador ("eu testo", "usamos no lab").
- [ ] Os dois CTAs levam a `/skills-agents/cli` e `/skills-agents/mcp`, e o rótulo de cada um diz o que vai acontecer.
- [ ] Os cinco cards do bento somam duas linhas fechadas de 12 colunas (8+4, 4+4+4).
- [ ] Nenhum card aponta para rota inexistente.
- [ ] A página inteira tem um só `h1`.

### US-1.2 Navegar por qualquer destino a partir de qualquer página
Como visitante, quero achar qualquer parte do hub pelo menu.

- [ ] O menu tem quatro grupos e dez destinos: Artigos e estudos (Artigos, Pesquisa), Recursos (Skills & Agents, Workflow, Explorar), AI Tools (CLI, MCP), O framework (Documentação, Sobre, FAQ). O rodapé lista os mesmos dez, da mesma fonte.
- [ ] O rodapé lista os mesmos dez, da mesma fonte (`src/lib/site.ts`).
- [ ] `/pt/radar` e `/pt/ai-tools` respondem 404.
- [ ] Nenhum texto visível menciona "radar" em nenhum idioma.

---

## Fluxo 2 — Achar e usar uma skill (humano)

**Gatilho:** precisa melhorar animação, tipografia, acessibilidade.

1. Abre `/skills-agents`.
2. Filtra por tópico ou busca por texto.
3. Abre a skill; lê o conteúdo e a procedência.
4. Copia o comando de instalação, ou vai à origem.

### US-2.1 Ver o catálogo como placar
Como designer, quero ver as skills ordenadas por um sinal honesto de qualidade.

- [ ] A lista traz rank, nome, autor/repo, tópicos, estrelas do repositório e licença.
- [ ] A ordenação é por estrelas do repositório de origem; sem estrela vai para o fim, não para o zero.
- [ ] Um repositório aparece no máximo duas vezes seguidas; o excedente colapsa em "+N mais de repo" e expande ao clicar.
- [ ] O critério de ordenação está escrito na página, num bloco que abre.
- [ ] `?q=emilkowalski` abre o placar já filtrado.

### US-2.2 Ler uma skill com a procedência ao lado
Como designer, quero saber de quem é o que estou lendo antes de usar.

- [ ] A página mostra: conteúdo em markdown, comando de instalação com botão de copiar, e um trilho com licença, repositório, estrelas, último push, data da cópia, commit (link para o arquivo fixado) e a marca "hospedada aqui".
- [ ] O frontmatter e o comentário de procedência **não** aparecem dentro do conteúdo.
- [ ] Nenhum link relativo dentro do conteúdo aponta para arquivo inexistente: todos são absolutos no GitHub, no commit fixado.
- [ ] A linha de atribuição no rodapé está no idioma da página.
- [ ] "Relacionadas" lista até cinco skills que dividem tópico.

### US-2.3 Chegar à origem quando não há cópia
Como designer, quero ler uma skill sem licença declarada.

- [ ] No placar, a linha tem a seta `↗` e abre a origem em nova aba.
- [ ] Nenhuma entrada do catálogo tem endereço de origem vazio.

---

## Fluxo 3 — Um agente usa o catálogo pelo CLI

**Gatilho:** o agente precisa de contexto de interface.

1. `npx @compound-design/skills start` → a skill de roteamento.
2. `topics` → escolhe um.
3. `list --topic X` → escolhe uma.
4. `get autor/slug` → carrega.

### US-3.1 Começar sem saber nada
- [ ] `start` imprime uma skill chamada `compound-design-root`, gerada do registro, com os comandos **deste** CLI (nunca `npx ui-skills`).
- [ ] `--version` imprime a versão do `package.json`.

### US-3.2 Encontrar sem afogar
- [ ] `list` devolve 40 por padrão; o aviso de corte vai para **stderr**.
- [ ] `list --all` pagina até o fim e entrega o catálogo inteiro.
- [ ] `--limit 0`, `--limit abc`, `--offset -1` são recusados com saída 1 e mensagem.

### US-3.3 Falhar com código certo
- [ ] Saídas: 0 ok · 1 argumento · 2 comando desconhecido · 3 não encontrado/ambíguo · 4 rede.
- [ ] Nenhum erro dispara assertion do libuv nem sai com 127.
- [ ] `get animate` (ambíguo) lista as opções e sai 3.
- [ ] Zero dependências no `package.json`.

---

## Fluxo 4 — Um agente usa o catálogo por MCP

**Gatilho:** `claude mcp add --transport http compound-design <url>/mcp`.

### US-4.1 Descobrir o servidor
- [ ] `/.well-known/mcp/server-card.json` lista as três ferramentas e a URL de produção (nunca a de um preview).
- [ ] `tools/list` devolve exatamente `list_topics`, `list_skills`, `get_skill`.

### US-4.2 Listar sem estourar o contexto
- [ ] `list_skills` sem filtro devolve 40 e um `hint` dizendo quantas faltam e o `nextOffset`.
- [ ] A resposta tem sempre o mesmo envelope (`total, returned, offset, hasMore, nextOffset, skills`), inclusive quando `total = 0`.
- [ ] Paginar do offset 0 até `hasMore = false` percorre todas as 269 sem repetir nem pular.
- [ ] `limit > 200` é recusado pelo schema.

### US-4.3 Ler com crédito
- [ ] `get_skill` hospedada devolve o markdown e um segundo bloco com a atribuição.
- [ ] `get_skill` não hospedada devolve a ficha e um endereço de origem **não vazio**.
- [ ] `get_skill` com `name: "start"` devolve a skill de roteamento.
- [ ] Mais de 120 chamadas/min do mesmo IP recebem 429 com JSON-RPC válido.

---

## Fluxo 5 — Explorar tudo

**Gatilho:** "o que existe aqui?"

### US-5.1 Ver tudo numa lista datada
- [ ] `/explorar` lista 119 itens: artigos, repositórios de skills, workflow e o acervo de ferramentas.
- [ ] Ordem: com data, do mais recente; sem data, alfabético depois. Nenhuma data inventada.
- [ ] Cada linha: ponto da tag, nome • descrição, origem, data no formato curto.
- [ ] As dez tags do vocabulário são dez verbos, de read a apply; só as presentes aparecem, com contagem.
- [ ] "Um ao acaso" abre um item do filtro atual.

### US-5.2 Um repositório de skills leva ao placar
- [ ] Clicar em `emilkowalski/skills` abre `/skills-agents?q=emilkowalski`.

### US-5.3 O acervo não quebra
- [ ] `/r/notion`, `/r/figjam`, `/r/storybook` (ex-Radar) respondem 200.
- [ ] Nessas páginas a origem aparece como rótulo, sem link para página inexistente.
- [ ] A data "atualizado em" vem do índice, não de um arquivo de seção removido.

---

## Fluxo 6 — Ler ou apresentar um artigo

- [ ] Cada um dos 5 abre em `/artigos/[slug]` e `/artigos/[slug]/apresentar`, nos dois idiomas.
- [ ] Todo percentual citado bate com o dataset (`check-numbers`).

---

## Fluxo 7 — Inscrever-se

- [ ] E-mail inválido → mensagem de inválido, sem envio.
- [ ] Integração ausente → mensagem específica (503 `not_configured`), nunca sucesso falso.
- [ ] Sucesso não promete e-mail de confirmação.
- [ ] Mais de 5 envios/min do mesmo IP → 429.

---

## Fluxo 8 — O hub sobre si mesmo

- [ ] `/docs` é documentação didática em 5 grupos (Comece aqui · Conceitos, sem jargão · Como usar · Como funciona por dentro · Participe), com índice agrupado à esquerda e coluna de leitura à direita.
- [ ] `/docs` define agente, skill, catálogo, CLI e MCP em linguagem para quem nunca abriu um agente: cada termo definido na primeira vez que aparece.
- [ ] Todo comando em `/docs` tem botão de copiar com nome de ação ("Copiar comando").
- [ ] O hero da home tem um terceiro caminho, "Novo por aqui? Leia a documentação", que leva a `/docs`.
- [ ] `/faq` responde por que algumas skills abrem na origem.
- [ ] Nenhum número escrito na prosa diverge do produto (`check-counts` passa no prebuild).

---

## Requisitos transversais

| Requisito | Verificação |
|---|---|
| Bilíngue completo | `messages/pt.json` e `en.json` com chaves idênticas; nenhuma chave crua nem palavra em português vazando em `/en` |
| Sem primeira pessoa do curador na copy do produto | `check-counts` proíbe "usamos", "eu mantenho", "do meu dia", "meu site" |
| Uma fonte para seções e menu | `src/lib/site.ts` alimenta header, footer, busca, bento e a checagem |
| Uma fonte para a URL do site | `src/lib/site-url.ts` |
| Build quebra em divergência | `prebuild`: check-mdx, build-csv, build-brand, build-resources, check-skill-links, check-counts |
| Reduced motion respeitado | todo visual do bento entra no estado final sem animar |
| Sem código morto | nenhum componente em `src/components/site` sem importador |
