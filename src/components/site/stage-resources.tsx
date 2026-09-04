import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";

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

/** A galeria das seções, com os valores medidos no "What's inside" do React
 *  Bits: grade de 12 colunas, gap 16, cards de 288px com raio 16, fundo
 *  rgba(18,15,23,0.45) e borda de 0.67px a 8% de branco.
 *
 *  A grade é nossa, de 12 colunas com span por card. O MagicBento traria 875
 *  linhas, uma dependência de gsap e uma grade fixa para seis cards, e nós temos
 *  sete: a sétima ficaria órfã. Aqui os spans somam linhas cheias.
 *
 *  Cada card tem uma composição própria em vez da marca repetida. Antes os oito
 *  mostravam o mesmo logo e uma letra, então a grade inteira lia como um só
 *  cartão repetido oito vezes. Agora o visual diz algo verdadeiro sobre a seção:
 *  o radar desenha os anéis, o workflow mostra as etapas, as skills mostram um
 *  comando sendo digitado. */
export function StageResources({ cards }: { cards: StageCard[] }) {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12">
      {cards.map((card) => (
        <li key={card.key} className={SPAN[card.span] ?? "lg:col-span-4"}>
          <a
            href={card.path}
            className="group relative flex h-[268px] flex-col overflow-hidden rounded-2xl border-[0.67px] border-white/[0.08] bg-[rgba(18,15,23,0.45)] outline-none transition-colors hover:border-white/20 focus-visible:ring-2 focus-visible:ring-white/60 sm:h-[288px]"
          >
            <span aria-hidden className="relative flex-1 overflow-hidden">
              {/* Gradiente da seção, esmaecido: é o pano de fundo da composição,
                  não o assunto dela. */}
              <span
                className="absolute inset-0 opacity-[0.13] transition-opacity duration-500 group-hover:opacity-[0.2]"
                style={{ background: `radial-gradient(120% 90% at 50% 0%, ${card.cover[0]}, ${card.cover[1]} 70%, transparent)` }}
              />
              {card.visual}
              {/* Desvanecimento na base, para o visual não encostar no texto.
                  As paradas seguem uma curva de easing em vez de linear: o
                  gradiente linear cru deixa uma borda dura visível no ponto em
                  que ele começa. O plugin easing-gradients redistribui as
                  paradas e emite em oklch, que é o espaço do nosso Tailwind. */}
              <span className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-[rgba(18,15,23,0.95)] to-transparent gradient-ease-out" />
            </span>

            <span className="relative p-5">
              <span className="flex items-baseline gap-2">
                <span className="text-[15px] font-semibold text-white">{card.title}</span>
                <ArrowUpRight
                  size={13}
                  aria-hidden
                  className="shrink-0 translate-y-px text-white/50 opacity-0 transition-opacity group-hover:opacity-100"
                />
                {card.count ? (
                  <span className="ml-auto font-mono text-[11px] text-white/40">{card.count}</span>
                ) : null}
              </span>
              <span className="mt-1.5 block text-[13px] leading-[20px] text-white/50">{card.desc}</span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
