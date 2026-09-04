"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { EASE } from "@/lib/easing";

export type Serie = { label: string; pct: number }[];

/** A miniatura do gráfico de cada artigo.
 *
 *  Cada artigo declara um `chart` no frontmatter, e esse nome aponta para uma
 *  série de verdade dentro de content/data/state-of-prototyping-2026.json. A
 *  capa passa a mostrar o próprio dado do artigo em vez de um gradiente com um
 *  número em cima: é a diferença entre um cartaz e uma prévia.
 *
 *  Os mesmos cuidados dos cards de recurso: anima só ao entrar na tela, entrega
 *  o estado final para quem pediu menos movimento, e anima transform em vez de
 *  largura ou altura, que é o que o compositor faz sem recalcular layout. */
export function ArticleSpark({
  chart,
  serie,
  cor,
}: {
  chart: string;
  serie: Serie;
  cor: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const animar = reduced ? true : inView;

  return (
    <div ref={ref} className="absolute inset-x-4 bottom-4 top-4">
      {chart === "vibe-band" ? (
        <BandaEmpilhada serie={serie} cor={cor} animar={animar} reduced={Boolean(reduced)} />
      ) : chart === "outlook" ? (
        <PontosNaLinha serie={serie} cor={cor} animar={animar} reduced={Boolean(reduced)} />
      ) : (
        <Barras serie={serie} cor={cor} animar={animar} reduced={Boolean(reduced)} />
      )}
    </div>
  );
}

/** As três tribos: uma barra só, dividida. É a imagem central da série. */
function BandaEmpilhada({ serie, cor, animar, reduced }: Props) {
  const total = serie.reduce((s, d) => s + d.pct, 0) || 100;
  return (
    <div className="flex h-full flex-col justify-end gap-3">
      <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-black/25">
        {serie.map((d, i) => (
          <motion.span
            key={d.label}
            className="h-full first:rounded-l-full last:rounded-r-full"
            style={{
              width: `${(d.pct / total) * 100}%`,
              background: cor,
              opacity: 1 - i * 0.28,
              transformOrigin: "left center",
            }}
            initial={reduced ? false : { scaleX: 0 }}
            animate={animar ? { scaleX: 1 } : undefined}
            transition={{ duration: 0.7, delay: 0.1 + i * 0.09, ease: EASE.snappyOut }}
          />
        ))}
      </div>
      <div className="flex items-baseline gap-3">
        {serie.slice(0, 3).map((d, i) => (
          <motion.span
            key={d.label}
            className="font-mono text-[10px] tabular-nums text-white/60"
            initial={reduced ? false : { opacity: 0, y: 4 }}
            animate={animar ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.4, delay: 0.4 + i * 0.06, ease: EASE.outCubic }}
          >
            {d.pct.toLocaleString("pt-BR", { minimumFractionDigits: 1 })}%
          </motion.span>
        ))}
      </div>
    </div>
  );
}

/** Barras verticais: a forma mais legível numa capa estreita. */
function Barras({ serie, cor, animar, reduced }: Props) {
  const maior = Math.max(...serie.map((d) => d.pct), 1);
  return (
    <div className="flex h-full items-end gap-[5px]">
      {serie.slice(0, 7).map((d, i) => (
        <motion.span
          key={d.label}
          className="flex-1 rounded-t-[3px]"
          style={{
            height: `${Math.max(8, (d.pct / maior) * 100)}%`,
            background: cor,
            opacity: 0.34 + (d.pct / maior) * 0.55,
            transformOrigin: "bottom center",
          }}
          initial={reduced ? false : { scaleY: 0 }}
          animate={animar ? { scaleY: 1 } : undefined}
          transition={{ duration: 0.6, delay: 0.1 + i * 0.06, ease: EASE.snappyOut }}
        />
      ))}
    </div>
  );
}

/** Pontos numa linha: para séries sem porcentagem, onde a ordem é o dado. */
function PontosNaLinha({ serie, cor, animar, reduced }: Props) {
  return (
    <div className="flex h-full flex-col justify-end gap-2.5">
      {serie.slice(0, 5).map((d, i) => (
        <motion.span
          key={d.label}
          className="flex items-center gap-2"
          initial={reduced ? false : { opacity: 0, x: -8 }}
          animate={animar ? { opacity: 1, x: 0 } : undefined}
          transition={{ duration: 0.45, delay: 0.1 + i * 0.07, ease: EASE.outCubic }}
        >
          <span
            className="size-[7px] shrink-0 rounded-full"
            style={{ background: cor, opacity: 1 - i * 0.16 }}
          />
          <span className="h-px flex-1" style={{ background: cor, opacity: 0.28 - i * 0.04 }} />
        </motion.span>
      ))}
    </div>
  );
}

type Props = { serie: Serie; cor: string; animar: boolean; reduced: boolean };
