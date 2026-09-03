import { ArrowUpRight } from "lucide-react";
import { LabsMark } from "./logo";

export type AuthorLink = { id: string; label: string; desc: string; url: string };

/** Bio em primeira pessoa, no fim da página, como no interfaces.dev: depois de
    ler o conteúdo, o leitor descobre quem escreveu e onde achar mais. */
export function AuthorCard({
  greeting,
  paragraphs,
  links,
  role,
}: {
  greeting: string;
  paragraphs: string[];
  links: AuthorLink[];
  role: string;
}) {
  return (
    <section className="mx-auto w-full max-w-5xl px-5">
      <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <div>
          <LabsMark size={44} idPrefix="aut" />
          <h2 className="font-display mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">{greeting}</h2>
          <p className="mt-2 text-muted-foreground">{role}</p>
        </div>

        <div>
          <div className="space-y-4">
            {paragraphs.map((p, i) => (
              <p key={i} className="text-[17px] leading-relaxed text-muted-foreground">{p}</p>
            ))}
          </div>

          <ul className="mt-8 divide-y divide-border border-y border-border">
            {links.map((link) => (
              <li key={link.id}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-baseline gap-3 py-3.5 transition-colors hover:text-teal-deep"
                >
                  <span className="font-medium">{link.label}</span>
                  <ArrowUpRight size={13} aria-hidden className="shrink-0 translate-y-px text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  <span className="ml-auto text-right text-sm text-muted-foreground">{link.desc}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
