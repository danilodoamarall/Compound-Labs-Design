"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore, type CSSProperties, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, stagger, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { EASE } from "@/lib/easing";

export type StageCard = {
  key: string;
  title: string;
  desc: string;
  path: string;
  /** Par de cores da seção, vindo de src/lib/site.ts. */
  cover: [string, string];
  count?: string;
  /** Quantas das 12 colunas o card ocupa. */
  span: number;
  /** A composição animada do card. Cada seção tem a sua. */
  visual: ReactNode;
};

/** O Tailwind só gera classe que existe literalmente no código, então os spans
 *  ficam num mapa em vez de virem interpolados de uma variável. */
const SPAN: Record<number, string> = {
  3: "lg:col-span-3",
  4: "lg:col-span-4",
  5: "lg:col-span-5",
  6: "lg:col-span-6",
  8: "lg:col-span-8",
  12: "lg:col-span-12",
};

/** Os valores do MagicBento do React Bits, medidos no componente que está em
 *  src/components/reactbits: o holofote tem 300px de raio, acende de verdade a
 *  150px do card (metade do raio) e apaga a 225px (três quartos). A inclinação
 *  é de 5 graus e o magnetismo puxa o card 4% da distância até o ponteiro. */
const RAIO = 300;
const PROXIMIDADE = RAIO * 0.5;
const APAGA = RAIO * 0.75;
const INCLINACAO = 5;
const MAGNETISMO = 0.04;
const PARTICULAS = 8;

/** "#0b8a74" vira "11, 138, 116", que é o formato que rgba() com var() aceita. */
function rgb(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
}

const PONTEIRO_FINO = "(hover: hover) and (pointer: fine)";

/** Verdadeiro só no cliente e só com mouse ou trackpad. No servidor e durante
 *  a hidratação é falso, o que também serve de "já montou": o holofote, que
 *  precisa do <body>, só aparece depois. */
function usePonteiroFino() {
  return useSyncExternalStore(
    (avisar) => {
      const mq = window.matchMedia(PONTEIRO_FINO);
      mq.addEventListener("change", avisar);
      return () => mq.removeEventListener("change", avisar);
    },
    () => window.matchMedia(PONTEIRO_FINO).matches,
    () => false,
  );
}

/** A galeria das seções, com os valores medidos no "What's inside" do React
 *  Bits: grade de 12 colunas, gap 16, cards de 288px com raio 16, fundo
 *  rgba(18,15,23,0.45) e borda de 0.67px a 8% de branco.
 *
 *  A grade é nossa, de 12 colunas com span por card: o MagicBento traz uma grade
 *  fixa para seis cards e uma dependência de gsap. O que trouxemos dele é o
 *  sistema de movimento, refeito em motion, que é o que o resto do site usa:
 *
 *  - um holofote que segue o ponteiro pela grade inteira, na cor do card mais
 *    próximo, e que só acende quando está perto de um card;
 *  - a borda de cada card que se ilumina no ponto mais perto do ponteiro;
 *  - inclinação e magnetismo leves, com mola, porque o card acompanha a mão e
 *    uma curva fixa não serve para seguir um alvo que se move;
 *  - partículas na cor da seção enquanto o card está sob o ponteiro;
 *  - entrada em cascata quando a grade aparece na tela.
 *
 *  Tudo isto é um único sistema, o holofote, e por isso conta como o efeito
 *  forte do bloco. Quem pediu menos movimento recebe a grade parada no estado
 *  final; a borda iluminada continua, porque acompanha o ponteiro em vez de se
 *  mover sozinha. Em tela de toque nada disto liga: não há ponteiro a seguir. */
