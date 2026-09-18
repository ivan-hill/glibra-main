"use client";
import { Canvas, useFrame, extend } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useRef, useMemo } from "react";

// Create the shader material using drei's shaderMaterial
const WebGLMaterial = shaderMaterial(
  {
    uTime: 0,
    uScroll: 0,
    uMix: 0,
    uResolution: new THREE.Vector2(),
    uTex: null,
    uTexB: null
  },
  // Vertex shader
  `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
  `,
  // Fragment shader
  `
  precision highp float;
  uniform float uTime;
  uniform float uScroll;
  uniform float uMix;
  uniform vec2 uResolution;
  uniform sampler2D uTex;
  uniform sampler2D uTexB;
  varying vec2 vUv;

  float hash(vec2 p) { 
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); 
  }
  
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    float a = hash(i), b = hash(i + vec2(1., 0.));
    float c = hash(i + vec2(0., 1.)), d = hash(i + vec2(1., 1.));
    vec2 u = f * f * (3. - 2. * f);
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }

  void main() {
    vec2 uv = vUv;
    
    // Time + scroll-reactive distortion
    float n = noise(uv * 3.5 + uTime * 0.05);
    float distort = (n - 0.5) * 0.035 * (0.3 + uScroll * 1.2);
    uv += vec2(distort);

    // Sample textures
    vec3 A = texture2D(uTex, uv).rgb;
    vec3 B = texture2D(uTexB, uv).rgb;
    vec3 base = mix(A, B, smoothstep(0.0, 1.0, uMix));

    // Vignette effect
    float d = length(vUv - 0.5);
    float vignette = smoothstep(0.9, 0.3, d * 1.2);

    // Film grain
    float g = noise(vUv * uResolution.xy * 0.35 + uTime * 18.0) * 0.04 * (0.4 + uScroll * 0.6);

    // Blue-green tint shift with scroll (Glibra brand colors)
    vec3 tint = mix(vec3(1.0), vec3(0.85, 0.98, 0.96), uScroll);
    vec3 color = base * vignette * tint + g;

    gl_FragColor = vec4(color, 1.0);
  }
  `
);

// Extend React Three Fiber to recognize our custom material
extend({ WebGLMaterial });

// TypeScript declarations for R3F
declare global {
  namespace JSX {
    interface IntrinsicElements {
      webGLMaterial: any;
    }
  }
}

function FullscreenQuad({ onMaterial }: { onMaterial: (mat: any) => void }) {
  const materialRef = useRef<any>(null);
  const { size, gl } = useThree();
  
  gl.setPixelRatio(Math.min(2, (typeof window !== "undefined" ? window.devicePixelRatio : 1)));

  useFrame(({ clock }) => {
    if (!materialRef.current) return;
    materialRef.current.uTime = clock.getElapsedTime();
    materialRef.current.uResolution.set(size.width, size.height);
  });

  const handleMaterialRef = (material: any) => {
    if (material) {
      materialRef.current = material;
      onMaterial(material);
    }
  };

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <webGLMaterial ref={handleMaterialRef} />
    </mesh>
  );
}

interface WebGLStageProps {
  onMaterialReady: (mat: any) => void;
  texA: THREE.Texture;
  texB: THREE.Texture;
}

export default function WebGLStage({ onMaterialReady, texA, texB }: WebGLStageProps) {
  return (
    <Canvas
      gl={{ 
        antialias: true, 
        powerPreference: "high-performance",
        alpha: false
      }}
      orthographic
      camera={{ position: [0, 0, 1], zoom: 1 }}
      dpr={[1, 2]}
      style={{ position: "fixed", inset: 0, zIndex: 0 }}
      data-testid="webgl-canvas"
    >
      <FullscreenQuad 
        onMaterial={(material) => {
          // Set textures
          material.uTex = texA;
          material.uTexB = texB;
          onMaterialReady(material);
        }} 
      />
      
    </Canvas>
  );
}