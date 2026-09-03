"use client";

import { Component, useSyncExternalStore, type ReactNode } from "react";
import MoltenMetal from "@/components/reactbits/MoltenMetal";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

/** O metal fundido, com rede de segurança.
 *
 *  O componente de origem chama `new Renderer(...)` sem `try/catch`: sem
 *  contexto WebGL ele lança e derruba a árvore inteira. E ele não consulta
 *  `prefers-reduced-motion`.
 *
 *  Aqui o gradiente é o piso, sempre presente. O canvas entra por cima quando
 *  há WebGL. Se falhar, some e sobra o gradiente, que é uma superfície decente
 *  em vez de um buraco preto. Quem pediu menos movimento recebe a mesma textura,
 *  parada: `speed={0}` congela o tempo do shader. */
export function MoltenBackdrop({
  className = "",
  color1 = "#0b8a74",
  color2 = "#1f7a8c",
  color3 = "#c9571c",
  opacity = 1,
}: {
  className?: string;
  color1?: string;
  color2?: string;
  color3?: string;
  opacity?: number;
}) {
  const reduced = usePrefersReducedMotion();
  const canWebGL = useSyncExternalStore(subscribeNever, probeWebGL, () => false);

  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {/* O piso: existe com ou sem WebGL, e é o que o leitor vê se tudo falhar. */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(120% 100% at 20% 0%, ${color1}55, transparent 60%), radial-gradient(100% 90% at 85% 20%, ${color2}44, transparent 62%), radial-gradient(90% 80% at 60% 100%, ${color3}33, transparent 58%), #0A0A0A`,
        }}
      />

      {canWebGL ? (
        <WebGLBoundary>
          <div className="absolute inset-0" style={{ opacity }}>
            <MoltenMetal
              color1={color1}
              color2={color2}
              color3={color3}
              speed={reduced ? 0 : 0.22}
              scale={3.2}
              glow={1.35}
              swirl={0.9}
              grain
              grainIntensity={0.045}
              mouseInteraction={!reduced}
              mouseStrength={0.18}
            />
          </div>
        </WebGLBoundary>
      ) : null}
    </div>
  );
}

/** A capacidade de WebGL não muda durante a sessão, então a sonda roda uma vez
    e o resultado fica em cache. Precisa ser estável: o useSyncExternalStore
    compara por identidade e um valor novo a cada leitura entraria em laço. */
let webglCache: boolean | null = null;
function probeWebGL(): boolean {
  if (webglCache !== null) return webglCache;
  try {
    const probe = document.createElement("canvas");
    const gl = probe.getContext("webgl2") ?? probe.getContext("webgl");
    webglCache = Boolean(gl);
    (gl as WebGLRenderingContext | null)?.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    webglCache = false;
  }
  return webglCache;
}

function subscribeNever() {
  return () => {};
}

/** Se o canvas lançar em qualquer momento, o gradiente continua no lugar. */
class WebGLBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}
