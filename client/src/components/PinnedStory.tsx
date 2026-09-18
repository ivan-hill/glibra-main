import { useEffect, useRef, useState } from 'react';

interface StoryStep {
  id: string;
  title: string;
  subtitle?: string;
  caption?: string;
}

interface PinnedStoryProps {
  steps?: StoryStep[];
  accent?: string;
}

export default function PinnedStory({ steps, accent = "#00e5d4" }: PinnedStoryProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);

  const defaultSteps: StoryStep[] = [
    { 
      id: "discover", 
      title: "AI Discovery", 
      subtitle: "Smart attraction finding", 
      caption: "Our AI scouts hidden gems and popular destinations based on your interests and travel patterns." 
    },
    { 
      id: "bundle", 
      title: "Bundle Everything", 
      subtitle: "Complete coordination", 
      caption: "From stays to transportation, dining to photography - we handle every aspect of your trip." 
    },
    { 
      id: "protect", 
      title: "Fallback Protection", 
      subtitle: "Continuity guarantee", 
      caption: "When providers cancel, our AI instantly finds and books premium replacements to keep your plans intact." 
    },
    { 
      id: "optimize", 
      title: "Smart Optimization", 
      subtitle: "Best value, best experience", 
      caption: "Our algorithms balance price, quality, and convenience to maximize your travel experience." 
    },
  ];

  const safeSteps = steps ?? defaultSteps;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const cards = Array.from(el.querySelectorAll<HTMLElement>("[data-step]"));
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => Math.abs(0.5 - a.intersectionRatio) - Math.abs(0.5 - b.intersectionRatio));
        
        if (visible[0]) {
          const index = Number(visible[0].target.getAttribute("data-index") || "0");
          setActive(index);
        }
      },
      { threshold: [0.25, 0.5, 0.75] }
    );

    cards.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, []);

  return (
    <section id="story" className="bg-gradient-to-b from-glibra-navy to-[#0D1117] py-20" aria-label="How GLIBRA Works">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">
            How GLIBRA Works
          </h2>
          <p className="text-xl text-glibra-muted max-w-3xl mx-auto">
            Experience the future of travel planning with our AI-powered coordination system
          </p>
        </div>

        <div className="pin-wrap">
          <div className="pin-col">
            <div className="pin-card">
              <div className="pin-sub">{safeSteps[active]?.subtitle}</div>
              <h3 className="pin-title">{safeSteps[active]?.title}</h3>
              <p className="pin-cap">{safeSteps[active]?.caption}</p>
              <div className="pin-dots">
                {safeSteps.map((_, i) => (
                  <span 
                    key={i} 
                    aria-label={`Step ${i + 1}`} 
                    className={`dot ${i === active ? "is-active" : ""}`} 
                  />
                ))}
              </div>
            </div>
          </div>
          
          <div className="pin-steps" ref={containerRef}>
            {safeSteps.map((s, i) => (
              <article 
                key={s.id} 
                data-step 
                data-index={i} 
                className={`step ${i === active ? "is-active" : ""}`}
              >
                <div className="step-kicker">Step {i + 1}</div>
                <h4 className="step-title">{s.title}</h4>
                <p className="step-cap">{s.caption}</p>
              </article>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .pin-wrap {
          position: relative;
          display: grid;
          grid-template-columns: minmax(0, 1fr) 520px;
          gap: 3rem;
          align-items: start;
        }

        .pin-col {
          position: sticky;
          top: 2rem;
          align-self: start;
        }

        .pin-card {
          height: 400px;
          border-radius: 1.5rem;
          border: 1px solid rgba(75, 85, 99, 0.2);
          overflow: hidden;
          position: relative;
          background: radial-gradient(700px 280px at 20% 20%, rgba(0, 229, 212, 0.15), transparent),
                     linear-gradient(135deg, hsl(220, 39%, 11%), #1a202c);
          color: hsl(210, 40%, 98%);
          padding: 2rem;
          backdrop-filter: blur(12px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

        .pin-sub {
          opacity: 0.8;
          font-variant: all-small-caps;
          letter-spacing: 2px;
          font-weight: 500;
          color: hsl(174, 100%, 45%);
          margin-bottom: 0.5rem;
        }

        .pin-title {
          margin: 0.5rem 0 1rem 0;
          font-size: 2.5rem;
          font-weight: 700;
          background: linear-gradient(135deg, hsl(174, 100%, 45%), hsl(180, 100%, 70%));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1.1;
        }

        .pin-cap {
          opacity: 0.9;
          line-height: 1.6;
          font-size: 1.1rem;
        }

        .pin-dots {
          position: absolute;
          left: 2rem;
          bottom: 1.5rem;
          display: flex;
          gap: 0.75rem;
        }

        .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .dot.is-active {
          background: hsl(174, 100%, 45%);
          transform: scale(1.2);
          box-shadow: 0 0 12px rgba(0, 229, 212, 0.4);
        }

        .pin-steps {
          padding: 0.5rem 0 3rem 0;
        }

        .step {
          border: 1px solid rgba(75, 85, 99, 0.2);
          border-radius: 1rem;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(8px);
          transition: all 0.3s ease;
        }

        .step.is-active {
          transform: translateY(-4px);
          box-shadow: 0 16px 40px rgba(0, 229, 212, 0.15);
          border-color: hsl(174, 100%, 45%);
          background: rgba(0, 229, 212, 0.05);
        }

        .step-kicker {
          font-size: 0.8rem;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: hsl(174, 100%, 45%);
          margin-bottom: 0.5rem;
          font-weight: 600;
        }

        .step-title {
          margin: 0 0 0.5rem 0;
          font-size: 1.5rem;
          font-weight: 700;
          color: hsl(210, 40%, 98%);
        }

        .step-cap {
          margin: 0;
          color: hsl(215, 20%, 65%);
          line-height: 1.5;
        }

        @media (max-width: 1024px) {
          .pin-wrap {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          
          .pin-col {
            position: relative;
            top: auto;
          }
          
          .pin-card {
            height: auto;
            min-height: 300px;
          }
        }

        @media (max-width: 640px) {
          .pin-card {
            padding: 1.5rem;
          }
          
          .pin-title {
            font-size: 2rem;
          }
          
          .step {
            padding: 1rem;
          }
        }
      `}</style>
    </section>
  );
}