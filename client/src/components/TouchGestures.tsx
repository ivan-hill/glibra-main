"use client";
import { useState, useEffect } from "react";
import { useTouchNavigation } from "@/hooks/useTouchNavigation";

interface TouchGesturesProps {
  onSectionChange?: (direction: 'up' | 'down') => void;
}

export default function TouchGestures({ onSectionChange }: TouchGesturesProps) {
  const { isNavigating } = useTouchNavigation({
    sensitivity: 0.4,
    cooldownTime: 1000,
    enableHaptic: true
  });
  const [showHint, setShowHint] = useState(true);

  // Hide hint after first interaction or timeout
  useEffect(() => {
    const timer = setTimeout(() => setShowHint(false), 5000);
    
    const handleTouch = () => setShowHint(false);
    document.addEventListener('touchstart', handleTouch, { once: true });
    
    return () => {
      clearTimeout(timer);
      document.removeEventListener('touchstart', handleTouch);
    };
  }, []);

  return (
    <>
      {/* Touch gesture indicator for mobile */}
      {showHint && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-20 md:hidden">
          <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2 swipe-hint">
            <div className="text-xs text-white/70">Swipe up/down</div>
            <div className="flex flex-col gap-1">
              <div className="w-2 h-1 bg-white/40 rounded-full"></div>
              <div className="w-2 h-1 bg-white/40 rounded-full"></div>
              <div className="w-2 h-1 bg-white/40 rounded-full"></div>
            </div>
          </div>
        </div>
      )}

      {/* Scroll lock during gesture navigation */}
      {isNavigating && (
        <div 
          className="fixed inset-0 z-30 pointer-events-none"
          style={{ touchAction: 'none' }}
          data-testid="navigation-lock"
        />
      )}
    </>
  );
}