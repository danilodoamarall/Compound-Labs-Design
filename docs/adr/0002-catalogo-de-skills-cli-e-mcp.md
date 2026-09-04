# ADR-0002: Catálogo de skills com CLI e servidor MCP próprios

**Status:** Aceito (Opção C, com a cópia licenciada da Opção A — ver adendo)
**Data:** 3 de setembro de 2026 · adendo em 4 de setembro
**Deciders:** Danilo do Amaral (Labs)

> Os números no corpo deste ADR ("cinco itens", "cerca de 180") são os do dia da
> decisão e ficam como registro. Os números atuais — 269 entradas, 207 hospedadas,
> 62 apontadas — estão no adendo do fim e são conferidos pelo `check-counts` no
> prebuild.

## Contexto

A página `/skills-agents` do hub hoje é uma grade de cards com filtro por tipo,
alimentada por `content/skills-agents.json`. São **cinco itens**: três skills, um
agent e um MCP. Cada um já carrega `key`, `name`, `type`, `summary`, `whenToUse`,
`install`, `tags` e **`code`, que é o SKILL.md inteiro**.

O pedido é reproduzir o `ui-skills` do ibelick: a mesma composição de página, as
mesmas skills, um CLI próprio e um servidor MCP próprio.

### O que o ui-skills é, de fato

Abri as três páginas e li o pacote publicado.

**A home** tem um logotipo em ASCII, uma linha de descrição, um bloco "Agent,
start here" com dois cards (CLI e MCP), e uma grade de skills. Cada card mostra
nome, descrição e **o dono no GitHub**: `ibelick`, `anthropics`, `emilkowalski`,
`millionco`.

**A página de CLI** documenta cinco comandos:

```
npx ui-skills start
npx ui-skills categories
npx ui-skills list
npx ui-skills list --category motion
npx ui-skills get baseline-ui
```

**A página de MCP** publica o endereço `https://www.ui-skills.com/mcp`, um cartão
de servidor em `/.well-known/mcp/server-card.json`, e duas ferramentas:
`list_skills` e `get_skill`. O cartão declara transporte `streamable-http`.

**O CLI não instala nada.** Ele busca markdown do site e imprime na saída padrão.
O `start` traz uma skill roteadora que manda o agente listar categorias e buscar
uma skill específica.

### O ponto que decide tudo

**O ui-skills não é dono da maior parte do conteúdo que serve.** São cerca de 180
entradas; seis são do ibelick. O resto são **ponteiros para repositórios de
terceiros**, buscados ao vivo no GitHub no momento do pedido. Os próprios cards
creditam o dono, o que confirma a natureza de diretório.

Então "as mesmas skills que tem lá" tem três leituras, e elas não se parecem em
risco nem em valor.

## Decisão a tomar

Qual é a relação do hub com o conteúdo das skills: **dono**, **diretório** ou
**redistribuidor**.

A máquina em volta (registro, CLI, MCP, página) é a mesma nos três casos e é a
parte fácil. O conteúdo é a parte que decide.

## Opções

### Opção A — Redistribuir o mesmo conteúdo

Copiar as ~180 skills para o nosso repositório e servi-las pelo nosso registro,
CLI e MCP.

| Dimensão | Avaliação |
|---|---|
| Complexidade | Baixa na máquina, alta na curadoria |
| Custo | Tempo de checar ~40 licenças diferentes |
| Escala | Boa |
| Familiaridade | Alta |

**A favor:** catálogo cheio no primeiro dia.

**Contra:** o conteúdo é de terceiros. O ui-skills **não expõe a licença de cada
skill** em lugar nenhum, então não há como saber, pelo catálogo, o que pode ser
redistribuído. Algumas dessas licenças provavelmente não permitem. E copiar
congela: quando o autor corrigir a skill, a nossa cópia fica velha e errada.

Some-se que isso contradiz a página Sobre do hub, que diz que o que está aqui é
curado e testado por você. Um catálogo de 180 skills que você não leu não é
curadoria.

### Opção B — Diretório, como o ui-skills faz

Guardar só ponteiros e buscar o markdown do repositório de origem na hora,
creditando o autor.

| Dimensão | Avaliação |
|---|---|
| Complexidade | Média: cache, timeouts, links mortos |
| Custo | Baixo |
| Escala | Depende do GitHub |
| Familiaridade | Média |

