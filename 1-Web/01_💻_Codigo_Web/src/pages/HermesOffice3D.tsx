import { Component, Suspense, useMemo, useRef, type ReactNode, type RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import type { Agent } from "./AgentOrchestratorPage";

// ============================================================================
// LAYOUT DE LA OFICINA (unidades de mundo ~ metros)
// Oficina principal: x[-10,4] z[-7,6] · Server room: x[4,10] z[-7,-1] · Gym: x[4,10] z[-1,6]
// ============================================================================

const MODEL = (n: string) => `/office-assets/models/furniture/${n}.glb`;

export const DESK_LAYOUT: Record<string, { pos: [number, number, number]; rot: number }> = {
  "jrg-aitor": { pos: [-7, 0, -5.2], rot: 0 },
  "jrg-maider": { pos: [-3.6, 0, -5.2], rot: 0 },
  "jrg-iker": { pos: [-7, 0, -1.6], rot: 0 },
  "jrg-unai": { pos: [-3.6, 0, -1.6], rot: 0 },
  "jrg-elena": { pos: [-7.4, 0, 2.6], rot: Math.PI / 2 },
};

const SKIN_TONES = ["#f2c9a0", "#e0ac84", "#f5d6b8", "#c98f66", "#edbd96"];

// ---------------------------------------------------------------------------
// Texturas procedurales
// ---------------------------------------------------------------------------

function makeParquet(w: number, d: number): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const g = c.getContext("2d")!;
  const cols = ["#c07a47", "#b46f3f", "#cc8a52", "#bb7745"];
  const tile = 64;
  for (let y = 0; y < 4; y++) {
    for (let x = 0; x < 4; x++) {
      g.fillStyle = cols[(x * 3 + y * 5 + ((x + y) % 2)) % cols.length];
      g.fillRect(x * tile, y * tile, tile, tile);
      g.strokeStyle = "rgba(70,35,12,0.38)";
      g.lineWidth = 2;
      g.strokeRect(x * tile + 1, y * tile + 1, tile - 2, tile - 2);
      // vetas
      g.strokeStyle = "rgba(255,220,170,0.10)";
      g.lineWidth = 1;
      for (let i = 1; i < 4; i++) {
        g.beginPath();
        g.moveTo(x * tile + 4, y * tile + i * 16);
        g.lineTo(x * tile + tile - 4, y * tile + i * 16);
        g.stroke();
      }
    }
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(w / 1.4, d / 1.4);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

function makeGrid(w: number, d: number, base: string, line: string): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  g.fillStyle = base;
  g.fillRect(0, 0, 128, 128);
  g.strokeStyle = line;
  g.lineWidth = 3;
  g.strokeRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(w / 1.0, d / 1.0);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

// ---------------------------------------------------------------------------
// Utilidades de modelos GLB (centrado + escala por ancho => robusto a cualquier pack)
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Edificio
// ---------------------------------------------------------------------------

const WALL = "#ebe4d4";
const WALL_CAP = "#f7f2e6";

function WallBox({
  x1,
  z1,
  x2,
  z2,
  h = 2.4,
  t = 0.28,
}: {
  x1: number;
  z1: number;
  x2: number;
  z2: number;
  h?: number;
  t?: number;
}) {
  const w = Math.abs(x2 - x1) + (x1 === x2 ? t : 0);
  const d = Math.abs(z2 - z1) + (z1 === z2 ? t : 0);
  const cx = (x1 + x2) / 2;
  const cz = (z1 + z2) / 2;
  return (
    <group position={[cx, 0, cz]}>
      <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color={WALL} roughness={0.95} />
      </mesh>
      <mesh position={[0, h + 0.03, 0]}>
        <boxGeometry args={[w + 0.02, 0.06, d + 0.02]} />
        <meshStandardMaterial color={WALL_CAP} roughness={0.9} />
      </mesh>
      {/* zócalo oscuro */}
      <mesh position={[0, 0.07, 0]}>
        <boxGeometry args={[w + 0.03, 0.14, d + 0.03]} />
        <meshStandardMaterial color="#5a3d28" roughness={0.9} />
      </mesh>
    </group>
  );
}

function Floor({
  cx,
  cz,
  w,
  d,
  kind,
}: {
  cx: number;
  cz: number;
  w: number;
  d: number;
  kind: "parquet" | "gym" | "server";
}) {
  const tex = useMemo(() => {
    if (kind === "parquet") return makeParquet(w, d);
    if (kind === "gym") return makeGrid(w, d, "#202127", "#2b2d35");
    return makeGrid(w, d, "#12141a", "#2a2d36");
  }, [kind, w, d]);
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[cx, 0.01, cz]} receiveShadow>
      <planeGeometry args={[w, d]} />
      <meshStandardMaterial map={tex} roughness={kind === "parquet" ? 0.55 : 0.8} />
    </mesh>
  );
}

