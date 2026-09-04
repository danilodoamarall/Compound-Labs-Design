/** Limite de taxa por IP, em memória.
 *
 *  Estava escrito dentro de /api/subscribe. Saiu de lá porque o MCP também
 *  precisa: é um endereço público sem autenticação, e sem limite qualquer um
 *  pode martelar a função.
 *
 *  Memória de processo, não compartilhada entre instâncias: numa função sem
 *  estado isso significa que o limite é por instância, não global. É frouxo de
 *  propósito. Serve para conter abuso acidental, não ataque coordenado; para
 *  isso o lugar certo é a borda, não o código. */
const janelas = new Map<string, number[]>();

export function rateLimited(chave: string, { max, windowMs }: { max: number; windowMs: number }): boolean {
  const agora = Date.now();
  const recentes = (janelas.get(chave) ?? []).filter((t) => agora - t < windowMs);
  recentes.push(agora);
  janelas.set(chave, recentes);

  // Sem isto o mapa cresce para sempre com IPs que nunca voltam.
  if (janelas.size > 5000) {
    for (const [k, ts] of janelas) {
      if (ts.every((t) => agora - t >= windowMs)) janelas.delete(k);
    }
  }

  return recentes.length > max;
}

/** O IP de quem pediu, atrás do proxy da Vercel. */
export function clientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "desconhecido"
  );
}
