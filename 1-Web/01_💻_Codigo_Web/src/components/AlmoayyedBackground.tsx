import { useEffect, useRef } from "react";
import "./styles/AlmoayyedBackground.css";

const GRAIN_SVG = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.20'/></svg>";

interface BlobConfig {
  baseX: number;
  baseY: number;
  rx: number;
  ry: number;
  p: number;
  p2: number;
  speedX: number;
  speedY: number;
  ampX: number;
  ampY: number;
  stops: string;
}

const BLOBS: BlobConfig[] = [
  {
    // Blob 1: Plata Suave / Titanio Claro (iluminación principal)
    baseX: 60.0,
    baseY: 40.0,
    rx: 65,
    ry: 55,
    p: 1.15,
    p2: 3.42,
    speedX: 0.76,
    speedY: 0.62,
    ampX: 26,
    ampY: 24,
    stops: "rgba(226, 232, 240, 0.95) 0%, rgba(203, 213, 225, 0.78) 26%, rgba(203, 213, 225, 0.38) 55%, rgba(203, 213, 225, 0) 80%",
  },
  {
    // Blob 2: Gris Oscuro / Grafito Carbón (contraste profundo móvil)
    baseX: 25.0,
    baseY: 70.0,
    rx: 60,
    ry: 58,
    p: 4.25,
    p2: 0.95,
    speedX: 0.68,
    speedY: 0.82,
    ampX: 28,
    ampY: 26,
    stops: "rgba(24, 32, 47, 0.94) 0%, rgba(30, 41, 59, 0.76) 24%, rgba(51, 65, 85, 0.40) 50%, rgba(30, 41, 59, 0) 75%",
  },
  {
    // Blob 3: Gris Acero / Titanio Pizarra (barrido diagonal)
    baseX: 52.0,
    baseY: 16.0,
    rx: 58,
    ry: 52,
    p: 2.85,
    p2: 5.20,
    speedX: 0.84,
    speedY: 0.66,
    ampX: 25,
    ampY: 28,
    stops: "rgba(71, 85, 105, 0.90) 0%, rgba(71, 85, 105, 0.68) 26%, rgba(100, 116, 139, 0.32) 52%, rgba(71, 85, 105, 0) 76%",
  },
  {
    // Blob 4: Blanco Platino / Brillo Especular (haz de luz líquida brillante)
    baseX: 82.0,
    baseY: 78.0,
    rx: 52,
    ry: 46,
    p: 5.50,
    p2: 2.15,
    speedX: 0.90,
    speedY: 0.74,
    ampX: 30,
    ampY: 26,
    stops: "rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.82) 20%, rgba(241, 245, 249, 0.38) 44%, rgba(255, 255, 255, 0) 68%",
  },
  {
    // Blob 5: Gris Humo / Plata Medio (ondulación izquierda)
    baseX: 18.0,
    baseY: 28.0,
    rx: 56,
    ry: 54,
    p: 3.65,
    p2: 4.80,
    speedX: 0.72,
    speedY: 0.86,
    ampX: 26,
    ampY: 25,
    stops: "rgba(148, 163, 184, 0.88) 0%, rgba(148, 163, 184, 0.58) 28%, rgba(148, 163, 184, 0.24) 55%, rgba(148, 163, 184, 0) 78%",
  },
  {
    // Blob 6: Titanio Pulido Líquido (ondulación flotante central-derecha)
    baseX: 74.0,
    baseY: 26.0,
    rx: 54,
    ry: 56,
    p: 0.85,
    p2: 2.70,
    speedX: 0.80,
    speedY: 0.70,
    ampX: 27,
    ampY: 27,
    stops: "rgba(215, 225, 235, 0.92) 0%, rgba(175, 190, 208, 0.62) 28%, rgba(148, 163, 184, 0.25) 54%, rgba(148, 163, 184, 0) 78%",
  },
];

const AlmoayyedBackground = () => {
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = bgRef.current;
    if (!el) return;

    let rafId: number;
    let startTime: number | null = null;
    const speed = 1.0;

    const renderFrame = (now: number) => {
      if (startTime === null) startTime = now;
      const t = (now - startTime) / 1000;
      const ph = t * speed;

      const radialGradients = BLOBS.map((blob) => {
        // Doble armónico con desfases dinámicos para movimiento fluido, amplio y continuo
        // Toda modulación vale estrictamente 0 cuando ph = 0 para evitar saltos
        const dx =
          (Math.sin(ph * blob.speedX + blob.p) - Math.sin(blob.p) +
            0.45 * (Math.sin(ph * (blob.speedX * 0.5) + blob.p * 2) - Math.sin(blob.p * 2))) *
          blob.ampX;

        const dy =
          (Math.sin(ph * blob.speedY + blob.p2) - Math.sin(blob.p2) +
            0.45 * (Math.cos(ph * (blob.speedY * 0.5) + blob.p2 * 2) - Math.cos(blob.p2 * 2))) *
          blob.ampY;

        // Modulación elíptica viva: cada blob expande y contrae su campo de luz
        const drx = (Math.sin(ph * 0.55 + blob.p * 1.5) - Math.sin(blob.p * 1.5)) * 14;
        const dry = (Math.cos(ph * 0.48 + blob.p2 * 1.5) - Math.cos(blob.p2 * 1.5)) * 14;

        const x = Number((blob.baseX + dx).toFixed(2));
        const y = Number((blob.baseY + dy).toFixed(2));
        const rx = Number(Math.max(28, blob.rx + drx).toFixed(1));
        const ry = Number(Math.max(28, blob.ry + dry).toFixed(1));

        return `radial-gradient(ellipse ${rx}% ${ry}% at ${x}% ${y}%, ${blob.stops})`;
      }).join(", ");

      el.style.backgroundImage = `url("${GRAIN_SVG}"), ${radialGradients}`;
      rafId = requestAnimationFrame(renderFrame);
    };

    rafId = requestAnimationFrame(renderFrame);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <div ref={bgRef} className="almoayyed-bg" aria-hidden="true" />;
};

export default AlmoayyedBackground;
