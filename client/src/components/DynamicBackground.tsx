"use client";
import { useEffect, useRef, useState } from 'react';

interface BackgroundConfig {
  background: string;
  textColor: string;
  overlayOpacity: string;
}

const sectionConfigs: { [key: string]: BackgroundConfig } = {
  'hero': {
    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    textColor: '#1f2937',
    overlayOpacity: '0'
  },
  'problem': {
    background: 'linear-gradient(135deg, #fecaca 0%, #f87171 100%)',
    textColor: '#7f1d1d',
    overlayOpacity: '0.1'
  },
  'solution': {
    background: 'linear-gradient(135deg, #86efac 0%, #22c55e 100%)',
    textColor: '#14532d',
    overlayOpacity: '0.1'
  },
  'planning': {
    background: 'linear-gradient(135deg, #93c5fd 0%, #3b82f6 100%)',
    textColor: '#1e3a8a',
    overlayOpacity: '0.1'
  },
  'discovery': {
    background: 'linear-gradient(135deg, #c084fc 0%, #8b5cf6 100%)',
    textColor: '#581c87',
    overlayOpacity: '0.2'
  },
  'navigation': {
    background: 'linear-gradient(135deg, #6ee7b7 0%, #10b981 100%)',
    textColor: '#14532d',
    overlayOpacity: '0.1'
  },
  'experiences': {
    background: 'linear-gradient(135deg, #fed7aa 0%, #f97316 100%)',
    textColor: '#9a3412',
    overlayOpacity: '0.1'
  },
  'mobile': {
    background: 'linear-gradient(135deg, #7dd3fc 0%, #0ea5e9 100%)',
    textColor: '#0c4a6e',
    overlayOpacity: '0.1'
  },
  'adventure': {
    background: 'linear-gradient(135deg, #fde047 0%, #eab308 100%)',
    textColor: '#92400e',
    overlayOpacity: '0.1'
  },
  'ai': {
    background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
    textColor: '#f1f5f9',
    overlayOpacity: '0.3'
  },
  'memories': {
    background: 'linear-gradient(135deg, #f9a8d4 0%, #ec4899 100%)',
    textColor: '#831843',
    overlayOpacity: '0.1'
  },
  'cta': {
    background: 'linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%)',
    textColor: '#ffffff',
    overlayOpacity: '0.2'
  }
};

export default function DynamicBackground() {
  const [currentSection, setCurrentSection] = useState('hero');
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const updateBackground = (config: BackgroundConfig) => {
      console.log('Updating background with:', config);
      
      // Force update body background directly with !important
      document.body.style.setProperty('background', config.background, 'important');
      document.body.style.setProperty('color', config.textColor, 'important');
      document.body.style.setProperty('transition', 'background 1.5s ease, color 1.5s ease', 'important');
      
      // Also update CSS variables
      document.documentElement.style.setProperty('--dynamic-bg', config.background);
      document.documentElement.style.setProperty('--dynamic-text', config.textColor);
      document.documentElement.style.setProperty('--overlay-opacity', config.overlayOpacity);
      
      console.log('Body background applied:', document.body.style.background);
    };

    // Set initial background
    updateBackground(sectionConfigs.hero);

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            const sectionId = entry.target.getAttribute('data-section') || 'hero';
            console.log('Section detected:', sectionId, 'Ratio:', entry.intersectionRatio);
            setCurrentSection(sectionId);
            
            const config = sectionConfigs[sectionId] || sectionConfigs.hero;
            console.log('Applying config:', config);
            updateBackground(config);
          }
        });
      },
      {
        threshold: [0.3, 0.5, 0.7],
        rootMargin: '0px'
      }
    );

    // Observe all sections with a slight delay to ensure DOM is ready
    setTimeout(() => {
      const sections = document.querySelectorAll('[data-section]');
      console.log('Found sections:', sections.length);
      sections.forEach((section, index) => {
        const sectionId = section.getAttribute('data-section');
        console.log(`Observing section ${index + 1}: ${sectionId}`);
        observerRef.current?.observe(section);
      });
    }, 100);

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  return null;
}