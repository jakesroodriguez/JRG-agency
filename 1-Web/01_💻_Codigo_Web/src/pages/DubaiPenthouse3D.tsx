import { Component, Suspense, useMemo, useRef, type ReactNode, type RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import type { Agent } from "./AgentOrchestratorPage";

// ============================================================================
// 1. LAYOUT ESPACIAL DE LA PENTHOUSE EN DUBAI (PISO 60)
// ============================================================================

const MODEL = (n: string) => `/office-assets/models/furniture/${n}.glb`;

export const PENTHOUSE_LAYOUT: Record<string, { pos: [number, number, number]; rot: number; label: string }> = {
  "jrg-aitor": { pos: [-7.0, 0, -3.5], rot: 0, label: "Despacho Presidencial (CEO / Ops)" },
  "jrg-maider": { pos: [-2.5, 0, -3.8], rot: 0, label: "Estación de Inteligencia & Scraping" },
  "jrg-iker": { pos: [1.8, 0, -3.8], rot: 0, label: "Estación de Copywriting & Ventas" },
  "jrg-unai": { pos: [-2.5, 0, -0.6], rot: 0, label: "Tech Lab & Arquitectura Web" },
  "jrg-elena": { pos: [1.8, 0, -0.6], rot: 0, label: "Analítica & Finanzas (ROI / Kit Digital)" },
};

// ============================================================================
// 2. GENERADORES DE TEXTURAS PROCEDURALES PBR DE ALTO RENDIMIENTO
// ============================================================================

// Mármol Nero Marquina para el suelo interior
function makeNeroMarquina(w: number, d: number): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = c.height = 512;
  const g = c.getContext("2d")!;

  // Base oscura profunda
  g.fillStyle = "#0c0d12";
  g.fillRect(0, 0, 512, 512);

  // Vetas orgánicas de cuarzo blanco translúcido
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

  // Junta de baldosas de 2m x 2m
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

// Pavimento de losas exteriores para la terraza volada
function makeTerracePavement(w: number, d: number): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const g = c.getContext("2d")!;

  g.fillStyle = "#161720";
  g.fillRect(0, 0, 256, 256);

  // Cuadrícula de losas de hormigón arquitectónico
  g.strokeStyle = "rgba(8, 9, 14, 0.85)";
  g.lineWidth = 3;
  g.strokeRect(1, 1, 254, 254);

  // Micro-textura de grano de piedra
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

// Textura de ventanas iluminadas para los rascacielos lejanos de Dubai
function makeSkyscraperWindows(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 128;
  c.height = 256;
  const g = c.getContext("2d")!;

  g.fillStyle = "#06070a";
  g.fillRect(0, 0, 128, 256);

  const rows = 32;
  const cols = 16;
  const rw = 128 / cols;
  const rh = 256 / rows;

  const lightColors = [
    "rgba(255, 235, 175, 0.85)", // Dorado Dubai cálido
    "rgba(220, 235, 255, 0.80)", // Blanco frío moderno
    "rgba(255, 255, 255, 0.90)", // Blanco puro
    "rgba(200, 220, 240, 0.40)", // Tenue
  ];

  for (let r = 0; r < rows; r++) {
    for (let col = 0; col < cols; col++) {
      if (Math.random() > 0.45) {
        g.fillStyle = lightColors[Math.floor(Math.random() * lightColors.length)];
        g.fillRect(col * rw + 1.5, r * rh + 1.5, rw - 3, rh - 3);
      }
    }
  }

  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(2, 6);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

// ============================================================================
// 3. UTILIDADES DE MODELOS GLB Y BOUNDARY SAFE
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
// 4. SKYLINE PROCEDURAL DE DUBAI (BURJ KHALIFA, 36 TORRES Y AUTOPISTAS)
// ============================================================================

function DubaiSkyline() {
  const windowTex = useMemo(() => makeSkyscraperWindows(), []);

  // Generación geométrica de 36 rascacielos lejanos con 1 solo InstancedMesh
  const towerCount = 38;
  const instancedRef = useRef<THREE.InstancedMesh>(null);

  useMemo(() => {
    if (!instancedRef.current) return;
    const dummy = new THREE.Object3D();

    for (let i = 0; i < towerCount; i++) {
      const angle = -Math.PI * 0.8 + (i / towerCount) * Math.PI * 1.6;
      const radius = 55 + (i % 5) * 14;
      const x = Math.sin(angle) * radius;
      const z = Math.cos(angle) * radius - 8;

      const height = 35 + (i % 7) * 14 + (i % 3) * 18;
      const w = 6 + (i % 4) * 2.5;
      const d = 6 + (i % 3) * 2.5;

      dummy.position.set(x, height / 2 - 16, z);
      dummy.scale.set(w, height, d);
      dummy.rotation.y = angle + 0.2;
      dummy.updateMatrix();

      instancedRef.current.setMatrixAt(i, dummy.matrix);
    }
    instancedRef.current.instanceMatrix.needsUpdate = true;
  }, [towerCount]);

  // Autopistas animadas con estelas de luz continua
  const highwayMaterialNorth = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: "#ffe082",
        transparent: true,
        opacity: 0.85,
      }),
    []
  );

  const highwayMaterialSouth = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: "#ff3b50",
        transparent: true,
        opacity: 0.85,
      }),
    []
  );

  return (
    <group position={[0, 0, 0]}>
      {/* 36 Rascacielos agrupados en 1 solo Draw Call */}
      <instancedMesh
        ref={instancedRef}
        args={[undefined, undefined, towerCount]}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color="#0c0d14"
          roughness={0.4}
          metalness={0.8}
          emissiveMap={windowTex}
          emissive="#ffffff"
          emissiveIntensity={0.8}
        />
      </instancedMesh>

      {/* Silueta Icónica del Burj Khalifa (Noroeste) */}
      <group position={[18, -16, -65]} rotation-y={0.3}>
        {/* Niveles escalonados cilíndricos */}
        <mesh position={[0, 25, 0]}>
          <cylinderGeometry args={[4.5, 6.5, 50, 16]} />
          <meshStandardMaterial color="#0f111a" metalness={0.85} roughness={0.2} emissive="#ffe89c" emissiveMap={windowTex} emissiveIntensity={0.6} />
        </mesh>
        <mesh position={[0, 60, 0]}>
          <cylinderGeometry args={[3.2, 4.5, 30, 16]} />
          <meshStandardMaterial color="#11131f" metalness={0.85} roughness={0.2} emissive="#ffe89c" emissiveMap={windowTex} emissiveIntensity={0.7} />
        </mesh>
        <mesh position={[0, 85, 0]}>
          <cylinderGeometry args={[1.8, 3.2, 25, 14]} />
          <meshStandardMaterial color="#141724" metalness={0.9} roughness={0.15} emissive="#ffe89c" emissiveMap={windowTex} emissiveIntensity={0.8} />
        </mesh>
        {/* Aguja central iluminada */}
        <mesh position={[0, 110, 0]}>
          <cylinderGeometry args={[0.2, 1.8, 35, 12]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.95} roughness={0.1} />
        </mesh>
        {/* Baliza roja aeronáutica parpadeante */}
        <mesh position={[0, 128, 0]}>
          <sphereGeometry args={[0.6, 12, 12]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
        <pointLight position={[0, 128, 0]} color="#ef4444" intensity={2.5} distance={40} />
      </group>

      {/* Estelas de tráfico de Sheikh Zayed Road por debajo de la ciudad */}
      <mesh position={[0, -15.5, -35]} rotation={[-Math.PI / 2, 0, -0.2]}>
        <planeGeometry args={[140, 0.45]} />
        <primitive object={highwayMaterialNorth} attach="material" />
      </mesh>
      <mesh position={[0, -15.5, -36]} rotation={[-Math.PI / 2, 0, -0.2]}>
        <planeGeometry args={[140, 0.45]} />
        <primitive object={highwayMaterialSouth} attach="material" />
      </mesh>
    </group>
  );
}

