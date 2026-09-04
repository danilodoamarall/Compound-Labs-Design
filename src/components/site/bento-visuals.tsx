"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { BookOpen, Layers } from "lucide-react";

import { EASE } from "@/lib/easing";

// Curvas do easing.dev, pelo nome. A de entrada é a snappyOut, que começa rápido
// e assenta devagar; a seca é a outCubic, para microinterações.
const ENTRADA = EASE.snappyOut;
const SECA = EASE.outCubic;

/** Cada visual respeita quem pediu menos movimento: em vez de não renderizar,
 *  entra já no estado final. O card continua completo, só não anima. */
function useMotionSettings() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return { ref, reduced: Boolean(reduced), animate: reduced ? true : inView };
}

const palco = "absolute inset-0 overflow-hidden";

/** ARTIGOS — os cinco da série entram em cascata, como fichas empilhadas.
 *  Diz o que a seção tem: uma sequência curta e ordenada. */
export function VisualArtigos({ titles }: { titles: string[] }) {
  const { ref, reduced, animate } = useMotionSettings();
  return (
    <div ref={ref} className={palco}>
      <div className="absolute inset-x-5 top-1/2 -translate-y-1/2 space-y-2">
        {titles.slice(0, 5).map((t, i) => (
          <motion.div
            key={t}
            initial={reduced ? false : { opacity: 0, x: -14 }}
            animate={animate ? { opacity: i === 0 ? 1 : 0.42 - i * 0.06, x: 0 } : undefined}
            transition={{ duration: 0.5, delay: i * 0.07, ease: ENTRADA }}
            className="flex items-center gap-2.5 rounded-lg border border-white/[0.07] bg-white/[0.03] px-3 py-2"
          >
            <span className="font-mono text-[10px] tabular-nums text-white/45">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="truncate text-[11.5px] text-white/70">{t}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/** SKILLS & AGENTS — um terminal com o comando sendo digitado. É como uma skill
 *  de fato é invocada. */
export function VisualSkills() {
  const { ref, reduced, animate } = useMotionSettings();
  const comando = "/find-docs";
  return (
    <div ref={ref} className={palco}>
      <div className="absolute inset-x-5 top-1/2 -translate-y-1/2 overflow-hidden rounded-lg border border-white/[0.08] bg-[#0d0d0d]">
        <div className="flex items-center gap-1.5 border-b border-white/[0.06] px-3 py-2">
          {["#e8735e", "#e0913a", "#4ec2a6"].map((c) => (
            <span key={c} className="size-[6px] rounded-full" style={{ background: c, opacity: 0.55 }} />
          ))}
          <span className="ml-1.5 font-mono text-[9.5px] text-white/35">claude</span>
        </div>
        <div className="px-3 py-3 font-mono text-[11px]">
          <span className="text-white/35">$ </span>
          {comando.split("").map((ch, i) => (
            <motion.span
              key={i}
              className="text-white/75"
              initial={reduced ? false : { opacity: 0 }}
              animate={animate ? { opacity: 1 } : undefined}
              transition={{ duration: 0.01, delay: 0.3 + i * 0.055 }}
            >
              {ch}
            </motion.span>
          ))}
          <motion.span
            className="ml-px inline-block h-[11px] w-[6px] translate-y-[1px] bg-white/60"
            animate={reduced ? undefined : { opacity: [1, 1, 0, 0] }}
            transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </div>
    </div>
  );
}

/** WORKFLOW — as etapas do fluxo, com uma acesa e barras que preenchem.
 *  Espelha o "Pick Your Stack" da referência. */
export function VisualWorkflow({ stages }: { stages: string[] }) {
  const { ref, reduced, animate } = useMotionSettings();
  const larguras = [0.55, 0.72, 1, 0.4];
  return (
    <div ref={ref} className={palco}>
      <div className="absolute inset-x-5 top-1/2 -translate-y-1/2 space-y-2.5">
        {stages.slice(0, 4).map((s, i) => {
          const ativo = i === 2;
          return (
            <motion.div
              key={s}
              className="flex items-center gap-2.5"
              initial={reduced ? false : { opacity: 0, x: -10 }}
              animate={animate ? { opacity: ativo ? 1 : 0.45, x: 0 } : undefined}
              transition={{ duration: 0.45, delay: i * 0.07, ease: ENTRADA }}
            >
              <span className={`size-[5px] shrink-0 rounded-full ${ativo ? "bg-teal" : "bg-white/25"}`} />
              <span className={`w-[70px] shrink-0 font-mono text-[10.5px] ${ativo ? "text-white/85" : "text-white/45"}`}>
                {s}
              </span>
              <span className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                <motion.span
                  className="block h-full rounded-full"
                  style={{ background: ativo ? "#22a18c" : "rgba(255,255,255,0.18)" }}
                  initial={reduced ? false : { scaleX: 0 }}
                  animate={animate ? { scaleX: larguras[i] } : undefined}
                  transition={{ duration: 0.8, delay: 0.2 + i * 0.08, ease: ENTRADA }}
                  // A barra anima transform, não largura: é o que o compositor
                  // sabe fazer sem recalcular layout a cada quadro.
                />
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/** DOCS — as páginas empilhadas, que se separam ao entrar. */
export function VisualDocs() {
  const { ref, reduced, animate } = useMotionSettings();
  return (
    <div ref={ref} className={palco}>
      <div className="absolute left-1/2 top-1/2 size-[120px] -translate-x-1/2 -translate-y-1/2">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="absolute inset-x-4 grid h-[74px] place-items-center rounded-xl border border-white/[0.09] bg-[#151515]"
            initial={reduced ? false : { y: 24, opacity: 0, rotate: 0 }}
            animate={animate ? { y: i * -13, opacity: 1 - i * 0.22, rotate: (i - 1) * 4 } : undefined}
            transition={{ duration: 0.6, delay: (2 - i) * 0.09, ease: ENTRADA }}
            style={{ top: 26, zIndex: 3 - i }}
          >
            {i === 0 ? <BookOpen size={20} className="text-white/55" /> : null}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

/** FAQ — as perguntas abrindo uma a uma, como o acordeão da página. */
export function VisualFaq({ questions }: { questions: string[] }) {
  const { ref, reduced, animate } = useMotionSettings();
  return (
    <div ref={ref} className={palco}>
      <div className="absolute inset-x-5 top-1/2 -translate-y-1/2 space-y-2">
        {questions.slice(0, 3).map((q, i) => (
          <motion.div
            key={q}
            className="rounded-lg border border-white/[0.07] bg-white/[0.03] px-3 py-2"
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={animate ? { opacity: i === 0 ? 1 : 0.5 - i * 0.12, y: 0 } : undefined}
            transition={{ duration: 0.45, delay: i * 0.09, ease: ENTRADA }}
          >
            <span className="flex items-center justify-between gap-2">
              <span className="truncate text-[11.5px] text-white/70">{q}</span>
              <motion.span
                className="shrink-0 text-white/35"
                animate={animate && !reduced && i === 0 ? { rotate: 45 } : undefined}
                transition={{ duration: 0.4, delay: 0.5, ease: SECA }}
              >
                +
              </motion.span>
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/** TODO O CONTEÚDO — o número sobe e a linha cresce, como o "Growing Fast". */
export function VisualBrowse({ total }: { total: number }) {
  const { ref, reduced, animate } = useMotionSettings();
  return (
    <div ref={ref} className={palco}>
      <div className="absolute inset-x-5 top-1/2 -translate-y-1/2">
        <motion.p
          className="font-mono text-[52px] font-medium leading-none tracking-[-0.05em] tabular-nums text-white/85"
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={animate ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.55, ease: ENTRADA }}
        >
          {total}
        </motion.p>
        <svg viewBox="0 0 200 44" className="mt-3 h-11 w-full" preserveAspectRatio="none">
          <motion.path
            d="M0 40 C 30 38, 46 30, 72 26 S 118 20, 142 12 S 178 6, 200 2"
            fill="none" stroke="#22a18c" strokeWidth="1.6" strokeLinecap="round"
            initial={reduced ? false : { pathLength: 0 }}
            animate={animate ? { pathLength: 1 } : undefined}
            transition={{ duration: 1.1, delay: 0.15, ease: ENTRADA }}
          />
        </svg>
      </div>
    </div>
  );
}

/** SKILLS de sobra: um empilhado de camadas para quando faltar visual próprio. */
export function VisualPadrao() {
  const { ref, reduced, animate } = useMotionSettings();
  return (
    <div ref={ref} className={palco}>
      <motion.span
        className="absolute left-1/2 top-1/2 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-xl border border-white/10 bg-[#161616]"
        initial={reduced ? false : { opacity: 0, scale: 0.8 }}
        animate={animate ? { opacity: 1, scale: 1 } : undefined}
        transition={{ duration: 0.5, ease: ENTRADA }}
      >
        <Layers size={20} className="text-white/55" />
      </motion.span>
    </div>
  );
}

/** CLI — o terminal rodando o catálogo. O comando é o de verdade, com o pacote
 *  publicado, e a resposta são três linhas do placar: o card mostra o que o
 *  leitor vai ver ao rodar, não uma metáfora. */
export function VisualCli() {
  const { ref, reduced, animate } = useMotionSettings();
  const comando = "npx @compound-design/skills list --topic motion";
  const linhas = ["emilkowalski/animate", "mengto/gsap", "jakubkrehel/motion"];
  return (
    <div ref={ref} className={palco}>
      <div className="absolute inset-x-5 top-1/2 -translate-y-1/2 overflow-hidden rounded-lg border border-white/[0.08] bg-[#0d0d0d]">
        <div className="flex items-center gap-1.5 border-b border-white/[0.06] px-3 py-2">
          {["#e8735e", "#e0913a", "#4ec2a6"].map((c) => (
            <span key={c} className="size-[6px] rounded-full" style={{ background: c, opacity: 0.55 }} />
          ))}
          <span className="ml-1.5 font-mono text-[9.5px] text-white/35">ai-skills</span>
        </div>
        <div className="px-3 py-2.5 font-mono text-[10.5px] leading-[1.7]">
          <div className="truncate">
            <span className="text-white/35">$ </span>
            {comando.split("").map((ch, i) => (
              <motion.span
                key={i}
                className="text-white/75"
                initial={reduced ? false : { opacity: 0 }}
                animate={animate ? { opacity: 1 } : undefined}
                transition={{ duration: 0.01, delay: 0.2 + i * 0.022 }}
              >
                {ch}
              </motion.span>
            ))}
          </div>
          {linhas.map((l, i) => (
            <motion.div
              key={l}
              className="truncate text-white/50"
              initial={reduced ? false : { opacity: 0, x: -4 }}
              animate={animate ? { opacity: 1, x: 0 } : undefined}
              transition={{ duration: 0.3, delay: 1.4 + i * 0.12, ease: ENTRADA }}
            >
              <span className="text-white/25">  </span>{l}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** MCP — o agente de um lado, o catálogo do outro, e as três ferramentas
 *  atravessando a ligação. É o que o servidor expõe, com os nomes reais. */
export function VisualMcp() {
  const { ref, reduced, animate } = useMotionSettings();
  const ferramentas = ["list_topics", "list_skills", "get_skill"];
  return (
    <div ref={ref} className={palco}>
      <div className="absolute inset-x-5 top-1/2 flex -translate-y-1/2 items-center gap-3">
        <div className="shrink-0 rounded-md border border-white/[0.1] bg-white/[0.04] px-2.5 py-2 font-mono text-[10px] text-white/70">
          agent
        </div>
        <div className="relative min-w-0 flex-1">
          <svg viewBox="0 0 200 8" className="h-2 w-full" preserveAspectRatio="none" aria-hidden>
            <motion.line
              x1="0" y1="4" x2="200" y2="4"
              stroke="rgba(255,255,255,0.18)" strokeWidth="1" strokeDasharray="3 4"
              initial={reduced ? false : { pathLength: 0 }}
              animate={animate ? { pathLength: 1 } : undefined}
              transition={{ duration: 0.6, ease: ENTRADA }}
            />
          </svg>
          <div className="absolute inset-x-0 -top-8 flex flex-col items-center gap-1">
            {ferramentas.map((f, i) => (
              <motion.span
                key={f}
                className="rounded-full border border-teal/40 bg-teal/10 px-2 py-0.5 font-mono text-[9px] text-white/80"
                initial={reduced ? false : { opacity: 0, y: 6 }}
                animate={animate ? { opacity: 1, y: [6, 0, 0, 6], x: [-70, 0, 70, 70] } : undefined}
                transition={
                  reduced
                    ? undefined
                    : { duration: 2.6, delay: 0.5 + i * 0.45, repeat: Infinity, repeatDelay: 1.2, ease: SECA, times: [0, 0.3, 0.75, 1] }
                }
                style={{ position: "absolute", top: i * 12 }}
              >
                {f}
              </motion.span>
            ))}
          </div>
        </div>
        <div className="shrink-0 rounded-md border border-white/[0.1] bg-white/[0.04] px-2.5 py-2 font-mono text-[10px] text-white/70">
          /mcp
        </div>
      </div>
    </div>
  );
}
