import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import LegalAssistantModal from "./components/legal/LegalAssistantModal";
import "./App.css";

const DesktopLanding = lazy(() => import("./components/prisma/PrismaDesktopLanding"));
const MyWorks = lazy(() => import("./pages/MyWorks"));
const Play = lazy(() => import("./pages/Play"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const DemoPreview = lazy(() => import("./pages/DemoPreview"));
const AgentOrchestratorPage = lazy(() => import("./pages/AgentOrchestratorPage"));
const StudioDashboardPage = lazy(() => import("./pages/StudioDashboardPage"));

// Páginas de Servicios SEO Especializados
const AutomatizacionesIA = lazy(() => import("./pages/AutomatizacionesIA"));
const ChatbotsIA = lazy(() => import("./pages/ChatbotsIA"));
const DesarrolloWeb = lazy(() => import("./pages/DesarrolloWeb"));

// Páginas Legales
const AvisoLegal = lazy(() => import("./pages/legal/AvisoLegal"));
const PoliticaPrivacidad = lazy(() => import("./pages/legal/PoliticaPrivacidad"));
const PoliticaCookies = lazy(() => import("./pages/legal/PoliticaCookies"));
const TerminosServicio = lazy(() => import("./pages/legal/TerminosServicio"));
const DeclaracionAccesibilidad = lazy(() => import("./pages/legal/DeclaracionAccesibilidad"));

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}


const LegalFallback = () => (
  <div style={{ minHeight: "100vh", background: "#07090E", display: "flex", alignItems: "center", justifyContent: "center", color: "#8b949e", fontFamily: "sans-serif" }}>
    Cargando documento legal...
  </div>
);

const App = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route
          path="/"
          element={
            <Suspense fallback={<div style={{ minHeight: '100vh', background: '#000000' }} />}>
              <DesktopLanding />
            </Suspense>
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
          path="/studio"
          element={
            <Suspense fallback={<div style={{ minHeight: '100vh', background: '#07080B', color: '#C2A88F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Cargando JRG Studio...</div>}>
              <StudioDashboardPage />
            </Suspense>
          }
        />
        <Route
          path="/editor"
          element={
            <Suspense fallback={<div style={{ minHeight: '100vh', background: '#07080B', color: '#C2A88F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Cargando JRG Studio...</div>}>
              <StudioDashboardPage />
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

        {/* Rutas de Servicios Especializados (SEO Clúster & Conversión) */}
        <Route
          path="/automatizaciones-ia"
          element={
            <Suspense fallback={<div style={{ minHeight: '100vh', background: '#070709' }} />}>
              <AutomatizacionesIA />
            </Suspense>
          }
        />
        <Route
          path="/chatbots-ia"
          element={
            <Suspense fallback={<div style={{ minHeight: '100vh', background: '#070709' }} />}>
              <ChatbotsIA />
            </Suspense>
          }
        />
        <Route
          path="/desarrollo-web"
          element={
            <Suspense fallback={<div style={{ minHeight: '100vh', background: '#070709' }} />}>
              <DesarrolloWeb />
            </Suspense>
          }
        />

        {/* Rutas Legales Obligatorias (LSSI-CE, RGPD, Cookies AEPD, TRLGDCU, Accesibilidad) */}
        <Route
          path="/aviso-legal"
          element={
            <Suspense fallback={<LegalFallback />}>
              <AvisoLegal />
            </Suspense>
          }
        />
        <Route
          path="/privacidad"
          element={
            <Suspense fallback={<LegalFallback />}>
              <PoliticaPrivacidad />
            </Suspense>
          }
        />
        <Route
          path="/politica-de-privacidad"
          element={
            <Suspense fallback={<LegalFallback />}>
              <PoliticaPrivacidad />
            </Suspense>
          }
        />
        <Route
          path="/cookies"
          element={
            <Suspense fallback={<LegalFallback />}>
              <PoliticaCookies />
            </Suspense>
          }
        />
        <Route
          path="/politica-de-cookies"
          element={
            <Suspense fallback={<LegalFallback />}>
              <PoliticaCookies />
            </Suspense>
          }
        />
        <Route
          path="/terminos"
          element={
            <Suspense fallback={<LegalFallback />}>
              <TerminosServicio />
            </Suspense>
          }
        />
        <Route
          path="/condiciones"
          element={
            <Suspense fallback={<LegalFallback />}>
              <TerminosServicio />
            </Suspense>
          }
        />
        <Route
          path="/accesibilidad"
          element={
            <Suspense fallback={<LegalFallback />}>
              <DeclaracionAccesibilidad />
            </Suspense>
          }
        />
      </Routes>

      {/* Asistente Legal y de Privacidad IA (Google Gemini API) */}
      <LegalAssistantModal />
    </BrowserRouter>
  );
};

export default App;
