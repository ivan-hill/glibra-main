"use client";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useScrollUniform(update: (v: number) => void) {
  useEffect(() => {
    const state = { v: 0 };
    
    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        const target = gsap.utils.clamp(0, 1, self.progress);
        state.v += (target - state.v) * 0.12; // damping
        update(state.v);
      },
    });
    
    return () => st.kill();
  }, [update]);
}
