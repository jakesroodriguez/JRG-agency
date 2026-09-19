import * as THREE from "three";
import { gsap } from "gsap";

const createNeutralEnvironment = (renderer: THREE.WebGLRenderer) => {
  const studio = new THREE.Scene();
  studio.background = new THREE.Color(0x1e242c);

  // Shell exterior con tinte titanio pizarra
  const shell = new THREE.Mesh(
    new THREE.SphereGeometry(80, 32, 20),
    new THREE.MeshBasicMaterial({ color: 0x334155, side: THREE.BackSide })
  );
  studio.add(shell);

  const addSoftbox = (
    color: THREE.ColorRepresentation,
    position: [number, number, number],
    scale: [number, number, number]
  ) => {
    const panel = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({ color, toneMapped: false })
    );
    panel.position.set(...position);
    panel.scale.set(...scale);
    studio.add(panel);
  };

  // Panel trasero suave para reflejo de contorno sutil
  addSoftbox(0xd8dee9, [0, 10, -18], [18, 14, 0.3]);
  // Relleno lateral plata titanio
  addSoftbox(0xcbd5e1, [14, 12, 8], [10, 6, 0.3]);
  // Relleno frontal platino suave
  addSoftbox(0xe2e8f0, [-16, 10, 10], [8, 6, 0.3]);
  // Panel grafito de contraste
  addSoftbox(0x334155, [16, 4, 8], [8, 8, 0.3]);
  // Rebote inferior oscuro
  addSoftbox(0x1e293b, [0, -10, 4], [14, 6, 0.3]);
  // Luz de cielo difusa superior
  addSoftbox(0xc8d1dc, [0, 20, 0], [10, 8, 0.25]);

  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileCubemapShader();
  const target = pmrem.fromScene(studio, 0.07);
  pmrem.dispose();
  studio.traverse((node) => {
    if (node instanceof THREE.Mesh) {
      node.geometry.dispose();
      (node.material as THREE.Material).dispose();
    }
  });
  return target;
};

const setLighting = (scene: THREE.Scene, renderer: THREE.WebGLRenderer) => {
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0);
  directionalLight.position.set(-4, 8, 10);
  scene.add(directionalLight);

  const keyLight = new THREE.PointLight(0xf8f8f5, 0, 38, 2);
  keyLight.position.set(-5, 10, 8);
  scene.add(keyLight);

  const computerLight = new THREE.PointLight(0xffffff, 0, 26, 2.2);
  computerLight.position.set(3, 9, 5);
  scene.add(computerLight);

  // Luces de contorno suaves y atenuadas
  const rimLight = new THREE.DirectionalLight(0xf1f5f9, 0);
  rimLight.position.set(5, 7, -9);
  scene.add(rimLight);

  const rimLight2 = new THREE.DirectionalLight(0xcbd5e1, 0);
  rimLight2.position.set(-5, 6, -8);
  scene.add(rimLight2);

  // Luz hemisférica que toma cielo plata y tierra grafito del fondo
  const ambientLight = new THREE.HemisphereLight(0xe2e8f0, 0x1e293b, 0);
  scene.add(ambientLight);

  const environmentTarget = createNeutralEnvironment(renderer);
  scene.environment = environmentTarget.texture;
  scene.environmentIntensity = 0;

  const setPointLight = (screenGlow: THREE.Object3D | null) => {
    const material = (screenGlow as THREE.Mesh | null)?.material as
      | THREE.MeshStandardMaterial
      | undefined;
    const visible = Boolean(material?.opacity && material.opacity > 0.85);
    computerLight.intensity = visible ? 0.25 + (material?.emissiveIntensity ?? 0) * 0.8 : 0;
  };

  const turnOnLights = () => {
    const options = { duration: 1.5, ease: "power2.out" };
    gsap.to(directionalLight, { intensity: 1.1, ...options });
    gsap.to(keyLight, { intensity: 3.8, ...options, delay: 0.08 });
    gsap.to(rimLight, { intensity: 0.85, ...options, delay: 0.16 });
    gsap.to(rimLight2, { intensity: 0.60, ...options, delay: 0.16 });
    gsap.to(ambientLight, { intensity: 1.05, ...options });
    gsap.to(scene, { environmentIntensity: 0.45, ...options, delay: 0.1 });
    gsap.to(".character-rim", {
      y: "55%", opacity: 1, duration: 1.5, ease: "power2.out", delay: 0.15,
    });
  };

  const dispose = () => {
    scene.environment = null;
    environmentTarget.dispose();
  };

  return { setPointLight, turnOnLights, dispose };
};

export default setLighting;