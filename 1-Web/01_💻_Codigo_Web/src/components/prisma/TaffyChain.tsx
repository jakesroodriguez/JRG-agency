import React, { useEffect, useRef } from "react";

const R1 = 1.0;
const MAX_LINKS = 40;
const MIN_LINKS = 12;
const GROUP_SIZE = 4;
const MAX_GROUPS = MAX_LINKS / GROUP_SIZE;
const MAX_PAL = 16;
const LENS = 2.35;
const WARP_AMOUNT = 1.05;

const SUB_DT = 1 / 90;
const MAX_SUBSTEPS = 3;
const RELAX_PASSES = 14;
const CLAMP_PASSES = 8;
const CLAMP_MARGIN = 0.20;
const BEND_SAFETY = 0.60;
const THREAD_PASSES = 6;
const THREAD_FLOOR = 0.05;
const THREAD_GAIN = 1.0;
const THREAD_STEP = 0.15;
const DAMPING = 0.985;
const GRAVITY = -26.0;
const WARMUP_STEPS = 120;
const TOUCH_PX = 22;

// Prisma Luxury Palette: Champagne, Warm Cream, Liquid Gold, Dark Obsidian, Bronze
const DEFAULT_PALETTE = [
  "#DEDBC8", // Warm cream
  "#E1E0CC", // Off-white cream
  "#C5A059", // Warm champagne gold
  "#212121", // Deep graphite
  "#E5B869", // Luminous amber gold
  "#8A8778", // Polished titanium
  "#141414", // Velvet black
  "#F5F2E4", // Bright highlight
];

const SWAY_RATE = 0.39;
const SWAY_AMP = 0.04;
const DRIFT_RATE = 1.65;
const MORPH_RATE = 0.9;
const COL_SCALE = 0.14;
const SMEAR = 0.22;
const FILL = 0.85;

type Direction = "down" | "up" | "left" | "right";

const ROLL: Record<Direction, [number, number, number, number]> = {
  down: [1, 0, 0, 1],
  up: [-1, 0, 0, -1],
  right: [0, -1, 1, 0],
  left: [0, 1, -1, 0],
};

interface ChainGroup {
  spread: number;
  linkLength: number;
  linkThickness: number;
}
interface GradientGroup {
  scale: number;
  drift: number;
  morph: number;
}
const DEFAULT_CHAIN: ChainGroup = { spread: 100, linkLength: 58, linkThickness: 36 };
const DEFAULT_GRADIENT: GradientGroup = { scale: 100, drift: 50, morph: 50 };

export interface TaffyChainProps {
  background?: string;
  metallic?: boolean;
  colors?: string[];
  density?: number;
  speed?: number;
  sway?: number;
  distance?: number;
  direction?: Direction;
  drag?: number;
  chain?: Partial<ChainGroup>;
  gradient?: Partial<GradientGroup>;
  style?: React.CSSProperties;
  className?: string;
}

const VERT = `#version 300 es
void main() {
    vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
    gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

const FRAG = `#version 300 es
precision highp float;
out vec4 fragColor;

#define MAXL ${MAX_LINKS}
#define MAXG ${MAX_GROUPS}
#define MAXP ${MAX_PAL}
#define GSIZE ${GROUP_SIZE}
#define LENS ${LENS.toFixed(4)}
#define WARP ${WARP_AMOUNT.toFixed(4)}

uniform vec2  uRes;
uniform vec4  uA[MAXL];
uniform vec4  uB[MAXL];
uniform vec4  uC[MAXL];
uniform vec4  uG[MAXG];
uniform int   uLinkCount;
uniform int   uGroupCount;
uniform float uLe;
uniform float uR1;
uniform float uR2;
uniform float uBound;
uniform vec4  uHull;
uniform vec3  uCamPos;
uniform vec3  uCamTarget;
uniform vec3  uPal[MAXP];
uniform int   uPalCount;
uniform float uColScale;
uniform float uColDrift;
uniform float uColMorph;
uniform float uMetal;
uniform float uMix;
uniform mat2  uRoll;
uniform sampler2D uHist;

float sdLink(vec3 p, float le, float r1, float r2) {
    vec3 q = vec3(p.x, max(abs(p.y) - le, 0.0), p.z);
    return length(vec2(length(q.xy) - r1, q.z)) - r2;
}

vec2 sphIntersect(vec3 ro, vec3 rd, vec4 sph) {
    vec3 oc = ro - sph.xyz;
    float b = dot(oc, rd);
    float c = dot(oc, oc) - sph.w * sph.w;
    float h = b * b - c;
    if (h < 0.0) return vec2(-1.0, -1.0);
    h = sqrt(h);
    return vec2(-b - h, -b + h);
}

vec3 toWorld(vec3 v)  { return vec3(uRoll * v.xy, v.z); }
vec3 toScreen(vec3 v) { return vec3(transpose(uRoll) * v.xy, v.z); }

vec4 map(vec3 p) {
    float d = 1e9;
    float s = 0.0;
    vec2  lxz = vec2(0.0);

    for (int g = 0; g < MAXG; g++) {
        if (g >= uGroupCount) break;
        vec4 G = uG[g];
        if (length(p - G.xyz) - G.w > d) continue;

        for (int k = 0; k < GSIZE; k++) {
            int i = g * GSIZE + k;
            if (i >= uLinkCount) break;

            vec3 c = uA[i].xyz;

            if (length(p - c) - uBound > d) continue;

            vec3 T = uB[i].xyz;
            vec3 N = uC[i].xyz;
            vec3 B = cross(T, N);
            vec3 dp = p - c;
            vec3 lp = vec3(dot(dp, N), dot(dp, T), dot(dp, B));
            vec3 sp = uB[i].w > 0.5 ? vec3(lp.z, lp.y, -lp.x) : lp;

            float e = sdLink(sp, uLe, uR1, uR2);
            if (e < d) {
                d = e;
                s = uA[i].w;
                lxz = lp.xz;
            }
        }
    }
    return vec4(d, s, lxz);
}

