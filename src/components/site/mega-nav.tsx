"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";
import { EASE } from "@/lib/easing";

export type MegaLink = { key: string; label: string; desc: string; href: string };
export type MegaGroup = { key: string; label: string; links: MegaLink[] };
export type MegaSpotlight = {
  eyebrow: string;
  title: string;
  desc: string;
  href: string;
  cta: string;
  cover: [string, string];
  badge: string;
};

export type MegaLabels = { open: string; close: string; nav: string };

/** Navegação em painel de largura total.
 *
 *  Reconstrução do que o bloco Navigation 14 do React Bits Pro descreve, que
 *  não pude instalar porque a licença não está configurada: painel largo,
 *  seções que trocam em crossfade, um cartão de destaque e sanfona no telefone.
 *
 *  O que a reconstrução faz diferente, de propósito, por causa dos defeitos que
 *  encontrei nos outros componentes do React Bits que trouxemos nesta sessão:
 *  os destinos são âncoras de verdade, então funciona sem JavaScript; nenhum
 *  estilo global sem escopo é injetado; o foco é visível; e quem pediu menos
 *  movimento recebe a troca sem transição em vez de nada. */
export function MegaNav({
  groups,
  spotlight,
  labels,
  logo,
  actions,
  dark,
}: {
  groups: MegaGroup[];
  spotlight: MegaSpotlight;
  labels: MegaLabels;
  logo: React.ReactNode;
  actions: React.ReactNode;
  dark: boolean;
}) {
  const [aberto, setAberto] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const [sanfona, setSanfona] = useState<string | null>(null);
  const reduced = useReducedMotion();
  const raiz = useRef<HTMLDivElement>(null);
  const painelId = useId();

  // Fecha ao clicar fora, ao apertar Esc, e ao sair com o teclado. Sem isso o
  // painel fica preso aberto quando o ponteiro sai por cima do cabeçalho.
  useEffect(() => {
    if (!aberto && !mobile) return;
    const porTecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setAberto(null); setMobile(false); }
    };
    const porClique = (e: MouseEvent) => {
      if (raiz.current && !raiz.current.contains(e.target as Node)) {
        setAberto(null);
        setMobile(false);
      }
    };
    document.addEventListener("keydown", porTecla);
    document.addEventListener("mousedown", porClique);
    return () => {
      document.removeEventListener("keydown", porTecla);
      document.removeEventListener("mousedown", porClique);
    };
  }, [aberto, mobile]);

  const grupoAtivo = groups.find((g) => g.key === aberto) ?? null;
  const duracao = reduced ? 0 : 0.26;

  return (
    <div ref={raiz} className="relative" onMouseLeave={() => setAberto(null)}>
      {/* Barra no grid de 8: 56 de altura, controles de 40 (8 acima e abaixo),
          8 entre controles, 24 de margem lateral. Dentro dos controles a meia
          unidade (4 e 12) vale para o espaço entre ícone e texto e o padding. */}
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-4 px-6">
        {logo}

        {/* Um gatilho por grupo, em vez de cada destino em linha. O menu de
            mesa entra em 1024px, que é onde os quatro rótulos cabem numa linha
            só; abaixo disso a sanfona assume. Os rótulos nunca quebram: se não
            couberem, o ponto de quebra está errado, não o texto. */}
        <nav aria-label={labels.nav} className="ml-auto hidden items-center gap-1 lg:flex">
          {groups.map((g) => {
            const on = aberto === g.key;
            return (
              <button
                key={g.key}
                type="button"
                aria-expanded={on}
                aria-controls={`${painelId}-painel`}
                onMouseEnter={() => setAberto(g.key)}
                onFocus={() => setAberto(g.key)}
                onClick={() => setAberto(on ? null : g.key)}
                className={`inline-flex h-10 items-center gap-1 whitespace-nowrap rounded-lg px-2 text-[14px] outline-hidden transition-colors focus-visible:ring-2 focus-visible:ring-current xl:px-3 ${
                  on ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {g.label}
                <ChevronDown
                  size={14}
                  strokeWidth={1.75}
                  aria-hidden
                  // Meio pixel para baixo: a seta é assimétrica e, centrada na
                  // geometria, parece alta ao lado da linha de base do texto.
                  className="translate-y-px transition-transform duration-200"
                  style={{ transform: on ? "translateY(1px) rotate(180deg)" : undefined }}
                />
              </button>
            );
          })}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2 lg:ml-4">
          {actions}
          <button
            type="button"
            aria-expanded={mobile}
            aria-controls={`${painelId}-sanfona`}
            aria-label={mobile ? labels.close : labels.open}
            onClick={() => setMobile((v) => !v)}
            className="inline-flex size-10 items-center justify-center rounded-lg text-muted-foreground outline-hidden transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-current lg:hidden"
          >
            {mobile ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* PAINEL LARGO — só no desktop. As seções trocam em crossfade: o painel
          mantém a altura e o conteúdo se substitui, em vez de abrir e fechar. */}
      <AnimatePresence>
        {grupoAtivo ? (
          <motion.div
            id={`${painelId}-painel`}
            key="painel"
            initial={reduced ? false : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -6 }}
            transition={{ duration: duracao, ease: EASE.quickOut }}
            className={`absolute inset-x-0 top-full hidden border-t lg:block ${
              dark ? "border-white/[0.07] bg-[#0d0d0d]/95" : "border-border bg-card/95"
            } backdrop-blur-xl`}
          >
            <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-8 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
              {/* O conteúdo do grupo troca sem o painel piscar. */}
              <AnimatePresence mode="wait">
                <motion.ul
                  key={grupoAtivo.key}
                  initial={reduced ? false : { opacity: 0, x: 6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reduced ? { opacity: 0 } : { opacity: 0, x: -6 }}
                  transition={{ duration: duracao, ease: EASE.outCubic }}
                  className="grid gap-1 sm:grid-cols-2"
                >
                  {grupoAtivo.links.map((l) => (
                    <li key={l.key}>
                      <a
                        href={l.href}
                        onClick={() => setAberto(null)}
                        className="group block rounded-lg p-4 outline-hidden transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-current"
                      >
                        <span className="flex items-center gap-1.5 text-[14px] font-medium">
                          {l.label}
                          <ArrowRight
                            size={13}
                            aria-hidden
                            className="opacity-0 transition-opacity group-hover:opacity-60"
                          />
                        </span>
                        <span className="mt-0.5 block text-[13px] leading-snug text-muted-foreground">
                          {l.desc}
                        </span>
                      </a>
                    </li>
                  ))}
                </motion.ul>
              </AnimatePresence>

              <Destaque spotlight={spotlight} onNavigate={() => setAberto(null)} dark={dark} />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* SANFONA — no telefone, onde um painel largo não cabe. */}
      <AnimatePresence>
        {mobile ? (
          <motion.div
            id={`${painelId}-sanfona`}
            key="sanfona"
            initial={reduced ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.3, ease: EASE.quickOut }}
            className={`overflow-hidden border-t lg:hidden ${dark ? "border-white/[0.07]" : "border-border"}`}
          >
            <div className="px-6 py-4">
              {groups.map((g) => {
                const on = sanfona === g.key;
                return (
                  <div key={g.key} className="border-b border-border/60 last:border-0">
                    <button
                      type="button"
                      aria-expanded={on}
                      onClick={() => setSanfona(on ? null : g.key)}
                      className="flex h-12 w-full items-center justify-between text-left text-[15px] font-medium outline-hidden focus-visible:ring-2 focus-visible:ring-current"
                    >
                      {g.label}
                      <ChevronDown
                        size={16}
                        aria-hidden
                        className="text-muted-foreground transition-transform duration-200"
                        style={{ transform: on ? "rotate(180deg)" : undefined }}
                      />
                    </button>
                    <AnimatePresence initial={false}>
                      {on ? (
                        <motion.ul
                          initial={reduced ? false : { height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
                          transition={{ duration: reduced ? 0 : 0.24, ease: EASE.quickOut }}
                          className="overflow-hidden"
                        >
                          {g.links.map((l) => (
                            <li key={l.key}>
                              <a
                                href={l.href}
                                onClick={() => { setMobile(false); setSanfona(null); }}
                                className="flex h-10 items-center rounded-md px-2 text-[14px] text-muted-foreground outline-hidden hover:text-foreground focus-visible:ring-2 focus-visible:ring-current"
                              >
                                {l.label}
                              </a>
                            </li>
                          ))}
                        </motion.ul>
                      ) : null}
                    </AnimatePresence>
                  </div>
                );
              })}

              <a
                href={spotlight.href}
                onClick={() => setMobile(false)}
                className="mt-4 flex items-center justify-between rounded-lg border border-border p-4 outline-hidden focus-visible:ring-2 focus-visible:ring-current"
              >
                <span>
                  <span className="eyebrow">{spotlight.eyebrow}</span>
                  <span className="mt-1 block text-[14px] font-medium">{spotlight.title}</span>
                </span>
                <ArrowRight size={15} aria-hidden className="shrink-0 text-muted-foreground" />
              </a>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

/** O cartão de destaque do painel. É o único ponto do menu com peso visual, e
 *  por isso carrega o que queremos que a pessoa leia primeiro. */
function Destaque({
  spotlight,
  onNavigate,
  dark,
}: {
  spotlight: MegaSpotlight;
  onNavigate: () => void;
  dark: boolean;
}) {
  return (
    <a
      href={spotlight.href}
      onClick={onNavigate}
      className={`group relative hidden overflow-hidden rounded-xl border outline-hidden transition-colors focus-visible:ring-2 focus-visible:ring-current lg:block ${
        dark ? "border-white/[0.08] hover:border-white/20" : "border-border hover:border-teal/40"
      }`}
    >
      <span
        aria-hidden
        className="absolute inset-0 opacity-25 transition-opacity duration-500 group-hover:opacity-40"
        style={{ background: `linear-gradient(150deg, ${spotlight.cover[0]}, ${spotlight.cover[1]})` }}
      />
      <span className="relative flex h-full flex-col p-5">
        <span className="flex items-center gap-2">
          <span className="eyebrow">{spotlight.eyebrow}</span>
          <span className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide">
            {spotlight.badge}
          </span>
        </span>
        <span className="mt-3 block text-[16px] font-semibold leading-snug">{spotlight.title}</span>
        <span className="mt-1.5 block text-[13px] leading-relaxed text-muted-foreground">
          {spotlight.desc}
        </span>
        <span className="mt-auto flex items-center gap-1.5 pt-4 text-[13px] font-medium">
          {spotlight.cta}
          <ArrowRight
            size={13}
            aria-hidden
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </span>
      </span>
    </a>
  );
}
