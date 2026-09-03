"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Maximize2, MessageSquareText, X } from "lucide-react";

export type DeckLabels = {
  previous: string;
  next: string;
  slideOf: string; // template com {n} e {total}
  notes: string;
  fullscreen: string;
  exit: string;
  keyboardHint: string;
};

type Props = {
  children: ReactNode;
  mode: "read" | "present";
  exitHref: string;
  labels: DeckLabels;
};

/** Modo leitura: os slides fluem em sequência. Modo apresentação: um slide por
    vez. Os slides chegam renderizados pelo servidor (MDX), então a divisão é
    feita no DOM por [data-slide]. Teclado: ← → / espaço, Home/End, F tela
    cheia, N notas, Esc volta para a leitura. */
export function Deck({ children, mode, exitHref, labels }: Props) {
  const stageRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const slidesRef = useRef<HTMLElement[]>([]);
  const [total, setTotal] = useState(0);
  const [index, setIndex] = useState(0);
  const [notes, setNotes] = useState(false);

  useEffect(() => {
    if (mode !== "present" || !stageRef.current) return;
    const els = Array.from(stageRef.current.querySelectorAll<HTMLElement>("[data-slide]"));
    slidesRef.current = els;
    setTotal(els.length);
    const hash = Number(window.location.hash.replace("#", ""));
    setIndex(Number.isFinite(hash) && hash >= 1 && hash <= els.length ? hash - 1 : 0);
  }, [mode, children]);

  useEffect(() => {
    if (mode !== "present") return;
    slidesRef.current.forEach((el, i) => el.classList.toggle("is-active", i === index));
    if (total) window.history.replaceState(null, "", `#${index + 1}`);
    slidesRef.current[index]?.scrollTo?.({ top: 0 });
  }, [index, total, mode]);

  const go = useCallback((delta: number) => setIndex((i) => Math.min(Math.max(0, total - 1), Math.max(0, i + delta))), [total]);

  useEffect(() => {
    if (mode !== "present") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement && ["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName)) return;
      switch (e.key) {
        case "ArrowRight": case "PageDown": case " ": e.preventDefault(); go(1); break;
        case "ArrowLeft": case "PageUp": e.preventDefault(); go(-1); break;
        case "Home": e.preventDefault(); setIndex(0); break;
        case "End": e.preventDefault(); setIndex(Math.max(0, total - 1)); break;
        case "f": case "F": rootRef.current?.requestFullscreen?.(); break;
        case "n": case "N": setNotes((v) => !v); break;
        case "Escape": if (!document.fullscreenElement) window.location.assign(exitHref); break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode, go, total, exitHref]);

  useEffect(() => {
    if (mode !== "present") return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [mode]);

  if (mode === "read") {
    return <div className="deck deck-read">{children}</div>;
  }

  return (
    <div ref={rootRef} className={`deck deck-present ${notes ? "notes-on" : ""}`} aria-roledescription="slideshow">
      <div className="deck-progress" aria-hidden><span style={{ width: total ? `${((index + 1) / total) * 100}%` : "0%" }} /></div>
      <div ref={stageRef} className="deck-stage">{children}</div>
      <div className="deck-bar" role="toolbar" aria-label="Slides">
        <button type="button" className="deck-btn" onClick={() => go(-1)} disabled={index === 0} aria-label={labels.previous}><ChevronLeft size={18} /></button>
        <span className="deck-counter">{total ? labels.slideOf.replace("{n}", String(index + 1)).replace("{total}", String(total)) : ""}</span>
        <button type="button" className="deck-btn" onClick={() => go(1)} disabled={index >= total - 1} aria-label={labels.next}><ChevronRight size={18} /></button>
        <span className="deck-hint">{labels.keyboardHint}</span>
        <button type="button" className={`deck-btn ${notes ? "is-on" : ""}`} onClick={() => setNotes((v) => !v)} aria-pressed={notes} aria-label={labels.notes}><MessageSquareText size={18} /></button>
        <button type="button" className="deck-btn" onClick={() => rootRef.current?.requestFullscreen?.()} aria-label={labels.fullscreen}><Maximize2 size={18} /></button>
        <Link href={exitHref} className="deck-btn" aria-label={labels.exit}><X size={18} /></Link>
      </div>
    </div>
  );
}
