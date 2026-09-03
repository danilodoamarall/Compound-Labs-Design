import type { ReactNode } from "react";

export type SlideLayout = "title" | "text" | "chart" | "number" | "quote" | "question" | "list";

/** Uma seção do artigo. No modo leitura vira uma seção corrida; no modo
    apresentação vira um slide. O modo é decidido por CSS no Deck. */
export function Slide({
  title, kicker, layout = "text", notes, children,
}: {
  title?: string;
  kicker?: string;
  layout?: SlideLayout;
  notes?: string;
  children?: ReactNode;
}) {
  return (
    <section data-slide data-layout={layout} className="slide">
      <div className="slide-inner">
        {kicker ? <p className="slide-kicker eyebrow">{kicker}</p> : null}
        {title ? <h2 className="slide-title font-display">{title}</h2> : null}
        <div className="slide-body">{children}</div>
      </div>
      {notes ? <aside data-notes className="slide-notes">{notes}</aside> : null}
    </section>
  );
}
