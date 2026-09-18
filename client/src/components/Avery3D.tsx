import { useRef, useEffect, useState, Component, ErrorInfo, ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import averyPng from "@assets/BF0A6B56-A5D3-4402-A9B9-4CD33738790D_1769025092656.png";

interface AveryPlaneProps {
  scrollDirection: { x: number; y: number };
}

function AveryPlane({ scrollDirection }: AveryPlaneProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useTexture(averyPng);
  
  const targetRotation = useRef({ x: 0, y: 0 });
  const floatOffset = useRef(0);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    floatOffset.current += delta * 2;
    const floatY = Math.sin(floatOffset.current) * 0.03;
    const floatX = Math.sin(floatOffset.current * 0.7) * 0.01;

    targetRotation.current.x = scrollDirection.y * 0.15;
    targetRotation.current.y = scrollDirection.x * 0.2;

    meshRef.current.rotation.x = THREE.MathUtils.lerp(
      meshRef.current.rotation.x,
      targetRotation.current.x,
      delta * 5
    );
    meshRef.current.rotation.y = THREE.MathUtils.lerp(
      meshRef.current.rotation.y,
      targetRotation.current.y,
      delta * 5
    );

    meshRef.current.position.y = floatY;
    meshRef.current.position.x = floatX;
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2.5]} />
      <meshBasicMaterial 
        map={texture} 
        transparent={true}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class WebGLErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.log('WebGL Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

function isMobileDevice(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function checkWebGLSupport(): boolean {
  if (isMobileDevice()) {
    return false;
  }
  
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return false;
    
    const debugInfo = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info');
    if (debugInfo) {
      const renderer = (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
      if (renderer && renderer.includes('SwiftShader')) {
        return false;
      }
    }
    
    return true;
  } catch (e) {
    return false;
  }
}

function StaticAvery() {
  const [floatY, setFloatY] = useState(0);

  useEffect(() => {
    let animationId: number;
    let startTime = Date.now();

    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      setFloatY(Math.sin(elapsed * 2) * 3);
      animationId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <img
      src={averyPng}
      alt="Avery, your GLIBRA guide"
      className="w-full h-full object-contain transition-transform duration-100"
      style={{ transform: `translateY(${floatY}px)` }}
    />
  );
}

interface Avery3DProps {
  className?: string;
}

export default function Avery3D({ className = "" }: Avery3DProps) {
  const [scrollDirection, setScrollDirection] = useState({ x: 0, y: 0 });
  const [webglSupported, setWebglSupported] = useState<boolean | null>(null);
  const lastScrollPos = useRef({ x: 0, y: 0 });
  const decayTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setWebglSupported(checkWebGLSupport());
  }, []);

  useEffect(() => {
    if (!webglSupported) return;

    const handleScroll = () => {
      const currentX = window.scrollX || window.pageXOffset || 0;
      const currentY = window.scrollY || window.pageYOffset || 0;

      const deltaX = currentX - lastScrollPos.current.x;
      const deltaY = currentY - lastScrollPos.current.y;

      const normalizedX = Math.max(-1, Math.min(1, deltaX / 50));
      const normalizedY = Math.max(-1, Math.min(1, deltaY / 50));

      setScrollDirection({ x: normalizedX, y: normalizedY });
      lastScrollPos.current = { x: currentX, y: currentY };

      if (decayTimeout.current) {
        clearTimeout(decayTimeout.current);
      }
      decayTimeout.current = setTimeout(() => {
        setScrollDirection({ x: 0, y: 0 });
      }, 150);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("scroll", handleScroll);
      if (decayTimeout.current) {
        clearTimeout(decayTimeout.current);
      }
    };
  }, [webglSupported]);

  if (webglSupported === null) {
    return <div className={className} style={{ width: "100%", height: "100%" }} />;
  }

  if (!webglSupported) {
    return (
      <div className={`${className}`} style={{ width: "100%", height: "100%" }}>
        <StaticAvery />
      </div>
    );
  }

  return (
    <div className={`${className}`} style={{ width: "100%", height: "100%" }}>
      <WebGLErrorBoundary fallback={<StaticAvery />}>
        <Canvas
          camera={{ position: [0, 0, 3], fov: 50 }}
          gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
          style={{ background: "transparent" }}
          dpr={[1, 1.5]}
          frameloop="demand"
        >
          <ambientLight intensity={1} />
          <AveryPlane scrollDirection={scrollDirection} />
        </Canvas>
      </WebGLErrorBoundary>
    </div>
  );
}
