# Marca

A forma vem do logo do Labs: um corpo orgânico cortado por um canal em S, que
deixa duas lobas entrelaçadas. O acabamento vem do ícone de referência do
produto: gradiente iridescente do azul ao magenta passando pelo teal do hub,
grão fino e tile escuro de cantos arredondados.

| Arquivo | Uso |
|---|---|
| `icon.svg` | ícone de aplicativo, com tile escuro. Exporte daqui os PNG de 1024, 512, 180 e 192 |
| `mark.svg` | só a marca, sem tile, para fundo claro ou escuro |
| `../../src/app/icon.svg` | favicon servido pelo Next.js, cópia do `icon.svg` |
| `../../src/components/site/logo.tsx` | a marca em React, usada no cabeçalho e no rodapé |

O traçado é o mesmo nos quatro. Ao mudar a forma, atualize todos. O `mark.svg` e
o `logo.tsx` usam um canal mais largo que o `icon.svg`, porque sem o tile o vão
precisa de mais corpo para não fechar em tamanho pequeno.

Para gerar os PNG:

```bash
npx --yes sharp-cli -i public/brand/icon.svg -o public/brand/icon-1024.png resize 1024 1024
```
