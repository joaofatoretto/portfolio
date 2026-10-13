/* Lab variant 5: the particle engine. No React in here.
   Every particle owns one cell of each scene's image (its target position and colour) and a seed. A renderer turns a
   small state (which scene it is leaving, which it is joining, how far along, the camera, the cursor) into points:
   the WebGL one does it in the vertex shader, the canvas 2D one does the same maths on the CPU (fallback). */
import { mulberry32 } from '../../../lib/signal';

export const SCENE_COUNT = 4;

export type State = {
  /** scene being left and scene being joined; f runs 0..1 across the move (0-.2 rest on a, .8-1 rest on b) */
  a: number; b: number; f: number;
  /** 1 while the page is still noise (the intro): everything is out in the field */
  pre: number;
  time: number;
  yaw: number; pitch: number;
  /** how much the bright pixels lift toward the viewer, 0..1 (flattened while the sharp picture is over the mosaic) */
  relief: number;
  /** cursor in px from the frame's centre (y down) and how strongly the lens is on, 0..1 */
  ptrX: number; ptrY: number; ptrAmt: number;
  /** frame centre from the stage centre, frame and stage size, in css px */
  frameCX: number; frameCY: number; frameW: number; frameH: number; stageW: number; stageH: number;
};

export type Data = {
  cols: number; rows: number; M: number; total: number;
  /** css px of one cell */
  cell: number;
  /** targets as fractions of the frame (-.5...5): scenes 0,1 then 2,3 */
  t01: Float32Array; t23: Float32Array;
  /** colours, one RGBA array per scene */
  c: Uint8Array[];
  /** x, y: a home in the noise field; z: random; w: 1 for dust (never forms) */
  seed: Float32Array;
  perm: Uint32Array[];
};

export interface Renderer {
  kind: 'webgl' | 'canvas2d';
  setData(d: Data): void;
  resize(w: number, h: number, dpr: number): void;
  render(s: State): void;
  dispose(): void;
}

// ---------- layout and sampling ----------

