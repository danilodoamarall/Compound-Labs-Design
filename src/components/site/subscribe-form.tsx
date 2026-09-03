"use client";

import { useState } from "react";
import { ArrowRight, Check, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";

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

type State = "idle" | "sending" | "done" | "error";

export function SubscribeForm({ labels }: { labels: SubscribeLabels }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");
  const [message, setMessage] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (state === "sending") return;

    setState("sending");
    setMessage("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setState("done");
        setMessage(labels.success);
        setEmail("");
        return;
      }

      const { error } = (await res.json().catch(() => ({}))) as { error?: string };
      setState("error");
      setMessage(
        error === "invalid"
          ? labels.errorInvalid
          : error === "not_configured"
            ? labels.errorNotConfigured
            : labels.errorGeneric,
      );
    } catch {
      setState("error");
      setMessage(labels.errorGeneric);
    }
  }

  if (state === "done") {
    return (
      <p className="flex items-center gap-2.5 rounded-md border border-teal/40 bg-accent px-4 py-3 text-[15px] text-accent-foreground">
        <Check size={16} aria-hidden className="shrink-0" />
        {message}
      </p>
    );
  }

  return (
    <form onSubmit={submit} noValidate>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          type="email"
          value={email}
          onValueChange={setEmail}
          placeholder={labels.placeholder}
          aria-label={labels.placeholder}
          aria-invalid={state === "error"}
          required
          startAdornment={<Mail size={15} aria-hidden />}
          wrapperClassName="flex-1"
        />
        <button
          type="submit"
          disabled={state === "sending"}
          className="inline-flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {state === "sending" ? labels.sending : labels.cta}
          {state !== "sending" ? <ArrowRight size={15} aria-hidden /> : null}
        </button>
      </div>

      <p className="mt-3 text-[13px] text-muted-foreground" aria-live="polite">
        {state === "error" ? <span className="text-warm">{message}</span> : labels.privacy}
      </p>
    </form>
  );
}
