import * as THREE from "three";
import { DRACOLoader, GLTF, GLTFLoader } from "three-stdlib";
import { decryptFile } from "./decrypt";

type FabricKind = "cotton" | "denim" | "leather" | "rubber";

const createSurfaceTexture = (kind: FabricKind, color: string, detail: string) => {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");
  if (!context) return null;
  context.fillStyle = color;
  context.fillRect(0, 0, size, size);

  const spacing = kind === "rubber" ? 9 : kind === "leather" ? 13 : 7;
  context.strokeStyle = detail;
  context.globalAlpha = kind === "denim" ? 0.23 : 0.16;
  context.lineWidth = kind === "cotton" ? 1 : 1.4;
  for (let x = -size; x < size * 2; x += spacing) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x + size, size);
    context.stroke();
  }
  if (kind === "denim" || kind === "cotton") {
    for (let y = 0; y < size; y += spacing) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(size, y);
      context.stroke();
    }
  }
  if (kind === "rubber") {
    context.globalAlpha = 0.24;
    for (let y = 0; y < size; y += spacing * 2) {
      context.fillRect(0, y, size, 2);
    }
  }
  context.globalAlpha = 1;

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(kind === "rubber" ? 2.8 : 3.8, kind === "rubber" ? 2.8 : 3.8);
  texture.anisotropy = 4;
  return texture;
};

