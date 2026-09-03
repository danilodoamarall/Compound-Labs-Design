/** Marca do Labs: um corpo orgânico cortado por um canal em S, deixando duas
    lobas entrelaçadas. Material herdado do ícone: gradiente iridescente frio a
    quente, do azul ao magenta, passando pelo teal do hub.

    Os ids de gradiente e máscara são globais no documento, então cada uso na
    mesma página precisa de um `idPrefix` próprio. É uma prop e não useId para
    o componente continuar servindo Server e Client Components. */
export function LabsMark({
  size = 22,
  idPrefix = "labs",
  className,
  title,
}: {
  size?: number;
  idPrefix?: string;
  className?: string;
  title?: string;
}) {
  const id = (name: string) => `${idPrefix}-${name}`;
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
        <linearGradient id={id("base")} x1="0.06" y1="0.1" x2="0.95" y2="0.9">
          <stop offset="0" stopColor="#8fb7ea" />
          <stop offset="0.22" stopColor="#4cc4b4" />
          <stop offset="0.45" stopColor="#e9dfc6" />
          <stop offset="0.66" stopColor="#f2b45f" />
          <stop offset="0.85" stopColor="#e87f6d" />
          <stop offset="1" stopColor="#cf6499" />
        </linearGradient>
        <radialGradient id={id("violet")} cx="0.14" cy="0.18" r="0.5">
          <stop offset="0" stopColor="#7b62dd" stopOpacity="0.6" />
          <stop offset="1" stopColor="#7b62dd" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={id("teal")} cx="0.2" cy="0.74" r="0.55">
          <stop offset="0" stopColor="#16a98c" stopOpacity="0.85" />
          <stop offset="1" stopColor="#16a98c" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={id("magenta")} cx="0.88" cy="0.84" r="0.5">
          <stop offset="0" stopColor="#d63c8a" stopOpacity="0.7" />
          <stop offset="1" stopColor="#d63c8a" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={id("glow")} cx="0.48" cy="0.4" r="0.34">
          <stop offset="0" stopColor="#fffaf0" stopOpacity="0.75" />
          <stop offset="1" stopColor="#fffaf0" stopOpacity="0" />
        </radialGradient>
        <mask id={id("split")}>
          <path
            fill="#fff"
            d="M512 168 C 646 168 856 306 856 512 C 856 702 698 856 512 856 C 322 856 168 694 168 512 C 168 314 378 168 512 168 Z"
          />
          <path
            fill="none"
            stroke="#000"
            strokeWidth="86"
            strokeLinecap="round"
            d="M520 112 C 706 300 660 424 512 512 C 364 600 318 726 504 912"
          />
        </mask>
      </defs>
      <g mask={`url(#${id("split")})`}>
        <rect width="1024" height="1024" fill={`url(#${id("base")})`} />
        <rect width="1024" height="1024" fill={`url(#${id("violet")})`} />
        <rect width="1024" height="1024" fill={`url(#${id("teal")})`} />
        <rect width="1024" height="1024" fill={`url(#${id("magenta")})`} />
        <rect width="1024" height="1024" fill={`url(#${id("glow")})`} />
      </g>
    </svg>
  );
}
