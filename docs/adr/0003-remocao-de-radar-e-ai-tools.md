# ADR-0003: Remover as seções Radar e AI Tools, manter o acervo

**Status:** Aceito
**Data:** 4 de setembro de 2026
**Decisor:** Danilo do Amaral

## Contexto

O hub tinha sete seções com página própria. Uma auditoria de densidade mediu o
conteúdo próprio de cada uma:

| Seção | Itens | Texto próprio | Rascunho |
|---|---|---|---|
| Skills | 269 | 2.254 KB de markdown | 0% |
| Artigos | 5 | 68 KB de MDX, 54 slides, 11 gráficos | 0% |
| Workflow | 24 | 2,5 KB | 0% |
| Docs | 7 seções | 2,6 KB | — |
| FAQ | 9 | 1,9 KB | — |
| **Radar** | 24 | **1,8 KB** | **100%** |
| **AI Tools** | 14 | **1,0 KB** | **100%** |

Skills e Artigos somam mais de 2,3 MB. Todo o resto junto dá 10 KB. Radar e AI
Tools eram listas de uma linha por ferramenta, com todos os itens marcados como
rascunho, e cada uma ocupava um lugar no menu, um card no bento e uma página.

Junto com isso, o mapeamento mostrou três problemas estruturais:

- **Onze recursos existiam só no Radar** (FigJam, Framer, Notion, Slack,
  Storybook…) e perderiam a página `/r/` com a remoção.
- **`radar.json` alimentava a data de todas as 104 páginas de recurso**, inclusive
  as que nada tinham a ver com o radar. Apagar o arquivo derrubava a rota.
- **Cerca de quarenta números descrevendo o produto estavam escritos à mão** e
  nada os conferia: "em quatro formatos", "os nove destinos em três grupos",
  "5+3+4, depois 4+4+4". Dois já estavam errados.

Havia também **nove componentes sem nenhum importador** e um `content/home.json`
que ninguém lia.

## Decisão

1. **Radar e AI Tools deixam de ser seções.** Saem do menu, do bento, do rodapé,
   do `routing.ts` e do `site.ts`. As rotas respondem 404.
2. **Os dados ficam como acervo.** `radar.json` e `ai-tools.json` continuam
   alimentando o índice do `/explorar` e as páginas `/r/`. Nenhum dos 57 recursos
   perde a página. As seções passam a `navigable: false` no índice: aparecem como
   rótulo ("Ferramentas", "Ferramentas de IA"), nunca como destino.
3. **O bento passa a cinco cards**, os cinco lugares em que o hub tem substância:
   Artigos (8) + Skills (4) / CLI (4) + MCP (4) + Explorar (4). Workflow, Docs e
   FAQ continuam no menu e no rodapé; saíram da vitrine.
4. **CLI, MCP e Explorar entram no menu.** Não estavam em lugar nenhum além da
   própria página de skills. Os CTAs do hero passam a apontar para CLI e MCP.
5. **A copy do produto sai da primeira pessoa do curador.** "Recursos que eu
   mantenho e uso todo dia" vira o que o hub entrega; "o que usamos no lab" vira
   o que a plataforma faz. Os artigos mantêm a voz de opinião em primeira pessoa,
   que é o formato deles.
6. **O `/explorar` vira um índice datado por verbo**, que já era a taxonomia das
   tags: uma linha por item com data, do mais recente ao mais antigo, e os
   repositórios do catálogo de skills entram no índice (um por repositório, 62).
   Sem data, a coluna fica vazia. Nenhuma data é inventada.
7. **Uma checagem no prebuild confere os números da prosa contra o produto**
   (`scripts/check-counts.mjs`), e proíbe as palavras da seção removida e da voz
   antiga. É o mesmo remédio que o ADR-0001 aplicou aos percentuais dos artigos.
8. **Uma fonte para menu e rodapé.** `NAV_GROUPS` e `NAV_HREF` em `src/lib/site.ts`
   alimentam o cabeçalho, o rodapé e a checagem. Antes eram três listas que
   precisavam concordar à mão.

## Opções consideradas

### A. Remover só o Radar
Menor mudança. Mantinha no ar a seção mais fina do hub (AI Tools, 966 caracteres,
100% rascunho). Rejeitada: a auditoria mostrou que AI Tools era mais fina que o
Radar pelo mesmo critério.

### B. Remover Radar e AI Tools, apagar os dados — **rejeitada**
Limpo, mas 11 páginas `/r/` (22 rotas) morreriam e o `/explorar` — uma das cinco
áreas que definem a v1 — perderia 19% do conteúdo.

### C. Remover as páginas, manter o acervo — **escolhida**
Nada quebra, o índice não encolhe, e a interface deixa de mostrar uma taxonomia
(anéis adotar/testar/avaliar/evitar) que era 100% rascunho.

### D. Remover também o Workflow
O Workflow tem 23 categorias para 24 itens; a taxonomia não classifica nada. Mas
não é rascunho e tem 2,5 KB de descrições próprias. Fica, fora do bento, para uma
decisão à parte.

## Consequências

**Mais fácil:** o produto conta uma história só — artigos, skills, e as
ferramentas para usá-las. A home encurta. Nenhuma contagem em prosa fica errada
sem o build avisar.

**Mais difícil:** quem quiser reviver um "radar" vai encontrar os dados, mas não
a interface; ela foi apagada, não escondida.

**Revisitar:** o Workflow. E a possibilidade de o acervo de ferramentas virar
parte do catálogo de skills, quando houver skills para as ferramentas.

**Decididos depois (4 de setembro, higiene):**

- *Workflow, 23 categorias para 24 itens.* Olhando a página, o agrupamento já é
  por **etapa** (seis etapas); `category` é a legenda de uma linha por
  ferramenta ("design canvas", "editor com IA"), não uma taxonomia. Não
  classifica nada porque nunca foi para classificar. Fica como está.
- *`REACTBITS_LICENSE_KEY` só em `.env.local`, não na Vercel.* A chave é lida
  apenas pelo `components.json`, na hora de instalar um bloco do registro Pro
  com o shadcn. Nenhum código em `src/`, `next.config.ts` ou `package.json` a
  lê; o hero usa a cópia vendorizada. Produção não precisa dela, e um segredo a
  menos no ambiente de deploy é melhor. Não sobe.

## Itens de ação

1. [x] Remover rotas, páginas, componentes e chaves de tradução
2. [x] `build-resources.mjs` marca seções não navegáveis e escreve `updated`
3. [x] `/r/[key]` lê a data do índice, não de `radar.json`
4. [x] Bento de cinco cards com visuais próprios para CLI e MCP
5. [x] `NAV_GROUPS` como fonte única do menu e do rodapé
6. [x] Copy do produto reescrita em pt e en
7. [x] `/explorar` com data, repositórios de skills e "um ao acaso"
8. [x] `check-counts.mjs` no prebuild
9. [x] Apagar os nove componentes mortos e `content/home.json`
10. [x] `docs/fluxos-e-historias.md` como especificação da v1
