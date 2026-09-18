"use client";
import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Eye, Move3D, ZoomIn } from 'lucide-react';

interface InteractionHintProps {
  type: 'zoom' | 'pan' | 'scroll' | 'gallery';
  trigger?: 'hover' | 'scroll' | 'always';
  className?: string;
  children?: React.ReactNode;
}

export default function InteractionHint({ 
  type, 
  trigger = 'scroll',
  className = "",
  children 
}: InteractionHintProps) {
  const [isVisible, setIsVisible] = useState(trigger === 'always');
  const [isMobile, setIsMobile] = useState(false);
  const hintRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  useEffect(() => {
    const element = hintRef.current;
    if (!element || trigger === 'always') return;
    
    const handleScroll = () => {
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Show hint when element is about to enter viewport
      const isNearViewport = rect.top < windowHeight + 200 && rect.bottom > -200;
      const isInViewport = rect.top < windowHeight && rect.bottom > 0;
      
      if (trigger === 'scroll') {
        // Show hints less frequently on mobile to reduce clutter
        setIsVisible(!isMobile && isNearViewport && !isInViewport);
      }
    };
    
    if (trigger === 'scroll') {
      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();
      
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [trigger, isMobile]);
  
  const getIcon = () => {
    const iconSize = isMobile ? "w-3 h-3" : "w-4 h-4";
    switch (type) {
      case 'zoom':
        return <ZoomIn className={iconSize} />;
      case 'pan':
        return <Move3D className={iconSize} />;
      case 'gallery':
        return <ArrowRight className={iconSize} />;
      default:
        return <Eye className={iconSize} />;
    }
  };
  
  const getText = () => {
    if (isMobile) {
      switch (type) {
        case 'zoom':
          return 'Swipe to zoom';
        case 'pan':
          return 'Swipe to move';
        case 'gallery':
          return 'Swipe to browse';
        default:
          return 'Swipe to interact';
      }
    } else {
      switch (type) {
        case 'zoom':
          return 'Scroll to zoom';
        case 'pan':
          return 'Scroll to move';
        case 'gallery':
          return 'Scroll to browse';
        default:
          return 'Scroll to interact';
      }
    }
  };
  
  return (
    <div 
      ref={hintRef}
      className={`relative ${className}`}
      onMouseEnter={() => !isMobile && trigger === 'hover' && setIsVisible(true)}
      onMouseLeave={() => !isMobile && trigger === 'hover' && setIsVisible(false)}
    >
      {children}
      
      {isVisible && !isMobile && (
        <div className={`absolute top-4 right-4 z-10 bg-black/60 backdrop-blur-sm rounded-full ${isMobile ? 'px-2 py-1' : 'px-3 py-2'} flex items-center space-x-2 text-white ${isMobile ? 'text-xs' : 'text-sm'} animate-fadeIn`}>
          {getIcon()}
          <span>{getText()}</span>
        </div>
      )}
    </div>
  );
}