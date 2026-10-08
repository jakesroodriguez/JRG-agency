import * as THREE from "three";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setCharTimeline, setAllTimeline } from "../../utils/GsapScroll";

export const getCameraConfig = (width: number, height: number) => {
  const aspect = width / height;
  if (aspect < 0.6) {
    // Mobile portrait (smartphones) - perfectly centered
    return {
      fov: 22,
      position: new THREE.Vector3(0, 11.2, 36),
      zoom: 1.0,
    };
  } else if (aspect < 1.0) {
    // Tablet portrait (iPads, tablets)
    return {
      fov: 18,
      position: new THREE.Vector3(0.18, 12.2, 29),
      zoom: 1.05,
    };
  } else {
    // Desktop / Landscape
    return {
      fov: 14.5,
      position: new THREE.Vector3(0, 13.1, 24.7),
      zoom: 1.1,
    };
  }
};

export default function handleResize(
  renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera,
  canvasDiv: React.RefObject<HTMLDivElement>,
  character: THREE.Object3D
) {
  if (!canvasDiv.current) return;
  const canvas3d = canvasDiv.current.getBoundingClientRect();
  const width = canvas3d.width;
  const height = canvas3d.height;
  if (width === 0 || height === 0) return;

  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2.5));
  const config = getCameraConfig(width, height);
  camera.aspect = width / height;
  camera.fov = config.fov;
  camera.position.copy(config.position);
  camera.zoom = config.zoom;
  camera.updateProjectionMatrix();

  const workTrigger = ScrollTrigger.getById("work");
  ScrollTrigger.getAll().forEach((trigger) => {
    if (trigger !== workTrigger) {
      trigger.kill();
    }
  });

  setCharTimeline(character, camera);
  setAllTimeline();
  ScrollTrigger.sort();
  ScrollTrigger.refresh();
}