/** Cells on a grid with the frame's aspect, plus ~10% dust (snow that never forms). Seeds and orders are fixed. */
export function makeData(cols: number, rows: number, frameW: number): Data {
  const M = cols * rows, dust = Math.round(M * 0.1), total = M + dust;
  const rnd = mulberry32(4242);
  const seed = new Float32Array(total * 4);
  for (let p = 0; p < total; p++) { seed[p * 4] = rnd(); seed[p * 4 + 1] = rnd(); seed[p * 4 + 2] = rnd(); seed[p * 4 + 3] = p >= M ? 1 : 0; }
  const perm = Array.from({ length: SCENE_COUNT }, (_, k) => {
    const r = mulberry32(100 + k * 17), a = new Uint32Array(M);
    for (let i = 0; i < M; i++) a[i] = i;
    for (let i = M - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  });
  return {
    cols, rows, M, total, cell: frameW / cols, seed, perm,
    t01: new Float32Array(total * 4), t23: new Float32Array(total * 4),
    c: Array.from({ length: SCENE_COUNT }, () => new Uint8Array(total * 4)),
  };
}

/** Put scene k's picture (cols x rows RGBA, or null for black) into the particles' targets. */
export function fillScene(d: Data, k: number, rgba: Uint8ClampedArray | null) {
  const { cols, rows, M, perm } = d;
  const t = k < 2 ? d.t01 : d.t23, o = (k & 1) * 2, col = d.c[k], pm = perm[k];
  for (let p = 0; p < M; p++) {
    const cell = pm[p], cx = cell % cols, cy = (cell / cols) | 0;
    t[p * 4 + o] = (cx + 0.5) / cols - 0.5;
    t[p * 4 + o + 1] = (cy + 0.5) / rows - 0.5;
    if (rgba) { col[p * 4] = rgba[cell * 4]; col[p * 4 + 1] = rgba[cell * 4 + 1]; col[p * 4 + 2] = rgba[cell * 4 + 2]; }
    col[p * 4 + 3] = 255;
  }
}

/** A cover cropped to the frame's aspect (fx, fy place the crop) and averaged down to cols x rows, halving step by step
 *  so thin type and edges survive instead of aliasing. */
export function sampleImage(img: HTMLImageElement, cols: number, rows: number, fx: number, fy: number): Uint8ClampedArray {
  const iw = img.naturalWidth, ih = img.naturalHeight, aspect = cols / rows;
  let sx = 0, sy = 0, sw = iw, sh = ih;
  if (iw / ih > aspect) { sw = ih * aspect; sx = (iw - sw) * fx; } else { sh = iw / aspect; sy = (ih - sh) * fy; }
  const n = Math.max(0, Math.floor(Math.log2(sw / cols)));
  const mk = (w: number, h: number) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d', { willReadFrequently: true })!; x.imageSmoothingEnabled = true; x.imageSmoothingQuality = 'high'; return [c, x] as const; };
  let [cv, cx] = mk(cols * 2 ** n, rows * 2 ** n);
  cx.drawImage(img, sx, sy, sw, sh, 0, 0, cv.width, cv.height);
  for (let i = 0; i < n; i++) {
    const [c2, x2] = mk(cv.width / 2, cv.height / 2);
    x2.drawImage(cv, 0, 0, c2.width, c2.height);
    cv = c2; cx = x2;
  }
  return sharpen(cx.getImageData(0, 0, cols, rows).data, cols, rows, 0.75);
}

/** Unsharp mask: at 3-4 px per cell, thin type needs its edges pushed back or it melts into grey. */
function sharpen(src: Uint8ClampedArray, w: number, h: number, amount: number) {
  const out = new Uint8ClampedArray(src.length);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const o = (y * w + x) * 4;
    for (let c = 0; c < 3; c++) {
      let s = 0, n = 0;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        const xx = x + dx, yy = y + dy;
        if (xx < 0 || yy < 0 || xx >= w || yy >= h) continue;
        s += src[(yy * w + xx) * 4 + c]; n++;
      }
      out[o + c] = src[o + c] + amount * (src[o + c] - s / n);
    }
    out[o + 3] = 255;
  }
  return out;
}

// ---------- shared constants ----------
const ROSE = [1, 0.24, 0.43], CYAN = [0.13, 0.72, 1];
const INK = [10 / 255, 10 / 255, 11 / 255];
/** relief depth and perspective, in frame widths: the lift of the brightest pixel is small enough not to push the edge out */
const Z_K = 0.05, PERSP_K = 2.6;

// ---------- WebGL ----------

