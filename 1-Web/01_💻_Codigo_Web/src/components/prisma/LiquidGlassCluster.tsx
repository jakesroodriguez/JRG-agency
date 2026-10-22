import { useEffect, useRef, type CSSProperties } from "react";

export type FontValue = {
  fontFamily?: string;
  fontSize?: string | number;
  fontWeight?: string | number;
  fontStyle?: string;
  letterSpacing?: string | number;
  lineHeight?: string | number;
};

export type GlassGroup = {
  tint?: string;
  chromatic?: number;
  frost?: number;
};

export type OrientGroup = {
  angleX?: number;
  angleY?: number;
  angleZ?: number;
  offsetX?: number;
  offsetY?: number;
};

export type LiquidGlassClusterProps = {
  className?: string;
  style?: CSSProperties;
  background?: string;
  shape?: "X" | "Torus" | "Sphere";
  depth?: number;
  size?: number;
  speed?: number;
  direction?: "Clockwise" | "Counterclockwise";
  glass?: GlassGroup;
  orient?: OrientGroup;
};

const BEVEL = 0.025;
const CORE_REFRACT = 1.0;
const IOR = 1.5;
const THICKNESS = 2.0;
const IDLE_FLOAT = 0.05;
const TILT_RANGE = 0.5;
const TILT_RATE = 5;
const DRAG_GAIN = 0.01;
const SPIN_YAW = 0.5;
const SPIN_PITCH = 0.2;
const FOV = (45 * Math.PI) / 180;
const CAM_DIST = 5;
const DEG = Math.PI / 180;

function parseColor(
  input: string | undefined,
  fallback: [number, number, number]
): [number, number, number] {
  if (!input) return fallback;
  const s = input.trim();
  if (s[0] === "#") {
    let h = s.slice(1);
    if (h.length === 3 || h.length === 4)
      h = h
        .split("")
        .map((c) => c + c)
        .join("");
    if (h.length >= 6) {
      const r = parseInt(h.slice(0, 2), 16) / 255;
      const g = parseInt(h.slice(2, 4), 16) / 255;
      const b = parseInt(h.slice(4, 6), 16) / 255;
      if (!isNaN(r) && !isNaN(g) && !isNaN(b)) return [r, g, b];
    }
    return fallback;
  }
  const m = s.match(/rgba?\(([^)]+)\)/i);
  if (m) {
    const p = m[1].split(",").map((v) => parseFloat(v));
    if (p.length >= 3) return [p[0] / 255, p[1] / 255, p[2] / 255];
  }
  return fallback;
}

function numOf(v: string | number | undefined, fallback: number): number {
  if (typeof v === "number") return Number.isFinite(v) ? v : fallback;
  if (typeof v === "string") {
    const n = parseFloat(v);
    if (Number.isFinite(n)) return n;
  }
  return fallback;
}

function rotYX(yaw: number, pitch: number): Float32Array {
  const cy = Math.cos(yaw);
  const sy = Math.sin(yaw);
  const cx = Math.cos(pitch);
  const sx = Math.sin(pitch);
  const m = new Float32Array(9);
  m[0] = cy;
  m[1] = 0;
  m[2] = -sy;
  m[3] = sy * sx;
  m[4] = cx;
  m[5] = cy * sx;
  m[6] = sy * cx;
  m[7] = -sx;
  m[8] = cy * cx;
  return m;
}

function transpose3(m: Float32Array): Float32Array {
  const o = new Float32Array(9);
  o[0] = m[0];
  o[1] = m[3];
  o[2] = m[6];
  o[3] = m[1];
  o[4] = m[4];
  o[5] = m[7];
  o[6] = m[2];
  o[7] = m[5];
  o[8] = m[8];
  return o;
}

function mul3(a: Float32Array, b: Float32Array): Float32Array {
  const o = new Float32Array(9);
  for (let c = 0; c < 3; c++)
    for (let r = 0; r < 3; r++)
      o[c * 3 + r] =
        a[r] * b[c * 3] + a[3 + r] * b[c * 3 + 1] + a[6 + r] * b[c * 3 + 2];
  return o;
}

function rotYXZ(yaw: number, pitch: number, roll: number): Float32Array {
  const base = rotYX(yaw, pitch);
  if (roll === 0) return base;
  const c = Math.cos(roll);
  const s = Math.sin(roll);
  const rz = new Float32Array([c, s, 0, -s, c, 0, 0, 0, 1]);
  return mul3(base, rz);
}