// ============================================================================
// 5. ESTRUCTURA ARQUITECTÓNICA DE LA PENTHOUSE (MÁRMOL, VENTANALES Y TERRAZA)
// ============================================================================

function PenthouseArchitecture() {
  const marbleTex = useMemo(() => makeNeroMarquina(24, 18), []);
  const terraceTex = useMemo(() => makeTerracePavement(18, 12), []);

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Suelo Interior: Mármol Negro Nero Marquina Pulido */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -1]} receiveShadow>
        <planeGeometry args={[24, 16]} />
        <meshStandardMaterial
          map={marbleTex}
          roughness={0.14}
          metalness={0.16}
        />
      </mesh>

      {/* 2. Suelo Exterior: Terraza Voladiza & Mirador Panorámico */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[2.5, 0.005, 8.5]} receiveShadow>
        <planeGeometry args={[19, 9]} />
        <meshStandardMaterial
          map={terraceTex}
          roughness={0.4}
          metalness={0.2}
        />
      </mesh>

      {/* 3. Helipuerto Privado en la Terraza Exterior */}
      <group position={[4.5, 0.015, 8.5]}>
        {/* Anillo exterior blanco del helipuerto */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[3.2, 3.4, 36]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.85} />
        </mesh>
        {/* Letra "H" estilizada en el helipuerto */}
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
        {/* Balizas perimetrales de seguridad en el helipuerto */}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
          const a = (i / 8) * Math.PI * 2;
          return (
            <mesh key={`beacon-${i}`} position={[Math.cos(a) * 3.3, 0.03, Math.sin(a) * 3.3]}>
              <cylinderGeometry args={[0.06, 0.06, 0.06, 8]} />
              <meshBasicMaterial color="#ffc107" />
            </mesh>
          );
        })}
      </group>

      {/* 4. Barandillas de Vidrio Estructural en la Terraza (Vistas a Dubai) */}
      <group position={[2.5, 0.6, 13.0]}>
        <mesh>
          <boxGeometry args={[19, 1.2, 0.05]} />
          <meshPhysicalMaterial
            color="#ffffff"
            transparent
            opacity={0.3}
            roughness={0.05}
            transmission={0.9}
            ior={1.5}
          />
        </mesh>
        {/* Rodapié de fijación en acero inoxidable */}
        <mesh position={[0, -0.55, 0]}>
          <boxGeometry args={[19, 0.1, 0.1]} />
          <meshStandardMaterial color="#27272a" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* 5. Ventanales Panorámicos Suelo a Techo de la Penthouse */}
      {/* Fachada Norte Panorámica (Skyline) */}
      <group position={[0, 1.8, -8.9]}>
        <mesh>
          <boxGeometry args={[24, 3.6, 0.06]} />
          <meshPhysicalMaterial
            color="#181a24"
            transparent
            opacity={0.25}
            roughness={0.08}
            transmission={0.88}
          />
        </mesh>
        {/* Montantes verticales de titanio oscuro */}
        {[-8, -4, 0, 4, 8].map((x) => (
          <mesh key={`mullion-${x}`} position={[x, 0, 0]}>
            <boxGeometry args={[0.12, 3.6, 0.16]} />
            <meshStandardMaterial color="#181920" metalness={0.8} roughness={0.2} />
          </mesh>
        ))}
      </group>

      {/* 6. Paredes Interiores de Lujo (Madera Flotante y Rodapié Negro) */}
      {/* Pared Trasera Sur (Lobby / Pasillo) */}
      <mesh position={[-6.0, 1.8, 6.9]}>
        <boxGeometry args={[12, 3.6, 0.28]} />
        <meshStandardMaterial color="#121319" roughness={0.8} />
      </mesh>
      {/* Pared Lateral Oeste */}
      <mesh position={[-12.0, 1.8, -1.0]}>
        <boxGeometry args={[0.28, 3.6, 16]} />
        <meshStandardMaterial color="#101117" roughness={0.85} />
      </mesh>

      {/* 7. Techo Moderno con Iluminación LED Empotrada */}
      <mesh position={[0, 3.75, -1]}>
        <boxGeometry args={[24, 0.15, 16]} />
        <meshStandardMaterial color="#0c0d12" roughness={0.9} />
      </mesh>
    </group>
  );
}

