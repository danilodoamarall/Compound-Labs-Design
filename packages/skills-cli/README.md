# @ai-builders-lab/skills

Navegue e busque skills de design engineering pelo terminal.

```bash
npx @ai-builders-lab/skills
```

Um arquivo de JavaScript, zero dependências. Lê o mesmo registro que a página e
o servidor MCP do [AI Builders Lab](https://labs-hub-five.vercel.app/pt/skills-agents).

## Comandos

```bash
npx @ai-builders-lab/skills start                       # a skill de roteamento
npx @ai-builders-lab/skills topics                      # os tópicos do catálogo
npx @ai-builders-lab/skills list                        # todas as skills
npx @ai-builders-lab/skills list --topic motion         # filtra por tópico
npx @ai-builders-lab/skills list --query shadow         # busca por texto
npx @ai-builders-lab/skills get emilkowalski/animate    # lê uma skill
npx @ai-builders-lab/skills licenses                    # as licenças do catálogo
```

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
| `1` | Faltou argumento ou valor de opção |
| `2` | Comando desconhecido |
| `3` | Skill não encontrada, ou nome ambíguo entre autores |
| `4` | Falha de rede |

## Apontar para outro servidor

```bash
AI_SKILLS_SITE_URL=http://localhost:3000 npx @ai-builders-lab/skills list
```

## Também há um servidor MCP

```bash
claude mcp add --transport http ai-builders-lab https://labs-hub-five.vercel.app/mcp
```

Duas ferramentas: `list_skills` e `get_skill`. Documentação em
[/skills-agents/mcp](https://labs-hub-five.vercel.app/pt/skills-agents/mcp).

## Licença

MIT, para o código deste CLI. As skills que ele busca têm cada uma a sua, e o
comando `licenses` mostra a distribuição.
