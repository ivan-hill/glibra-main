"use client";
import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";

export default function SmoothScroll() {
  useEffect(() => {
    // Detect mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
    
    const lenis = new Lenis({ 
      duration: isMobile ? 0.8 : 0.6, 
      smoothWheel: true,
      wheelMultiplier: isMobile ? 1.2 : 1.5,
      touchMultiplier: isMobile ? 2 : 2.5,
      infinite: false,
      syncTouch: true,
      syncTouchLerp: 0.15,
      touchInertiaMultiplier: 45,
    });
    
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    
    requestAnimationFrame(raf);
    
    // Cleanup function
    return () => {
      lenis.destroy();
    };
  }, []);
  
  return null;
}
