import Lenis from "lenis";

export let lenis: Lenis | null = null;

export const setLenis = (instance: Lenis | null) => {
  lenis = instance;
  if (typeof window !== "undefined") {
    (window as any).lenis = instance;
  }
};
