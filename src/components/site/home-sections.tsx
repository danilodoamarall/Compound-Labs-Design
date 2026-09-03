"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import MagicBento from "@/components/reactbits/MagicBento";
import Dock from "@/components/reactbits/Dock";

export type SectionCard = {
  key: string;
  title: string;
  description: string;
  label: string;
  color: string;
  path: string;
  icon: string;
};

/** Grade bento com as seções, mais um dock fixo para pular entre elas de
    qualquer ponto da home. O bento mostra e explica; o dock navega. */
export function HomeSections({
  cards,
  dockLabel,
}: {
  cards: SectionCard[];
  dockLabel: string;
}) {
  const router = useRouter();

  useEffect(() => {
    for (const c of cards) router.prefetch(c.path);
  }, [router, cards]);

  return (
    <>
      <MagicBento
        cards={cards.map((c) => ({
          color: c.color,
          title: c.title,
          description: c.description,
          label: c.label,
          href: c.path,
        }))}
        enableStars
        enableSpotlight
        enableBorderGlow
        enableTilt={false}
        enableMagnetism={false}
        clickEffect
        spotlightRadius={280}
        particleCount={8}
        glowColor="34, 161, 140"
        textAutoHide={false}
      />

      <nav aria-label={dockLabel} className="pointer-events-none fixed inset-x-0 bottom-0 z-30 hidden md:block">
        <Dock
          items={cards.map((c) => ({
            icon: <span aria-hidden className="text-[15px] font-semibold">{c.icon}</span>,
            label: c.title,
            onClick: () => router.push(c.path),
            className: "pointer-events-auto",
          }))}
          panelHeight={62}
          baseItemSize={42}
          magnification={64}
          distance={160}
          className="pointer-events-auto border-border bg-card/95 backdrop-blur"
        />
      </nav>
    </>
  );
}
