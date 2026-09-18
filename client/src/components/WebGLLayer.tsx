"use client";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SimpleWebGLStage from "./SimpleWebGLStage";
import { useScrollUniform } from "@/hooks/useScrollUniform";

gsap.registerPlugin(ScrollTrigger);

export default function WebGLLayer() {
  const texA = useLoader(TextureLoader, "/images/hero.jpg");
  const texB = useLoader(TextureLoader, "/images/heroB.jpg");
  const matRef = useRef<any>(null);

  useScrollUniform((v) => {
    if (!matRef.current) return;
    gsap.to(matRef.current, { 
      duration: 0.2, 
      uScroll: v, 
      overwrite: true, 
      ease: "power1.out" 
    });
  });

  // Section-based texture mixing
  function onMaterialReady(m: any) {
    matRef.current = m;

    // Example: when #section-2 enters, increase uMix to show B; revert on leave back
    ScrollTrigger.create({
      trigger: "#section-2",
      start: "top 65%",
      end: "bottom 35%",
      onEnter: () => gsap.to(m, { uMix: 1, duration: 0.8, ease: "power2.out" }),
      onLeaveBack: () => gsap.to(m, { uMix: 0, duration: 0.8, ease: "power2.out" }),
    });

    // Additional texture transition for section 4
    ScrollTrigger.create({
      trigger: "#section-4",
      start: "top 65%",
      end: "bottom 35%",
      onEnter: () => gsap.to(m, { uMix: 0.7, duration: 1.2, ease: "power2.out" }),
      onLeave: () => gsap.to(m, { uMix: 0, duration: 1.2, ease: "power2.out" }),
      onLeaveBack: () => gsap.to(m, { uMix: 0, duration: 1.2, ease: "power2.out" }),
    });
  }

  // Setup scroll indicators
  useEffect(() => {
    const sections = document.querySelectorAll('.section-container');
    const dots = document.querySelectorAll('.scroll-dot');
    
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionIndex = Array.from(sections).indexOf(entry.target as HTMLElement);
          dots.forEach(dot => dot.classList.remove('active'));
          if (dots[sectionIndex]) {
            dots[sectionIndex].classList.add('active');
          }
        }
      });
    }, { threshold: 0.5 });

    sections.forEach(section => {
      sectionObserver.observe(section);
    });

    return () => {
      sections.forEach(section => {
        sectionObserver.unobserve(section);
      });
    };
  }, []);

  return <SimpleWebGLStage onMaterialReady={onMaterialReady} texA={texA} texB={texB} />;
}
