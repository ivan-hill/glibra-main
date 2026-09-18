"use client";
import { useEffect, useRef, useState } from 'react';
import { ChevronDown, MouseIcon, Scroll } from 'lucide-react';

interface ScrollHintProps {
  type?: 'arrow' | 'mouse' | 'scroll' | 'pulse';
  position?: 'bottom-center' | 'bottom-right' | 'center-right';
  className?: string;
  show?: boolean;
}

export default function ScrollHint({ 
  type = 'arrow', 
  position = 'bottom-center',
  className = "",
  show = true
}: ScrollHintProps) {
  const [isVisible, setIsVisible] = useState(show);
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
    if (!show) return;
    
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // Hide hint after user scrolls a bit, faster on mobile
      const threshold = isMobile ? 0.05 : 0.1;
      if (scrollY > windowHeight * threshold) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [show, isMobile]);
  
  const positionClasses = {
    'bottom-center': isMobile ? 'bottom-20 left-1/2 transform -translate-x-1/2' : 'bottom-8 left-1/2 transform -translate-x-1/2',
    'bottom-right': isMobile ? 'bottom-20 right-4' : 'bottom-8 right-8',
    'center-right': isMobile ? 'top-1/2 right-4 transform -translate-y-1/2' : 'top-1/2 right-8 transform -translate-y-1/2'
  };
  
  const getIcon = () => {
    const iconSize = isMobile ? "w-5 h-5" : "w-6 h-6";
    switch (type) {
      case 'mouse':
        return <MouseIcon className={iconSize} />;
      case 'scroll':
        return <Scroll className={iconSize} />;
      case 'pulse':
        return <div className={`${isMobile ? 'w-2 h-2' : 'w-3 h-3'} bg-current rounded-full animate-pulse`} />;
      default:
        return <ChevronDown className={iconSize} />;
    }
  };
  
  const getText = () => {
    if (isMobile) {
      switch (type) {
        case 'arrow':
          return 'Swipe up';
        case 'mouse':
          return 'Scroll up';
        case 'scroll':
          return 'More below';
        default:
          return 'Swipe up';
      }
    } else {
      switch (type) {
        case 'arrow':
          return 'Scroll to explore';
        case 'mouse':
          return 'Use mouse wheel';
        case 'scroll':
          return 'More content below';
        default:
          return 'Scroll to explore';
      }
    }
  };
  
  if (!isVisible) return null;
  
  return (
    <div 
      ref={hintRef}
      className={`fixed z-50 text-white/70 ${isMobile ? 'animate-pulse' : 'animate-bounce'} pointer-events-none ${positionClasses[position]} ${className}`}
    >
      <div className="flex flex-col items-center space-y-1">
        {getIcon()}
        <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>
          {getText()}
        </span>
      </div>
    </div>
  );
}