const VERT = `
precision highp float;
attribute vec4 aT01; attribute vec4 aT23; attribute vec4 aSeed;
attribute vec4 aC0; attribute vec4 aC1; attribute vec4 aC2; attribute vec4 aC3;
uniform vec2 uStage; uniform vec2 uFrame; uniform vec2 uFrameC; uniform vec2 uPtr;
uniform float uA; uniform float uB; uniform float uF; uniform float uPre; uniform float uTime; uniform float uDpr;
uniform float uCell; uniform float uYaw; uniform float uPitch; uniform float uPtrAmt; uniform float uZ; uniform float uPersp;
varying vec3 vCol; varying float vForm; varying float vOp;

float h1(float x) { return fract(sin(x) * 43758.5453123); }
vec2 tgt(float k) { if (k < .5) return aT01.xy; if (k < 1.5) return aT01.zw; if (k < 2.5) return aT23.xy; return aT23.zw; }
vec3 colr(float k) { if (k < .5) return aC0.rgb; if (k < 1.5) return aC1.rgb; if (k < 2.5) return aC2.rgb; return aC3.rgb; }

void main() {
  float dust = aSeed.w, t = uTime, PI = 3.14159265;
  float q1 = h1(aSeed.z * 311.7), q2 = h1(aSeed.z * 57.3 + 1.7), q3 = h1(aSeed.z * 913.1 + 4.1);
  vec2 S = tgt(uA) * uFrame, D = tgt(uB) * uFrame;

  // a home in the noise field, drifting through it
  vec2 base = (aSeed.xy - .5) * uStage * 1.06;
  // ...gathered into fibres (the brand's many voices): each point rides one of 34 wavy lines across the stage
  float fi = floor(aSeed.y * 34.);
  float fy = (fi + .5) / 34. - .5;
  float fibre = fy * uStage.y * 1.06 + 62. * sin(base.x * .0046 + fi * .9 + t * .22) + 34. * sin(base.x * .0112 - fi * 1.7 + t * .37);
  base = vec2(base.x, mix(base.y, fibre, .62)) - uFrameC;
  vec2 N = base
    + 38. * vec2(sin(t * .37 + aSeed.z * 6.283 + base.y * .004), cos(t * .31 + aSeed.x * 6.283 + base.x * .004))
    + 16. * vec2(sin(t * 1.1 + q1 * 40.), cos(t * .9 + q2 * 40.));

  // leaving the image into the field (staggered, bursts out), then locking into the next one (a wave sweeps across it)
  float f = uF;
  float lvT = clamp((f - .20 - .10 * q1) / .20, 0., 1.);
  float tx = D.x / uFrame.x + .5;
  float arT = clamp((f - .50 - .15 * mix(tx, q2, .3)) / .15, 0., 1.);
  lvT = max(lvT, uPre);
  if (dust > .5) { lvT = 1.; arT = 0.; }
  float lv = 1. - pow(1. - lvT, 3.);
  float ar = 1. - pow(1. - arT, 4.);

  vec2 dl = N - S;
  vec2 pL = mix(S, N, lv) + vec2(-dl.y, dl.x) * sin(PI * lv) * .28 * (q3 * 2. - 1.);
  vec2 da = D - pL;
  vec2 p = mix(pL, D, ar) + vec2(-da.y, da.x) * sin(PI * ar) * .20 * (q1 * 2. - 1.);
  float mv = clamp(4. * lv * (1. - lv) * (1. - ar) + 4. * ar * (1. - ar), 0., 1.);
  p += 12. * mv * vec2(sin(t * 7. + q1 * 30.), cos(t * 6. + q2 * 30.));

  float form = ar + (1. - ar) * (1. - lv);
  if (dust > .5) form = 0.;

  // colour: snow until it locks, the picture's own colour after; rose / cyan on whatever is moving
  vec3 c = ar > .001 ? colr(uB) : colr(uA);
  float lum = dot(c, vec3(.299, .587, .114));
  float flick = h1(aSeed.x * 91. + floor(t * 24.) * 7.13 + q2 * 13.);
  vec3 snow = vec3(mix(.3, 1., flick * flick));
  vec3 col = mix(snow, c, smoothstep(0., 1., form));
  vec3 tint = q3 > .5 ? vec3(${ROSE.join(',')}) : vec3(${CYAN.join(',')});
  col = mix(col, tint, mv * .8 * (1. - .4 * form));
  col += vec3(.45) * exp(-pow((ar - .93) * 16., 2.)) * step(.001, ar) * step(ar, .999);

  // the lens of noise around the cursor
  vec2 dp = p - uPtr;
  float r = length(dp);
  float lens = exp(-r * r / (2. * pow(uFrame.x * .085, 2.))) * uPtrAmt;
  p += normalize(dp + vec2(.001)) * lens * uFrame.x * .06
     + (vec2(h1(aSeed.x * 77. + floor(t * 30.)), h1(aSeed.y * 53. + floor(t * 30.) * 1.3)) - .5) * lens * 46.;
  form *= 1. - .65 * lens;

  // relief: brighter pixels lift toward the viewer; the whole image turns a few degrees
  float z = (lum - .32) * uZ * form + (q2 - .5) * 16. * (1. - form);
  float cy = cos(uYaw), sy = sin(uYaw), cp = cos(uPitch), sp = sin(uPitch);
  float x1 = p.x * cy + z * sy, z1 = -p.x * sy + z * cy;
  float y1 = p.y * cp - z1 * sp, z2 = p.y * sp + z1 * cp;
  float sc = uPersp / (uPersp - z2);
  vec2 sp2 = vec2(x1, y1) * sc + uFrameC;
  // a rose / cyan split of the moving points
  sp2.x += (q3 > .5 ? -1. : 1.) * mv * 5.;

  gl_Position = vec4(sp2.x / (uStage.x * .5), -sp2.y / (uStage.y * .5), 0., 1.);
  float noiseSize = dust > .5 ? 1.3 + q1 * 1.4 : 1.9 + q1 * 2.1;
  float size = mix(noiseSize, uCell * 1.12 + .6 / max(uDpr, 1.), form * form);
  gl_PointSize = max(1., size * sc * uDpr);
  vCol = col; vForm = clamp(form, 0., 1.); vOp = dust > .5 ? .38 : 1.;
}`;

