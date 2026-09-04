/** Curvas do easing.dev, com o nome que elas têm lá.
 *
 *  Estavam espalhadas como números soltos nos componentes. Aqui viram nome, e
 *  o nome diz para que serve.
 *
 *  As três últimas passam de 1 ou de 0 no eixo y: dão o efeito de mola, e por
 *  isso só valem para `scale`, `y` e `rotate`. Em `opacity` o valor é cortado
 *  no limite e a curva vira uma reta. */
export const EASE = {
  /** Entrada padrão. Desacelera até parar. */
  quickOut: [0, 0, 0.2, 1],
  /** Começa muito rápido e assenta devagar. Hover de card, ícone que aparece. */
  snappyOut: [0.19, 1, 0.22, 1],
  /** Um pouco mais suave que a anterior. Revelação em cascata numa grade. */
  outQuart: [0.165, 0.84, 0.44, 1],
  /** Desaceleração leve. Microinterações, mudança de cor. */
  outCubic: [0.215, 0.61, 0.355, 1],
  /** Chega e para seco. Para encaixar um elemento no lugar. */
  outCirc: [0.075, 0.82, 0.165, 1],
  /** Simétrica. Animação que fica em laço, como a varredura de um radar. */
  inOutCubic: [0.645, 0.045, 0.355, 1],
  /** Passa do ponto e volta. Só em escala, posição ou rotação. */
  overshootOut: [0.175, 0.885, 0.32, 1.275],
  /** Passa do ponto de leve. Só em escala, posição ou rotação. */
  swiftOut: [0.175, 0.885, 0.32, 1.1],
} as const;
