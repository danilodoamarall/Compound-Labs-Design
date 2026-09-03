import { SubscribeForm, type SubscribeLabels } from "./subscribe-form";

export type HowItWorksItem = {
  id: string;
  icon: string;
  color: string;
  title: string;
  desc: string;
};

/** Bloco no espírito do "How it works" do interfaces.dev: diz o que a inscrição
    dá, com que cadência sai coisa nova, e coloca o formulário logo em seguida. */
export function HowItWorks({
  title,
  dek,
  cadence,
  items,
  subscribeTitle,
  subscribeDek,
  subscribeLabels,
}: {
  title: string;
  dek: string;
  cadence: string;
  items: HowItWorksItem[];
  subscribeTitle: string;
  subscribeDek: string;
  subscribeLabels: SubscribeLabels;
}) {
  return (
    <section className="mx-auto w-full max-w-5xl px-5">
      <div className="rounded-xl border border-border bg-card p-6 sm:p-10">
        <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
        <p className="measure mt-4 text-lg leading-relaxed text-muted-foreground">{dek}</p>

        <ul className="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-3">
          {items.map((item) => (
            <li key={item.id}>
              <span
                aria-hidden
                className="inline-flex size-9 items-center justify-center rounded-lg border border-border font-mono text-[13px] font-semibold text-teal-deep"
              >
                {item.icon}
              </span>
              <h3 className="mt-4 font-medium leading-snug">{item.title}</h3>
              <p className="mt-1.5 text-[15px] leading-relaxed text-muted-foreground">{item.desc}</p>
            </li>
          ))}
        </ul>

        <p className="mt-10 border-t border-border pt-6 font-mono text-[11.5px] uppercase tracking-[0.12em] text-muted-foreground">
          {cadence}
        </p>

        <div className="mt-8">
          <h3 className="font-display text-2xl font-medium">{subscribeTitle}</h3>
          <p className="measure mt-2 text-muted-foreground">{subscribeDek}</p>
          <div className="mt-5 max-w-xl">
            <SubscribeForm labels={subscribeLabels} />
          </div>
        </div>
      </div>
    </section>
  );
}
