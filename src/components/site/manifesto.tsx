import { LabsMark } from "./logo";

/** O manifesto: a tese antes do catálogo. É o bloco que faz o leitor entender
    por que o hub existe, no lugar de receber uma lista de 57 itens de saída. */
export function Manifesto({
  question,
  paragraphs,
  signature,
  role,
}: {
  question: string;
  paragraphs: string[];
  signature: string;
  role: string;
}) {
  return (
    <section className="mx-auto w-full max-w-3xl px-5">
      <h2 className="font-display text-3xl font-medium leading-tight tracking-tight sm:text-[2.5rem]">
        {question}
      </h2>

      <div className="mt-8 space-y-5">
        {paragraphs.map((p, i) => (
          <p
            key={i}
            className={
              i === 0
                ? "text-xl leading-relaxed text-foreground sm:text-[1.35rem]"
                : "text-lg leading-relaxed text-muted-foreground"
            }
          >
            {p}
          </p>
        ))}
      </div>

      <p className="mt-8 flex items-center gap-2.5 text-sm text-muted-foreground">
        <LabsMark size={20} idPrefix="mnf" />
        <span className="font-medium text-foreground">{signature}</span>
        <span className="text-muted-foreground/60">·</span>
        {role}
      </p>
    </section>
  );
}