export function StageResources({ cards }: { cards: StageCard[] }) {
  const reduced = Boolean(useReducedMotion());
  const grade = useRef<HTMLUListElement>(null);
  const holofote = useRef<HTMLDivElement>(null);
  const comPonteiro = usePonteiroFino();

  const spotX = useMotionValue(-RAIO * 2);
  const spotY = useMotionValue(-RAIO * 2);
  const spotOpacidade = useMotionValue(0);
  const spotLeft = useTransform(spotX, (v) => v - RAIO);
  const spotTop = useTransform(spotY, (v) => v - RAIO);

  useEffect(() => {
    if (!comPonteiro) return;
    const ul = grade.current;
    if (!ul) return;
    const cartas = () => Array.from(ul.querySelectorAll<HTMLElement>("[data-bento-card]"));

    const aoMover = (e: PointerEvent) => {
      spotX.set(e.clientX);
      spotY.set(e.clientY);
      const g = ul.getBoundingClientRect();
      const dentro = e.clientX >= g.left && e.clientX <= g.right && e.clientY >= g.top && e.clientY <= g.bottom;

      let maisPerto = Infinity;
      let cor: string | undefined;
      for (const carta of cartas()) {
        const r = carta.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        // Distância até a borda do card, não até o centro: um card largo não
        // pode acender mais tarde que um estreito só por ser largo.
        const d = Math.max(0, Math.hypot(e.clientX - cx, e.clientY - cy) - Math.max(r.width, r.height) / 2);
        const brilho = d <= PROXIMIDADE ? 1 : d <= APAGA ? (APAGA - d) / (APAGA - PROXIMIDADE) : 0;
        carta.style.setProperty("--glow-x", `${((e.clientX - r.left) / r.width) * 100}%`);
        carta.style.setProperty("--glow-y", `${((e.clientY - r.top) / r.height) * 100}%`);
        carta.style.setProperty("--glow-intensity", brilho.toFixed(3));
        if (d < maisPerto) {
          maisPerto = d;
          cor = carta.dataset.glow;
        }
      }

      const alvo = !dentro ? 0 : maisPerto <= PROXIMIDADE ? 0.8 : maisPerto <= APAGA ? ((APAGA - maisPerto) / (APAGA - PROXIMIDADE)) * 0.8 : 0;
      spotOpacidade.set(alvo);
      if (cor && holofote.current) holofote.current.style.setProperty("--spot-rgb", cor);
    };
    const aoSair = () => {
      spotOpacidade.set(0);
      cartas().forEach((c) => c.style.setProperty("--glow-intensity", "0"));
    };

    document.addEventListener("pointermove", aoMover, { passive: true });
    ul.addEventListener("pointerleave", aoSair);
    return () => {
      document.removeEventListener("pointermove", aoMover);
      ul.removeEventListener("pointerleave", aoSair);
    };
  }, [comPonteiro, spotX, spotY, spotOpacidade]);

  return (
    <>
      <motion.ul
        ref={grade}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12"
        initial={reduced ? false : "fora"}
        whileInView="dentro"
        viewport={{ once: true, margin: "-60px" }}
        variants={{ fora: {}, dentro: { transition: { delayChildren: stagger(0.07) } } }}
      >
        {cards.map((card, i) => (
          <BentoCard key={card.key} card={card} indice={i + 1} reduced={reduced} comPonteiro={comPonteiro} />
        ))}
      </motion.ul>

      {/* O holofote vive no <body>, porque `position: fixed` dentro de qualquer
          ancestral com transform ou filtro deixa de ser fixo. Mistura em
          "screen": clareia o que está por baixo em vez de cobrir. */}
      {comPonteiro
        ? createPortal(
            <motion.div
              ref={holofote}
              aria-hidden
              className="pointer-events-none fixed left-0 top-0 z-30 rounded-full dark:mix-blend-screen"
              style={{
                width: RAIO * 2,
                height: RAIO * 2,
                x: spotLeft,
                y: spotTop,
                opacity: spotOpacidade,
                background:
                  "radial-gradient(circle, rgba(var(--spot-rgb, 34, 161, 140), 0.15) 0%, rgba(var(--spot-rgb, 34, 161, 140), 0.08) 15%, rgba(var(--spot-rgb, 34, 161, 140), 0.04) 25%, rgba(var(--spot-rgb, 34, 161, 140), 0.02) 40%, rgba(var(--spot-rgb, 34, 161, 140), 0.01) 65%, transparent 70%)",
              }}
            />,
            document.body,
          )
        : null}
    </>
  );
}

type Particula = { id: number; left: number; top: number; dx: number; dy: number; dur: number; atraso: number };

