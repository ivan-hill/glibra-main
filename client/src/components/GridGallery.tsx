"use client";
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface GridImage {
  src: string;
  alt: string;
  size: 'small' | 'medium' | 'large';
  position?: 'top' | 'center' | 'bottom';
}

interface GridGalleryProps {
  images: GridImage[];
  className?: string;
  title?: string;
  subtitle?: string;
}

export default function GridGallery({ 
  images, 
  className = "",
  title,
  subtitle
}: GridGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const container = containerRef.current;
    const grid = gridRef.current;
    if (!container || !grid) return;
    
    // Animate images in staggered sequence
    const imageElements = grid.querySelectorAll('.grid-image');
    
    // Set initial state
    gsap.set(imageElements, {
      opacity: 0,
      scale: 0.8,
      rotateX: 15,
      y: 30
    });
    
    // Create staggered reveal animation
    const animation = gsap.to(imageElements, {
      opacity: 1,
      scale: 1,
      rotateX: 0,
      y: 0,
      duration: window.innerWidth < 768 ? 0.8 : 1.2, // Faster on mobile
      stagger: {
        amount: window.innerWidth < 768 ? 0.8 : 1.5, // Quicker stagger on mobile
        from: "random"
      },
      ease: window.innerWidth < 768 ? "power2.out" : "power3.out", // Simpler on mobile
      scrollTrigger: {
        trigger: container,
        start: "top 85%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
        invalidateOnRefresh: true,
        markers: false // Set to true for debugging
      }
    });
    
    return () => {
      animation.kill();
    };
  }, []);
  
  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {(title || subtitle) && (
        <div className="text-center mb-16 space-y-6">
          {title && (
            <h2 className="text-4xl md:text-6xl xl:text-7xl font-light text-gray-900 leading-tight">
              {title.split(' ').map((word, index) => (
                <div key={index} className="block">{word}</div>
              ))}
            </h2>
          )}
          {subtitle && (
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>
      )}
      
      <div 
        ref={gridRef}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-8 auto-rows-[180px] md:auto-rows-[300px] lg:auto-rows-[320px]"
      >
        {images.map((image, index) => (
          <div
            key={index}
            className={`grid-image relative overflow-hidden rounded-lg ${
              image.size === 'large' 
                ? 'col-span-2 row-span-2' 
                : image.size === 'medium'
                ? 'col-span-2 row-span-1 md:col-span-1 md:row-span-2'
                : 'col-span-1 row-span-1'
            }`}
          >
            <img
              src={image.src}
              alt={image.alt}
              className={`w-full h-full object-cover transition-all duration-500 hover:scale-105 ${
                image.position === 'top' ? 'object-top' :
                image.position === 'bottom' ? 'object-bottom' :
                'object-center'
              }`}
            />
            <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-300" />
          </div>
        ))}
      </div>
    </div>
  );
}