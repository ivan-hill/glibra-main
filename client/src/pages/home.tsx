import SmoothScroll from "@/components/SmoothScroll";
// import WebGLLayer from "@/components/WebGLLayer";
import CSSWebGLEffect from "@/components/CSSWebGLEffect";
import Pinned from "@/components/Pinned";
import Section from "@/components/Section";
import ImageSection from "@/components/ImageSection";
import TouchGestures from "@/components/TouchGestures";
import MobileNavigation from "@/components/MobileNavigation";
import ClickableScrollIndicators from "@/components/ClickableScrollIndicators";
import RoadmapSection from "@/components/RoadmapSection";
import SectionTransitions from "@/components/SectionTransitions";

export default function Home() {
  return (
    <>
      {/* <WebGLLayer /> */}
      <CSSWebGLEffect />
      <SmoothScroll />
      <TouchGestures />
      <MobileNavigation />
      <ClickableScrollIndicators />
      <SectionTransitions />
      
      {/* Scroll Indicators */}
      <div className="scroll-indicator hidden md:flex">
        <div className="scroll-dot active" data-section="0" data-testid="scroll-dot-0"></div>
        <div className="scroll-dot" data-section="1" data-testid="scroll-dot-1"></div>
        <div className="scroll-dot" data-section="2" data-testid="scroll-dot-2"></div>
        <div className="scroll-dot" data-section="3" data-testid="scroll-dot-3"></div>
        <div className="scroll-dot" data-section="4" data-testid="scroll-dot-4"></div>
        <div className="scroll-dot" data-section="5" data-testid="scroll-dot-5"></div>
        <div className="scroll-dot" data-section="6" data-testid="scroll-dot-6"></div>
        <div className="scroll-dot" data-section="7" data-testid="scroll-dot-7"></div>
        <div className="scroll-dot" data-section="8" data-testid="scroll-dot-8"></div>
        <div className="scroll-dot" data-section="9" data-testid="scroll-dot-9"></div>
        <div className="scroll-dot" data-section="10" data-testid="scroll-dot-10"></div>
        <div className="scroll-dot" data-section="11" data-testid="scroll-dot-11"></div>
      </div>

      <main className="relative z-10">
        <Pinned id="section-1">
          <div className="text-center px-6" data-testid="hero-section">
            <div className="mb-8 scroll-reveal" data-testid="hero-logo">
              <img 
                src="/images/glibra-logo-alt.png" 
                alt="GLIBRA" 
                className="h-24 md:h-28 lg:h-32 mx-auto drop-shadow-lg hover:drop-shadow-xl transition-all duration-300"
                data-testid="brand-logo"
                style={{ filter: 'brightness(1.3) contrast(1.4) saturate(1.1)' }}
              />
            </div>
            <h1 className="hero-text text-6xl md:text-8xl xl:text-9xl mb-6 scroll-reveal scroll-reveal-stagger" style={{"--delay": "0.1s"} as any} data-testid="hero-title">
              Travel, Bundled Intelligently.
            </h1>
            <p className="body-text text-xl md:text-2xl xl:text-3xl text-gray-600 max-w-4xl mx-auto scroll-reveal scroll-reveal-stagger" style={{"--delay": "0.3s"} as any} data-testid="hero-subtitle">
              One trip, four essentials — stays, rides, dining, and photography — all powered by AI. Launching first in Upstate New York.
            </p>
          </div>
        </Pinned>

        <ImageSection
          id="section-2a"
          imageSrc="/images/travel-couple.jpg"
          alt="Frustrated couple with luggage dealing with travel planning stress"
          layout="split"
          imagePosition="right"
          title="Travel shouldn't feel this hard"
          caption="Hosts cancel. Cars get double-booked. Dinner reservations vanish. Planning a trip across multiple apps leads to stress, wasted time, and missed moments."
        />

        <Section
          id="section-2"
          title="AI that plans — and protects — your trip"
          lines={[
            "Glibra bundles your stay, ride, dining, and photography into one seamless flow.",
            "Our Trust Engine monitors every booking and rebooks automatically when plans change.",
            "So your trip never falls apart.",
          ]}
        />

        <ImageSection
          id="section-2c"
          imageSrc="/images/backpack.jpg"
          alt="Adventure backpack with mountain landscape representing travel preparation"
          layout="center"
          title="Pack for the adventure"
          caption="Every great trip starts with the right preparation. We help you pack the experiences that matter most for your journey."
        />

        <ImageSection
          id="section-2b"
          imageSrc="/images/sailboat.webp"
          alt="Sailboat on calm water representing smooth travel navigation"
          layout="full"
          title="Navigate with confidence"
          caption="Like skilled sailors charting unknown waters, we guide you to discover new destinations with confidence and ease."
        />

        <Pinned id="section-3">
          <div className="max-w-6xl mx-auto text-center px-6" data-testid="timeline-section">
            <h2 className="section-text text-5xl md:text-7xl xl:text-8xl font-semibold mb-8 scroll-reveal" data-testid="timeline-title">
              Every trip tells a story
            </h2>
            <p className="body-text text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto scroll-reveal scroll-reveal-stagger" style={{"--delay": "0.2s"} as any} data-testid="timeline-subtitle">
              Watch your adventure unfold as we coordinate every detail behind the scenes.
            </p>
          </div>
        </Pinned>

        <ImageSection
          id="section-3a"
          imageSrc="/images/clocktower.webp"
          alt="Historic clock tower symbolizing perfect timing in travel"
          layout="center"
          title="Perfect timing, every time"
          caption="Great trips are about being in the right place at the right time. Our AI ensures your schedule flows seamlessly from arrival to departure."
        />

        <Section
          id="section-4"
          title="Every detail, intelligently coordinated"
          lines={[
            "From finding the perfect rental to booking dinner reservations that complement your stay.",
            "Each element is carefully selected and coordinated for maximum enjoyment.",
            "We don't just book trips—we orchestrate experiences.",
          ]}
        />

        <ImageSection
          id="section-4a"
          imageSrc="/images/cityscape.webp"
          alt="Urban cityscape representing travel destinations and smart cities"
          layout="split"
          imagePosition="left"
          title="Exploring tomorrow's cities"
          caption="From bustling urban centers to hidden gems, we help you discover destinations that inspire and connect you with local culture."
        />

        <ImageSection
          id="section-4b"
          imageSrc="/images/mercedes.webp"
          alt="Premium Mercedes vehicle representing quality transportation"
          layout="center"
          title="Travel in style"
          caption="From premium vehicles to luxury accommodations, every element of your trip is carefully curated for comfort and elegance."
        />

        <ImageSection
          id="section-4c"
          imageSrc="/images/ai-business.jpg"
          alt="Businessman interacting with AI technology and digital interfaces"
          layout="split"
          imagePosition="right"
          title="AI that plans — and protects — your trip"
          caption="Glibra bundles your stay, ride, dining, and photography into one seamless flow. Our Trust Engine monitors every booking and rebooks automatically when plans change."
        />

        <RoadmapSection />

        <ImageSection
          id="section-5a"
          imageSrc="/images/travel-couple.jpg"
          alt="Happy couple enjoying their perfectly planned vacation"
          layout="split"
          imagePosition="left"
          title="Travel together, stress-free"
          caption="When everything is perfectly coordinated, you can focus on what matters most—creating unforgettable memories with the people you love."
        />

        <ImageSection
          id="section-5a2"
          imageSrc="/images/food.webp"
          alt="Delicious meal representing curated dining experiences"
          layout="split"
          imagePosition="right"
          title="Savor every moment"
          caption="From hidden local gems to Michelin-starred restaurants, we curate dining experiences that create lasting memories and connect you with local culture."
        />

        <ImageSection
          id="section-5b"
          imageSrc="/images/accordion.webp"
          alt="Street musician playing accordion representing authentic local culture"
          layout="split"
          imagePosition="left"
          title="Discover authentic culture"
          caption="Like stumbling upon a street musician in a foreign city, the best travel moments are unplanned discoveries that connect you with local soul."
        />

        <Section
          id="section-5"
          title="Be first in line"
          lines={[
            "Join the waitlist for early access and launch-week perks across Upstate New York.",
          ]}
          showCTA={true}
        />

        <ImageSection
          id="section-5c"
          imageSrc="/images/icecream.webp"
          alt="Person enjoying ice cream representing travel's simple pleasures"
          layout="center"
          title="Life's sweetest moments"
          caption="The best travel memories aren't always the grand destinations—they're the simple pleasures like gelato on a warm afternoon in a new city."
        />
      </main>
    </>
  );
}
