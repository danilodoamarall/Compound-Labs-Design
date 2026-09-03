# Labs Knowledge Hub

Hub público de conhecimento do Labs. Artigos em formato de apresentação, radar de
ferramentas e catálogos de AI tools, skills e agents. Conteúdo por Danilo do Amaral,
Design Engineer & AI Builder.

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
| `content/radar.json` | radar de ferramentas |
| `content/ai-tools.json` | catálogo de AI tools |
| `content/skills-agents.json` | catálogo de skills e agents |
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

## Verificar os números

```bash
node scripts/check-numbers.mjs
```

Compara todo percentual citado nos artigos com o JSON da pesquisa.

## Fonte dos dados

UX Tools. (2026). State of Prototyping Spring 2026. https://survey.uxtools.co — CC BY 4.0.
