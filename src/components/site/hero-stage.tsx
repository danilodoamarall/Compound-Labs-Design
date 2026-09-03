import { StageNav, type StageNavItem } from "./stage-nav";
import { LabsMark } from "./logo";

/** Topo do palco, reconstruído a partir de vercel.com/design com os valores
    medidos na página real:
      fundo #0A0A0A · h1 52px/72px, tracking -2px, peso 600, #FAFAFA
      subtítulo 20px/32px em #888 · pílula 44px em #111 com padding 4px

    O h1 é texto comum, não um componente de animação por letra: a versão
    animada anterior deixava o cabeçalho aria-hidden, e a home ficava sem
    nenhum título de nível 1 na árvore de acessibilidade. */
export function HeroStage({
  line1,
  outlined,
  middle,
  blurred,
  tail,
  measureLabel,
  subtitle,
  curator,
  curatorRole,
  nav,
  navLabel,
}: {
  line1: string;
  outlined: string;
  middle: string;
  blurred: string;
  tail: string;
  measureLabel: string;
  subtitle: string;
  curator: string;
  curatorRole: string;
  nav: StageNavItem[];
  navLabel: string;
}) {
  return (
    <>
      <section className="relative isolate flex min-h-[min(88svh,44rem)] w-full flex-col items-center justify-center overflow-hidden px-5 pb-10 pt-16">
        <Orbits />
        <StarField />

        <h1 className="stage-h1 relative z-10 max-w-[36rem] text-center">
          <span className="relative inline-block">
            {line1}
            {/* Cromo de ferramenta de design: a caixa de seleção com a medida.
                É o detalhe que dá o tom da página inteira. */}
            <span aria-hidden className="pointer-events-none absolute -inset-y-1 -right-1 hidden w-[5.9em] md:block">
              <span className="absolute inset-0 border border-white/40" />
              {[
                "-left-[3px] -top-[3px]",
                "-right-[3px] -top-[3px]",
                "-left-[3px] -bottom-[3px]",
                "-right-[3px] -bottom-[3px]",
              ].map((pos) => (
                <span key={pos} className={`absolute size-[6px] border border-white/70 bg-[var(--stage-bg)] ${pos}`} />
              ))}
              <span className="absolute -top-[27px] right-0 rounded-[3px] bg-[#333] px-[7px] py-[2px] text-[12px] font-normal leading-[18px] tracking-normal text-white/90">
                {measureLabel}
              </span>
            </span>
          </span>

          <span className="block">
            <span className="stage-outline">{outlined}</span>
            {middle}
            <span className="relative inline-block">
              <span aria-hidden className="stage-lens" />
              <span className="stage-blur">{blurred}</span>
            </span>
            {tail}
          </span>
        </h1>

        <p className="relative z-10 mt-6 max-w-[540px] text-balance text-center text-[16px] leading-[26px] text-[#EDEDED] sm:text-[18px] sm:leading-[28px]">
          {subtitle}
        </p>

        <p className="relative z-10 mt-8 flex items-center gap-2.5 text-[14px] text-[var(--stage-dim)]">
          <LabsMark size={26} idPrefix="cur" />
          <span className="text-[#EDEDED]">{curator}</span>
          <span aria-hidden className="text-[var(--stage-line)]">·</span>
          <span className="hidden sm:inline">{curatorRole}</span>
        </p>
      </section>

      <StageNav items={nav} label={navLabel} />
    </>
  );
}

/** Órbitas concêntricas saindo do centro do título, com o traço sumindo
    conforme o raio cresce. Em vmax para acompanhar qualquer tela. */
function Orbits() {
  const rings = [
    { r: 15, o: 0.1 },
    { r: 24, o: 0.085 },
    { r: 34, o: 0.07 },
    { r: 45, o: 0.055 },
    { r: 58, o: 0.042 },
    { r: 73, o: 0.03 },
    { r: 90, o: 0.022 },
  ];
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {rings.map((ring) => (
        <span
          key={ring.r}
          className="absolute left-1/2 top-1/2 rounded-full border"
          style={{
            width: `${ring.r * 2}vmax`,
            height: `${ring.r * 2}vmax`,
            marginLeft: `-${ring.r}vmax`,
            marginTop: `-${ring.r}vmax`,
            borderColor: `rgba(255,255,255,${ring.o})`,
          }}
        />
      ))}
    </div>
  );
}

/** Brilhos de quatro pontas pousados nas órbitas, mais algumas cruzetas. */
function StarField() {
  const glints = [
    { x: 41.5, y: 26.5, s: 14, o: 0.95 },
    { x: 55.5, y: 22.5, s: 10, o: 0.75 },
    { x: 56.5, y: 39, s: 8, o: 0.6 },
    { x: 30.5, y: 46, s: 9, o: 0.5 },
    { x: 67, y: 60, s: 7, o: 0.35 },
  ];
  const crosses = [
    { x: 35.5, y: 41.5, s: 10, o: 0.38 },
    { x: 64, y: 50.5, s: 11, o: 0.32 },
    { x: 71, y: 33, s: 8, o: 0.24 },
    { x: 27, y: 62, s: 8, o: 0.2 },
  ];
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      {glints.map((g, i) => (
        <svg
          key={`g${i}`}
          className="absolute"
          style={{ left: `${g.x}%`, top: `${g.y}%`, width: g.s, height: g.s, opacity: g.o }}
          viewBox="0 0 24 24"
          fill="#fff"
        >
          <path d="M12 0c.55 6.4 5.05 10.9 11.45 11.45C17.05 12 12.55 16.5 12 22.9c-.55-6.4-5.05-10.9-11.45-11.45C6.95 10.9 11.45 6.4 12 0Z" />
        </svg>
      ))}
      {crosses.map((c, i) => (
        <svg
          key={`c${i}`}
          className="absolute"
          style={{ left: `${c.x}%`, top: `${c.y}%`, width: c.s, height: c.s, opacity: c.o }}
          viewBox="0 0 24 24"
          stroke="#fff"
          strokeWidth="2.2"
          strokeLinecap="round"
        >
          <path d="M4 4l16 16M20 4L4 20" />
        </svg>
      ))}
    </div>
  );
}
