import { lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import "./App.css";

const MobileLanding = lazy(() => import("./mobile/MobileLanding"));
const DesktopLanding = lazy(() => import("./components/prisma/PrismaDesktopLanding"));
const MyWorks = lazy(() => import("./pages/MyWorks"));
const Play = lazy(() => import("./pages/Play"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const DemoPreview = lazy(() => import("./pages/DemoPreview"));
const AgentOrchestratorPage = lazy(() => import("./pages/AgentOrchestratorPage"));

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < breakpoint;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, [breakpoint]);

  return isMobile;
}

const App = () => {
  const isMobile = useIsMobile(768);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route
          path="/"
          element={
            isMobile ? (
              <Suspense fallback={<div style={{ minHeight: '100vh', background: '#f4f7fb' }} />}>
                <MobileLanding />
              </Suspense>
            ) : (
              <Suspense fallback={<div style={{ minHeight: '100vh', background: '#000000' }} />}>
                <DesktopLanding />
              </Suspense>
            )
          }
        />
        <Route
          path="/prisma"
          element={
            <Suspense fallback={<div style={{ minHeight: '100vh', background: '#000000' }} />}>
              <DesktopLanding />
            </Suspense>
          }
        />
        <Route
          path="/desktop"
          element={
            <Suspense fallback={<div style={{ minHeight: '100vh', background: '#000000' }} />}>
              <DesktopLanding />
            </Suspense>
          }
        />
        <Route
          path="/myworks"
          element={
            <Suspense fallback={<div>Cargando...</div>}>
              <MyWorks />
            </Suspense>
          }
        />
        <Route
          path="/play"
          element={
            <Suspense fallback={<div>Cargando...</div>}>
              <Play />
            </Suspense>
          }
        />
        <Route
          path="/contact"
          element={
            <Suspense fallback={<div>Cargando...</div>}>
              <ContactPage />
            </Suspense>
          }
        />
        <Route
          path="/contacto"
          element={
            <Suspense fallback={<div>Cargando...</div>}>
              <ContactPage />
            </Suspense>
          }
        />
        <Route
          path="/demo/:slug"
          element={
            <Suspense fallback={<div style={{ minHeight: '100vh', background: '#0d1117', color: '#8b949e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Cargando boceto digital...</div>}>
              <DemoPreview />
            </Suspense>
          }
        />
        <Route
          path="/demo"
          element={
            <Suspense fallback={<div style={{ minHeight: '100vh', background: '#0d1117', color: '#8b949e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Cargando boceto digital...</div>}>
              <DemoPreview />
            </Suspense>
          }
        />
        <Route
          path="/agentes"
          element={
            <Suspense fallback={<div style={{ minHeight: '100vh', background: '#07090e', color: '#00f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace' }}>⚡ Iniciando Sistema de Agentes JRG...</div>}>
              <AgentOrchestratorPage />
            </Suspense>
          }
        />
        <Route
          path="/orquestador"
          element={
            <Suspense fallback={<div style={{ minHeight: '100vh', background: '#07090e', color: '#00f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace' }}>⚡ Iniciando Sistema de Agentes JRG...</div>}>
              <AgentOrchestratorPage />
            </Suspense>
          }
        />
      </Routes>
      <Analytics />
      <SpeedInsights />
    </BrowserRouter>
  );
};

export default App;
