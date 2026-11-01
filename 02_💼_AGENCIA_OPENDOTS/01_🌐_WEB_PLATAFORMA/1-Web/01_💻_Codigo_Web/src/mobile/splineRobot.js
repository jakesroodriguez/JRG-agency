const SPLINE_SCENE = 'https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode';
const RUNTIME_URL = 'https://unpkg.com/@splinetool/runtime@1.9.82/build/runtime.js';
const ROBOT_ACCENT = '#a78bfa';

function applyRobotAccentDetails(app) {
  const objects = typeof app.getAllObjects === 'function' ? app.getAllObjects() : [];
  const detailName = /eye|light|led|glow|accent|detail|antenna|core|ring|visor|lens|stripe|tube|wire|energy|screen|panel|glass|neon|rim|bot/i;

  objects.forEach((obj) => {
    try {
      if (obj.intensity != null && obj.color != null) {
        obj.color = ROBOT_ACCENT;
      }

      const name = (obj.name || '').toLowerCase();
      const isDetail = detailName.test(name);
      const material = obj.material;

      if (material?.layers?.length) {
        material.layers.forEach((layer) => {
          if (layer.type === 'fresnel') {
            layer.color = ROBOT_ACCENT;
            if (layer.factor != null) layer.factor = Math.max(layer.factor, 0.4);
          }
          if (layer.type === 'light' || layer.type === 'emissive') {
            layer.color = ROBOT_ACCENT;
          }
          if (isDetail && layer.type === 'color') {
            layer.color = ROBOT_ACCENT;
          }
        });
      }

      if (isDetail && obj.color != null) {
        obj.color = ROBOT_ACCENT;
      }
    } catch (_) {
      /* objeto sin material editable */
    }
  });

  // Alargar las piernas y los pies del robot manteniendo visible la parte de abajo
  objects.forEach((obj) => {
    try {
      const name = (obj.name || '').toLowerCase();
      if (/foot|feet|toe|pie/i.test(name)) {
        if (obj.scale) {
          obj.scale.y *= 1.30;
          obj.scale.z *= 1.30;
          if (typeof obj.updateMatrix === 'function') obj.updateMatrix();
        }
      } else if (/leg|pierna/i.test(name)) {
        if (obj.scale) {
          obj.scale.y *= 1.25;
          if (typeof obj.updateMatrix === 'function') obj.updateMatrix();
        }
      }
    } catch (_) {}
  });

  if (typeof app.requestRender === 'function') app.requestRender();
  if (typeof app._requestRenderAutoMode === 'function') app._requestRenderAutoMode();
}

function getClampedCoords(clientX, clientY) {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const padX = w * 0.22;
  const padTop = h * 0.16;
  const padBottom = h * 0.20;

  const minX = padX;
  const maxX = w - padX;
  const minY = padTop;
  const maxY = h - padBottom;

  let x = clientX;
  let y = clientY;

  if (x < minX) x = minX - (w * 0.025) * (1 - Math.exp(-(minX - x) / (w * 0.08 || 1)));
  else if (x > maxX) x = maxX + (w * 0.025) * (1 - Math.exp(-(x - maxX) / (w * 0.08 || 1)));

  if (y < minY) y = minY - (h * 0.025) * (1 - Math.exp(-(minY - y) / (h * 0.08 || 1)));
  else if (y > maxY) y = maxY + (h * 0.025) * (1 - Math.exp(-(y - maxY) / (h * 0.08 || 1)));

  return { x, y };
}

