# Plano de fechamento da v1

**Data:** 4 de setembro de 2026
**Estado:** a reestruturação está publicada em https://labs-hub-five.vercel.app. Este
plano lista o que falta para chamar de v1 fechada, em ordem, com o critério de
"pronto" de cada item e quem destrava.

A especificação contra a qual tudo é medido: `docs/fluxos-e-historias.md`.
A decisão que definiu o escopo: `docs/adr/0003-remocao-de-radar-e-ai-tools.md`.

## Onde estamos

| Frente | Estado | Prova |
|---|---|---|
| Home com cinco cards, CTAs para CLI e MCP | publicado | `/pt` e `/en` 200; bento `8+4+4+4+4` |
| Radar e AI Tools removidos, acervo preservado | publicado | `/pt/radar` 404; `/pt/r/notion` 200 |
| Menu e rodapé com dez destinos da mesma fonte | publicado | `src/lib/site.ts` → header, footer, busca |
| Copy do produto sem voz de curador | publicado | `check-counts` proíbe e passa |
| Placar de skills com estrelas e colapso por repositório | publicado | `/pt/skills-agents?q=emilkowalski` |
| Página de skill com trilho de procedência | publicado | frontmatter não vaza; atribuição no idioma |
| 1.183 links relativos das skills reescritos para o commit | publicado | `check-skill-links` = 0 restantes |
| `/explorar` como índice datado (data, 10 tags, um ao acaso, 62 repos) | publicado | 119 itens, 67 com data |
| MCP: 3 ferramentas, paginação, envelope estável, 429 | publicado | `tools/list`; `/api/skills` 12 KB |
| CLI 1.1.0: códigos de saída certos, `--all` pagina, zero deps | **pronto, não publicado** | `npm pack --dry-run` ok |
| Checagens no prebuild: mdx, counts, links, resources | publicado | build passa com as três |
| Docs: ADR-0002 aceito, ADR-0003, README, `/docs`, FAQ, fluxos e US | publicado | — |
| Verificação adversarial dos oito fluxos | **rodando** | workflow `verificar-fluxos-v1` |

## Fase 0 — Fechar a verificação (hoje)

A verificação dos oito fluxos está rodando contra produção, um agente por fluxo,
cada achado reproduzido por um cético. Quando terminar:

1. [x] Ler os critérios que falharam e os defeitos confirmados.
2. [x] Corrigir cada confirmado. Regra: nenhum "menor" fica para depois se o
       conserto cabe em uma edição. (4 de 4 corrigidos e publicados.)
3. [x] Republicar e reverificar só o que mudou: workflow `reverificar-correcoes-v1`,
       4 de 4 confirmados corrigidos em produção, nenhuma regressão ao redor.
4. [x] Resultado anexado na seção "Resultado da verificação".

**Pronto quando:** todos os critérios de `docs/fluxos-e-historias.md` marcados
como passou, ou o que falhou está listado com a razão de ficar.

## Fase 1 — Publicar o CLI (destrava: você)

O pacote está pronto e conferido; o bloqueio é autenticação. O token no seu
`~/.npmrc` tem formato válido de npm mas o registro responde 401: foi revogado
ou expirou. Com o rebrand, o pacote se chama `@compound-design/skills`: a
organização `compound-design` **ainda não existe no npm** (o escopo está livre,
conferido no registro) — crie-a em https://www.npmjs.com/org/create ao fazer
login. A `ai-builders-lab` que você criou antes fica sem uso.

1. [ ] Você: `npm logout` e `npm login`. Quando aparecer
       `Press ENTER to open in the browser...`, aperte Enter e conclua no
       navegador. Se cair no prompt `Username:`, Ctrl+C e use um token:
       https://www.npmjs.com/settings/~/tokens → Granular Access, escrita no
       escopo `@compound-design` → `npm config set //registry.npmjs.org/:_authToken=SEU_TOKEN`.
2. [ ] Confirmar com `npm whoami`.
3. [ ] `npm publish --workspace packages/skills-cli --access public`.
4. [ ] Provar de fora: `npx @compound-design/skills@1.1.0 --version` numa pasta
       vazia, e `npx @compound-design/skills start`.
5. [ ] Atualizar `docs/adr/0002` (item 7 já está `[x]`; anotar a versão publicada).

**Pronto quando:** `npm view @compound-design/skills version` devolve `1.1.0`.

## Fase 2 — Inscrição de verdade (destrava: você)

`/api/subscribe` responde 503 `not_configured` porque a integração Resend não
está instalada. O formulário já trata isso sem fingir sucesso, mas a home promete
um e-mail que hoje ninguém recebe.

1. [ ] Você: aceitar os termos em
       https://vercel.com/danilos-projects-94eff717/~/integrations/accept-terms/resend?source=cli
2. [ ] `vercel integration add resend` → `vercel env pull --yes`.
3. [ ] Criar a audiência e confirmar `RESEND_API_KEY` e `RESEND_AUDIENCE_ID` em
       produção (`vercel env ls production`).
