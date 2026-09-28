import { lazy, Suspense, useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import "./App.css";

const CharacterModel = lazy(() => import("./components/Character"));
const MainContainer = lazy(() => import("./components/MainContainer"));
const MyWorks = lazy(() => import("./pages/MyWorks"));
const Play = lazy(() => import("./pages/Play"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const MobileLanding = lazy(() => import("./mobile/MobileLanding"));

import { LoadingProvider } from "./context/LoadingProvider";
import AlmoayyedBackground from "./components/AlmoayyedBackground";

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
    return window.innerWidth <= breakpoint;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= breakpoint);
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
      {!isMobile && <AlmoayyedBackground />}
      <Routes>
        <Route
          path="/"
          element={
            isMobile ? (
              <Suspense fallback={<div style={{ minHeight: '100vh', background: '#f4f7fb' }} />}>
                <MobileLanding />
              </Suspense>
            ) : (
              <LoadingProvider>
                <Suspense>
                  <MainContainer>
                    <Suspense>
                      <CharacterModel />
                    </Suspense>
                  </MainContainer>
                </Suspense>
              </LoadingProvider>
            )
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
      </Routes>
      <Analytics />
      <SpeedInsights />
    </BrowserRouter>
  );
};

export default App;
