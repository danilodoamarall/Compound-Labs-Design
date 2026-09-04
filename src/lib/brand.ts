/** O desenho da marca, numa fonte só.
 *
 *  O caminho, as paradas de cor e a caixa dos gradientes são usados pelo
 *  componente React e pelos SVGs de public/brand. Gerados por
 *  scripts/build-brand.mjs para os três não divergirem quando a marca mudar.
 *
 *  Não editar à mão: rode `node scripts/build-brand.mjs .`. */
export const DOME_PATH =
  "M230 603 A300 300 0 1 1 794 603 C800 700 794 744 760 740 C652 688 388 692 294 752 C244 766 224 706 230 603 Z";

export const DOME_STOPS: [number, string][] = [
  [0, "#a9c0da"],
  [0.14, "#bccee0"],
  [0.28, "#d2dce4"],
  [0.4, "#e6e2da"],
  [0.52, "#f5e0bb"],
  [0.66, "#f4c396"],
  [0.82, "#eda482"],
  [1, "#dc8d7b"],
];

/** Extremos horizontais do domo, para ancorar o gradiente no desenho. */
export const DOME_BOX = { x0: 224, x1: 800 } as const;
