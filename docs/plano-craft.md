# Plano de craft — a régua para todas as interfaces

**Data:** 4 de setembro de 2026
**Regra:** toda interface do Compound Design passa pelo que estas referências
ensinam. O que não passar não vale. A régua é medida, não sentida: cada item
abaixo tem um número, um comando ou uma página onde se confere.

As referências, e o que cada uma ensina de verdade (medido no navegador, não
lido da imagem):

| Referência | O que ensina | Valor que adotamos |
|---|---|---|
| **aiforui.dev** (Emil Kowalski) | A escala tipográfica e o espaçamento do primeiro dobra: título, subtítulo, respiro | Título 44/48 peso 500 tracking −0,88; subtítulo 14–18/22–28 a 65% de opacidade; 12px entre eles |
| **vercel.com/design** | Arquitetura da informação: achar qualquer coisa em dois cliques; guidelines como produto | Menu em 4 grupos, pelo que a pessoa veio fazer, com descrição por destino; rodapé como mapa; busca com índice único |
| **reactbits.dev / pro** | O card do hero e o "What's inside": raio 30, botões 46px, grade de 12 colunas com spans 5/3/4, cards 288px com composição animada própria | Já é o nosso bento e o nosso hero; a regra é **um efeito forte por bloco** |
| **skills.sh** | Placar com procedência: rótulos mono em versalete 14/500, valor grande 30/600, badges 12px, sidebar de governança | Já é o nosso placar e o trilho de procedência; sem número inventado |
| **ui-skills.com** | "Agent, start here": CLI e MCP como duas portas iguais; docs de conexão escritas | Já são nossas páginas /cli e /mcp; nós documentamos a configuração, eles não |
| **emilkowal.ski** | "You Don't Need Animations", "7 Practical Animation Tips", "Train Your Judgement": animar só com propósito, 150–400ms, sair mais rápido que entrar | Toda animação declara o propósito no comentário; sem propósito, sai |
| **jakub.kr + 12 skills no catálogo** | "Details That Make Interfaces Feel Better", "Less is More": foco visível, alvos de 24/44, estados, escrita de interface, OKLCH | As 12 skills viram **ferramentas de revisão**: `better-interface` a cada mudança, `break` em cada componente, `variant` quando há dúvida |
| **iconiqui.com** | Componentes contidos, conduzidos por movimento, sem brilho | Estrutura vem daqui: card, botões, abas, chips. Atmosfera não |
| **motion.dev** | `useReducedMotion`, `AnimatePresence`, layout animations, `delayChildren: stagger()` | Toda entrada respeita reduced-motion entrando no estado final; nada anima sem ser visto |
| **easing.dev** | Curvas com nome: snappyOut, outCubic, inOutQuart | `src/lib/easing.ts` já as tem; **nenhuma curva escrita à mão** fora dali |
| **easing-gradients.ibelick.com** | Gradientes com paradas em curva, não lineares | O scrim dos cards já usa `gradient-ease-out`; vale para todo véu e desvanecimento |
| **oklch.fyi** | Cor perceptualmente uniforme: mesma L = mesmo peso visual; chroma controlado; gamut sRGB seguro | Paleta migra de hex para OKLCH com passos de L uniformes; contraste medido em OKLab |
| **desengs.com** | Índice datado por verbo, uma linha por item, um ao acaso | Já é o nosso /explorar |

---

## Os portões: o que toda interface tem de passar

Nenhum item é opinião. Cada um tem como medir.

### 1. Tipografia
- [ ] Escala do aiforui no primeiro dobra de toda página: `h1` 44/48/500 em desktop; corpo 16/26; rótulos mono 11,5–14 em versalete com tracking 0,08em.
- [ ] Nenhum tamanho fora da escala declarada em `globals.css`. Medir: listar `font-size` computados por página; qualquer valor que não esteja na escala é defeito.
- [ ] Medida de linha ≤ 75 caracteres em prosa (`.measure`, 68ch nas docs).
- [ ] Título em `text-balance`; nenhuma viúva de uma palavra no hero.

