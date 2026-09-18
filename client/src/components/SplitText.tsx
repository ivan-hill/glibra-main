"use client";
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface SplitTextProps {
  text: string;
  className?: string;
  splitBy?: 'words' | 'chars';
  stagger?: number;
  'data-testid'?: string;
}

export default function SplitText({ 
  text, 
  className = '', 
  splitBy = 'words', 
  stagger = 0.1,
  'data-testid': testId 
}: SplitTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<HTMLSpanElement[]>([]);
  
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    // Create animation timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse"
      }
    });
    
    // Animate words/chars with stagger
    tl.fromTo(wordsRef.current, 
      { 
        opacity: 0, 
        y: 50,
        rotateX: -90
      },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: window.innerWidth < 768 ? 0.5 : 0.8, // Faster on mobile
        stagger: window.innerWidth < 768 ? stagger * 0.7 : stagger, // Quicker stagger on mobile
        ease: window.innerWidth < 768 ? "power2.out" : "back.out(1.7)" // Simpler easing on mobile
      }
    );
    
    return () => {
      tl.kill();
    };
  }, [text, stagger]);
  
  const splitText = () => {
    wordsRef.current = []; // Reset refs array
    
    if (splitBy === 'words') {
      return text.split(' ').map((word, index) => (
        <span 
          key={index}
          ref={(el) => el && (wordsRef.current[index] = el)}
          className="inline-block"
          style={{ transformOrigin: 'center bottom' }}
        >
          {word}
          {index < text.split(' ').length - 1 && '\u00A0'}
        </span>
      ));
    } else {
      return text.split('').map((char, index) => (
        <span 
          key={index}
          ref={(el) => el && (wordsRef.current[index] = el)}
          className="inline-block"
          style={{ transformOrigin: 'center bottom' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ));
    }
  };
  
  return (
    <div ref={containerRef} className={className} data-testid={testId}>
      {splitText()}
    </div>
  );
}