import { useEffect, useRef } from "react";
import * as THREE from "three";
import setCharacter from "./utils/character";
import setLighting from "./utils/lighting";
import { useLoading } from "../../context/LoadingProvider";
import handleResize, { getCameraConfig } from "./utils/resizeUtils";
import {
  handleMouseMove,
  handleTouchEnd,
  handleHeadRotation,
  handleTouchMove,
} from "./utils/mouseUtils";
import setAnimations from "./utils/animationUtils";
import { setProgress } from "../Loading";
import { setAllTimeline, setCharTimeline } from "../utils/GsapScroll";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { lenis } from "../Navbar";

const Scene = () => {
  const canvasDiv = useRef<HTMLDivElement | null>(null);
  const hoverDivRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef(new THREE.Scene());
  const { setLoading } = useLoading();

  useEffect(() => {
    if (!canvasDiv.current) return;
    const rect = canvasDiv.current.getBoundingClientRect();
    const width = rect.width || window.innerWidth;
    const height = rect.height || window.innerHeight;
    const scene = sceneRef.current;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    canvasDiv.current.appendChild(renderer.domElement);

    const cameraConfig = getCameraConfig(width, height);
    const camera = new THREE.PerspectiveCamera(
      cameraConfig.fov,
      width / height,
      0.1,
      1000
    );
    camera.position.copy(cameraConfig.position);
    camera.zoom = cameraConfig.zoom;
    camera.updateProjectionMatrix();

    let disposed = false;
    let headBone: THREE.Object3D | null = null;
    let screenGlow: THREE.Object3D | null = null;
    let character: THREE.Object3D | null = null;
    let animationController: ReturnType<typeof setAnimations> | null = null;
    let hoverCleanup: (() => void) | undefined;
    let frameId = 0;
    const clock = new THREE.Clock();
    const light = setLighting(scene, renderer);
    const progress = setProgress((value) => setLoading(value));
    const { loadCharacter } = setCharacter(renderer, scene, camera);

    loadCharacter()
      .then((gltf) => {
        if (disposed || !gltf) return;
        animationController = setAnimations(gltf);
        hoverCleanup = hoverDivRef.current
          ? animationController.hover(gltf, hoverDivRef.current)
          : undefined;
        character = gltf.scene;
        scene.add(character);
        setCharTimeline(character, camera);
        setAllTimeline();
        ScrollTrigger.sort();
        ScrollTrigger.refresh();
        lenis?.resize();
        headBone = character.getObjectByName("spine006") || null;
        screenGlow = character.getObjectByName("screenlight") || null;
        progress.loaded().then(() => {
          if (disposed) return;
          window.setTimeout(() => {
            if (!disposed) {
              light.turnOnLights();
              animationController?.startIntro();
            }
          }, 850);
        });
      })
      .catch((error) => {
        console.error("No se pudo cargar la escena 3D:", error);
        progress.loaded();
      });

    const onResize = () => {
      if (character) handleResize(renderer, camera, canvasDiv, character);
    };

    let mouse = { x: 0, y: 0 };
    let interpolation = { x: 0.1, y: 0.2 };

    const onMouseMove = (event: MouseEvent) =>
      handleMouseMove(event, (x, y) => {
        mouse = { x, y };
      });

    const onTouchMove = (event: TouchEvent) => {
      if (event.touches.length > 0) {
        handleTouchMove(event, (x, y) => {
          mouse = { x, y };
        });
      }
    };

    const onTouchEnd = () =>
      handleTouchEnd((x, y, interpolationX, interpolationY) => {
        mouse = { x, y };
        interpolation = { x: interpolationX, y: interpolationY };
      });

    window.addEventListener("resize", onResize);
    document.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      if (headBone) {
        handleHeadRotation(
          headBone,
          mouse.x,
          mouse.y,
          interpolation.x,
          interpolation.y,
          THREE.MathUtils.lerp
        );
        light.setPointLight(screenGlow);
      }
      animationController?.update(delta, clock.elapsedTime);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      hoverCleanup?.();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      light.dispose();
      scene.clear();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div className="character-container">
      <div className="character-model" ref={canvasDiv}>
        <div className="character-rim" />
        <div className="character-hover" ref={hoverDivRef} />
      </div>
    </div>
  );
};

export default Scene;