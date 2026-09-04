"use client";

import { ArrowUpRight } from "lucide-react";
import {
  SetupChecklist,
  SetupChecklistAction,
  SetupChecklistCard,
  SetupChecklistDescription,
  SetupChecklistHeader,
  SetupChecklistItem,
  SetupChecklistList,
  SetupChecklistProgress,
  SetupChecklistTitle,
} from "@/components/ui/setup-checklist";
import { CodeBlock } from "@/components/ui/code-block";

export type PersonaStep = { id: string; title: string; page: string; href: string };

export type HowToPersonaProps = {
  id: string;
  role: string;
  gain: string;
  /** Par de cores da seção de destino, para o ponto ao lado do papel. */
  cor: [string, string];
  steps: PersonaStep[];
  code?: string;
  cta: { label: string; href: string };
  labels: { progress: string; steps: string; pathPages: string };
};

/** Um papel, um cartão. A estrutura é o Setup Checklist do Iconiq UI, usado
 *  como ele vem: cartão com entrada em mola, itens em cascata que a pessoa
 *  marca como feitos (com o traço do check se desenhando), progresso em pizza
 *  e a ação no rodapé. O comando, quando há, é o Code Block do mesmo registro.
 *
 *  Os itens do checklist são botões, e um link dentro de um botão é HTML
 *  inválido; por isso os destinos ficam numa linha própria abaixo da lista, e a
 *  ação principal do papel vai no rodapé do cartão. */
export function HowToPersona({ id, role, gain, cor, steps, code, cta, labels }: HowToPersonaProps) {
  const paginas = Array.from(new Map(steps.map((s) => [s.href, s.page])).entries());

  return (
    <SetupChecklist className="h-full max-w-none">
      <SetupChecklistCard className="flex h-full min-w-0 flex-col p-6 sm:p-8">
        <SetupChecklistHeader>
          <p className="flex items-center gap-2">
            <span
              aria-hidden
              className="size-2 shrink-0 rounded-full"
              style={{ background: `linear-gradient(150deg, ${cor[0]}, ${cor[1]})` }}
            />
            <span className="eyebrow">{role}</span>
          </p>
          <SetupChecklistTitle className="font-display mt-3 text-[22px] font-semibold leading-snug tracking-tight text-balance">
            {gain}
          </SetupChecklistTitle>
          <SetupChecklistDescription className="mt-2 text-[13px]">{labels.steps}</SetupChecklistDescription>
        </SetupChecklistHeader>

        <SetupChecklistList>
          {steps.map((s, i) => (
            <SetupChecklistItem
              key={s.id}
              id={`${id}-${s.id}`}
              icon={<span className="font-mono text-[11.5px] tabular-nums text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>}
              title={<span className="text-[15px] leading-[24px]">{s.title}</span>}
              description={<span className="font-mono text-[11.5px] uppercase tracking-[0.08em]">{s.page}</span>}
            />
          ))}
        </SetupChecklistList>

        {/* Os destinos dos passos, como links de verdade. */}
        <p className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-[13px] text-muted-foreground">
          <span className="eyebrow">{labels.pathPages}</span>
          {paginas.map(([href, page]) => (
            <a
              key={href}
              href={href}
              className="inline-flex items-center gap-0.5 text-teal-deep underline decoration-teal-deep/30 underline-offset-4 transition-colors hover:decoration-teal-deep"
            >
              {page}
              <ArrowUpRight size={12} aria-hidden />
            </a>
          ))}
        </p>

        {code ? (
          <div className="mt-5 min-w-0 max-w-full">
            <CodeBlock code={code} language="bash" showLineNumbers={false} />
          </div>
        ) : null}

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-6">
          <SetupChecklistProgress className="mt-0 justify-start">{labels.progress}</SetupChecklistProgress>
          <SetupChecklistAction className="mt-0">
            <a
              href={cta.href}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-foreground px-4 text-[14px] font-medium text-background outline-hidden transition-[opacity,scale] duration-150 hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.96]"
            >
              {cta.label}
              <ArrowUpRight size={14} aria-hidden />
            </a>
          </SetupChecklistAction>
        </div>
      </SetupChecklistCard>
    </SetupChecklist>
  );
}
