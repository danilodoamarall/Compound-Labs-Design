"use client";

import { useState, type ReactNode } from "react";
import SpotlightCard from "@/components/reactbits/SpotlightCard";

export type CatalogItem = {
  key: string;
  name: string;
  group: string;
  draft: boolean;
  badge?: string;
  body: ReactNode;
  footer?: ReactNode;
};

export function Catalog({ items, groups, groupLabels, allLabel, filterLabel, draftLabel }: {
  items: CatalogItem[];
  groups: string[];
  groupLabels: Record<string, string>;
  allLabel: string;
  filterLabel: string;
  draftLabel: string;
}) {
  const [group, setGroup] = useState<string | null>(null);
  const visible = items.filter((i) => !group || i.group === group);
  return (
    <div>
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label={filterLabel}>
        <span className="mr-1 font-mono text-xs uppercase tracking-wide text-muted-foreground">{filterLabel}</span>
        <button type="button" onClick={() => setGroup(null)} aria-pressed={!group} className={`rounded-full border px-3 py-1 text-sm ${!group ? "border-teal bg-accent text-accent-foreground" : "border-border text-muted-foreground hover:text-foreground"}`}>{allLabel}</button>
        {groups.map((g) => (
          <button key={g} type="button" onClick={() => setGroup(group === g ? null : g)} aria-pressed={group === g} className={`rounded-full border px-3 py-1 text-sm ${group === g ? "border-teal bg-accent text-accent-foreground" : "border-border text-muted-foreground hover:text-foreground"}`}>{groupLabels[g] ?? g}</button>
        ))}
      </div>
      <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((i) => (
          <li key={i.key} className="min-w-0">
            <SpotlightCard className="h-full !rounded-lg !border-border !bg-card !p-5 text-card-foreground" spotlightColor="rgba(11, 138, 116, 0.18)">
              <div className="flex items-start gap-2">
                <h3 className="text-lg font-semibold leading-snug">{i.name}</h3>
                <span className="ml-auto shrink-0 rounded bg-secondary px-1.5 py-0.5 font-mono text-[10.5px] uppercase tracking-wide text-secondary-foreground">{groupLabels[i.group] ?? i.group}</span>
              </div>
              {i.badge ? <p className="mt-1 font-mono text-xs text-muted-foreground">{i.badge}</p> : null}
              <div className="mt-3 text-sm leading-relaxed text-muted-foreground">{i.body}</div>
              {i.footer ? <div className="mt-4 border-t border-border pt-3 text-sm">{i.footer}</div> : null}
              {i.draft ? <p className="mt-3 inline-block rounded bg-warm/15 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-warm">{draftLabel}</p> : null}
            </SpotlightCard>
          </li>
        ))}
      </ul>
    </div>
  );
}
