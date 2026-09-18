import { useEffect, useState } from 'react';
import { Menu, X, ChevronUp } from 'lucide-react';

interface NavigationProps {
  progress: number;
}

const sections = [
  { id: 'hero', label: 'Home' },
  { id: 'problem', label: 'The Problem' },
  { id: 'story', label: 'Our Story' },
  { id: 'solution', label: 'AI Solution' },
  { id: 'planning', label: 'Smart Planning' },
  { id: 'discovery', label: 'Discovery' },
  { id: 'navigation', label: 'Local Guide' },
  { id: 'experiences', label: 'Local Flavor' },
  { id: 'mobile', label: 'Mobile App' },
  { id: 'memories', label: 'Shared Trips' },
  { id: 'cta', label: 'Get Started' }
];

export default function Navigation({ progress }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > window.innerHeight);
      
      // Find active section
      const sectionElements = sections.map(s => document.querySelector(`[data-section="${s.id}"]`));
      const currentSection = sectionElements.find((el, i) => {
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        return rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2;
      });
      
      if (currentSection) {
        const sectionId = currentSection.getAttribute('data-section');
        if (sectionId) setActiveSection(sectionId);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.querySelector(`[data-section="${sectionId}"]`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-black/10 z-[100]">
        <div 
          className="h-full bg-blue-600 transition-all duration-300"
          style={{ width: `${progress * 100}%` }}
          data-testid="scroll-progress"
        />
      </div>

      {/* Floating Navigation */}
      <nav className="fixed top-4 right-4 z-50" data-testid="main-navigation">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white/90 transition-all duration-200 border border-gray-200/50"
          data-testid="nav-toggle"
          aria-label="Toggle navigation menu"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Navigation Menu */}
        {isOpen && (
          <div className="absolute top-full right-0 mt-2 w-64 bg-white/95 backdrop-blur-sm rounded-lg shadow-xl border border-gray-200/50 py-2 max-h-80 overflow-y-auto">
            {sections.map((section, index) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`w-full text-left px-4 py-2 hover:bg-gray-100/80 transition-colors duration-150 flex items-center justify-between ${
                  activeSection === section.id ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
                }`}
                data-testid={`nav-link-${section.id}`}
              >
                <span>{section.label}</span>
                {activeSection === section.id && (
                  <div className="w-2 h-2 bg-blue-600 rounded-full" />
                )}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 z-40"
          data-testid="back-to-top"
          aria-label="Back to top"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}
    </>
  );
}