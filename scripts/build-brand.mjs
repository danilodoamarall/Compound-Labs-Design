// Gera a marca, o ícone e a definição compartilhada a partir de uma fonte só,
// para o componente React e os SVGs estáticos não divergirem.
//
//   node scripts/build-brand.mjs .
import { writeFileSync } from "node:fs";

/** O domo: arco circular grande no topo, laterais quase verticais, e a base
 *  voltando côncava, o que deixa as duas pontas caídas. */
const DOMO =
  "M230 603 A300 300 0 1 1 794 603 C800 700 794 744 760 740 C652 688 388 692 294 752 C244 766 224 706 230 603 Z";

/** O material: metade fria à esquerda, creme no meio, quente à direita. */
const PARADAS = [
  [0, "#a9c0da"],
  [0.14, "#bccee0"],
  [0.28, "#d2dce4"],
  [0.4, "#e6e2da"],
  [0.52, "#f5e0bb"],
  [0.66, "#f4c396"],
  [0.82, "#eda482"],
  [1, "#dc8d7b"],
];

/** A caixa real do domo. Os gradientes são ancorados aqui, em coordenadas do
 *  desenho, e não na caixa de 1024: ancorados na caixa cheia, o azul do começo
 *  caía fora da forma e a marca saía inteira quente. */
const CAIXA = { x0: 224, x1: 800 };

const defs = (p) => `
    <linearGradient id="${p}mat" gradientUnits="userSpaceOnUse" x1="${CAIXA.x0}" y1="430" x2="${CAIXA.x1}" y2="560">
${PARADAS.map(([o, c]) => `      <stop offset="${o}" stop-color="${c}"/>`).join("\n")}
    </linearGradient>
    <radialGradient id="${p}luz" gradientUnits="userSpaceOnUse" cx="430" cy="350" r="255">
      <stop offset="0" stop-color="#fffdf6" stop-opacity="0.5"/>
      <stop offset="1" stop-color="#fffdf6" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="${p}fundo" gradientUnits="userSpaceOnUse" cx="512" cy="785" r="300">
      <stop offset="0" stop-color="#4b3f5e" stop-opacity="0.34"/>
      <stop offset="1" stop-color="#4b3f5e" stop-opacity="0"/>
    </radialGradient>
    <filter id="${p}grao" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" result="ruido"/>
      <feColorMatrix in="ruido" type="saturate" values="0" result="cinza"/>
      <feComponentTransfer in="cinza" result="grao">
        <feFuncA type="linear" slope="0.17" intercept="0"/>
      </feComponentTransfer>
      <feComposite in="grao" in2="SourceGraphic" operator="in"/>
    </filter>
    <clipPath id="${p}domo">
      <path d="${DOMO}"/>
    </clipPath>`;

const corpo = (p) => `  <g clip-path="url(#${p}domo)">
    <rect width="1024" height="1024" fill="url(#${p}mat)"/>
    <rect width="1024" height="1024" fill="url(#${p}fundo)"/>
    <rect width="1024" height="1024" fill="url(#${p}luz)"/>
    <rect width="1024" height="1024" fill="#fff" filter="url(#${p}grao)" opacity="0.5"/>
  </g>`;

const marca = `<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Compound Design">
  <title>Compound Design</title>
  <defs>${defs("")}
  </defs>
${corpo("")}
</svg>
`;

const icone = `<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Compound Design">
  <title>Compound Design</title>
  <defs>${defs("i")}
  </defs>
  <rect width="1024" height="1024" rx="232" fill="#3a3a3a"/>
  <g transform="translate(128 118) scale(0.75)">
${corpo("i")}
  </g>
</svg>
`;

const raiz = process.argv[2] ?? ".";
writeFileSync(`${raiz}/public/brand/mark.svg`, marca);
writeFileSync(`${raiz}/public/brand/icon.svg`, icone);
writeFileSync(`${raiz}/src/app/icon.svg`, icone);

writeFileSync(
  `${raiz}/src/lib/brand.ts`,
  `/** O desenho da marca, numa fonte só.
 *
 *  O caminho, as paradas de cor e a caixa dos gradientes são usados pelo
 *  componente React e pelos SVGs de public/brand. Gerados por
 *  scripts/build-brand.mjs para os três não divergirem quando a marca mudar.
 *
 *  Não editar à mão: rode \`node scripts/build-brand.mjs .\`. */
export const DOME_PATH =
  "${DOMO}";

export const DOME_STOPS: [number, string][] = [
${PARADAS.map(([o, c]) => `  [${o}, "${c}"],`).join("\n")}
];

/** Extremos horizontais do domo, para ancorar o gradiente no desenho. */
export const DOME_BOX = { x0: ${CAIXA.x0}, x1: ${CAIXA.x1} } as const;
`
);

console.log("gerados: public/brand/mark.svg, public/brand/icon.svg, src/app/icon.svg, src/lib/brand.ts");
console.log(`caminho com ${DOMO.split(" ").length} comandos, ${PARADAS.length} paradas de cor`);
