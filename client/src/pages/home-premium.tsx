"use client";
import { useEffect, useRef, useState } from 'react';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import WebGLBackground from '@/components/WebGLBackground';
import SplitText from '@/components/SplitText';
import ScrollReveal from '@/components/ScrollReveal';
import DynamicBackground from '@/components/DynamicBackground';
import CursorLight from '@/components/ui/CursorLight';
import { reveal, pinSection, mountPageProgress } from '@/lib/scroll';
import GridGallery from '@/components/GridGallery';
import ScalingImage from '@/components/ScalingImage';
import InteractiveImage from '@/components/InteractiveImage';
import ScrollHint from '@/components/ScrollHint';
import InteractionHint from '@/components/InteractionHint';
import Navigation from '@/components/Navigation';
import cubeGuyImage from '../assets/cube_guy_1756634800579.jpg';
import windowWriteImage from '../assets/window_write_1756634800580.jpg';
import beachWomanImage from '../assets/beach_woman_1756634800574.jpg';
import locatorImage from '../assets/locator_1756634800576.jpg';
import abillionImage from '../assets/abillion_1756634800577.jpg';
import asianPhoneImage from '../assets/asian_phone_1756634800575.jpg';
import backpackImage from '../assets/backpack_1756585841856.jpg';
import businessmanAiImage from '../assets/businessman-interacting-with-ai_1756585841857.jpg';
import coupleVacationImage from '../assets/couple-going-on-vacation-2025-04-11-01-21-51-utc_1756585841858.jpg';
import logoImage from '../assets/fulllogo_transparent_1756586676931.png';
import musicManImage from '@assets/music-man.webp';
import blkMbSuvImage from '@assets/blk-mb-suv.webp';
import cityscapeImage from '@assets/cityscape.webp';
import clocktowerImage from '@assets/clocktower.webp';
import dessertGuyImage from '@assets/dessert-guy.webp';
import healthyFoodImage from '@assets/healthy-food.webp';
import sailboatImage from '@assets/sailboat.webp';
import yellowHouseImage from '@assets/yellow-house.webp';

