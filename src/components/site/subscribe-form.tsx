"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, Check } from "lucide-react";

export type SubscribeLabels = {
  placeholder: string;
  cta: string;
  sending: string;
  success: string;
  errorInvalid: string;
  errorGeneric: string;
  errorNotConfigured: string;
  privacy: string;
};

type Estado = "idle" | "sending" | "success" | "error";

/** O formulário de inscrição. Fala com /api/subscribe e traduz o código de erro
 *  da rota para uma frase: 400 é e-mail inválido, 503 é a integração ainda não
 *  instalada, e o resto é falha genérica. Nunca finge sucesso.
 *
 *  A mensagem de sucesso é a que a rota consegue honrar: o contato foi guardado.
 *  Não promete e-mail de confirmação, porque nenhum é enviado. */
export function SubscribeForm({ labels }: { labels: SubscribeLabels }) {
  const [email, setEmail] = useState("");
  const [estado, setEstado] = useState<Estado>("idle");
  const [erro, setErro] = useState<string | null>(null);

  const enviar = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (estado === "sending") return;
    setEstado("sending");
    setErro(null);

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      if (res.ok) {
        setEstado("success");
        return;
      }

      const corpo = (await res.json().catch(() => ({}))) as { error?: string };
      const mensagem =
        res.status === 400 || corpo.error === "invalid"
          ? labels.errorInvalid
          : res.status === 503 || corpo.error === "not_configured"
            ? labels.errorNotConfigured
            : labels.errorGeneric;
      setErro(mensagem);
      setEstado("error");
    } catch {
      setErro(labels.errorGeneric);
      setEstado("error");
    }
  };

  if (estado === "success") {
    return (
      <p role="status" className="flex items-center gap-2 rounded-lg border border-white/[0.12] bg-white/[0.05] px-4 py-3 text-[15px] text-[#EDEDED]">
        <Check size={16} aria-hidden className="shrink-0 text-teal" />
        {labels.success}
      </p>
    );
  }

  return (
    <form onSubmit={enviar} noValidate className="space-y-3">
      <div className="flex gap-2">
        <label className="sr-only" htmlFor="subscribe-email">{labels.placeholder}</label>
        <input
          id="subscribe-email"
          type="email"
          name="email"
          autoComplete="email"
          inputMode="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={labels.placeholder}
          aria-invalid={estado === "error" ? true : undefined}
          aria-describedby={erro ? "subscribe-erro" : undefined}
          className="h-[46px] min-w-0 flex-1 rounded-xl border border-white/[0.14] bg-white/[0.06] px-4 text-[15px] text-[#EDEDED] outline-none placeholder:text-white/40 focus-visible:ring-2 focus-visible:ring-white/60"
        />
        <button
          type="submit"
          disabled={estado === "sending"}
          className="inline-flex h-[46px] shrink-0 items-center gap-2 rounded-xl bg-white px-5 text-[15px] font-medium text-[#120F17] transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {estado === "sending" ? labels.sending : labels.cta}
          <ArrowRight size={15} aria-hidden />
        </button>
      </div>

      {erro ? (
        <p id="subscribe-erro" role="alert" className="text-[13.5px] text-[#f0a48a]">
          {erro}
        </p>
      ) : (
        <p className="text-[12.5px] text-white/45">{labels.privacy}</p>
      )}
    </form>
  );
}
