import type { ReactNode } from "react";

/** Moldura comum das seções do palco, com os valores medidos na referência:
    container de 1185px, h2 de 40px/48px com tracking -2.4px, e subtítulo de
    20px/36px em #A1A1A1 limitado a 480px.

    Cada seção carrega o próprio h2, o que conserta de passagem os cabeçalhos
    órfãos que a auditoria apontou na grade e no carrossel antigos. */
export function StageSection({
  id,
  title,
  dek,
  children,
  headingExtra,
}: {
  id: string;
  title: ReactNode;
  dek?: string;
  children: ReactNode;
  headingExtra?: ReactNode;
}) {
  return (
    <section id={id} className="stage-anchor relative w-full px-5 py-20 sm:py-28">
      <div className="mx-auto w-full max-w-[1185px]">
        <div className="relative">
          {headingExtra}
          <h2 className="stage-h2 relative max-w-[46rem] text-balance">{title}</h2>
          {dek ? (
            <p className="relative mt-4 max-w-[540px] text-[16px] leading-[26px] text-[var(--stage-dim)] sm:text-[18px] sm:leading-[28px]">
              {dek}
            </p>
          ) : null}
        </div>
        <div className="mt-12 sm:mt-16">{children}</div>
      </div>
    </section>
  );
}
