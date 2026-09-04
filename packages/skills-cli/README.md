# @compound-design/skills

Navegue e busque skills de design engineering pelo terminal.

```bash
npx @compound-design/skills
```

Um arquivo de JavaScript, zero dependências. Lê o mesmo registro que a página e
o servidor MCP do [Compound Design](https://labs-hub-five.vercel.app/pt/skills-agents).

## Comandos

```bash
npx @compound-design/skills start                       # a skill de roteamento
npx @compound-design/skills topics                      # os tópicos, com a contagem
npx @compound-design/skills list --topic motion         # filtra por tópico
npx @compound-design/skills list --query shadow         # busca por texto
npx @compound-design/skills get emilkowalski/animate    # lê uma skill
npx @compound-design/skills licenses                    # as licenças do catálogo
npx @compound-design/skills --version
```

### Paginação

`list` devolve 40 por vez. O catálogo tem 269 entradas, e despejar tudo numa
resposta são cerca de 40 mil tokens no contexto de quem só queria saber o que
existe.

```bash
npx @compound-design/skills list --limit 100
npx @compound-design/skills list --offset 40
npx @compound-design/skills list --all       # o teto de uma vez
```

Quando a listagem é cortada, o aviso vai para **stderr**, não para stdout. Assim
o corte nunca passa despercebido, e um `| grep` ou `> arquivo` continua limpo.

## De quem são as skills

Cada skill é de quem a escreveu. O catálogo tem 269 entradas, e a licença de
cada repositório de origem foi verificada uma a uma:

- **207** estão sob licença permissiva (MIT ou Apache-2.0) e são servidas pelo
  catálogo, sempre com autor, licença e o commit de onde vieram.
- **62** não declaram licença. Aparecem na listagem marcadas com `↗`, e o `get`
  devolve a ficha e o endereço da origem em vez do texto: sem licença declarada,
  só o autor pode redistribuir.

A lista completa de autores está em
[ATTRIBUTION.md](https://github.com/danilodoamarall/Compound-Labs-Design/blob/main/content/skills/ATTRIBUTION.md).

## Códigos de saída

| Código | Quando |
|---|---|
| `0` | Deu certo |
| `1` | Faltou argumento, ou uma opção recebeu valor inválido |
| `2` | Comando desconhecido |
| `3` | Skill não encontrada, ou nome ambíguo entre autores |
| `4` | Falha de rede, ou o servidor pediu para desacelerar |

## Apontar para outro servidor

```bash
AI_SKILLS_SITE_URL=http://localhost:3000 npx @compound-design/skills list
```

## Também há um servidor MCP

```bash
claude mcp add --transport http compound-design https://labs-hub-five.vercel.app/mcp
```

Três ferramentas: `list_topics`, `list_skills` e `get_skill`. Comece por
`get_skill` com `name: "start"`. Documentação em
[/skills-agents/mcp](https://labs-hub-five.vercel.app/pt/skills-agents/mcp).

## Licença

MIT, para o código deste CLI. As skills que ele busca têm cada uma a sua, e o
comando `licenses` mostra a distribuição.
