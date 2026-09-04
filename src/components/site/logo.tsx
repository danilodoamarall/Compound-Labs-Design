import { DOME_BOX, DOME_PATH, DOME_STOPS } from "@/lib/brand";

/** Marca do AI Builders Lab: um domo com a base côncava, como um sol nascendo
    por trás de uma curva. O material é iridescente e vai do azul frio na
    esquerda ao creme no alto e ao laranja na direita, com granulado por cima.

    O caminho e as paradas de cor vêm de `src/lib/brand.ts`, que também gera os
    SVGs de `public/brand` e o ícone do aplicativo. Uma fonte só: mudar a marca
    é rodar `node scripts/build-brand.mjs .` e os três acompanham.

    Os ids de gradiente, filtro e máscara são globais no documento, então cada
    uso na mesma página precisa de um `idPrefix` próprio. É prop e não `useId`
    para o componente continuar servindo Server e Client Components. */
export function LabsMark({
  size = 22,
  idPrefix = "labs",
  className,
  title,
  /** O granulado custa um filtro por instância. Em tamanhos pequenos ele não
      aparece e só pesa, então some abaixo de 40px. */
  grain,
}: {
  size?: number;
  idPrefix?: string;
  className?: string;
  title?: string;
  grain?: boolean;
}) {
  const id = (name: string) => `${idPrefix}-${name}`;
  const comGrao = grain ?? size >= 40;

  return (
    <svg
      viewBox="0 0 1024 1024"
      width={size}
      height={size}
      className={className}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      <defs>
        {/* Ancorado no desenho, não na caixa de 1024: na caixa cheia o azul do
            começo caía fora do domo e a marca saía inteira quente. */}
        <linearGradient
          id={id("mat")}
          gradientUnits="userSpaceOnUse"
          x1={DOME_BOX.x0}
          y1={430}
          x2={DOME_BOX.x1}
          y2={560}
        >
          {DOME_STOPS.map(([offset, color]) => (
            <stop key={offset} offset={offset} stopColor={color} />
          ))}
        </linearGradient>

        {/* O brilho alto, deslocado para cima e para a esquerda do centro. */}
        <radialGradient id={id("luz")} gradientUnits="userSpaceOnUse" cx={430} cy={350} r={255}>
          <stop offset="0" stopColor="#fffdf6" stopOpacity="0.5" />
          <stop offset="1" stopColor="#fffdf6" stopOpacity="0" />
        </radialGradient>

        {/* A sombra que dá volume à base côncava. */}
        <radialGradient id={id("fundo")} gradientUnits="userSpaceOnUse" cx={512} cy={785} r={300}>
          <stop offset="0" stopColor="#4b3f5e" stopOpacity="0.34" />
          <stop offset="1" stopColor="#4b3f5e" stopOpacity="0" />
        </radialGradient>

        {comGrao ? (
          <filter id={id("grao")} x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" result="ruido" />
            <feColorMatrix in="ruido" type="saturate" values="0" result="cinza" />
            <feComponentTransfer in="cinza" result="grao">
              <feFuncA type="linear" slope="0.17" intercept="0" />
            </feComponentTransfer>
            <feComposite in="grao" in2="SourceGraphic" operator="in" />
          </filter>
        ) : null}

        <clipPath id={id("domo")}>
          <path d={DOME_PATH} />
        </clipPath>
      </defs>

      <g clipPath={`url(#${id("domo")})`}>
        <rect width="1024" height="1024" fill={`url(#${id("mat")})`} />
        <rect width="1024" height="1024" fill={`url(#${id("fundo")})`} />
        <rect width="1024" height="1024" fill={`url(#${id("luz")})`} />
        {comGrao ? (
          <rect width="1024" height="1024" fill="#fff" filter={`url(#${id("grao")})`} opacity="0.5" />
        ) : null}
      </g>
    </svg>
  );
}
