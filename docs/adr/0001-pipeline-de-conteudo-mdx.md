# ADR-0001: Pipeline de conteúdo MDX e props declarativas

**Status:** Proposto
**Data:** 3 de setembro de 2026
**Deciders:** Danilo do Amaral (Labs)

## Contexto

Os artigos do hub são arquivos MDX em `content/artigos/`, um por idioma, renderizados
por `next-mdx-remote@6` em Server Components. Cada arquivo usa componentes próprios
(`Slide`, `Stat`, `Chart`, `Callout`, `Question`) para servir de texto e de
apresentação ao mesmo tempo.

Durante a construção, os números dos slides sumiram da tela sem erro nenhum. O rótulo
e a unidade apareciam, o número não. O diagnóstico levou à causa raiz.

**`next-mdx-remote@6` remove expressões JavaScript do MDX por padrão.** A opção
`blockJS` nasce ligada e injeta o plugin remark `removeJavaScriptExpressions`, que
descarta três coisas: expressões de bloco (`{algo}` em linha própria), expressões
inline em texto, e **expressões em atributos JSX** (`<Stat value={82.6} />`).
Atributos string sobrevivem; expressões viram nada.

Verificação direta, compilando o mesmo fonte com e sem a opção:

| Opção | Props que chegam ao componente |
|---|---|
| padrão (`blockJS: true`) | `{ unit: "%" }` |
| `blockJS: false` | `{ value: 82.6, unit: "%" }` |

A motivação da biblioteca é defensável: ela avalia o MDX compilado com
`Reflect.construct(Function, ...)`, então JavaScript arbitrário dentro do conteúdo é
execução remota de código. Bloquear expressões fecha esse caminho.

O contorno aplicado foi passar tudo como string (`value="82.6"`) e formatar o número
no componente, pelo idioma da página. Funciona, está em produção e passa na
verificação de 204 números. Falta decidir se fica.

**Forças em jogo.** O conteúdo vem só do repositório, escrito por uma pessoa e
revisado por git. As dez rotas de artigo são estáticas: o MDX compila no build, não a
cada requisição. A seção "Como contribuir" da página Sobre convida gente de fora a
propor artigos, o que pode mudar essa premissa.

## Decisão

Manter `blockJS` ligado e o conteúdo declarativo: **nenhuma expressão JavaScript nos
arquivos MDX, toda prop é string**. Adicionar uma verificação automática que quebra
quando alguém escrever uma expressão, porque hoje a falha é silenciosa.

## Opções consideradas

### Opção A: Manter o padrão, props em string

Conteúdo sem JavaScript. Números viajam como texto e são formatados no componente.

| Dimensão | Avaliação |
|---|---|
| Complexidade | Baixa. É o estado atual, zero mudança. |
| Custo | Um caractere de cerimônia por prop numérica. |
| Escalabilidade | Alta. O conteúdo continua sendo dado, não programa. |
| Familiaridade do time | Alta. Já documentado no README. |

**Prós:** superfície de execução fechada mesmo se o conteúdo passar a vir de fora ou a
renderizar por requisição; conteúdo legível por quem não programa; força os números a
saírem do dataset validado em vez de serem calculados na prosa; casa com o script
`check-numbers`.

**Contras:** a formatação do número é responsabilidade do componente, então cada
componente novo precisa lembrar disso; nada de cálculo em linha; e, hoje, escrever
`value={43.8}` falha **em silêncio**, sem erro de build.

### Opção B: Desligar `blockJS`

Uma linha em `MDXRemote`: `options={{ blockJS: false }}`. Expressões voltam a funcionar.

| Dimensão | Avaliação |
|---|---|
| Complexidade | Baixa para ligar, alta para raciocinar depois. |
| Custo | Reabre o caminho de `new Function` sobre o conteúdo. |
| Escalabilidade | Média. Conteúdo vira código; revisão fica mais cara. |
| Familiaridade do time | Alta. É o MDX que todo mundo conhece. |

**Prós:** `value={43.8}` volta a funcionar, e com ele qualquer expressão; nenhuma regra
para lembrar ao escrever.

**Contras:** desligar `blockJS` não deixa o conteúdo sem restrição, troca a lista de
permissão por uma **lista de bloqueio** (`blockDangerousJS` barra `eval`, `Function`,
`process`, `require` e afins). Lista de bloqueio é frágil por natureza. O risco é baixo
hoje, porque o MDX é nosso e compila no build, mas some a garantia caso o hub passe a
aceitar conteúdo de fora ou a renderizar sob demanda, que é justamente o convite da
página Sobre.

### Opção C: Compilar MDX no build, sem avaliação em runtime

