import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { LandingConfig, defaultLandingConfig, HeroConfig, SectionItem } from "../config/landingConfig";

interface LandingConfigContextType {
  config: LandingConfig;
  updateHero: (partial: Partial<HeroConfig>) => void;
  updatePosition: (element: "logo" | "subtitle" | "cta", x: number, y: number) => void;
  updateSections: (sections: SectionItem[]) => void;
  toggleSection: (id: string, enabled: boolean) => void;
  moveSection: (index: number, direction: "up" | "down") => void;
  resetToDefaults: () => void;
  saveToLocalStorage: () => void;
  saveToCloud: () => Promise<{ success: boolean; message: string }>;
  isDirty: boolean;
  isSaving: boolean;
}

const STORAGE_KEY = "jrg_landing_config_v3";

const LandingConfigContext = createContext<LandingConfigContextType | null>(null);

export const LandingConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<LandingConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.version === defaultLandingConfig.version) {
          return {
            ...defaultLandingConfig,
            ...parsed,
            hero: {
              ...defaultLandingConfig.hero,
              ...(parsed.hero || {}),
              positionsMobile: {
                ...defaultLandingConfig.hero.positionsMobile,
                ...(parsed.hero?.positionsMobile || {}),
              },
            },
            sections: parsed.sections && parsed.sections.length ? parsed.sections : defaultLandingConfig.sections,
          };
        }
      }
    } catch {
      // Fallback to default
    }
    return defaultLandingConfig;
  });

  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Sync with cloud on initial mount
  useEffect(() => {
    let isMounted = true;
    const fetchCloudConfig = async () => {
      try {
        const res = await fetch("/api/landing-config");
        if (res.ok) {
          const cloudConfig = await res.json();
          if (cloudConfig && cloudConfig.hero && isMounted) {
            const savedLocal = localStorage.getItem(STORAGE_KEY);
            if (!savedLocal) {
              setConfig({
                ...defaultLandingConfig,
                ...cloudConfig,
                hero: {
                  ...defaultLandingConfig.hero,
                  ...(cloudConfig.hero || {}),
                  positionsMobile: {
                    ...defaultLandingConfig.hero.positionsMobile,
                    ...(cloudConfig.hero?.positionsMobile || {}),
                  },
                },
                sections: cloudConfig.sections || defaultLandingConfig.sections,
              });
            }
          }
        }
      } catch {
        // Cloud config unreachable, use local/default
      }
    };

    fetchCloudConfig();

    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === "JRG_CONFIG_UPDATE" && event.data.config) {
        setConfig(event.data.config);
      }
    };

    const handleStorage = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) setConfig(JSON.parse(saved));
      } catch {}
    };

    window.addEventListener("message", handleMessage);
    window.addEventListener("storage", handleStorage);

    return () => {
      isMounted = false;
      window.removeEventListener("message", handleMessage);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const updateHero = useCallback((partial: Partial<HeroConfig>) => {
    setConfig((prev) => {
      const next = {
        ...prev,
        updatedAt: new Date().toISOString(),
        hero: { ...prev.hero, ...partial },
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Ignore quota error
      }
      return next;
    });
    setIsDirty(true);
  }, []);

  const updatePosition = useCallback((element: "logo" | "subtitle" | "cta", x: number, y: number) => {
    setConfig((prev) => {
      const clampedX = Math.max(0, Math.min(92, Math.round(x * 10) / 10));
      const clampedY = Math.max(0, Math.min(95, Math.round(y * 10) / 10));

      const next = {
        ...prev,
        updatedAt: new Date().toISOString(),
        hero: {
          ...prev.hero,
          positionsMobile: {
            ...prev.hero.positionsMobile,
            [element]: { x: clampedX, y: clampedY },
          },
        },
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
    setIsDirty(true);
  }, []);

  const updateSections = useCallback((sections: SectionItem[]) => {
    setConfig((prev) => {
      const next = {
        ...prev,
        updatedAt: new Date().toISOString(),
        sections,
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Ignore
      }
      return next;
    });
    setIsDirty(true);
  }, []);

  const toggleSection = useCallback((id: string, enabled: boolean) => {
    setConfig((prev) => {
      const updated = prev.sections.map((sec) => (sec.id === id ? { ...sec, enabled } : sec));
      const next = {
        ...prev,
        updatedAt: new Date().toISOString(),
        sections: updated,
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Ignore
      }
      return next;
    });
    setIsDirty(true);
  }, []);

  const moveSection = useCallback((index: number, direction: "up" | "down") => {
    setConfig((prev) => {
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= prev.sections.length) return prev;

      const newSections = [...prev.sections];
      const temp = newSections[index];
      newSections[index] = newSections[targetIndex];
      newSections[targetIndex] = temp;

      const reordered = newSections.map((sec, idx) => ({ ...sec, order: idx + 1 }));

      const next = {
        ...prev,
        updatedAt: new Date().toISOString(),
        sections: reordered,
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Ignore
      }
      return next;
    });
    setIsDirty(true);
  }, []);

  const resetToDefaults = useCallback(() => {
    setConfig(defaultLandingConfig);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
    setIsDirty(false);
  }, []);

  const saveToLocalStorage = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
      setIsDirty(false);
    } catch {
      // Ignore
    }
  }, [config]);

  const saveToCloud = useCallback(async (): Promise<{ success: boolean; message: string }> => {
    setIsSaving(true);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));

      const res = await fetch("/api/landing-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });

      if (res.ok) {
        setIsDirty(false);
        setIsSaving(false);
        return { success: true, message: "¡Configuración publicada con éxito en el dominio!" };
      } else {
        const err = await res.json().catch(() => ({}));
        setIsSaving(false);
        return {
          success: false,
          message: err.error || "No se pudo sincronizar con la nube, pero se ha guardado en tu navegador.",
        };
      }
    } catch {
      setIsSaving(false);
      return {
        success: true,
        message: "Guardado localmente en tu navegador. Para desplegar a todos los usuarios, pulsa 'Descargar Config' o 'Copiar JSON'.",
      };
    }
  }, [config]);

  return (
    <LandingConfigContext.Provider
      value={{
        config,
        updateHero,
        updatePosition,
        updateSections,
        toggleSection,
        moveSection,
        resetToDefaults,
        saveToLocalStorage,
        saveToCloud,
        isDirty,
        isSaving,
      }}
    >
      {children}
    </LandingConfigContext.Provider>
  );
};

export const useLandingConfig = () => {
  const context = useContext(LandingConfigContext);
  if (!context) {
    return {
      config: defaultLandingConfig,
      updateHero: () => {},
      updatePosition: () => {},
      updateSections: () => {},
      toggleSection: () => {},
      moveSection: () => {},
      resetToDefaults: () => {},
      saveToLocalStorage: () => {},
      saveToCloud: async () => ({ success: false, message: "No provider" }),
      isDirty: false,
      isSaving: false,
    };
  }
  return context;
};