**A favor:** mesma postura do ui-skills, sempre atualizado, atribuição na cara.

**Contra:** herdamos os problemas deles. Na pesquisa que fiz antes nesta sessão,
**pelo menos duas entradas do registro respondem 404**. E servimos texto que
outros escrevem e podem mudar sem aviso, num endpoint com o nosso nome. Se uma
skill de terceiro mandar o agente rodar um script, o pedido saiu do nosso MCP.

E, honestamente: seria um espelho de um diretório que já existe e é mantido por
outra pessoa. O hub não fica melhor por ter uma segunda cópia do índice do
ibelick.

### Opção C — Catálogo próprio, com a mesma máquina (recomendada)

Construir o registro, o CLI e o MCP iguais, e publicar **as nossas skills**: as
cinco que já existem, mais as que você escrever.

| Dimensão | Avaliação |
|---|---|
| Complexidade | Média, e toda ela nossa |
| Custo | Tempo de escrever skills, que é o trabalho de verdade |
| Escala | Cresce com o que você usa |
| Familiaridade | Alta: o dado já está no formato certo |

**A favor:** o `content/skills-agents.json` **já é um registro**. Cada item tem
chave, nome, tipo, resumo, quando usar, e o SKILL.md inteiro no campo `code`. É
exatamente o que `list_skills` e `get_skill` precisam devolver. Nenhuma dúvida de
licença: o conteúdo é seu.

E casa com o posicionamento. O hub inteiro se apresenta como o que você testa e
cura. Um catálogo pequeno e seu vale mais, aqui, do que um grande e emprestado.

**Contra:** começa com cinco itens contra cento e oitenta. E as cinco de hoje são
curtas: medi entre 119 e 585 caracteres, contra documentos inteiros nas deles.
São esboços, não skills prontas.

Nada impede uma lista de "skills que eu uso e não são minhas", com link para o
repositório do autor. Isso é recomendação, não redistribuição, e é o que a seção
Radar já faz com ferramentas.

## Análise de trade-off

O eixo não é técnico. Registro, CLI e MCP são os mesmos nas três opções, e a
implementação é curta: confirmei que o `mcp-handler` (Apache-2.0, versão 2.1.1)
serve MCP por rota do App Router com `createMcpHandler`, exportada em GET e POST.
São poucas linhas.

O eixo é **de quem é o conteúdo e o que o hub afirma ser**.

A opção A troca risco de licença por volume. A B troca originalidade por volume.
A C troca volume por coerência, e é a única em que o catálogo cresce com o
trabalho que você já faz.

Há um caminho do meio que não exige escolher para sempre: publicar a máquina com
as nossas skills agora (C) e, se depois fizer sentido, acrescentar uma seção de
skills recomendadas que aponta para fora com crédito (parte de B), sem servir o
texto dos outros.

## Consequências

**Fica mais fácil:** o agente descobre e busca skills sem sair do terminal. As
skills passam a ter endereço, o que resolve o mesmo problema que as páginas de
recurso resolveram. E cada nova skill entra num arquivo só e aparece na página,
no CLI e no MCP.

**Fica mais difícil:** passa a existir superfície pública com contrato. Um CLI
publicado no npm e um MCP com cartão de servidor são promessas: quebrar o formato
quebra a máquina de quem instalou. Isso pede versionamento de verdade, que o hub
ainda não tem.

**Vai precisar de revisão:** o `package.json` é `private: true` e se chama
`labs-hub`. Publicar um CLI exige um pacote separado, com nome e escopo no npm,
que é decisão sua. E o MCP público sem autenticação é um endpoint que qualquer
um chama: precisa de limite de taxa antes de ir para produção.

## Itens de ação

1. [x] **Decidir a opção.** Sem isso o resto não começa.
2. [x] Expor o registro em `/api/skills/registry.json` e o markdown de cada skill
       em `/api/skills/[key]/llms.txt`, servidos do `content/skills-agents.json`
       que já existe.
3. [x] Servidor MCP em `src/app/mcp/route.ts` com `mcp-handler` e `zod`, expondo
       `list_skills` e `get_skill`, mais o cartão em
       `/.well-known/mcp/server-card.json`.
4. [x] Limite de taxa por IP no MCP, no mesmo formato do que já existe em
       `/api/subscribe`.
5. [x] Refazer `/skills-agents` na composição do ui-skills: descrição, bloco
       "comece por aqui" com os dois cards, e a grade de skills com crédito.
