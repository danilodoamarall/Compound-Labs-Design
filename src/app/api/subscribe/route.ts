import { NextResponse } from "next/server";

/** Inscrição na lista. Guarda o contato numa audiência do Resend.
 *
 *  As variáveis vêm da integração da Vercel, nunca escritas à mão:
 *  RESEND_API_KEY e RESEND_AUDIENCE_ID. Enquanto a integração não estiver
 *  instalada, a rota responde 503 com um código que a interface sabe traduzir,
 *  em vez de fingir sucesso. */

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Limite por IP, na memória do processo. Não sobrevive a um restart nem é
 *  compartilhado entre instâncias, e isso basta: serve para conter repetição
 *  boba de formulário, não ataque distribuído. */
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5_000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  let email: unknown;
  try {
    ({ email } = await request.json());
  } catch {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  if (typeof email !== "string" || !EMAIL.test(email.trim()) || email.length > 254) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (!apiKey || !audienceId) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  try {
    const res = await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim().toLowerCase(), unsubscribed: false }),
    });

    // Um e-mail já inscrito não é erro para quem está do outro lado do formulário.
    if (!res.ok && res.status !== 409) {
      console.error("resend contact failed", res.status);
      return NextResponse.json({ error: "upstream" }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("resend request threw", error);
    return NextResponse.json({ error: "upstream" }, { status: 502 });
  }
}
