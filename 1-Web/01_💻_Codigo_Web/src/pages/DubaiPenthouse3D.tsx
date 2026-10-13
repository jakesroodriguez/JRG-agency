import { Component, Suspense, useMemo, useRef, useState, useEffect, type ReactNode, type RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, OrbitControls, useGLTF, Stars } from "@react-three/drei";
import * as THREE from "three";
import { SkeletonUtils, type OrbitControls as OrbitControlsImpl } from "three-stdlib";
import type { Agent } from "./AgentOrchestratorPage";

// ============================================================================
// 1. LAYOUT ESPACIAL DE LA PENTHOUSE EN DUBAI (PISO 60)
// ============================================================================

const MODEL = (n: string) => `/office-assets/models/furniture/${n}.glb`;

export interface Waypoint {
  id: string;
  name: string;
  shortLabel: string;
  pos: [number, number, number];
  target: [number, number, number];
  agentId?: string;
  tag: string;
}

export const DUBAI_WAYPOINTS: Waypoint[] = [
  {
    id: "ceo",
    name: "Despacho Presidencial",
    shortLabel: "CEO Desk",
    pos: [-7.0, 1.72, -1.8],
    target: [-7.0, 1.2, -3.5],
    agentId: "jrg-aitor",
    tag: "DESPACHO CEO",
  },
  {
    id: "maider",
    name: "Estación Maider (Scraping)",
    shortLabel: "Maider",
    pos: [-2.5, 1.72, -2.4],
    target: [-2.5, 1.1, -4.1],
    agentId: "jrg-maider",
    tag: "LEAD INTEL",
  },
  {
    id: "iker",
    name: "Estación Iker (Copywriting)",
    shortLabel: "Iker",
    pos: [1.8, 1.72, -2.4],
    target: [1.8, 1.1, -4.1],
    agentId: "jrg-iker",
    tag: "COPY SALES",
  },
  {
    id: "unai",
    name: "Estación Unai (Tech Lab)",
    shortLabel: "Unai",
    pos: [-2.5, 1.72, 0.8],
    target: [-2.5, 1.1, -0.9],
    agentId: "jrg-unai",
    tag: "TECH DEV",
  },
  {
    id: "elena",
    name: "Estación Elena (Data / ROI)",
    shortLabel: "Elena",
    pos: [1.8, 1.72, 0.8],
    target: [1.8, 1.1, -0.9],
    agentId: "jrg-elena",
    tag: "DATA / ROI",
  },
  {
    id: "boardroom",
    name: "Sala de Juntas VIP",
    shortLabel: "Juntas VIP",
    pos: [7.5, 1.72, -3.5],
    target: [7.5, 1.1, -5.2],
    tag: "BOARDROOM",
  },
  {
    id: "terrace",
    name: "Mirador Dubai & Helipuerto",
    shortLabel: "Terraza Dubai",
    pos: [4.5, 1.72, 7.5],
    target: [4.5, 1.5, 25.0],
    tag: "PISO 60 VIEW",
  },
];

export const PENTHOUSE_LAYOUT: Record<string, { pos: [number, number, number]; rot: number; label: string }> = {
  "jrg-aitor": { pos: [-7.0, 0, -3.5], rot: 0, label: "Despacho Presidencial (CEO / Ops)" },
  "jrg-maider": { pos: [-2.5, 0, -3.8], rot: 0, label: "Estación de Inteligencia & Scraping" },
  "jrg-iker": { pos: [1.8, 0, -3.8], rot: 0, label: "Estación de Copywriting & Ventas" },
  "jrg-unai": { pos: [-2.5, 0, -0.6], rot: 0, label: "Tech Lab & Arquitectura Web" },
  "jrg-elena": { pos: [1.8, 0, -0.6], rot: 0, label: "Analítica & Finanzas (ROI / Kit Digital)" },
};

// ============================================================================
// 2. GENERADORES DE TEXTURAS PROCEDURALES PBR
// ============================================================================

function makeNeroMarquina(w: number, d: number): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = c.height = 512;
  const g = c.getContext("2d")!;

  g.fillStyle = "#0c0d12";
  g.fillRect(0, 0, 512, 512);

  g.strokeStyle = "rgba(220, 225, 235, 0.12)";
  g.lineWidth = 1.8;
  g.beginPath();
  g.moveTo(0, 80);
  g.bezierCurveTo(120, 140, 240, 60, 512, 220);
  g.stroke();

  g.strokeStyle = "rgba(240, 245, 255, 0.08)";
  g.lineWidth = 3.2;
  g.beginPath();
  g.moveTo(180, 0);
  g.bezierCurveTo(280, 200, 320, 340, 480, 512);
  g.stroke();

  g.strokeStyle = "rgba(200, 210, 225, 0.06)";
  g.lineWidth = 1.2;
  g.beginPath();
  g.moveTo(0, 380);
  g.bezierCurveTo(140, 320, 340, 420, 512, 380);
  g.stroke();

  g.strokeStyle = "rgba(0, 0, 0, 0.45)";
  g.lineWidth = 2;
  g.strokeRect(0, 0, 512, 512);

  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(w / 3.0, d / 3.0);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

function makeTerracePavement(w: number, d: number): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 256;
  const g = c.getContext("2d")!;

  g.fillStyle = "#161720";
  g.fillRect(0, 0, 256, 256);

  g.strokeStyle = "rgba(8, 9, 14, 0.85)";
  g.lineWidth = 3;
  g.strokeRect(1, 1, 254, 254);

  g.fillStyle = "rgba(255, 255, 255, 0.02)";
  for (let i = 0; i < 400; i++) {
    const rx = Math.random() * 256;
    const ry = Math.random() * 256;
    g.fillRect(rx, ry, 2, 2);
  }

  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(w / 2.0, d / 2.0);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}


function makeHighwayTraffic(colorStr: string): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 32;
  const g = c.getContext("2d")!;
  g.fillStyle = "rgba(0, 0, 0, 0)";
  g.fillRect(0, 0, 512, 32);

  for (let i = 0; i < 36; i++) {
    const x = (i * 14.5) % 500;
    const len = 8 + (i % 5) * 6;
    g.fillStyle = colorStr;
    g.fillRect(x, 10, len, 12);
  }

  const t = new THREE.CanvasTexture(c);
  t.wrapS = THREE.RepeatWrapping;
  t.wrapT = THREE.ClampToEdgeWrapping;
  t.repeat.set(6, 1);
  return t;
}

// ============================================================================
// 3. UTILIDADES DE MODELOS GLB
// ============================================================================

function useFitted(url: string, width: number) {
  const gltf = useGLTF(url);
  return useMemo(() => {
    const root = gltf.scene.clone(true);
    root.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });
    const box = new THREE.Box3().setFromObject(root);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const s = width / Math.max(size.x, 0.0001);
    const wrap = new THREE.Group();
    root.position.set(-center.x, -box.min.y, -center.z);
    wrap.add(root);
    wrap.scale.setScalar(s);
    return { obj: wrap, size: size.clone().multiplyScalar(s) };
  }, [gltf, width]);
}

class Safe extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function Prop({
  name,
  width,
  pos,
  rot = 0,
}: {
  name: string;
  width: number;
  pos: [number, number, number];
  rot?: number;
}) {
  const m = useFitted(MODEL(name), width);
  return <primitive object={m.obj} position={pos} rotation-y={rot} />;
}

