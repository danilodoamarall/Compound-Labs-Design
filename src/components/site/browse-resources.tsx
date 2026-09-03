"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { TAG_ORDER, TAG_DOT, type Resource, type ResourceTag, type BrowseLabels } from "@/lib/resources";

function normalize(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

export function BrowseResources({ resources, labels }: { resources: Resource[]; labels: BrowseLabels }) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<ResourceTag[]>([]);
  const deferred = useDeferredValue(query);

  const available = useMemo(() => {
    const present = new Set<ResourceTag>();
    resources.forEach((r) => r.tags.forEach((t) => present.add(t)));
    return TAG_ORDER.filter((t) => present.has(t));
  }, [resources]);

  const counts = useMemo(() => {
    const c = {} as Record<ResourceTag, number>;
    available.forEach((t) => { c[t] = resources.filter((r) => r.tags.includes(t)).length; });
    return c;
  }, [resources, available]);

  const filtered = useMemo(() => {
    const q = normalize(deferred.trim());
    return resources.filter((r) => {
      if (active.length && !active.some((t) => r.tags.includes(t))) return false;
      if (!q) return true;
      return normalize(`${r.name} ${r.desc} ${r.meta}`).includes(q);
    });
  }, [resources, deferred, active]);

  const toggle = (tag: ResourceTag) =>
    setActive((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));

  const dirty = active.length > 0 || query.length > 0;

  return (
    <section className="mx-auto w-full max-w-5xl px-5">
      <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
        {labels.heading} <em className="font-normal italic">{labels.headingAccent}</em>
      </h2>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <div className="relative">
          <Search size={15} aria-hidden className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={labels.searchPlaceholder}
            aria-label={labels.searchPlaceholder}
            className="h-10 w-[min(100%,17rem)] rounded-md border border-border bg-card pl-9 pr-3 text-[15px] outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-teal"
          />
        </div>

        {available.map((tag) => {
          const on = active.includes(tag);
          return (
            <button
              key={tag}
              type="button"
              onClick={() => toggle(tag)}
              aria-pressed={on}
              className={`inline-flex h-10 items-center gap-2 rounded-md border px-3.5 text-[15px] transition-colors ${
                on ? "border-teal bg-accent text-accent-foreground" : "border-border bg-card text-foreground hover:border-teal/50"
              }`}
            >
              <span aria-hidden className="size-2 rounded-full" style={{ background: TAG_DOT[tag] }} />
              {labels.tags[tag]}
              <span className="font-mono text-[11px] text-muted-foreground tabular">{counts[tag]}</span>
            </button>
          );
        })}

        {dirty ? (
          <button
            type="button"
            onClick={() => { setActive([]); setQuery(""); }}
            className="inline-flex h-10 items-center gap-1.5 rounded-md border border-transparent px-3 text-[15px] text-muted-foreground transition-colors hover:text-foreground"
          >
            <X size={14} aria-hidden />
            {labels.clearAll}
          </button>
        ) : null}
      </div>

      <p className="mt-4 font-mono text-[11.5px] uppercase tracking-[0.12em] text-muted-foreground" aria-live="polite">
        {dirty
          ? labels.countFiltered.replace("{n}", String(filtered.length)).replace("{total}", String(resources.length))
          : labels.countAll.replace("{total}", String(resources.length))}
      </p>

      {filtered.length === 0 ? (
        <p className="mt-10 text-muted-foreground">{labels.empty}</p>
      ) : (
        <ul className="mt-4">
          {filtered.map((r) => (
            <li key={r.key}>
              <a
                href={r.href}
                target={r.external ? "_blank" : undefined}
                rel={r.external ? "noreferrer" : undefined}
                className="group flex items-baseline gap-3 rounded-md px-2 py-2 transition-colors hover:bg-wash"
              >
                <span aria-hidden className="size-2 shrink-0 self-center rounded-full" style={{ background: TAG_DOT[r.tags[0]] }} />
                <span className="min-w-0 flex-1 truncate">
                  <span className="font-medium group-hover:text-teal-deep">{r.name}</span>
                  {r.desc ? (
                    <>
                      <span aria-hidden className="mx-1.5 text-muted-foreground/50">•</span>
                      <span className="text-muted-foreground">{r.desc}</span>
                    </>
                  ) : null}
                </span>
                <span aria-hidden className="hidden w-16 shrink-0 self-center border-b border-dotted border-border sm:block" />
                <span className="shrink-0 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">{r.meta}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
