"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

const subscribeNothing = () => () => {};

export function ThemeToggle({ label }: { label: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  // O tema só é conhecido no cliente. useSyncExternalStore devolve false no
  // servidor e na primeira renderização, evitando divergência de hidratação
  // sem precisar de setState dentro de um efeito.
  const mounted = useSyncExternalStore(subscribeNothing, () => true, () => false);
  const dark = mounted && resolvedTheme === "dark";
  return (
    <button
      type="button"
      onClick={() => setTheme(dark ? "light" : "dark")}
      aria-label={label}
      className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
    >
      {mounted ? (dark ? <Sun size={18} /> : <Moon size={18} />) : <span className="size-[18px]" />}
    </button>
  );
}