### 2. Cor e contraste
- [ ] Todo texto ≥ 4,5:1 (normal) ou 3:1 (≥ 24px), **medido em OKLab com composição de alpha**, nos dois temas. O script de auditoria já existe; roda por página.
- [x] Tokens em OKLCH: os 107 convertidos sem perda em 4 de setembro (hex em comentário ao lado, para quem procurar a cor antiga).
- [ ] L uniforme por papel (texto, muted, borda) nos dois temas, ajustado com as medições de contraste — a leitura já existe (`teal` 57, `warm` 59; textos secundários 45/44/46 no claro).
- [ ] Nenhuma cor escrita fora de `globals.css`, exceto as capas dos cards, que são dado (`cover` em `site.ts`).

### 3. Movimento
- [ ] Toda animação tem propósito escrito no comentário (entrada, feedback, orientação). Sem propósito, sai. (Emil: "You Don't Need Animations".)
- [ ] Duração 150–400ms para interface; saída mais rápida que entrada; curvas de `src/lib/easing.ts` pelo nome.
- [ ] `prefers-reduced-motion` → estado final sem animar, em **todo** componente. Medir com o emulador do navegador.
- [ ] Nada anima fora da viewport (`useInView`, `once: true`).
- [ ] Um efeito forte por bloco. Metal fundido no hero; brilho nos cards; nunca os dois no mesmo campo de visão.

### 4. Alvo, foco e teclado (Jakub, `better-accessibility`)
- [ ] Todo alvo ≥ 24×24 CSS px; 44 em mobile para ações primárias.
- [ ] Foco visível em todo interativo (`focus-visible:ring-2`); nunca `outline-none` sem substituto.
- [ ] Escape fecha painéis; Tab percorre na ordem visual; nada preso.
- [ ] Todo ícone sozinho tem `aria-label` com a **ação**, não o nome da seção. (Foi o defeito do botão de copiar.)
- [ ] `aria-hidden` só em decoração; cabeçalhos de tabela não são decoração.

### 5. Estados (Jakub, `break`)
- [ ] Todo componente com dado tem os quatro estados renderizados e vistos: vazio, carregando, erro, cheio.
- [ ] Texto longo, nome longo, zero itens, 1 item, 1.000 itens: nada estoura, nada some.
- [ ] Formulário: inválido, indisponível (503), sucesso — e o sucesso só promete o que a rota honra.

### 6. Escrita (Jakub, `better-writing`; nossa voz)
- [ ] Sujeito é o produto e o que ele entrega. Nunca "usamos", "eu mantenho". `check-counts` proíbe.
- [ ] Um termo, um nome: skill, agente, catálogo, placar, acervo. Sem sinônimos.
- [ ] Toda palavra técnica definida na primeira vez que aparece, na própria tela ou a um clique de /docs.
- [ ] Erro diz o que aconteceu, por quê, e o que fazer. Vazio diz o que é, por que está vazio, como começar.
- [ ] pt e en com as mesmas chaves; nenhuma palavra do outro idioma em texto visível. Medido por página.

### 7. Composição
- [ ] Grade de 12 colunas; toda linha fecha em 12. `check-counts` confere o bento.
- [ ] Um `h1` por página; níveis sem salto.
- [ ] Nada com `position: absolute` cobrindo área clicável sem `relative` no pai (foi o defeito do link invisível).
- [ ] 390px: nada estoura, menu cabe, tabelas rolam dentro do próprio container.

---

## Por interface: onde a régua encosta

Cada interface abaixo é medida contra os sete portões. "Passa hoje" é o que a
verificação de 4 de setembro confirmou; "falta" é o que a pesquisa em curso
(10 partes do produto + 12 skills do Jakub aplicadas) vai detalhar em
`docs/diretrizes.md`.

