"use client";
import { useEffect } from "react";
import gsap from "gsap";

export default function ClickableScrollIndicators() {
  useEffect(() => {
    const handleDotClick = (e: Event) => {
      const target = e.target as HTMLElement;
      if (!target.classList.contains('scroll-dot')) return;

      const sectionIndex = parseInt(target.getAttribute('data-section') || '0');
      const sections = document.querySelectorAll('.section-container');
      const targetSection = sections[sectionIndex] as HTMLElement;

      if (targetSection) {
        // Haptic feedback for desktop with pointer devices that support it
        if ('vibrate' in navigator) {
          navigator.vibrate(10);
        }

        // Update active state immediately for responsive feedback
        document.querySelectorAll('.scroll-dot').forEach(dot => dot.classList.remove('active'));
        target.classList.add('active');

        // Smooth scroll to target section
        targetSection.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start' 
        });
      }
    };

    // Add click handlers to scroll dots
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
      scrollIndicator.addEventListener('click', handleDotClick);
    }

    return () => {
      if (scrollIndicator) {
        scrollIndicator.removeEventListener('click', handleDotClick);
      }
    };
  }, []);

  return null;
}