const FRAG = `
precision mediump float;
varying vec3 vCol; varying float vForm; varying float vOp;
void main() {
  vec2 uv = gl_PointCoord - .5;
  float c = 1. - smoothstep(.5, 1., length(uv) * 2.);
  float m = mix(c, 1., vForm * vForm);
  // premultiplied: formed points cover what's behind them (alpha), snow only adds light (alpha 0)
  gl_FragColor = vec4(vCol * m * 1. * vOp, m * vForm * vOp);
}`;

export function createGL(canvas: HTMLCanvasElement): Renderer | null {
  const gl = (canvas.getContext('webgl', { alpha: false, antialias: false, powerPreference: 'high-performance' })
    || canvas.getContext('experimental-webgl', { alpha: false, antialias: false })) as WebGLRenderingContext | null;
  if (!gl) return null;

  let prog: WebGLProgram | null = null;
  let bufs: Record<string, WebGLBuffer> = {};
  let locs: Record<string, number> = {};
  let ulocs: Record<string, WebGLUniformLocation | null> = {};
  let data: Data | null = null, lost = false, dpr = 1, w = 1, h = 1;
  const A = ['aT01', 'aT23', 'aSeed', 'aC0', 'aC1', 'aC2', 'aC3'];
  const U = ['uStage', 'uFrame', 'uFrameC', 'uPtr', 'uA', 'uB', 'uF', 'uPre', 'uTime', 'uDpr', 'uCell', 'uYaw', 'uPitch', 'uPtrAmt', 'uZ', 'uPersp'];

  const compile = (type: number, src: string) => {
    const s = gl.createShader(type)!; gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { const e = gl.getShaderInfoLog(s); gl.deleteShader(s); throw new Error('shader: ' + e); }
    return s;
  };
  const init = () => {
    const v = compile(gl.VERTEX_SHADER, VERT), f = compile(gl.FRAGMENT_SHADER, FRAG);
    prog = gl.createProgram()!; gl.attachShader(prog, v); gl.attachShader(prog, f); gl.linkProgram(prog);
    gl.deleteShader(v); gl.deleteShader(f);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error('link: ' + gl.getProgramInfoLog(prog));
    locs = {}; ulocs = {}; bufs = {};
    A.forEach(n => { locs[n] = gl.getAttribLocation(prog!, n); bufs[n] = gl.createBuffer()!; });
    U.forEach(n => { ulocs[n] = gl.getUniformLocation(prog!, n); });
  };
  try { init(); } catch (e) { console.warn('[hv5] WebGL setup failed, using canvas 2D', e); return null; }

  const upload = () => {
    if (!data || lost) return;
    const put = (n: string, arr: ArrayBufferView) => { gl.bindBuffer(gl.ARRAY_BUFFER, bufs[n]); gl.bufferData(gl.ARRAY_BUFFER, arr, gl.STATIC_DRAW); };
    put('aT01', data.t01); put('aT23', data.t23); put('aSeed', data.seed);
    data.c.forEach((c, k) => put('aC' + k, c));
  };
  const onLost = (e: Event) => { e.preventDefault(); lost = true; };
  const onRestored = () => { lost = false; try { init(); upload(); } catch { /* stays blank */ } };
  canvas.addEventListener('webglcontextlost', onLost);
  canvas.addEventListener('webglcontextrestored', onRestored);

  return {
    kind: 'webgl',
    setData(d) { data = d; upload(); },
    resize(cw, ch, r) { dpr = r; w = cw; h = ch; canvas.width = Math.max(1, Math.round(cw * r)); canvas.height = Math.max(1, Math.round(ch * r)); },
    render(s) {
      if (lost || !data || !prog) return;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(INK[0], INK[1], INK[2], 1); gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(prog);
      gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      const bind = (n: string, size: number, type: number, norm: boolean) => {
        gl.bindBuffer(gl.ARRAY_BUFFER, bufs[n]); gl.enableVertexAttribArray(locs[n]); gl.vertexAttribPointer(locs[n], size, type, norm, 0, 0);
      };
      bind('aT01', 4, gl.FLOAT, false); bind('aT23', 4, gl.FLOAT, false); bind('aSeed', 4, gl.FLOAT, false);
      for (let k = 0; k < 4; k++) bind('aC' + k, 4, gl.UNSIGNED_BYTE, true);
      const u = ulocs;
      gl.uniform2f(u.uStage, s.stageW, s.stageH); gl.uniform2f(u.uFrame, s.frameW, s.frameH);
      gl.uniform2f(u.uFrameC, s.frameCX, s.frameCY); gl.uniform2f(u.uPtr, s.ptrX, s.ptrY);
      gl.uniform1f(u.uA, s.a); gl.uniform1f(u.uB, s.b); gl.uniform1f(u.uF, s.f); gl.uniform1f(u.uPre, s.pre);
      gl.uniform1f(u.uTime, s.time); gl.uniform1f(u.uDpr, dpr); gl.uniform1f(u.uCell, data.cell);
      gl.uniform1f(u.uYaw, s.yaw); gl.uniform1f(u.uPitch, s.pitch); gl.uniform1f(u.uPtrAmt, s.ptrAmt);
      gl.uniform1f(u.uZ, s.frameW * Z_K * s.relief); gl.uniform1f(u.uPersp, s.frameW * PERSP_K);
      gl.drawArrays(gl.POINTS, 0, data.total);
      void w; void h;
    },
    dispose() {
      canvas.removeEventListener('webglcontextlost', onLost);
      canvas.removeEventListener('webglcontextrestored', onRestored);
      if (!lost) {
        Object.values(bufs).forEach(b => gl.deleteBuffer(b));
        if (prog) gl.deleteProgram(prog);
      }
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    },
  };
}