function Tree({ p, s = 1 }: { p: [number, number]; s?: number }) {
  return (
    <group position={[p[0], 0, p[1]]} scale={s}>
      <mesh position={[0, 0.55, 0]} castShadow>
        <cylinderGeometry args={[0.13, 0.18, 1.1, 6]} />
        <meshStandardMaterial color="#6b4a2b" flatShading />
      </mesh>
      <mesh position={[0, 1.75, 0]} castShadow>
        <icosahedronGeometry args={[1.0, 0]} />
        <meshStandardMaterial color="#4f9a3b" flatShading />
      </mesh>
      <mesh position={[0.45, 1.35, 0.2]} castShadow>
        <icosahedronGeometry args={[0.6, 0]} />
        <meshStandardMaterial color="#5aa845" flatShading />
      </mesh>
    </group>
  );
}

function Building() {
  return (
    <group>
      {/* Suelos */}
      <Floor cx={-3} cz={-0.5} w={14} d={13} kind="parquet" />
      <Floor cx={7} cz={-4} w={6} d={6} kind="server" />
      <Floor cx={7} cz={2.5} w={6} d={7} kind="gym" />

      {/* Perímetro: lados lejanos altos, lados cercanos a cámara bajos (corte estilo Hermes) */}
      <WallBox x1={-10} z1={-7} x2={10} z2={-7} h={2.4} />
      <WallBox x1={-10} z1={-7} x2={-10} z2={6} h={2.4} />
      <WallBox x1={-10} z1={6} x2={10} z2={6} h={0.55} />
      <WallBox x1={10} z1={-7} x2={10} z2={6} h={0.55} />

      {/* Particiones interiores con huecos de puerta */}
      <WallBox x1={4} z1={-7} x2={4} z2={-3.2} h={1.5} />
      <WallBox x1={4} z1={-2.2} x2={4} z2={1.5} h={1.5} />
      <WallBox x1={4} z1={2.7} x2={4} z2={6} h={1.5} />
      <WallBox x1={4} z1={-1} x2={10} z2={-1} h={1.5} />

      {/* Césped y asfalto */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <planeGeometry args={[120, 120]} />
        <meshStandardMaterial color="#7da35a" roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-4, 0, 11.5]} receiveShadow>
        <planeGeometry args={[30, 8]} />
        <meshStandardMaterial color="#2c2f36" roughness={0.95} />
      </mesh>
      {[-14, -10, -6, -2, 2].map((x) => (
        <mesh key={`line-${x}`} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.01, 11.5]}>
          <planeGeometry args={[2, 0.14]} />
          <meshStandardMaterial color="#e9e6d8" />
        </mesh>
      ))}

      {/* Árboles */}
      <Tree p={[-14, -9]} s={1.3} />
      <Tree p={[-15, 0]} s={1.1} />
      <Tree p={[-13, 8]} />
      <Tree p={[14, -9]} s={1.4} />
      <Tree p={[15, 3]} s={1.2} />
      <Tree p={[13, 9]} />
      <Tree p={[2, -11]} s={1.2} />
      <Tree p={[-8, -11]} s={1.1} />
    </group>
  );
}

