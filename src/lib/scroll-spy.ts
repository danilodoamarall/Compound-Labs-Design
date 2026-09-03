/** Qual seção está sendo lida, dado o topo de cada uma e a posição da rolagem.

    Fica separada do componente porque é a única parte com regra de negócio, e
    assim dá para testar sem navegador: scripts/check-scroll-spy.mjs cobre os
    casos de borda que o ambiente de preview não consegue exercitar. */
export function activeSectionId(
  sections: { id: string; top: number }[],
  scrollTop: number,
  viewportHeight: number,
  documentHeight: number,
  /** Altura do cabeçalho mais a pílula: acima disso o conteúdo está encoberto. */
  offset = 150
): string {
  if (!sections.length) return "";

  // No fim da página a última seção vence, mesmo que seja curta demais para
  // cruzar a linha de leitura. Sem isso a última nunca fica ativa.
  if (scrollTop + viewportHeight >= documentHeight - 2) {
    return sections[sections.length - 1].id;
  }

  const line = scrollTop + offset;
  let current = sections[0].id;
  for (const section of sections) {
    if (section.top <= line) current = section.id;
  }
  return current;
}
