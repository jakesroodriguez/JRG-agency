import React, { useState, useEffect, useCallback } from "react";
import "./PrismaDesktopPreloader.css";

interface PrismaDesktopPreloaderProps {
  onComplete?: () => void;
}

export const PrismaDesktopPreloader: React.FC<PrismaDesktopPreloaderProps> = ({
  onComplete,
}) => {
  const isAlreadyViewed = typeof window !== "undefined" && sessionStorage.getItem("jrg_preloaded") === "true";

  const [progress, setProgress] = useState(isAlreadyViewed ? 100 : 0);
  const [isExiting, setIsExiting] = useState(false);
  const [isDone, setIsDone] = useState(isAlreadyViewed);

  const handleSkip = useCallback(() => {
    sessionStorage.setItem("jrg_preloaded", "true");
    setProgress(100);
    setIsExiting(true);
    document.body.style.overflow = "";
    setTimeout(() => {
      setIsDone(true);
      if (onComplete) onComplete();
    }, 250);
  }, [onComplete]);

  useEffect(() => {
    if (isAlreadyViewed) {
      if (onComplete) onComplete();
      return;
    }

    // Lock scroll during preloader
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    let current = 0;
    const startTime = Date.now();
    const minDuration = 800; // Ultra-snappy 0.8s build-up (reduced from 2.2s)

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const ratio = Math.min(1, elapsed / minDuration);
      const target = ratio * 100;

      if (current < target) {
        const step = Math.max(1, Math.ceil((target - current) * 0.35));
        current = Math.min(100, current + step);
        setProgress(current);
      }

      if (current >= 100) {
        clearInterval(timer);
        sessionStorage.setItem("jrg_preloaded", "true");
        setTimeout(() => {
          setIsExiting(true);
          document.body.style.overflow = originalOverflow;
          setTimeout(() => {
            setIsDone(true);
            if (onComplete) onComplete();
          }, 350);
        }, 150);
      }
    }, 20);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === " " || e.key === "Enter") {
        handleSkip();
      }
    };
    const handleWheel = () => handleSkip();

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("wheel", handleWheel, { passive: true, once: true });

    return () => {
      clearInterval(timer);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("wheel", handleWheel);
      document.body.style.overflow = originalOverflow;
    };
  }, [handleSkip, isAlreadyViewed, onComplete]);

  if (isDone) return null;

  const getHookText = () => {
    if (progress < 30) return "01 · INICIALIZANDO ENTORNO JRG";
    if (progress < 68) return "02 · CARGANDO EXPERIENCIA 3D & SHADERS";
    if (progress < 99) return "03 · CALIBRANDO INTERFAZ EDITORIAL";
    return "04 · EXPERIENCIA LISTA";
  };

  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div
      className={"desktop-preloader" + (isExiting ? " desktop-preloader-exit" : "")}
      role="dialog"
      aria-label="Cargando experiencia"
    >
      <div className="desktop-preloader-bg" aria-hidden="true">
        <div className="desktop-preloader-blob desktop-blob-1" />
        <div className="desktop-preloader-blob desktop-blob-2" />
        <div className="desktop-preloader-blob desktop-blob-3" />
        <div className="desktop-preloader-noise" />
      </div>

      <button
        type="button"
        className="desktop-preloader-skip"
        onClick={handleSkip}
        aria-label="Saltar introducción"
      >
        <span>Saltar</span>
      </button>

      <div className="desktop-preloader-content">
        <div className="desktop-preloader-circle-wrapper">
          <div className="desktop-preloader-logo-glow" aria-hidden="true" />
          
          <svg
            className="desktop-preloader-ring-svg"
            width="156"
            height="156"
            viewBox="0 0 156 156"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="desktop-ring-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#71717a" />
                <stop offset="50%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#ffffff" />
              </linearGradient>
            </defs>
            <circle
              cx="78"
              cy="78"
              r={radius}
              fill="none"
              stroke="rgba(255, 255, 255, 0.12)"
              strokeWidth="3"
            />
            <circle
              cx="78"
              cy="78"
              r={radius}
              fill="none"
              stroke="url(#desktop-ring-gradient)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              transform="rotate(-90 78 78)"
              className="desktop-preloader-ring-progress"
            />
          </svg>

          <img
            src="/logoJRG.png"
            alt="Logo JRG"
            className="desktop-preloader-logo-still"
            width="98"
            height="98"
          />
        </div>

        <div className="desktop-preloader-info-box">
          <span className="desktop-preloader-counter">{progress}%</span>
          <span className="desktop-preloader-hook">{getHookText()}</span>
        </div>
      </div>
    </div>
  );
};

export default PrismaDesktopPreloader;