"use client";

import Link from "next/link";
import SplitText from "@/components/reactbits/SplitText";
import DotGrid from "@/components/reactbits/DotGrid";
import CountUp from "@/components/reactbits/CountUp";
import AnimatedContent from "@/components/reactbits/AnimatedContent";

export type HeroNumber = { key: string; value: number; unit: string; label: string; decimals: number };

export function HomeHero({ eyebrow, title, dek, ctaArticles, ctaRadar, hrefArticles, hrefRadar, numbers, numbersSource, author, authorRole, madeBy, locale }: {
  eyebrow: string; title: string; dek: string; ctaArticles: string; ctaRadar: string; hrefArticles: string; hrefRadar: string;
  numbers: HeroNumber[]; numbersSource: string; author: string; authorRole: string; madeBy: string; locale: "pt" | "en";
}) {
  return (
    <section className="relative isolate overflow-hidden border-b border-border">
      <div className="pointer-events-auto absolute inset-0 -z-10 opacity-[0.55] dark:opacity-40" aria-hidden>
        <DotGrid dotSize={3} gap={22} baseColor="#b8c2bf" activeColor="#0b8a74" proximity={110} shockRadius={220} shockStrength={4} resistance={700} returnDuration={1.4} />
      </div>
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,transparent_35%,var(--background)_78%)]" aria-hidden />
      <div className="relative mx-auto w-full max-w-6xl px-5 pb-16 pt-20 sm:pt-28">
        <p className="eyebrow">{eyebrow}</p>
        <SplitText
          text={title}
          tag="h1"
          className="font-display mt-5 max-w-4xl text-[2.6rem] font-semibold leading-[1.02] sm:text-6xl md:text-7xl"
          splitType="words"
          delay={40}
          duration={0.8}
          ease="power3.out"
          from={{ opacity: 0, y: 24 }}
          to={{ opacity: 1, y: 0 }}
          textAlign="left"
        />
        <AnimatedContent distance={24} duration={0.8} delay={0.35} ease="power3.out" initialOpacity={0}>
          <p className="font-display mt-7 max-w-2xl text-xl leading-snug text-muted-foreground sm:text-2xl">{dek}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href={hrefArticles} className="inline-flex items-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90">{ctaArticles}</Link>
            <Link href={hrefRadar} className="inline-flex items-center rounded-md border border-border bg-card px-5 py-2.5 text-sm font-medium hover:bg-accent">{ctaRadar}</Link>
          </div>
          <p className="mt-10 text-sm text-muted-foreground">
            {madeBy} <span className="font-medium text-foreground">{author}</span> · {authorRole}
          </p>
        </AnimatedContent>

        <AnimatedContent distance={24} duration={0.8} delay={0.6} ease="power3.out" initialOpacity={0}>
          <div className="mt-16 grid gap-6 border-t border-border pt-8 sm:grid-cols-2 lg:grid-cols-4">
            {numbers.map((n) => (
              <div key={n.key}>
                <div className="text-4xl font-semibold leading-none tracking-tight sm:text-5xl">
                  <CountUp to={n.value} from={0} duration={1.6} locale={locale === "pt" ? "pt-BR" : "en-US"} className="inline" />
                  <span className="ml-0.5 text-2xl font-medium text-muted-foreground">{n.unit}</span>
                </div>
                <p className="mt-2 max-w-[26ch] text-sm leading-snug text-muted-foreground">{n.label}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 font-mono text-[11px] text-muted-foreground">{numbersSource}</p>
        </AnimatedContent>
      </div>
    </section>
  );
}