const createBumpTexture = (kind: FabricKind) => {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");
  if (!context) return null;
  context.fillStyle = "#808080";
  context.fillRect(0, 0, size, size);
  const spacing = kind === "rubber" ? 9 : 6;
  context.strokeStyle = kind === "rubber" ? "#ababab" : "#969696";
  context.globalAlpha = 0.55;
  context.lineWidth = kind === "leather" ? 1.5 : 1;
  for (let index = -size; index < size * 2; index += spacing) {
    context.beginPath();
    context.moveTo(index, 0);
    context.lineTo(index + size, size);
    context.stroke();
  }
  if (kind !== "leather") {
    for (let index = 0; index < size; index += spacing) {
      context.beginPath();
      context.moveTo(0, index);
      context.lineTo(size, index);
      context.stroke();
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  return texture;
};

const createClothingMaterial = (
  kind: FabricKind,
  color: string,
  detail: string,
  roughness: number,
  bumpScale: number,
  envMapIntensity = 0.55,
  metalness = 0.03
) => new THREE.MeshStandardMaterial({
  color,
  map: createSurfaceTexture(kind, color, detail) ?? undefined,
  bumpMap: createBumpTexture(kind) ?? undefined,
  bumpScale,
  roughness,
  metalness,
  envMapIntensity,
});

const loadEyebrowTextures = () => {
  const textureLoader = new THREE.TextureLoader();
  const diffuse = textureLoader.load("/textures/eyebrow_diffuse.png");
  diffuse.colorSpace = THREE.SRGBColorSpace;
  diffuse.flipY = false;
  diffuse.generateMipmaps = true;
  diffuse.minFilter = THREE.LinearMipmapLinearFilter;
  diffuse.magFilter = THREE.LinearFilter;
  diffuse.wrapS = THREE.ClampToEdgeWrapping;
  diffuse.wrapT = THREE.ClampToEdgeWrapping;

  const bump = textureLoader.load("/textures/eyebrow_bump.png");
  bump.flipY = false;
  bump.wrapS = THREE.ClampToEdgeWrapping;
  bump.wrapT = THREE.ClampToEdgeWrapping;

  return { diffuse, bump };
};

const sculptEyebrows = (mesh: THREE.Mesh) => {
  const geometry = mesh.geometry;
  if (!geometry || !geometry.attributes.position) return;
  const posAttr = geometry.attributes.position;
  const vertexCount = posAttr.count;

  // Centro de referencia Y de las cejas originales
  const centerY = 13.61;

  for (let i = 0; i < vertexCount; i++) {
    const x = posAttr.getX(i);
    const y = posAttr.getY(i);
    const z = posAttr.getZ(i);

    const absX = Math.abs(x);
    const signX = Math.sign(x);

    // Normalizado t en [0, 1] desde cabeza interna (|x| ~ 0.12) hasta cola externa (|x| ~ 0.74)
    const t = Math.min(Math.max((absX - 0.12) / (0.74 - 0.12), 0), 1);

    // 1. Ampliar el tamaño vertical y presencia (más grande y definida)
    const scaledY = centerY + (y - centerY) * 1.30;

    // 2. Curvatura estilizada de ala arqueada idéntica a la referencia:
    // Subida elegante hacia el ápice (+0.062 en Y en t=0.65) y descenso fluido hacia la cola (-0.075)
    let archCurve = 0;
    if (t <= 0.65) {
      archCurve = Math.pow(t / 0.65, 1.15) * 0.062;
    } else {
      const tailProgress = (t - 0.65) / 0.35;
      archCurve = 0.062 - Math.pow(tailProgress, 1.25) * 0.075;
    }

    // 3. Proyección frontal 3D (+0.034 en Z) para que la ceja destaque nítidamente sobre la piel
    const browRidgeZ = (1 - Math.pow(t, 2) * 0.35) * 0.034;

    // 4. Envergadura estilizada en X (10% más amplia)
    const scaledX = signX * (0.11 + (absX - 0.11) * 1.10);

    posAttr.setXYZ(i, scaledX, scaledY + archCurve, z + browRidgeZ);
  }

  posAttr.needsUpdate = true;
  geometry.computeVertexNormals();
};

const applyWardrobe = (character: THREE.Object3D) => {
  const shirt = createClothingMaterial("cotton", "#b9b8b4", "#e7e5df", 0.72, 0.04, 0.36, 0.01);
  const trousers = createClothingMaterial("denim", "#090909", "#3f3f3f", 0.80, 0.06, 0.30, 0.01);
  const shoes = createClothingMaterial("leather", "#f1f0eb", "#c7c5bf", 0.52, 0.025, 0.50, 0.03);
  const soles = createClothingMaterial("rubber", "#deddd8", "#a8a7a2", 0.68, 0.05, 0.35, 0.01);

  // Material texturizado de alta definición extraído del diseño de referencia
  // alphaTest: 0.15 asegura que el polígono exterior sea 100% invisible, dejando únicamente el pelo
  const { diffuse: eyebrowDiffuse, bump: eyebrowBump } = loadEyebrowTextures();
  const eyebrowMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#ffffff"), // Sin tintado multiplicativo para preservar el negro natural del PNG
    map: eyebrowDiffuse,
    bumpMap: eyebrowBump,
    bumpScale: 0.08,
    roughness: 0.48,
    metalness: 0.02,
    envMapIntensity: 0.45,
    transparent: true,
    alphaTest: 0.15, // Recorta limpiamente cualquier resto exterior
    depthWrite: true,
    side: THREE.DoubleSide,
  });

  // Tono de piel cálido, natural y realista para cara, orejas, cuello y manos
  const skinColor = new THREE.Color("#dca889");

  character.traverse((child) => {
    if (!(child as THREE.Mesh).isMesh) return;
    const mesh = child as THREE.Mesh;
    const name = mesh.name;
    const lower = name.toLowerCase();
    const geoName = (mesh.geometry?.name || "").toLowerCase();

    if (name === "BODY.SHIRT" || name === "BODYSHIRT" || lower.includes("shirt")) mesh.material = shirt;
    if (name === "Pant" || lower.includes("pant")) mesh.material = trousers;
    if (name === "Shoe" || lower.includes("shoe")) mesh.material = shoes;
    if (name === "Sole" || lower.includes("sole")) mesh.material = soles;

    // Detección y mejora de cejas (Eyebrow / Plane.004)
    const isEyebrow =
      name === "Eyebrow" ||
      name === "Plane.004" ||
      name === "Plane004" ||
      lower.includes("eyebrow") ||
      lower.includes("brow") ||
      geoName.includes("plane.004") ||
      geoName.includes("plane004");

    if (isEyebrow) {
      sculptEyebrows(mesh);
      mesh.material = eyebrowMaterial;
      return;
    }

    // Aplicar tono de piel a cara (Plane007 / Plane.007), orejas (Ear001 / Ear.001), cuello (Neck) y manos (Hand)
    const isSkin =
      name === "Plane007" ||
      name === "Plane.007" ||
      name === "Ear001" ||
      name === "Ear.001" ||
      name === "Neck" ||
      name === "Hand" ||
      lower.includes("plane007") ||
      lower.includes("plane.007") ||
      lower.includes("ear") ||
      lower.includes("hand") ||
      lower.includes("neck") ||
      lower.includes("face") ||
      lower.includes("head") ||
      geoName.includes("plane.007") ||
      geoName.includes("plane007") ||
      geoName.includes("plane.003") ||
      geoName.includes("plane.005") ||
      geoName.includes("mesh.002");

    if (isSkin) {
      const origMat = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
      if (origMat) {
        const skinMat = (origMat as THREE.MeshStandardMaterial).clone();
        skinMat.color = skinColor;
        skinMat.vertexColors = false; // Evita que colores de vértice modulen el tono
        skinMat.roughness = 0.65;
        skinMat.metalness = 0.0;
        skinMat.envMapIntensity = 0.36;
        skinMat.needsUpdate = true;
        mesh.material = skinMat;
      }
    }
  });
};

