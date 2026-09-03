"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CoverFlow, type CoverFlowItem, type RenderImageProps } from "@/components/ui/coverflow";

export type HomeSection = {
  key: string;
  path: string;
  title: string;
  subtitle: string;
  cover: [string, string];
};

/** Capa desenhada em CSS, sem arquivo de imagem: gradiente da seção, o nome do
    hub em cima e o título da seção grande, como numa capa de disco. */
function Cover({ section, label }: { section: HomeSection; label: string }) {
  return (
    <div
      className="pointer-events-none relative flex h-full w-full select-none flex-col justify-start p-6 sm:p-7"
      style={{ background: `linear-gradient(150deg, ${section.cover[0]} 0%, ${section.cover[1]} 100%)` }}
    >
      <span className="text-[12px] font-medium tracking-wide text-white/65 sm:text-[13px]">{label}</span>
      <span className="mt-2.5 text-[26px] font-semibold leading-[1.05] tracking-tight text-white [text-wrap:balance] sm:text-[34px]">
        {section.title}
      </span>
      <span
        aria-hidden
        className="absolute -right-10 -bottom-12 size-40 rounded-full bg-white/10 blur-[2px]"
      />
    </div>
  );
}

export function HomeCoverFlow({
  sections,
  initialIndex = 0,
  label,
  hint,
}: {
  sections: HomeSection[];
  initialIndex?: number;
  label: string;
  hint: string;
}) {
  const router = useRouter();
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 700px)");
    const apply = () => setCompact(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    for (const s of sections) router.prefetch(s.path);
  }, [router, sections]);

  const items: CoverFlowItem[] = sections.map((s) => ({
    id: s.key,
    image: s.key,
    title: s.title,
    subtitle: s.subtitle,
  }));

  const renderImage = (props: RenderImageProps) => {
    const section = sections.find((s) => s.key === props.src);
    return section ? <Cover section={section} label={label} /> : null;
  };

  return (
    <div className="flex flex-col items-center">
      {/* A altura tem de vir deste pai. Passá-la pelo className do CoverFlow não
          é confiável, porque o h-full dele pode vencer na ordem do Tailwind. E
          ela precisa sobrar: o componente ancora a própria legenda em bottom-8
          dentro do contêiner, então uma altura curta joga o texto sobre as
          capas. A reflexão fica desligada: ela escapa do overflow por causa do
          preserve-3d e só caberia sob a legenda num carrossel de 728px. */}
      <div className="h-[440px] w-full sm:h-[520px]">
        <CoverFlow
          items={items}
          itemWidth={compact ? 210 : 300}
          itemHeight={compact ? 210 : 300}
          centerGap={compact ? 140 : 200}
          stackSpacing={compact ? 58 : 84}
          rotation={46}
          initialIndex={initialIndex}
          enableClickToSnap
          renderImage={renderImage}
          onItemClick={(item) => {
            // O CoverFlow só chama isto para a capa que já está no centro: o
            // primeiro clique numa capa lateral apenas a traz para o meio.
            const section = sections.find((s) => s.key === item.id);
            if (section) router.push(section.path);
          }}
          className="w-full"
        />
      </div>

      <p className="mt-1 text-center font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground/70 sm:text-[11.5px]">
        {hint}
      </p>
    </div>
  );
}
