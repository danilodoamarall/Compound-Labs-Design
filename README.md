# Compound Design

Hub aberto de design engineering com IA. Artigos que também são apresentação, um
catálogo de skills com licença verificada repositório a repositório, e um CLI e um
servidor MCP para o seu agente usar esse catálogo.

## A filosofia

O nome é uma tese: **cada coisa que se aprende deve tornar a próxima mais fácil,
não mais difícil.** Como juros compostos.

A maior parte do trabalho vai no sentido contrário. Cada coisa nova negocia com
as antigas, e depois de alguns anos gasta-se mais tempo brigando com o que
existe do que construindo em cima. Acumular é inverter isso: em vez de adicionar
complexidade, cada coisa nova ensina algo ao sistema.

O ciclo tem quatro passos — **planejar, fazer, revisar, acumular**. Os três
primeiros qualquer pessoa que trabalha com IA já faz. O quarto é o que separa
acumular de só produzir: o que se aprendeu vira algo reutilizável e encontrável.
Pule esse passo e foi só trabalho com IA.

Este repositório pratica o que descreve, e por isso é aberto:

| O que se aprendeu | O que virou |
|---|---|
| Números escritos à mão divergiam do produto | `scripts/check-counts.mjs`, que quebra o build |
| Skills copiadas mandavam abrir arquivos inexistentes | `scripts/check-skill-links.mjs`, 1.183 links reescritos |
| Percentuais dos artigos podiam mentir | `scripts/check-numbers.mjs`, 204 números conferidos |
| Decisões se perdiam na conversa | `docs/adr/` |
| Craft dependia de memória | `docs/plano-craft.md`, sete portões medidos |
| Boas práticas de terceiros se perdiam | o catálogo de 269 skills, com crédito e licença |

Por [Danilo do Amaral](https://www.linkedin.com/in/danilodoamaral/),
Design Engineer no Pitang Labs, pós-graduado em UX & UI pela EBAC e em UX
Engineering pela PUC Minas.

Fluxos de usuário e histórias com critérios de aceite: `docs/fluxos-e-historias.md`.
O que falta para fechar a v1, por fase: `docs/plano-fechamento-v1.md`.
A régua de craft que toda interface passa, com as referências medidas: `docs/plano-craft.md`.
Como contribuir: `CONTRIBUTING.md`.
Decisões de arquitetura: `docs/adr/`.

Bilíngue (pt-BR padrão, en). Next.js App Router + Tailwind + React Bits.

## Rodar

```bash
npm install
npm run dev
```

## React Bits Pro

Os blocks Pro exigem uma chave de licença. Copie `.env.example` para `.env.local` e
preencha:

```
REACTBITS_LICENSE_KEY=sua-chave
```

Os registries já estão em `components.json`. Depois disso:

```bash
npx shadcn@latest add @reactbits-pro/<block>     # blocks (planos Pro e Ultimate)
npx shadcn@latest add @reactbits-starter/<nome>  # componentes
npx shadcn@latest add @react-bits/<Nome>-TS-TW   # componentes gratuitos
```

O código instalado fica versionado no repositório, então o deploy não precisa da chave.

## Conteúdo

| Onde | O quê |
|---|---|
| `content/artigos/<slug>.<locale>.mdx` | artigos; cada `<Slide>` vira um slide na apresentação |
| `content/data/state-of-prototyping-2026.json` | dados da pesquisa, gerados do CSV |
| `content/skills/*.md` + `content/skills-registry.json` | o catálogo de skills: 207 copiadas com procedência, 62 apontadas |
| `content/repo-stars.json` | estrelas e último push dos repositórios de origem (`scripts/fetch-repo-stars.mjs`) |
| `content/resources.json` | o índice do Explorar, gerado por `scripts/build-resources.mjs` |
| `content/radar.json`, `content/ai-tools.json` | acervo de ferramentas: alimentam o índice, não têm mais página própria |
| `content/skills-agents.json` | skills curadas à mão, também só no índice |
| `messages/pt.json`, `messages/en.json` | textos de interface |

Itens com `"draft": true` aparecem com a etiqueta de rascunho no site.

Regenerar os dados da pesquisa a partir do CSV:

```bash
node scripts/csv-to-json.mjs
```

### Escrevendo um artigo

O pipeline de MDX descarta atributos com expressão JSX, então **toda prop é string**:
use `<Stat value="43.8" unit="%" label="..." />`, nunca `value={43.8}`. O ponto é o
separador decimal no arquivo; o número é formatado por idioma na renderização.

Componentes disponíveis no MDX: `Slide`, `Stats`, `Stat`, `Chart`, `Callout`,
`Question`, `Two`. Os gráficos vêm de `src/components/charts/Chart.tsx`.

## Verificações

```bash
npm run check:mdx      # roda sozinho antes de todo build
npm run check:numbers
```

`check:mdx` compila cada artigo com e sem o bloqueio de JavaScript e compara: se
algo foi descartado em silêncio, o build para e a mensagem aponta a linha. O porquê
está em [docs/adr/0001](docs/adr/0001-pipeline-de-conteudo-mdx.md).

`check:numbers` compara todo percentual citado nos artigos com o JSON da pesquisa.

## Fonte dos dados

UX Tools. (2026). State of Prototyping Spring 2026. https://survey.uxtools.co — CC BY 4.0.
