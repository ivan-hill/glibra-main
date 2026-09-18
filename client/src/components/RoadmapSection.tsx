"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const roadmapPhases = [
  {
    phase: "Phase 1",
    title: "Pilot & Traction",
    items: ["Launch Upstate NY", "Crowdfunding & waitlist", "AI bundles (rentals, cars, dining)"]
  },
  {
    phase: "Phase 2", 
    title: "Platform Expansion",
    items: ["Add partners (Vrbo, DoorDash)", "Launch Glibra for Hosts", "Mobile PWA"]
  },
  {
    phase: "Phase 3",
    title: "Orchestration Growth", 
    items: ["Modular API orchestration", "White-label tools for STR managers", "Dynamic bundle SDK"]
  },
  {
    phase: "Phase 4",
    title: "Ecosystem & Data",
    items: ["Smart pricing engine", "Trend dashboards for hosts", "Verified trust layer"]
  },
  {
    phase: "Phase 5",
    title: "Global Infrastructure",
    items: ["Glibra Cloud for smart cities", "Multi-country rollout", "Shared economy optimization engine"]
  }
];

export default function RoadmapSection() {
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const el = ref.current!;
    
    // Title animation
    gsap.fromTo(
      el.querySelector("[data-title]"),
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: { 
          trigger: el, 
          start: "top 80%", 
          end: "bottom 70%", 
          toggleActions: "play none none reverse" 
        },
      }
    );

    // Phase cards staggered animation
    gsap.fromTo(
      el.querySelectorAll("[data-phase]"),
      { y: 60, opacity: 0, scale: 0.9 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        stagger: 0.15,
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

    // CTA button animation
    gsap.fromTo(
      el.querySelector("[data-cta]"),
      { y: 40, opacity: 0, scale: 0.95 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: "power2.out",
        delay: 1.2,
        scrollTrigger: { 
          trigger: el, 
          start: "top 70%", 
          end: "bottom 60%", 
          toggleActions: "play none none reverse" 
        },
      }
    );
  }, []);
  
  return (
    <section 
      id="roadmap-section" 
      ref={ref} 
      className="min-h-screen flex items-center px-6 py-10 md:py-12 section-container"
      data-testid="roadmap-section"
    >
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-6">
          <h2 
            data-title
            className="section-text text-5xl md:text-7xl xl:text-8xl font-semibold tracking-tight"
            data-testid="roadmap-title"
          >
            Our Path to $1B+
          </h2>
          <p className="body-text text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
            From Upstate New York pilot to global travel intelligence platform
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roadmapPhases.map((phase, index) => (
            <div
              key={index}
              data-phase
              className="bg-gray-100/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 hover:border-gray-300 transition-all duration-300"
              data-testid={`roadmap-phase-${index}`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-sm font-semibold text-primary">
                  {index + 1}
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">{phase.phase}</div>
                  <div className="text-lg font-semibold text-gray-900">{phase.title}</div>
                </div>
              </div>
              <ul className="space-y-2">
                {phase.items.map((item, itemIndex) => (
                  <li 
                    key={itemIndex} 
                    className="text-sm text-gray-600 flex items-start gap-2"
                    data-testid={`roadmap-item-${index}-${itemIndex}`}
                  >
                    <div className="w-1.5 h-1.5 bg-primary/60 rounded-full mt-2 flex-shrink-0"></div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="text-center" data-cta>
          <button 
            className="bg-primary text-primary-foreground px-8 py-4 text-lg font-semibold rounded-lg hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105"
            data-testid="roadmap-cta-button"
          >
            See Full Roadmap
          </button>
        </div>
      </div>
    </section>
  );
}