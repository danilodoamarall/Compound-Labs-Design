# Como contribuir

Obrigado por chegar até aqui. Este repositório é o código do Compound Design:
o site, os scripts que montam o catálogo e o CLI. Tudo o que está abaixo cabe
em cinco minutos de leitura.

## O que dá para contribuir

| Quer… | Onde |
|---|---|
| Propor uma skill para o catálogo | Abra uma issue com o link do repositório. O catálogo só hospeda skills sob licença permissiva; as demais entram como ponteiro. |
| Corrigir um texto (pt ou en) | `messages/pt.json` e `messages/en.json` para a interface; `content/pages.json` para Docs e FAQ. As chaves têm de existir nos dois idiomas. |
| Corrigir um artigo | `content/artigos/<slug>.<locale>.mdx`. Todo número citado é conferido contra o dataset no build. |
| Melhorar o CLI | `packages/skills-cli/bin/cli.js`. Zero dependências é regra, não acidente. |
| Melhorar o servidor MCP | `src/app/mcp/route.ts` e `src/lib/skills.ts`. O contrato está em `docs/fluxos-e-historias.md`, Fluxo 4. |

## Antes de abrir um pull request

```bash
npm install
npm run build
```

O `build` roda, antes de compilar: a checagem dos números citados nos artigos,
a geração do índice de recursos, a checagem de links das skills e a checagem de
contagens na prosa. Se algo divergir, o build para e diz onde.

Depois:

```bash
npx eslint src
npx tsc --noEmit
node --test 'scripts/lib/*.test.mjs'
```

## O que o build protege

- **Números na prosa.** "Cinco artigos", "269 entradas" e afins são conferidos
  contra o produto real (`scripts/check-counts.mjs`). Se você mudou uma contagem,
  atualize o texto — ou a asserção, se a frase mudou de propósito.
- **Voz da copy.** A interface fala do que o produto entrega, nunca "o que usamos
  no lab". O build recusa as frases antigas.
- **Links das skills.** Nenhum link relativo dentro de uma skill hospedada; todos
  são absolutos no commit de origem (`scripts/check-skill-links.mjs`).
- **Bilíngue.** `messages/pt.json` e `en.json` precisam ter exatamente as mesmas
  chaves.

## Como escrever aqui

Leia `docs/plano-craft.md`: são os sete portões que toda interface passa
(tipografia, cor, movimento, alvo e foco, estados, escrita, composição), com o
valor medido de cada um. E `docs/fluxos-e-historias.md`, que diz o que cada
fluxo tem de fazer.

Comentários no código explicam **por quê**, não o quê. Em português.

## Procedência das skills

Cada skill em `content/skills/` é de quem a escreveu. A licença do repositório
de origem foi verificada uma a uma, e o arquivo carrega origem, autor, licença e
commit. Não edite o conteúdo de uma skill aqui: corrija na origem e reingira
(`node scripts/ingest-skills.mjs`). Se você é autor de uma skill e não quer que
ela seja servida daqui, abra uma issue; ela vira ponteiro na mesma hora.

## Decisões

As decisões de arquitetura estão em `docs/adr/`. Uma decisão nova ganha um ADR
novo; um ADR antigo não é reescrito, ganha adendo.
