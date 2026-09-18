"use client";
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScalingImageProps {
  children: React.ReactNode;
  className?: string;
  minScale?: number;
  maxScale?: number;
}

export default function ScalingImage({ 
  children, 
  className = "",
  minScale = 0.8,
  maxScale = 1.2
}: ScalingImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    // Create GSAP scroll trigger for smooth scaling
    const animation = gsap.fromTo(container, 
      { 
        scale: minScale,
        opacity: 0.8
      },
      {
        scale: maxScale,
        opacity: 1,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top bottom",
          end: "bottom top",
          scrub: 1, // Smooth scrubbing for real-time scaling
          invalidateOnRefresh: true
        }
      }
    );
    
    return () => {
      animation.kill();
    };
  }, [minScale, maxScale]);
  
  return (
    <div 
      ref={containerRef} 
      className={`transform-gpu ${className}`}
    >
      {children}
    </div>
  );
}