function BentoCard({
  card,
  indice,
  reduced,
  comPonteiro,
}: {
  card: StageCard;
  indice: number;
  reduced: boolean;
  comPonteiro: boolean;
}) {
  const cor = useMemo(() => rgb(card.cover[0]), [card.cover]);

  // Inclinação e magnetismo com mola: o card segue o ponteiro, e uma mola
  // assenta sem pular quando a mão muda de direção. Rígida e bem amortecida,
  // para o card não balançar depois que a mão para.
  const mola = { stiffness: 320, damping: 30, mass: 0.7 };
  const rx = useSpring(useMotionValue(0), mola);
  const ry = useSpring(useMotionValue(0), mola);
  const mx = useSpring(useMotionValue(0), mola);
  const my = useSpring(useMotionValue(0), mola);
  const interativo = comPonteiro && !reduced;

  const aoMover = (e: React.PointerEvent<HTMLAnchorElement>) => {
    if (!interativo) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top - r.height / 2;
    rx.set((y / (r.height / 2)) * -INCLINACAO);
    ry.set((x / (r.width / 2)) * INCLINACAO);
    mx.set(x * MAGNETISMO);
    my.set(y * MAGNETISMO);
  };
  const aoSair = () => {
    setParticulas([]);
    rx.set(0);
    ry.set(0);
    mx.set(0);
    my.set(0);
  };

  // As partículas nascem em posição aleatória a cada vez que o ponteiro entra.
  // São sorteadas no evento, não na renderização, para o componente continuar
  // puro; e só existem no cliente, depois do hover, então não há divergência
  // com o HTML do servidor.
  const [particulas, setParticulas] = useState<Particula[]>([]);
  const aoEntrar = () => {
    if (!interativo) return;
    setParticulas(
      Array.from({ length: PARTICULAS }, (_, i) => ({
        id: i,
        left: 8 + Math.random() * 84,
        top: 8 + Math.random() * 64,
        dx: (Math.random() - 0.5) * 40,
        dy: -10 - Math.random() * 30,
        dur: 2 + Math.random() * 2,
        atraso: Math.random() * 0.4,
      })),
    );
  };

  const bordaIluminada: CSSProperties = {
    padding: 1,
    background: `radial-gradient(var(--glow-radius, ${RAIO}px) circle at var(--glow-x, 50%) var(--glow-y, 50%), rgba(${cor}, calc(var(--glow-intensity, 0) * 0.8)) 0%, rgba(${cor}, calc(var(--glow-intensity, 0) * 0.4)) 30%, transparent 60%)`,
    WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
    WebkitMaskComposite: "xor",
    mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
    maskComposite: "exclude",
  };

  return (
    <motion.li
      className={SPAN[card.span] ?? "lg:col-span-4"}
      variants={{
        fora: { opacity: 0, y: 18 },
        dentro: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE.outQuart } },
      }}
      style={{ perspective: 900 }}
    >
      <motion.a
        href={card.path}
        data-bento-card
        data-glow={cor}
        onPointerEnter={aoEntrar}
        onPointerMove={aoMover}
        onPointerLeave={aoSair}
        style={{ rotateX: rx, rotateY: ry, x: mx, y: my, transformStyle: "preserve-3d" }}
        // Superficie, anel e sombra vem de .bento-card em globals.css, com
        // transicao de CSS: interrompivel, e com valores proprios por tema.
        className="bento-card group relative flex h-[268px] flex-col overflow-hidden rounded-2xl outline-hidden focus-visible:ring-2 focus-visible:ring-ring sm:h-[288px]"
      >
        {/* A borda que acende no ponto mais perto do ponteiro. A máscara recorta
            o gradiente para só a borda de 1px ficar visível. */}
        <span aria-hidden className="pointer-events-none absolute inset-0 z-10 rounded-2xl" style={bordaIluminada} />

        <span aria-hidden className="relative flex-1 overflow-hidden">
          {/* Gradiente da seção, esmaecido: é o pano de fundo da composição,
              não o assunto dela. */}
          <span
            className="absolute inset-0 opacity-[0.13] transition-opacity duration-500 group-hover:opacity-[0.22]"
            style={{ background: `radial-gradient(120% 90% at 50% 0%, ${card.cover[0]}, ${card.cover[1]} 70%, transparent)` }}
          />
          {/* A composicao sobe 4px no hover, junto com a inclinacao: o conteudo
              responde, nao so a moldura. */}
          <span className="absolute inset-0 transition-transform duration-300 ease-[cubic-bezier(0.215,0.61,0.355,1)] group-hover:-translate-y-1">
            {card.visual}
          </span>

          {/* Partículas na cor da seção, enquanto o card está sob o ponteiro.
              Sobem devagar e somem; ao sair, encolhem em 250ms, mais rápido do
              que entraram. */}
          <AnimatePresence>
            {particulas.map((p) => (
              <motion.span
                key={p.id}
                className="pointer-events-none absolute size-[3px] rounded-full"
                style={{ left: `${p.left}%`, top: `${p.top}%`, background: `rgb(${cor})`, boxShadow: `0 0 6px rgba(${cor}, 0.7)` }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1, 1, 0.6], opacity: [0, 0.7, 0.5, 0], x: [0, p.dx], y: [0, p.dy] }}
                exit={{ scale: 0, opacity: 0, transition: { duration: 0.25, ease: EASE.outCubic } }}
                transition={{ duration: p.dur, delay: p.atraso, repeat: Infinity, ease: "linear" }}
              />
            ))}
          </AnimatePresence>

          {/* Desvanecimento na base, para o visual não encostar no texto.
              As paradas seguem uma curva de easing em vez de linear: o
              gradiente linear cru deixa uma borda dura visível no ponto em
              que ele começa. O plugin easing-gradients redistribui as
              paradas e emite em oklch, que é o espaço do nosso Tailwind. */}
          <span className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-[var(--bento-scrim)] to-transparent gradient-ease-out" />
        </span>

        <span className="relative p-5">
          <span className="flex items-baseline gap-2">
            {/* O indice em mono da a grade uma ordem de leitura e um segundo
                nivel tipografico, como o rotulo dos cards da referencia. */}
            <span className="font-mono text-[11px] tabular-nums text-[var(--stage-faint)]">
              {String(indice).padStart(2, "0")}
            </span>
            <span className="text-[15px] font-semibold text-[var(--stage-fg)]">{card.title}</span>
            <ArrowUpRight
              size={13}
              aria-hidden
              className="shrink-0 translate-y-px text-[var(--stage-dim)] opacity-0 transition-[opacity,translate] duration-300 ease-[cubic-bezier(0.215,0.61,0.355,1)] group-hover:translate-x-0.5 group-hover:opacity-100"
            />
            {card.count ? (
              <span className="ml-auto font-mono text-[11px] tabular-nums text-[var(--stage-dim)]">{card.count}</span>
            ) : null}
          </span>
          <span className="mt-1.5 block text-[13px] leading-[20px] text-pretty text-[var(--stage-dim)]">{card.desc}</span>
        </span>
      </motion.a>
    </motion.li>
  );
}