6. [x] Páginas `/skills-agents/cli` e `/skills-agents/mcp`, no gabarito de
       recurso que já padronizamos.
7. [x] CLI num pacote separado, publicado no npm sob um escopo seu. Comandos
       espelhando os deles: `start`, `categories`, `list`, `list --category`,
       `get`.
8. [x] **Escrever as skills.** É o item que dá trabalho e o único que define se
       o catálogo vale alguma coisa. As cinco de hoje precisam virar documentos.

## Nota sobre o `npx ui-skills`

Não recomendo instalar o pacote deles como dependência, nem como referência de
execução. Ele declara `astro`, `react`, `tailwindcss` e `motion` em
`dependencies`, e não em `devDependencies`: o `npx` baixa a stack inteira do site
para imprimir um arquivo de markdown. O nosso CLI deve ser um pacote pequeno, sem
dependência de framework.

---

## Adendo, 04/09/2026: o que a implementação mudou

Quatro decisões que só apareceram depois de medir o que estava no ar.

### A listagem passa a ser paginada

`list_skills` sem filtro devolvia **157 KB** de JSON, cerca de 40 mil tokens
entrando no contexto de um agente que só queria saber o que existe. O ui-skills
tem o mesmo comportamento, e não é generosidade: é despejo.

A listagem vem em páginas de 40, com teto de 200, e a resposta carrega `total`,
`returned`, `offset`, `hasMore` e `nextOffset`. Quando corta, **diz que cortou** e
diz como pedir o resto. Corte silencioso é pior que resposta grande, porque faz a
listagem parecer completa quando não é.

Uma ferramenta nova, `list_topics`, existe para que dê para escolher um filtro
antes de pedir a listagem. Sem ela, paginar só empurra o problema.

| Resposta | Antes | Depois |
|---|---|---|
| `/api/skills` | 160.817 B | 12.316 B |
| `list_skills` sem filtro | 160.817 B | 17.357 B |

### O `start` passa a ser nosso

O comando servia `ibelick/ui-skills-root`, a skill de roteamento do ui-skills.
É MIT e podíamos redistribuir, mas o texto manda o agente rodar
`npx ui-skills categories` e `npx ui-skills get`. **Nosso CLI estava ensinando a
usar a ferramenta de outro projeto.**

Agora é gerada em `src/lib/routing-skill.ts`, a partir do registro, então os
tópicos e as contagens nunca divergem do catálogo que ela descreve.

### O frontmatter estava ilegível nos 207 arquivos

O comentário de procedência era escrito **antes** do frontmatter, colado no `---`
da primeira linha. Nenhum leitor de YAML lê um frontmatter que não começa na
primeira linha, então nome, descrição e licença de cada skill ficaram invisíveis
para quem carregasse o arquivo — justamente o que a procedência queria preservar.

Dois defeitos na mesma função: o `.filter(Boolean)` também comia as linhas em
branco do separador, colando `-->` em `---`.

A regra virou módulo, `scripts/lib/provenance.mjs`, usado pelo script de
ingestão e pelo de reparo, para os dois não divergirem de novo. Os 207 arquivos
foram reparados no lugar, sem rebuscar nada: o texto já estava aqui, só na ordem
errada. 189 têm frontmatter e agora abrem com ele; 18 são markdown puro e nunca
tiveram um.

### O endereço do site vira uma constante

Estava escrito à mão em sete arquivos, incluindo a página que ensina a conectar
ao MCP. Agora sai de `src/lib/site-url.ts`, que prefere
`VERCEL_PROJECT_PRODUCTION_URL` à URL do deploy atual: um preview não deve se
anunciar como endereço canônico do servidor, senão quem salvar o cartão fica
apontado para uma URL efêmera.

### Limite de taxa

Feito, e vale registrar o que ele não faz. A contagem vive na memória da
instância, então numa função sem estado o limite é por instância, não global.
Não segura ataque coordenado — para isso o lugar é a borda. Segura o caso real:
agente preso em laço. São 120 chamadas por minuto no MCP, contra as dez de uma
sessão honesta.

A implementação saiu de dentro de `/api/subscribe` para `src/lib/rate-limit.ts`,
e no caminho corrigiu um defeito: a versão antiga chamava `hits.clear()` ao
passar de 5000 endereços, zerando o histórico de todo mundo, inclusive de quem
estava sendo contido.