export default function HomePremium() {
  const rootRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Add dynamic theme class to body
    document.body.classList.add('dynamic-theme');
    
    // Check if mobile for optimized settings
    setIsMobile(window.matchMedia('(max-width: 768px)').matches);
    
    const lenis = new Lenis({
      duration: isMobile ? 1.0 : 1.2, // Slower on mobile for better control
      easing: isMobile 
        ? (t) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2 // Native iOS-like easing
        : (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: !isMobile, // Disable smooth wheel on mobile
      wheelMultiplier: isMobile ? 0.8 : 1,
      touchMultiplier: isMobile ? 1.2 : 2, // Less sensitive touch for better control
      syncTouch: isMobile, // Sync touch for native feel
      gestureOrientation: isMobile ? "both" : "vertical", // Allow natural gestures
      infinite: false,
    });
    
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    
    requestAnimationFrame(raf);

    // Set up pinned section if exists
    if (pinRef.current) {
      pinSection(pinRef.current);
      const steps = pinRef.current.querySelectorAll('.pin-step');
      const tl = gsap.timeline({
        scrollTrigger: { trigger: pinRef.current, start: 'top top', end: '+=200%', scrub: 0.6 }
      });
      // Set all steps to invisible first
      tl.set(steps, { autoAlpha: 0 });
      
      steps.forEach((el, i) => {
        const startTime = i * 0.33; // Each step gets 33% of the timeline
        const endTime = startTime + 0.25; // Visible for 25% of timeline
        
        tl.to(el, { autoAlpha: 1, duration: 0.1 }, startTime)
          .to(el, { autoAlpha: 0, duration: 0.1 }, endTime);
      });
    }

    // Set up page progress tracking
    if (rootRef.current) mountPageProgress(rootRef.current, setProgress);
    
    return () => {
      document.body.classList.remove('dynamic-theme');
      lenis.destroy();
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);
  
  return (
    <main ref={rootRef} className="relative">
      <CursorLight />
      <Navigation progress={progress} />
      {/* Subtle gradient background based on scroll progress */}
      {!isMobile && (
        <div 
          className="pointer-events-none fixed inset-0 -z-10 transition-all duration-1000"
          style={{
            background: `linear-gradient(135deg, 
              hsl(${220 + progress * 60}, 15%, ${5 + progress * 10}%), 
              hsl(${240 + progress * 40}, 25%, ${2 + progress * 8}%))`
          }}
        />
      )}
      <WebGLBackground />
      <DynamicBackground />
      
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-[120vh] flex items-center justify-center" data-section="hero">
          <div className="text-center px-6" data-testid="hero-section">
            <ScrollReveal delay={0.2} direction="fade">
              <div className="mb-8" data-testid="hero-logo">
                <img 
                  src={logoImage} 
                  alt="GLIBRA" 
                  className="h-24 md:h-28 lg:h-32 mx-auto drop-shadow-lg hover:drop-shadow-xl transition-all duration-300"
                  data-testid="brand-logo"
                />
              </div>
            </ScrollReveal>
            
            <h1>
              <SplitText 
                text="Travel, Bundled Intelligently."
                className="text-fluid-hero font-brand font-bold text-gray-900 mb-6 tracking-tightest"
                splitBy="words"
                stagger={0.2}
                data-testid="hero-title"
              />
            </h1>
            
            <ScrollReveal delay={1.0}>
              <p className="text-fluid-sub text-gray-600 max-w-3xl mx-auto" data-testid="hero-subtitle">
                Find a hidden gem. We automatically coordinate nearby accommodation, transportation, dining, and photography. Launching first in Upstate New York.
              </p>
            </ScrollReveal>
            
            <ScrollReveal delay={1.4} direction="fade">
              <div className="flex flex-col gap-4 justify-center items-center mt-12">
                <a 
                  href="/#service-selection"
                  className="btn-gradient px-10 md:px-14 py-5 md:py-6 text-xl md:text-2xl font-bold rounded-2xl transform hover:scale-105 active:scale-95 shadow-xl hover:shadow-2xl min-h-[56px] min-w-[220px] flex items-center justify-center"
                  data-testid="primary-cta-waitlist"
                >
                  List Your Service
                </a>
                <p className="text-sm text-gray-500 mt-2 mb-2">or</p>
                <a 
                  href="/pricing"
                  className="text-cyan-600 hover:text-cyan-700 underline underline-offset-4 text-lg font-medium transition-colors duration-200"
                  data-testid="secondary-cta-explore"
                >
                  View Host Plans →
                </a>
              </div>
            </ScrollReveal>
          </div>
          
          <ScrollHint type="arrow" position="bottom-center" />
        </section>

        {/* Problem Section - Image Left */}
        <section className="min-h-[150vh] flex items-center" data-section="problem">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-7xl mx-auto px-6">
            <ScrollReveal delay={0.4} direction="right">
              <InteractionHint type="zoom" trigger="scroll">
                <InteractiveImage
                  src={clocktowerImage}
                  alt="Historic clocktower attraction in Upstate NY waiting to be discovered"
                  className="rounded-lg h-[70vh]"
                  zoomIntensity={0.4}
                  panDirection="horizontal"
                />
              </InteractionHint>
            </ScrollReveal>
            <div className="space-y-6">
              <h2>
                <SplitText 
                  text="You find the perfect spot, then spend hours planning around it"
                  className="text-fluid-h1 font-brand font-bold text-gray-900"
                  splitBy="words"
                  stagger={0.2}
                />
              </h2>
              <ScrollReveal delay={0.6}>
                <p className="text-xl md:text-2xl text-gray-600">
                  You discover an amazing attraction in Upstate NY, but then you're stuck researching accommodations, transportation, restaurants, and photographers. By the time you book everything, the magic is gone.
                </p>
              </ScrollReveal>
            </div>
          </div>
          
          <ScrollHint type="scroll" position="bottom-right" />
        </section>

        {/* Pinned Storytelling Section */}
        <section ref={pinRef} className="relative min-h-[300vh]" data-section="story">
          <div className="sticky top-0 h-screen flex items-center bg-gradient-to-br from-slate-900 to-black">
            <div className="mx-auto w-full max-w-5xl px-6">
              <div className="relative min-h-[50vh]">
                <p className="pin-step absolute inset-0 m-0 text-4xl md:text-6xl font-medium tracking-tightest opacity-0 text-white">
                  You spot a hidden waterfall in Upstate NY.
                </p>
                <p className="pin-step absolute inset-0 m-0 text-4xl md:text-6xl font-medium tracking-tightest opacity-0 text-white">
                  Glibra finds a nearby cabin, car rental, and local restaurant.
                </p>
                <p className="pin-step absolute inset-0 m-0 text-4xl md:text-6xl font-medium tracking-tightest opacity-0 text-white">
                  Plus a photographer to capture the moment.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Smooth transition from dark storytelling */}
        <div className="h-[20vh] bg-gradient-to-b from-slate-900 to-white" aria-hidden />

        {/* Solution Section - AI Benefits */}
        <section className="min-h-[120vh] flex items-center bg-white" data-section="solution">
          <div className="max-w-5xl mx-auto px-6 text-center space-y-12">
            <h2>
              <SplitText 
                text="What if it all happened automatically?"
                className="text-fluid-h1 font-brand font-bold tracking-tight text-gray-900"
                splitBy="words"
                stagger={0.2}
              />
            </h2>
            
            <ScrollReveal delay={0.4}>
              <InteractionHint type="zoom" trigger="scroll">
                <InteractiveImage
                  src={businessmanAiImage}
                  alt="Professional using AI technology for intelligent travel planning"
                  className="rounded-lg h-[50vh] mx-auto max-w-md"
                  zoomIntensity={0.4}
                  panDirection="horizontal"
                />
              </InteractionHint>
            </ScrollReveal>
            
            <ScrollReveal delay={0.6}>
              <div className="max-w-3xl mx-auto">
                <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
                  Glibra finds your accommodation, books your car rental from Turo or Zipcar, selects a local restaurant, and connects you with a photographer. If anything gets cancelled, we automatically find a replacement.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Planning Section - Image Right */}
        <section className="min-h-[120vh] flex items-center bg-white" data-section="planning">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-7xl mx-auto px-6">
            <div className="space-y-6">
              <h2>
                <SplitText 
                  text="Everything coordinates around your attraction"
                  className="text-fluid-h2 font-brand font-bold text-gray-900"
                  splitBy="words"
                  stagger={0.2}
                />
              </h2>
              <ScrollReveal delay={0.6}>
                <p className="text-fluid-body text-gray-600">
                  You choose the attraction. Glibra automatically finds nearby accommodations, transportation, dining, and photography. All within easy reach of each other.
                </p>
              </ScrollReveal>
            </div>
            <ScrollReveal delay={0.3} direction="left">
              <InteractionHint type="pan" trigger="scroll">
                <InteractiveImage
                  src={yellowHouseImage}
                  alt="Charming short-term rental property perfectly positioned near local attractions"
                  className="rounded-lg h-[60vh]"
                  zoomIntensity={0.3}
                  panDirection="diagonal"
                />
              </InteractionHint>
            </ScrollReveal>
          </div>
        </section>

        {/* Discovery Section - Grid Gallery */}
        <section className="py-20 bg-gray-50 relative z-10" data-section="discovery">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16 space-y-8">
              <h2 className="space-y-4">
                <SplitText 
                  text="Discover"
                  className="text-fluid-hero font-brand font-bold text-gray-900 block"
                  splitBy="words"
                  stagger={0.2}
                />
                <SplitText 
                  text="your perfect moment"
                  className="text-fluid-h1 font-brand font-bold text-gray-600 block"
                  splitBy="words"
                  stagger={0.2}
                />
              </h2>
              <ScrollReveal delay={0.8}>
                <p className="text-fluid-body text-gray-500 max-w-2xl mx-auto leading-relaxed">
                  Upstate NY's hidden gems, perfectly coordinated.
                </p>
              </ScrollReveal>
            </div>
            
            <ScrollReveal delay={0.2}>
              <GridGallery
                images={[
                  { src: musicManImage, alt: "Person enjoying music and entertainment", size: "large", position: "center" },
                  { src: cityscapeImage, alt: "Urban cityscape destination", size: "medium", position: "top" },
                  { src: dessertGuyImage, alt: "Person enjoying local desserts", size: "small", position: "center" },
                  { src: sailboatImage, alt: "Sailing adventure experience", size: "medium", position: "center" },
                  { src: beachWomanImage, alt: "Woman enjoying peaceful moment by the ocean", size: "small", position: "bottom" },
                  { src: healthyFoodImage, alt: "Healthy travel dining options", size: "small", position: "top" },
                  { src: backpackImage, alt: "Travel backpack representing adventure", size: "medium", position: "center" },
                  { src: coupleVacationImage, alt: "Happy couple enjoying vacation and creating memories", size: "large", position: "center" },
                  { src: yellowHouseImage, alt: "Charming travel accommodation", size: "small", position: "center" },
                  { src: clocktowerImage, alt: "Historic clocktower landmark", size: "medium", position: "bottom" },
                  { src: abillionImage, alt: "Restaurant and dining experiences", size: "small", position: "top" },
                  { src: businessmanAiImage, alt: "Professional using AI technology for travel", size: "medium", position: "center" }
                ]}
                className="mb-8"
                data-testid="discovery-gallery"
              />
            </ScrollReveal>
          </div>
        </section>

        {/* Navigation Section - Image Left */}
        <section className="min-h-[100vh] flex items-center bg-white" data-section="navigation">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-7xl mx-auto px-6">
            <ScrollReveal delay={0.3} direction="right">
              <InteractionHint type="zoom" trigger="scroll">
                <InteractiveImage
                  src={locatorImage}
                  alt="Person using location and navigation app to explore new destinations"
                  className="rounded-lg h-[60vh]"
                  zoomIntensity={0.5}
                  panDirection="vertical"
                />
              </InteractionHint>
            </ScrollReveal>
            <div className="space-y-6">
              <h2>
                <SplitText 
                  text="Everything's walkable"
                  className="text-fluid-h2 font-brand font-bold text-gray-900"
                  splitBy="words"
                  stagger={0.2}
                />
              </h2>
              <ScrollReveal delay={0.6}>
                <p className="text-fluid-body text-gray-600">
                  Your accommodation, the attraction, restaurant, and photographer are all within walking distance. No driving between activities.
                </p>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Local Experiences Section - Image Right */}
        <section className="min-h-[100vh] flex items-center bg-gray-50" data-section="experiences">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-7xl mx-auto px-6">
            <div className="space-y-6">
              <h2>
                <SplitText 
                  text="Local restaurants, automatically selected"
                  className="text-fluid-h2 font-brand font-bold text-gray-900"
                  splitBy="words"
                  stagger={0.2}
                />
              </h2>
              <ScrollReveal delay={0.6}>
                <p className="text-fluid-body text-gray-600">
                  Glibra picks authentic local restaurants near your accommodation and activities. No research needed.
                </p>
              </ScrollReveal>
            </div>
            <ScrollReveal delay={0.4} direction="left">
              <InteractionHint type="zoom" trigger="scroll">
                <InteractiveImage
                  src={abillionImage}
                  alt="Person using restaurant discovery app while enjoying local cuisine"
                  className="rounded-lg h-[60vh]"
                  zoomIntensity={0.3}
                  panDirection="vertical"
                />
              </InteractionHint>
            </ScrollReveal>
          </div>
        </section>

        {/* Mobile & Technology Section - Combined */}
        <section className="min-h-[150vh] flex items-center bg-gray-50" data-section="mobile">
          <div className="grid md:grid-cols-2 gap-16 items-center max-w-7xl mx-auto px-6">
            <div className="space-y-8">
              <h2>
                <SplitText 
                  text="Everything in one app"
                  className="text-fluid-h1 font-brand font-bold text-gray-900"
                  splitBy="words"
                  stagger={0.15}
                />
              </h2>
              <ScrollReveal delay={0.6}>
                <p className="text-fluid-body text-gray-600 leading-relaxed">
                  View your rental, transportation, restaurant reservations, and photographer details. If anything gets cancelled, Glibra automatically finds a replacement.
                </p>
              </ScrollReveal>
              <ScrollReveal delay={0.8}>
                <div className="mt-8">
                  <img 
                    src="@assets/D7028ECF-7CA7-452E-8E58-85EAA5278213_1756669273117.png"
                    alt="Rebooking notification showing automatic replacement when cancellations occur"
                    className="rounded-lg max-w-sm mx-auto shadow-lg"
                  />
                </div>
              </ScrollReveal>
              <ScrollReveal delay={1.0} direction="fade">
                <a 
                  href="/#service-selection"
                  className="inline-block btn-gradient px-6 py-3 text-lg font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                  data-testid="section-cta-mobile"
                >
                  List Your Service
                </a>
              </ScrollReveal>
            </div>
            <ScrollReveal delay={0.4}>
              <div className="space-y-8">
                <InteractionHint type="zoom" trigger="scroll">
                  <InteractiveImage
                    src={asianPhoneImage}
                    alt="Person using mobile travel app for booking and planning"
                    className="rounded-lg h-[50vh] mx-auto max-w-xs"
                    zoomIntensity={0.3}
                    panDirection="horizontal"
                  />
                </InteractionHint>
                <InteractionHint type="pan" trigger="scroll">
                  <InteractiveImage
                    src={blkMbSuvImage}
                    alt="Luxury transportation coordinated seamlessly with your rental and activities"
                    className="rounded-lg h-[40vh] mx-auto max-w-sm"
                    zoomIntensity={0.3}
                    panDirection="horizontal"
                  />
                </InteractionHint>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Shared Experiences Section with Social Proof */}
        <section className="py-20 bg-white" data-section="memories">
          <div className="max-w-7xl mx-auto px-6">
            {/* Social Proof */}
            <div className="text-center mb-16">
              <ScrollReveal delay={0.2}>
                <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-8">
                  Trusted by Early Travelers
                </p>
              </ScrollReveal>
              <ScrollReveal delay={0.4}>
                <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16 mb-16">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900 mb-2">1,200+</div>
                    <div className="text-gray-600">Early Access Users</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900 mb-2">98%</div>
                    <div className="text-gray-600">Satisfaction Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900 mb-2">$2M+</div>
                    <div className="text-gray-600">Travel Booked</div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
            
            {/* Main Content */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2>
                  <SplitText 
                    text="Perfect for couples and groups"
                    className="text-fluid-h2 font-brand font-bold text-gray-900"
                    splitBy="words"
                    stagger={0.2}
                  />
                </h2>
                <ScrollReveal delay={0.6}>
                  <p className="text-fluid-body text-gray-600">
                    When everything's walkable, group travel becomes effortless. No one gets left behind.
                  </p>
                </ScrollReveal>
              </div>
              <ScrollReveal delay={0.4} direction="left">
                <InteractionHint type="zoom" trigger="scroll">
                  <InteractiveImage
                    src={coupleVacationImage}
                    alt="Happy couple enjoying vacation and creating shared memories"
                    className="rounded-lg h-[60vh]"
                    zoomIntensity={0.4}
                    panDirection="horizontal"
                  />
                </InteractionHint>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="min-h-[120vh] flex items-center justify-center" data-section="cta">
          <div className="text-center px-6 space-y-12">
            <h2>
              <SplitText 
                text="Ready to travel smarter?"
                className="text-fluid-h1 font-brand font-bold text-gray-900"
                splitBy="words"
                stagger={0.2}
              />
            </h2>
            <ScrollReveal delay={0.8}>
              <p className="text-fluid-body text-gray-600 max-w-2xl mx-auto">
                Start with a hidden gem. Let us handle the rest.
              </p>
            </ScrollReveal>
            
            {/* Clear CTA Hierarchy */}
            <ScrollReveal delay={1.0} direction="fade">
              <div className="space-y-6">
                <div className="text-center">
                  <a 
                    href="/#service-selection"
                    className="inline-block btn-gradient px-12 py-6 text-2xl font-bold rounded-2xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-xl hover:shadow-2xl"
                    data-testid="primary-cta-final"
                  >
                    List Your Service
                  </a>
                  <p className="text-sm text-gray-500 mt-3">
                    Join our network of trusted service providers
                  </p>
                </div>
                
                <div className="flex items-center justify-center">
                  <div className="w-16 h-px bg-gray-300"></div>
                  <span className="px-4 text-gray-500 text-sm">or</span>
                  <div className="w-16 h-px bg-gray-300"></div>
                </div>
                
                <div className="text-center">
                  <a 
                    href="/pricing"
                    className="inline-block text-cyan-600 hover:text-cyan-700 text-lg font-semibold underline underline-offset-4 transition-colors duration-200"
                    data-testid="secondary-cta-final"
                  >
                    View Host Plans →
                  </a>
                  <p className="text-sm text-gray-500 mt-2">
                    Affordable plans for every service provider
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </div>
    </main>
  );
}