// ============================================================================
// 4. SKYLINE PROCEDURAL DE DUBAI (BURJ KHALIFA, 38 RASCACIELOS Y AUTOPISTAS)
// ============================================================================

function DubaiSkyline() {
  const gltf = useGLTF("/models/dubai_cityscape.glb");
  const trafficNorthTex = useMemo(() => makeHighwayTraffic("rgba(255, 235, 160, 0.95)"), []);
  const trafficSouthTex = useMemo(() => makeHighwayTraffic("rgba(244, 63, 94, 0.95)"), []);
  const beaconLightRef = useRef<THREE.PointLight>(null);

  useFrame((_, delta) => {
    // Tráfico vehicular animado fluido en ambas direcciones
    trafficNorthTex.offset.x -= delta * 0.42;
    trafficSouthTex.offset.x += delta * 0.38;

    // Baliza de aviación parpadeante en la cúspide
    const t = performance.now() * 0.001;
    const isFlash = Math.sin(t * 3.8) > 0.3;
    if (beaconLightRef.current) {
      beaconLightRef.current.intensity = isFlash ? 3.5 : 0.2;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* 123 Torres y Rascacielos Creados con Blender 5.2 */}
      <primitive object={gltf.scene} scale={1.25} position={[0, -4, 0]} />

      {/* Baliza roja de aviación en la torre principal */}
      <pointLight ref={beaconLightRef} position={[28, 125, -75]} color="#ef4444" intensity={2.5} distance={140} />

      {/* Estelas de tráfico fluido en Sheikh Zayed Road */}
      <mesh position={[0, -18.5, -42]} rotation={[-Math.PI / 2, 0, -0.2]}>
        <planeGeometry args={[260, 0.6]} />
        <meshBasicMaterial map={trafficNorthTex} transparent opacity={0.95} color="#ffe082" />
      </mesh>
      <mesh position={[0, -18.5, -44]} rotation={[-Math.PI / 2, 0, -0.2]}>
        <planeGeometry args={[260, 0.6]} />
        <meshBasicMaterial map={trafficSouthTex} transparent opacity={0.95} color="#ff3b50" />
      </mesh>
    </group>
  );
}

useGLTF.preload("/models/dubai_cityscape.glb");

// ============================================================================
// 5. ESTRUCTURA ARQUITECTÓNICA DE LA PENTHOUSE
// ============================================================================

function HelipadBeacons() {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        const pulse = 0.4 + 0.6 * Math.sin(t * 3.5 + i * 0.78);
        const mesh = child as THREE.Mesh;
        if (mesh && mesh.material) {
          (mesh.material as THREE.MeshBasicMaterial).opacity = Math.max(0.2, pulse);
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const a = (i / 8) * Math.PI * 2;
        return (
          <mesh key={`beacon-${i}`} position={[Math.cos(a) * 3.3, 0.03, Math.sin(a) * 3.3]}>
            <cylinderGeometry args={[0.07, 0.07, 0.07, 8]} />
            <meshBasicMaterial color="#f59e0b" transparent opacity={0.85} />
          </mesh>
        );
      })}
    </group>
  );
}