4. [ ] Republicar e testar: POST com e-mail válido responde 200; o contato
       aparece na audiência.

**Pronto quando:** o Fluxo 7 passa inteiro, inclusive o caso de sucesso.

## Fase 3 — Higiene que sobrou (eu, sem destravar nada)

Itens da crítica de design e das verificações que não bloqueiam a v1 mas ficaram:

1. [x] `REACTBITS_LICENSE_KEY` — **não sobe para a Vercel.** Só o `components.json`
       a lê, na instalação de blocos do registro Pro; nada em runtime. Produção
       não precisa dela. Registrado no ADR-0003.
2. [x] Links do rodapé: alvo passou a `min-h-6` (24px) com `inline-flex`.
3. [x] Selo "Rascunho": `--warm` dava 4,3:1 sobre branco em 10px. Novo token
       `--warm-text` (#8f3a0f claro, 7,4:1; #e08a55 escuro, 7,2:1).
4. [x] Workflow — **fica como está.** O agrupamento já é por etapa (6);
       `category` é legenda de uma linha, não taxonomia. Registrado no ADR-0003.
5. [x] `check-counts` passou a conferir que toda URL `*.vercel.app` do README do
       CLI é a URL padrão de produção em `site-url.ts`.
6. [x] Comentários com "sete arquivos" reescritos sem o número.

## Fase 4 — O que fica para a v1.1 (decisão sua)

Não entra agora; registrado para não perder.

- **Workflow como catálogo de ferramentas de verdade**, com página por etapa,
  ou sua fusão no acervo do `/explorar`.
- **Acervo de ferramentas virar skills**: Figma, Storybook, Notion etc. hoje são
  linhas de uma frase. Quando houver skills para elas, ganham página real.
- **Instalações do CLI como sinal**: quando houver downloads do npm, o placar
  pode mostrar isso ao lado das estrelas. Só com dado real.
- **Versionamento do contrato do MCP e do CLI**: um `CHANGELOG.md` no pacote e
  `serverInfo.version` acompanhando.

## Ordem e dependências

```
Fase 0 (verificação)  ──► hoje, eu
Fase 1 (npm)          ──► precisa do seu login; 10 minutos depois disso
Fase 2 (Resend)       ──► precisa de você aceitar os termos; 20 minutos depois
Fase 3 (higiene)      ──► eu, independente das outras
Fase 4                ──► v1.1
```

Fases 1 e 2 não dependem uma da outra nem da Fase 0. Podem ir em paralelo
assim que você destravar cada uma.

## Fase 5 — Rebrand: Compound Design (briefing de 4 de setembro)

O produto passa a se chamar **Compound Design**. O nome é uma analogia: o que se
aprende em IA, design e desenvolvimento rende sobre o que já se sabia, como juros
compostos — cinco anos disso, como Design Engineer especializado em IA. E o
produto tem de levar o crédito até quem o faz: **Danilo do Amaral, Design
Engineer no Pitang Labs, pós-graduado em UX & UI pela EBAC e em UX Engineering
pela PUC Minas.**

1. [x] `Site.name`, tagline, badge, byline, rodapé e página Sobre com o nome, a
       analogia e o crédito completo (pt e en). Nome no hero, rodapé e Sobre leva
       ao LinkedIn.
2. [x] Marca gerada (`build-brand.mjs`: `aria-label`, `<title>`), ícones, comentário
       do `logo.tsx`.
3. [x] Skill de roteamento (`compound-design-root`), `serverInfo.name` do MCP e do
       cartão, chave do `mcp add` na documentação.
4. [x] Pacote npm renomeado para **`@compound-design/skills`** (escopo livre no
       registro; o nome antigo já não batia com a marca). O bin continua
       `ai-skills`. **Destrava você:** criar a organização `compound-design` no npm
       em vez de usar a `ai-builders-lab` — é o mesmo passo do login da Fase 1,
       com outro nome de organização.
5. [x] README do repositório, README do pacote, `docs/fluxos-e-historias.md`,
       este plano, memória do projeto. Nenhuma menção ao desengs.com sobrou; o
       modelo do índice é descrito pelo que é.
6. [x] Rebuild e deploy feitos (título "Compound Design", zero menções ao nome
       antigo no texto visível, MCP renomeado). Reverificação dos fluxos entra
       junto com a rodada de craft da Fase 7.

Não muda: rotas, o repositório `Compound-Labs-Design` no GitHub (o nome agora
até combina), os ADRs (registro histórico).

## Fase 6 — Documentação didática e CTA na home (4 de setembro) — feita

`/docs` deixou de ser sete parágrafos sobre o hub e virou documentação para
quem nunca abriu um agente de IA, no molde da introdução do shadcn/ui: 17 seções
em 5 grupos (Comece aqui · Conceitos, sem jargão · Como usar · Como funciona por
dentro · Participe), índice agrupado, um conceito por título, cada termo
definido na primeira vez, comandos com botão de copiar. O hero ganhou um
terceiro caminho, "Novo por aqui? Leia a documentação". Publicado.

## Fase 7 — Craft, diretrizes e repositório (em curso)

A régua está em **`docs/plano-craft.md`**: as referências que o produto tem de
honrar (aiforui, Vercel, React Bits, skills.sh, ui-skills, Emil, Jakub, Iconiq,
motion.dev, easing.dev, easing-gradients, oklch.fyi), o que cada uma ensina de
forma medível, e os sete portões que toda interface passa.

1. [ ] **Pesquisa profunda** (em curso): 10 agentes, um por parte do produto,
       produzem `docs/diretrizes.md` — propósito, princípios com fonte, fatos
       medidos, faça/não faça, problemas abertos.
2. [ ] **As 12 skills do jakubkrehel aplicadas** (em curso, na mesma rodada):
       `better-interface`, `better-ui`, `make-interfaces-feel-better`,
       `better-typography`, `better-colors`, `better-accessibility`,
       `better-layout`, `better-writing`, `interface-review`, `break`, `variant`,
       `explain-interface`. Findings de prioridade alta corrigidos na rodada.
3. [~] Fundações: **paleta convertida para OKLCH** (107 tokens, sem perda: o
       round-trip oklch→sRGB reproduz cada hex com desvio ≤ 1/255; o hex fica em
       comentário ao lado). A leitura de L por papel já mostra `teal` 57 e `warm`
       59 no tema claro — pesos visuais quase iguais, como o oklch.fyi pede.
       Falta: ajustar L em passos uniformes por papel depois das medições de
       contraste da pesquisa, e declarar/auditar a escala tipográfica por página.
4. [x] Repositório: LICENSE (MIT para o código; conteúdo e skills com as próprias
       licenças), CONTRIBUTING, CI real (lint, tipos, testes, build com as
       checagens) no lugar do workflow de modelo, `.nvmrc`, descrição e homepage
       do repositório atualizadas.
5. [ ] Commit e push do estado verificado; CI verde no GitHub.
6. [ ] Reverificar os oito fluxos depois da rodada de craft.

**Pronto quando:** `docs/diretrizes.md` existe; nenhum finding de prioridade alta
das skills do Jakub em aberto; os sete portões medidos por interface; CI verde;
repositório legível por um colega em cinco minutos (README → CONTRIBUTING →
docs/).

## Resultado da verificação (4 de setembro, contra produção)

Workflow `verificar-fluxos-v1`: 8 agentes, um por fluxo, cada achado reproduzido
por um cético. **68 critérios de aceite: 67 passaram, 1 falhou.** 10 defeitos
relatados: **4 confirmados, 6 refutados.**

| Fluxo | Critérios | Resultado |
|---|---|---|
| F1 Home e navegação | todos | passou |
| F2 Skills (humano) | todos | passou · 2 defeitos menores confirmados |
| F3 CLI | todos | passou |
| F4 MCP | todos | passou |
| F5 Explorar | todos | passou · 1 defeito menor confirmado |
| F6 Artigos | todos | passou |
| F7 Inscrição | 1 falhou | "sucesso não promete e-mail" — corrigido |
| F8 Hub e transversais | todos | passou |

**Confirmados e corrigidos na mesma hora (publicados):**

1. Cabeçalho da coluna "topics" em inglês na página pt do placar — literal fora
   do i18n. Agora `colTopics` ("tópicos"/"topics").
2. Botão de copiar o comando com nome acessível "Instalação" em vez da ação.
   Agora "Copiar comando"/"Copy command".
3. `h1` de `/pt/explorar` era "Explore o", metade de uma frase cuja outra metade
   nunca renderizava. Agora "Explorar"; a chave morta saiu.
4. Mensagem de sucesso da inscrição mandava "conferir a caixa de entrada para
   confirmar", e nenhum e-mail é enviado. Agora "Pronto. Você está na lista."

**Refutados pelo cético (não são defeitos):** os 10 destinos do menu não estão no
HTML inicial (o painel abre no cliente — é o comportamento do mega-menu);
rótulos "Skills & Agents"/"O hub" diferem da spec, que usava nomes abreviados;
o conteúdo da skill é `<pre>` e não markdown renderizado (decisão de design:
o agente lê o texto cru); selo "Rascunho" visível em 32 itens do acervo (é o
estado real deles); "um ao acaso" caindo na home (não reproduzido em 4 tentativas
adicionais); "atualizado em" em ISO e em UTC (formato do índice, consistente).

**Reverificação das quatro correções** (workflow `reverificar-correcoes-v1`, um
agente por correção, contra produção): **4 de 4 confirmados corrigidos**; nenhuma
regressão nas páginas ao redor (colunas vizinhas, outros botões com `aria-label`,
`<title>` e `h1` únicos, formulário íntegro). Fase 0 fechada.
