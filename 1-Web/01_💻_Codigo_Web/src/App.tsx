import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import "./App.css";

const MobileLanding = lazy(() => import("./mobile/MobileLanding"));
const MyWorks = lazy(() => import("./pages/MyWorks"));
const Play = lazy(() => import("./pages/Play"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const DemoPreview = lazy(() => import("./pages/DemoPreview"));

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

const App = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route
          path="/"
          element={
            <Suspense fallback={<div style={{ minHeight: '100vh', background: '#f4f7fb' }} />}>
              <MobileLanding />
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
      </Routes>
      <Analytics />
      <SpeedInsights />
    </BrowserRouter>
  );
};

export default App;
