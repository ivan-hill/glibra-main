"use client";
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  speed?: number;
  scale?: boolean;
  direction?: 'up' | 'down' | 'left' | 'right';
  children?: React.ReactNode;
}

export default function ParallaxImage({ 
  src, 
  alt, 
  className = "", 
  speed = 0.5,
  scale = false,
  direction = 'up',
  children 
}: ParallaxImageProps) {
  const imageRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  
  useEffect(() => {
    const element = imageRef.current;
    const img = imgRef.current;
    if (!element || !img) return;
    
    // GSAP parallax animation with better performance
    const parallaxAmount = speed * 100;
    
    let fromProps: any = {};
    let toProps: any = {};
    
    // Set up directional movement
    switch (direction) {
      case 'up':
        fromProps.y = parallaxAmount;
        toProps.y = -parallaxAmount;
        break;
      case 'down':
        fromProps.y = -parallaxAmount;
        toProps.y = parallaxAmount;
        break;
      case 'left':
        fromProps.x = parallaxAmount;
        toProps.x = -parallaxAmount;
        break;
      case 'right':
        fromProps.x = -parallaxAmount;
        toProps.x = parallaxAmount;
        break;
    }
    
    // Add scale if enabled
    if (scale) {
      fromProps.scale = 0.8;
      toProps.scale = 1.2;
    }
    
    // Create GSAP animation with scroll trigger
    const animation = gsap.fromTo(img, fromProps, {
      ...toProps,
      ease: "none",
      scrollTrigger: {
        trigger: element,
        start: "top bottom",
        end: "bottom top",
        scrub: 1, // Smooth scrubbing
        invalidateOnRefresh: true
      }
    });
    
    return () => {
      animation.kill();
    };
  }, [speed, scale, direction]);
  
  return (
    <div ref={imageRef} className={`relative overflow-hidden ${className}`}>
      <img 
        ref={imgRef}
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
      />
      {children}
    </div>
  );
}