"use client";
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface HorizontalGalleryProps {
  images: string[];
  alts: string[];
  className?: string;
}

export default function HorizontalGallery({ images, alts, className = "" }: HorizontalGalleryProps) {
  const galleryRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  useEffect(() => {
    const container = containerRef.current;
    const gallery = galleryRef.current;
    if (!container || !gallery) return;
    
    // GSAP horizontal scroll with pinning
    const galleryWidth = gallery.scrollWidth;
    const containerWidth = container.clientWidth;
    const scrollDistance = galleryWidth - containerWidth;
    
    if (scrollDistance > 0) {
      const animation = gsap.to(gallery, {
        x: () => -scrollDistance,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          pin: true,
          scrub: 1,
          end: () => `+=${scrollDistance}`,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            // Enhanced image effects during scroll
            const images = gallery.querySelectorAll('img');
            images.forEach((img, index) => {
              const imgRect = img.getBoundingClientRect();
              const centerX = window.innerWidth / 2;
              const imgCenter = imgRect.left + imgRect.width / 2;
              const distance = Math.abs(imgCenter - centerX);
              const maxDistance = window.innerWidth / 2;
              const proximityRatio = 1 - (distance / maxDistance);
              
              // Scale based on proximity to center
              const scale = 0.9 + (proximityRatio * 0.2);
              const brightness = 0.7 + (proximityRatio * 0.3);
              
              // Apply smooth transforms
              gsap.set(img, {
                scale: scale,
                filter: `brightness(${brightness})`,
                rotateY: (distance / maxDistance) * 8 - 4, // Slight 3D rotation
                duration: 0.3,
                ease: "power2.out"
              });
            });
          }
        }
      });
      
      return () => {
        animation.kill();
      };
    }
  }, [isMobile]);
  
  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="overflow-hidden w-full h-full">
        <div 
          ref={galleryRef}
          className="flex gap-6 transition-transform duration-75 ease-out"
          style={{ 
            width: isMobile ? `${images.length * 85}vw` : `${images.length * 65}vw`, // Larger on mobile for touch scrolling
          }}
        >
          {images.map((image, index) => (
            <div 
              key={index}
              className={`flex-shrink-0 ${isMobile ? 'w-[80vw]' : 'w-[60vw]'} h-full relative`}
            >
              <img
                src={image}
                alt={alts[index] || `Gallery image ${index + 1}`}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}