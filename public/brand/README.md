# Marca do Compound Design

Estes arquivos são **gerados**. Não edite à mão.

    node scripts/build-brand.mjs .

A fonte é o próprio script: o caminho do domo, as paradas de cor e a caixa dos
gradientes vivem lá, e de lá saem quatro arquivos:

| Arquivo | Para quê |
|---|---|
| `public/brand/mark.svg` | A marca sozinha, fundo transparente |
| `public/brand/icon.svg` | A marca dentro da placa escura |
| `src/app/icon.svg` | O favicon, servido pelo Next |
| `src/lib/brand.ts` | O caminho e as cores, para o componente React |

O componente `LabsMark` em `src/components/site/logo.tsx` lê de `src/lib/brand.ts`,
então marca, ícone e componente nunca divergem.

## O desenho

Um domo com a base côncava: arco circular no topo, laterais quase verticais, e a
base voltando para cima, o que deixa as duas pontas caídas.

O material vai do azul frio na esquerda ao creme no alto e ao laranja na direita,
com granulado por cima. Os gradientes são ancorados em coordenadas do desenho e
não na caixa de 1024: ancorados na caixa cheia, o azul do começo cai fora da
forma e a marca sai inteira quente.

O granulado custa um filtro por instância, então o componente o desliga abaixo de
40px, onde ele não aparece e só pesa.