// ---------------------------------------------------------------------------
// Mobiliario
// ---------------------------------------------------------------------------

function Workstation({ agent, selected, onSelect }: { agent: Agent; selected: boolean; onSelect: () => void }) {
  const layout = DESK_LAYOUT[agent.id];
  const desk = useFitted(MODEL("desk"), 1.8);
  const chair = useFitted(MODEL("chairDesk"), 0.75);
  const screen = useFitted(MODEL("computerScreen"), 0.8);
  if (!layout) return null;
  return (
    <group position={layout.pos} rotation-y={layout.rot}>
      <primitive object={desk.obj} />
      <primitive object={screen.obj} position={[0, desk.size.y, -0.15]} />
      <primitive object={chair.obj} position={[0, 0, 0.95]} rotation-y={Math.PI} />
      <VoxelAgent agent={agent} selected={selected} onSelect={onSelect} seatZ={0.95} />
    </group>
  );
}

function VoxelAgent({
  agent,
  selected,
  onSelect,
  seatZ,
}: {
  agent: Agent;
  selected: boolean;
  onSelect: () => void;
  seatZ: number;
}) {
  const leftArm = useRef<THREE.Group>(null);
  const rightArm = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const body = useRef<THREE.Group>(null);
  const seed = agent.id.length * 1.7;
  const skin = SKIN_TONES[Math.abs(agent.id.charCodeAt(agent.id.length - 1)) % SKIN_TONES.length];

  useFrame((s) => {
    const t = s.clock.elapsedTime;
    if (leftArm.current) leftArm.current.rotation.x = -1.35 + Math.sin(t * 9 + seed) * 0.1;
    if (rightArm.current) rightArm.current.rotation.x = -1.35 + Math.sin(t * 9 + seed + 2) * 0.1;
    if (head.current) head.current.rotation.y = Math.sin(t * 0.9 + seed) * 0.22;
    if (body.current) body.current.position.y = Math.sin(t * 2 + seed) * 0.008;
  });

  return (
    <group
      position={[0, 0, seatZ]}
      rotation-y={Math.PI}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {selected && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0.1]}>
          <ringGeometry args={[0.55, 0.68, 40]} />
          <meshBasicMaterial color={agent.color} transparent opacity={0.95} />
        </mesh>
      )}
      <group ref={body}>
        {/* Piernas (sentado) */}
        {[-0.08, 0.08].map((x) => (
          <group key={`leg-${x}`}>
            <mesh position={[x, 0.54, 0.15]} castShadow>
              <boxGeometry args={[0.11, 0.11, 0.32]} />
              <meshStandardMaterial color="#2a3350" flatShading />
            </mesh>
            <mesh position={[x, 0.3, 0.3]} castShadow>
              <boxGeometry args={[0.1, 0.32, 0.1]} />
              <meshStandardMaterial color="#2a3350" flatShading />
            </mesh>
            <mesh position={[x, 0.07, 0.34]} castShadow>
              <boxGeometry args={[0.11, 0.07, 0.16]} />
              <meshStandardMaterial color="#1b1b22" flatShading />
            </mesh>
          </group>
        ))}
        {/* Torso */}
        <mesh position={[0, 0.78, 0]} castShadow>
          <boxGeometry args={[0.34, 0.36, 0.2]} />
          <meshStandardMaterial color={agent.clothingColor} flatShading />
        </mesh>
        {/* Acento JRG en el pecho */}
        <mesh position={[0, 0.82, 0.103]}>
          <boxGeometry args={[0.1, 0.1, 0.01]} />
          <meshBasicMaterial color={agent.color} />
        </mesh>
        {/* Cabeza */}
        <group ref={head} position={[0, 1.1, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.27, 0.27, 0.25]} />
            <meshStandardMaterial color={skin} flatShading />
          </mesh>
          <mesh position={[0, 0.13, -0.01]} castShadow>
            <boxGeometry args={[0.29, 0.1, 0.27]} />
            <meshStandardMaterial color={agent.hairColor} flatShading />
          </mesh>
          <mesh position={[0, 0.02, -0.12]}>
            <boxGeometry args={[0.29, 0.2, 0.06]} />
            <meshStandardMaterial color={agent.hairColor} flatShading />
          </mesh>
          {[-0.065, 0.065].map((x) => (
            <mesh key={`eye-${x}`} position={[x, 0.01, 0.128]}>
              <boxGeometry args={[0.04, 0.05, 0.01]} />
              <meshBasicMaterial color="#14161f" />
            </mesh>
          ))}
        </group>
        {/* Brazos */}
        <group ref={leftArm} position={[-0.22, 0.92, 0]}>
          <mesh position={[0, -0.16, 0]} castShadow>
            <boxGeometry args={[0.09, 0.32, 0.09]} />
            <meshStandardMaterial color={agent.clothingColor} flatShading />
          </mesh>
          <mesh position={[0, -0.34, 0]}>
            <boxGeometry args={[0.08, 0.06, 0.08]} />
            <meshStandardMaterial color={skin} flatShading />
          </mesh>
        </group>
        <group ref={rightArm} position={[0.22, 0.92, 0]}>
          <mesh position={[0, -0.16, 0]} castShadow>
            <boxGeometry args={[0.09, 0.32, 0.09]} />
            <meshStandardMaterial color={agent.clothingColor} flatShading />
          </mesh>
          <mesh position={[0, -0.34, 0]}>
            <boxGeometry args={[0.08, 0.06, 0.08]} />
            <meshStandardMaterial color={skin} flatShading />
          </mesh>
        </group>
      </group>

      {/* Chapa de nombre estilo Hermes */}
      <Html position={[0, 1.75, 0]} center distanceFactor={9} zIndexRange={[20, 0]} style={{ pointerEvents: "none" }}>
        <div className={`hm-plate ${selected ? "selected" : ""}`} style={{ borderLeftColor: agent.color }}>
          <div className="hm-plate-top">
            <span className="hm-plate-name">{agent.name}</span>
            <span className={`hm-plate-dot ${agent.status}`} />
          </div>
          <span className="hm-plate-sub">{agent.speechText.slice(0, 34)}…</span>
        </div>
      </Html>
    </group>
  );
}