| Interface | Referência-mãe | Passa hoje | Falta medir/fazer |
|---|---|---|---|
| Home: hero | aiforui + React Bits Pro | escala, véu 0,62 medido, 46px, reduced-motion, CTA de docs, byline com link | migrar véu e capas para OKLCH; conferir viúva do título em 390px |
| Home: bento | React Bits "What's inside" + MagicBento | 12 col fechadas, 5 composições próprias, scrim em curva; **sistema do MagicBento refeito em motion** (holofote de 300px que segue o ponteiro na cor do card mais próximo, borda que acende no ponto mais perto, inclinação 5° e magnetismo 4% com mola, 8 partículas na cor da seção, entrada em cascata); desliga em toque e em reduced-motion | `break` em cada visual: 390px, sem dados |
| Artigos: leitura | Vercel guidelines, Emil (escrita) | medida ≤ 75ch, números conferidos | escala do corpo vs aiforui; gráficos em 390px |
| Artigos: apresentação | — | slides do mesmo arquivo | foco/teclado entre slides; reduced-motion nas transições |
| Catálogo (placar) | skills.sh | rótulos mono, colapso por repo, ordenação honesta, `?q=` | cabeçalho não é `aria-hidden` (é informação); linhas em 390px; foco na linha |
| Página de skill | skills.sh (sidebar) | trilho de procedência, copiar com nome de ação, atribuição no idioma | `<pre>` cru vs markdown renderizado: decidir com `variant` |
| Explorar | desengs | data, verbos, um ao acaso, repositórios | coluna de data vazia comunica? (`better-layout`); densidade em 390px |
| Docs | shadcn/ui intro | 17 seções, 5 grupos, código com copiar, linguagem definida | "Nesta página" fixo em desktop; leitura em 390px |
| CLI e MCP (páginas) | ui-skills | duas portas iguais, config escrita | exemplos de saída real do CLI na página |
| Menu e rodapé | Vercel /design | 4 grupos por intenção (ler, achar, ligar um agente, entender), 10 destinos, uma fonte | descoberta sem abrir o painel (`better-layout`); foco ao abrir/fechar |
| Formulário de inscrição | Jakub `break` | inválido/503/sucesso honestos | foco no erro; 429 com mensagem |
| Fundações | oklch.fyi, easing.dev, motion.dev | curvas nomeadas, hook de reduced-motion, tokens centralizados | **paleta para OKLCH**; escala tipográfica declarada e auditada |

---

## Como executar

1. **Diretrizes primeiro.** A pesquisa em curso entrega `docs/diretrizes.md`:
   propósito, princípios com fonte, fatos medidos, faça/não faça e problemas
   abertos, por parte do produto. É a base de tudo abaixo.
2. **Fundações antes de superfície.** Paleta em OKLCH e escala tipográfica
   declarada em `globals.css`; auditoria de contraste e de tamanhos rodando por
   página. Sem isso, cada correção de superfície é retrabalho.
3. **As 12 skills do Jakub como ferramenta, não como leitura.** `better-interface`
   revisa cada página; `better-accessibility`, `better-typography`,
   `better-colors`, `better-layout`, `better-writing` entram onde o problema
   está; `break` testa cada componente nos estados; `variant` decide o que está
   em dúvida (ex.: markdown cru vs renderizado); `interface-review` fecha cada
   mudança. Os findings de prioridade alta são corrigidos na mesma rodada.
4. **Uma interface por vez, portão por portão.** Ordem: fundações → home →
   catálogo e página de skill → explorar → docs → artigos → menu/rodapé →
   formulário. Cada uma termina com a checagem dos sete portões medida.
5. **Verificação, não inspeção.** Depois de cada rodada: build com as checagens,
   fluxos de `docs/fluxos-e-historias.md` reverificados, `better-interface` sem
   findings de prioridade alta.

## Definição de pronto

Uma interface está pronta quando: passa os sete portões com medição registrada;
`better-interface` do Jakub não devolve nada de prioridade alta; os fluxos que a
tocam passam; `check-counts`, `check-skill-links` e `check-numbers` passam no
build; e um colega consegue explicar em uma frase o que a interface entrega,
lendo só a tela.
