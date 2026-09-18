import * as THREE from "three";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";

const TransitionMat = shaderMaterial(
  { uTime: 0, uProgress: 0, uResolution: new THREE.Vector2(), uTex0: null, uTex1: null, uTex2: null, uTex3: null, uTex4: null },
  /* glsl */`varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position,1.0); }`,
  /* glsl */`
  precision highp float; varying vec2 vUv;
  uniform float uTime, uProgress; uniform vec2 uResolution;
  uniform sampler2D uTex0; uniform sampler2D uTex1; uniform sampler2D uTex2; uniform sampler2D uTex3; uniform sampler2D uTex4;

  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
  float noise(vec2 p){ vec2 i=floor(p), f=fract(p);
    float a=hash(i), b=hash(i+vec2(1.,0.)), c=hash(i+vec2(0.,1.)), d=hash(i+vec2(1.,1.));
    vec2 u=f*f*(3.-2.*f); return mix(mix(a,b,u.x), mix(c,d,u.x), u.y); }
  float ease(float t){ return t<0.5? 4.0*t*t*t : 1.0 - pow(-2.0*t+2.0, 3.0)/2.0; }

  float mask(vec2 uv, float a, float r){
    float s=sin(a), c=cos(a); vec2 uvr=mat2(c,-s,s,c)*(uv-0.5)+0.5;
    float m=smoothstep(0.0,1.0,(uvr.x-0.5)/max(1e-5,r)+0.5);
    m += (noise(uv*8.0 + uTime*0.15)-0.5)*0.06; return clamp(m,0.0,1.0);
  }

  vec3 sampleP(sampler2D t, vec2 uv, float amt){ return texture2D(t, uv + (uv-0.5)*amt).rgb; }

  void getStage(out int a, out int b, out float t){
    float p=clamp(uProgress,0.0,1.0);
    if(p<0.18){ a=0; b=0; t=ease(smoothstep(0.,0.18,p)); return; }
    if(p<0.22){ a=0; b=0; t=1.; return; }
    if(p<0.40){ a=0; b=1; t=ease(smoothstep(0.22,0.40,p)); return; }
    if(p<0.44){ a=1; b=1; t=1.; return; }
    if(p<0.62){ a=1; b=2; t=ease(smoothstep(0.44,0.62,p)); return; }
    if(p<0.66){ a=2; b=2; t=1.; return; }
    if(p<0.84){ a=2; b=3; t=ease(smoothstep(0.66,0.84,p)); return; }
    if(p<0.88){ a=3; b=3; t=1.; return; }
    a=3; b=4; t=ease(smoothstep(0.88,1.0,p));
  }

  vec3 texI(int i, vec2 uv){
    if(i==0) return texture2D(uTex0, uv).rgb;
    if(i==1) return texture2D(uTex1, uv).rgb;
    if(i==2) return texture2D(uTex2, uv).rgb;
    if(i==3) return texture2D(uTex3, uv).rgb;
    return texture2D(uTex4, uv).rgb;
  }

  vec3 finish(vec3 c){
    float d=length(vUv-0.5);
    float vign=smoothstep(0.95,0.35,d*1.25);
    float g=noise(vUv*uResolution.xy*0.35 + uTime*20.0)*0.035;
    return c*vign + g;
  }

  void main(){
    int ia; int ib; float lt; getStage(ia, ib, lt);
    float zoomIn=mix(0.0,0.04,lt), zoomOut=mix(0.03,0.0,lt);
    vec2 uv=vUv;
    vec3 A=sampleP(texture2D(uTex0, uv), uv, -zoomOut-0.01);
    vec3 B=sampleP(texture2D(uTex1, uv), uv,  zoomIn+0.02);

    // sample actual textures by index
    A = sampleP( (ia==0?uTex0:ia==1?uTex1:ia==2?uTex2:ia==3?uTex3:uTex4), uv, -zoomOut-0.01);
    B = sampleP( (ib==0?uTex0:ib==1?uTex1:ib==2?uTex2:ib==3?uTex3:uTex4), uv,  zoomIn+0.02);

    float m=mask(uv, radians(18.0), 1.2 - lt);
    float k=smoothstep(0.0,1.0,lt)*m;
    vec3 col=mix(A,B,k);
    col *= mix(vec3(1.0), vec3(0.96,0.99,1.05), uProgress);
    gl_FragColor = vec4(finish(col), 1.0);
  }`
);

function Stage({ progress }: { progress: number }) {
  const matRef = useRef<any>(null);
  
  // Create simple gradient textures as fallback
  const createGradientTexture = (color1: string, color2: string) => {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    const gradient = ctx.createLinearGradient(0, 0, 512, 512);
    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 512);
    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    return texture;
  };

  const t0 = useMemo(() => createGradientTexture("#2D5A87", "#87CEEB"), []); // waterfall
  const t1 = useMemo(() => createGradientTexture("#8B4513", "#D2B48C"), []); // cabin
  const t2 = useMemo(() => createGradientTexture("#B22222", "#FFB6C1"), []); // car
  const t3 = useMemo(() => createGradientTexture("#FF6347", "#FFEFD5"), []); // dining
  const t4 = useMemo(() => createGradientTexture("#DDA0DD", "#F0E68C"), []); // couple

  const Material = useMemo(() => TransitionMat, []);
  
  useFrame(({ clock, size, gl }) => {
    if (!matRef.current) return;
    gl.setPixelRatio(Math.min(window.devicePixelRatio || 1, /Mobi|Android/i.test(navigator.userAgent) ? 1.5 : 2));
    matRef.current.uTime = clock.getElapsedTime();
    matRef.current.uResolution = [size.width, size.height];
    matRef.current.uProgress = progress;
  });

  return (
    <mesh>
      <planeGeometry args={[2,2]} />
      {/* @ts-ignore */}
      <Material ref={matRef} uTex0={t0} uTex1={t1} uTex2={t2} uTex3={t3} uTex4={t4} />
    </mesh>
  );
}

export default function StoryWebGL({ progress, disabled=false }: { progress: number; disabled?: boolean }) {
  if (disabled) return null;
  return (
    <Canvas
      gl={{ antialias: true, powerPreference: "high-performance" }}
      orthographic camera={{ position: [0,0,1], zoom: 1 }}
      dpr={[1,2]}
      style={{ position:"fixed", inset:0, zIndex:0, touchAction:"none" }}
    >
      <Stage progress={progress} />
    </Canvas>
  );
}