Trocar `next-mdx-remote` por compilação no bundler, via `@next/mdx` ou uma etapa de
coleção de conteúdo que transforme cada MDX em módulo JavaScript.

| Dimensão | Avaliação |
|---|---|
| Complexidade | Alta. Muda o carregamento de conteúdo e a rota de artigo. |
| Custo | Meio dia de trabalho, mais o risco de atrito com Turbopack. |
| Escalabilidade | Alta. Sem `new Function` em lugar nenhum. |
| Familiaridade do time | Média. Padrão comum, mas é reescrever o que funciona. |

**Prós:** expressões completas **e** sem avaliação dinâmica, porque o MDX vira parte do
bundle; erro de sintaxe aparece no build; melhor checagem de tipos nos componentes.

**Contras:** o carregamento por slug com `[locale]` fica menos direto, já que
`@next/mdx` foi desenhado para MDX como rota ou import estático; obriga um passo de
build extra para o diretório de conteúdo; e resolve um problema que hoje não dói.

## Análise de trade-offs

A pergunta que decide não é técnica, é de modelo de ameaça: **de onde vem o MDX e
quando ele é avaliado?**

Hoje, vem do repositório e é avaliado no build, na nossa máquina. Nesse cenário o
`blockJS` protege contra quase nada, porque código nosso rodando no nosso build é o que
todo build faz. Esse é o argumento honesto a favor da opção B, e ele é forte.

O que inclina para A é o custo assimétrico. Manter A custa um par de aspas por número.
Sair de A e voltar depois custa auditar todo o conteúdo escrito no intervalo. E as duas
condições que tornariam o `blockJS` relevante já estão previstas no produto: o convite
a contribuições externas na página Sobre, e qualquer rota futura que renderize MDX sob
demanda, como uma prévia de rascunho.

A opção C é a resposta de princípio, porque entrega expressões sem avaliação dinâmica.
Ela não se justifica agora: nenhum artigo precisa de cálculo em linha, e os números que
importam já vêm do JSON validado, que é onde devem estar. Vale reabrir se algum dia um
artigo precisar computar de verdade.

O problema real da opção A não é a restrição, é o **modo de falha**. Uma prop com
expressão desaparece sem aviso: sem erro, sem log, sem build quebrado. Foi assim que o
bug apareceu, e vai voltar do mesmo jeito quando o sexto artigo for escrito daqui a
alguns meses. Uma restrição só é sustentável quando o descumprimento é ruidoso.

## Consequências

**Fica mais fácil:** escrever conteúdo sem pensar em JavaScript; aceitar contribuição
de fora sem auditar código embutido; manter os números vindos de uma fonte só.

**Fica mais difícil:** qualquer cálculo dentro de um artigo, que passa a exigir um
componente novo ou um campo derivado em `csv-to-json.mjs`. Isso é aceitável, e
provavelmente melhor: cálculo em prosa é cálculo sem teste.

**Precisa ser revisitado se:** um artigo precisar de lógica de verdade; o hub passar a
renderizar MDX por requisição; ou `next-mdx-remote` mudar o padrão de `blockJS`, que é
comportamento da versão 6.

## Itens de ação

1. [x] Documentar a regra de props em string no README, na seção de escrever artigo.
2. [x] Fazer a violação ser ruidosa: `scripts/check-mdx.mjs` compila cada artigo com
       e sem o bloqueio e compara o resultado, então detecta exatamente o que foi
       descartado, sem heurística. A mensagem aponta arquivo e linha.
3. [x] Rodar essa verificação no build: `prebuild` no `package.json`, então `npm run
       build` e o deploy na Vercel param antes de publicar conteúdo quebrado.
4. [x] Prender `next-mdx-remote` em `6.0.0` no `package.json`, sem acento de
       intervalo, para que a major não suba sem revisão desta decisão.

## Decisões abertas, fora deste ADR

Duas coisas ficaram pendentes e merecem registro próprio quando forem decididas.

**Slug em português nas rotas em inglês.** O artigo "The anxious middle" mora em
`/en/articles/o-centro-ansioso`, porque o slug é a identidade que pareia os dois
arquivos. Custa em SEO e em legibilidade da URL para o leitor de inglês. A alternativa
é um mapa de slug por idioma no frontmatter, que resolve mas duplica a chave de
identidade.

**Proteção de deploy.** O projeto na Vercel está com Vercel Authentication ligada, o
que contradiz o requisito de hub aberto na web. Enquanto não for desligada, a URL de
produção responde com redirecionamento para login.

## Nota de versão

`next-mdx-remote` está preso em `6.0.0`, sem acento de intervalo, porque `blockJS` e o
plugin `removeJavaScriptExpressions` são comportamento dessa major. Antes de subir de
versão, rode `npm run check:mdx` e releia esta decisão.
