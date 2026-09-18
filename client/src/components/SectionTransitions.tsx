"use client";
import { useEffect } from "react";

export default function SectionTransitions() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('section-visible');
            entry.target.classList.remove('section-hidden');
          } else {
            entry.target.classList.add('section-hidden');
            entry.target.classList.remove('section-visible');
          }
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -10% 0px' }
    );

    const sections = document.querySelectorAll('.section-container');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);
  
  return null;
}