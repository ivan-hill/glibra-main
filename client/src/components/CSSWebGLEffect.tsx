"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function CSSWebGLEffect() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    const background = backgroundRef.current;
    if (!overlay || !background) return;

    // Scroll-reactive effects
    const scrollAnimation = gsap.timeline({
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          
          // Intensify distortion and grain with scroll
          overlay.style.setProperty('--scroll-progress', progress.toString());
          background.style.setProperty('--scroll-intensity', (progress * 2 + 0.3).toString());
        }
      }
    });

    // Section-based texture crossfading
    const crossfadeAnimation = gsap.timeline({
      scrollTrigger: {
        trigger: "#section-2",
        start: "top 65%",
        end: "bottom 35%",
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          background.style.setProperty('--texture-mix', progress.toString());
        }
      }
    });

    return () => {
      scrollAnimation?.kill();
      crossfadeAnimation?.kill();
    };
  }, []);

  return (
    <>
      {/* Base background with texture crossfading */}
      <div 
        ref={backgroundRef}
        className="fixed inset-0 z-0"
        style={{
          background: `
            linear-gradient(
              var(--texture-mix, 0) * 100% + 135deg,
              hsl(210 11% calc(4% + var(--scroll-intensity, 0.3) * 2%)),
              hsl(220 15% calc(5% + var(--scroll-intensity, 0.3) * 3%)),
              hsl(230 20% calc(6% + var(--scroll-intensity, 0.3) * 4%)),
              hsl(200 25% calc(7% + var(--scroll-intensity, 0.3) * 3%)),
              hsl(180 30% calc(6% + var(--scroll-intensity, 0.3) * 4%))
            ),
            radial-gradient(
              ellipse at calc(25% + var(--texture-mix, 0) * 50%) calc(25% + var(--texture-mix, 0) * 25%),
              rgba(26, 229, 214, calc(0.15 + var(--scroll-intensity, 0.3) * 0.1)) 0%,
              transparent 50%
            ),
            radial-gradient(
              ellipse at calc(75% - var(--texture-mix, 0) * 25%) calc(75% - var(--texture-mix, 0) * 50%),
              rgba(0, 209, 193, calc(0.1 + var(--scroll-intensity, 0.3) * 0.15)) 0%,
              transparent 50%
            )
          `,
          backgroundAttachment: 'fixed',
          filter: `
            contrast(calc(1 + var(--scroll-intensity, 0.3) * 0.2))
            brightness(calc(0.9 + var(--scroll-intensity, 0.3) * 0.1))
            hue-rotate(calc(var(--texture-mix, 0) * 15deg))
          `,
          '--texture-mix': '0',
          '--scroll-intensity': '0.3'
        } as React.CSSProperties}
      />
      
      {/* Film grain and distortion overlay */}
      <div 
        ref={overlayRef}
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(
              circle at calc(25% + var(--scroll-progress, 0) * 10%) calc(25% + var(--scroll-progress, 0) * 15%),
              rgba(255,255,255,calc(0.02 + var(--scroll-progress, 0) * 0.02)) 1px,
              transparent 1px
            ),
            radial-gradient(
              circle at calc(75% - var(--scroll-progress, 0) * 15%) calc(75% - var(--scroll-progress, 0) * 10%),
              rgba(26, 229, 214, calc(0.03 + var(--scroll-progress, 0) * 0.03)) 1px,
              transparent 1px
            )
          `,
          backgroundSize: 'calc(50px + var(--scroll-progress, 0) * 20px) calc(50px + var(--scroll-progress, 0) * 20px), calc(80px + var(--scroll-progress, 0) * 30px) calc(80px + var(--scroll-progress, 0) * 30px)',
          animation: `grain calc(8s - var(--scroll-progress, 0) * 2s) linear infinite`,
          opacity: `calc(0.8 + var(--scroll-progress, 0) * 0.2)`,
          '--scroll-progress': '0'
        } as React.CSSProperties}
      />
      
      {/* Vignette effect */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,calc(0.3 + var(--scroll-progress, 0) * 0.2)) 90%)`,
          '--scroll-progress': '0'
        } as React.CSSProperties}
      />
    </>
  );
}