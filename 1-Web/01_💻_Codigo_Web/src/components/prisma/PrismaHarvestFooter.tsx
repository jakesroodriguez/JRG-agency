import React, { useEffect, useRef, useState, useCallback } from "react";
import { ArrowUpRight, ArrowUp, MapPin, Sparkles, MessageCircle, Plus, RefreshCw } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

interface LogoToken {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  angle: number;
  va: number; // velocidad angular de giro
}

export const PrismaHarvestFooter: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [tokenCount, setTokenCount] = useState(90);
  const [isInteracting, setIsInteracting] = useState(false);

  const spawnTokensRef = useRef<((count: number, originX?: number, originY?: number) => void) | null>(null);
  const resetTokensRef = useRef<(() => void) | null>(null);

  // ─── SIMULACIÓN FÍSICA MULTI-LOGO LIMPIA (SIN NEÓN, IMAGEN PURA) ───
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let isVisible = true;

    // Cargar la imagen del logo oficial de JRG
    const logoImg = new Image();
    logoImg.src = "/logoJRG.png";
    let isLogoLoaded = false;
    logoImg.onload = () => {
      isLogoLoaded = true;
    };

    const updateSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = container.clientWidth;
      const height = container.clientHeight || 480;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    updateSize();

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const getW = () => canvas.width / dpr;
    const getH = () => canvas.height / dpr;

    let nextId = 0;
    const createToken = (customX?: number, customY?: number, isBurst = false): LogoToken => {
      const w = getW();
      
      // Tamaños variados (entre 18px y 34px de radio) para que se apilen y rueden de forma natural
      const r = Math.floor(Math.random() * 16) + 18;
      
      const x = customX !== undefined ? customX : (w * 0.05) + Math.random() * (w * 0.9);
      // Distribución en cascada superior para una caída continua espectacular
      const y = customY !== undefined ? customY : -30 - Math.random() * 850;

      return {
        id: nextId++,
        x,
        y,
        vx: isBurst ? (Math.random() - 0.5) * 14 : (Math.random() - 0.5) * 3,
        vy: isBurst ? -Math.random() * 9 - 4 : Math.random() * 3 + 1.5,
        radius: r,
        angle: Math.random() * Math.PI * 2,
        va: (Math.random() - 0.5) * 0.1, // Giro angular inicial
      };
    };

    // BASTANTES MÁS LOGOS (90 logos iniciales que llueven y se apilan)
    let tokens: LogoToken[] = [];
    for (let i = 0; i < 90; i++) {
      tokens.push(createToken());
    }

    spawnTokensRef.current = (count: number, originX?: number, originY?: number) => {
      const newTokens: LogoToken[] = [];
      for (let i = 0; i < count; i++) {
        newTokens.push(createToken(originX, originY, true));
      }
      tokens.push(...newTokens);
      setTokenCount(tokens.length);
    };

    resetTokensRef.current = () => {
      tokens = [];
      for (let i = 0; i < 90; i++) {
        tokens.push(createToken());
      }
      setTokenCount(tokens.length);
    };

    // Control de ratón / arrastre
    let draggedToken: LogoToken | null = null;
    let dragOffsetX = 0;
    let dragOffsetY = 0;
    let lastMouseX = 0;
    let lastMouseY = 0;
    let mouseVx = 0;
    let mouseVy = 0;
    let mousePos = { x: -1000, y: -1000 };
    let hasMovedDuringClick = false;

    const getCanvasCoords = (e: MouseEvent | Touch) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handlePointerDown = (pos: { x: number; y: number }) => {
      hasMovedDuringClick = false;
      lastMouseX = pos.x;
      lastMouseY = pos.y;
      
      for (let i = tokens.length - 1; i >= 0; i--) {
        const t = tokens[i];
        const dist = Math.hypot(pos.x - t.x, pos.y - t.y);
        if (dist <= t.radius + 6) {
          draggedToken = t;
          dragOffsetX = pos.x - t.x;
          dragOffsetY = pos.y - t.y;
          t.vx = 0;
          t.vy = 0;
          setIsInteracting(true);
          return;
        }
      }
    };

    const handlePointerMove = (pos: { x: number; y: number }) => {
      mouseVx = pos.x - lastMouseX;
      mouseVy = pos.y - lastMouseY;
      if (Math.hypot(mouseVx, mouseVy) > 4) {
        hasMovedDuringClick = true;
      }
      lastMouseX = pos.x;
      lastMouseY = pos.y;
      mousePos = pos;

      if (draggedToken) {
        draggedToken.x = pos.x - dragOffsetX;
        draggedToken.y = pos.y - dragOffsetY;
        draggedToken.vx = mouseVx * 0.85;
        draggedToken.vy = mouseVy * 0.85;
        draggedToken.va = mouseVx * 0.015;
      }
    };

    const handlePointerUp = () => {
      if (draggedToken) {
        draggedToken.vx = Math.min(Math.max(mouseVx * 0.95, -20), 20);
        draggedToken.vy = Math.min(Math.max(mouseVy * 0.95, -20), 20);
        draggedToken = null;
        setIsInteracting(false);
      } else if (!hasMovedDuringClick && mousePos.x > 0 && mousePos.y > 0) {
        // Al hacer clic en un espacio libre, suelta una ráfaga de 5 logos nuevos
        if (spawnTokensRef.current && tokens.length < 180) {
          spawnTokensRef.current(5, mousePos.x, mousePos.y);
        }
      }
    };

    const onMouseDown = (e: MouseEvent) => handlePointerDown(getCanvasCoords(e));
    const onMouseMove = (e: MouseEvent) => handlePointerMove(getCanvasCoords(e));
    const onMouseUp = () => handlePointerUp();
    const onMouseLeave = () => {
      mousePos = { x: -1000, y: -1000 };
      handlePointerUp();
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) handlePointerDown(getCanvasCoords(e.touches[0]));
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) handlePointerMove(getCanvasCoords(e.touches[0]));
    };
    const onTouchEnd = () => handlePointerUp();

    canvas.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("mouseleave", onMouseLeave);

    canvas.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);

    // Optimización de rendimiento
    const observer = new IntersectionObserver((entries) => {
      isVisible = entries[0].isIntersecting;
    });
    observer.observe(container);

    const onResize = () => {
      updateSize();
    };
    window.addEventListener("resize", onResize);

    // Constantes de física natural
    const gravity = 0.35;
    const bounce = 0.58;
    const friction = 0.986;

    const animate = () => {
      if (isVisible) {
        const w = getW();
        const h = getH();

        ctx.clearRect(0, 0, w, h);

        // Actualizar física de cada logo
        for (let i = 0; i < tokens.length; i++) {
          const t = tokens[i];

          if (t !== draggedToken) {
            t.vy += gravity;
            t.vx *= friction;
            t.vy *= friction;
            t.angle += t.va;
            t.va *= 0.992;

            // Repulsión magnética con el ratón al pasar cerca
            if (mousePos.x > 0 && mousePos.y > 0) {
              const dx = t.x - mousePos.x;
              const dy = t.y - mousePos.y;
              const d2 = dx * dx + dy * dy;
              const thresh = (t.radius + 45);
              if (d2 < thresh * thresh && d2 > 0) {
                const d = Math.sqrt(d2);
                const force = (thresh - d) / thresh;
                t.vx += (dx / d) * force * 1.3;
                t.vy += (dy / d) * force * 1.3;
                t.va += (dx / d) * force * 0.05;
              }
            }

            t.x += t.vx;
            t.y += t.vy;

            // Colisión con el suelo
            if (t.y + t.radius > h) {
              t.y = h - t.radius;
              t.vy = -t.vy * bounce;
              t.va = t.vx * 0.035; // Transmisión de giro al rodar
              if (Math.abs(t.vy) < 0.25) t.vy = 0;
            }
            // Pared izquierda
            if (t.x - t.radius < 0) {
              t.x = t.radius;
              t.vx = -t.vx * bounce;
              t.va = -t.vy * 0.025;
            }
            // Pared derecha
            if (t.x + t.radius > w) {
              t.x = w - t.radius;
              t.vx = -t.vx * bounce;
              t.va = t.vy * 0.025;
            }
          }
        }

        // Colisión entre logos (Optimizada con pre-check cuadrático)
        const len = tokens.length;
        for (let i = 0; i < len; i++) {
          const t1 = tokens[i];
          for (let j = i + 1; j < len; j++) {
            const t2 = tokens[j];
            const dx = t2.x - t1.x;
            const minDist = t1.radius + t2.radius;

            // Bounding box horizontal rápido
            if (Math.abs(dx) > minDist) continue;

            const dy = t2.y - t1.y;
            if (Math.abs(dy) > minDist) continue;

            const distSq = dx * dx + dy * dy;
            if (distSq < minDist * minDist && distSq > 0) {
              const dist = Math.sqrt(distSq);
              const overlap = (minDist - dist) / 2;
              const nx = dx / dist;
              const ny = dy / dist;

              if (t1 !== draggedToken) {
                t1.x -= nx * overlap;
                t1.y -= ny * overlap;
              }
              if (t2 !== draggedToken) {
                t2.x += nx * overlap;
                t2.y += ny * overlap;
              }

              const kx = t1.vx - t2.vx;
              const ky = t1.vy - t2.vy;
              const p = (nx * kx + ny * ky);

              if (t1 !== draggedToken) {
                t1.vx -= p * nx * bounce;
                t1.vy -= p * ny * bounce;
                t1.va += (Math.random() - 0.5) * 0.04;
              }
              if (t2 !== draggedToken) {
                t2.vx += p * nx * bounce;
                t2.vy += p * ny * bounce;
                t2.va += (Math.random() - 0.5) * 0.04;
              }
            }
          }
        }

        // ─── DIBUJADO LIMPIO DEL LOGO (SIN NEÓN, IMAGEN PURA) ───
        for (let i = 0; i < len; i++) {
          const t = tokens[i];

          ctx.save();
          ctx.translate(t.x, t.y);
          ctx.rotate(t.angle);

          // Sombra suave natural de profundidad (oscura, sin colores fluorescentes)
          ctx.shadowColor = "rgba(0, 0, 0, 0.55)";
          ctx.shadowBlur = 8;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 3;

          if (isLogoLoaded) {
            // Renderizamos directamente la imagen del logo con su transparencia original
            const size = t.radius * 2;
            ctx.drawImage(logoImg, -t.radius, -t.radius, size, size);
          } else {
            // Fallback limpio mientras carga
            ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
            ctx.font = `bold ${Math.round(t.radius * 0.45)}px sans-serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("JRG", 0, 0);
          }

          ctx.restore();
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("mouseleave", onMouseLeave);
      canvas.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  const handleAddTokens = useCallback(() => {
    if (spawnTokensRef.current) {
      spawnTokensRef.current(25);
    }
  }, []);

  const handleResetTokens = useCallback(() => {
    if (resetTokensRef.current) {
      resetTokensRef.current();
    }
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full bg-[#070709] border-t border-white/10 text-white relative select-none font-sans z-20">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* ─── FILA 1: LOGOTIPO MONUMENTAL DE MARCA (ESTILO HARVEST HALL) ─── */}
        <div className="py-14 md:py-18 border-b border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/[0.03] border border-white/10 p-3 flex items-center justify-center shadow-inner">
              <img
                src="/logoJRG.png"
                alt="JRG Agency Logo"
                className="w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(222,219,200,0.2)]"
              />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <span className="text-2xl md:text-4xl font-extrabold tracking-tight text-[#E1E0CC]">
                  JRG AGENCY
                </span>
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full border border-emerald-500/30 text-emerald-400 bg-emerald-950/20">
                  ESTÁNDAR 2026
                </span>
              </div>
              <p className="text-xs text-gray-400 font-light mt-1 max-w-md">
                Estudio de arquitectura web interactiva, 3D inmersivo y agentes de IA.
              </p>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-3 text-xs font-mono text-gray-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>DISPONIBLE PARA NUEVOS PROYECTOS // RESPUESTA EN &lt; 2H</span>
          </div>
        </div>

        {/* ─── FILA 2: GRID MODULAR EDITORIAL DE 3 COLUMNAS ─── */}
        <div className="grid grid-cols-1 md:grid-cols-12 border-b border-white/10">
          
          {/* COLUMNA 1: PROYECTO & CONVERSIÓN */}
          <div className="md:col-span-4 py-10 md:pr-8 md:border-r border-white/10 flex flex-col justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-[#DEDBC8] mb-2 font-mono flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" />
                Inicia tu proyecto
              </p>
              <h3 className="text-lg md:text-xl font-medium text-[#E1E0CC] mb-4 leading-snug">
                ¿Listo para transformar tu web en una ventaja competitiva?
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed mb-6 font-light">
                Diseñamos experiencias digitales con rendimiento Lighthouse 100/100, visuales 3D que cautivan y arquitectura lista para escalar.
              </p>
            </div>
            <a
              href="#contact"
              className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-[#DEDBC8] hover:bg-white text-black text-xs sm:text-sm font-semibold transition-all duration-300 w-fit shadow-[0_0_20px_rgba(222,219,200,0.15)] group"
            >
              <span>Comenzar Ahora</span>
              <ArrowUpRight className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>

          {/* COLUMNA 2: COMUNICACIÓN DIRECTA & WHATSAPP */}
          <div className="md:col-span-4 py-10 md:px-8 md:border-r border-white/10 flex flex-col justify-between border-t md:border-t-0">
            <div>
              <p className="text-xs uppercase tracking-widest text-emerald-400 mb-2 font-mono flex items-center gap-2">
                <MessageCircle className="w-3.5 h-3.5" />
                Canal Directo Fundador
              </p>
              <h3 className="text-lg md:text-xl font-medium text-[#E1E0CC] mb-4 leading-snug">
                Habla directamente con quien programa y diseña.
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed mb-6 font-light">
                Sin intermediarios ni comerciales. Consultas rápidas, presupuestos en 24h y asesoramiento técnico sobre tu stack.
              </p>
            </div>
            <a
              href="https://wa.me/34613448185?text=Hola%20JRG!%20Me%20interesa%20iniciar%20un%20proyecto%20web"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl border border-emerald-500/30 text-emerald-300 bg-emerald-950/30 hover:bg-emerald-900/40 text-xs sm:text-sm font-medium transition-colors w-fit"
            >
              <FaWhatsapp className="text-base text-emerald-400" />
              <span>WhatsApp Directo (+34 613 44 81 85)</span>
            </a>
          </div>

          {/* COLUMNA 3: NAVEGACIÓN, AVISO ÉTICO Y AUTORÍA */}
          <div className="md:col-span-4 py-10 md:pl-8 flex flex-col justify-between border-t md:border-t-0">
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-400 mb-4 font-mono">
                Navegación &amp; Ecosistema
              </p>
              <ul className="space-y-3 text-xs sm:text-sm text-gray-300 font-light">
                <li>
                  <a
                    href="#portfolio"
                    className="hover:text-white transition-colors flex items-center justify-between group"
                  >
                    <span>Portfolio &amp; Casos de Éxito</span>
                    <span className="text-gray-500 group-hover:text-white transition-transform group-hover:rotate-45">→</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#method"
                    className="hover:text-white transition-colors flex items-center justify-between group"
                  >
                    <span>Método &amp; Arquitectura</span>
                    <span className="text-gray-500 group-hover:text-white transition-transform group-hover:rotate-45">→</span>
                  </a>
                </li>
                <li>
                  <a
                    href="/agentes"
                    className="hover:text-white transition-colors flex items-center justify-between group"
                  >
                    <span className="flex items-center gap-1.5">
                      Orquestador de Agentes 3D
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">NUEVO</span>
                    </span>
                    <span className="text-gray-500 group-hover:text-white transition-transform group-hover:rotate-45">→</span>
                  </a>
                </li>
                <li>
                  <a
                    href="/play"
                    className="hover:text-white transition-colors flex items-center justify-between group"
                  >
                    <span>Desafío de Ajedrez 3D (3000 ELO)</span>
                    <span className="text-gray-500 group-hover:text-white transition-transform group-hover:rotate-45">→</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* AVISO DE AUTORÍA Y FILOSOFÍA (INSPIRADO EN HARVEST HALL) */}
            <div className="mt-8 pt-5 border-t border-white/5">
              <p className="text-[11px] text-gray-400 leading-relaxed font-light">
                Código fuente, arquitectura 3D e interfaces propiedad intelectual de <strong>JRG Agency</strong>.
                Desarrollo de autor elaborado artesanalmente sin plantillas genéricas. Prohibida su clonación no autorizada.
              </p>
            </div>
          </div>
        </div>

        {/* ─── FILA 3: COPYRIGHT Y SUBIR ─── */}
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400 font-mono">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-[#DEDBC8]" />
            <span>Urretxu · Gipuzkoa · Euskal Herria</span>
          </div>

          <div>
            &copy; {new Date().getFullYear()} JRG Agency · Todos los derechos reservados.
          </div>

          <button
            onClick={scrollToTop}
            className="px-3.5 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 text-gray-300 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer text-xs"
            title="Volver arriba"
          >
            <span>Subir</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ─── EASTER EGG: PISCINA DE LOGOS DE JRG LIMPIA (SIN NEÓN) ─── */}
      <div
        ref={containerRef}
        className="w-full relative bg-[#040406] border-t border-white/10 overflow-hidden select-none"
        style={{ height: "480px" }}
      >
        {/* Barra superior de controles */}
        <div className="absolute top-4 left-6 right-6 z-10 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-2.5 bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
            <span className="w-2 h-2 rounded-full bg-[#DEDBC8] animate-ping" />
            <span className="text-[10px] md:text-xs font-mono uppercase tracking-widest text-gray-300">
              {isInteracting
                ? "¡Lanzando logo de JRG!"
                : `Logos JRG: ${tokenCount} · Clic para soltar más o arrastra y lanza`}
            </span>
          </div>

          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              onClick={handleAddTokens}
              type="button"
              className="px-3 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.15] border border-white/15 text-xs text-gray-200 hover:text-white transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
              title="Añadir más logos"
            >
              <Plus className="w-3.5 h-3.5 text-[#DEDBC8]" />
              <span className="hidden sm:inline">Lluvia de Logos</span> (+25)
            </button>
            <button
              onClick={handleResetTokens}
              type="button"
              className="p-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.15] border border-white/15 text-gray-300 hover:text-white transition-all shadow-sm active:scale-95 cursor-pointer"
              title="Reiniciar lluvia"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-grab active:cursor-grabbing block"
        />
      </div>
    </footer>
  );
};

export default PrismaHarvestFooter;