vec3 calcNormal(vec3 p) {
    vec2 e = vec2(1.0, -1.0) * 0.0030;
    return normalize(
        e.xyy * map(p + e.xyy).x + e.yyx * map(p + e.yyx).x +
        e.yxy * map(p + e.yxy).x + e.xxx * map(p + e.xxx).x);
}

float hash13(vec3 p) {
    p = fract(p * 0.1031);
    p += dot(p, p.zyx + 31.32);
    return fract((p.x + p.y) * p.z);
}

float vnoise(vec3 x) {
    vec3 i = floor(x), f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
        mix(mix(hash13(i + vec3(0.0, 0.0, 0.0)), hash13(i + vec3(1.0, 0.0, 0.0)), f.x),
            mix(hash13(i + vec3(0.0, 1.0, 0.0)), hash13(i + vec3(1.0, 1.0, 0.0)), f.x), f.y),
        mix(mix(hash13(i + vec3(0.0, 0.0, 1.0)), hash13(i + vec3(1.0, 0.0, 1.0)), f.x),
            mix(hash13(i + vec3(0.0, 1.0, 1.0)), hash13(i + vec3(1.0, 1.0, 1.0)), f.x), f.y), f.z);
}

float fbm(vec3 p) {
    float a = 0.5, s = 0.0;
    for (int i = 0; i < 3; i++) { s += a * vnoise(p); p *= 2.03; a *= 0.5; }
    return s / 0.875;
}

vec3 paletteAt(float t) {
    float f = fract(t) * float(uPalCount);
    int i = int(floor(f));
    float k = smoothstep(0.20, 0.80, fract(f));
    return mix(uPal[i % uPalCount], uPal[(i + 1) % uPalCount], k);
}

vec3 albedoAt(float s, vec2 lxz) {
    vec3 q = vec3(lxz.x * 1.2, s - uColDrift, lxz.y * 1.2) * uColScale;

    vec3 wt = vec3(uColMorph * 0.21, uColMorph * -0.17, uColMorph * 0.13);
    vec3 w = vec3(
        fbm(q * 0.55 + wt),
        fbm(q * 0.55 + wt.yzx + 5.2),
        fbm(q * 0.55 + wt.zxy + 9.1));
    q += (w - 0.5) * WARP;

    float t = fbm(q) * 1.6 + 0.35 * fbm(q * 0.41 + 19.7);
    return paletteAt(t);
}

float azDist(float a, float c) {
    float d = a - c;
    d = mod(d + 3.14159265, 6.28318531) - 3.14159265;
    return abs(d);
}

vec3 envColor(vec3 r) {
    r = toScreen(r);
    float y = r.y;
    float a = atan(r.z, r.x);

    float flr = 0.19 + 0.21 * smoothstep(-1.00, -0.04, y);
    float ceilV = 0.44 + 0.26 * smoothstep(0.04, 0.80, y);
    float v = mix(flr, ceilV, smoothstep(-0.055, 0.055, y));

    v += 1.35 * smoothstep(0.30, 0.44, y) * smoothstep(1.25, 0.95, azDist(a, 2.10));
    v += 0.34 * smoothstep(0.02, 0.28, y) * smoothstep(1.05, 0.70, azDist(a, 0.90));
    v += 0.34 * exp(-abs(y) * 26.0);
    v -= 0.10 * exp(-abs(y + 0.16) * 16.0);

    return max(vec3(v * 0.985, v, v * 1.03), 0.0);
}

float calcAO(vec3 p, vec3 n) {
    float occ = 0.0;
    float sca = 1.0;
    for (int i = 0; i < 5; i++) {
        float h = 0.015 + 0.16 * float(i) / 4.0;
        occ += (h - map(p + h * n).x) * sca;
        sca *= 0.80;
    }
    return clamp(1.0 - 1.7 * occ, 0.0, 1.0);
}

vec3 reflSample(vec3 p, vec3 n, vec3 rd) {
    vec3 r = reflect(rd, n);
    vec3 env = envColor(r);
    vec3 o = p + n * 0.015;
    vec2 hs = sphIntersect(o, r, uHull);
    if (hs.y <= 0.0) return env;
    float t = max(hs.x, 0.02);

    float tMax = min(hs.y, 5.5);
    for (int i = 0; i < 16; i++) {
        if (t > tMax) break;
        float d = map(o + r * t).x;
        if (d < 0.005) {
            vec3 e2 = envColor(reflect(r, calcNormal(o + r * t))) * 0.55;
            return mix(e2, env, smoothstep(1.2, 5.0, t));
        }
        t += max(d, 0.008);
    }
    return env;
}

vec3 tonemap(vec3 c) {
    const float K = 0.80;
    vec3 hi = max(c - K, 0.0);
    return min(c, vec3(K)) + (1.0 - K) * (1.0 - exp(-hi / (1.0 - K)));
}

vec3 shade(vec3 p, vec3 rd, float s, vec2 lxz) {
    vec3 n = calcNormal(p);
    vec3 L = toWorld(normalize(vec3(-0.34, 0.76, 0.55)));

    if (uMetal > 0.5) {
        const vec3 F0 = vec3(0.78, 0.79, 0.82);
        float f = pow(1.0 - clamp(dot(n, -rd), 0.0, 1.0), 5.0);
        vec3 F = F0 + (1.0 - F0) * f;

        float ao = calcAO(p, n);
        float rocc = mix(ao * ao, 1.0, 0.22);

        vec3 L2 = toWorld(normalize(vec3(0.58, 0.32, 0.74)));
        vec3 h1 = normalize(L - rd);
        vec3 h2 = normalize(L2 - rd);
        float s1 = pow(clamp(dot(n, h1), 0.0, 1.0), 220.0);
        float s2 = pow(clamp(dot(n, h2), 0.0, 1.0), 42.0);

        vec3 col = F * reflSample(p, n, rd) * rocc
                 + F0 * (s1 * 2.2 + s2 * 0.22) * ao
                 + F0 * 0.045 * ao;
        return tonemap(col);
    }

    vec3 albedo = albedoAt(s, lxz);
    const float wrap = 0.55;
    float dif = clamp((dot(n, L) + wrap) / (1.0 + wrap), 0.0, 1.0);
    float amb = 0.5 + 0.5 * toScreen(n).y;
    float back = pow(clamp(dot(-n, L) * 0.5 + 0.5, 0.0, 1.0), 3.0);
    float lin = 0.30 + 0.30 * amb + 0.34 * dif + 0.06 * back;
    return albedo * lin;
}

