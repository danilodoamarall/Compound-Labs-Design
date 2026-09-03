"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { activeSectionId } from "@/lib/scroll-spy";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

export type GlassNavItem = { id: string; label: string };

/** Navegação do palco: moldura de vidro por fora, trilho escuro por dentro, e
 *  um indicador que desliza até o item ativo.
 *
 *  Escrevi em vez de vendorizar o GooeyNav por três defeitos que li no código
 *  dele: injeta um `<style>` sem escopo com seletores nus `li.active` e
 *  `li::after`, que atingiriam todo `<li>` do site; a prop `colors` não faz nada
 *  porque as variáveis que ela referencia nunca são definidas; e o foco é
 *  invisível, sem `aria-current`.
 *
 *  E há um motivo estrutural: o gooey é `blur` mais `contrast(100)` com
 *  `mix-blend-mode: lighten`, que só lê sobre fundo escuro e opaco, e depende de
 *  uma placa preta que vaza 75px para fora da caixa. Dentro de um painel de
 *  vidro com `overflow: hidden` ela é cortada e o efeito degrada. Por isso o
 *  vidro fica na moldura e o trilho do indicador é sólido.
 *
 *  São âncoras de verdade: funciona sem JavaScript e dá para abrir em outra aba.
 *  Qual seção está ativa sai de `activeSectionId`, coberta por testes. */
export function GlassNav({ items, label }: { items: GlassNavItem[]; label: string }) {
  const [active, setActive] = useState(items[0]?.id ?? "");
  const [box, setBox] = useState<{ left: number; width: number } | null>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const read = () => {
      const sections = items
        .map((item) => {
          const el = document.getElementById(item.id);
          return el ? { id: item.id, top: el.getBoundingClientRect().top + window.scrollY } : null;
        })
        .filter((s): s is { id: string; top: number } => s !== null);

      setActive(
        activeSectionId(sections, window.scrollY, window.innerHeight, document.documentElement.scrollHeight)
      );
    };

    let frame = 0;
    const schedule = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        read();
      });
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    // Gatilho redundante: se o ambiente engolir o evento de rolagem, a entrada
    // das seções ainda acorda a conta.
    const io = new IntersectionObserver(schedule, { threshold: [0, 0.5, 1] });
    for (const item of items) {
      const el = document.getElementById(item.id);
      if (el) io.observe(el);
    }

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      io.disconnect();
    };
  }, [items]);

  // Mede o item ativo depois da pintura, para o indicador não piscar na posição
  // errada no primeiro quadro.
  useLayoutEffect(() => {
    const measure = () => {
      const el = listRef.current?.querySelector<HTMLElement>(`[data-id="${active}"]`);
      if (!el) return;
      setBox({ left: el.offsetLeft, width: el.offsetWidth });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [active, items]);

  return (
    <nav aria-label={label} className="stage-nav flex justify-center">
      {/* Moldura de vidro */}
      <div className="rounded-full border border-white/10 bg-white/[0.06] p-1 shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-xl">
        {/* Trilho sólido: o indicador precisa de fundo opaco para ter contraste */}
        <ul ref={listRef} className="relative flex items-center gap-0.5 rounded-full bg-[#111]/80 p-1">
          {box ? (
            <span
              aria-hidden
              className="absolute inset-y-1 rounded-full bg-[#2a2a2a]"
              style={{
                left: box.left,
                width: box.width,
                transition: reduced ? "none" : "left 420ms cubic-bezier(0.22,1,0.36,1), width 420ms cubic-bezier(0.22,1,0.36,1)",
              }}
            />
          ) : null}

          {items.map((item) => {
            const on = item.id === active;
            return (
              <li key={item.id} className="relative">
                <a
                  href={`#${item.id}`}
                  data-id={item.id}
                  aria-current={on ? "true" : undefined}
                  className={`inline-flex h-9 items-center whitespace-nowrap rounded-full px-4 text-[14px] font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-white/70 sm:px-6 ${
                    on ? "text-[#FAFAFA]" : "text-[#8F8F8F] hover:text-[#EDEDED]"
                  }`}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
