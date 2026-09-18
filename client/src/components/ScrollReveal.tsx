"use client";
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade';
  threshold?: number;
}

export default function ScrollReveal({
  children,
  className = '',
  delay = 0,
  duration = 0.8,
  direction = 'up',
  threshold = 0.2
}: ScrollRevealProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    
    // Set initial state
    const getInitialProps = () => {
      switch (direction) {
        case 'up': return { y: 80, opacity: 0 };
        case 'down': return { y: -80, opacity: 0 };
        case 'left': return { x: 80, opacity: 0 };
        case 'right': return { x: -80, opacity: 0 };
        case 'fade': return { scale: 0.8, opacity: 0 };
        default: return { y: 80, opacity: 0 };
      }
    };
    
    // Set initial state
    gsap.set(element, getInitialProps());
    
    // Create scroll trigger animation
    const animation = gsap.to(element, {
      x: 0,
      y: 0,
      scale: 1,
      opacity: 1,
      duration: window.innerWidth < 768 ? duration * 0.7 : duration, // Faster on mobile
      delay: window.innerWidth < 768 ? delay * 0.7 : delay, // Shorter delays on mobile
      ease: window.innerWidth < 768 ? "power2.out" : "power3.out", // Simpler easing on mobile
      scrollTrigger: {
        trigger: element,
        start: `top ${(1 - threshold) * 100}%`,
        toggleActions: "play none none reverse"
      }
    });
    
    return () => {
      animation.kill();
    };
  }, [delay, duration, direction, threshold]);
  
  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
}