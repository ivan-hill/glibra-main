"use client";
import { useEffect, useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import gsap from "gsap";

export default function MobileNavigation() {
  const [currentSection, setCurrentSection] = useState(0);
  const [totalSections, setTotalSections] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    const sections = document.querySelectorAll('.section-container');
    setTotalSections(sections.length);

    // Enhanced intersection observer for mobile
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
          const sectionIndex = Array.from(sections).indexOf(entry.target as HTMLElement);
          setCurrentSection(sectionIndex);
        }
      });
    }, { 
      threshold: [0.3, 0.5, 0.7],
      rootMargin: '-10% 0px -10% 0px'
    });

    sections.forEach(section => observer.observe(section));

    return () => {
      sections.forEach(section => observer.unobserve(section));
    };
  }, []);

  const navigateToSection = (direction: 'up' | 'down') => {
    if (isNavigating) return;

    const targetIndex = direction === 'down' ? currentSection + 1 : currentSection - 1;
    
    if (targetIndex < 0 || targetIndex >= totalSections) return;

    setIsNavigating(true);

    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(15);
    }

    const sections = document.querySelectorAll('.section-container');
    const targetSection = sections[targetIndex] as HTMLElement;

    targetSection.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start' 
    });
    
    setTimeout(() => {
      setIsNavigating(false);
      setCurrentSection(targetIndex);
    }, 1200);
  };

  const navigateToSpecificSection = (index: number) => {
    if (isNavigating || index === currentSection) return;

    setIsNavigating(true);

    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(15);
    }

    const sections = document.querySelectorAll('.section-container');
    const targetSection = sections[index] as HTMLElement;

    targetSection.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start' 
    });
    
    setTimeout(() => {
      setIsNavigating(false);
      setCurrentSection(index);
    }, 1500);
  };

  return (
    <>
      {/* Mobile navigation controls */}
      <div className="md:hidden fixed bottom-4 left-4 z-20 flex flex-col gap-2">
        <button
          onClick={() => navigateToSection('up')}
          disabled={currentSection === 0 || isNavigating}
          className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white disabled:opacity-30 disabled:cursor-not-allowed touch-manipulation"
          data-testid="nav-up-button"
        >
          <ChevronUp size={20} />
        </button>
        <button
          onClick={() => navigateToSection('down')}
          disabled={currentSection >= totalSections - 1 || isNavigating}
          className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white disabled:opacity-30 disabled:cursor-not-allowed touch-manipulation"
          data-testid="nav-down-button"
        >
          <ChevronDown size={20} />
        </button>
      </div>

      {/* Mobile section counter */}
      <div className="md:hidden fixed bottom-4 right-4 z-20">
        <div className="bg-white/10 backdrop-blur-sm rounded-full px-3 py-2 text-white text-sm">
          <span data-testid="section-counter">
            {currentSection + 1} / {totalSections}
          </span>
        </div>
      </div>

      {/* Enhanced mobile scroll indicators */}
      <div className="md:hidden fixed right-4 top-1/2 transform -translate-y-1/2 z-20 flex flex-col gap-3">
        {Array.from({ length: totalSections }, (_, index) => (
          <button
            key={index}
            onClick={() => navigateToSpecificSection(index)}
            disabled={isNavigating}
            className={`w-3 h-3 rounded-full transition-all duration-300 touch-manipulation ${
              index === currentSection 
                ? 'bg-white scale-125 shadow-lg' 
                : 'bg-white/30 hover:bg-white/50'
            }`}
            data-testid={`mobile-scroll-dot-${index}`}
          />
        ))}
      </div>

      {/* Swipe hint animation */}
      {currentSection === 0 && (
        <div className="md:hidden fixed bottom-20 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
          <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2 text-white/70 text-xs">
            <ChevronUp size={16} />
            <span>Swipe to navigate</span>
            <ChevronDown size={16} />
          </div>
        </div>
      )}
    </>
  );
}