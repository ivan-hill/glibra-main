import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface TouchNavigationOptions {
  sensitivity?: number;
  cooldownTime?: number;
  enableHaptic?: boolean;
}

export function useTouchNavigation(options: TouchNavigationOptions = {}) {
  const {
    sensitivity = 0.3,
    cooldownTime = 800,
    enableHaptic = true
  } = options;

  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const cooldownRef = useRef(false);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        touchStartRef.current = {
          x: touch.clientX,
          y: touch.clientY,
          time: Date.now()
        };
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartRef.current || cooldownRef.current) return;

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStartRef.current.x;
      const deltaY = touch.clientY - touchStartRef.current.y;
      const deltaTime = Date.now() - touchStartRef.current.time;

      const minSwipeDistance = 80;
      const maxSwipeTime = 400;
      const minVelocity = sensitivity;

      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const velocity = distance / deltaTime;

      // Detect vertical swipe gestures
      if (
        Math.abs(deltaY) > minSwipeDistance &&
        Math.abs(deltaY) > Math.abs(deltaX) * 1.2 &&
        velocity > minVelocity &&
        deltaTime < maxSwipeTime
      ) {
        cooldownRef.current = true;
        setTimeout(() => {
          cooldownRef.current = false;
        }, cooldownTime);

        // Haptic feedback
        if (enableHaptic && 'vibrate' in navigator) {
          navigator.vibrate(25);
        }

        const direction = deltaY < 0 ? 'down' : 'up';
        navigateToSection(direction);
      }

      touchStartRef.current = null;
    };

    const navigateToSection = (direction: 'up' | 'down') => {
      const sections = document.querySelectorAll('.section-container');
      const activeDot = document.querySelector('.scroll-dot.active');
      
      if (!activeDot) return;

      const currentIndex = parseInt(activeDot.getAttribute('data-section') || '0');
      let targetIndex = direction === 'down' ? currentIndex + 1 : currentIndex - 1;

      targetIndex = Math.max(0, Math.min(sections.length - 1, targetIndex));

      if (targetIndex !== currentIndex && sections[targetIndex]) {
        const targetSection = sections[targetIndex] as HTMLElement;
        
        targetSection.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start' 
        });
      }
    };

    // Only add listeners on mobile devices
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
    
    if (isMobile) {
      document.addEventListener('touchstart', handleTouchStart, { passive: true });
      document.addEventListener('touchend', handleTouchEnd, { passive: true });
    }

    return () => {
      if (isMobile) {
        document.removeEventListener('touchstart', handleTouchStart);
        document.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [sensitivity, cooldownTime, enableHaptic]);

  return {
    isNavigating: cooldownRef.current
  };
}