function ServerRack({ pos, rot = 0 }: { pos: [number, number, number]; rot?: number }) {
  return (
    <group position={pos} rotation-y={rot}>
      <mesh position={[0, 0.95, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.8, 1.9, 0.75]} />
        <meshStandardMaterial color="#1d2240" metalness={0.4} roughness={0.5} />
      </mesh>
      {[0.35, 0.7, 1.05, 1.4, 1.7].map((y, i) => (
        <group key={`u-${y}`}>
          <mesh position={[0, y, 0.38]}>
            <boxGeometry args={[0.7, 0.18, 0.02]} />
            <meshStandardMaterial color="#0e1226" />
          </mesh>
          <mesh position={[0.28, y, 0.395]}>
            <boxGeometry args={[0.05, 0.05, 0.01]} />
            <meshBasicMaterial color={i % 2 ? "#3cff9a" : "#4aa8ff"} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function PingPong({ pos }: { pos: [number, number, number] }) {
  return (
    <group position={pos}>
      <mesh position={[0, 0.78, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.6, 0.08, 1.45]} />
        <meshStandardMaterial color="#2f8f58" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.825, 0]}>
        <boxGeometry args={[2.52, 0.005, 0.03]} />
        <meshBasicMaterial color="#f4f4f0" />
      </mesh>
      <mesh position={[0, 0.9, 0]}>
        <boxGeometry args={[0.02, 0.2, 1.5]} />
        <meshStandardMaterial color="#dcdcdc" transparent opacity={0.8} />
      </mesh>
      {[-1.15, 1.15].map((x) =>
        [-0.6, 0.6].map((z) => (
          <mesh key={`pp-${x}-${z}`} position={[x, 0.38, z]} castShadow>
            <boxGeometry args={[0.07, 0.76, 0.07]} />
            <meshStandardMaterial color="#1c1c20" />
          </mesh>
        ))
      )}
    </group>
  );
}

function Gym() {
  return (
    <group>
      {/* Cinta de correr */}
      <group position={[8.6, 0, 3.2]}>
        <mesh position={[0, 0.2, 0]} castShadow>
          <boxGeometry args={[0.9, 0.3, 2.0]} />
          <meshStandardMaterial color="#26282e" metalness={0.3} />
        </mesh>
        <mesh position={[0, 1.0, -0.8]} castShadow>
          <boxGeometry args={[0.7, 1.4, 0.12]} />
          <meshStandardMaterial color="#1c1d22" />
        </mesh>
        <mesh position={[0, 1.55, -0.72]}>
          <boxGeometry args={[0.55, 0.22, 0.06]} />
          <meshBasicMaterial color="#1fe0b8" />
        </mesh>
      </group>
      {/* Banco con pesas */}
      <group position={[6.3, 0, 4.6]}>
        <mesh position={[0, 0.4, 0]} castShadow>
          <boxGeometry args={[0.5, 0.12, 1.3]} />
          <meshStandardMaterial color="#3a3d46" />
        </mesh>
        <mesh position={[0, 1.0, -0.2]} castShadow>
          <boxGeometry args={[1.6, 0.06, 0.06]} />
          <meshStandardMaterial color="#9ea4ad" metalness={0.8} roughness={0.3} />
        </mesh>
        {[-0.75, 0.75].map((x) => (
          <mesh key={`w-${x}`} position={[x, 1.0, -0.2]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.22, 0.22, 0.1, 16]} />
            <meshStandardMaterial color="#15161a" />
          </mesh>
        ))}
      </group>
      {/* Saco de boxeo */}
      <mesh position={[9.2, 1.0, 0.2]} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 1.4, 14]} />
        <meshStandardMaterial color="#c0392b" roughness={0.6} />
      </mesh>
      {/* Esterilla yoga */}
      <mesh rotation={[-Math.PI / 2, 0, 0.2]} position={[6.2, 0.03, 1.4]}>
        <planeGeometry args={[0.8, 1.9]} />
        <meshStandardMaterial color="#1fa89a" />
      </mesh>
    </group>
  );
}

