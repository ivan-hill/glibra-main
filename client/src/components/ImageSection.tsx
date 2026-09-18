"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ImageSectionProps {
  id?: string;
  imageSrc: string;
  alt: string;
  title?: string;
  caption?: string;
  layout?: "full" | "split" | "center";
  imagePosition?: "left" | "right";
}

export default function ImageSection({ 
  id, 
  imageSrc, 
  alt, 
  title, 
  caption, 
  layout = "center",
  imagePosition = "left" 
}: ImageSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const el = ref.current!;
    
    // Image reveal animation
    gsap.fromTo(
      el.querySelector("[data-image]"),
      { scale: 1.1, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 1.2,
        ease: "power2.out",
        scrollTrigger: { 
          trigger: el, 
          start: "top 80%", 
          end: "bottom 70%", 
          toggleActions: "play none none reverse" 
        },
      }
    );

    // Text animations if present
    if (title || caption) {
      gsap.fromTo(
        el.querySelectorAll("[data-text]"),
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.2,
          duration: 0.8,
          ease: "power2.out",
          delay: 0.3,
          scrollTrigger: { 
            trigger: el, 
            start: "top 75%", 
            end: "bottom 65%", 
            toggleActions: "play none none reverse" 
          },
        }
      );
    }

    // Parallax effect for the image
    gsap.fromTo(
      el.querySelector("[data-image]"),
      { y: 50 },
      {
        y: -50,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        }
      }
    );
  }, [title, caption]);
  
  if (layout === "full") {
    return (
      <section 
        id={id} 
        ref={ref} 
        className="min-h-screen flex items-center justify-center section-container relative overflow-hidden pt-16"
        data-testid={`image-section-${id}`}
      >
        <div className="absolute inset-0 bg-white/10 z-10"></div>
        <img 
          src={imageSrc}
          alt={alt}
          data-image
          className="absolute inset-0 w-full h-full object-cover"
          data-testid={`image-${id}`}
        />
        {(title || caption) && (
          <div className="relative z-20 text-center px-6 max-w-4xl mx-auto text-gray-900">
            {title && (
              <h2 
                data-text
                className="section-text text-5xl md:text-7xl xl:text-8xl font-semibold mb-6"
                data-testid={`image-title-${id}`}
              >
                {title}
              </h2>
            )}
            {caption && (
              <p 
                data-text
                className="body-text text-xl md:text-2xl text-gray-700"
                data-testid={`image-caption-${id}`}
              >
                {caption}
              </p>
            )}
          </div>
        )}
      </section>
    );
  }

  if (layout === "split") {
    return (
      <section 
        id={id} 
        ref={ref} 
        className="min-h-screen flex items-center section-container py-10 md:py-12"
        data-testid={`image-section-${id}`}
      >
        <div className={`grid md:grid-cols-2 gap-8 items-center max-w-7xl mx-auto px-6 ${imagePosition === 'right' ? 'md:grid-flow-col-dense' : ''}`}>
          <div className={`space-y-6 ${imagePosition === 'right' ? 'md:col-start-1' : ''}`}>
            {title && (
              <h2 
                data-text
                className="section-text text-4xl md:text-6xl xl:text-7xl font-semibold"
                data-testid={`image-title-${id}`}
              >
                {title}
              </h2>
            )}
            {caption && (
              <p 
                data-text
                className="body-text text-xl md:text-2xl text-gray-600"
                data-testid={`image-caption-${id}`}
              >
                {caption}
              </p>
            )}
          </div>
          <div className={`relative overflow-hidden rounded-lg ${imagePosition === 'right' ? 'md:col-start-2' : ''}`}>
            <img 
              src={imageSrc}
              alt={alt}
              data-image
              className="w-full h-[60vh] object-cover"
              data-testid={`image-${id}`}
            />
          </div>
        </div>
      </section>
    );
  }

  // Center layout
  return (
    <section 
      id={id} 
      ref={ref} 
      className="min-h-screen flex items-center justify-center section-container py-10 md:py-12"
      data-testid={`image-section-${id}`}
    >
      <div className="max-w-5xl mx-auto text-center px-6 space-y-8">
        {title && (
          <h2 
            data-text
            className="section-text text-5xl md:text-7xl xl:text-8xl font-semibold mb-8"
            data-testid={`image-title-${id}`}
          >
            {title}
          </h2>
        )}
        <div className="relative overflow-hidden rounded-lg">
          <img 
            src={imageSrc}
            alt={alt}
            data-image
            className="w-full h-[70vh] object-cover"
            data-testid={`image-${id}`}
          />
        </div>
        {caption && (
          <p 
            data-text
            className="body-text text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto"
            data-testid={`image-caption-${id}`}
          >
            {caption}
          </p>
        )}
      </div>
    </section>
  );
}