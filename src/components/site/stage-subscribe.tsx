import { SubscribeForm, type SubscribeLabels } from "./subscribe-form";

/** O fecho do palco, no lugar do "Want to jam with us?" da referência: papel
    quadriculado, título centralizado com um rabisco sob uma palavra, e o
    formulário de inscrição que já existia.

    O quadriculado sai de dois repeating-linear-gradient, sem imagem nova. */
export function StageSubscribe({
  id,
  titleBefore,
  titleMark,
  titleAfter,
  dek,
  cadence,
  labels,
}: {
  id: string;
  titleBefore: string;
  titleMark: string;
  titleAfter: string;
  dek: string;
  cadence: string;
  labels: SubscribeLabels;
}) {
  return (
    <section id={id} className="stage-anchor relative w-full overflow-hidden px-6 py-16 sm:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.55]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, color-mix(in oklab, var(--stage-fg) 6%, transparent) 0 1px, transparent 1px 64px), repeating-linear-gradient(90deg, color-mix(in oklab, var(--stage-fg) 6%, transparent) 0 1px, transparent 1px 64px)",
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 50%, #000 30%, transparent 78%)",
        }}
      />

      <div className="mx-auto w-full max-w-[36rem] text-center">
        <h2 className="stage-h2 text-balance">
          {titleBefore}
          <span className="relative inline-block whitespace-nowrap">
            {titleMark}
            {/* Rabisco à mão sob a palavra, como o sublinhado do original. */}
            <svg
              aria-hidden
              viewBox="0 0 120 12"
              preserveAspectRatio="none"
              className="absolute -bottom-1 left-0 h-[10px] w-full"
              fill="none"
              stroke="#0b8a74"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <path d="M2 8.5c14-4 30-5.5 46-4.5s34 4.5 48 2.5" />
              <path d="M8 11c16-2.5 34-3 52-1.5" opacity="0.45" />
            </svg>
          </span>
          {titleAfter}
        </h2>

        <p className="mx-auto mt-6 max-w-[30rem] text-balance text-[17px] leading-[1.6] text-[var(--stage-dim)] sm:text-[20px] sm:leading-[32px]">
          {dek}
        </p>

        <div className="mx-auto mt-9 max-w-md text-left">
          <SubscribeForm labels={labels} />
        </div>

        <p className="mt-7 font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--stage-dim)]">
          {cadence}
        </p>
      </div>
    </section>
  );
}
