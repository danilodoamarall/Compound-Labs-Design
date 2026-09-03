import { Star } from "lucide-react";
import { githubRepo, githubUrl } from "@/lib/site";

/** Contagem de estrelas do repositório. Revalida a cada 6 horas; se a chamada
    falhar ou o repositório não estiver configurado, o botão vira só um link. */
async function starCount(): Promise<number | null> {
  if (!githubRepo) return null;
  try {
    const res = await fetch(`https://api.github.com/repos/${githubRepo}`, {
      headers: { Accept: "application/vnd.github+json" },
      next: { revalidate: 21600 },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { stargazers_count?: number };
    return typeof data.stargazers_count === "number" ? data.stargazers_count : null;
  } catch {
    return null;
  }
}

export async function GithubStar({ label }: { label: string }) {
  const stars = await starCount();
  return (
    <a
      href={githubUrl}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="inline-flex h-9 items-center gap-2 rounded-full border border-border bg-card px-3 text-sm text-muted-foreground transition-colors hover:border-teal/50 hover:text-foreground"
    >
      <svg viewBox="0 0 16 16" aria-hidden className="size-4 fill-current">
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
      </svg>
      <Star size={14} className="text-muted-foreground" />
      {stars !== null ? <span className="tabular text-foreground">{stars}</span> : null}
    </a>
  );
}