function PenthouseArchitecture() {
  const marbleTex = useMemo(() => makeNeroMarquina(24, 18), []);
  const terraceTex = useMemo(() => makeTerracePavement(18, 12), []);

  return (
    <group position={[0, 0, 0]}>
      {/* Suelo Interior: Mármol Negro Nero Marquina */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -1]} receiveShadow>
        <planeGeometry args={[24, 16]} />
        <meshStandardMaterial map={marbleTex} roughness={0.14} metalness={0.16} />
      </mesh>

      {/* Suelo Exterior: Terraza Voladiza */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[2.5, 0.005, 8.5]} receiveShadow>
        <planeGeometry args={[19, 9]} />
        <meshStandardMaterial map={terraceTex} roughness={0.4} metalness={0.2} />
      </mesh>

      {/* Helipuerto Privado en la Terraza */}
      <group position={[4.5, 0.015, 8.5]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[3.2, 3.4, 36]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.85} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-0.9, 0, 0]}>
          <planeGeometry args={[0.35, 2.2]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.9, 0, 0]}>
          <planeGeometry args={[0.35, 2.2]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <planeGeometry args={[1.6, 0.35]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <HelipadBeacons />
      </group>

      {/* Barandillas de Vidrio en la Terraza */}
      <group position={[2.5, 0.6, 13.0]}>
        <mesh>
          <boxGeometry args={[19, 1.2, 0.05]} />
          <meshPhysicalMaterial color="#ffffff" transparent opacity={0.3} roughness={0.05} transmission={0.9} ior={1.5} />
        </mesh>
        <mesh position={[0, -0.55, 0]}>
          <boxGeometry args={[19, 0.1, 0.1]} />
          <meshStandardMaterial color="#27272a" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* Ventanales Panorámicos Fachada Norte */}
      <group position={[0, 1.8, -8.9]}>
        <mesh>
          <boxGeometry args={[24, 3.6, 0.06]} />
          <meshPhysicalMaterial color="#181a24" transparent opacity={0.25} roughness={0.08} transmission={0.88} />
        </mesh>
        {[-8, -4, 0, 4, 8].map((x) => (
          <mesh key={`mullion-${x}`} position={[x, 0, 0]}>
            <boxGeometry args={[0.12, 3.6, 0.16]} />
            <meshStandardMaterial color="#181920" metalness={0.8} roughness={0.2} />
          </mesh>
        ))}
      </group>

      {/* Paredes Interiores de Lujo */}
      <mesh position={[-6.0, 1.8, 6.9]}>
        <boxGeometry args={[12, 3.6, 0.28]} />
        <meshStandardMaterial color="#121319" roughness={0.8} />
      </mesh>
      <mesh position={[-12.0, 1.8, -1.0]}>
        <boxGeometry args={[0.28, 3.6, 16]} />
        <meshStandardMaterial color="#101117" roughness={0.85} />
      </mesh>

      {/* Pérgola Arquitectónica de Techo Abierto (Open-Air Penthouse hacia los Rascacielos) */}
      <group position={[0, 3.8, -1]}>
        {/* Vigas estructurales perimetrales oscuras */}
        <mesh position={[0, 0, -8]}>
          <boxGeometry args={[24.2, 0.22, 0.28]} />
          <meshStandardMaterial color="#16171f" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0, 8]}>
          <boxGeometry args={[24.2, 0.22, 0.28]} />
          <meshStandardMaterial color="#16171f" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Vigas transversales estilizadas */}
        {[-10, -5, 0, 5, 10].map((bx) => (
          <mesh key={`beam-${bx}`} position={[bx, 0.05, 0]}>
            <boxGeometry args={[0.2, 0.18, 16]} />
            <meshStandardMaterial color="#12131a" metalness={0.85} roughness={0.3} />
          </mesh>
        ))}
        {/* Líneas LED suaves en las vigas */}
        {[-8, -3, 3, 8].map((lx) => (
          <mesh key={`led-${lx}`} position={[lx, -0.05, 0]}>
            <boxGeometry args={[0.06, 0.02, 14]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// ============================================================================
// 6. PERSONAJES HUMANOS EJECUTIVOS RIGGEADOS Y HALOS DE SUELO BIOMÉTRICOS
// ============================================================================

function FloorHalo({
  pos,
  isNear,
  isSelected,
  initials,
  onSelect,
}: {
  pos: [number, number, number];
  isNear: boolean;
  isSelected: boolean;
  initials: string;
  onSelect: () => void;
}) {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ringRef.current) {
      const mat = ringRef.current.material as THREE.MeshBasicMaterial;
      if (mat) {
        const baseOpacity = isSelected ? 0.95 : isNear ? 0.8 : 0.22;
        const pulse = Math.sin(t * 3.5) * 0.08;
        mat.opacity = THREE.MathUtils.lerp(mat.opacity, baseOpacity + (isNear || isSelected ? pulse : 0), 0.1);
      }
    }
  });

  return (
    <group position={[pos[0], 0.006, pos[2] + 0.7]}>
      {/* Anillo exterior concéntrico */}
      <mesh
        ref={ringRef}
        rotation={[-Math.PI / 2, 0, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
      >
        <ringGeometry args={[1.05, 1.15, 48]} />
        <meshBasicMaterial color={isSelected ? "#ffffff" : isNear ? "#e4e4e7" : "#71717a"} transparent opacity={0.3} />
      </mesh>

      {/* Anillo interior fino */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.78, 0.82, 36]} />
        <meshBasicMaterial color={isSelected || isNear ? "#ffffff" : "#52525b"} transparent opacity={isSelected ? 0.8 : isNear ? 0.5 : 0.15} />
      </mesh>

      {/* Monograma de iniciales sobre el mármol */}
      <Html
        position={[0, 0.01, 0]}
        center
        distanceFactor={8}
        transform
        rotation={[-Math.PI / 2, 0, 0]}
        style={{ pointerEvents: "none" }}
      >
        <div
          style={{
            fontFamily: "var(--font-mono, monospace)",
            fontSize: "12px",
            fontWeight: 800,
            letterSpacing: "3px",
            color: isSelected ? "#ffffff" : isNear ? "#f4f4f5" : "rgba(255, 255, 255, 0.35)",
            textShadow: isSelected || isNear ? "0 0 12px rgba(255, 255, 255, 0.9)" : "none",
            userSelect: "none",
          }}
        >
          {initials}
        </div>
      </Html>
    </group>
  );
}

// ============================================================================
// 6. PERFILES DE IDENTIDAD VISUAL, ESTILO Y CINEMÁTICA POR AGENTE JRG
// ============================================================================

interface AgentVisualProfile {
  scale: number;
  yOffset: number;
  shirtColor: string;
  shirtRoughness: number;
  shirtMetalness: number;
  pantColor: string;
  pantRoughness: number;
  shoeColor: string;
  soleColor: string;
  hairColor: string;
  hairRoughness: number;
  skinColor: string;
  screenColor: string;
  screenEmissive: string;
  screenIntensity: number;
  typingSpeed: number;
  roleBadge: string;
  badgeColor: string;
}

const AGENT_PROFILES: Record<string, AgentVisualProfile> = {
  "jrg-aitor": {
    scale: 0.125, // Porte de líder directivo (~1.90m)
    yOffset: -0.04,
    shirtColor: "#0b0c10", // Traje sastre negro medianoche de corte italiano
    shirtRoughness: 0.45,
    shirtMetalness: 0.28,
    pantColor: "#14151c",
    pantRoughness: 0.65,
    shoeColor: "#040407", // Oxford negro charol
    soleColor: "#27272a",
    hairColor: "#090a0f", // Pelo negro azabache engominado
    hairRoughness: 0.6,
    skinColor: "#e5b993",
    screenColor: "#161720",
    screenEmissive: "#f59e0b", // Terminal financiera ámbar / gold
    screenIntensity: 1.3,
    typingSpeed: 0.85, // Pausado, seguro y autoritario
    roleBadge: "CEO & DIRECTOR",
    badgeColor: "#f59e0b",
  },
  "jrg-maider": {
    scale: 0.118, // Femenina ejecutiva tech (~1.74m)
    yOffset: -0.04,
    shirtColor: "#e4e4e7", // Blazer sastre marfil / blanco roto con cuello oscuro
    shirtRoughness: 0.6,
    shirtMetalness: 0.1,
    pantColor: "#27272a",
    pantRoughness: 0.75,
    shoeColor: "#18181b",
    soleColor: "#f4f4f5",
    hairColor: "#3e2723", // Castaño chocolate elegante con brillo
    hairRoughness: 0.5,
    skinColor: "#fad7bc", // Tono claro natural
    screenColor: "#082f49",
    screenEmissive: "#06b6d4", // Matriz de scraping / OSINT cian neón
    screenIntensity: 1.6,
    typingSpeed: 1.38, // Ráfagas rápidas de extracción de datos
    roleBadge: "LEAD SCOUT",
    badgeColor: "#06b6d4",
  },
  "jrg-iker": {
    scale: 0.122, // Copywriter y ventas (~1.80m)
    yOffset: -0.04,
    shirtColor: "#1e293b", // Sobrecamisa índigo oscuro / creative lead
    shirtRoughness: 0.8,
    shirtMetalness: 0.05,
    pantColor: "#0f172a",
    pantRoughness: 0.8,
    shoeColor: "#181920",
    soleColor: "#ffffff",
    hairColor: "#1c1917", // Pelo castaño oscuro texturizado
    hairRoughness: 0.75,
    skinColor: "#dfb08c",
    screenColor: "#064e3b",
    screenEmissive: "#22c55e", // WhatsApp engine verde esmeralda
    screenIntensity: 1.3,
    typingSpeed: 0.98, // Cadencia creativa con pausas
    roleBadge: "PITCH & COPY",
    badgeColor: "#22c55e",
  },
  "jrg-unai": {
    scale: 0.124, // Tech Architect (~1.84m)
    yOffset: -0.04,
    shirtColor: "#18181b", // Tech crewneck grafito con ribetes
    shirtRoughness: 0.85,
    shirtMetalness: 0.15,
    pantColor: "#09090b",
    pantRoughness: 0.85,
    shoeColor: "#27272a",
    soleColor: "#09090b",
    hairColor: "#18181b", // Degradado oscuro
    hairRoughness: 0.8,
    skinColor: "#e5b89a",
    screenColor: "#1e1b4b",
    screenEmissive: "#3b82f6", // IDE VS Code azul eléctrico
    screenIntensity: 1.8,
    typingSpeed: 1.52, // Programación ultra-rápida
    roleBadge: "TECH ARCHITECT",
    badgeColor: "#3b82f6",
  },
  "jrg-elena": {
    scale: 0.119, // Data & Growth Analyst (~1.75m)
    yOffset: -0.04,
    shirtColor: "#1a1d2e", // Traje azul noche elegante de finanzas
    shirtRoughness: 0.55,
    shirtMetalness: 0.22,
    pantColor: "#11131f",
    pantRoughness: 0.75,
    shoeColor: "#0d0e17",
    soleColor: "#fde047",
    hairColor: "#1c1410", // Morena con acabado satinado
    hairRoughness: 0.45,
    skinColor: "#f7d2b5",
    screenColor: "#451a03",
    screenEmissive: "#f59e0b", // Dashboard de ROI & métricas Kit Digital
    screenIntensity: 1.4,
    typingSpeed: 0.92, // Precisión analítica
    roleBadge: "GROWTH & ROI",
    badgeColor: "#f59e0b",
  },
};

function RiggedCorporateAgent({
  agent,
  pos,
  rot = 0,
  isNear,
  isSelected,
  onSelect,
  ceoPos,
}: {
  agent: Agent;
  pos: [number, number, number];
  rot?: number;
  isNear: boolean;
  isSelected: boolean;
  onSelect: () => void;
  ceoPos?: [number, number, number];
}) {
  const gltf = useGLTF("/models/agent_rigged.glb");
  const profile = AGENT_PROFILES[agent.id] || AGENT_PROFILES["jrg-aitor"];

  const clone = useMemo(() => {
    try {
      const sceneClone = SkeletonUtils.clone(gltf.scene);
      sceneClone.traverse((o) => {
        if ((o as THREE.Mesh).isMesh) {
          const mesh = o as THREE.Mesh;
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          const name = (mesh.name || "").toLowerCase();

          // 1. Traje y chaqueta sastre personalizado
          if (name.includes("shirt") || name.includes("cube.002")) {
            mesh.material = new THREE.MeshStandardMaterial({
              color: profile.shirtColor,
              roughness: profile.shirtRoughness,
              metalness: profile.shirtMetalness,
            });
          }
          // 2. Pantalón de vestir específico
          else if (name.includes("pant")) {
            mesh.material = new THREE.MeshStandardMaterial({
              color: profile.pantColor,
              roughness: profile.pantRoughness,
              metalness: 0.08,
            });
          }
          // 3. Calzado ejecutivo de piel
          else if (name.includes("shoe")) {
            mesh.material = new THREE.MeshStandardMaterial({
              color: profile.shoeColor,
              roughness: 0.28,
              metalness: 0.35,
            });
          }
          // 4. Suela de zapatos
          else if (name.includes("sole")) {
            mesh.material = new THREE.MeshStandardMaterial({
              color: profile.soleColor,
              roughness: 0.4,
            });
          }
          // 5. Cabello estilizado con su tono exacto
          else if (name.includes("hair")) {
            mesh.material = new THREE.MeshStandardMaterial({
              color: profile.hairColor,
              roughness: profile.hairRoughness,
            });
          }
          // 6. Piel (Manos, cuello, cabeza)
          else if (name.includes("hand") || name.includes("neck") || name.includes("ear")) {
            mesh.material = new THREE.MeshStandardMaterial({
              color: profile.skinColor,
              roughness: 0.55,
            });
          }
          // 7. Pantalla de portátil temática por rol
          else if (name.includes("screen") || name.includes("glass")) {
            mesh.material = new THREE.MeshStandardMaterial({
              color: profile.screenColor,
              emissive: profile.screenEmissive,
              emissiveIntensity: profile.screenIntensity,
              roughness: 0.15,
            });
          }
        }
      });
      return sceneClone;
    } catch {
      return gltf.scene.clone(true);
    }
  }, [gltf.scene, profile]);

  const mixer = useMemo(() => new THREE.AnimationMixer(clone), [clone]);

  useEffect(() => {
    const typingClip = THREE.AnimationClip.findByName(gltf.animations, "typing");
    if (typingClip) {
      const action = mixer.clipAction(typingClip);
      action.setLoop(THREE.LoopRepeat, Infinity);
      const speed = isSelected
        ? profile.typingSpeed * 0.4
        : isNear
        ? profile.typingSpeed * 0.7
        : profile.typingSpeed;
      action.timeScale = speed;
      if (!action.isRunning()) action.play();
    }

    const blinkClip = THREE.AnimationClip.findByName(gltf.animations, "Blink");
    if (blinkClip) {
      const action = mixer.clipAction(blinkClip);
      action.setLoop(THREE.LoopRepeat, Infinity);
      action.timeScale = 0.8 + (agent.floor % 3) * 0.12;
      if (!action.isRunning()) action.play();
    }
  }, [mixer, gltf.animations, profile.typingSpeed, isNear, isSelected, agent.floor]);

  useEffect(() => {
    return () => {
      mixer.stopAllAction();
    };
  }, [mixer]);

  // Seguimiento de cabeza cinemático hacia el CEO (Jakes) al aproximarse
  useFrame((state, delta) => {
    mixer.update(delta);

    const head = clone.getObjectByName("spine.006") || clone.getObjectByName("spine006") || clone.getObjectByName("head");
    if (head) {
      if (ceoPos && (isNear || isSelected)) {
        // Calcular ángulo exacto hacia la posición del CEO en la penthouse
        const dx = ceoPos[0] - pos[0];
        const dz = ceoPos[2] - (pos[2] + 0.7);
        const worldAngle = Math.atan2(dx, dz);
        const relAngle = worldAngle - (rot + Math.PI);
        const clampedY = THREE.MathUtils.clamp(relAngle, -1.2, 1.2);
        head.rotation.y = THREE.MathUtils.lerp(head.rotation.y, clampedY, 0.08);
        head.rotation.x = THREE.MathUtils.lerp(head.rotation.x, -0.15, 0.08); // mira hacia arriba al CEO
      } else {
        const t = state.clock.getElapsedTime();
        head.rotation.y = THREE.MathUtils.lerp(head.rotation.y, Math.sin(t * 1.2 + agent.floor) * 0.08, 0.05);
        head.rotation.x = THREE.MathUtils.lerp(head.rotation.x, 0.14, 0.05); // mira la pantalla
      }
    }
  });

  return (
    <group>
      {/* Halo Biométrico en el Suelo */}
      <FloorHalo
        pos={pos}
        isNear={isNear}
        isSelected={isSelected}
        initials={agent.emoji}
        onSelect={onSelect}
      />

      {/* Modelo Humanoide Escala Completa y Personalizado */}
      <group
        position={[pos[0], pos[1], pos[2] + 0.7]}
        rotation={[0, rot + Math.PI, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
      >
        <primitive object={clone} scale={profile.scale} position={[0, profile.yOffset, 0]} />
      </group>
    </group>
  );
}

useGLTF.preload("/models/agent_rigged.glb");

// ============================================================================
// 7. MOBILIARIO DE ALTO NIVEL & ESTACIONES TEMÁTICAS PERSONALIZADAS
// ============================================================================

function PenthouseFurniture({
  agents,
  selectedId,
  nearAgentId,
  onSelect,
  ceoPos,
}: {
  agents: Agent[];
  selectedId: string;
  nearAgentId: string | null;
  onSelect: (id: string) => void;
  ceoPos?: [number, number, number];
}) {
  return (
    <>
      {/* Despacho del CEO con Mesa de Nogal y Detalles Presidenciales */}
      <group position={[-7.0, 0, -3.5]}>
        <Prop name="deskCorner" width={2.8} pos={[0, 0, 0]} rot={0} />
        <Prop name="chairDesk" width={0.9} pos={[0, 0, 0.8]} rot={Math.PI} />
        <Prop name="computerScreen" width={1.2} pos={[0, 1.05, -0.3]} rot={0} />
        <Prop name="lampRoundFloor" width={0.6} pos={[-1.6, 0, -0.8]} />
        <Prop name="bookcaseClosed" width={2.0} pos={[-4.5, 0, -0.5]} rot={Math.PI / 2} />

        {/* Accesorios Despacho CEO Aitor: Reloj/Trofeo dorado & espresso */}
        <mesh position={[-0.95, 1.13, 0.15]}>
          <cylinderGeometry args={[0.045, 0.055, 0.16, 16]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.15} />
        </mesh>
        <mesh position={[0.65, 1.085, 0.1]}>
          <cylinderGeometry args={[0.035, 0.03, 0.07, 12]} />
          <meshStandardMaterial color="#09090b" roughness={0.3} />
        </mesh>
      </group>

      {/* Estaciones de Trabajo de los Especialistas */}
      <Safe>
        {/* Estación Maider: Scraping & Lead Intel */}
        <group position={[-2.5, 0, -3.8]}>
          <Prop name="desk" width={2.0} pos={[0, 0, 0]} rot={0} />
          <Prop name="chairDesk" width={0.8} pos={[0, 0, 0.7]} rot={Math.PI} />
          {/* Monitor secundario vertical de terminal de datos */}
          <mesh position={[0.65, 1.35, -0.22]} rotation={[0, -0.25, 0]}>
            <boxGeometry args={[0.30, 0.50, 0.03]} />
            <meshStandardMaterial color="#082f49" emissive="#06b6d4" emissiveIntensity={1.4} />
          </mesh>
        </group>

        {/* Estación Iker: Copywriting & WhatsApp Sales */}
        <group position={[1.8, 0, -3.8]}>
          <Prop name="desk" width={2.0} pos={[0, 0, 0]} rot={0} />
          <Prop name="chairDesk" width={0.8} pos={[0, 0, 0.7]} rot={Math.PI} />
          {/* Auriculares de estudio sobre la mesa */}
          <group position={[0.62, 1.06, -0.12]} rotation={[0, 0.35, 0]}>
            <mesh>
              <torusGeometry args={[0.065, 0.016, 8, 24, Math.PI]} />
              <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
            </mesh>
          </group>
        </group>

        {/* Estación Unai: Tech Lab & Arquitectura Web */}
        <group position={[-2.5, 0, -0.6]}>
          <Prop name="desk" width={2.0} pos={[0, 0, 0]} rot={0} />
          <Prop name="chairDesk" width={0.8} pos={[0, 0, 0.7]} rot={Math.PI} />
          {/* Teclado mecánico con brillo RGB sutil */}
          <mesh position={[0, 1.055, 0.02]}>
            <boxGeometry args={[0.38, 0.018, 0.12]} />
            <meshStandardMaterial color="#09090b" emissive="#3b82f6" emissiveIntensity={0.6} />
          </mesh>
        </group>

        {/* Estación Elena: Analítica & Subvenciones Kit Digital */}
        <group position={[1.8, 0, -0.6]}>
          <Prop name="desk" width={2.0} pos={[0, 0, 0]} rot={0} />
          <Prop name="chairDesk" width={0.8} pos={[0, 0, 0.7]} rot={Math.PI} />
          {/* Tablet financiera con gráfico de barras ROI */}
          <mesh position={[0.55, 1.055, 0.05]} rotation={[-Math.PI / 2, 0, 0.12]}>
            <planeGeometry args={[0.22, 0.30]} />
            <meshStandardMaterial color="#451a03" emissive="#f59e0b" emissiveIntensity={1.1} />
          </mesh>
        </group>
      </Safe>

      {/* Personajes Humanos Ejecutivos Riggeados, Escala Grande y Animados */}
      {agents.map((ag) => {
        const layout = PENTHOUSE_LAYOUT[ag.id];
        if (!layout) return null;
        return (
          <Safe key={`fig-${ag.id}`}>
            <RiggedCorporateAgent
              agent={ag}
              pos={layout.pos}
              rot={layout.rot}
              isNear={nearAgentId === ag.id}
              isSelected={selectedId === ag.id}
              onSelect={() => onSelect(ag.id)}
              ceoPos={ceoPos}
            />
          </Safe>
        );
      })}

      {/* Sala de Juntas VIP */}
      <Safe>
        <Prop name="tableRound" width={2.8} pos={[7.5, 0, -3.5]} />
        {[0, 1.25, 2.5, 3.75, 5.0].map((a) => (
          <Prop
            key={`board-chair-${a}`}
            name="chairModernCushion"
            width={0.75}
            pos={[7.5 + Math.sin(a) * 1.8, 0, -3.5 + Math.cos(a) * 1.8]}
            rot={a + Math.PI}
          />
        ))}
      </Safe>

      {/* Lounge Ejecutivo & Barra */}
      <Safe>
        <Prop name="loungeSofa" width={2.6} pos={[-7.0, 0, 3.5]} rot={0} />
        <Prop name="tableCoffee" width={1.4} pos={[-7.0, 0, 2.1]} />
        <Prop name="loungeDesignChair" width={0.95} pos={[-5.2, 0, 2.1]} rot={-Math.PI / 2} />
        <Prop name="kitchenCoffeeMachine" width={0.65} pos={[-10.5, 0.9, 4.5]} rot={Math.PI / 2} />
        <Prop name="kitchenCabinet" width={1.8} pos={[-10.5, 0, 4.5]} rot={Math.PI / 2} />
        <Prop name="pottedPlant" width={0.8} pos={[-11.0, 0, -7.8]} />
        <Prop name="pottedPlant" width={0.8} pos={[10.5, 0, -7.8]} />
      </Safe>

      {/* Placas de Identificación Monocromáticas de los Agentes */}
      {agents.map((ag) => {
        const layout = PENTHOUSE_LAYOUT[ag.id];
        if (!layout) return null;
        const isSel = ag.id === selectedId;

        return (
          <group key={`station-${ag.id}`} position={layout.pos}>
            <Html
              position={[0, 2.05, 0]}
              center
              distanceFactor={8.5}
              zIndexRange={[20, 0]}
              style={{ pointerEvents: "auto", cursor: "pointer" }}
            >
              <div
                className={`hm-plate ${isSel ? "selected" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(ag.id);
                }}
              >
                <div className="hm-plate-top">
                  <span className="hm-plate-name">{ag.name}</span>
                  <span className="hm-plate-dot" />
                </div>
                <span className="hm-plate-sub">{ag.role}</span>
              </div>
            </Html>
          </group>
        );
      })}
    </>
  );
}

// ============================================================================
// 7.5 AVATAR 3D DEL CEO (JAKES) EN TERCERA PERSONA (CREADO EN BLENDER 5.2)
// ============================================================================

function CEOAvatar({
  position,
  rotationY,
  isMoving,
}: {
  position: [number, number, number];
  rotationY: number;
  isMoving: boolean;
}) {
  const gltf = useGLTF("/models/ceo_avatar.glb");
  const clone = useMemo(() => {
    try {
      if (!gltf || !gltf.scene) return new THREE.Group();
      const sceneClone = SkeletonUtils.clone(gltf.scene);
      sceneClone.traverse((o) => {
        if ((o as THREE.Mesh).isMesh) {
          o.castShadow = true;
          o.receiveShadow = true;
        }
      });
      return sceneClone;
    } catch {
      return gltf?.scene ? gltf.scene.clone(true) : new THREE.Group();
    }
  }, [gltf]);

  const mixer = useMemo(() => {
    try {
      return new THREE.AnimationMixer(clone);
    } catch {
      return null;
    }
  }, [clone]);

  useEffect(() => {
    if (!mixer || !gltf.animations || gltf.animations.length === 0) return;
    try {
      const idleClip = THREE.AnimationClip.findByName(gltf.animations, "Idle");
      const walkClip = THREE.AnimationClip.findByName(gltf.animations, "Walk");

      const idleAction = idleClip ? mixer.clipAction(idleClip) : null;
      const walkAction = walkClip ? mixer.clipAction(walkClip) : null;

      if (isMoving && walkAction) {
        walkAction.reset().fadeIn(0.15).play();
        if (idleAction) idleAction.fadeOut(0.15);
      } else if (idleAction) {
        idleAction.reset().fadeIn(0.2).play();
        if (walkAction) walkAction.fadeOut(0.2);
      }
    } catch {
      // Guard against animation errors
    }

    return () => {
      mixer.stopAllAction();
    };
  }, [mixer, gltf.animations, isMoving]);

  useFrame((_, delta) => {
    if (mixer) mixer.update(delta);
  });

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Monograma / Tag Flotante del CEO */}
      <Html position={[0, 2.30, 0]} center distanceFactor={8} style={{ pointerEvents: "none" }}>
        <div className="hm-ceo-tag">
          <span className="hm-ceo-badge">CEO</span>
          <span className="hm-ceo-name">JAKES RODRIGUEZ</span>
        </div>
      </Html>

      {/* Modelo Humanoide 3D del CEO Exportado de Blender 5.2 */}
      <primitive object={clone} scale={1.0} position={[0, 0, 0]} />
    </group>
  );
}

useGLTF.preload("/models/ceo_avatar.glb");

// ============================================================================
// 8. CONTROLADOR DE TERCERA PERSONA (WASD + MIRA DE RATÓN + WAYPOINTS)
// ============================================================================

function ThirdPersonController({
  navMode,
  activeWaypoint,
  controls,
  agents,
  onNearAgent,
  mobileInput,
  mouseDelta,
  onUpdatePlayer,
}: {
  navMode: "walk" | "orbit";
  activeWaypoint: Waypoint | null;
  controls: RefObject<OrbitControlsImpl>;
  agents: Agent[];
  onNearAgent: (agentId: string | null) => void;
  mobileInput: { forward: boolean; backward: boolean; left: boolean; right: boolean };
  mouseDelta: RefObject<{ x: number; y: number }>;
  onUpdatePlayer: (pos: [number, number, number], rot: number, moving: boolean) => void;
}) {
  const keys = useRef({ forward: false, backward: false, left: false, right: false });
  const playerPos = useRef<THREE.Vector3>(new THREE.Vector3(-7.0, 0, -1.8));
  const playerRot = useRef<number>(0);
  const yaw = useRef<number>(Math.PI);
  const pitch = useRef<number>(0.12);
  const isNavigatingRef = useRef(false);
  const targetPlayerPos = useRef<THREE.Vector3>(new THREE.Vector3(-7.0, 0, -1.8));

  // Escuchar teclado para caminar en Tercera Persona (W, A, S, D y Flechas)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const targetTag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (targetTag === "input" || targetTag === "textarea") return;

      const key = (e.key || "").toLowerCase();
      const code = e.code || "";
      let handled = false;

      if (code === "KeyW" || key === "w" || code === "ArrowUp") {
        keys.current.forward = true;
        isNavigatingRef.current = false;
        handled = true;
      }
      if (code === "KeyS" || key === "s" || code === "ArrowDown") {
        keys.current.backward = true;
        isNavigatingRef.current = false;
        handled = true;
      }
      if (code === "KeyA" || key === "a" || code === "ArrowLeft") {
        keys.current.left = true;
        isNavigatingRef.current = false;
        handled = true;
      }
      if (code === "KeyD" || key === "d" || code === "ArrowRight") {
        keys.current.right = true;
        isNavigatingRef.current = false;
        handled = true;
      }

      if (handled && navMode === "walk") {
        // Evitar scroll con flechas mientras se camina
        if (code.startsWith("Arrow")) e.preventDefault();
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      const key = (e.key || "").toLowerCase();
      const code = e.code || "";
      if (code === "KeyW" || key === "w" || code === "ArrowUp") keys.current.forward = false;
      if (code === "KeyS" || key === "s" || code === "ArrowDown") keys.current.backward = false;
      if (code === "KeyA" || key === "a" || code === "ArrowLeft") keys.current.left = false;
      if (code === "KeyD" || key === "d" || code === "ArrowRight") keys.current.right = false;
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [navMode]);

  // Teletransporte / Waypoint seleccionado
  useEffect(() => {
    if (activeWaypoint) {
      targetPlayerPos.current.set(activeWaypoint.pos[0], 0, activeWaypoint.pos[2]);
      const dx = activeWaypoint.target[0] - activeWaypoint.pos[0];
      const dz = activeWaypoint.target[2] - activeWaypoint.pos[2];
      yaw.current = Math.atan2(dx, dz);
      isNavigatingRef.current = true;
    }
  }, [activeWaypoint]);

  useFrame((state, delta) => {
    const c = controls.current;

    // 1. MODO ÓRBITA / VISTA AÉREA
    if (navMode === "orbit") {
      if (c) {
        c.enabled = true;
      }
      onUpdatePlayer(
        [playerPos.current.x, playerPos.current.y, playerPos.current.z],
        playerRot.current,
        false
      );
      return;
    }

    // 2. MODO TERCERA PERSONA CEO (WASD + MIRA DE RATÓN)
    if (c) {
      c.enabled = false; // Desactivar OrbitControls para control total de cámara de acción
    }

    // Aplicar movimiento de ratón a la orientación de la mirada (yaw & pitch)
    if (mouseDelta.current) {
      if (mouseDelta.current.x !== 0 || mouseDelta.current.y !== 0) {
        yaw.current -= mouseDelta.current.x * 0.0032;
        pitch.current = THREE.MathUtils.clamp(
          pitch.current - mouseDelta.current.y * 0.0028,
          -0.35,
          0.70
        );
        mouseDelta.current.x = 0;
        mouseDelta.current.y = 0;
      }
    }

    // Teletransporte suave si hay waypoint en progreso
    if (isNavigatingRef.current) {
      playerPos.current.lerp(targetPlayerPos.current, 0.12);
      if (playerPos.current.distanceTo(targetPlayerPos.current) < 0.05) {
        playerPos.current.copy(targetPlayerPos.current);
        isNavigatingRef.current = false;
      }
    }

    // Inputs de movimiento (Teclado WASD + Móvil D-Pad)
    const fInput = (keys.current.forward || mobileInput.forward ? 1 : 0) - (keys.current.backward || mobileInput.backward ? 1 : 0);
    const sInput = (keys.current.right || mobileInput.right ? 1 : 0) - (keys.current.left || mobileInput.left ? 1 : 0);
    const isMoving = fInput !== 0 || sInput !== 0;

    if (isMoving && !isNavigatingRef.current) {
      // Vector de dirección de movimiento relativo al ángulo de la mira (yaw)
      const forwardVec = new THREE.Vector3(Math.sin(yaw.current), 0, Math.cos(yaw.current));
      const rightVec = new THREE.Vector3(-Math.cos(yaw.current), 0, Math.sin(yaw.current));
      const moveDir = forwardVec.multiplyScalar(fInput).add(rightVec.multiplyScalar(sInput)).normalize();

      // Rotación suave del personaje hacia la dirección en la que camina
      const targetAngle = Math.atan2(moveDir.x, moveDir.z);
      let angleDiff = targetAngle - playerRot.current;
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      playerRot.current += angleDiff * Math.min(1, 14 * delta);

      // Desplazamiento con velocidad cinemática
      const moveSpeed = 4.8 * delta;
      const nextX = playerPos.current.x + moveDir.x * moveSpeed;
      const nextZ = playerPos.current.z + moveDir.z * moveSpeed;

      // Colisiones perimetrales de la Penthouse de Dubai
      let minX = -10.5, maxX = 10.5, minZ = -7.5, maxZ = 5.0;
      if (playerPos.current.z > 5.0 || nextZ > 5.0) {
        minX = -5.5; maxX = 10.5; maxZ = 12.0; // Terraza panorámica y helipuerto
      }

      playerPos.current.x = THREE.MathUtils.clamp(nextX, minX, maxX);
      playerPos.current.z = THREE.MathUtils.clamp(nextZ, minZ, maxZ);
    }

    // Posición y seguimiento de la cámara en Tercera Persona (Chase Camera)
    const camDist = 3.3;
    const targetLook = new THREE.Vector3(
      playerPos.current.x,
      playerPos.current.y + 1.35,
      playerPos.current.z
    );

    const cosP = Math.cos(pitch.current);
    const sinP = Math.sin(pitch.current);
    const sinY = Math.sin(yaw.current);
    const cosY = Math.cos(yaw.current);

    const camX = targetLook.x - sinY * cosP * camDist;
    const camY = targetLook.y + sinP * camDist + 0.35;
    const camZ = targetLook.z - cosY * cosP * camDist;

    const camDesiredPos = new THREE.Vector3(camX, camY, camZ);
    state.camera.position.lerp(camDesiredPos, 0.18);
    state.camera.lookAt(targetLook.x, targetLook.y + 0.15, targetLook.z);

    // Actualizar estado del avatar hacia el padre
    onUpdatePlayer(
      [playerPos.current.x, playerPos.current.y, playerPos.current.z],
      playerRot.current,
      isMoving
    );

    // Detección de proximidad con los agentes ejecutivos
    let closestId: string | null = null;
    let closestDist = 999;
    for (const ag of agents) {
      const layout = PENTHOUSE_LAYOUT[ag.id];
      if (layout) {
        const dist = Math.hypot(playerPos.current.x - layout.pos[0], playerPos.current.z - layout.pos[2]);
        if (dist < 2.4 && dist < closestDist) {
          closestDist = dist;
          closestId = ag.id;
        }
      }
    }
    onNearAgent(closestId);
  });

  return null;
}

// ============================================================================
// 9. ESCENA EXPORTADA: PENTHOUSE PRESIDENCIAL DE DUBAI (TERCERA PERSONA)
// ============================================================================

export default function DubaiPenthouse({
  agents,
  selectedId,
  focusId,
  isMobile,
  drawerOpen = false,
  onSelect,
}: {
  agents: Agent[];
  selectedId: string;
  focusId?: string | null;
  isMobile: boolean;
  drawerOpen?: boolean;
  onSelect: (id: string) => void;
}) {
  const controls = useRef<OrbitControlsImpl>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [navMode, setNavMode] = useState<"walk" | "orbit">("walk");
  const [activeWaypoint, setActiveWaypoint] = useState<Waypoint | null>(DUBAI_WAYPOINTS[0]);
  const [nearAgentId, setNearAgentId] = useState<string | null>(null);
  const [mobileInput, setMobileInput] = useState({ forward: false, backward: false, left: false, right: false });

  // Estado del Avatar 3D del CEO
  const [playerPos, setPlayerPos] = useState<[number, number, number]>([-7.0, 0, -1.8]);
  const [playerRot, setPlayerRot] = useState<number>(0);
  const [isPlayerMoving, setIsPlayerMoving] = useState<boolean>(false);

  // Estados de control con ratón y Pointer Lock
  const [isPointerLocked, setIsPointerLocked] = useState<boolean>(false);
  const mouseDelta = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isMouseDownRef = useRef<boolean>(false);
  const lastMousePos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Escuchar eventos de ratón para control de mira (Mouse Aim)
  useEffect(() => {
    const handlePointerLockChange = () => {
      const container = canvasContainerRef.current;
      const isLocked = !!container && document.pointerLockElement === container.querySelector("canvas");
      setIsPointerLocked(isLocked);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (document.pointerLockElement) {
        mouseDelta.current.x += e.movementX;
        mouseDelta.current.y += e.movementY;
      } else if (isMouseDownRef.current) {
        // Modo arrastre de ratón sin bloqueo de puntero
        const dx = e.clientX - lastMousePos.current.x;
        const dy = e.clientY - lastMousePos.current.y;
        lastMousePos.current = { x: e.clientX, y: e.clientY };
        mouseDelta.current.x += dx;
        mouseDelta.current.y += dy;
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 0 || e.button === 2) {
        isMouseDownRef.current = true;
        lastMousePos.current = { x: e.clientX, y: e.clientY };
      }
    };

    const handleMouseUp = () => {
      isMouseDownRef.current = false;
    };

    document.addEventListener("pointerlockchange", handlePointerLockChange);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("pointerlockchange", handlePointerLockChange);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  // Solicitar Pointer Lock al hacer clic en el canvas
  const handleCanvasClick = () => {
    if (navMode === "walk" && canvasContainerRef.current) {
      const canvasEl = canvasContainerRef.current.querySelector("canvas");
      if (canvasEl && document.pointerLockElement !== canvasEl) {
        canvasEl.requestPointerLock?.();
      }
    }
  };

  // Cuando se selecciona un agente en el UI exterior o drawer, viajar automáticamente a su puesto
  useEffect(() => {
    const targetAgentId = focusId || selectedId;
    if (targetAgentId) {
      const wp = DUBAI_WAYPOINTS.find((w) => w.agentId === targetAgentId);
      if (wp) {
        setActiveWaypoint(wp);
      }
    }
  }, [focusId, selectedId]);

  // Escuchar tecla 'E' para hablar con el agente cercano
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.code === "KeyE" || e.key === "e") && nearAgentId) {
        onSelect(nearAgentId);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nearAgentId, onSelect]);

  const nearAgent = useMemo(() => agents.find((a) => a.id === nearAgentId), [agents, nearAgentId]);

  return (
    <div
      ref={canvasContainerRef}
      style={{ position: "relative", width: "100%", height: "100%", cursor: navMode === "walk" ? "crosshair" : "default" }}
      onClick={handleCanvasClick}
    >
      {/* BARRA DE NAVEGACIÓN Y WAYPOINTS */}
      <div className={`jrg-waypoints-dock ${!drawerOpen ? "drawer-closed" : ""}`}>
        {/* Selector de Modo: Tercera Persona CEO vs Vista Aérea */}
        <button
          className="jrg-mode-toggle-pill"
          onClick={(e) => {
            e.stopPropagation();
            const nextMode = navMode === "walk" ? "orbit" : "walk";
            setNavMode(nextMode);
            if (nextMode === "orbit") {
              setActiveWaypoint({
                id: "orbit_overview",
                name: "Vista Aérea Penthouse",
                shortLabel: "Vista Aérea",
                pos: [14, 11, 14],
                target: [0, 1.0, 0],
                tag: "AÉREA",
              });
            } else {
              setActiveWaypoint(DUBAI_WAYPOINTS[0]);
            }
          }}
          title={navMode === "walk" ? "Cambiar a Vista Aérea Órbita" : "Cambiar a Tercera Persona CEO"}
        >
          {navMode === "walk" ? "🎮 3ª PERSONA" : "🛸 VISTA AÉREA"}
        </button>

        {/* Píldoras de Teletransporte a los 7 Waypoints */}
        {DUBAI_WAYPOINTS.map((wp) => (
          <button
            key={`wp-${wp.id}`}
            className={`jrg-waypoint-btn ${activeWaypoint?.id === wp.id ? "active" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              setActiveWaypoint(wp);
              if (wp.agentId) onSelect(wp.agentId);
            }}
          >
            <span>{wp.shortLabel}</span>
          </button>
        ))}
      </div>

      {/* RETÍCULA / MIRA DE ACCIÓN EN TERCERA PERSONA */}
      {navMode === "walk" && (
        <>
          <div className="jrg-aim-crosshair">
            <span className="cross-dot" />
          </div>
          {!isMobile && (
            <div className="jrg-mouse-aim-hint">
              {isPointerLocked
                ? "🎯 MIRA ACTIVA (ESC para liberar ratón)"
                : "🎯 HAZ CLIC PARA ACTIVAR LA MIRA / ARRASTRA EL RATÓN (WASD para caminar)"}
            </div>
          )}
        </>
      )}

      {/* PASTILLA FLOTANTE DE INTERACCIÓN POR PROXIMIDAD */}
      {nearAgent && (
        <div
          className="jrg-proximity-bubble"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(nearAgent.id);
          }}
          title="Hablar con este especialista"
        >
          <span className="jrg-proximity-badge">{isMobile ? "TOCAR" : "PULSA 'E'"}</span>
          <span>Hablar con {nearAgent.name} ({nearAgent.role})</span>
        </div>
      )}

      {/* D-PAD TÁCTIL PARA MÓVIL EN TERCERA PERSONA */}
      {isMobile && navMode === "walk" && (
        <div className="jrg-mobile-dpad">
          <button
            className="jrg-dpad-btn up"
            onTouchStart={(e) => { e.preventDefault(); setMobileInput((s) => ({ ...s, forward: true })); }}
            onTouchEnd={() => setMobileInput((s) => ({ ...s, forward: false }))}
          >
            ▲
          </button>
          <div className="jrg-dpad-row">
            <button
              className="jrg-dpad-btn left"
              onTouchStart={(e) => { e.preventDefault(); setMobileInput((s) => ({ ...s, left: true })); }}
              onTouchEnd={() => setMobileInput((s) => ({ ...s, left: false }))}
            >
              ◄
            </button>
            <button
              className="jrg-dpad-btn down"
              onTouchStart={(e) => { e.preventDefault(); setMobileInput((s) => ({ ...s, backward: true })); }}
              onTouchEnd={() => setMobileInput((s) => ({ ...s, backward: false }))}
            >
              ▼
            </button>
            <button
              className="jrg-dpad-btn right"
              onTouchStart={(e) => { e.preventDefault(); setMobileInput((s) => ({ ...s, right: true })); }}
              onTouchEnd={() => setMobileInput((s) => ({ ...s, right: false }))}
            >
              ►
            </button>
          </div>
        </div>
      )}

      {/* CANVAS THREE.JS DE LA PENTHOUSE DE DUBAI */}
      <Canvas
        shadows
        dpr={[1, isMobile ? 1.5 : 2]}
        camera={{
          position: [-7.0, 1.72, -1.8],
          fov: isMobile ? 54 : 48,
          near: 0.1,
          far: 450,
        }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.15;
        }}
      >
        <color attach="background" args={["#08090f"]} />
        <fog attach="fog" args={["#08090f", 60, 280]} />

        {/* Cielo Estrellado Sobre la Penthouse sin Techo */}
        <Stars radius={180} depth={60} count={3500} factor={4} saturation={0} fade speed={1.2} />

        {/* Iluminación Arquitectónica de Alta Gama */}
        <ambientLight intensity={0.45} color="#181b28" />
        <hemisphereLight args={["#222538", "#0d0e14", 0.65]} />

        <directionalLight
          position={[16, 28, 12]}
          intensity={1.8}
          color="#fff5e8"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-left={-22}
          shadow-camera-right={22}
          shadow-camera-top={22}
          shadow-camera-bottom={-22}
          shadow-camera-near={1}
          shadow-camera-far={90}
          shadow-bias={-0.0004}
        />
        <directionalLight position={[-15, 12, -25]} intensity={0.9} color="#9ec4ff" />

        {/* Controles de Órbita (Activos únicamente en modo Vista Aérea) */}
        <OrbitControls
          ref={controls}
          enableDamping
          dampingFactor={0.06}
          enablePan={false}
          minDistance={3}
          maxDistance={45}
          maxPolarAngle={Math.PI / 2.05}
          target={[-7.0, 1.2, -6.5]}
        />

        {/* Controlador en Tercera Persona con WASD y Mira de Ratón */}
        <ThirdPersonController
          navMode={navMode}
          activeWaypoint={activeWaypoint}
          controls={controls}
          agents={agents}
          onNearAgent={setNearAgentId}
          mobileInput={mobileInput}
          mouseDelta={mouseDelta}
          onUpdatePlayer={(pos, rot, moving) => {
            setPlayerPos(pos);
            setPlayerRot(rot);
            setIsPlayerMoving(moving);
          }}
        />

        <Suspense fallback={null}>
          {/* Avatar 3D del CEO (Jakes) en Tercera Persona */}
          <Safe>
            <CEOAvatar
              position={playerPos}
              rotationY={playerRot}
              isMoving={isPlayerMoving}
            />
          </Safe>

          {/* 123 Rascacielos de Dubai Creados en Blender 5.2 */}
          <Safe>
            <DubaiSkyline />
          </Safe>

          {/* Estructura Arquitectónica Penthouse con Techo Abierto */}
          <PenthouseArchitecture />

          {/* Mobiliario y Agentes Humanos Ejecutivos */}
          <Safe>
            <PenthouseFurniture
              agents={agents}
              selectedId={selectedId}
              nearAgentId={nearAgentId}
              onSelect={onSelect}
              ceoPos={playerPos}
            />
          </Safe>
        </Suspense>

        {/* Rótulo Arquitectónico JRG en la Penthouse */}
        <Html position={[-6.0, 3.2, 6.7]} center distanceFactor={10} style={{ pointerEvents: "none" }}>
          <div className="hm-neon-sign">
            <img
              src="/logoJRG.png"
              alt="JRG"
              style={{ width: "20px", height: "20px", borderRadius: "50%", background: "#fff" }}
            />
            <span>JRG AGENCY · DUBAI HQ</span>
          </div>
        </Html>
      </Canvas>
    </div>
  );
}