export async function initSplineRobot(hostElement) {
  if (!hostElement) return () => {};

  let isDestroyed = false;
  let simTimer = null;
  let gyroActive = false;
  let app = null;

  const applyInvisibleFrame = (e) => {
    if (!e || typeof e.clientX !== 'number') return;
    const { x, y } = getClampedCoords(e.clientX, e.clientY);

    try {
      Object.defineProperty(e, 'clientX', { get: () => x, configurable: true });
      Object.defineProperty(e, 'clientY', { get: () => y, configurable: true });
      Object.defineProperty(e, 'pageX', { get: () => x + (window.scrollX || 0), configurable: true });
      Object.defineProperty(e, 'pageY', { get: () => y + (window.scrollY || 0), configurable: true });
      Object.defineProperty(e, 'screenX', { get: () => x, configurable: true });
      Object.defineProperty(e, 'screenY', { get: () => y, configurable: true });
    } catch (_) {}
  };

  window.addEventListener('pointermove', applyInvisibleFrame, { capture: true, passive: true });
  window.addEventListener('pointerdown', applyInvisibleFrame, { capture: true, passive: true });

  const canvas = document.createElement('canvas');
  canvas.className = 'spline-canvas';
  hostElement.appendChild(canvas);

  const fallback = hostElement.querySelector('.spline-fallback');

  try {
    const { Application } = await import(/* @vite-ignore */ RUNTIME_URL);
    if (isDestroyed) {
      canvas.remove();
      return () => {};
    }

    app = new Application(canvas);

    const resize = () => {
      const w = hostElement.clientWidth;
      const h = hostElement.clientHeight;
      if (w > 0 && h > 0 && app) app.setSize(w, h);
    };

    resize();
    window.addEventListener('resize', resize);

    await app.load(SPLINE_SCENE);
    if (isDestroyed) {
      if (app && typeof app.dispose === 'function') app.dispose();
      canvas.remove();
      return () => {};
    }

    applyRobotAccentDetails(app);

    if (app.eventContext && typeof app.eventContext.updateRaycaster === 'function') {
      const originalRaycaster = app.eventContext.updateRaycaster.bind(app.eventContext);
      app.eventContext.updateRaycaster = function (t) {
        if (t && typeof t.clientX === 'number') {
          const { x, y } = getClampedCoords(t.clientX, t.clientY);
          try {
            Object.defineProperty(t, 'clientX', { get: () => x, configurable: true });
            Object.defineProperty(t, 'clientY', { get: () => y, configurable: true });
            Object.defineProperty(t, 'pageX', { get: () => x + (window.scrollX || 0), configurable: true });
            Object.defineProperty(t, 'pageY', { get: () => y + (window.scrollY || 0), configurable: true });
          } catch (_) {}
        }
        return originalRaycaster(t);
      };
    }

    if (fallback) fallback.remove();
    canvas.classList.add('is-ready');
    hostElement.classList.add('is-loaded');
    window.isSplineRobotReady = true;
    window.dispatchEvent(new CustomEvent('spline-robot-ready'));

    const handleOrientation = (e) => {
      const beta = e.beta;
      const gamma = e.gamma;
      if (beta === null || gamma === null) return;
      gyroActive = true;

      if (simTimer) {
        clearInterval(simTimer);
        simTimer = null;
      }

      const maxDeg = 30;
      const adjustedBeta = beta - 40;
      const clampedGamma = Math.max(-maxDeg, Math.min(maxDeg, gamma));
      const clampedBeta = Math.max(-maxDeg, Math.min(maxDeg, adjustedBeta));

      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const targetX = cx + (clampedGamma / maxDeg) * (window.innerWidth * 0.30);
      const targetY = cy + (clampedBeta / maxDeg) * (window.innerHeight * 0.25);

      const pointerEvt = new PointerEvent('pointermove', {
        clientX: targetX,
        clientY: targetY,
        bubbles: true,
      });
      canvas.dispatchEvent(pointerEvt);
    };

    const enableGyroscope = () => {
      if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission()
          .then((permissionState) => {
            if (permissionState === 'granted') {
              window.addEventListener('deviceorientation', handleOrientation, true);
            }
          })
          .catch(console.error);
      } else if ('DeviceOrientationEvent' in window) {
        window.addEventListener('deviceorientation', handleOrientation, true);
      }
    };

    enableGyroscope();

    if (window.innerWidth <= 900) {
      let angle = 0;
      simTimer = setInterval(() => {
        if (gyroActive) return;
        angle += 0.04;
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        const rx = window.innerWidth * 0.20;
        const ry = window.innerHeight * 0.16;

        const event = new PointerEvent('pointermove', {
          clientX: cx + Math.sin(angle) * rx,
          clientY: cy + Math.cos(angle * 1.3) * ry,
          bubbles: true,
        });
        canvas.dispatchEvent(event);
      }, 50);
    }

    const clearSim = (e) => {
      if (e.isTrusted && simTimer) {
        clearInterval(simTimer);
        simTimer = null;
      }
    };

    window.addEventListener('pointermove', clearSim, { passive: true });
    const handleTouchStart = () => {
      if (!gyroActive) enableGyroscope();
    };
    window.addEventListener('touchstart', handleTouchStart, { passive: true });

    setTimeout(() => {
      document.body.classList.remove('scroll-locked');
    }, 3500);

    return () => {
      isDestroyed = true;
      if (simTimer) clearInterval(simTimer);
      window.removeEventListener('pointermove', applyInvisibleFrame, { capture: true });
      window.removeEventListener('pointerdown', applyInvisibleFrame, { capture: true });
      window.removeEventListener('resize', resize);
      window.removeEventListener('deviceorientation', handleOrientation, true);
      window.removeEventListener('pointermove', clearSim);
      window.removeEventListener('touchstart', handleTouchStart);
      if (app && typeof app.dispose === 'function') {
        try {
          app.dispose();
        } catch (_) {}
      }
      canvas.remove();
    };
  } catch (err) {
    console.error('[Spline]', err);
    window.isSplineRobotReady = true;
    window.dispatchEvent(new CustomEvent('spline-robot-ready'));
    hostElement.innerHTML =
      '<div class="spline-error-msg"><strong>No se pudo cargar el robot 3D</strong><p>' +
      ((err && err.message) || 'Revisa tu conexión a internet o la URL de la escena.') +
      '</p></div>';
    document.body.classList.remove('scroll-locked');
    return () => {};
  }
}