function Furniture() {
  return (
    <>
      <Safe>
        <Prop name="tableRound" width={2.6} pos={[0.5, 0, -4.8]} />
        {[0, 2.1, 4.2].map((a) => (
          <Prop
            key={`mc-${a}`}
            name="chairModernCushion"
            width={0.7}
            pos={[0.5 + Math.sin(a) * 1.7, 0, -4.8 + Math.cos(a) * 1.7]}
            rot={a + Math.PI}
          />
        ))}
      </Safe>
      <Safe>
        <Prop name="bookcaseClosed" width={1.6} pos={[2.8, 0, -6.55]} />
        <Prop name="bookcaseClosed" width={1.6} pos={[-9.4, 0, -3.2]} rot={Math.PI / 2} />
      </Safe>
      <Safe>
        <Prop name="kitchenFridgeSmall" width={0.95} pos={[-9.2, 0, 5.2]} rot={Math.PI / 2} />
        <Prop name="kitchenCabinet" width={1.6} pos={[-9.3, 0, 3.9]} rot={Math.PI / 2} />
        <Prop name="kitchenCoffeeMachine" width={0.6} pos={[-9.3, 0, 2.7]} rot={Math.PI / 2} />
      </Safe>
      <Safe>
        <Prop name="loungeSofa" width={2.3} pos={[-1.5, 0, 4.9]} rot={Math.PI} />
        <Prop name="tableCoffee" width={1.3} pos={[-1.5, 0, 3.4]} />
        <Prop name="loungeDesignChair" width={0.95} pos={[-3.4, 0, 3.4]} rot={Math.PI / 2} />
        <Prop name="loungeDesignChair" width={0.95} pos={[0.4, 0, 3.4]} rot={-Math.PI / 2} />
      </Safe>
      <Safe>
        <Prop name="pottedPlant" width={0.7} pos={[-9.4, 0, -6.4]} />
        <Prop name="pottedPlant" width={0.7} pos={[3.4, 0, -6.4]} />
        <Prop name="pottedPlant" width={0.7} pos={[3.4, 0, 5.4]} />
        <Prop name="plantSmall1" width={0.5} pos={[-6.0, 0, 5.4]} />
        <Prop name="lampRoundFloor" width={0.5} pos={[2.6, 0, 4.9]} />
      </Safe>
      <PingPong pos={[0.6, 0, 0.1]} />
      <ServerRack pos={[5.2, 0, -6.3]} />
      <ServerRack pos={[6.2, 0, -6.3]} />
      <ServerRack pos={[7.2, 0, -6.3]} />
      <ServerRack pos={[9.2, 0, -4]} rot={-Math.PI / 2} />
      <Gym />
    </>
  );
}

