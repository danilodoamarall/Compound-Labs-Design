"use client";

import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";

/** Um comando com botão de copiar.
 *
 *  O `$` fica fora do texto copiado: é marca de prompt, não parte do comando, e
 *  colar um `$` no terminal é um erro chato de diagnosticar. */
export function CopyCommand({ command, copyLabel }: { command: string; copyLabel: string }) {
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    if (!copiado) return;
    const id = setTimeout(() => setCopiado(false), 2000);
    return () => clearTimeout(id);
  }, [copiado]);

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopiado(true);
    } catch {
      // Sem permissão de área de transferência não há o que fazer além de não
      // mentir dizendo que copiou. O texto continua selecionável.
      setCopiado(false);
    }
  };

  return (
    <div className="flex items-center gap-2 overflow-hidden rounded-lg border border-border bg-card">
      <pre className="min-w-0 flex-1 overflow-x-auto px-4 py-3 font-mono text-[13px] leading-relaxed">
        <code>
          <span aria-hidden className="select-none text-muted-foreground">$ </span>
          {command}
        </code>
      </pre>
      <button
        type="button"
        onClick={copiar}
        aria-label={copyLabel}
        className="mr-2 shrink-0 rounded-md p-2 text-muted-foreground outline-hidden transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
      >
        {copiado ? <Check size={14} aria-hidden /> : <Copy size={14} aria-hidden />}
      </button>
    </div>
  );
}
