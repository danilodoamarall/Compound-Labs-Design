"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

/** Alterna o tema. Os dois ícones ficam no DOM, empilhados, e o `.dark` no
 *  <html> (posto pelo next-themes antes da pintura) decide qual aparece via CSS.
 *
 *  Antes o botão nascia vazio até o JS montar e depois trocava por corte seco:
 *  um buraco no cabeçalho a cada carga. Assim não há estado vazio nem salto. */
export function ThemeToggle({ label }: { label: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label={label}
      className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
    >
      <span className="relative grid size-[18px] place-items-center">
        <Moon size={18} aria-hidden className="col-start-1 row-start-1 transition-opacity duration-200 dark:opacity-0" />
        <Sun size={18} aria-hidden className="col-start-1 row-start-1 opacity-0 transition-opacity duration-200 dark:opacity-100" />
      </span>
    </button>
  );
}
