"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface PinnedProps {
  children: React.ReactNode;
  id?: string;
}

export default function Pinned({ children, id }: PinnedProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const el = ref.current!;
    
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: "+=120%",
      pin: true,
      pinSpacing: true,
      scrub: 0.6,
    });
    
    return () => st.kill();
  }, []);
  
  return (
    <section 
      id={id} 
      ref={ref} 
      className="min-h-[85vh] flex items-center justify-center section-container"
      data-testid={`pinned-section-${id}`}
    >
      {children}
    </section>
  );
}