// ============================================================================
// 6. MOBILIARIO DE ALTO NIVEL (PRESIDENCIAL & TRADING FLOOR DE AGENTES)
// ============================================================================

function PenthouseFurniture({
  agents,
  selectedId,
  onSelect,
}: {
  agents: Agent[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <>
      {/* 1. Despacho del CEO (Aitor / Jakes) con Mesa de Nogal y Vistas al Skyline */}
      <group position={[-7.0, 0, -3.5]}>
        <Prop name="deskCorner" width={2.8} pos={[0, 0, 0]} rot={0} />
        <Prop name="chairDesk" width={0.9} pos={[0, 0, 0.8]} rot={Math.PI} />
        <Prop name="computerScreen" width={1.2} pos={[0, 0.75, -0.3]} rot={0} />
        <Prop name="lampRoundFloor" width={0.6} pos={[-1.6, 0, -0.8]} />
        <Prop name="bookcaseClosed" width={2.0} pos={[-4.5, 0, -0.5]} rot={Math.PI / 2} />
      </group>

      {/* 2. Estaciones de Trabajo de los 4 Especialistas (Maider, Iker, Unai, Elena) */}
      <Safe>
        <Prop name="desk" width={2.0} pos={[-2.5, 0, -3.8]} rot={0} />
        <Prop name="chairDesk" width={0.8} pos={[-2.5, 0, -3.1]} rot={Math.PI} />
        <Prop name="computerScreen" width={0.85} pos={[-2.5, 0.75, -4.1]} rot={0} />

        <Prop name="desk" width={2.0} pos={[1.8, 0, -3.8]} rot={0} />
        <Prop name="chairDesk" width={0.8} pos={[1.8, 0, -3.1]} rot={Math.PI} />
        <Prop name="computerScreen" width={0.85} pos={[1.8, 0.75, -4.1]} rot={0} />

        <Prop name="desk" width={2.0} pos={[-2.5, 0, -0.6]} rot={0} />
        <Prop name="chairDesk" width={0.8} pos={[-2.5, 0, 0.1]} rot={Math.PI} />
        <Prop name="computerScreen" width={0.85} pos={[-2.5, 0.75, -0.9]} rot={0} />

        <Prop name="desk" width={2.0} pos={[1.8, 0, -0.6]} rot={0} />
        <Prop name="chairDesk" width={0.8} pos={[1.8, 0, 0.1]} rot={Math.PI} />
        <Prop name="computerScreen" width={0.85} pos={[1.8, 0.75, -0.9]} rot={0} />
      </Safe>

      {/* 3. Sala de Juntas VIP (Boardroom con Mesa Redonda de Mármol) */}
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

      {/* 4. Lounge Ejecutivo & Barra de Champagne */}
      <Safe>
        <Prop name="loungeSofa" width={2.6} pos={[-7.0, 0, 3.5]} rot={0} />
        <Prop name="tableCoffee" width={1.4} pos={[-7.0, 0, 2.1]} />
        <Prop name="loungeDesignChair" width={0.95} pos={[-5.2, 0, 2.1]} rot={-Math.PI / 2} />
        <Prop name="kitchenCoffeeMachine" width={0.65} pos={[-10.5, 0.9, 4.5]} rot={Math.PI / 2} />
        <Prop name="kitchenCabinet" width={1.8} pos={[-10.5, 0, 4.5]} rot={Math.PI / 2} />
        <Prop name="pottedPlant" width={0.8} pos={[-11.0, 0, -7.8]} />
        <Prop name="pottedPlant" width={0.8} pos={[10.5, 0, -7.8]} />
      </Safe>

      {/* 5. Placas de Identificación Monocromáticas de los Agentes */}
      {agents.map((ag) => {
        const layout = PENTHOUSE_LAYOUT[ag.id];
        if (!layout) return null;
        const isSel = ag.id === selectedId;

        return (
          <group key={`station-${ag.id}`} position={layout.pos}>
            <Html
              position={[0, 1.8, 0]}
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
// 7. RIG DE CÁMARA SUAVE Y TRANSICIONES CINEMÁTICAS
// ============================================================================

function CameraRig({
  focus,
  controls,
}: {
  focus: [number, number, number] | null;
  controls: RefObject<OrbitControlsImpl>;
}) {
  const goal = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    const c = controls.current;
    if (!c) return;
    if (focus) {
      goal.set(focus[0], 1.2, focus[2]);
    } else {
      goal.set(0, 0.6, 0);
    }
    const d = goal.clone().sub(c.target).multiplyScalar(0.06);
    if (d.lengthSq() < 1e-6) return;
    c.target.add(d);
    c.object.position.add(d);
    c.update();
  });

  return null;
}

// ============================================================================
// 8. ESCENA EXPORTADA: PENTHOUSE PRESIDENCIAL DE DUBAI (FASE 1)
// ============================================================================

export default function DubaiPenthouse({
  agents,
  selectedId,
  focusId,
  isMobile,
  onSelect,
}: {
  agents: Agent[];
  selectedId: string;
  focusId: string | null;
  isMobile: boolean;
  onSelect: (id: string) => void;
}) {
  const controls = useRef<OrbitControlsImpl>(null);
  const focus = focusId && PENTHOUSE_LAYOUT[focusId] ? PENTHOUSE_LAYOUT[focusId].pos : null;

  return (
    <Canvas
      shadows
      dpr={[1, isMobile ? 1.5 : 2]}
      camera={{
        position: isMobile ? [18, 16, 18] : [14, 11, 14],
        fov: isMobile ? 50 : 38,
        near: 0.1,
        far: 300,
      }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.15;
      }}
    >
      {/* Atmósfera crepuscular y niebla lejana de Dubai */}
      <color attach="background" args={["#08090f"]} />
      <fog attach="fog" args={["#08090f", 45, 200]} />

      {/* Iluminación Arquitectónica de Lujo */}
      <ambientLight intensity={0.4} color="#181b28" />
      <hemisphereLight args={["#222538", "#0d0e14", 0.6]} />

      {/* Foco Principal de la Penthouse con Sombras Suaves */}
      <directionalLight
        position={[16, 24, 12]}
        intensity={1.8}
        color="#fff5e8"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
        shadow-camera-near={1}
        shadow-camera-far={80}
        shadow-bias={-0.0004}
      />

      {/* Luz Ambiental de los Ventanales (Reflejo del Skyline) */}
      <directionalLight position={[-15, 8, -25]} intensity={0.9} color="#9ec4ff" />

      {/* Controles Orbitales Adaptados */}
      <OrbitControls
        ref={controls}
        enableDamping
        dampingFactor={0.06}
        enablePan={false}
        minDistance={5}
        maxDistance={45}
        maxPolarAngle={Math.PI / 2.08}
        target={[0, 0.6, 0]}
      />
      <CameraRig focus={focus} controls={controls} />

      {/* 1. Skyline Nocturno de Dubai */}
      <DubaiSkyline />

      {/* 2. Estructura Arquitectónica de la Penthouse */}
      <PenthouseArchitecture />

      {/* 3. Mobiliario y Puestos de Agentes */}
      <Suspense fallback={null}>
        <PenthouseFurniture
          agents={agents}
          selectedId={selectedId}
          onSelect={onSelect}
        />
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
  );
}
