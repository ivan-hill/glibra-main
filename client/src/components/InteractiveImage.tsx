"use client";
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface InteractiveImageProps {
  src: string;
  alt: string;
  className?: string;
  zoomIntensity?: number;
  panDirection?: 'horizontal' | 'vertical' | 'diagonal';
  children?: React.ReactNode;
}

export default function InteractiveImage({ 
  src, 
  alt, 
  className = "",
  zoomIntensity = 0.3,
  panDirection = 'horizontal',
  children 
}: InteractiveImageProps) {
  const imageRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  useEffect(() => {
    const element = imageRef.current;
    const img = element?.querySelector('img');
    if (!element || !img) return;
    
    // Reduce effects on mobile for native feel
    const mobileZoomIntensity = isMobile ? zoomIntensity * 0.15 : zoomIntensity; // Even less zoom
    const mobilePanIntensity = isMobile ? 3 : 20; // Minimal pan on mobile
    
    // Set up GSAP animation properties
    let fromProps: any = { scale: 1 };
    let toProps: any = { scale: 1 + mobileZoomIntensity };
    
    if (!isMobile) {
      switch (panDirection) {
        case 'horizontal':
          fromProps.x = -mobilePanIntensity;
          toProps.x = mobilePanIntensity;
          break;
        case 'vertical':
          fromProps.y = -mobilePanIntensity;
          toProps.y = mobilePanIntensity;
          break;
        case 'diagonal':
          fromProps.x = -mobilePanIntensity;
          fromProps.y = -mobilePanIntensity * 0.8;
          toProps.x = mobilePanIntensity;
          toProps.y = mobilePanIntensity * 0.8;
          break;
      }
    }
    
    // Create GSAP animation
    const animation = gsap.fromTo(img, fromProps, {
      ...toProps,
      ease: "none",
      scrollTrigger: {
        trigger: element,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
        invalidateOnRefresh: true
      }
    });
    
    return () => {
      animation.kill();
    };
  }, [zoomIntensity, panDirection, isMobile]);
  
  return (
    <div ref={imageRef} className={`relative overflow-hidden ${className}`}>
      <img 
        src={src}
        alt={alt}
        className={`w-full h-full object-cover ${isMobile ? 'transition-transform duration-300' : 'transition-transform duration-150'} ease-out`}
        style={{ transformOrigin: 'center center' }}
      />
      {children}
    </div>
  );
}