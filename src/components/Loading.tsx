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
