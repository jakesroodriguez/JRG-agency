import { useEffect, useState } from "react";
import "./styles/Loading.css";
import { useLoading } from "../context/LoadingProvider";

const Loading = ({ percent }: { percent: number }) => {
  const { setIsLoading } = useLoading();
  const [loaded, setLoaded] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (percent >= 100 && !loaded) {
      const t1 = setTimeout(() => {
        setLoaded(true);
        const t2 = setTimeout(() => {
          setIsLoaded(true);
        }, 300);
        return () => clearTimeout(t2);
      }, 150);
      return () => clearTimeout(t1);
    }
  }, [percent, loaded]);

  useEffect(() => {
    if (!isLoaded) return;
    setExiting(true);
    const timeout = setTimeout(() => {
      import("./utils/initialFX").then((module) => {
        if (module.initialFX) {
          module.initialFX();
        }
        setIsLoading(false);
      });
    }, 450);
    return () => clearTimeout(timeout);
  }, [isLoaded, setIsLoading]);

  const displayPercent = Math.min(100, Math.max(0, Math.round(percent)));

  return (
    <div className={`loading-wrapper ${exiting ? "loading-wrapper-exit" : ""}`}>
      <div className="loading-screen">
        <div className="loading-capsule-wrapper">
          <div className={`loading-capsule ${loaded ? "loading-capsule-ready" : ""}`}>
            <div className="loading-capsule-glow" />

            <div className="loading-capsule-body">
              {!loaded ? (
                <div className="loading-capsule-state">
                  <span className="loading-capsule-tag">CARGANDO</span>
                  <div className="loading-capsule-counter">
                    <span className="loading-capsule-num">
                      {String(displayPercent).padStart(2, "0")}
                    </span>
                    <span className="loading-capsule-pct">%</span>
                  </div>
                </div>
              ) : (
                <div className="loading-capsule-state-complete">
                  <span className="loading-capsule-welcome">BIENVENIDO</span>
                  <span className="loading-capsule-ready-dot" />
                </div>
              )}
            </div>

            {/* Laser precision micro progress bar */}
            <div className="loading-progress-track">
              <div
                className="loading-progress-bar"
                style={{ width: `${displayPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;

export const setProgress = (setLoading: (value: number) => void) => {
  let percent: number = 0;
  let isDone = false;

  // Progresión rápida y fluida: alcanza ~80% en 500ms y ~95% en 800ms
  const interval = setInterval(() => {
    if (isDone) return;
    if (percent < 75) {
      percent += Math.floor(Math.random() * 8) + 4;
    } else if (percent < 95) {
      percent += Math.floor(Math.random() * 3) + 1;
    }
    if (percent > 95) percent = 95;
    setLoading(percent);
  }, 40);

  function clear() {
    isDone = true;
    clearInterval(interval);
    setLoading(100);
  }

  function loaded() {
    return new Promise<number>((resolve) => {
      isDone = true;
      clearInterval(interval);
      // Rápida subida a 100% en menos de 80ms
      const finishInterval = setInterval(() => {
        if (percent < 100) {
          percent += 4;
          if (percent > 100) percent = 100;
          setLoading(percent);
        } else {
          clearInterval(finishInterval);
          resolve(100);
        }
      }, 10);
    });
  }

  // RED DE SEGURIDAD (FAIL-SAFE):
  // Si en 2.0 segundos no se ha completado, forzar finalización para que NUNCA se quede colgado
  setTimeout(() => {
    if (!isDone) {
      loaded();
    }
  }, 2000);

  return { loaded, percent, clear };
};
