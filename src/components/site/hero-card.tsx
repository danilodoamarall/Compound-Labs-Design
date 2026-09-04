import { ArrowRight } from "lucide-react";
import { MoltenBackdrop } from "./molten-backdrop";
import { LabsMark } from "./logo";

export type HeroCta = { label: string; href: string };

/** O card do hero, com os valores medidos em reactbits.dev/pro:
 *      card raio 30px, overflow hidden
 *      linha de botões flex com gap 12, centralizada
 *      primário 46px de altura, padding 12/24, raio 12, fundo branco
 *      secundário mesma caixa, fundo branco a 7%
 *
 *  Sem contorno, sem desfoque, sem lente e sem caixa de medida. Aqueles efeitos
 *  vieram da página da Vercel e atrapalhavam a leitura do título: a palavra
 *  contornada era a mais difícil da página, e a desfocada era ilegível. O que
 *  ficou de efeito é o metal fundido, que é atmosfera atrás do texto e não
 *  interferência nele.
 *
 *  O véu escuro entre o canvas e o texto não é decoração: o metal tem partes
 *  claras, e sem ele o título perderia contraste sobre elas. */
export function HeroCard({
  badge,
  title,
  subtitle,
  primary,
  secondary,
  tertiary,
  curator,
  curatorRole,
  curatorHref,
}: {
  badge: string;
  title: string;
  subtitle: string;
  primary: HeroCta;
  secondary: HeroCta;
  /** Um terceiro caminho, discreto: texto com seta sob os botões. É a porta
   *  para quem chegou sem saber o que é um agente e precisa da documentação
   *  antes de qualquer comando. */
  tertiary?: HeroCta;
  curator: string;
  /** O cargo, ao lado do nome. */
  curatorRole?: string;
  /** Para onde o nome leva. O crédito tem de ir até a pessoa, não parar no texto. */
  curatorHref?: string;
}) {
  return (
    <section className="w-full px-4 pt-6 sm:px-6">
      <div className="relative isolate mx-auto flex w-full max-w-[1217px] flex-col items-center justify-center overflow-hidden rounded-[30px] px-6 py-16 text-center sm:py-20">
        <MoltenBackdrop className="-z-10" color1="#0b8a74" color2="#1f7a8c" color3="#c9571c" />

        {/* Véu com piso, não com desvanecimento até zero.
            Medi o caso anterior: na borda esquerda do título o alfa caía para
            0,32 e o contraste ia a 2,09:1, abaixo do mínimo. Contra metal branco
            puro, que é o pior fundo possível, o subtítulo de 18px exige alfa
            0,57 para chegar aos 4,5:1 de texto normal. O piso é 0,62, que dá
            5,41:1 e ainda deixa as fagulhas do metal aparecerem. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{ background: "radial-gradient(120% 100% at 50% 45%, rgba(10,10,10,0.82), rgba(10,10,10,0.70) 60%, rgba(10,10,10,0.62))" }}
        />

        <p className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] px-3 py-1 text-[13px] text-white/70 backdrop-blur-sm">
          <LabsMark size={16} idPrefix="hero" />
          {badge}
        </p>

        <h1 className="stage-h1 mt-7 max-w-[34rem] text-balance text-[#FAFAFA]">{title}</h1>

        <p className="mt-6 max-w-[540px] text-balance text-[16px] leading-[26px] text-[#EDEDED] sm:text-[18px] sm:leading-[28px]">
          {subtitle}
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <a
            href={primary.href}
            className="inline-flex h-[46px] items-center gap-2 rounded-xl bg-white px-6 text-[14px] font-medium text-[#120F17] outline-hidden transition-colors hover:bg-white/90 focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0A]"
          >
            {primary.label}
            <ArrowRight size={15} aria-hidden />
          </a>
          <a
            href={secondary.href}
            className="inline-flex h-[46px] items-center rounded-xl bg-white/[0.07] px-6 text-[14px] font-medium text-white outline-hidden transition-colors hover:bg-white/[0.12] focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0A]"
          >
            {secondary.label}
          </a>
        </div>

        {tertiary ? (
          <a
            href={tertiary.href}
            className="mt-5 inline-flex items-center gap-1.5 text-[13.5px] text-white/60 underline decoration-white/20 underline-offset-4 outline-hidden transition-colors hover:text-white hover:decoration-white/50 focus-visible:rounded focus-visible:ring-2 focus-visible:ring-white/70"
          >
            {tertiary.label}
            <ArrowRight size={13} aria-hidden />
          </a>
        ) : null}

        <p className="mt-8 text-[13px] text-white/70">
          {curatorHref ? (
            <a
              href={curatorHref}
              target="_blank"
              rel="noreferrer me"
              className="text-white/70 underline decoration-white/25 underline-offset-4 transition-colors hover:text-white hover:decoration-white/60"
            >
              {curator}
            </a>
          ) : (
            curator
          )}
          {curatorRole ? (
            <>
              <span aria-hidden className="mx-2 text-white/25">·</span>
              {curatorRole}
            </>
          ) : null}
        </p>
      </div>
    </section>
  );
}