// ---------- canvas 2D fallback: the same maths on the CPU, into a pixel buffer ----------

const h1 = (x: number) => { const s = Math.sin(x) * 43758.5453123; return s - Math.floor(s); };
const sstep = (a: number, b: number, x: number) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

export function createCanvas2D(canvas: HTMLCanvasElement): Renderer | null {
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  let data: Data | null = null, img: ImageData | null = null, px: Uint32Array | null = null, W = 1, H = 1;

  return {
    kind: 'canvas2d',
    setData(d) { data = d; },
    resize(cw, ch, dpr) {
      // fallback draws at css resolution (capped), the browser scales it up
      void dpr; W = Math.max(1, Math.round(cw)); H = Math.max(1, Math.round(ch));
      canvas.width = W; canvas.height = H;
      img = ctx.createImageData(W, H); px = new Uint32Array(img.data.buffer);
    },
    render(s) {
      if (!data || !img || !px) return;
      const d = data, t = s.time, PI = Math.PI;
      const bg = (255 << 24) | (11 << 16) | (10 << 8) | 10;
      px.fill(bg);
      const raw = img.data;
      const uZ = s.frameW * Z_K * s.relief, persp = s.frameW * PERSP_K;
      const cyw = Math.cos(s.yaw), syw = Math.sin(s.yaw), cp = Math.cos(s.pitch), sp = Math.sin(s.pitch);
      const tA = s.a < 2 ? d.t01 : d.t23, oA = (s.a & 1) * 2, tB = s.b < 2 ? d.t01 : d.t23, oB = (s.b & 1) * 2;
      const cA = d.c[s.a], cB = d.c[s.b];
      const lensR = s.frameW * 0.085, lensR2 = 2 * lensR * lensR;
      const tq = Math.floor(t * 24), tj = Math.floor(t * 30);
      for (let i = 0; i < d.total; i++) {
        const sx = d.seed[i * 4], sy = d.seed[i * 4 + 1], sz = d.seed[i * 4 + 2], dust = d.seed[i * 4 + 3] > 0.5;
        const q1 = h1(sz * 311.7), q2 = h1(sz * 57.3 + 1.7), q3 = h1(sz * 913.1 + 4.1);
        const Sx = tA[i * 4 + oA] * s.frameW, Sy = tA[i * 4 + oA + 1] * s.frameH;
        const Dx = tB[i * 4 + oB] * s.frameW, Dy = tB[i * 4 + oB + 1] * s.frameH;
        const bx0 = (sx - 0.5) * s.stageW * 1.06, by0 = (sy - 0.5) * s.stageH * 1.06;
        const fi = Math.floor(sy * 34), fy = (fi + 0.5) / 34 - 0.5;
        const fibre = fy * s.stageH * 1.06 + 62 * Math.sin(bx0 * 0.0046 + fi * 0.9 + t * 0.22) + 34 * Math.sin(bx0 * 0.0112 - fi * 1.7 + t * 0.37);
        const bx = bx0 - s.frameCX, by = by0 + (fibre - by0) * 0.62 - s.frameCY;
        const Nx = bx + 38 * Math.sin(t * 0.37 + sz * 6.283 + by * 0.004) + 16 * Math.sin(t * 1.1 + q1 * 40);
        const Ny = by + 38 * Math.cos(t * 0.31 + sx * 6.283 + bx * 0.004) + 16 * Math.cos(t * 0.9 + q2 * 40);
        let lvT = Math.min(1, Math.max(0, (s.f - 0.2 - 0.1 * q1) / 0.2));
        const tx = Dx / s.frameW + 0.5;
        let arT = Math.min(1, Math.max(0, (s.f - 0.5 - 0.15 * (tx * 0.7 + q2 * 0.3)) / 0.15));
        lvT = Math.max(lvT, s.pre);
        if (dust) { lvT = 1; arT = 0; }
        const lv = 1 - Math.pow(1 - lvT, 3), ar = 1 - Math.pow(1 - arT, 4);
        const dlx = Nx - Sx, dly = Ny - Sy, kL = Math.sin(PI * lv) * 0.28 * (q3 * 2 - 1);
        const pLx = Sx + (Nx - Sx) * lv - dly * kL, pLy = Sy + (Ny - Sy) * lv + dlx * kL;
        const dax = Dx - pLx, day = Dy - pLy, kA = Math.sin(PI * ar) * 0.2 * (q1 * 2 - 1);
        let X = pLx + (Dx - pLx) * ar - day * kA, Y = pLy + (Dy - pLy) * ar + dax * kA;
        const mv = Math.min(1, Math.max(0, 4 * lv * (1 - lv) * (1 - ar) + 4 * ar * (1 - ar)));
        X += 12 * mv * Math.sin(t * 7 + q1 * 30); Y += 12 * mv * Math.cos(t * 6 + q2 * 30);
        let form = dust ? 0 : ar + (1 - ar) * (1 - lv);

        const cs = ar > 0.001 ? cB : cA;
        const cr = cs[i * 4] / 255, cg = cs[i * 4 + 1] / 255, cb = cs[i * 4 + 2] / 255;
        const lum = cr * 0.299 + cg * 0.587 + cb * 0.114;
        const fl = h1(sx * 91 + tq * 7.13 + q2 * 13), sn = 0.22 + 0.73 * fl * fl, fm = sstep(0, 1, form);
        let r = sn + (cr - sn) * fm, g = sn + (cg - sn) * fm, b = sn + (cb - sn) * fm;
        const tint = q3 > 0.5 ? ROSE : CYAN, tk = mv * 0.8 * (1 - 0.4 * form);
        r += (tint[0] - r) * tk; g += (tint[1] - g) * tk; b += (tint[2] - b) * tk;
        if (ar > 0.001 && ar < 0.999) { const fl2 = 0.45 * Math.exp(-Math.pow((ar - 0.93) * 16, 2)); r += fl2; g += fl2; b += fl2; }

        const dpx = X - s.ptrX, dpy = Y - s.ptrY, rr = Math.hypot(dpx, dpy);
        const lens = Math.exp(-(rr * rr) / lensR2) * s.ptrAmt;
        if (lens > 0.002) {
          const m = 1 / (rr + 0.001);
          X += dpx * m * lens * s.frameW * 0.06 + (h1(sx * 77 + tj) - 0.5) * lens * 46;
          Y += dpy * m * lens * s.frameW * 0.06 + (h1(sy * 53 + tj * 1.3) - 0.5) * lens * 46;
          form *= 1 - 0.65 * lens;
        }
        const z = (lum - 0.32) * uZ * form + (q2 - 0.5) * 16 * (1 - form);
        const x1 = X * cyw + z * syw, z1 = -X * syw + z * cyw, y1 = Y * cp - z1 * sp, z2 = Y * sp + z1 * cp;
        const sc = persp / (persp - z2);
        const scx = x1 * sc + s.frameCX + s.stageW / 2 + (q3 > 0.5 ? -1 : 1) * mv * 5;
        const scy = y1 * sc + s.frameCY + s.stageH / 2;
        const noiseSize = dust ? 1.3 + q1 * 1.4 : 1.9 + q1 * 2.1;
        const fq = form * form, size = Math.max(1, (noiseSize + (d.cell * 1.12 + 0.6 - noiseSize) * fq) * sc);
        const x0 = Math.round(scx - size / 2), y0 = Math.round(scy - size / 2), n = Math.max(1, Math.round(size));
        const op = dust ? 0.38 : 1, solid = form > 0.5;
        const R = Math.min(255, r * 255 * op) | 0, G = Math.min(255, g * 255 * op) | 0, B = Math.min(255, b * 255 * op) | 0;
        const packed = (255 << 24) | (B << 16) | (G << 8) | R;
        for (let yy = Math.max(0, y0); yy < Math.min(H, y0 + n); yy++) {
          const row = yy * W;
          for (let xx = Math.max(0, x0); xx < Math.min(W, x0 + n); xx++) {
            if (solid) px[row + xx] = packed;
            else { const o = (row + xx) * 4; raw[o] = Math.min(255, raw[o] + R * 0.7); raw[o + 1] = Math.min(255, raw[o + 1] + G * 0.7); raw[o + 2] = Math.min(255, raw[o + 2] + B * 0.7); }
          }
        }
      }
      ctx.putImageData(img, 0, 0);
    },
    dispose() { data = null; img = null; px = null; },
  };
}
