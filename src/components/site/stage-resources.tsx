import { ArrowUpRight } from "lucide-react";
import { LabsMark } from "./logo";

export type StageCard = {
  key: string;
  title: string;
  desc: string;
  path: string;
  /** Par de cores da seção, vindo de src/lib/site.ts. */
  cover: [string, string];
  icon: string;
  /** Contagem de itens, quando a seção tem uma. */
  count?: string;
};

/** Cards das seções, no formato medido na referência: 480×320, raio 20,
    fundo rgba(22,22,22,0.3), borda 0.67px #333 e padding 24.

    A arte de cada card sai do par de cores que a seção já declara em
    src/lib/site.ts, então nenhuma imagem nova entra no repositório. */
export function StageResources({ cards }: { cards: StageCard[] }) {
  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-[repeat(2,minmax(0,480px))]">
      {cards.map((card) => (
        <li key={card.key}>
          <a
            href={card.path}
            className="stage-card group relative flex h-[300px] flex-col overflow-hidden outline-none transition-colors hover:border-white/25 focus-visible:ring-2 focus-visible:ring-white/60 sm:h-[320px]"
          >
            {/* Fio de luz no topo, como na referência: some nas pontas. */}
            <span
              aria-hidden
              className="absolute inset-x-0 top-0 h-px"
              style={{ background: "linear-gradient(90deg, transparent, #333 10%, #333 90%, transparent)" }}
            />

            <span aria-hidden className="relative flex-1 overflow-hidden">
              <span
                className="absolute inset-0 opacity-[0.22] transition-opacity duration-500 group-hover:opacity-30"
                style={{ background: `radial-gradient(120% 90% at 50% 0%, ${card.cover[0]}, ${card.cover[1]} 70%, transparent)` }}
              />
              <span className="absolute inset-0 grid place-items-center">
                <span className="flex flex-col items-center gap-3">
                  <LabsMark size={40} idPrefix={`res-${card.key}`} />
                  <span className="font-mono text-[42px] font-medium leading-none tracking-[-0.05em] text-white/85">
                    {card.icon}
                  </span>
                </span>
              </span>
            </span>

            <span className="relative border-t border-[var(--stage-line)] p-6">
              <span className="flex items-baseline gap-2">
                <span className="text-[16px] font-medium text-[#EDEDED]">{card.title}</span>
                <ArrowUpRight
                  size={14}
                  aria-hidden
                  className="shrink-0 translate-y-px text-[var(--stage-dim)] opacity-0 transition-opacity group-hover:opacity-100"
                />
                {card.count ? (
                  <span className="ml-auto font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--stage-dim)]">
                    {card.count}
                  </span>
                ) : null}
              </span>
              <span className="mt-1.5 block text-[16px] leading-[1.5] text-[var(--stage-dim)]">{card.desc}</span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