// ---------------------------------------------------------------------------
// Cámara
// ---------------------------------------------------------------------------

function CameraRig({ focus, controls }: { focus: [number, number, number] | null; controls: RefObject<OrbitControlsImpl> }) {
  const goal = useMemo(() => new THREE.Vector3(), []);
  useFrame(() => {
    const c = controls.current;
    if (!c) return;
    if (focus) goal.set(focus[0], 0.6, focus[2]);
    else goal.set(0, 0, 0);
    const d = goal.clone().sub(c.target).multiplyScalar(0.06);
    if (d.lengthSq() < 1e-6) return;
    c.target.add(d);
    c.object.position.add(d);
    c.update();
  });
  return null;
}

// ---------------------------------------------------------------------------
// Escena exportada
// ---------------------------------------------------------------------------

export default function HermesOffice({
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
  const focus = focusId && DESK_LAYOUT[focusId] ? DESK_LAYOUT[focusId].pos : null;

  return (
    <Canvas
      shadows
      dpr={[1, isMobile ? 1.5 : 2]}
      camera={{ position: isMobile ? [19, 19, 19] : [17, 15, 17], fov: isMobile ? 46 : 33, near: 0.1, far: 200 }}
      gl={{ antialias: true }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
      }}
    >
      <color attach="background" args={["#8fb4d9"]} />
      <fog attach="fog" args={["#a9c6e0", 60, 130]} />
      <hemisphereLight args={["#ffffff", "#7b8f5a", 0.85]} />
      <ambientLight intensity={0.35} />
      <directionalLight
        position={[14, 22, 10]}
        intensity={1.9}
        color="#fff4e0"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-18}
        shadow-camera-right={18}
        shadow-camera-top={18}
        shadow-camera-bottom={-18}
        shadow-camera-near={1}
        shadow-camera-far={70}
        shadow-bias={-0.0005}
      />

      <OrbitControls
        ref={controls}
        enableDamping
        dampingFactor={0.07}
        enablePan={false}
        minDistance={7}
        maxDistance={42}
        maxPolarAngle={Math.PI / 2.15}
        target={[0, 0, 0]}
      />
      <CameraRig focus={focus} controls={controls} />

      <Building />
      <Suspense fallback={null}>
        <Furniture />
        {agents.map((a) => (
          <Safe key={a.id}>
            <Workstation agent={a} selected={a.id === selectedId} onSelect={() => onSelect(a.id)} />
          </Safe>
        ))}
      </Suspense>

      {/* Rótulo arquitectónico JRG en la pared norte */}
      <Html position={[-3, 1.9, -6.8]} center distanceFactor={11} style={{ pointerEvents: "none" }}>
        <div className="hm-neon-sign">
          <img
            src="/logoJRG.png"
            alt="JRG"
            style={{ width: "18px", height: "18px", borderRadius: "50%", background: "#fff", display: "inline-block" }}
          />
          <span>JRG AGENCY · HQ</span>
        </div>
      </Html>
    </Canvas>
  );
}
