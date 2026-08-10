'use client'

import { Renderer, Program, Mesh, Triangle, Color } from 'ogl'
import { useEffect, useRef, CSSProperties } from 'react'

const vertexShader = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`

const fragmentShader = `
precision highp float;

varying vec2 vUv;

uniform float iTime;
uniform vec2 iResolution;
uniform float iIntensity;
uniform vec3 iColor1;
uniform vec3 iColor2;
uniform vec3 iColor3;

#define S(a, b, t) smoothstep(a, b, t)

// Noise functions
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m*m; m = m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float fbm(vec2 p) {
  float f = 0.0;
  f += 0.5000 * snoise(p); p *= 2.02;
  f += 0.2500 * snoise(p); p *= 2.03;
  f += 0.1250 * snoise(p); p *= 2.01;
  f += 0.0625 * snoise(p);
  return f / 0.9375;
}

// Soft blob shape
float blob(vec2 uv, vec2 center, float radius, float softness) {
  float d = length(uv - center);
  return 1.0 - S(radius, radius * softness, d);
}

// Organic flowing shape
float organicShape(vec2 uv, float time) {
  vec2 p = uv * 2.0;
  float n1 = fbm(p + time * 0.1);
  float n2 = fbm(p * 1.5 - time * 0.08);
  float n3 = fbm(p * 0.8 + time * 0.12);

  float shape = n1 * 0.5 + n2 * 0.3 + n3 * 0.2;
  return S(0.3, 0.7, shape);
}

// Pencil stroke effect
float pencilStroke(vec2 uv, float time) {
  vec2 p = uv * vec2(8.0, 12.0);
  float angle = fbm(p * 0.5 + time * 0.05) * 3.14159;
  float stroke = sin(p.x * 0.5 + p.y * 0.3 + angle + time * 0.2);
  return S(-0.2, 0.8, stroke) * 0.15;
}

void main() {
  vec2 uv = vUv;
  float aspect = iResolution.x / iResolution.y;
  uv.x *= aspect;

  float time = iTime * 0.3;

  // Base gradient - subtle
  vec3 col = mix(iColor1, iColor2, uv.y * 0.3);

  // Soft floating blobs - Apple Freeform style
  float blob1 = blob(uv, vec2(0.3 + sin(time * 0.2) * 0.1, 0.4 + cos(time * 0.15) * 0.1), 0.8, 2.0);
  float blob2 = blob(uv, vec2(0.7 + sin(time * 0.18 + 1.0) * 0.08, 0.6 + cos(time * 0.22) * 0.08), 0.6, 2.2);
  float blob3 = blob(uv, vec2(0.5 + sin(time * 0.25) * 0.12, 0.3 + cos(time * 0.17) * 0.1), 0.7, 1.8);

  // Color blobs
  col += blob1 * iColor1 * 0.08;
  col += blob2 * iColor2 * 0.06;
  col += blob3 * iColor3 * 0.05;

  // Organic flowing shapes
  float org1 = organicShape(uv + vec2(sin(time * 0.1) * 0.1, cos(time * 0.08) * 0.1), time);
  float org2 = organicShape(uv * 1.2 - vec2(0.3, 0.2) + vec2(cos(time * 0.12) * 0.08, sin(time * 0.1) * 0.08), time * 0.8);

  col += org1 * iColor1 * 0.04 * iIntensity;
  col += org2 * iColor2 * 0.03 * iIntensity;

  // Subtle pencil strokes
  float stroke = pencilStroke(uv, time);
  col += stroke * iColor3 * 0.02 * iIntensity;

  // Very subtle grain
  float grain = snoise(uv * 200.0 + time * 10.0) * 0.008;
  col += grain;

  // Vignette
  float vig = 1.0 - length((vUv - 0.5) * 1.2);
  col *= S(0.0, 1.0, vig);

  // Subtle radial glow
  float radial = 1.0 - length(vUv - 0.5) * 0.5;
  col *= radial;

  // Ensure minimum brightness
  col = max(col, vec3(0.02));

  gl_FragColor = vec4(col, 1.0);
}
`

interface FreeformCanvasProps {
  intensity?: number
  color1?: string
  color2?: string
  color3?: string
  className?: string
  style?: CSSProperties
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  return [
    parseInt(h.slice(0, 2), 16) / 255,
    parseInt(h.slice(2, 4), 16) / 255,
    parseInt(h.slice(4, 6), 16) / 255
  ]
}

export function FreeformCanvas({
  intensity = 1.0,
  color1 = '#1a1a2e',
  color2 = '#16213e',
  color3 = '#0f3460',
  className = '',
  style,
}: FreeformCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    const renderer = new Renderer({
      alpha: false,
      antialias: true,
      dpr
    })
    const gl = renderer.gl
    gl.clearColor(0.02, 0.02, 0.03, 1)

    const geometry = new Triangle(gl)
    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new Color(gl.canvas.width, gl.canvas.height, 1) },
        iIntensity: { value: intensity },
        iColor1: { value: new Color(...hexToRgb(color1)) },
        iColor2: { value: new Color(...hexToRgb(color2)) },
        iColor3: { value: new Color(...hexToRgb(color3)) }
      }
    })

    const mesh = new Mesh(gl, { geometry, program })

    // Store container in a local variable for resize closure
    let currentContainer = container
    currentContainer.appendChild(gl.canvas)

    function resize() {
      renderer.setSize(currentContainer.offsetWidth, currentContainer.offsetHeight)
      program.uniforms.iResolution.value = new Color(
        gl.canvas.width,
        gl.canvas.height,
        gl.canvas.width / gl.canvas.height
      )
    }

    const resizeObserver = new ResizeObserver(() => resize())
    resizeObserver.observe(currentContainer)
    resize()

    let rafId: number
    function update(t: number) {
      rafId = requestAnimationFrame(update)
      program.uniforms.iTime.value = t * 0.001
      renderer.render({ scene: mesh })
    }
    rafId = requestAnimationFrame(update)

    return () => {
      cancelAnimationFrame(rafId)
      resizeObserver.disconnect()
      if (currentContainer.contains(gl.canvas)) {
        currentContainer.removeChild(gl.canvas)
      }
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
  }, [intensity, color1, color2, color3])

  return (
    <div
      ref={containerRef}
      className={`freeform-canvas ${className}`}
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        ...style
      }}
    />
  )
}