function buildEnvCanvas(): HTMLCanvasElement | null {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.fillStyle = "#0c0c0c";
  ctx.fillRect(0, 0, 1024, 512);

  const softbox = (
    x: number,
    y: number,
    w: number,
    h: number,
    intensity: number
  ) => {
    const grd = ctx.createLinearGradient(x, y, x, y + h);
    grd.addColorStop(0, `rgba(225, 224, 204, ${intensity * 0.9})`);
    grd.addColorStop(1, `rgba(30, 30, 30, ${intensity * 0.2})`);
    ctx.fillStyle = grd;
    ctx.shadowColor = "#DEDBC8";
    ctx.shadowBlur = 80;
    ctx.beginPath();
    const rr = (ctx as unknown as { roundRect?: (...args: number[]) => void }).roundRect;
    if (typeof rr === "function") rr.call(ctx, x, y, w, h, 60);
    else ctx.rect(x, y, w, h);
    ctx.fill();
  };
  softbox(50, 100, 300, 312, 1);
  softbox(674, 100, 300, 312, 1);
  softbox(350, -50, 324, 150, 0.9);
  ctx.shadowBlur = 0;
  return canvas;
}

const FULLSCREEN_VS = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }`;

const GLASS_FS = `
precision highp float;

uniform vec2 uRes;
uniform float uAspect;
uniform float uTanHalf;

uniform sampler2D uEnv;
uniform mat3 uRot;
uniform mat3 uRotT;
uniform vec3 uCenter;
uniform float uScale;
uniform float uBoundR;

uniform float uShape;
uniform float uHalfDepth;
uniform float uBevel;
uniform float uTorusTube;

uniform float uDisp;
uniform float uFrost;
uniform vec3 uTint;

const float PI = 3.14159265359;
const float CORE_REFRACT = ${CORE_REFRACT.toFixed(4)};
const float IOR = ${IOR.toFixed(4)};
const float THICKNESS = ${THICKNESS.toFixed(4)};

float sdCross(vec2 p, vec2 b) {
    p = abs(p);
    p = (p.y > p.x) ? p.yx : p.xy;
    vec2 q = p - b;
    float k = max(q.y, q.x);
    vec2 w = (k > 0.0) ? q : vec2(b.y - p.x, -k);
    return sign(k) * length(max(w, 0.0));
}

vec2 r45(vec2 p) {
    const float c = 0.7071067811865476;
    return vec2((p.x + p.y) * c, (p.y - p.x) * c);
}

float extrudeRound(float d2, float pz, float hd, float r) {
    vec2 q = vec2(d2 + r, abs(pz) - hd + r);
    return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
}

float map(vec3 p) {
    if (uShape < 0.5) {
        return extrudeRound(sdCross(r45(p.xy), vec2(1.3, 0.35)), p.z, uHalfDepth, uBevel);
    } else if (uShape < 1.5) {
        vec2 q = vec2(length(p.xy) - 0.8, p.z);
        return length(q) - uTorusTube;
    }
    return length(p) - 1.2;
}

vec3 mapNormal(vec3 p) {
    const float e = 0.0015;
    vec2 k = vec2(1.0, -1.0);
    return normalize(
        k.xyy * map(p + k.xyy * e) +
        k.yyx * map(p + k.yyx * e) +
        k.yxy * map(p + k.yxy * e) +
        k.xxx * map(p + k.xxx * e)
    );
}

