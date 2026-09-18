"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useRef, useMemo } from "react";

interface SimpleWebGLStageProps {
  onMaterialReady?: (material: any) => void;
  texA?: THREE.Texture;
  texB?: THREE.Texture;
}

function FullscreenPlane({ onMaterial, texA, texB }: { 
  onMaterial?: (material: any) => void;
  texA?: THREE.Texture;
  texB?: THREE.Texture;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Create shader material using useMemo for performance
  const material = useMemo(() => {
    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uScroll: { value: 0 },
        uMix: { value: 0 },
        uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        uTex: { value: texA || null },
        uTexB: { value: texB || null }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
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

          // Default colors if textures aren't loaded
          vec3 A = vec3(0.1, 0.15, 0.2);
          vec3 B = vec3(0.05, 0.2, 0.25);
          
          // Sample textures if available
          if (uTex != sampler2D(0)) {
            A = texture2D(uTex, uv).rgb;
          }
          if (uTexB != sampler2D(0)) {
            B = texture2D(uTexB, uv).rgb;
          }
          
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
      `,
    });
    
    // Call the callback when material is ready
    if (onMaterial) {
      onMaterial(mat);
    }
    
    return mat;
  }, [texA, texB, onMaterial]);

  useFrame((state) => {
    if (material) {
      material.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh ref={meshRef} material={material}>
      <planeGeometry args={[2, 2]} />
    </mesh>
  );
}

export default function SimpleWebGLStage({ onMaterialReady, texA, texB }: SimpleWebGLStageProps) {
  return (
    <Canvas
      gl={{ 
        antialias: false, 
        powerPreference: "high-performance",
        alpha: false
      }}
      orthographic
      camera={{ position: [0, 0, 1], zoom: 1 }}
      dpr={[1, 2]}
      style={{ position: "fixed", inset: 0, zIndex: 0 }}
      data-testid="webgl-canvas"
    >
      <FullscreenPlane 
        onMaterial={onMaterialReady}
        texA={texA}
        texB={texB}
      />
    </Canvas>
  );
}