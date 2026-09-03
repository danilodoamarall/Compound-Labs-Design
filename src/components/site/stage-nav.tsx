"use client";

import { useEffect, useRef, useState } from "react";
import { activeSectionId } from "@/lib/scroll-spy";

export type StageNavItem = { id: string; label: string };

/** Pílula de navegação do palco, com os valores medidos em vercel.com/design:
    contêiner de 44px em #111 com 4px de padding, itens de 14px peso 500, ativo
    em #242424 sobre #FAFAFA.

    São âncoras de verdade, não botões: a página funciona sem JavaScript, dá
    para abrir em outra aba e o endereço fica compartilhável.

    Qual seção está ativa é decidido por activeSectionId, uma função pura
    coberta por scripts/check-scroll-spy.mjs. Aqui ficam só os gatilhos, e são
    dois de propósito: evento de rolagem e IntersectionObserver. Cada um sozinho
    falha em algum ambiente, e como os dois chamam a mesma conta, a redundância
    não cria duas verdades. */
export function StageNav({ items, label }: { items: StageNavItem[]; label: string }) {
  const [active, setActive] = useState(items[0]?.id ?? "");
  const ref = useRef<HTMLUListElement>(null);

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

  // Mantém o item ativo à vista quando a pílula rola na horizontal no telefone.
  useEffect(() => {
    ref.current?.querySelector<HTMLElement>(`[data-id="${active}"]`)?.scrollIntoView({
      block: "nearest",
      inline: "nearest",
    });
  }, [active]);

  return (
    <nav aria-label={label} className="stage-nav">
      <ul
        ref={ref}
        className="mx-auto flex w-fit max-w-full items-center gap-0.5 overflow-x-auto rounded-full bg-[var(--stage-pill)] p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item) => {
          const on = item.id === active;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                data-id={item.id}
                aria-current={on ? "true" : undefined}
                className={`inline-flex h-9 items-center whitespace-nowrap rounded-full px-4 text-[14px] font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-white/70 sm:px-6 ${
                  on
                    ? "bg-[var(--stage-pill-active)] text-[var(--stage-fg)]"
                    : "text-[var(--stage-pill-idle)] hover:text-[#EDEDED]"
                }`}
              >
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
