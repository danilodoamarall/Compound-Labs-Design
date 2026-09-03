"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  if (typeof window === "undefined" || !window.matchMedia) return () => {};
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function getSnapshot() {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia(QUERY).matches;
}

/** No servidor não dá para saber a preferência, e assumir "sem movimento"
    causaria um salto na hidratação para a maioria. Assume falso e o
    useSyncExternalStore corrige na primeira leitura do cliente. */
function getServerSnapshot() {
  return false;
}

/** Quem pediu menos movimento no sistema.
 *
 *  Os componentes animados que usamos do React Bits não consultam essa
 *  preferência: medi `MoltenMetal`, `BorderGlow` e `GooeyNav`, e nenhum dos três
 *  faz. Só a `AccordionGallery` consulta, e ainda assim lendo uma vez durante a
 *  renderização, sem assinar mudanças.
 *
 *  Este hook assina de verdade, então trocar a preferência no sistema atualiza a
 *  página sem recarregar. É o único lugar do projeto que decide isso. */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
