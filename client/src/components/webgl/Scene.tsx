import { Canvas, useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { useRef } from 'react';
import * as THREE from 'three';

function GradientPlane({ progress }: { progress: number }) {
  const mat = useRef<THREE.ShaderMaterial>(null!);
  useFrame((_, t) => {
    if (!mat.current) return;
    mat.current.uniforms.uTime.value = t;
    mat.current.uniforms.uProgress.value = progress;
  });
  return (
    <mesh rotation={[-Math.PI/2,0,0]} position={[0,-2,-8]}>
      <planeGeometry args={[40, 40, 64, 64]} />
      <shaderMaterial ref={mat} vertexShader={vs} fragmentShader={fs} uniforms={{
        uTime: { value: 0 }, uProgress: { value: 0 }
      }} />
    </mesh>
  );
}

export default function Scene({ progress }: { progress: number }) {
  return (
    <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 8], fov: 45 }}>
      <color attach="background" args={['#0a0a0a']} />
      <GradientPlane progress={progress} />
      <EffectComposer>
        <Bloom intensity={0.2} luminanceThreshold={0.7} luminanceSmoothing={0.1} />
      </EffectComposer>
    </Canvas>
  );
}

const vs = /* glsl */`
varying vec2 vUv;
void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`;

const fs = /* glsl */`
uniform float uTime; uniform float uProgress; varying vec2 vUv;
vec3 h2rgb(float h){ return clamp(abs(mod(h*6.0+vec3(0.,4.,2.),6.)-3.)-1.,0.,1.); }
void main(){
  float hue = mix(0.58, 0.72, uProgress); // blue→violet sweep
  vec3 col = h2rgb(hue);
  float vignette = smoothstep(1.2, 0.3, length(vUv-0.5));
  gl_FragColor = vec4(col * vignette, 1.0);
}`;