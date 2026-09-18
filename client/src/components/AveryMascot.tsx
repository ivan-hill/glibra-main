import { useState, useEffect, lazy, Suspense } from "react";
import { createPortal } from "react-dom";
import averyPng from "@assets/BF0A6B56-A5D3-4402-A9B9-4CD33738790D_1769025092656.png";

type UserType = 'host' | 'traveler' | null;

interface AveryMessage {
  id: string;
  text: string;
  section: string;
}

const hostMessages: AveryMessage[] = [
  { id: 'welcome', section: 'hero', text: "Hi! I'm Avery, your guide to GLIBRA. Let me show you how to get discovered by travelers!" },
  { id: 'bundle', section: 'bundle-example', text: "See how your service fits into real trip bundles? That's the magic of connected travel!" },
  { id: 'how-it-works', section: 'how-hosts-booked', text: "Our AI matches your service with travelers who are already planning trips in your area." },
  { id: 'pricing', section: 'pricing-preview', text: "Choose the visibility level that fits your goals. You can upgrade anytime!" },
  { id: 'social', section: 'social-proof', text: "Join hosts across Upstate NY who are already getting discovered through GLIBRA bundles." },
  { id: 'mission', section: 'mission', text: "We believe travel should be seamless. Ready to be part of the journey?" },
  { id: 'cta', section: 'final-cta', text: "Listing takes about 5 minutes. I'll be right here if you need help!" },
];

const travelerMessages: AveryMessage[] = [
  { id: 'welcome', section: 'hero', text: "Hi! I'm Avery! Let me help you build the perfect trip bundle." },
  { id: 'themes', section: 'bundle-preview', text: "Pick your themes and I'll find services that work together seamlessly." },
  { id: 'browse', section: 'browse', text: "Browse curated bundles or create your own custom trip!" },
  { id: 'cta', section: 'final-cta', text: "Ready to stop juggling apps? Let's build your first bundle together!" },
];

const defaultMessage: AveryMessage = {
  id: 'default',
  section: 'default',
  text: "Welcome to GLIBRA! Choose your path above to get started."
};

interface AveryMascotProps {
  userType: UserType;
  currentSection?: string;
}

export default function AveryMascot({ userType, currentSection }: AveryMascotProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentMessage, setCurrentMessage] = useState<AveryMessage>(defaultMessage);
  const [isAnimating, setIsAnimating] = useState(false);
  const [prevMessageId, setPrevMessageId] = useState<string>(defaultMessage.id);

  useEffect(() => {
    const messages = userType === 'host' ? hostMessages :
                     userType === 'traveler' ? travelerMessages :
                     [defaultMessage];

    const newMessage = messages.find(m => m.section === currentSection) ||
                       messages[0] ||
                       defaultMessage;

    if (newMessage.id !== prevMessageId) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentMessage(newMessage);
        setIsAnimating(false);
        setPrevMessageId(newMessage.id);
      }, 200);
    }
  }, [currentSection, userType, prevMessageId]);

  if (!isVisible) {
    return createPortal(
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-16 right-2 sm:bottom-4 sm:right-4 z-[9999] w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 shadow-lg flex items-center justify-center hover:scale-110 transition-all duration-500"
        aria-label="Show Avery"
      >
        <span className="text-white text-2xl">✨</span>
      </button>,
      document.body
    );
  }

  return createPortal(
    <div className="fixed bottom-16 right-2 sm:bottom-4 sm:right-4 z-[9999] flex flex-col items-end gap-2 sm:gap-3 transition-all duration-500">
      {!isMinimized && (
        <div
          className={`max-w-[200px] sm:max-w-xs bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl border border-purple-200 p-2 sm:p-4 transform transition-all duration-300 ${
            isAnimating ? 'opacity-0 translate-y-2 scale-95' : 'opacity-100 translate-y-0 scale-100'
          }`}
        >
          <div className="absolute -bottom-2 right-8 w-4 h-4 bg-white/95 border-r border-b border-purple-200 transform rotate-45" />

          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold text-purple-600 font-orbitron">Avery</span>
            <div className="flex gap-1">
              <button
                onClick={() => setIsMinimized(true)}
                className="text-gray-400 hover:text-gray-600 text-xs"
                aria-label="Minimize"
              >
                −
              </button>
              <button
                onClick={() => setIsVisible(false)}
                className="text-gray-400 hover:text-gray-600 text-xs"
                aria-label="Close"
              >
                ×
              </button>
            </div>
          </div>

          <p className="text-sm text-gray-700 leading-relaxed">{currentMessage.text}</p>
        </div>
      )}

      <div
        className={`relative cursor-pointer transition-transform duration-300 hover:scale-105 ${isMinimized ? 'avery-bounce' : ''}`}
        onClick={() => isMinimized && setIsMinimized(false)}
      >
        <div className="w-20 h-24 sm:w-28 sm:h-36 md:w-32 md:h-40 overflow-visible drop-shadow-xl avery-float">
          <img
            src={averyPng}
            alt="Avery mascot"
            className="w-full h-full object-contain"
            draggable={false}
          />
        </div>

        <div className="absolute top-0 right-0 w-6 h-6 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-white text-xs">✨</span>
        </div>

        {isMinimized && (
          <div className="absolute top-0 left-0 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center shadow-md animate-pulse">
            <span className="text-white text-xs font-bold">!</span>
          </div>
        )}
      </div>

      <style>{`
        @keyframes avery-float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-6px) rotate(0.5deg); }
          66% { transform: translateY(-3px) rotate(-0.5deg); }
        }
        .avery-float { animation: avery-float 4s ease-in-out infinite; }
        @keyframes avery-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .avery-bounce { animation: avery-bounce 2s ease-in-out infinite; }
      `}</style>
    </div>,
    document.body
  );
}