void main() {
    vec2 screenUv = gl_FragCoord.xy / uRes;
    vec2 ndc = screenUv * 2.0 - 1.0;

    vec3 D = normalize(vec3(ndc.x * uTanHalf * uAspect, ndc.y * uTanHalf, -1.0));
    vec3 rd = normalize(uRotT * D);
    vec3 ro = (uRotT * -uCenter) / uScale;

    float bb = dot(ro, rd);
    float cc = dot(ro, ro) - uBoundR * uBoundR;
    float hh = bb * bb - cc;
    if (hh < 0.0) discard;
    hh = sqrt(hh);
    float t = max(-bb - hh, 0.0);
    float tMax = -bb + hh;

    bool hit = false;
    for (int i = 0; i < 80; i++) {
        if (t > tMax) break;
        float d = map(ro + rd * t);
        if (d < 0.0009) { hit = true; break; }
        t += d * 0.9;
    }
    if (!hit) discard;

    vec3 pObj = ro + rd * t;
    vec3 nObj = mapNormal(pObj);

    vec3 vP = uCenter + uScale * (uRot * pObj);
    vec3 normal = normalize(uRot * nObj);
    vec3 viewDir = normalize(-vP);

    float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.5);

    vec3 reflectDir = reflect(-viewDir, normal);
    vec2 equirectUv = vec2(
        atan(reflectDir.z, reflectDir.x) / (2.0 * PI) + 0.5,
        asin(clamp(reflectDir.y, -1.0, 1.0)) / PI + 0.5
    );
    vec3 reflection = texture2D(uEnv, equirectUv).rgb * 2.4;

    vec3 glassTint = uTint;
    vec3 finalColor = mix(glassTint * 0.25, reflection, fresnel * 0.9 + 0.1);
    float alpha = max(0.4, fresnel * 0.9);

    gl_FragColor = vec4(finalColor, alpha);
}`;

function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  src: string
): WebGLShader | null {
  const s = gl.createShader(type);
  if (!s) return null;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.warn("LiquidGlassCluster shader:", gl.getShaderInfoLog(s));
    gl.deleteShader(s);
    return null;
  }
  return s;
}

function linkProg(
  gl: WebGLRenderingContext,
  vs: string,
  fs: string
): WebGLProgram | null {
  const v = compileShader(gl, gl.VERTEX_SHADER, vs);
  const f = compileShader(gl, gl.FRAGMENT_SHADER, fs);
  if (!v || !f) return null;
  const p = gl.createProgram();
  if (!p) return null;
  gl.attachShader(p, v);
  gl.attachShader(p, f);
  gl.linkProgram(p);
  gl.deleteShader(v);
  gl.deleteShader(f);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
    console.warn("LiquidGlassCluster link:", gl.getProgramInfoLog(p));
    gl.deleteProgram(p);
    return null;
  }
  return p;
}

export default function LiquidGlassCluster(props: LiquidGlassClusterProps) {
  const {
    className,
    style,
    background = "transparent",
    shape = "Torus",
    depth = 50,
    size = 75,
    speed = 25,
    direction = "Clockwise",
    glass = { tint: "#DEDBC8", chromatic: 22, frost: 15 },
    orient = { angleX: 30, angleY: 15, angleZ: 0, offsetX: 0, offsetY: 0 },
  } = props;

  const hostRef = useRef<HTMLDivElement | null>(null);

  const live = useRef({
    background,
    shape,
    depth: numOf(depth, 50),
    size: numOf(size, 75),
    speed: numOf(speed, 25),
    direction,
    gl3: {
      tint: glass.tint ?? "#DEDBC8",
      chromatic: numOf(glass.chromatic, 22),
      frost: numOf(glass.frost, 15),
    },
    or: {
      angleX: numOf(orient.angleX, 30),
      angleY: numOf(orient.angleY, 15),
      angleZ: numOf(orient.angleZ, 0),
      offsetX: numOf(orient.offsetX, 0),
      offsetY: numOf(orient.offsetY, 0),
    },
  });

  live.current = {
    background,
    shape,
    depth: numOf(depth, 50),
    size: numOf(size, 75),
    speed: numOf(speed, 25),
    direction,
    gl3: {
      tint: glass.tint ?? "#DEDBC8",
      chromatic: numOf(glass.chromatic, 22),
      frost: numOf(glass.frost, 15),
    },
    or: {
      angleX: numOf(orient.angleX, 30),
      angleY: numOf(orient.angleY, 15),
      angleZ: numOf(orient.angleZ, 0),
      offsetX: numOf(orient.offsetX, 0),
      offsetY: numOf(orient.offsetY, 0),
    },
  };

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    // Dynamically mount canvas for React 18 safety
    const canvas = document.createElement("canvas");
    canvas.style.position = "absolute";
    canvas.style.inset = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    canvas.style.pointerEvents = "auto";
    host.appendChild(canvas);

    const glInit = canvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      depth: false,
      premultipliedAlpha: true,
    });
    if (!glInit) {
      if (canvas.parentNode === host) host.removeChild(canvas);
      return;
    }
    const ctx = glInit;

    const glassProg = linkProg(ctx, FULLSCREEN_VS, GLASS_FS);
    if (!glassProg) {
      if (canvas.parentNode === host) host.removeChild(canvas);
      return;
    }

    const quadBuf = ctx.createBuffer();
    ctx.bindBuffer(ctx.ARRAY_BUFFER, quadBuf);
    ctx.bufferData(
      ctx.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      ctx.STATIC_DRAW
    );

    const aGlassPos = ctx.getAttribLocation(glassProg, "aPos");
    const u = {
      res: ctx.getUniformLocation(glassProg, "uRes"),
      aspect: ctx.getUniformLocation(glassProg, "uAspect"),
      tanHalf: ctx.getUniformLocation(glassProg, "uTanHalf"),
      env: ctx.getUniformLocation(glassProg, "uEnv"),
      rot: ctx.getUniformLocation(glassProg, "uRot"),
      rotT: ctx.getUniformLocation(glassProg, "uRotT"),
      center: ctx.getUniformLocation(glassProg, "uCenter"),
      scale: ctx.getUniformLocation(glassProg, "uScale"),
      boundR: ctx.getUniformLocation(glassProg, "uBoundR"),
      shape: ctx.getUniformLocation(glassProg, "uShape"),
      halfDepth: ctx.getUniformLocation(glassProg, "uHalfDepth"),
      bevel: ctx.getUniformLocation(glassProg, "uBevel"),
      torusTube: ctx.getUniformLocation(glassProg, "uTorusTube"),
      disp: ctx.getUniformLocation(glassProg, "uDisp"),
      frost: ctx.getUniformLocation(glassProg, "uFrost"),
      tint: ctx.getUniformLocation(glassProg, "uTint"),
    };

    function makeTex(wrap: number) {
      const t = ctx.createTexture()!;
      ctx.bindTexture(ctx.TEXTURE_2D, t);
      ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.LINEAR);
      ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.LINEAR);
      ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, wrap);
      ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, wrap);
      ctx.texImage2D(
        ctx.TEXTURE_2D,
        0,
        ctx.RGBA,
        1,
        1,
        0,
        ctx.RGBA,
        ctx.UNSIGNED_BYTE,
        new Uint8Array([0, 0, 0, 0])
      );
      return t;
    }

    const envTex = makeTex(ctx.REPEAT);
    const envCanvas = buildEnvCanvas();
    if (envCanvas) {
      ctx.bindTexture(ctx.TEXTURE_2D, envTex);
      ctx.pixelStorei(ctx.UNPACK_FLIP_Y_WEBGL, 0);
      ctx.texImage2D(
        ctx.TEXTURE_2D,
        0,
        ctx.RGBA,
        ctx.RGBA,
        ctx.UNSIGNED_BYTE,
        envCanvas
      );
    }

    let vw = 1;
    let vh = 1;

    let dragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let baseYaw = 0;
    let basePitch = 0;
    let dragStartYaw = 0;
    let dragStartPitch = 0;
    let tiltTargetX = 0;
    let tiltTargetY = 0;
    let tiltX = 0;
    let tiltY = 0;

    const onPointerDown = (e: PointerEvent) => {
      dragging = true;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      dragStartYaw = baseYaw;
      dragStartPitch = basePitch;
      try {
        canvas.setPointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / Math.max(rect.width, 1)) * 2 - 1;
      const ny = ((e.clientY - rect.top) / Math.max(rect.height, 1)) * 2 - 1;
      tiltTargetX = Math.max(-1, Math.min(1, nx)) * TILT_RANGE;
      tiltTargetY = Math.max(-1, Math.min(1, ny)) * TILT_RANGE;

      if (dragging) {
        const dx = e.clientX - dragStartX;
        const dy = e.clientY - dragStartY;
        baseYaw = dragStartYaw + dx * DRAG_GAIN;
        basePitch = Math.max(
          -1.4,
          Math.min(1.4, dragStartPitch + dy * DRAG_GAIN)
        );
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      dragging = false;
      try {
        canvas.releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    };

    const onLeave = () => {
      if (!dragging) {
        tiltTargetX = 0;
        tiltTargetY = 0;
      }
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);

    function resize() {
      if (!host) return;
      const rect = host.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      vw = Math.max(1, Math.round(rect.width * dpr));
      vh = Math.max(1, Math.round(rect.height * dpr));
      if (canvas.width !== vw || canvas.height !== vh) {
        canvas.width = vw;
        canvas.height = vh;
      }
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    let raf = 0;
    let lastT = performance.now();
    let elapsed = 0;

    function frame(now: number) {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.1, (now - lastT) / 1000);
      lastT = now;
      elapsed += dt;

      const p = live.current;

      const k = 1 - Math.exp(-TILT_RATE * dt);
      tiltX += (tiltTargetX - tiltX) * k;
      tiltY += (tiltTargetY - tiltY) * k;

      const spin =
        (p.speed / 50) * (p.direction === "Counterclockwise" ? -1 : 1);
      baseYaw += spin * SPIN_YAW * dt;
      basePitch += spin * SPIN_PITCH * dt;

      const o = p.or;
      const yaw = baseYaw + tiltX + o.angleY * DEG;
      const pitch =
        Math.max(-1.45, Math.min(1.45, basePitch - tiltY)) + o.angleX * DEG;
      const rot = rotYXZ(yaw, pitch, o.angleZ * DEG);
      const rotT = transpose3(rot);

      const camDist = CAM_DIST;
      const halfFrame = camDist * Math.tan(FOV / 2);
      const targetHalf = Math.max(0.02, p.size / 100) * halfFrame;

      const nativeDepth = Math.max(0, p.depth / 100);
      const torusTube = Math.max(0.02, nativeDepth * 0.5);
      let refHalf: number;
      let boundR: number;
      let shapeId: number;
      const halfDepth = nativeDepth * 0.5;
      const bevel = BEVEL;

      if (p.shape === "X") {
        shapeId = 0;
        refHalf = 1.3;
        boundR = Math.hypot(1.3, 0.35) + halfDepth + bevel;
      } else if (p.shape === "Torus") {
        shapeId = 1;
        refHalf = 0.8 + torusTube;
        boundR = 0.8 + torusTube;
      } else {
        shapeId = 2;
        refHalf = 1.2;
        boundR = 1.2;
      }

      const scale = targetHalf / refHalf;
      const floatY = Math.sin(elapsed * 2) * IDLE_FLOAT;
      const screenAspect = vw / vh;

      ctx.viewport(0, 0, vw, vh);
      ctx.clearColor(0, 0, 0, 0);
      ctx.clear(ctx.COLOR_BUFFER_BIT);

      ctx.bindBuffer(ctx.ARRAY_BUFFER, quadBuf);
      ctx.useProgram(glassProg);

      ctx.activeTexture(ctx.TEXTURE1);
      ctx.bindTexture(ctx.TEXTURE_2D, envTex);
      ctx.uniform1i(u.env, 1);

      ctx.uniform2f(u.res, vw, vh);
      ctx.uniform1f(u.aspect, screenAspect);
      ctx.uniform1f(u.tanHalf, Math.tan(FOV / 2));

      ctx.uniformMatrix3fv(u.rot, false, rot);
      ctx.uniformMatrix3fv(u.rotT, false, rotT);

      ctx.uniform3f(
        u.center,
        (o.offsetX / 100) * halfFrame * screenAspect,
        floatY + (o.offsetY / 100) * halfFrame,
        -camDist
      );
      ctx.uniform1f(u.scale, scale);
      ctx.uniform1f(u.boundR, boundR);

      ctx.uniform1f(u.shape, shapeId);
      ctx.uniform1f(u.halfDepth, halfDepth);
      ctx.uniform1f(u.bevel, bevel);
      ctx.uniform1f(u.torusTube, torusTube);

      const g = p.gl3;
      ctx.uniform1f(u.disp, g.chromatic / 1000);
      ctx.uniform1f(u.frost, g.frost / 100);
      const tint = parseColor(g.tint, [0.87, 0.86, 0.78]); // #DEDBC8
      ctx.uniform3f(u.tint, tint[0], tint[1], tint[2]);

      ctx.enableVertexAttribArray(aGlassPos);
      ctx.vertexAttribPointer(aGlassPos, 2, ctx.FLOAT, false, 0, 0);
      ctx.drawArrays(ctx.TRIANGLES, 0, 3);
    }
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      ctx.deleteBuffer(quadBuf);
      ctx.deleteTexture(envTex);
      ctx.deleteProgram(glassProg);
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
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        background,
        touchAction: "none",
        ...style,
      }}
    />
  );
}