const setCharacter = (
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera
) => {
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco/");
  loader.setDRACOLoader(dracoLoader);

  const loadCharacter = () => new Promise<GLTF | null>((resolve, reject) => {
    const handleLoadedModel = (gltf: GLTF) => {
      const character = gltf.scene;
      applyWardrobe(character);
      character.traverse((child: any) => {
        if (!child.isMesh) return;
        const mesh = child as THREE.Mesh;
        mesh.castShadow = false;
        mesh.receiveShadow = false;
        mesh.frustumCulled = true;
        const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        materials.forEach((material: any) => {
          if (!material) return;
          material.precision = "mediump";
          if (material.isMeshStandardMaterial || material.isMeshPhysicalMaterial) {
            const name = (mesh.name || "").toLowerCase();
            const matName = (material.name || "").toLowerCase();

            // Si es ropa o piel ya configurada, preservar sus valores exactos
            const isSkinOrWardrobe =
              name === "body.shirt" ||
              name === "bodyshirt" ||
              name === "pant" ||
              name === "shoe" ||
              name === "sole" ||
              name === "plane007" ||
              name === "plane.007" ||
              name === "ear001" ||
              name === "ear.001" ||
              name === "neck" ||
              name === "hand" ||
              name.includes("shirt") ||
              name.includes("pant") ||
              name.includes("shoe") ||
              name.includes("sole") ||
              name.includes("plane007") ||
              name.includes("plane.007") ||
              name.includes("ear") ||
              name.includes("hand") ||
              name.includes("neck") ||
              name.includes("face") ||
              name.includes("head") ||
              name.includes("eyebrow") ||
              name.includes("brow") ||
              name.includes("plane.004");

            if (isSkinOrWardrobe) {
              material.needsUpdate = true;
              return;
            }

            // Dispositivos y piezas metálicas/pantallas (laptop, monitor, etc.)
            if (name.includes("plane") || name.includes("screen") || name.includes("monitor") || matName.includes("metal")) {
              material.roughness = 0.40;
              material.metalness = Math.max(material.metalness ?? 0, 0.25);
              material.envMapIntensity = 0.60;
            } else if (name.includes("hair") || matName.includes("hair")) {
              // Cabello: textura mate suave
              material.roughness = 0.74;
              material.envMapIntensity = 0.32;
            } else {
              // Ajuste moderado y sutil para resto de materiales
              material.envMapIntensity = material.envMapIntensity ? Math.min(Math.max(material.envMapIntensity, 0.30), 0.45) : 0.35;
            }
            material.needsUpdate = true;
          }
        });
      });
      const footR = character.getObjectByName("footR");
      const footL = character.getObjectByName("footL");
      if (footR) footR.position.y = 3.36;
      if (footL) footL.position.y = 3.36;
      try {
        renderer.compile(character, camera, scene);
      } catch (e) {
        // Ignorar fallos no críticos de compilación
      }
      resolve(gltf);
      dracoLoader.dispose();
    };

    // 1. Carga directa de character.glb (ultrarrápida y sin bloqueo de descifrado)
    loader.load(
      "/models/character.glb",
      (gltf) => handleLoadedModel(gltf),
      undefined,
      async (directErr) => {
        console.warn("Carga directa glb no disponible, recurriendo a descifrado:", directErr);
        try {
          const encryptedBlob = await decryptFile("/models/character.enc", "Character3D#@");
          const blobUrl = URL.createObjectURL(new Blob([encryptedBlob]));
          loader.load(
            blobUrl,
            (gltf) => {
              URL.revokeObjectURL(blobUrl);
              handleLoadedModel(gltf);
            },
            undefined,
            (encErr) => {
              URL.revokeObjectURL(blobUrl);
              console.error("Error cargando modelo descifrado:", encErr);
              reject(encErr);
            }
          );
        } catch (decryptErr) {
          console.error("Error en descifrado:", decryptErr);
          reject(decryptErr);
        }
      }
    );
  });

  return { loadCharacter };
};

export default setCharacter;