void main() {
    vec3 ro = uCamPos;
    vec3 ww = normalize(uCamTarget - ro);
    vec3 uu = normalize(cross(ww, vec3(0.0, 1.0, 0.0)));
    vec3 vv = cross(uu, ww);

    vec2 cRes = abs(uRoll * uRes);
    vec2 q = 2.0 * (uRoll * (gl_FragCoord.xy - 0.5 * uRes)) / cRes.y;
    vec3 rd = normalize(q.x * uu + q.y * vv + LENS * ww);

    vec4 scene = vec4(0.0);

    vec2 hull = sphIntersect(ro, rd, uHull);
    if (hull.y > 0.0) {
        float t = max(hull.x, 0.001);
        float tMax = hull.y;

        float cone = (2.0 / cRes.y) / LENS;
        float cover = 1.0;
        float tNear = t;
        bool hit = false;
        vec4 res = vec4(0.0);

        for (int i = 0; i < 96; i++) {
            vec4 m = map(ro + rd * t);
            float w = m.x / (cone * t * 2.4);
            if (w < cover) { cover = w; tNear = t; res = m; }
            if (m.x < cone * t * 0.35) { hit = true; res = m; tNear = t; break; }
            t += m.x;
            if (t > tMax) break;
        }

        float cov = hit ? 1.0 : 1.0 - smoothstep(0.0, 1.0, max(cover, 0.0));
        if (cov > 0.001) {
            vec3 sc = shade(ro + rd * tNear, rd, res.y, res.zw);
            scene = vec4(sc * cov, cov);
        }
    }

    vec4 hist = texture(uHist, gl_FragCoord.xy / uRes);
    fragColor = mix(hist, scene, uMix);
}`;

const PRESENT_FRAG = `#version 300 es
precision highp float;
uniform sampler2D uTex;
uniform vec2 uRes;
out vec4 fragColor;
void main() { fragColor = texture(uTex, gl_FragCoord.xy / uRes); }`;

function compileShader(gl: WebGL2RenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  return sh;
}

function buildProgram(gl: WebGL2RenderingContext, frag: string) {
  const p = gl.createProgram()!;
  gl.attachShader(p, compileShader(gl, gl.VERTEX_SHADER, VERT));
  gl.attachShader(p, compileShader(gl, gl.FRAGMENT_SHADER, frag));
  gl.linkProgram(p);
  return p;
}

type RGBA = [number, number, number, number];

function makeColourReader() {
  const cv = document.createElement("canvas");
  cv.width = cv.height = 1;
  const ctx = cv.getContext("2d", { willReadFrequently: true })!;
  const cache = new Map<string, RGBA>();
  return (str: string): RGBA => {
    const hit = cache.get(str);
    if (hit) return hit;
    let css = str;
    for (let m; (m = /^\s*var\(\s*--[^,)]+,\s*([\s\S]+)\)\s*$/.exec(css)); ) css = m[1];
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = "#000000";
    ctx.fillStyle = css;
    ctx.fillRect(0, 0, 1, 1);
    const d = ctx.getImageData(0, 0, 1, 1).data;
    const a = d[3] / 255;
    const out: RGBA = a > 0 ? [d[0] / 255, d[1] / 255, d[2] / 255, a] : [0, 0, 0, 0];
    if (cache.size < 256) cache.set(str, out);
    return out;
  };
}

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

function articulationLimit(le: number, r2: number, seg: number) {
  const L = le + R1;
  const hole = R1 - r2;
  const clearance = (th: number) => {
    const x = seg * Math.sin(th * 0.5) - L * Math.sin(th);
    const y = seg * Math.cos(th * 0.5) - L * Math.cos(th);
    const v = Math.max(Math.abs(y) - le, 0);
    return hole - Math.sqrt(x * x + v * v);
  };
  if (clearance(0) <= 0) return 0;
  let lo = 0;
  let hi = Math.PI;
  for (let k = 0; k < 24; k++) {
    const m = (lo + hi) * 0.5;
    if (clearance(m) > 0) lo = m;
    else hi = m;
  }
  return lo;
}

export function TaffyChain({
  background = "transparent",
  metallic = true,
  colors = DEFAULT_PALETTE,
  density = 22,
  speed = 45,
  sway = 80,
  distance = 95,
  direction = "down",
  drag = 65,
  chain = { spread: 100, linkLength: 58, linkThickness: 36 },
  gradient = { scale: 100, drift: 50, morph: 50 },
  style,
  className = "",
}: TaffyChainProps) {
  const hostRef = useRef<HTMLDivElement>(null);

  const ch = { ...DEFAULT_CHAIN, ...chain };
  const gr = { ...DEFAULT_GRADIENT, ...gradient };

  const live = {
    colors,
    density,
    spread: ch.spread,
    linkLength: ch.linkLength,
    linkThickness: ch.linkThickness,
    scale: gr.scale,
    drift: gr.drift,
    morph: gr.morph,
    metallic,
    drag,
    sway,
    speed,
    distance,
    direction,
  };
  const propsRef = useRef(live);
  propsRef.current = live;

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    // Create fresh canvas to prevent context conflicts
    const canvas = document.createElement("canvas");
    canvas.style.position = "absolute";
    canvas.style.inset = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    canvas.style.touchAction = propsRef.current.drag > 0 ? "none" : "auto";
    host.appendChild(canvas);

    const ctx = canvas.getContext("webgl2", {
      antialias: false,
      alpha: true,
      premultipliedAlpha: true,
      depth: false,
      stencil: false,
      powerPreference: "high-performance",
    });
    if (!ctx) {
      if (canvas.parentNode === host) host.removeChild(canvas);
      return;
    }
    const gl: WebGL2RenderingContext = ctx;

    const readColour = makeColourReader();
    const sceneProg = buildProgram(gl, FRAG);
    const presentProg = buildProgram(gl, PRESENT_FRAG);
    const vao = gl.createVertexArray();

    const U = (p: WebGLProgram, n: string) => gl.getUniformLocation(p, n);
    const u = {
      res: U(sceneProg, "uRes"),
      A: U(sceneProg, "uA"),
      B: U(sceneProg, "uB"),
      C: U(sceneProg, "uC"),
      G: U(sceneProg, "uG"),
      linkCount: U(sceneProg, "uLinkCount"),
      groupCount: U(sceneProg, "uGroupCount"),
      le: U(sceneProg, "uLe"),
      r1: U(sceneProg, "uR1"),
      r2: U(sceneProg, "uR2"),
      bound: U(sceneProg, "uBound"),
      hull: U(sceneProg, "uHull"),
      camPos: U(sceneProg, "uCamPos"),
      camTarget: U(sceneProg, "uCamTarget"),
      pal: U(sceneProg, "uPal"),
      palCount: U(sceneProg, "uPalCount"),
      colScale: U(sceneProg, "uColScale"),
      colDrift: U(sceneProg, "uColDrift"),
      colMorph: U(sceneProg, "uColMorph"),
      metal: U(sceneProg, "uMetal"),
      mix: U(sceneProg, "uMix"),
      roll: U(sceneProg, "uRoll"),
      hist: U(sceneProg, "uHist"),
    };
    const pu = { tex: U(presentProg, "uTex"), res: U(presentProg, "uRes") };

    let W = 0;
    let H = 0;
    const tex: (WebGLTexture | null)[] = [null, null];
    const fbo: (WebGLFramebuffer | null)[] = [null, null];
    let readIdx = 0;

    function allocTargets(w: number, h: number) {
      for (let i = 0; i < 2; i++) {
        if (tex[i]) gl.deleteTexture(tex[i]);
        if (fbo[i]) gl.deleteFramebuffer(fbo[i]);
        const t = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, t);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        const f = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, f);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, t, 0);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        tex[i] = t;
        fbo[i] = f;
      }
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    let firstFrame = true;
    let cssPxW = 1;
    let cssPxH = 1;
    let roll = ROLL.down;
    let lastDir = "";

    function resize() {
      const cssW = Math.max(1, host!.clientWidth);
      const cssH = Math.max(1, host!.clientHeight);
      cssPxW = cssW;
      cssPxH = cssH;
      let dpr = Math.min(window.devicePixelRatio || 1, 2);

      const budget = 2_300_000;
      if (cssW * cssH * dpr * dpr > budget) {
        dpr = Math.max(0.75, Math.sqrt(budget / (cssW * cssH)));
      }
      const w = Math.max(1, Math.round(cssW * dpr));
      const h = Math.max(1, Math.round(cssH * dpr));
      if (w === W && h === H) return;
      W = w;
      H = h;
      canvas.width = w;
      canvas.height = h;
      allocTargets(w, h);
      firstFrame = true;
      fitSnap = true;
    }

    let nodeCount = 0;
    let pitch = 0;
    let maxPitch = 0;
    let cosMaxBend = 1;
    let linkLe = 0;
    let linkR2 = 0;
    let ropeLen = 0;
    let anchorGap = 0;
    let hangDepth = 0;
    let sepMin = 0;
    let px = new Float32Array(0);
    let py = new Float32Array(0);
    let pz = new Float32Array(0);
    let ox = new Float32Array(0);
    let oy = new Float32Array(0);
    let oz = new Float32Array(0);

    const bufA = new Float32Array(MAX_LINKS * 4);
    const bufB = new Float32Array(MAX_LINKS * 4);
    const bufC = new Float32Array(MAX_LINKS * 4);
    const bufG = new Float32Array(MAX_GROUPS * 4);
    const bufPal = new Float32Array(MAX_PAL * 3);

    let camZ = 0;
    let camY = 0;
    let camX = 0;
    let pickRadius = 0;

    let fitMidX = 0;
    let fitSnap = true;
    let grabIndex = -1;
    let grabPointer = -1;
    let grabDepth = 0;
    let grabX = 0;
    let grabY = 0;
    let grabZ = 0;
    let grabPull = 0;

    let geomKey = "";

    function buildRope(n: number, le: number, r2: number) {
      nodeCount = n;
      pitch = 2 * (le + R1 - r2) - 0.25 * R1;
      maxPitch = 2 * (le + R1 - r2) - CLAMP_MARGIN * R1;
      cosMaxBend = Math.cos(articulationLimit(le, r2, maxPitch) * BEND_SAFETY);
      linkLe = le;
      linkR2 = r2;
      ropeLen = pitch * (n - 1);
      sepMin = (R1 + r2) * 1.35;

      px = new Float32Array(n);
      py = new Float32Array(n);
      pz = new Float32Array(n);
      ox = new Float32Array(n);
      oy = new Float32Array(n);
      oz = new Float32Array(n);

      const half = (n - 1) / 2;
      for (let i = 0; i < n; i++) {
        const k = i <= half ? i / half : (n - 1 - i) / half;
        const side = i <= half ? -1 : 1;
        px[i] = side * (anchorGap / 2) * (1 - k);
        py[i] = -hangDepth * k;
        pz[i] = 0;
        ox[i] = px[i];
        oy[i] = py[i];
        oz[i] = pz[i];
      }
      grabIndex = -1;
    }

    function setAnchorGeometry(spreadPct: number) {
      const ratio = 0.03 + clamp01(spreadPct / 100) * 0.47;
      anchorGap = ropeLen * ratio;
      hangDepth = Math.sqrt(Math.max(ropeLen * ropeLen - anchorGap * anchorGap, 0.01)) / 2;
    }

    let snapX = new Float32Array(0);
    let snapY = new Float32Array(0);
    let snapZ = new Float32Array(0);
    let tanX = new Float32Array(0);
    let tanY = new Float32Array(0);
    let tanZ = new Float32Array(0);

    function tangents() {
      const n = nodeCount;
      if (tanX.length < n) {
        tanX = new Float32Array(n); tanY = new Float32Array(n); tanZ = new Float32Array(n);
      }
      for (let i = 0; i < n; i++) {
        const a = i > 0 ? i - 1 : 0;
        const b = i < n - 1 ? i + 1 : n - 1;
        const x = px[b] - px[a];
        const y = py[b] - py[a];
        const z = pz[b] - pz[a];
        const l = Math.sqrt(x * x + y * y + z * z) || 1e-6;
        tanX[i] = x / l; tanY[i] = y / l; tanZ[i] = z / l;
      }
    }

    function clearance(i: number, j: number) {
      const L = linkLe + R1;
      const vx = px[i] - px[j];
      const vy = py[i] - py[j];
      const vz = pz[i] - pz[j];
      const sg = tanX[j] * vx + tanY[j] * vy + tanZ[j] * vz >= 0 ? 1 : -1;

      const dx = px[j] + sg * L * tanX[j] - px[i];
      const dy = py[j] + sg * L * tanY[j] - py[i];
      const dz = pz[j] + sg * L * tanZ[j] - pz[i];
      const par = dx * tanX[i] + dy * tanY[i] + dz * tanZ[i];
      const ex = dx - tanX[i] * par;
      const ey = dy - tanY[i] * par;
      const ez = dz - tanZ[i] * par;
      const perp = Math.sqrt(ex * ex + ey * ey + ez * ez);
      const run = Math.abs(par) - linkLe;
      const v = run > 0 ? run : 0;
      return R1 - linkR2 - Math.sqrt(perp * perp + v * v);
    }

    function straighten(m: number, amount: number) {
      const n = nodeCount;
      const i = m - 1;
      const j = m + 1;
      if (i < 0 || j > n - 1) return;
      const pinI = i === 0;
      const pinJ = j === n - 1;
      if (pinI && pinJ) return;
      let dx = px[j] - px[i];
      let dy = py[j] - py[i];
      let dz = pz[j] - pz[i];
      const d = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1e-6;
      const k = (amount / d) * (pinI || pinJ ? 1 : 0.5);
      dx *= k; dy *= k; dz *= k;
      if (!pinI) { px[i] -= dx; py[i] -= dy; pz[i] -= dz; }
      if (!pinJ) { px[j] += dx; py[j] += dy; pz[j] += dz; }
    }

    function step(dt: number, tt: number, swayPct: number) {
      const n = nodeCount;
      if (n < 2) return;
      const amp = ropeLen * SWAY_AMP * (swayPct / 100);
      const ax0 = -anchorGap / 2 + amp * Math.sin(tt * 0.9);
      const az0 = amp * 0.85 * Math.sin(tt * 0.61 + 1.1);
      const ax1 = anchorGap / 2 + amp * Math.sin(tt * 0.77 + 2.0);
      const az1 = amp * 0.95 * Math.sin(tt * 1.3 + 0.4);

      const g = GRAVITY * dt * dt;
      for (let i = 0; i < n; i++) {
        const cx = px[i];
        const cy = py[i];
        const cz = pz[i];
        px[i] = cx + (cx - ox[i]) * DAMPING;
        py[i] = cy + (cy - oy[i]) * DAMPING + g;
        pz[i] = cz + (cz - oz[i]) * DAMPING;
        ox[i] = cx;
        oy[i] = cy;
        oz[i] = cz;
      }

      const g0 = grabIndex;
      let tgX = grabX;
      let tgY = grabY;
      let tgZ = grabZ;
      if (g0 > 0 && g0 < n - 1) {
        for (let rep = 0; rep < 4; rep++) {
          for (let e = 0; e < 2; e++) {
            const ax = e === 0 ? ax0 : ax1;
            const az = e === 0 ? az0 : az1;
            const reach = pitch * (e === 0 ? g0 : n - 1 - g0) * 0.985;
            const dx = tgX - ax;
            const dy = tgY;
            const dz = tgZ - az;
            const d = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1e-6;
            if (d <= reach) continue;
            const sc = reach / d;
            tgX = ax + dx * sc;
            tgY = dy * sc;
            tgZ = az + dz * sc;
          }
        }
        px[g0] += (tgX - px[g0]) * grabPull;
        py[g0] += (tgY - py[g0]) * grabPull;
        pz[g0] += (tgZ - pz[g0]) * grabPull;
      }

      for (let pass = 0; pass < RELAX_PASSES; pass++) {
        px[0] = ax0; py[0] = 0; pz[0] = az0;
        px[n - 1] = ax1; py[n - 1] = 0; pz[n - 1] = az1;

        for (let i = 0; i < n - 1; i++) {
          const j = i + 1;
          let dx = px[j] - px[i];
          let dy = py[j] - py[i];
          let dz = pz[j] - pz[i];
          const d = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1e-6;
          const k = ((d - pitch) / d) * 0.5;
          dx *= k; dy *= k; dz *= k;
          if (i !== 0) { px[i] += dx; py[i] += dy; pz[i] += dz; }
          if (j !== n - 1) { px[j] -= dx; py[j] -= dy; pz[j] -= dz; }
        }

        if (g0 > 0 && g0 < n - 1) {
          const k = grabPull * 0.5;
          px[g0] += (tgX - px[g0]) * k;
          py[g0] += (tgY - py[g0]) * k;
          pz[g0] += (tgZ - pz[g0]) * k;
        }

        if (pass % 3 === 0) {
          for (let i = 0; i < n; i++) {
            for (let j = i + 2; j < n; j++) {
              let dx = px[j] - px[i];
              let dy = py[j] - py[i];
              let dz = pz[j] - pz[i];
              const d2 = dx * dx + dy * dy + dz * dz;
              if (d2 > sepMin * sepMin || d2 < 1e-9) continue;
              const d = Math.sqrt(d2);
              const k = ((sepMin - d) / d) * 0.28;
              dx *= k; dy *= k; dz *= k;
              if (i !== 0 && i !== n - 1) { px[i] -= dx; py[i] -= dy; pz[i] -= dz; }
              if (j !== 0 && j !== n - 1) { px[j] += dx; py[j] += dy; pz[j] += dz; }
            }
          }
        }
      }

      const place = (i: number, k: number, useCone: boolean) => {
        let ex = px[k] - px[i];
        let ey = py[k] - py[i];
        let ez = pz[k] - pz[i];
        const el = Math.sqrt(ex * ex + ey * ey + ez * ez) || 1e-6;
        const len = el > maxPitch ? maxPitch : el;
        ex /= el; ey /= el; ez /= el;

        const h = i + (i - k);
        if (useCone && h >= 0 && h < nodeCount) {
          let dx = px[i] - px[h];
          let dy = py[i] - py[h];
          let dz = pz[i] - pz[h];
          const dl = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1e-6;
          dx /= dl; dy /= dl; dz /= dl;
          const ca = dx * ex + dy * ey + dz * ez;
          if (ca < cosMaxBend) {
            let wx = ex - dx * ca;
            let wy = ey - dy * ca;
            let wz = ez - dz * ca;
            let wl = Math.sqrt(wx * wx + wy * wy + wz * wz);
            if (wl < 1e-6) {
              wx = Math.abs(dx) < 0.9 ? 1 : 0;
              wy = Math.abs(dx) < 0.9 ? 0 : 1;
              wz = 0;
              const dp = wx * dx + wy * dy + wz * dz;
              wx -= dx * dp; wy -= dy * dp; wz -= dz * dp;
              wl = Math.sqrt(wx * wx + wy * wy + wz * wz) || 1e-6;
            }
            wx /= wl; wy /= wl; wz /= wl;
            const sn = Math.sqrt(Math.max(1 - cosMaxBend * cosMaxBend, 0));
            ex = dx * cosMaxBend + wx * sn;
            ey = dy * cosMaxBend + wy * sn;
            ez = dz * cosMaxBend + wz * sn;
          }
        }
        px[k] = px[i] + ex * len;
        py[k] = py[i] + ey * len;
        pz[k] = pz[i] + ez * len;
      };

      const walk = (useCone: boolean) => {
        px[0] = ax0; py[0] = 0; pz[0] = az0;
        for (let i = 1; i < n; i++) place(i - 1, i, useCone);
        px[n - 1] = ax1; py[n - 1] = 0; pz[n - 1] = az1;
        for (let i = n - 2; i >= 0; i--) place(i + 1, i, useCone);
      };

      if (snapX.length < n) {
        snapX = new Float32Array(n); snapY = new Float32Array(n); snapZ = new Float32Array(n);
      }
      for (let i = 0; i < n; i++) { snapX[i] = px[i]; snapY[i] = py[i]; snapZ[i] = pz[i]; }

      for (let rep = 0; rep < CLAMP_PASSES; rep++) walk(true);

      for (let rep = 0; rep < THREAD_PASSES; rep++) {
        px[0] = ax0; py[0] = 0; pz[0] = az0;
        px[n - 1] = ax1; py[n - 1] = 0; pz[n - 1] = az1;
        tangents();
        let touched = false;
        for (let i = 0; i < n - 1; i++) {
          const deficit = THREAD_FLOOR - clearance(i, i + 1);
          if (deficit <= 0) continue;
          touched = true;
          let push = deficit * THREAD_GAIN;
          if (push > THREAD_STEP * maxPitch) push = THREAD_STEP * maxPitch;
          straighten(i, push);
          straighten(i + 1, push);
        }
        if (!touched) break;
        walk(false);
      }

      walk(false);

      px[0] = ax0; py[0] = 0; pz[0] = az0;
      px[n - 1] = ax1; py[n - 1] = 0; pz[n - 1] = az1;
      for (let i = 0; i < n - 1; i++) {
        const j = i + 1;
        const pinI = i === 0;
        const pinJ = j === n - 1;
        if (pinI && pinJ) continue;
        let dx = px[j] - px[i];
        let dy = py[j] - py[i];
        let dz = pz[j] - pz[i];
        const d = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1e-6;
        if (d <= maxPitch) continue;
        const k = ((d - maxPitch) / d) * (pinI || pinJ ? 1 : 0.5);
        dx *= k; dy *= k; dz *= k;
        if (!pinI) { px[i] += dx; py[i] += dy; pz[i] += dz; }
        if (!pinJ) { px[j] -= dx; py[j] -= dy; pz[j] -= dz; }
      }

      for (let i = 0; i < n; i++) {
        ox[i] += px[i] - snapX[i];
        oy[i] += py[i] - snapY[i];
        oz[i] += pz[i] - snapZ[i];
      }
    }

    function pack(bound: number) {
      const n = nodeCount;
      let rx = 0; let ry = 0; let rz = 1;
      let hx = 0; let hy = 0; let hz = 0;
      let xMin = 1e9; let xMax = -1e9;

      for (let i = 0; i < n; i++) {
        const ip = Math.max(i - 1, 0);
        const iq = Math.min(i + 1, n - 1);
        let tx = px[iq] - px[ip];
        let ty = py[iq] - py[ip];
        let tz = pz[iq] - pz[ip];
        const tl = Math.sqrt(tx * tx + ty * ty + tz * tz) || 1e-6;
        tx /= tl; ty /= tl; tz /= tl;

        const dp = rx * tx + ry * ty + rz * tz;
        rx -= tx * dp; ry -= ty * dp; rz -= tz * dp;
        let rl = Math.sqrt(rx * rx + ry * ry + rz * rz);
        if (rl < 1e-4) {
          rx = Math.abs(tx) < 0.9 ? 1 : 0;
          ry = Math.abs(tx) < 0.9 ? 0 : 1;
          rz = 0;
          const d2 = rx * tx + ry * ty + rz * tz;
          rx -= tx * d2; ry -= ty * d2; rz -= tz * d2;
          rl = Math.sqrt(rx * rx + ry * ry + rz * rz) || 1e-6;
        }
        rx /= rl; ry /= rl; rz /= rl;

        const o = i * 4;
        bufA[o] = px[i]; bufA[o + 1] = py[i]; bufA[o + 2] = pz[i]; bufA[o + 3] = i * pitch;
        bufB[o] = tx; bufB[o + 1] = ty; bufB[o + 2] = tz; bufB[o + 3] = i % 2;
        bufC[o] = rx; bufC[o + 1] = ry; bufC[o + 2] = rz; bufC[o + 3] = 0;

        hx += px[i]; hy += py[i]; hz += pz[i];
        if (px[i] < xMin) xMin = px[i];
        if (px[i] > xMax) xMax = px[i];
      }

      hx /= n; hy /= n; hz /= n;
      let hr = 0;
      for (let i = 0; i < n; i++) {
        const dx = px[i] - hx;
        const dy = py[i] - hy;
        const dz = pz[i] - hz;
        hr = Math.max(hr, Math.sqrt(dx * dx + dy * dy + dz * dz));
      }

      const groups = Math.ceil(n / GROUP_SIZE);
      for (let g = 0; g < groups; g++) {
        const i0 = g * GROUP_SIZE;
        const i1 = Math.min(i0 + GROUP_SIZE, n);
        let cx = 0; let cy = 0; let cz = 0;
        for (let i = i0; i < i1; i++) { cx += px[i]; cy += py[i]; cz += pz[i]; }
        const c = i1 - i0;
        cx /= c; cy /= c; cz /= c;
        let r = 0;
        for (let i = i0; i < i1; i++) {
          const dx = px[i] - cx;
          const dy = py[i] - cy;
          const dz = pz[i] - cz;
          r = Math.max(r, Math.sqrt(dx * dx + dy * dy + dz * dz));
        }
        const o = g * 4;
        bufG[o] = cx; bufG[o + 1] = cy; bufG[o + 2] = cz; bufG[o + 3] = r + bound;
      }

      return { groups, hull: [hx, hy, hz, hr + bound] as const, xMin, xMax };
    }

    function rayFor(clientX: number, clientY: number) {
      const r = host!.getBoundingClientRect();
      const sx = clientX - r.left - r.width / 2;
      const sy = r.top + r.height / 2 - clientY;
      const cx = roll[0] * sx + roll[2] * sy;
      const cy = roll[1] * sx + roll[3] * sy;
      const cH = Math.max(Math.abs(roll[1] * r.width + roll[3] * r.height), 1);
      const qx = (2 * cx) / cH;
      const qy = (2 * cy) / cH;
      const inv = 1 / Math.sqrt(qx * qx + qy * qy + LENS * LENS);
      return { dx: qx * inv, dy: qy * inv, dz: -LENS * inv };
    }

    function onPointerDown(e: PointerEvent) {
      if (propsRef.current.drag <= 0 || nodeCount < 3 || grabIndex >= 0) return;
      const { dx, dy, dz } = rayFor(e.clientX, e.clientY);
      let best = -1;
      let bestD = pickRadius;
      let bestT = 0;

      for (let i = 1; i < nodeCount - 1; i++) {
        const vx = px[i] - camX;
        const vy = py[i] - camY;
        const vz = pz[i] - camZ;
        const t = vx * dx + vy * dy + vz * dz;
        if (t <= 0) continue;
        const ex = vx - dx * t;
        const ey = vy - dy * t;
        const ez = vz - dz * t;
        const d = Math.sqrt(ex * ex + ey * ey + ez * ez);
        if (d < bestD) {
          bestD = d;
          best = i;
          bestT = t;
        }
      }
      if (best < 0) return;
      grabIndex = best;
      grabDepth = bestT;
      grabX = camX + dx * bestT;
      grabY = camY + dy * bestT;
      grabZ = camZ + dz * bestT;
      grabPointer = e.pointerId;

      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);
      window.addEventListener("pointercancel", onPointerUp);
      e.preventDefault();
    }

    function onPointerMove(e: PointerEvent) {
      if (grabIndex < 0 || e.pointerId !== grabPointer) return;
      const { dx, dy, dz } = rayFor(e.clientX, e.clientY);
      grabX = camX + dx * grabDepth;
      grabY = camY + dy * grabDepth;
      grabZ = camZ + dz * grabDepth;
      e.preventDefault();
    }

    function release() {
      grabIndex = -1;
      grabPointer = -1;
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
    }

    function onPointerUp(e: PointerEvent) {
      if (e.pointerId === grabPointer) release();
    }

    host.addEventListener("pointerdown", onPointerDown);

    let raf = 0;
    let last = 0;
    let swayPhase = 0;
    let driftClock = 0;
    let morphClock = 0;
    let acc = 0;
    let visible = true;
    let cursorState = "";

    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0 }
    );
    io.observe(host);

    const ro = new ResizeObserver(() => resize());
    ro.observe(host);
    resize();

    function frame(now: number) {
      raf = requestAnimationFrame(frame);
      if (!visible || W === 0) {
        last = now;
        return;
      }
      const dt = last === 0 ? 1 / 60 : Math.min((now - last) / 1000, 0.05);
      last = now;

      const p = propsRef.current;
      roll = ROLL[p.direction] ?? ROLL.down;
      if (p.direction !== lastDir) {
        lastDir = p.direction;
        fitSnap = true;
        firstFrame = true;
      }

      swayPhase += dt * SWAY_RATE * (Math.max(p.speed, 0) / 50);
      const n = Math.max(MIN_LINKS, Math.min(Math.round(p.density), MAX_LINKS));
      const le = (0.30 + clamp01(p.linkLength / 100) * 1.20) * R1;
      const r2 = (0.14 + clamp01(p.linkThickness / 100) * 0.34) * R1;
      const key = `${n}|${le.toFixed(4)}|${r2.toFixed(4)}`;

      if (key !== geomKey) {
        geomKey = key;
        pitch = 2 * (le + R1 - r2) - 0.25 * R1;
        maxPitch = 2 * (le + R1 - r2) - CLAMP_MARGIN * R1;
        cosMaxBend = Math.cos(articulationLimit(le, r2, maxPitch) * BEND_SAFETY);
        linkLe = le;
        linkR2 = r2;
        ropeLen = pitch * (n - 1);
        setAnchorGeometry(p.spread);
        buildRope(n, le, r2);
        for (let i = 0; i < WARMUP_STEPS; i++) step(SUB_DT, swayPhase, p.sway);
        firstFrame = true;
        fitSnap = true;
      } else {
        setAnchorGeometry(p.spread);
      }

      if (p.drag <= 0 && grabIndex >= 0) release();
      grabPull = 0.05 + clamp01(p.drag / 100) * 0.55;

      acc += dt;
      let steps = 0;
      while (acc >= SUB_DT && steps < MAX_SUBSTEPS) {
        step(SUB_DT, swayPhase, p.sway);
        acc -= SUB_DT;
        steps++;
      }
      if (acc > SUB_DT * MAX_SUBSTEPS) acc = 0;

      const bound = le + R1 + r2;
      const { groups, hull, xMin, xMax } = pack(bound);
      const aspect =
        Math.abs(roll[0] * W + roll[2] * H) / Math.max(Math.abs(roll[1] * W + roll[3] * H), 1);
      const fill = FILL / (Math.max(p.distance, 1) / 100);
      const kDn = 1 - Math.exp(-dt / 4.0);
      const wantMidX = (xMin + xMax) / 2;
      if (fitSnap) fitMidX = wantMidX;
      else fitMidX += (wantMidX - fitMidX) * kDn;

      const mB = 2 * (1 - fill);
      const den = 2 - mB;
      let wantCamZ = 0;
      for (let i = 0; i < n; i++) {
        const c = pz[i] + bound;
        const a = py[i] - bound;
        const dv = ((1 - mB) * c - LENS * a) / den;
        const b = Math.abs(px[i] - fitMidX) + bound;
        const dh = c + (LENS * b) / (fill * aspect);
        const d = dv > dh ? dv : dh;
        if (d > wantCamZ) wantCamZ = d;
        if (c + bound > wantCamZ) wantCamZ = c + bound;
      }

      if (fitSnap) {
        camZ = wantCamZ;
        fitSnap = false;
      } else {
        const kUp = 1 - Math.exp(-dt / 0.12);
        camZ += (wantCamZ - camZ) * (wantCamZ > camZ ? kUp : kDn);
      }
      camX = fitMidX;
      camY = -camZ / LENS;

      const cssCanonH = Math.max(Math.abs(roll[1] * cssPxW + roll[3] * cssPxH), 1);
      const worldPerPx = (2 / cssCanonH) * (camZ / LENS);
      pickRadius = Math.max(bound * 1.2, TOUCH_PX * worldPerPx);

      const wantCursor = p.drag > 0 ? (grabIndex >= 0 ? "grabbing" : "grab") : "default";
      if (wantCursor !== cursorState) {
        cursorState = wantCursor;
        host!.style.cursor = wantCursor;
      }

      const list = p.colors && p.colors.length ? p.colors : DEFAULT_PALETTE;
      const pal = list.slice(0, MAX_PAL);
      for (let i = 0; i < pal.length; i++) {
        const c = readColour(pal[i]);
        bufPal[i * 3] = c[0];
        bufPal[i * 3 + 1] = c[1];
        bufPal[i * 3 + 2] = c[2];
      }

      driftClock += dt * DRIFT_RATE * (Math.max(p.drift, 0) / 50);
      morphClock += dt * MORPH_RATE * (Math.max(p.morph, 0) / 50);

      const base = 1 - SMEAR;
      let mixAmt = 1 - Math.pow(1 - base, dt * 60);
      if (firstFrame) {
        mixAmt = 1;
        firstFrame = false;
      }

      const write = 1 - readIdx;

      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo[write]);
      gl.viewport(0, 0, W, H);
      gl.useProgram(sceneProg);
      gl.bindVertexArray(vao);

      gl.uniform2f(u.res, W, H);
      gl.uniform4fv(u.A, bufA);
      gl.uniform4fv(u.B, bufB);
      gl.uniform4fv(u.C, bufC);
      gl.uniform4fv(u.G, bufG);
      gl.uniform1i(u.linkCount, n);
      gl.uniform1i(u.groupCount, groups);
      gl.uniform1f(u.le, le);
      gl.uniform1f(u.r1, R1);
      gl.uniform1f(u.r2, r2);
      gl.uniform1f(u.bound, bound);
      gl.uniform4f(u.hull, hull[0], hull[1], hull[2], hull[3]);
      gl.uniform3f(u.camPos, camX, camY, camZ);
      gl.uniform3f(u.camTarget, camX, camY, 0);
      gl.uniform3fv(u.pal, bufPal);
      gl.uniform1i(u.palCount, Math.max(pal.length, 1));
      gl.uniform1f(u.colScale, COL_SCALE / (Math.max(p.scale, 1) / 100));
      gl.uniform1f(u.colDrift, driftClock);
      gl.uniform1f(u.colMorph, morphClock);
      gl.uniform1f(u.metal, p.metallic ? 1 : 0);
      gl.uniform1f(u.mix, mixAmt);
      gl.uniformMatrix2fv(u.roll, false, roll);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, tex[readIdx]);
      gl.uniform1i(u.hist, 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, W, H);
      gl.useProgram(presentProg);
      gl.uniform2f(pu.res, W, H);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, tex[write]);
      gl.uniform1i(pu.tex, 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      readIdx = write;
    }

    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      host.removeEventListener("pointerdown", onPointerDown);
      release();
      for (let i = 0; i < 2; i++) {
        if (tex[i]) gl.deleteTexture(tex[i]);
        if (fbo[i]) gl.deleteFramebuffer(fbo[i]);
      }
      gl.deleteVertexArray(vao);
      gl.deleteProgram(sceneProg);
      gl.deleteProgram(presentProg);

      if (canvas.parentNode === host) {
        host.removeChild(canvas);
      }
    };
  }, []);

  return (
    <div
      ref={hostRef}
      className={className}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        background,
        touchAction: drag > 0 ? "none" : "auto",
        ...style,
      }}
    />
  );
}

export default TaffyChain;
