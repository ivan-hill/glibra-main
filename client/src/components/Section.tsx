"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface SectionProps {
  id?: string;
  title: string;
  lines: string[];
  showCTA?: boolean;
}

export default function Section({ id, title, lines, showCTA = false }: SectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const el = ref.current!;
    
    gsap.fromTo(
      el.querySelectorAll("[data-line]"),
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.18,
        ease: "power2.out",
        scrollTrigger: { 
          trigger: el, 
          start: "top 75%", 
          end: "bottom 60%", 
          toggleActions: "play none none reverse" 
        },
      }
    );

    // Animate CTA button if present
    if (showCTA) {
      gsap.fromTo(
        el.querySelector("[data-cta]"),
        { y: 40, opacity: 0, scale: 0.9 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          ease: "power2.out",
          delay: 0.4,
          scrollTrigger: { 
            trigger: el, 
            start: "top 75%", 
            end: "bottom 60%", 
            toggleActions: "play none none reverse" 
          },
        }
      );
    }
  }, [showCTA]);
  
  return (
    <section id={id} className="min-h-screen flex items-center px-6 py-10 md:py-12 section-container" data-testid={`section-${id}`}>
      <div ref={ref} className="max-w-5xl mx-auto space-y-8">
        <h2 className="section-text text-5xl md:text-7xl xl:text-8xl font-semibold tracking-tight scroll-reveal" data-line data-testid={`section-title-${id}`}>
          {title}
        </h2>
        <div className="space-y-6">
          {lines.map((line, i) => (
            <p 
              key={i} 
              data-line 
              className="body-text text-xl md:text-2xl text-gray-600 scroll-reveal scroll-reveal-stagger" 
              style={{"--delay": `${(i + 1) * 0.1}s`} as any}
              data-testid={`section-line-${id}-${i}`}
            >
              {line}
            </p>
          ))}
          {showCTA && (
            <div className="pt-8" data-cta>
              <button 
                className="bg-primary text-primary-foreground px-8 py-4 text-lg font-semibold rounded-lg hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105"
                data-testid="cta-button"
              >
                Join the Waitlist
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
