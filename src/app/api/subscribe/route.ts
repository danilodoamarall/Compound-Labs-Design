import { NextResponse } from "next/server";
import { clientIp, rateLimited } from "@/lib/rate-limit";

/** Inscrição na lista. Guarda o contato numa audiência do Resend.
 *
 *  As variáveis vêm da integração da Vercel, nunca escritas à mão:
 *  RESEND_API_KEY e RESEND_AUDIENCE_ID. Enquanto a integração não estiver
 *  instalada, a rota responde 503 com um código que a interface sabe traduzir,
 *  em vez de fingir sucesso. */

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Cinco inscrições por minuto por IP. Segura repetição boba de formulário, não
 *  ataque distribuído: a contagem vive na memória da instância.
 *
 *  A implementação saiu daqui para `@/lib/rate-limit`, porque o servidor MCP
 *  precisa da mesma coisa. A versão compartilhada também corrige um defeito que
 *  estava nesta: ao passar de 5000 IPs, a antiga chamava `hits.clear()` e
 *  zerava o histórico de todo mundo, inclusive de quem estava sendo contido. */
const TETO = { max: 5, windowMs: 60_000 };

export async function POST(request: Request) {
  if (rateLimited(`subscribe:${clientIp(request)}`, TETO)) {
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
