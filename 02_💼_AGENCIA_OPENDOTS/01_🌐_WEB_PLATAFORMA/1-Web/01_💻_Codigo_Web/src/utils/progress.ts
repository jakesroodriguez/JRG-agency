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
